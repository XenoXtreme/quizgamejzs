"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Button,
  Card,
  Spinner,
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiSwitchHorizontal,
  HiInformationCircle,
} from "react-icons/hi";

import Component from "./component";
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";
import { InterSch } from "@/types/qns-structures";

interface QNSProps {
  qno: string;
  round: string;
  type: string;
  path: string;
  limit?: string;
}

export default function QuestionPanel({
  qno,
  round,
  type,
  limit,
  path,
}: QNSProps) {
  // Helper function to get file extension based on content type
  function getExtension(type: string) {
    if (type === "img") {
      return "png";
    } else if (type === "video") {
      return "mp4";
    } else {
      return "mp3";
    }
  }

  // State
  const [showAns, setShowAns] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [extension] = useState<string>(getExtension(type));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pendingToggle, setPendingToggle] = useState<boolean>(false);

  // CDN URI
  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "";

  // Question and answer URIs
  const questionURI = `${CDN_URI}/assets/quiz/interschool/${type}/${round}-${qno}.${extension}`;
  const answerURI = `${CDN_URI}/assets/quiz/interschool/${type}/ans/${round}-${qno}.${extension}`;

  // Router
  const router = useRouter();

  // Context for authorization
  const context = useAuthContext();
  const { team }: ContextType = context;

  // Helper: Get OYF question keys in order
  const getOYFKeys = () => InterSch.oyf.map((q) => q.q_no);

  // Helper: Get tie-breaker keys in order (manually listed)
  const getTieBreakerKeys = () => ["tb1", "tb2"]; // Add more as needed

  // Helper: Are we in OYF or tie-breaker mode?
  const isOYF = round === "oyf" && getOYFKeys().includes(qno);
  const isTieBreaker = getTieBreakerKeys().includes(qno);

  // OYF navigation
  const getPrevUrlForOYF = () => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    if (idx > 0) {
      return path.replace(`${qno}`, `${keys[idx - 1]}`);
    }
    return "";
  };
  const getNextUrlForOYF = () => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    if (idx !== -1 && idx < keys.length - 1) {
      return path.replace(`${qno}`, `${keys[idx + 1]}`);
    }
    return "";
  };

  // Tie-breaker navigation
  const getPrevUrlForTieBreaker = () => {
    const keys = getTieBreakerKeys();
    const idx = keys.indexOf(qno);
    if (idx > 0) {
      return path.replace(`${qno}`, `${keys[idx - 1]}`);
    }
    return "";
  };
  const getNextUrlForTieBreaker = () => {
    const keys = getTieBreakerKeys();
    const idx = keys.indexOf(qno);
    if (idx !== -1 && idx < keys.length - 1) {
      return path.replace(`${qno}`, `${keys[idx + 1]}`);
    }
    return "";
  };

  // Disabled logic: OYF, tie-breaker, else default
  const isPrevDisabled = isOYF
    ? getOYFKeys()[0] === qno
    : isTieBreaker
      ? getTieBreakerKeys()[0] === qno
      : Number(qno) <= 1;

  const isNextDisabled = isOYF
    ? getOYFKeys().slice(-1)[0] === qno
    : isTieBreaker
      ? getTieBreakerKeys().slice(-1)[0] === qno
      : limit
        ? Number(qno) >= Number(limit)
        : false;

  // Navigation URL helpers: OYF, tie-breaker, else default
  const getNextURL = () => {
    if (isOYF) {
      return getNextUrlForOYF();
    }
    if (isTieBreaker) {
      return getNextUrlForTieBreaker();
    }
    if (!isNextDisabled) {
      return path.replace(`${qno}`, `${Number(qno) + 1}`);
    }
    return "";
  };

  const getPrevURL = () => {
    if (isOYF) {
      return getPrevUrlForOYF();
    }
    if (isTieBreaker) {
      return getPrevUrlForTieBreaker();
    }
    if (!isPrevDisabled) {
      return path.replace(`${qno}`, `${Number(qno) - 1}`);
    }
    return "";
  };

  // Toggle between question and answer
  const toggleAnswer = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPendingToggle(true);
    setModalOpen(true);
  };

  // Confirm modal action
  const handleModalConfirm = () => {
    setShowAns((prev) => !prev);
    setModalOpen(false);
    setPendingToggle(false);
  };

  // Cancel modal action
  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingToggle(false);
  };

  // Navigate to previous question
  const goToPrevious = () => {
    if (!isPrevDisabled) {
      router.push(getPrevURL());
    }
    return;
  };

  // Navigate to next question
  const goToNext = () => {
    if (!isNextDisabled) {
      router.push(getNextURL());
    }
    return;
  };

  // Check authorization on component mount
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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (modalOpen) return; // Prevent navigation while modal is open

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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPrevDisabled, isNextDisabled, showAns, modalOpen]);

  // Prepare visualization URIs for special content types - with fixed type handling
  const getComponentProps = () => {
    if (type === "visualaudio") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/interschool/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/interschool/audio/${round}-${qno}.mp3`,
          alt: `Interschool - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/interschool/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/interschool/audio/ans/${round}-${qno}.mp3`,
          alt: `Interschool - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type,
        };
      }
    } else if (type === "visualvideoans") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/interschool/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/interschool/video/${round}-${qno}.mp4`,
          alt: `Interschool - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/interschool/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/interschool/video/ans/${round}-${qno}.mp4`,
          alt: `Interschool - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type,
        };
      }
    } else {
      return {
        URI: showAns ? answerURI : questionURI,
        alt: `Interschool - Round: ${getRoundFullName(round)} - Q-${qno}${showAns ? " (Answer)" : ""}`,
        type,
      };
    }
  };

  const getRoundFullName = (round: string) => {
    switch (round) {
      case "mm":
        return "Movie Mania";
      case "oyo":
        return "On Your Own";
      case "pbk":
        return "Point Blank";
      case "cc":
        return "Connections";
      case "oyf":
        return "On Your Fingertips";
      case "pnb":
        return "Pounce Bounce";
      case "audience":
        return "Audience Engagement";
      default:
        return "Unknown Round";
    }
  };

  // Render loading spinner if still loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-2 sm:p-4 md:p-8 dark:bg-gray-950">
      <Card className="mx-auto w-full max-w-6xl overflow-visible rounded-3xl border-2 border-pink-200 bg-white shadow-2xl ring-2 ring-pink-100/40 dark:border-pink-900 dark:bg-gray-900 dark:ring-pink-900/30">
        <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex flex-wrap items-center space-x-2">
            <Badge
              color={showAns ? "success" : "info"}
              size="sm"
              className="mb-1 cursor-pointer rounded-lg border px-3 py-1 text-pink-900 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg sm:mb-0 dark:border-pink-900"
            >
              {showAns ? "Answer" : "Question"}
            </Badge>
            <Badge
              color="purple"
              size="sm"
              className="mb-1 cursor-pointer rounded-lg border px-3 py-1 text-purple-900 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg sm:mb-0 dark:border-pink-900"
            >
              {getRoundFullName(round)}
            </Badge>
            <Badge
              color="gray"
              size="sm"
              className="mb-1 rounded-lg border border-pink-100 bg-white px-3 py-1 text-gray-700 shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:shadow-lg sm:mb-0 dark:border-pink-900 dark:bg-pink-900 dark:text-gray-200 dark:hover:bg-pink-800"
            >
              <a href="/quiz/interschool">Interschool</a>
            </Badge>
          </div>
          <div className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
            {qno.startsWith("tb")
              ? `Tie Breaker ${qno.replace("tb", "")}`
              : `Question ${qno}`}
            {limit ? (
              <span className="ml-[3.5] text-gray-400 dark:text-gray-500">
                of {limit}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="block flex-1 items-center justify-center rounded-2xl bg-white p-1 sm:h-[80vh] sm:w-[89vw] sm:p-2 md:h-full md:w-full md:p-6 dark:bg-gray-900">
          <Component {...getComponentProps()} />
        </div>

        <div className="mt-6 flex w-full flex-col flex-wrap items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <Button
            color="light"
            onClick={goToPrevious}
            disabled={isPrevDisabled}
            className={`rounded-lg border border-pink-100 bg-pink-100 px-4 py-2 font-medium text-blue-900 shadow-md transition-all sm:px-6 dark:border-pink-900 dark:bg-pink-900 dark:text-blue-100 ${isPrevDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-pink-200/80 dark:hover:bg-pink-800/80"} w-full sm:w-auto`}
          >
            <HiArrowLeft className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={toggleAnswer}
            className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 via-pink-400 to-pink-500 px-6 py-2 font-semibold text-white shadow-lg ring-2 ring-pink-100/40 transition-all hover:from-blue-600 hover:via-pink-500 hover:to-pink-600 sm:w-auto sm:px-8 dark:ring-pink-900/30"
          >
            <HiSwitchHorizontal className="mr-2" />
            Show {showAns ? "Question" : "Answer"}
          </Button>

          <Button
            color="light"
            onClick={goToNext}
            disabled={isNextDisabled}
            className={`rounded-lg border border-pink-100 bg-pink-100 px-4 py-2 font-medium text-blue-900 shadow-md transition-all sm:px-6 dark:border-pink-900 dark:bg-pink-900 dark:text-blue-100 ${isNextDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-pink-200/80 dark:hover:bg-pink-800/80"} w-full sm:w-auto`}
          >
            Next
            <HiArrowRight className="ml-2" />
          </Button>
        </div>
        {pendingToggle && (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            <Spinner size="sm" />
            <span className="ml-2">Processing...</span>
          </div>
        )}
        <Modal show={modalOpen} size="md" onClose={handleModalCancel} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiSwitchHorizontal className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              <h3 className="mb-5 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Do you want to show the {showAns ? "question" : "answer"}?
              </h3>
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  color="red"
                  className="cursor-pointer"
                  onClick={handleModalCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="default"
                  className="cursor-pointer"
                  onClick={handleModalConfirm}
                >
                  Yes, show {showAns ? "question" : "answer"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <div className="mt-4 text-center sm:mt-6">
          <div className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 sm:flex-row sm:gap-2 dark:text-gray-400">
            <span className="flex items-center">
              <HiInformationCircle className="mr-1" />
              Use keyboard shortcuts:
            </span>
            <span className="mx-1 font-semibold">Left/Right arrows</span> to
            navigate,
            <span className="mx-1 font-semibold">A</span> to toggle
            question/answer
          </div>
        </div>
      </Card>
    </div>
  );
}
