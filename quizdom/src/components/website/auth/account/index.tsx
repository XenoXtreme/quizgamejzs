"use client";
import React from "react";
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
import { Users, School, Hash, Sparkles } from "lucide-react";

// CONTEXT
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

export default function Logged() {
  const { team }: ContextType = useAuthContext();

  const hasMemberData = (
    memberKey: "member1" | "member2" | "member3" | "member4"
  ) => {
    return (
      team?.member?.[memberKey]?.name && team?.member?.[memberKey]?.name !== ""
    );
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Team Card with Glassmorphism */}
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
            </div>

            {/* School Avatar with glow */}
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
                {team?.team || "Team Dashboard"}
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
                    {team?.role}
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
                Team Members
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {["member1", "member2", "member3", "member4"].map(
                  (memberKey, index) => {
                    const member =
                      team?.member?.[
                        memberKey as
                          | "member1"
                          | "member2"
                          | "member3"
                          | "member4"
                      ];
                    const hasData = hasMemberData(
                      memberKey as "member1" | "member2" | "member3" | "member4"
                    );

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

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate text-white">
                                {member?.name || "Not Assigned"}
                              </h4>
                              <p className="text-xs text-gray-400">
                                Class: {member?.class || "N/A"}
                              </p>
                            </div>

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
                  }
                )}
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
