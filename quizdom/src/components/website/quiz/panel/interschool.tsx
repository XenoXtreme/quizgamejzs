// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";
import Image from "next/image";

// SHADCN COMPONENTS
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// LUCIDE ICONS
import {
  User,
  Zap,
  Link as LinkIcon,
  Film,
  Target,
  Hand,
  Trophy,
  ArrowRight,
} from "lucide-react";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

const rounds = [
  {
    id: "on-your-own",
    title: "On Your Own",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    image: "/assets/static/person.jpg",
    href: "/quiz/interschool/round/on-your-own",
  },
  {
    id: "pounce-bounce",
    title: "Pounce - Bounce",
    icon: Zap,
    gradient: "from-pink-500 to-rose-500",
    image: "/assets/static/bounce.jpg",
    href: "/quiz/interschool/round/pounce-bounce",
  },
  {
    id: "connections",
    title: "Connections",
    icon: LinkIcon,
    gradient: "from-green-500 to-emerald-500",
    image: "/assets/static/connection.jpg",
    href: "/quiz/interschool/round/connections",
  },
  {
    id: "movie-mania",
    title: "Movie Mania",
    icon: Film,
    gradient: "from-yellow-500 to-amber-500",
    image: "/assets/static/movie.jpg",
    href: "/quiz/interschool/round/movie-mania",
  },
  {
    id: "point-blank",
    title: "Point Blank",
    icon: Target,
    gradient: "from-orange-500 to-red-500",
    image: "/assets/static/pointblank.jpg",
    href: "/quiz/interschool/round/point-blank",
  },
  {
    id: "on-your-fingertips",
    title: "On Your Fingertips",
    icon: Hand,
    gradient: "from-indigo-500 to-purple-500",
    image: "/assets/static/fingertips.png",
    href: "/quiz/interschool/round/on-your-fingertips",
  },
];

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div className="relative min-h-screen w-full bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-gray-900">
        {/* Vercel-style grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Gradient orbs */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />

        <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Quiz Competition
            </Badge>
            <h1 className="mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-gray-100 dark:via-gray-300 dark:to-gray-500">
              Rounds
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose a round to begin
            </p>
          </div>

          {/* Rounds Grid */}
          <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rounds.map((round, index) => {
              const Icon = round.icon;
              return (
                <Link key={round.id} href={round.href}>
                  <Card
                    className="group relative overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-gray-700"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${round.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                    />

                    <CardContent className="relative flex flex-col items-center p-8 text-center">
                      {/* Image with icon overlay */}
                      <div className="relative mb-6">
                        <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-4 group-hover:ring-gray-300 dark:ring-gray-700 dark:group-hover:ring-gray-600">
                          <Image
                            fill
                            src={round.image}
                            loading="lazy"
                            alt={round.title}
                            className="h-full w-full object-cover"
                          />
                          {/* Icon overlay */}
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${round.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-90`}
                          >
                            <Icon className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {round.title}
                      </h2>

                      {/* Hover arrow */}
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-gray-400">
                        Start Round
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Tie Breaker Section */}
          <div className="mt-16 w-full max-w-6xl">
            <Card className="group relative overflow-hidden border-2 border-yellow-500/20 bg-linear-to-br from-yellow-50/80 via-amber-50/80 to-orange-50/80 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-2xl dark:border-yellow-500/20 dark:from-yellow-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-yellow-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

              <CardContent className="relative flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-linear-to-br from-yellow-500 to-orange-500 p-3 shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Tie Breaker
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Descisive round to determine the winner from tied teams
                    </p>
                  </div>
                </div>

                <Link href="/quiz/interschool/round/tie-breaker">
                  <Button
                    size="lg"
                    className="group/button bg-linear-to-r from-yellow-500 to-orange-500 font-semibold text-white shadow-lg transition-all duration-300 hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl"
                  >
                    View Round
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
