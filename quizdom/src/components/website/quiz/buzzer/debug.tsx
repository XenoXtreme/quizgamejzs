import { useEffect, useState } from "react";
import { useSocket } from "@/context/socket/context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DebugInfo {
  hostname: string;
  expectedUrl: string;
  socketConnected: boolean | undefined;
  socketId: string | undefined;
  transportType: string | undefined;
}

export default function ConnectionDebug() {
  const { socket } = useSocket();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    hostname: "",
    expectedUrl: "",
    socketConnected: undefined,
    socketId: undefined,
    transportType: undefined,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getConnectionInfo = () => {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const backendURl = process.env.NEXT_PUBLIC_BACKEND_API_URI;
      const codesspacesUrl = `${wsProtocol}//${backendURl?.replace(
        /https?:\/\//,
        ""
      )}`;

      setDebugInfo({
        hostname: window.location.hostname,
        expectedUrl: codesspacesUrl,
        socketConnected: socket?.connected,
        socketId: socket?.id,
        transportType: socket?.io?.engine?.transport?.name,
      });
    };

    getConnectionInfo();
    const interval = setInterval(getConnectionInfo, 1000);

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <div className="fixed bottom-4 left-4 z-1000 md:w-[15vw] w-[75vw]">
      <Card className="border-2 bg-card/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-3 w-3">
                <span
                  className={`absolute inset-0 rounded-full ${
                    debugInfo.socketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={`absolute inset-0 rounded-full animate-ping ${
                    debugInfo.socketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <h3 className="text-lg font-semibold">Connection Debug</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Badge
                variant={debugInfo.socketConnected ? "default" : "destructive"}
              >
                {debugInfo.socketConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge variant="secondary">
                {debugInfo.transportType || "No Transport"}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground font-medium">
                  Socket ID:
                </span>
                <span className="col-span-2 font-mono text-xs text-primary truncate">
                  {debugInfo.socketId || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground font-medium">
                  Hostname:
                </span>
                <span className="col-span-2 font-mono text-xs text-primary truncate">
                  {debugInfo.hostname || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground font-medium">
                  WS URL:
                </span>
                <span className="col-span-2 font-mono text-xs text-primary truncate">
                  {debugInfo.expectedUrl || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
