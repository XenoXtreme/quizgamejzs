"use client";

// REACT
import React, { useState, useEffect } from "react";

// SOCKET
import { useSocket } from "@/context/socket/context";

// TOAST
import { toast } from "sonner";

// FLOWBITE
import { Button, Card, Badge } from "flowbite-react";

// BUZZER
import Buzzer from "./buzzer";
import ConnectionDebug from "./debug";
import Timer from "@/components/website/quiz/timer";

export default function AdminPanel() {
  // INTERFACE
  interface BuzzerPress {
    teamId: string;
    teamName: string;
    pressedAt: string;
  }

  // VARIABLES AND CONSTANTS
  const { socket } = useSocket();
  const [firstPressInfo, setFirstPressInfo] = useState<BuzzerPress | null>(
    null,
  );

  useEffect(() => {
    if (!socket) return;
    const handleBuzzerPressed = (data: BuzzerPress) => {
      if (!firstPressInfo) {
        setFirstPressInfo(data);
      }
      toast.info(`Team - ${data.teamName} pressed the button.`, {
        duration: 10000,
      });
    };

    const handleBuzzerReset = () => {
      setFirstPressInfo(null);
    };

    // Emit identifyMainComputer to let the server know this is the admin client
    socket.emit("identifyMainComputer");

    // Listen for mainComLoginComp event from the server indicating a successful admin login/identification
    socket.on("mainComLoginComp", (data: string) => {
      toast.success("Main computer (admin) identified successfully!");
    });

    socket.on("buzzerPressed", (data: BuzzerPress) => {
      handleBuzzerPressed(data);
    });

    socket.on("buzzerReset", handleBuzzerReset);
    socket.on("mainComputerAlreadyExists", () => {
      toast.warning("Already logged in as an admin");
    });

    return () => {
      socket.off("buzzerPressed");
      socket.off("mainComLoginComp");
      socket.off("buzzerReset");
      socket.off("mainComputerAlreadyExists");
    };
  }, [socket, firstPressInfo]);

  return (
    <div className="mx-auto min-h-screen max-w-[1200px] bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-indigo-800">
          Quiz Buzzer Admin Panel
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Control the timer and monitor buzzer presses
        </p>
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="mb-6 text-xl font-semibold text-indigo-700">
            Buzzer Status
          </h2>

          <div className="mb-6">
            <Badge
              color={firstPressInfo ? "failure" : "success"}
              size="xl"
              className="rounded-full px-4 py-2"
            >
              {firstPressInfo ? "Buzzer Pressed" : "Buzzer Ready"}
            </Badge>
          </div>

          <div
            className={`flex h-48 w-48 items-center justify-center rounded-full text-center text-white shadow-lg transition-all duration-500 ${
              firstPressInfo
                ? "pulse-animation bg-gradient-to-br from-red-500 to-red-600"
                : "bg-gradient-to-br from-green-500 to-green-600"
            }`}
          >
            {firstPressInfo ? (
              <div className="flex flex-col items-center gap-2 p-2">
                <p className="text-lg font-bold">{firstPressInfo.teamName}</p>
                <p className="text-sm opacity-90">{firstPressInfo.pressedAt}</p>
              </div>
            ) : (
              <p className="text-xl font-bold">Waiting for teams</p>
            )}
          </div>

          <div className="mt-8 w-full">
            <Buzzer isAdmin={true} />
          </div>
        </div>

        {/* Timer component */}
        <Card className="mb-8 shadow-lg">
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-xl font-semibold text-indigo-700">
              Timer Control
            </h2>
            <div className="flex w-full justify-center">
              <div className="w-full">
                <Timer />
              </div>
            </div>
          </div>
        </Card>
        <ConnectionDebug />
      </Card>

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
        @keyframes spin {
          from {
            transform: rotate(-90deg);
          }
          to {
            transform: rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}
