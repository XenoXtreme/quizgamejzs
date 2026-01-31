import { Request, Response, NextFunction } from "express";
import { AuthService } from "../lib/auth/auth";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        team: string;
        role: string;
        school: string;
      };
    }
  }
}

export const authenticateToken = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access token required",
        code: "NO_TOKEN",
        hint: "Send token in 'Authorization: Bearer <token>' header",
      });
    }

    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: "Invalid or expired token",
        code: "TOKEN_INVALID",
        hint: "Use /api/auth/refresh to get a new token",
      });
    }

    req.user = decoded;
    next();
  };
};

// Optional middleware that doesn't fail if token is missing
export const optionalAuthentication = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  };
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: roles,
        current: req.user.role,
        code: "INSUFFICIENT_PERMISSIONS",
      });
    }

    next();
  };
};
