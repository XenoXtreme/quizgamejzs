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
      toast.error("Not connected to server!", { duration: 500 });
      return;
    }

    socket.on("connect", () => {
      toast.success("Connected to server!", { duration: 500 });
    });

    socket.on("disconnect", () => {
      toast.error("Disconnected from server!", { duration: 500 });
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
        teamName,
      });
      setBuzzerPressed(true);
      toast.info("Pressed buzzer", { duration: 600 });
    } catch (error) {
      console.error("Error pressing buzzer:", error);
      toast.error("Failed to press buzzer!", { duration: 600 });
    }
  }, [socket, buzzerPressed, teamId, teamName]);

  const handleReset = React.useCallback(() => {
    if (!socket) {
      toast.error("Not connected to server!");
      return;
    }
    try {
      socket.emit("resetBuzzer", {});
      toast.info("Resetting buzzer...", { duration: 700 });
    } catch (error) {
      console.error("Error resetting buzzer:", error);
      toast.error("Failed to reset buzzer!");
    }
  }, [socket]);

  if (!team) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={nunito.className}>
      <div className="flex flex-col items-center gap-6">
        {!isAdmin && (
          <Card className="w-full">
            <div className="flex flex-col items-center p-4">
              <h2 className="mb-6 text-xl font-bold text-indigo-700">
                <u>Team:</u> {team.team}
              </h2>

              <Badge
                color={buzzerPressed ? "failure" : "success"}
                size="xl"
                className="mb-6 rounded-full px-4 py-2"
              >
                {buzzerPressed ? "Buzzer Pressed" : "Buzzer Ready"}
              </Badge>

              <div
                className={`mb-6 flex h-48 w-48 items-center justify-center rounded-full text-center text-white shadow-lg transition-all duration-500 ${
                  buzzerPressed
                    ? "pulse-animation bg-gradient-to-br from-red-500 to-red-600"
                    : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                }`}
              >
                <p className="text-2xl font-bold">
                  {buzzerPressed ? "Pressed" : "Ready"}
                </p>
              </div>

              <Button
                onClick={handleBuzzerPress}
                disabled={buzzerPressed}
                className={`h-16 w-48 transform cursor-pointer rounded-full text-lg font-bold transition-all duration-300 ${
                  buzzerPressed
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
          <div className="mt-4 flex w-full justify-center">
            <Button
              onClick={handleReset}
              className="h-12 w-48 transform cursor-pointer rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
              color="warning"
              size="lg"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Reset Buzzer
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 w-full rounded-md border-l-4 border-red-500 bg-red-100 p-4 text-red-700 shadow-md">
            <div className="flex items-center">
              <svg
                className="mr-2 h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
      `}</style>
    </div>
  );
}
