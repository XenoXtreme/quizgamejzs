// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// SHADCN COMPONENTS
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// LUCIDE ICONS
import { ArrowRight, Users, School, Mic } from "lucide-react";

// FONT
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const quizCategories = [
  {
    id: "prelims",
    title: "Prelims",
    description: "Questions for Prelims.",
    icon: School,
    href: "/quiz/prelims",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Getting Started",
  },
  {
    id: "interschool",
    title: "Inter School Quiz Competition",
    description:
      "Access the questions meant for students of class IX-XII. Explore the world, gain knowledge and do much more!",
    icon: Users,
    href: "/quiz/interschool",
    gradient: "from-purple-500 to-pink-500",
    badge: "Main",
  },
  {
    id: "audience",
    title: "Open Quiz for Audience",
    description:
      "Questions for audience to engage with the quiz and test their knowledge.",
    icon: Mic,
    href: "/quiz/audience",
    gradient: "from-orange-500 to-red-500",
    badge: "Interactive",
  },
];

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div className="relative min-h-screen w-full bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-gray-900">
        {/* Vercel-style grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10" />

        <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-gray-100 dark:via-gray-300 dark:to-gray-500">
              Quiz Categories
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select a category to begin your journey
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group relative overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-gray-700"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  <CardHeader className="relative">
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`rounded-xl bg-linear-to-br ${category.gradient} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      {category.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      {category.description}
                    </CardDescription>

                    <Link href={category.href} className="block">
                      <Button
                        className="group/button w-full bg-gray-900 font-semibold text-white transition-all duration-300 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        size="lg"
                      >
                        View Questions
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
