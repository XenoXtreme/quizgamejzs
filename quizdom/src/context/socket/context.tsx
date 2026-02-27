"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuthContext } from "../auth/state";
import { ContextType } from "@/context/auth/context";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  reconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const context = useAuthContext() as ContextType;
  const { token } = context;

  const getAuthToken = (): string | null => {
    if (token && token.length > 0) {
      console.log("📌 Using access token from context");
      return token;
    }
    const stored = localStorage.getItem("_global_token");
    if (stored) {
      console.log("📌 Using access token from localStorage");
    }
    return stored;
  };

  const connectSocket = () => {
    if (typeof window === "undefined") return;

    const accessToken = getAuthToken();

    if (!accessToken) {
      console.warn("❌ No access token found. Socket connection skipped.");
      toast.error("Please login to connect", { duration: 2000 });
      return;
    }

    console.log("🔗 Attempting socket connection with valid access token");

    const serverUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URI ||
      "https://quizdom-553x.onrender.com";

    const socketInstance: Socket = io(serverUrl, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      withCredentials: true,
      path: "/socket.io/",
      autoConnect: true,
    });

    socketRef.current = socketInstance;

    const timer = setTimeout(() => {
      setSocket(socketInstance);
    }, 0);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
      toast.success("Connected to server", { duration: 800 });
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      setIsConnected(false);

      if (
        err.message.includes("Authentication") ||
        err.message.includes("token") ||
        err.message.includes("Invalid") ||
        err.message.includes("expired")
      ) {
        console.log("🔄 Token may be expired, attempting refresh...");
        toast.error("Authentication failed. Refreshing token...", {
          duration: 3000,
        });
        context.refreshToken().then((newToken) => {
          if (newToken) {
            console.log("✅ Token refreshed, reconnecting socket");
            reconnect();
          } else {
            console.error("❌ Token refresh failed");
            toast.error("Please login again", { duration: 2000 });
          }
        });
      } else {
        toast.error(`Connection error: ${err.message}`, { duration: 2000 });
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);

      if (reason === "io server disconnect") {
        toast.error("Disconnected by server", { duration: 2000 });
      } else if (reason === "io client disconnect") {
        toast.info("Disconnected", { duration: 800 });
      } else {
        toast.error(`Disconnected: ${reason}`, { duration: 800 });
      }
    });

    socketInstance.on("error", (error: string) => {
      console.error("❌ Socket error:", error);
      toast.error(error, { duration: 2000 });
    });

    socketInstance.on("mainComputerAlreadyExists", (message: string) => {
      toast.warning(message, { duration: 3000 });
    });

    socketInstance.on("mainComLoginComp", () => {
      toast.success("Main computer logged in", { duration: 1500 });
    });

    socketInstance.on("mainComputerDisconnected", () => {
      toast.warning("Main computer disconnected", { duration: 2000 });
    });

    return () => {
      clearTimeout(timer);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  };

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      connectSocket();
    }, 500);
  };

  useEffect(() => {
    const cleanup = connectSocket();

    return () => {
      if (cleanup) cleanup();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
