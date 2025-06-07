"use client";

// REACT
import * as React from "react";

// NUNITO
import { Nunito } from "next/font/google";

// SOCKET
import { useSocket } from "@/context/socket/context";

// CONTEXT
import { useAuthContext } from "@/context/auth/state";

// TOAST
import { toast } from "sonner";

// AUTH CONTEXT
import { ContextType } from "@/context/auth/context";

// FLOWBITE
import { Button, Card, Badge } from "flowbite-react";

import Debug from "./debug";

// INTERFACE
interface BuzzerProps {
  isAdmin?: boolean;
}

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function Buzzer({ isAdmin = false }: BuzzerProps) {
  const { socket } = useSocket();
  const [buzzerPressed, setBuzzerPressed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { team }: ContextType = useAuthContext();
  const teamId = team?.id;
  const teamName = team?.team;

  React.useEffect(() => {
    if (!socket) return;
    const handleBuzzerReset = () => {
      setBuzzerPressed(false);
    };

    const handleError = (message: string) => {
      setError(message);
      setTimeout(() => setError(null), 3000);
    };

    // Socket event listeners
    if (!socket) {
      toast.error("Not connected to server!");
      return;
    }

    socket.on("connect", () => {
      toast.success("Connected to server!");
    });

    socket.on("disconnect", () => {
      toast.error("Disconnected from server!");
    });

    socket.on("buzzerReset", handleBuzzerReset);
    socket.on("error", handleError);

    return () => {
      socket.off("buzzerReset", handleBuzzerReset);
      socket.off("error", handleError);
    };
  }, [socket]);

  const handleBuzzerPress = React.useCallback(() => {
    if (!socket) {
      toast.error("Not connected to server!");
      return;
    }

    if (buzzerPressed) {
      toast.warning("Buzzer is already pressed!");
      return;
    }
    try {
      socket.emit("pressBuzzer", {
        teamId,
        teamName
      });
      setBuzzerPressed(true);
      toast.info("Pressed buzzer");
    } catch (error) {
      console.error("Error pressing buzzer:", error);
      toast.error("Failed to press buzzer!");
    }
  }, [socket, buzzerPressed, teamId, teamName]);

  const handleReset = React.useCallback(() => {
    if (!socket) {
      toast.error("Not connected to server!");
      return;
    }
    try {
      socket.emit("resetBuzzer", {});
      toast.info("Resetting buzzer...");
    } catch (error) {
      console.error("Error resetting buzzer:", error);
      toast.error("Failed to reset buzzer!");
    }
  }, [socket]);

  if (!team) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={nunito.className}>
      {process.env.NODE_ENV === "development" && <Debug />}
      <div className="flex flex-col items-center gap-6">
        {!isAdmin && (
          <Card className="w-full">
            <div className="flex flex-col items-center p-4">
              <h2 className="text-xl font-bold mb-6 text-indigo-700"><u>Team:</u> {team.team}</h2>

              <Badge
                color={buzzerPressed ? "failure" : "success"}
                size="xl"
                className="px-4 py-2 mb-6 rounded-full"
              >
                {buzzerPressed ? "Buzzer Pressed" : "Buzzer Ready"}
              </Badge>

              <div
                className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-center transition-all duration-500 shadow-lg mb-6 ${buzzerPressed
                    ? "bg-gradient-to-br from-red-500 to-red-600 pulse-animation"
                    : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                  }`}
              >
                <p className="text-2xl font-bold">{buzzerPressed ? "Pressed" : "Ready"}</p>
              </div>

              <Button
                onClick={handleBuzzerPress}
                disabled={buzzerPressed}
                className={`cursor-pointer transform transition-all duration-300 w-48 h-16 text-lg font-bold rounded-full ${buzzerPressed
                    ? "cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
                  }`}
                color={buzzerPressed ? "gray" : "blue"}
                size="xl"
              >
                {buzzerPressed ? "Waiting..." : "Press Buzzer"}
              </Button>
            </div>
          </Card>
        )}

        {team.role === "ADMIN" && isAdmin && (
          <div className="w-full flex justify-center mt-4">
            <Button
              onClick={handleReset}
              className="transform transition-all duration-300 hover:scale-105 active:scale-95 w-48 h-12 text-lg font-bold rounded-full cursor-pointer"
              color="warning"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
              </svg>
              Reset Buzzer
            </Button>
          </div>
        )}

        {error && (
          <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-4 shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
      `}</style>
    </div>
  );
}