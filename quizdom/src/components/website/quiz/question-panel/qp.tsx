"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Card, Spinner, Badge, Modal, ModalBody, ModalHeader } from "flowbite-react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiSwitchHorizontal,
  HiInformationCircle,
} from "react-icons/hi";

import Component from "./component";
import { ContextType } from "@/context/auth/context";
import { useAuthContext } from "@/context/auth/state";

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

  // Check if navigation should be disabled
  const isPrevDisabled = Number(qno) <= 1;
  const isNextDisabled = limit ? Number(qno) >= Number(limit) : false;

  // Navigation URL helpers
  const getNextURL = () => {
    if (!isNextDisabled) {
      return path.replace(`${qno}`, `${Number(qno) + 1}`);
    }
    return "";
  };

  const getPrevURL = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl overflow-visible rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge color={showAns ? "success" : "info"} size="sm" className="cursor-pointer px-3 py-1 rounded-lg shadow">
              {showAns ? "Answer" : "Question"}
            </Badge>
            <Badge color="purple" size="sm" className="cursor-pointer px-3 py-1 rounded-lg shadow">
              {getRoundFullName(round)}
            </Badge>
            <Badge color="dark" size="sm" className="px-3 py-1 rounded-lg shadow">
              <a href={"/quiz/" + category}>{getCategoryName(category)}</a>
            </Badge>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Question {qno} {limit ? <span className="text-gray-400 dark:text-gray-500">of {limit}</span> : ""}
          </div>
        </div>

        <div className="relative flex h-full w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-2 md:p-6">
          <Component {...getComponentProps()} />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 w-full">
          <Button
            color="light"
            onClick={goToPrevious}
            disabled={isPrevDisabled}
            className={`rounded-lg px-6 py-2 font-medium transition-all ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer shadow'}`}
          >
            <HiArrowLeft className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={toggleAnswer}
            className="cursor-pointer px-8 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow hover:from-blue-600 hover:to-pink-600 transition-all"
          >
            <HiSwitchHorizontal className="mr-2" />
            Show {showAns ? "Question" : "Answer"}
          </Button>

          <Button
            color="light"
            onClick={goToNext}
            disabled={isNextDisabled}
            className={`rounded-lg px-6 py-2 font-medium transition-all ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer shadow'}`}
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
                <Button color="red" className="cursor-pointer" onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button  color="default" className="cursor-pointer" onClick={handleModalConfirm}>
                  Yes, show {showAns ? "question" : "answer"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <HiInformationCircle className="mr-1" />
            Use keyboard shortcuts: <span className="font-semibold mx-1">Left/Right arrows</span> to navigate, <span className="font-semibold mx-1">A</span> to toggle question/answer
          </div>
        </div>
      </Card>
    </div>
  );
}
