"use client";

// REACT
import React, { useState, useEffect, useCallback } from "react";

// SOCKET
import { useSocket } from "@/context/socket/context";

// TOAST
import { toast } from "sonner";

// FLOWBITE
import { Button, Card, Badge } from "flowbite-react";

// BUZZER
import Buzzer from "./buzzer";
import ConnectionDebug from "./debug";

export default function AdminPanel() {
  // INTERFACE
  interface BuzzerPress {
    teamId: string;
    teamName: string;
    pressedAt: string;
  }

  // VARIABLES AND CONSTANTS
  const { socket } = useSocket();
  const [timer, setTimer] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [firstPressInfo, setFirstPressInfo] = useState<BuzzerPress | null>(null);

  const startTimer = useCallback(() => {
    if (timerInterval) return;
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  }, [timer, socket, timerInterval]);

  const pauseTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
  }, [timerInterval, timer, socket]);

  const resetTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimer(15);
    setIsTimerRunning(false);
  }, [timerInterval, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleBuzzerPressed = (data: BuzzerPress) => {
      if (!firstPressInfo) {
        setFirstPressInfo(data);
      }
      toast.info(`Team - ${data.teamName} pressed the button.`, {duration: 15000})
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
      toast.warning("Already logged in as an admin")
    })

    return () => {
      socket.off("buzzerPressed");
      socket.off("mainComLoginComp");
      socket.off("buzzerReset");
      socket.off("mainComputerAlreadyExists")
    };
  }, [socket, firstPressInfo]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-800">Quiz Buzzer Admin Panel</h1>
        <p className="text-center text-gray-600 mb-8">Control the timer and monitor buzzer presses</p>
      </div>

      <Card className="mb-8 shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">Timer Control</h2>

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center">
                <span className="text-4xl font-bold text-indigo-700">{timer}</span>
                <span className="text-xl text-indigo-500 absolute -right-1 top-14">s</span>
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent"
                style={{
                  transform: 'rotate(-90deg)',
                  opacity: isTimerRunning ? '1' : '0.3',
                  animation: isTimerRunning ? 'spin 1s linear infinite' : 'none'
                }}
              ></div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={startTimer}
              disabled={isTimerRunning}
              className="px-4 py-2 rounded-lg cursor-pointer bg-pink-700 text-white"
              color={isTimerRunning ? "gray" : "success"}
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              Start
            </Button>
            <Button
              onClick={pauseTimer}
              disabled={!isTimerRunning}
              className="px-4 py-2 rounded-lg cursor-pointer"
              color={!isTimerRunning ? "gray" : "alternative"}
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Pause
            </Button>
            <Button
              onClick={resetTimer}
              className="px-4 py-2 rounded-lg cursor-pointer bg-pink-700 text-white"
              color="failure"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
              </svg>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-6 text-indigo-700">Buzzer Status</h2>

          <div className="mb-6">
            <Badge
              color={firstPressInfo ? "failure" : "success"}
              size="xl"
              className="px-4 py-2 rounded-full"
            >
              {firstPressInfo ? "Buzzer Pressed" : "Buzzer Ready"}
            </Badge>
          </div>

          <div className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-center transition-all duration-500 shadow-lg ${firstPressInfo
              ? "bg-gradient-to-br from-red-500 to-red-600 pulse-animation"
              : "bg-gradient-to-br from-green-500 to-green-600"
            }`}>
            {firstPressInfo ? (
              <div className="flex flex-col items-center gap-2 p-2">
                <p className="font-bold text-lg">{firstPressInfo.teamName}</p>
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
        <ConnectionDebug />
      </Card>

      <style jsx>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
        @keyframes spin {
          from { transform: rotate(-90deg); }
          to { transform: rotate(270deg); }
        }
      `}</style>
    </div>
  );
}