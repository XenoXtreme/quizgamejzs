"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  StretchHorizontal,
  Info,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import Component from "./components";
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";
import { InterSch } from "@/types/qns-structures";

interface QNSProps {
  qno: string;
  quizCategory: string;
  round: string;
  type: string;
  path: string;
  limit?: string;
}

/**
 * Helper: Convert round code to full display name
 */
function getRoundFullName(round: string): string {
  const roundMap: Record<string, string> = {
    mm: "Movie Mania",
    oyo: "On Your Own",
    pbk: "Point Blank",
    cc: "Connections",
    oyf: "On Your Fingertips",
    pnb: "Pounce Bounce",
    "tie-breaker": "Tie Breaker",
  };
  return roundMap[round] || `Unknown Round (${round})`;
}

/**
 * Helper: Convert category code to full display name
 */
function getCategoryFullName(category: string): string {
  const categoryMap: Record<string, string> = {
    interschool: "Interschool",
    intraschool: "Intraschool",
    test: "Test Quiz",
  };
  return categoryMap[category] || `Unknown Category (${category})`;
}

/**
 * QuestionPanel Component
 * Displays quiz questions with media, navigation, and Q&A toggle
 * Features:
 * - Authorization checks (ADMIN only)
 * - Keyboard navigation (arrows, A key)
 * - Confirm dialog for Q&A toggling
 * - OYF (On Your Fingertips) special handling
 * - Media interlock (audio/video pause each other)
 */
