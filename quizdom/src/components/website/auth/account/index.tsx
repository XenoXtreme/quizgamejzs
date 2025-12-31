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
import { Users, School, Hash } from "lucide-react";

// CONTEXT
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

export default function Logged() {
  const { team }: ContextType = useAuthContext();

  // Helper function to check if a member has data
  const hasMemberData = (
    memberKey: "member1" | "member2" | "member3" | "member4"
  ) => {
    return (
      team?.member?.[memberKey]?.name && team?.member?.[memberKey]?.name !== ""
    );
  };

  // Get initials for avatar
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 py-8 sm:py-12">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Team Card */}
        <Card className="overflow-hidden border-0 shadow-xl">
          {/* Header Section */}
          <div className="relative">
            <div className="h-32 sm:h-40 bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,white)]"></div>
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-purple-400/20 blur-2xl"></div>
            </div>

            {/* School Avatar */}
            <div className="absolute -bottom-12 left-8">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                  {team?.school?.substring(0, 2).toUpperCase() || "QD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <CardHeader className="pt-16 pb-6">
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {team?.team || "Team Dashboard"}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 text-base">
                <School className="h-4 w-4" />
                {team?.school || "School Name"}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900"
                >
                  {team?.category || "Category"}
                </Badge>
                {team?.role && (
                  <Badge
                    variant="outline"
                    className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                  >
                    {team?.role}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Hash className="h-3 w-3" />
                  {team?.id || "N/A"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <Separator />

            {/* Team Members Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
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
                        className={`transition-all duration-200 ${
                          hasData
                            ? "hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800"
                            : "opacity-60"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback
                                className={`text-sm font-semibold ${
                                  hasData
                                    ? "bg-linear-to-br from-indigo-500 to-purple-600 text-white"
                                    : "bg-muted"
                                }`}
                              >
                                {hasData
                                  ? getInitials(member?.name || "")
                                  : index + 1}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {member?.name || "Not Assigned"}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Class: {member?.class || "N/A"}
                              </p>
                            </div>

                            <Badge
                              variant="secondary"
                              className="text-xs shrink-0"
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
              <Separator className="mb-4" />
              <p className="text-center text-xs font-medium tracking-widest text-muted-foreground/60">
                QUIZDOM TEAM PORTAL
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
