"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Link2,
  Film,
  Brain,
  Zap,
  Target,
  Hand,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { InterSch, QuestionItem } from "@/types/qns-structures";
import { RoundConfig, getAccentClasses } from "@/config/round";

interface UniversalQuizPanelProps {
  config: RoundConfig;
}

// Icon mapping to avoid passing functions from server to client
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Zap,
  Link2,
  Film,
  Target,
  Hand,
  Trophy,
};

export default function UniversalQuestionPanel({
  config,
}: UniversalQuizPanelProps) {
  const questions = InterSch[config.dataKey];
  const accentClasses = getAccentClasses(config.accentColor);

  // Get icon component from the icon name
  const IconComponent = iconMap[config.iconName] || Brain;

  function genURL(q_no: string): string {
    return `/quiz/interschool/round/${config.slug}/${q_no}`;
  }

  // Render different layouts based on round type
  const renderContent = () => {
    switch (config.slug) {
      case "connections":
        return <ConnectionsLayout />;
      case "point-blank":
        return <PointBlankLayout />;
      case "on-your-fingertips":
        return <CategoryLayout />;
      case "movie-mania":
        return <MovieManiaLayout />;
      default:
        return <StandardLayout />;
    }
  };

  // ========== STANDARD LAYOUT (OYO, PNB, TIE) ==========
  const StandardLayout = () => (
    <div className="space-y-4">
      {questions.map((question: QuestionItem, index: number) => (
        <Card
          key={index}
          className={`
            group transition-all duration-300 
            hover:shadow-xl hover:scale-[1.01]
            dark:hover:shadow-${config.accentColor}-900/20
            border-l-4 
            ${accentClasses.border} ${accentClasses.borderDark}
            dark:bg-gray-800/50 dark:border-gray-700
            relative overflow-hidden
          `}
        >
          {/* Gradient overlay on hover */}
          <div
            className={`
              absolute inset-0 opacity-0 group-hover:opacity-5
              transition-opacity duration-300
              bg-linear-to-r from-${config.accentColor}-400 to-transparent
              pointer-events-none
            `}
          />

          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-colors">
                  <IconComponent className="h-5 w-5 opacity-60" />
                  {question.display_text}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Question {question.q_no}
                </CardDescription>
              </div>
              <Badge
                className={`
                  ${accentClasses.bg} ${accentClasses.bgDark} 
                  ${accentClasses.text} ${accentClasses.textDark} 
                  border-0 ml-4 font-mono
                `}
              >
                #{question.q_no}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <Link href={genURL(question.q_no)}>
              <Button
                variant="outline"
                size="sm"
                className={`
                  w-full sm:w-auto 
                  ${accentClasses.hover} ${accentClasses.hoverDark} 
                  transition-all duration-200
                  dark:border-gray-600 dark:text-gray-300
                  group-hover:shadow-md
                `}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ========== CONNECTIONS LAYOUT - Glassy/Frosted Design ==========
  const ConnectionsLayout = () => (
    <div className="space-y-4">
      {questions.map((question: QuestionItem, index: number) => {
        const isConnectionQuestion =
          question.display_text?.toLowerCase() === "connection" ||
          question.q_no?.toLowerCase() === "connection" ||
          question.q_no === "answer";

        return (
          <Card
            key={index}
            style={{
              animationDelay: `${index * 80}ms`,
            }}
            className={`
              animate-in fade-in slide-in-from-bottom-4 duration-500
              group relative overflow-hidden
              bg-white/60 dark:bg-gray-800/40
              backdrop-blur-xl backdrop-saturate-150
              border ${
                isConnectionQuestion
                  ? "border-purple-300 dark:border-purple-700 border-l-4"
                  : "border-purple-200/50 dark:border-purple-800/30"
              }
              hover:border-purple-400 dark:hover:border-purple-600
              hover:shadow-2xl hover:shadow-purple-500/20
              dark:hover:shadow-purple-900/30
              transition-all duration-500
              hover:scale-[1.02]
            `}
          >
            {/* Glassy shimmer effect */}
            <div
              className="
                absolute inset-0 
                bg-linear-to-br from-purple-400/10 via-transparent to-pink-400/10
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                pointer-events-none
              "
            />

            {/* Animated gradient border on hover */}
            <div
              className="
                absolute inset-0 
                bg-linear-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20
                opacity-0 group-hover:opacity-30
                blur-xl
                transition-opacity duration-500
                pointer-events-none
              "
            />

            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    {isConnectionQuestion && (
                      <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                    )}
                    <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {question.display_text}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isConnectionQuestion
                      ? "Final Connection"
                      : `Question ${question.q_no}`}
                  </CardDescription>
                </div>
                <Badge
                  className={`
                    ${
                      isConnectionQuestion
                        ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700"
                        : `${accentClasses.bg} ${accentClasses.bgDark} ${accentClasses.text} ${accentClasses.textDark} border-0`
                    }
                    ml-4 font-mono backdrop-blur-sm
                  `}
                >
                  {isConnectionQuestion ? "🔗" : `#${question.q_no}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <Link href={genURL(question.q_no)}>
                <Button
                  variant={isConnectionQuestion ? "default" : "outline"}
                  size="sm"
                  className={`
                    w-full sm:w-auto 
                    transition-all duration-300
                    ${
                      isConnectionQuestion
                        ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:border-gray-600 dark:text-gray-300"
                    }
                    group-hover:shadow-md
                  `}
                >
                  {isConnectionQuestion ? (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Link Connections
                    </>
                  ) : (
                    <>🔍 View</>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // ========== POINT BLANK LAYOUT - Numbered List with Rapid Fire Theme ==========
  const PointBlankLayout = () => (
    <div className="space-y-3">
      {/* Rapid Fire Badge */}
      <div className="flex justify-center mb-6">
        <Badge
          variant="outline"
          className="text-sm px-4 py-2 bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
        >
          ⚡ Rapid Fire Round
        </Badge>
      </div>

      {questions.map((question: QuestionItem, index: number) => (
        <Card
          key={index}
          className={`
            group transition-all duration-200
            hover:shadow-lg hover:scale-[1.01]
            dark:hover:shadow-green-900/20
            border-l-4 border-l-green-500 dark:border-l-green-600
            dark:bg-gray-800/50 dark:border-gray-700
            relative overflow-hidden
          `}
        >
          {/* Speed indicator stripe */}
          <div
            className="
              absolute left-0 top-0 bottom-0 w-1
              bg-linear-to-b from-green-400 to-green-600
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            "
          />

          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1 flex items-center gap-3">
                {/* Numbered circle */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 border-2 border-green-500 dark:border-green-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {question.display_text}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Question {question.q_no}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-0 ml-4 font-mono">
                #{question.q_no}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <Link href={genURL(question.q_no)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 group-hover:shadow-md"
              >
                🎯 View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ========== CATEGORY LAYOUT (OYF) - Thematic Cards ==========
  const CategoryLayout = () => {
    // Category-specific styling
    const categoryColors: Record<string, string> = {
      literature: "from-orange-400 to-orange-600",
      history: "from-amber-400 to-amber-600",
      music: "from-purple-400 to-purple-600",
      sports: "from-blue-400 to-blue-600",
      mythology: "from-indigo-400 to-indigo-600",
      defence: "from-red-400 to-red-600",
      world: "from-green-400 to-green-600",
      "mystery box": "from-gray-400 to-gray-600",
    };

    const categoryEmojis: Record<string, string> = {
      literature: "📚",
      history: "📜",
      music: "🎵",
      sports: "⚽",
      mythology: "⚡",
      defence: "🛡️",
      world: "🌍",
      "mystery box": "🎁",
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question: QuestionItem, index: number) => {
          const categoryKey = question.q_no.toLowerCase();
          const gradient = categoryColors[categoryKey] || categoryColors.world;
          const emoji = categoryEmojis[categoryKey] || "📌";

          return (
            <Link key={index} href={genURL(question.q_no)}>
              <Card
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
                className={`
                  animate-in fade-in slide-in-from-bottom-2
                  group cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl hover:scale-[1.03]
                  dark:bg-gray-800/50 dark:border-gray-700
                  border-2 hover:border-orange-300 dark:hover:border-orange-600
                  relative overflow-hidden
                  h-full min-h-35
                `}
              >
                {/* Gradient background */}
                <div
                  className={`
                    absolute inset-0 
                    bg-linear-to-br ${gradient}
                    opacity-0 group-hover:opacity-10
                    transition-opacity duration-300
                  `}
                />

                {/* Top accent line */}
                <div
                  className={`
                    absolute top-0 left-0 right-0 h-1
                    bg-linear-to-r ${gradient}
                    opacity-50 group-hover:opacity-100
                    transition-opacity duration-300
                  `}
                />

                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {emoji}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {question.display_text}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    Explore {question.display_text.toLowerCase()} questions →
                  </p>
                </CardContent>

                {/* Corner decoration */}
                <div
                  className="
                    absolute bottom-0 right-0 w-20 h-20
                    bg-linear-to-tl from-orange-200/20 to-transparent
                    dark:from-orange-800/20
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    rounded-tl-full
                  "
                />
              </Card>
            </Link>
          );
        })}
      </div>
    );
  };

  // ========== MOVIE MANIA LAYOUT - Cinema Theme ==========
  const MovieManiaLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {questions.map((question: QuestionItem, index: number) => (
        <Card
          key={index}
          style={{
            animationDelay: `${index * 70}ms`,
          }}
          className={`
            animate-in fade-in slide-in-from-bottom-3 duration-500
            group transition-all
            hover:shadow-2xl hover:scale-[1.03]
            dark:bg-gray-800/50 dark:border-gray-700
            border-2 hover:border-red-300 dark:hover:border-red-600
            relative overflow-hidden
            cursor-pointer
          `}
        >
          {/* Film strip decoration */}
          <div
            className="
              absolute left-0 top-0 bottom-0 w-2
              bg-linear-to-b from-red-500 via-red-600 to-red-500
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          >
            <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-around py-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-1 bg-gray-900 dark:bg-gray-100"
                />
              ))}
            </div>
          </div>

          {/* Spotlight effect */}
          <div
            className="
              absolute inset-0 
              bg-linear-to-br from-red-400/10 via-transparent to-yellow-400/10
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              pointer-events-none
            "
          />

          <CardHeader className="relative z-10 pl-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  <Film className="h-5 w-5" />
                  {question.display_text}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Question {question.q_no}
                </CardDescription>
              </div>
              <Badge className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-0 ml-4 font-mono">
                #{question.q_no}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10 pl-6">
            <Link href={genURL(question.q_no)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 group-hover:shadow-md"
              >
                🎬 View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`
                p-4 rounded-2xl 
                ${accentClasses.bg} ${accentClasses.bgDark} 
                ${accentClasses.border} ${accentClasses.borderDark} 
                border-2
                shadow-lg
                animate-in zoom-in duration-500
              `}
            >
              <IconComponent
                className={`h-10 w-10 ${accentClasses.text} ${accentClasses.textDark}`}
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {config.description}
          </p>
          <Badge
            variant="outline"
            className="mt-4 dark:border-gray-700 dark:text-gray-300 text-base px-4 py-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
          >
            {questions.length}{" "}
            {config.slug === "on-your-fingertips" ? "Categories" : "Questions"}
          </Badge>
        </div>

        {/* Dynamic Content Based on Round */}
        <div className="mb-12">{renderContent()}</div>

        {/* Back Navigation */}
        <div className="mt-12 text-center animate-in fade-in duration-1000 delay-300">
          <Link href="/quiz/interschool">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">
                ←
              </span>{" "}
              Back to All Rounds
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