export default function QuestionPanel({
  qno,
  round,
  type,
  limit,
  quizCategory,
  path,
}: QNSProps) {
  // Get file extension based on content type
  function getExtension(type: string): string {
    if (type === "img") return "png";
    if (type === "video") return "mp4";
    return "mp3"; // audio and visualaudio
  }

  // ========== State ==========
  const [showAns, setShowAns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extension] = useState(getExtension(type));
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);

  // ========== Router & Auth ==========
  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "";
  const router = useRouter();
  const context = useAuthContext();
  const { team }: ContextType = context;

  // ========== URIs ==========
  const questionURI = `${CDN_URI}/assets/quiz/${quizCategory}/${round}/${type}/${qno}.${extension}`;
  const answerURI = `${CDN_URI}/assets/quiz/${quizCategory}/${round}/${type}/ans/${qno}.${extension}`;

  // ========== Navigation Helpers ==========
  const getOYFKeys = () => InterSch.oyf.map((q) => q.q_no);

  const isPrevDisabled =
    round === "oyf" ? qno === "literature" : Number(qno) <= 1;

  const isNextDisabled =
    round === "oyf"
      ? qno === "mystery"
      : limit
        ? Number(qno) >= Number(limit)
        : false;

  const getPrevUrlForOYF = (): string => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    return idx > 0 ? path.replace(`${qno}`, `${keys[idx - 1]}`) : "";
  };

  const getNextUrlForOYF = (): string => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    return idx !== -1 && idx < keys.length - 1
      ? path.replace(`${qno}`, `${keys[idx + 1]}`)
      : "";
  };

  const getNextURL = (): string => {
    if (round === "oyf") return getNextUrlForOYF();
    return !isNextDisabled ? path.replace(`${qno}`, `${Number(qno) + 1}`) : "";
  };

  const getPrevURL = (): string => {
    if (round === "oyf") return getPrevUrlForOYF();
    return !isPrevDisabled ? path.replace(`${qno}`, `${Number(qno) - 1}`) : "";
  };

  // ========== Actions ==========
  const toggleAnswer = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setPendingToggle(true);
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    setShowAns((prev) => !prev);
    setModalOpen(false);
    setPendingToggle(false);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingToggle(false);
  };

  const goToPrevious = () => {
    if (!isPrevDisabled) router.push(getPrevURL());
  };

  const goToNext = () => {
    if (!isNextDisabled) router.push(getNextURL());
  };

  // ========== Authorization Check ==========
  useEffect(() => {
    if (team.role) {
      if (team.role !== "ADMIN") {
        router.push(`${path.replace(qno, "")}`);
        toast.error("You are not authorized to access this content.");
      } else {
        setLoading(false);
      }
    }
  }, [team, router, path, qno]);

  // ========== Keyboard Shortcuts ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger on input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      // Don't navigate while modal is open
      if (modalOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          if (!isPrevDisabled) goToPrevious();
          break;
        case "ArrowRight":
          if (!isNextDisabled) goToNext();
          break;
        case "a":
        case "A":
          e.preventDefault();
          toggleAnswer(e as unknown as React.SyntheticEvent);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPrevDisabled, isNextDisabled, showAns, modalOpen]);

  // ========== Component Props Builder ==========
  const getComponentProps = () => {
    if (type === "visualaudio") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/img/${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/audio/${qno}.mp3`,
          alt: `${getCategoryFullName(quizCategory)} - Round: ${getRoundFullName(round)} - Q${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/img/ans/${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/audio/ans/${qno}.mp3`,
          alt: `${getCategoryFullName(quizCategory)} - Round: ${getRoundFullName(round)} - Q${qno} (Answer)`,
          type,
        };
      }
    } else if (type === "visualvideoans") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/img/${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/video/${qno}.mp4`,
          alt: `${getCategoryFullName(quizCategory)} - Round: ${getRoundFullName(round)} - Q${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/img/ans/${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${quizCategory}/${round}/video/ans/${qno}.mp4`,
          alt: `${getCategoryFullName(quizCategory)} - Round: ${getRoundFullName(round)} - Q${qno} (Answer)`,
          type,
        };
      }
    } else {
      return {
        URI: showAns ? answerURI : questionURI,
        alt: `${getCategoryFullName(quizCategory)} - Round: ${getRoundFullName(round)} - Q${qno}${showAns ? " (Answer)" : ""}`,
        type,
      };
    }
  };

  // ========== Render ==========
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Authorizing access
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Verifying permissions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-3xl md:max-w-5xl  mx-auto py-8 md:py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="overflow-hidden border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="p-6 md:p-10 flex flex-col gap-8">
            {/* ===== Header Section ===== */}
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={showAns ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    showAns
                      ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {showAns ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
                      Answer
                    </>
                  ) : (
                    "Question"
                  )}
                </Badge>
                <Badge className="px-4 py-2 text-sm font-medium bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300">
                  {getRoundFullName(round)}
                </Badge>
                <a
                  href="/quiz/$"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-4 font-medium transition-colors duration-200 ml-auto"
                >
                  ← Back
                </a>
              </div>

              {/* Question number display */}
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Question {qno}
                </h1>
                {limit && (
                  <span className="text-base md:text-lg text-gray-500 dark:text-gray-500 font-medium">
                    of {limit}
                  </span>
                )}
              </div>
            </div>

            {/* ===== Media Content Section ===== */}
            <div className="w-full rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-1 shadow-inner animate-in fade-in zoom-in-95 duration-500 delay-150">
              <div className="rounded-xl overflow-hidden bg-white dark:bg-black">
                <Component {...getComponentProps()} />
              </div>
            </div>

            {/* ===== Navigation & Controls Section ===== */}
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              {/* Main control buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  aria-label="Go to previous question"
                  disabled={isPrevDisabled}
                  onClick={goToPrevious}
                  className="flex-1 gap-2 h-12 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  aria-label={showAns ? "Show question" : "Show answer"}
                  onClick={toggleAnswer}
                  className="flex-1 gap-2 h-12 font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <StretchHorizontal className="w-4 h-4" />
                  <span>{showAns ? "Show Question" : "Show Answer"}</span>
                  <kbd className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded">
                    A
                  </kbd>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  aria-label="Go to next question"
                  disabled={isNextDisabled}
                  onClick={goToNext}
                  className="flex-1 gap-2 h-12 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Processing state */}
              {pendingToggle && (
                <div className="flex flex-col gap-3 items-center py-6 px-4 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping opacity-30">
                      <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Processing request...
                  </span>
                </div>
              )}
            </div>

            {/* ===== Confirmation Dialog ===== */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="sm:max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl border-gray-200 dark:border-gray-800">
                <DialogHeader className="gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                      Confirm Toggle
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                    {`Do you want to show the ${showAns ? "question" : "answer"}?`}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={handleModalCancel}
                    className="flex-1 h-11 font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleModalConfirm}
                    className="flex-1 h-11 font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                  >
                    Yes, Show {showAns ? "Question" : "Answer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ===== Keyboard Shortcuts Help ===== */}
            <div className="rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-linear-to-br from-gray-50/50 to-transparent dark:from-gray-900/50 p-5 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
              <div className="p-2 h-fit rounded-lg bg-blue-100 dark:bg-blue-950/50">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Keyboard Shortcuts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <kbd className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold shadow-sm">
                      ←
                    </kbd>
                    <span className="text-xs">Previous</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <kbd className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold shadow-sm">
                      →
                    </kbd>
                    <span className="text-xs">Next</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <kbd className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold shadow-sm">
                      A
                    </kbd>
                    <span className="text-xs">Toggle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Info Footer ===== */}
            <div className="text-xs text-gray-500 dark:text-gray-500 text-center pt-6 border-t border-gray-200/50 dark:border-gray-800/50 space-y-1 animate-in fade-in duration-500 delay-700">
              <p className="font-medium">
                {getCategoryFullName(quizCategory)} Quiz
              </p>
              <p>
                <span className="text-gray-400 dark:text-gray-600">Round:</span>{" "}
                {getRoundFullName(round)}{" "}
                <span className="text-gray-400 dark:text-gray-600">•</span>{" "}
                <span className="text-gray-400 dark:text-gray-600">
                  Question:
                </span>{" "}
                {qno}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
