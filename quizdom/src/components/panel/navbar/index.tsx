"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  ChevronDown,
  LogOut,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthContext } from "@/context/auth/state";
import { ContextType } from "@/context/auth/context";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./themeToggle";

// 1. Static data moved outside component to prevent re-creation on re-renders
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/history", label: "History" },
  { href: "/rules", label: "Rules" },
  { href: "/quiz", label: "QNA" },
];

export default function AppBar() {
  const path = usePathname();
  const router = useRouter();

  const { team, isAuthenticated, getSetTeam, removeTeam }: ContextType =
    useAuthContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
 
  // Local Storage Sync
  useEffect(() => {
    // Only run if we are in the browser and have no team loaded
    if (typeof window === "undefined" || team?.id) return;

    const userJSON = localStorage.getItem("_user");
    if (!userJSON) return;

    try {
      const userData = JSON.parse(userJSON);
      if (userData) {
        getSetTeam({
          id: userData.id,
          team: userData.team,
          category: userData.category,
          member: userData.members?.[0] || {},
          role: userData.role,
          school: userData.school,
        });
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem("_user");
    }
  }, [team?.id, getSetTeam]);

  const handleLogOut = () => {
    setIsLoggingOut(true);
    // Clear storage
    localStorage.removeItem("_id");
    localStorage.removeItem("_user");

    toast.success("Successfully logged out.", { duration: 600 });

    // Use a small delay to allow the toast to appear before navigation
    setTimeout(() => {
      removeTeam();
      router.refresh();
      router.push("/login");
      setIsLoggingOut(false);
    }, 500);
  };

  // 4. Memoized Helper for Active Links
  const isActive = (route: string) => {
    if (route === "/") return path === "/";
    return path === route || path?.startsWith(`${route}/`);
  };

  // Helper for Buzzer URL
  const buzzerURL = useMemo(() => {
    return team?.role === "ADMIN" ? "/quiz/buzzer?admin=true" : "/quiz/buzzer";
  }, [team?.role]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-gray-700 dark:bg-linear-to-r dark:from-indigo-900/95 dark:via-purple-900/95 dark:to-indigo-900/95">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-lg ring-2 ring-purple-500/20 transition-transform hover:scale-105">
            <Image
              src="/icon.png"
              className="object-contain"
              width={40}
              height={40}
              alt="Quizdom Logo"
              priority
            />
          </div>
          <span className="bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-blue-300">
            Quizdom
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                isActive(link.href)
                  ? "bg-blue-100 text-blue-800 shadow-md dark:bg-blue-900/50 dark:text-yellow-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authenticated State */}
          {isAuthenticated && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {team?.team || "Team Member"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {team?.school || "Quizdom"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    Controls
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {team?.team}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        <span className="font-semibold">Role:</span>{" "}
                        {team?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={buzzerURL} className="cursor-pointer">
                      <div className="flex items-center">
                        <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Buzzer
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  {team?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/quiz/timer" className="cursor-pointer">
                        <Clock className="mr-2 h-4 w-4" /> Timer
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Guest State (Desktop) */}
          {!isAuthenticated && (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-87.5">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                <div className="flex flex-col gap-4">
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-yellow-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <Separator />

                  {isAuthenticated ? (
                    <>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold">
                            {team?.team}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {team?.school}
                          </span>
                          <span className="mt-1 text-xs">
                            <span className="font-semibold">Role:</span>{" "}
                            {team?.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="justify-start"
                          asChild
                        >
                          <Link
                            href="/account"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" /> Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          asChild
                        >
                          <Link
                            href={buzzerURL}
                            onClick={() => setIsOpen(false)}
                          >
                            Buzzer
                          </Link>
                        </Button>
                        {team?.role === "ADMIN" && (
                          <Button
                            variant="outline"
                            className="justify-start"
                            asChild
                          >
                            <Link
                              href="/quiz/timer"
                              onClick={() => setIsOpen(false)}
                            >
                              <Clock className="mr-2 h-4 w-4" /> Timer
                            </Link>
                          </Button>
                        )}
                      </div>

                      <Separator />

                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleLogOut();
                          setIsOpen(false);
                        }}
                        disabled={isLoggingOut}
                        className="w-full"
                      >
                        {isLoggingOut ? "Logging out..." : "Sign out"}
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
