"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, School, Hash, Sparkles, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

// Define member keys as constants to avoid typos
const MEMBER_KEYS = ["member1", "member2", "member3", "member4"] as const;
type MemberKey = (typeof MEMBER_KEYS)[number];

export default function Logged() {
  const router = useRouter();
  const { team, isAuthenticated, removeTeam }: ContextType = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("_global_token")) {
      if (!isAuthenticated) {
        console.warn("❌ User is not authenticated");
        setIsLoading(false);
        toast.error("Please log in to view this page.", { duration: 2000 });
        setTimeout(() => router.push("/login"), 500);
        return;
      }
    }

    if (!team || !team.id) {
      console.warn("❌ Team data is missing");
      setIsLoading(false);
      toast.error("No team data found. Please log in again.", {
        duration: 2000,
      });
      setTimeout(() => router.push("/login"), 500);
      return;
    }

    setIsLoading(false);
  }, [team, isAuthenticated, router]);

  // ✅ Helper to check if member slot has data
  const hasMemberData = (memberKey: MemberKey): boolean => {
    const member = team?.member?.[memberKey];
    return !!(member && member.name && member.name.trim() !== "");
  };

  // Get total assigned members count
  const getAssignedCount = (): number => {
    return MEMBER_KEYS.filter((key) => hasMemberData(key)).length;
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    if (!name || name.trim() === "") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      removeTeam();
      toast.success("Logged out successfully", { duration: 1500 });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out", { duration: 1500 });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <p className="text-gray-400">Loading team data...</p>
        </div>
      </div>
    );
  }

  // Error state - no team data
  if (!team || !team.id) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-xl font-bold text-red-400">
                Authentication Error
              </h2>
              <p className="text-gray-400 text-sm">
                Your session has expired or team data is unavailable. Please log
                in again.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Return to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignedCount = getAssignedCount();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Team Card */}
        <Card className="overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/5">
          {/* Header Section */}
          <div className="relative">
            <div className="h-32 sm:h-48 bg-linear-to-br from-indigo-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[14px_24px]"></div>

              {/* Floating orbs */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-fuchsia-400/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

              {/* Sparkle effect */}
              <Sparkles className="absolute top-8 right-8 h-6 w-6 text-white/40 animate-pulse" />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all duration-200 flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Logout
                </span>
              </button>
            </div>

            {/* School Avatar */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full blur-xl opacity-75 animate-pulse"></div>
                <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl relative backdrop-blur-sm">
                  <AvatarFallback className="bg-linear-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white text-2xl font-bold">
                    {team?.school?.substring(0, 2).toUpperCase() || "QD"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <CardHeader className="pt-16 pb-6">
            <div className="space-y-3">
              <CardTitle className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
                {team?.team ? `${team.team}'s Dashboard` : "Team Dashboard"}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 text-base text-gray-300">
                <School className="h-4 w-4 text-indigo-400" />
                {team?.school || "School Name"}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 hover:bg-indigo-500/30 backdrop-blur-sm transition-all duration-300"
                >
                  {team?.category || "Category"}
                </Badge>
                {team?.role && (
                  <Badge
                    variant="outline"
                    className="border-purple-400/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300"
                  >
                    {team.role}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="gap-1 border-white/20 text-gray-300 bg-white/5 backdrop-blur-sm"
                >
                  <Hash className="h-3 w-3" />
                  {team?.id || "N/A"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <Separator className="bg-white/10" />

            {/* Team Members Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                <Users className="h-4 w-4" />
                Team Members ({assignedCount}/4)
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {MEMBER_KEYS.map((memberKey, index) => {
                  const member = team.member[memberKey];
                  const hasData = hasMemberData(memberKey);

                  return (
                    <Card
                      key={memberKey}
                      className={`transition-all duration-300 border border-white/10 backdrop-blur-sm ${
                        hasData
                          ? "bg-white/5 hover:bg-white/10 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
                          : "opacity-50 bg-white/2"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Member Avatar */}
                          <div className="relative">
                            {hasData && (
                              <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                            )}
                            <Avatar className="h-12 w-12 relative">
                              <AvatarFallback
                                className={`text-sm font-semibold ${
                                  hasData
                                    ? "bg-linear-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white"
                                    : "bg-white/5 text-gray-500"
                                }`}
                              >
                                {hasData
                                  ? getInitials(member?.name || "")
                                  : index + 1}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate text-white">
                              {member?.name ? member.name : "Not Assigned"}
                            </h4>
                            <p className="text-xs text-gray-400">
                              Class: {member?.class ? member.class : "N/A"}
                            </p>
                          </div>

                          {/* Member Badge */}
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0 bg-white/10 text-gray-300 border-white/20"
                          >
                            #{index + 1}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4">
              <Separator className="mb-4 bg-white/10" />
              <p className="text-center text-xs font-medium tracking-widest text-gray-500 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3" />
                QUIZDOM TEAM PORTAL
                <Sparkles className="h-3 w-3" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
