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

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Prevent execution during Server-Side Rendering (SSR)
    if (typeof window === "undefined") return;

    const serverUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URI ||
      "https://quizdom-553x.onrender.com";

    console.log("Connecting to server at:", serverUrl);

    // Initialize the socket connection
    const socketInstance = io(serverUrl, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true,
      path: "/socket.io/",
    });

    socketRef.current = socketInstance;

    // FIX: Wrap the state update in setTimeout to avoid the synchronous render warning
    const timer = setTimeout(() => {
      setSocket(socketInstance);
    }, 0);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
      toast.success("Connected to server", { duration: 800 });
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
      // Optional: Don't toast on every retry to avoid spamming the user
      toast.error(`Connection error: ${err.message}`, { duration: 2000 });
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      toast.error(`Disconnected: ${reason}`, { duration: 800 });
    });

    // Cleanup function
    return () => {
      clearTimeout(timer); // Clear the timeout if component unmounts quickly
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
