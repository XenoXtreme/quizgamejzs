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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Authorizing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <Card className="overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* ===== Header Section ===== */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={showAns ? "default" : "secondary"}
                className="px-3 py-1.5 text-xs md:text-sm"
              >
                {showAns ? "📋 Answer" : "❓ Question"}
              </Badge>
              <Badge className="px-3 py-1.5 text-xs md:text-sm bg-blue-600 hover:bg-blue-700">
                {getRoundFullName(round)}
              </Badge>
              <a
                href="/quiz/$"
                className="text-xs md:text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 underline font-semibold transition-colors"
              >
                ← Back to Quiz
              </a>
            </div>

            {/* Question number display */}
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Question {qno}
              </h1>
              {limit && (
                <span className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                  of {limit}
                </span>
              )}
            </div>
          </div>

          {/* ===== Media Content Section ===== */}
          <div className="w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-2">
            <Component {...getComponentProps()} />
          </div>

          {/* ===== Navigation & Controls Section ===== */}
          <div className="flex flex-col gap-4">
            {/* Main control buttons */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center sm:justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Go to previous question"
                disabled={isPrevDisabled}
                onClick={goToPrevious}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label={showAns ? "Show question" : "Show answer"}
                onClick={toggleAnswer}
                className="gap-2"
              >
                <StretchHorizontal className="w-4 h-4" />
                <span>{showAns ? "Show Question" : "Show Answer"}</span>
                <span className="ml-1 text-xs opacity-70">A</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Go to next question"
                disabled={isNextDisabled}
                onClick={goToNext}
                className="gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Processing state */}
            {pendingToggle && (
              <div className="flex flex-col gap-2 items-center py-4 px-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-300">
                  Processing...
                </span>
              </div>
            )}
          </div>

          {/* ===== Confirmation Dialog ===== */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  <DialogTitle>Confirm Toggle</DialogTitle>
                </div>
                <DialogDescription>
                  {`Do you want to show the ${showAns ? "question" : "answer"}?`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={handleModalCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleModalConfirm}
                  className="w-full sm:w-auto"
                >
                  Yes, Show {showAns ? "Question" : "Answer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ===== Keyboard Shortcuts Help ===== */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 flex gap-3">
            <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                💡 Keyboard Shortcuts
              </span>
              <ul className="text-xs md:text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    ←
                  </kbd>{" "}
                  Previous Question
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    →
                  </kbd>{" "}
                  Next Question
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    A
                  </kbd>{" "}
                  Toggle Q&A
                </li>
              </ul>
            </div>
          </div>

          {/* ===== Info Footer ===== */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>
              Interschool Quiz • Round:{" "}
              <span className="font-semibold">{getRoundFullName(round)}</span> •
              Question <span className="font-semibold">{qno}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
