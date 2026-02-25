"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

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
  limit?: string | number;
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
    tiebreaker: "Tie Breaker",
    test: "Test Quiz",
    audience: "Audience",
  };
  return roundMap[round] || `Unknown Round (${round})`;
}

/**
 * Helper: Convert round code to full display name
 */
function getRoundURLFormat(round: string): string {
  const roundMap: Record<string, string> = {
    mm: "movie-mania",
    oyo: "on-your-own",
    pbk: "point-blank",
    cc: "connections",
    oyf: "on-your-fingertips",
    pnb: "pounce-bounce",
    tiebreaker: "tie-breaker",
  };
  return roundMap[round] || "unknown-round";
}

/**
 * Helper: Convert category code to full display name
 */
function getCategoryFullName(category: string): string {
  const categoryMap: Record<string, string> = {
    interschool: "Interschool",
    intraschool: "Intraschool",
    audience: "Audience",
    test: "Test Quiz",
  };
  return categoryMap[category] || `Unknown Category (${category})`;
}

/**
 * Helper: Convert qno into meaningful text
 */
function getQnoText(qno: string | number) {
  if (typeof qno === "string") {
    return qno.charAt(0).toUpperCase() + qno.slice(1);
  }

  return qno;
}

/**
 * QuestionPanel Component
 * Minimalistic, modern design inspired by Vercel + Google aesthetics
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
  const [showAns, setShowAns] = useState<boolean>(false);
  const [extension] = useState<string>(getExtension(type));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pendingToggle, setPendingToggle] = useState<boolean>(false);

  // ========== Router & Auth ==========
  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "";
  const router = useRouter();
  const context = useAuthContext();
  const { team }: ContextType = context;

  // ========== URIs ==========
  const questionURI = `/assets/quiz/${quizCategory}/${round}/${type}/${qno}.${extension}`;
  const answerURI = `/assets/quiz/${quizCategory}/${round}/${type}/ans/${qno}.${extension}`;

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
  const isAdmin = team.role === "ADMIN";
  const loading = !team.role;
  useEffect(() => {
    if (team.role && !isAdmin) {
      router.push(path.replace(qno, ""));
      toast.error("You are not authorized to access this content.");
    }
  }, [team.role, isAdmin, router, path, qno]);

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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
            Verifying access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="w-full max-w-2xl md:max-w-5xl mx-auto px-4 py-9 md:py-14">
        {/* ===== Header Section ===== */}
        <header className="mb-12 space-y-6">
          {/* Breadcrumb & Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <a
              href="/quiz"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Quiz
            </a>
            <span>/</span>
            <a
              href={
                quizCategory === "audience"
                  ? `/quiz/audience`
                  : `/quiz/${quizCategory}`
              }
              className="cursor-pointer text-gray-900 dark:text-gray-100"
            >
              {getCategoryFullName(quizCategory)}
            </a>
            {quizCategory !== "audience" && (
              <span className="flex items-center gap-1">
                <span>/</span>
                <a
                  href={`/quiz/${quizCategory}/round/${getRoundURLFormat(round)}`}
                  className="cursor-pointer text-gray-900 dark:text-gray-100"
                >
                  {getRoundFullName(round)}
                </a>
              </span>
            )}
          </div>

          {/* Question Title */}
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {getQnoText(qno)}
            </h1>
            {limit && (
              <span className="text-lg text-gray-400 dark:text-gray-600">
                / {limit}
              </span>
            )}
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            {showAns ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Answer visible
                </span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Question
                </span>
              </>
            )}
          </div>
        </header>

        {/* ===== Media Content Section ===== */}
        <div className="mb-12">
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <Component {...getComponentProps()} />
          </div>
        </div>

        {/* ===== Controls Section ===== */}
        <div className="space-y-8">
          {/* Main Actions */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isPrevDisabled}
              onClick={goToPrevious}
              className="h-11 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={toggleAnswer}
              className="h-11  bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium"
            >
              {showAns ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Answer
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isNextDisabled}
              onClick={goToNext}
              className="h-11 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {/* Keyboard Shortcuts */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Keyboard Shortcuts
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-sm text-[11px] font-mono font-semibold">
                    ←
                  </kbd>
                  <span>Previous question</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-sm text-[11px] font-mono font-semibold">
                    A
                  </kbd>
                  <span>Toggle answer</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-sm text-[11px] font-mono font-semibold">
                    →
                  </kbd>
                  <span>Next question</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing State */}
          {pendingToggle && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>

        {/* ===== Footer Meta ===== */}
        <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>{getCategoryFullName(quizCategory)}</span>
            <span>{getRoundFullName(round)}</span>
          </div>
        </footer>
      </div>

      {/* ===== Confirmation Dialog ===== */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirm action
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              {`Show the ${showAns ? "question" : "answer"}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleModalCancel}
              className="flex-1 h-10 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleModalConfirm}
              className="flex-1 h-10 bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
