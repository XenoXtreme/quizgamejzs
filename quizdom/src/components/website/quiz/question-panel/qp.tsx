"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Card, Spinner, Badge } from "flowbite-react";
import { HiArrowLeft, HiArrowRight, HiSwitchHorizontal, HiInformationCircle } from "react-icons/hi";

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
    return '';
  };

  const getPrevURL = () => {
    if (!isPrevDisabled) {
      return path.replace(`${qno}`, `${Number(qno) - 1}`);
    }
    return '';
  };

  // Toggle between question and answer
  const toggleAnswer = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Confirm with the user
    if (window.confirm(`Do you want to show the ${showAns ? "question" : "answer"}?`)) {
      setShowAns(!showAns);
      toast.success(`Successfully updated to show ${showAns ? "question" : "answer"}`);
    }
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
        router.push(`${path.replace(qno, '')}`);
        toast.error("You are not authorized to access this content.");
      } else {
        setLoading(false);
      }
    }
  }, [team, router, path, qno]);

  // Keyboard navigation support
  useEffect(() => {
    console.log(type)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent handling if user is typing in an input field
      if (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (!isPrevDisabled) goToPrevious();
          break;
        case 'ArrowRight':
          if (!isNextDisabled) goToNext();
          break;
        case ' ':
          // Prevent scrolling with spacebar
          e.preventDefault();
          toggleAnswer(e as unknown as React.SyntheticEvent);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPrevDisabled, isNextDisabled, showAns]);

  // Prepare visualization URIs for special content types - with fixed type handling
  const getComponentProps = () => {
    if (type === "visualaudio") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/audio/${round}-${qno}.mp3`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/audio/ans/${round}-${qno}.mp3`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type
        };
      }
    } else if (type === "visualvideoans") {
      if (!showAns) {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/video/${round}-${qno}.mp4`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}`,
          type
        };
      } else {
        return {
          URI: `${CDN_URI}/assets/quiz/${category}/img/ans/${round}-${qno}.png`,
          vURI: `${CDN_URI}/assets/quiz/${category}/video/ans/${round}-${qno}.mp4`,
          alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno} (Answer)`,
          type
        };
      }
    } else {
      return {
        URI: showAns ? answerURI : questionURI,
        alt: `${getCategoryName(category)} - Round: ${getRoundFullName(round)} - Q-${qno}${showAns ? " (Answer)" : ""}`,
        type
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
  }

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
  }

  // Render loading spinner if still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-4 md:p-8">
      <Card className="max-w-6xl mx-auto overflow-visible">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Badge color={showAns ? "success" : "info"} size="sm">
              {showAns ? "Answer" : "Question"}
            </Badge>
            <Badge color="purple" size="sm">
              {getRoundFullName(round)}
            </Badge>
            <Badge color="dark" size="sm">
              <a href={"/quiz/" + category}>{getCategoryName(category)}</a>
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            Question {qno} {limit ? `of ${limit}` : ''}
          </div>
        </div>

        <div className="relative w-full h-full flex-1 flex items-center justify-center">
          <Component {...getComponentProps()} />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 w-full">
          <Button
            color="light"
            onClick={goToPrevious}
            disabled={isPrevDisabled}
            className={isPrevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'}
          >
            <HiArrowLeft className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={toggleAnswer}
            className="px-6 py-2 cursor-pointer"
          >
            <HiSwitchHorizontal className="mr-2" />
            Show {showAns ? "Question" : "Answer"}
          </Button>

          <Button
            color="light"
            onClick={goToNext}
            disabled={isNextDisabled}
            className={isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'}
          >
            Next
            <HiArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <HiInformationCircle className="mr-1" />
            Use keyboard shortcuts: Left/Right arrows to navigate, Space to toggle question/answer
          </div>
        </div>
      </Card>
    </div>
  );
}