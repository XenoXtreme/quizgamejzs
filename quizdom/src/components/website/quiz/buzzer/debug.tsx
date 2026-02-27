import { useEffect, useState } from "react";
import { useSocket } from "@/context/socket/context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Wifi, WifiOff, Activity } from "lucide-react";

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
    <div className="fixed bottom-4 left-4 z-50 w-[90vw] sm:w-95 md:w-100 lg:w-105">
      <Card className="border-2 border-border/50 bg-linear-to-br from-card/98 to-card/95 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Animated status indicator */}
              <div className="relative flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                {debugInfo.socketConnected ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 z-10 relative" />
                    <span className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />
                    <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 z-10 relative" />
                    <span className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h3 className="text-base sm:text-lg font-semibold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Connection
                </h3>
                <Activity className="hidden sm:block h-4 w-4 text-muted-foreground animate-pulse" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-accent/50 transition-all duration-200 rounded-full"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </CardHeader>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={debugInfo.socketConnected ? "default" : "destructive"}
                className="cursor-pointer px-3 py-1 text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105"
              >
                {debugInfo.socketConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge
                variant="secondary"
                className="cursor-pointer px-3 py-1 text-xs sm:text-sm font-medium shadow-sm bg-secondary/80 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                {debugInfo.transportType || "No Transport"}
              </Badge>
            </div>

            {/* Connection details */}
            <div className="space-y-3 text-sm">
              {/* Socket ID */}
              <div className="cursor-pointer group rounded-lg border border-border/50 bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/50 hover:border-border">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                    Socket ID:
                  </span>
                  <span className="col-span-2 font-mono text-xs break-all text-foreground/90 group-hover:text-foreground transition-colors">
                    {debugInfo.socketId || "N/A"}
                  </span>
                </div>
              </div>

              {/* Hostname */}
              <div className="cursor-pointer group rounded-lg border border-border/50 bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/50 hover:border-border">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                    Hostname:
                  </span>
                  <span className="col-span-2 font-mono text-xs break-all text-foreground/90 group-hover:text-foreground transition-colors">
                    {debugInfo.hostname || "N/A"}
                  </span>
                </div>
              </div>

              {/* WebSocket URL */}
              <div className="cursor-pointer group rounded-lg border border-border/50 bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/50 hover:border-border">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                    WS URL:
                  </span>
                  <span className="col-span-2 font-mono text-xs break-all text-foreground/90 group-hover:text-foreground transition-colors">
                    {debugInfo.expectedUrl || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Connection timestamp or additional info */}
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Updates every second
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
