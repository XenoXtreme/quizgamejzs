import { useState, useEffect } from "react";
import { useSocket } from "@/context/socket/context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Buzzer from "./buzzer";
import ConnectionDebug from "./debug";

interface BuzzerPress {
  teamId: string;
  teamName: string;
  pressedAt: string;
}

export default function AdminPanel() {
  const { socket } = useSocket();
  const [firstPressInfo, setFirstPressInfo] = useState<BuzzerPress | null>(
    null
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

    socket.emit("identifyMainComputer");

    socket.on("mainComLoginComp", () => {
      toast.success("Main computer (admin) identified successfully!");
    });

    socket.on("buzzerPressed", handleBuzzerPressed);
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
    <div className="mx-auto min-h-screen max-w-300 p-8 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="mb-2 text-center text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quiz Buzzer Admin Panel
        </h1>
        <p className="text-center text-muted-foreground">
          Control the timer and monitor buzzer presses
        </p>
      </div>

      <Card className="mb-8 border-2 bg-linear-to-br from-indigo-50/50 to-purple-50/50 shadow-xl dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Buzzer Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Badge
            variant={firstPressInfo ? "destructive" : "default"}
            className="rounded-full px-6 py-2 text-base font-semibold"
          >
            {firstPressInfo ? "Buzzer Pressed" : "Buzzer Ready"}
          </Badge>

          <div
            className={`flex h-48 w-48 items-center justify-center rounded-full text-center text-white shadow-2xl transition-all duration-500 ${
              firstPressInfo
                ? "animate-pulse bg-linear-to-br from-red-500 via-red-600 to-red-700"
                : "bg-linear-to-br from-green-500 via-green-600 to-green-700"
            }`}
          >
            {firstPressInfo ? (
              <div className="flex flex-col items-center gap-2 p-4">
                <p className="text-xl font-bold drop-shadow-lg">
                  {firstPressInfo.teamName}
                </p>
                <p className="text-sm opacity-90 drop-shadow">
                  {new Date(firstPressInfo.pressedAt).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold drop-shadow-lg">
                Waiting for teams
              </p>
            )}
          </div>

          <div className="w-full">
            <Buzzer isAdmin={true} />
          </div>
        </CardContent>
      </Card>
      <ConnectionDebug />
    </div>
  );
}
