import * as React from "react";
import { Nunito } from "next/font/google";
import { useSocket } from "@/context/socket/context";
import { useAuthContext } from "@/context/auth/state";
import { toast } from "sonner";
import { ContextType } from "@/context/auth/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Loader2 } from "lucide-react";

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
      socket.emit("pressBuzzer", { teamId, teamName });
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={nunito.className}>
      <div className="flex flex-col items-center gap-6">
        {!isAdmin && (
          <Card className="w-full border-2 transition-all duration-300 hover:shadow-xl">
            <CardContent className="flex flex-col items-center p-8">
              <h2 className="mb-6 text-2xl font-bold text-primary">
                Team: <span className="text-foreground">{team.team}</span>
              </h2>

              <Badge
                variant={buzzerPressed ? "destructive" : "default"}
                className="mb-6 rounded-full px-6 py-2 text-base font-semibold"
              >
                {buzzerPressed ? "Buzzer Pressed" : "Buzzer Ready"}
              </Badge>

              <div
                className={`mb-6 flex h-48 w-48 items-center justify-center rounded-full text-center text-white shadow-2xl transition-all duration-500 ${
                  buzzerPressed
                    ? "animate-pulse bg-linear-to-br from-red-500 via-red-600 to-red-700"
                    : "bg-linear-to-br from-green-500 via-green-600 to-green-700 hover:scale-105 hover:shadow-green-500/50"
                }`}
              >
                <p className="text-2xl font-bold drop-shadow-lg">
                  {buzzerPressed ? "Pressed" : "Ready"}
                </p>
              </div>

              <Button
                onClick={handleBuzzerPress}
                disabled={buzzerPressed}
                size="lg"
                className={`h-16 w-48 rounded-full text-lg font-bold transition-all duration-300 ${
                  buzzerPressed
                    ? "cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
                }`}
              >
                {buzzerPressed ? "Waiting..." : "Press Buzzer"}
              </Button>
            </CardContent>
          </Card>
        )}

        {team.role === "ADMIN" && isAdmin && (
          <div className="mt-4 flex w-full justify-center">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-12 w-48 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset Buzzer
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 w-full rounded-lg border-l-4 border-destructive bg-destructive/10 p-4 shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 text-destructive">
              <svg
                className="h-6 w-6 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
