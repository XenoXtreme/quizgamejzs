"use client";

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/context/socket/context';
import { Card, Badge } from 'flowbite-react';

export default function ConnectionDebug() {
  const { socket } = useSocket();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getConnectionInfo = () => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const backendURl = process.env.NEXT_PUBLIC_BACKEND_API_URI;
      const codesspacesUrl = `${wsProtocol}//${backendURl?.replace(/https?:\/\//, '')}`;

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
    <div className="fixed bottom-4 left-4 z-[1000] max-w-[400px]">
      <Card className="bg-gray-900/90 text-white backdrop-blur-sm shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${debugInfo.socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h3 className="text-lg font-semibold">Connection Debug</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Badge color={debugInfo.socketConnected ? "success" : "failure"} className="w-fit">
                {debugInfo.socketConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge color="purple" className="w-fit">
                {debugInfo.transportType || "No Transport"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-gray-400">Socket ID:</span>
                <span className="col-span-2 text-indigo-300 font-mono truncate">{debugInfo.socketId || "N/A"}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-gray-400">Hostname:</span>
                <span className="col-span-2 text-indigo-300 font-mono truncate">{debugInfo.hostname || "N/A"}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-gray-400">WS URL:</span>
                <span className="col-span-2 text-indigo-300 font-mono truncate">{debugInfo.expectedUrl || "N/A"}</span>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}