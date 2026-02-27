"use client";

import { useSearchParams } from "next/navigation";
import Buzzer from "@/components/website/quiz/buzzer/buzzer";
import AdminPanel from "@/components/website/quiz/buzzer/admin";
import { SocketProvider } from "@/context/socket/context";

export default function BuzzerPage() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  return (
    <SocketProvider>
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
        <div className="p-4">
          {isAdmin ? (
            <AdminPanel />
          ) : (
            <div className="mx-auto max-w-2xl">
              <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Team Buzzer
              </h1>
              <Buzzer />
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
}
