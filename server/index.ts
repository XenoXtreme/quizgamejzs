import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
import cors, { CorsOptions } from "cors";
import { MongoClient, Db } from "mongodb";
import { AuthService } from "./lib/auth/auth";
import {
  authenticateToken,
  authorizeRoles,
} from "./middlewares/auth.middleware";
import { decode } from "punycode";

const app: Express = express();
const server = createServer(app);
const port: string | number = process.env.PORT || 3001;

// MongoDB setup
let db: Db;
let mongoClient: MongoClient;
let authService: AuthService = null as any;

// CORS OPTION
const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.includes("localhost") ||
      origin.includes("192.168") ||
      origin.includes("" + process.env.DEVELOPMENT_URI) ||
      origin.includes("" + process.env.FRONTEND_URI)
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Origin",
  ],
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db("quizdom");
    authService = new AuthService(db);

    // Create index for refresh tokens
    await db
      .collection("RefreshTokens")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Cleanup expired tokens periodically (every hour)
    setInterval(() => {
      authService.cleanupExpiredTokens();
    }, 60 * 60 * 1000);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// APP MIDDLEWARE
app.use(cors(corsOption));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// EJS SETUP
app.set("view engine", "ejs");

// SOCKET SETUP - Now with simpler session-based auth
let mainComputerId: string = "";

const io: Server = new Server(server, {
  cors: corsOption,
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
  path: "/socket.io/",
  allowEIO3: true,
  connectTimeout: 45000,
  allowUpgrades: true,
  perMessageDeflate: false,
  httpCompression: false,
});

io.engine.generateId = (req) => {
  return uuidv4();
};

io.engine.on("connection_error", (err) => {
  console.error("Socket connection error:", err);
});

// Simplified Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  if (!authService) {
    return next(new Error("Server not ready"));
  }

  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication token required"));
  }

  const decoded = authService.verifyToken(token as string);

  if (!decoded) {
    return next(new Error("Invalid or expired token"));
  }

  // Attach user data to socket
  socket.data.user = decoded;
  console.log(decoded);
  next();
});

io.on("connection", (socket) => {
  const user = socket.data.user;
  console.log(
    `✅ New client connected. Socket ID: ${socket.id}, Team: ${user.team}`
  );

  socket.on("identifyMainComputer", async () => {
    if (user.role !== "ADMIN" && user.role !== "ORGANIZER") {
      socket.emit("error", "Only admins can be the main computer");
      return;
    }

    if (mainComputerId && mainComputerId !== socket.id) {
      socket.emit(
        "mainComputerAlreadyExists",
        "A main computer is already connected."
      );
      return;
    }
    mainComputerId = socket.id;
    console.log("Main computer identified:", socket.id);
    io.emit("mainComLoginComp", "Login");
  });

  socket.on("disconnect", () => {
    if (socket.id === mainComputerId) {
      console.log("💻 Main computer disconnected:", socket.id);
      mainComputerId = "";
      io.emit("mainComputerDisconnected");
    }
    console.log(`Socket ${socket.id} disconnected.`);
  });

  socket.on(
    "pressBuzzer",
    async (data: { teamId: string; teamName: string }) => {
      console.log("Buzzer pressed:", data, "by team:", user.team);
      try {
        if (!mainComputerId) {
          socket.emit("error", "Main computer not connected");
          return;
        }

        if (user.id !== data.teamId) {
          socket.emit("error", "You can only press your own buzzer");
          return;
        }

        io.to(mainComputerId).emit("buzzerPressed", {
          teamId: data.teamId,
          teamName: data.teamName,
          pressedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error handling buzzer press:", error);
        socket.emit("error", "Failed to process buzzer press");
      }
    }
  );

  socket.on("resetBuzzer", async () => {
    if (socket.id !== mainComputerId && user.role !== "ADMIN") {
      socket.emit("error", "Only the main computer can reset the buzzer");
      return;
    }
    try {
      io.emit("buzzerReset");
    } catch (error) {
      console.error("Error resetting buzzer:", error);
    }
  });
});

// API ROUTES
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Accessed Quizdom Server</h1>");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: db ? "connected" : "disconnected",
  });
});

// Public routes
app.post("/api/auth/create", async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty",
        hint: "Make sure Content-Type is application/json",
      });
    }

    const { team, category, password, school, members, role } = req.body;

    if (!team || !password || !school || !members) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["team", "password", "school", "members"],
        received: {
          team: !!team,
          password: !!password,
          school: !!school,
          members: !!members,
        },
      });
    }

    const result = await authService.registerTeam(
      team,
      category,
      password,
      school,
      members,
      role
    );

    if ("error" in result) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (e) {
    console.error("Error creating team:", e);
    res.status(500).json({
      error: "Internal server error",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty",
        hint: "Make sure Content-Type is application/json",
      });
    }

    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        error: "Missing id or password",
        received: { id: !!id, password: !!password },
      });
    }

    const result = await authService.verifyTeam(id, password);

    if ("error" in result) {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({
      error: "Internal server error",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

// Token refresh endpoint
app.post("/api/auth/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: "Refresh token required",
        code: "NO_REFRESH_TOKEN",
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if ("error" in result) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (e) {
    console.error("Error refreshing token:", e);
    res.status(500).json({
      error: "Internal server error",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

// Logout endpoint
app.post(
  "/api/auth/logout",
  authenticateToken(authService),
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const userId = req.user!.id;

      await authService.revokeRefreshToken(userId, refreshToken);

      res.json({ success: true, message: "Logged out successfully" });
    } catch (e) {
      console.error("Error during logout:", e);
      res.status(500).json({
        error: "Internal server error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }
);

// Protected routes
app.post(
  "/api/auth/team",
  authenticateToken(authService),
  async (req: Request, res: Response) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          error: "Request body is empty",
          hint: "Make sure Content-Type is application/json",
        });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing team id" });
      }

      if (req.user!.id !== id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const result = await authService.getTeamData(id);

      if ("error" in result) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (e) {
      console.error("Error fetching team data:", e);
      res.status(500).json({
        error: "Internal server error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }
);

// Admin only route
app.get(
  "/api/teams",
  authenticateToken(authService),
  authorizeRoles("ADMIN", "ORGANIZER"),
  async (req: Request, res: Response) => {
    try {
      const result = await authService.getAllTeam();

      if ("error" in result) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (e) {
      console.error("Error fetching teams:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Verify token endpoint
app.get(
  "/api/auth/verify",
  authenticateToken(authService),
  (req: Request, res: Response) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down gracefully...");

  io.close(() => {
    console.log("Socket.IO closed");
  });

  if (mongoClient) {
    await mongoClient.close();
    console.log("MongoDB connection closed");
  }

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start server
async function startServer() {
  await connectToDatabase();

  server.listen(port, () => {
    console.log(`✅ App is listening on *:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
