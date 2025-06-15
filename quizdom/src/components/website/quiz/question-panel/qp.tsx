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
import { General } from "@/types/qns-structures";

interface QNSProps {
  category: string;
  qno: string;
  round: string;
  type: string;
  path: string;
  limit?: string;
}

export default function QuestionPanel({
  category,
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
  const questionURI = `${CDN_URI}/assets/quiz/${category}/${type}/${round}-${qno}.${extension}`;
  const answerURI = `${CDN_URI}/assets/quiz/${category}/${type}/ans/${round}-${qno}.${extension}`;

  // Router
  const router = useRouter();

  // Context for authorization
  const context = useAuthContext();
  const { team }: ContextType = context;

  // Helper: Get OYF question keys in order
  const getOYFKeys = () => General.oyf.map((q) => q.q_no);

  // Check if navigation should be disabled
  const isPrevDisabled =
    round === "oyf" ? qno === "literature" : Number(qno) <= 1;

  const isNextDisabled =
    round === "oyf"
      ? qno === "mystery"
      : limit
        ? Number(qno) >= Number(limit)
        : false;

  // Get previous URL for OYF round
  const getPrevUrlForOYF = () => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    if (idx > 0) {
      return path.replace(`${qno}`, `${keys[idx - 1]}`);
    }
    return "";
  };

  // Get next URL for OYF round
  const getNextUrlForOYF = () => {
    const keys = getOYFKeys();
    const idx = keys.indexOf(qno);
    if (idx !== -1 && idx < keys.length - 1) {
      return path.replace(`${qno}`, `${keys[idx + 1]}`);
    }
    return "";
  };

  // Navigation URL helpers
  const getNextURL = () => {
    if (round === "oyf") {
      return getNextUrlForOYF();
    }
    if (!isNextDisabled) {
      return path.replace(`${qno}`, `${Number(qno) + 1}`);
    }
    return "";
  };

  const getPrevURL = () => {
    if (round === "oyf") {
      return getPrevUrlForOYF();
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
  };

  // Navigate to next question
  const goToNext = () => {
    if (!isNextDisabled) {
      router.push(getNextURL());
    }
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
          URI: `${CDN_URI}/assets/quiz/${category}/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/audio/${round}-${qno}.mp3`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/audio/ans/${round}-${qno}.mp3`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type,
        };
      }
    } else if (type === "visualvideoans") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/video/${round}-${qno}.mp4`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type,
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/video/ans/${round}-${qno}.mp4`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type,
        };
      }
    } else {
      return {
        URI: showAns ? answerURI : questionURI,
        alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}${showAns ? " (Answer)" : ""}`,
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
      default:
        return "Unknown Round";
    }
  };

  // Get Category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case "intraschool/junior":
        return "Intra School Junior";
      case "intraschool/senior":
        return "Intra School Senior";
      case "interschool":
        return "Inter School";
      default:
        return "Unknown Category";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-2 sm:p-4 md:p-8 dark:from-gray-900 dark:to-gray-950">
      <Card className="mx-auto w-full max-w-6xl overflow-visible rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex flex-wrap items-center space-x-2">
            <Badge
              color={showAns ? "success" : "info"}
              size="sm"
              className="mb-1 cursor-pointer rounded-lg px-3 py-1 shadow sm:mb-0"
            >
              {showAns ? "Answer" : "Question"}
            </Badge>
            <Badge
              color="purple"
              size="sm"
              className="mb-1 cursor-pointer rounded-lg px-3 py-1 shadow sm:mb-0"
            >
              {getRoundFullName(round)}
            </Badge>
            <Badge
              color="dark"
              size="sm"
              className="mb-1 rounded-lg px-3 py-1 shadow sm:mb-0"
            >
              <a href={"/quiz/" + category}>{getCategoryName(category)}</a>
            </Badge>
          </div>
          <div className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
            Question {qno}{" "}
            {limit ? (
              <span className="text-gray-400 dark:text-gray-500">
                of {limit}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="relative flex h-full w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-1 sm:p-2 md:p-6 dark:from-gray-800 dark:to-gray-900">
          <Component {...getComponentProps()} />
        </div>

        <div className="mt-6 flex w-full flex-col flex-wrap items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <Button
            color="light"
            onClick={goToPrevious}
            disabled={isPrevDisabled}
            className={`rounded-lg px-4 py-2 font-medium transition-all sm:px-6 ${isPrevDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer shadow hover:bg-gray-200 dark:hover:bg-gray-800"} w-full sm:w-auto`}
          >
            <HiArrowLeft className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={toggleAnswer}
            className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-2 font-semibold text-white shadow transition-all hover:from-blue-600 hover:to-pink-600 sm:w-auto sm:px-8"
          >
            <HiSwitchHorizontal className="mr-2" />
            Show {showAns ? "Question" : "Answer"}
          </Button>

          <Button
            color="light"
            onClick={goToNext}
            disabled={isNextDisabled}
            className={`rounded-lg px-4 py-2 font-medium transition-all sm:px-6 ${isNextDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer shadow hover:bg-gray-200 dark:hover:bg-gray-800"} w-full sm:w-auto`}
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
