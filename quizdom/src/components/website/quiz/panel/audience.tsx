"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faUsers,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

// 20 audience engagement questions
const audienceQuestions = Array.from({ length: 20 }).map((_, i) => ({
  q_no: `${i + 1}`,
  display_text: `Audience Engagement Question ${i + 1}`,
}));

/**
 * A stylish, modular component for a single question item with enhanced animations.
 */
function QuestionListItem({
  question,
  index,
}: {
  question: { q_no: string; display_text: string };
  index: number;
}) {
  const { q_no, display_text } = question;
  const url = `/quiz/audience/${q_no}`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group animate-in fade-in slide-in-from-left-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 dark:border-gray-800 dark:from-gray-800 dark:to-gray-900 dark:hover:border-pink-500/60 dark:hover:shadow-pink-500/10"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        {/* Animated Icon Background */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 ease-out ${isHovered ? "scale-110 rotate-3 bg-blue-200/80" : ""} dark:bg-gray-700 dark:group-hover:bg-gray-600`}
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className={`text-xl text-blue-600 transition-all duration-300 ease-out dark:text-pink-400 ${isHovered ? "scale-110 rotate-12" : ""} `}
          />
        </div>

        {/* Animated Text */}
        <span
          className={`font-semibold text-gray-800 transition-all duration-300 ease-out dark:text-gray-100 ${isHovered ? "translate-x-1 text-blue-700 dark:text-pink-300" : ""} `}
        >
          {display_text}
        </span>
      </div>

      {/* Enhanced Button with Ripple Effect */}
      <Link href={url} className="ml-4 flex-shrink-0">
        <button className="relative transform-gpu cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 ease-out before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:before:opacity-100 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:from-pink-500 dark:to-fuchsia-500 dark:hover:from-pink-600 dark:hover:to-fuchsia-600 dark:focus:ring-pink-400/50">
          <span className="relative z-10 flex items-center gap-2">
            Engage
            <FontAwesomeIcon
              icon={faRocket}
              className={`text-xs transition-all duration-300 ease-out ${isHovered ? "translate-x-1 rotate-12" : ""} `}
            />
          </span>
        </button>
      </Link>
    </div>
  );
}

/**
 * The main panel component with enhanced animations and effects.
 */
export default function AudienceEngagePanel() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-gray-100/50 py-16 dark:bg-gray-950">
      {/* Animated Header */}
      <header
        className={`mb-12 flex items-center gap-4 text-center transition-all duration-700 ease-out ${isLoaded ? "animate-in fade-in slide-in-from-top-4" : "translate-y-4 opacity-0"} `}
      >
        <div className="relative">
          <FontAwesomeIcon
            icon={faUsers}
            className="animate-pulse text-4xl text-blue-600 drop-shadow-sm transition-all duration-300 hover:animate-bounce dark:text-pink-400"
          />
          {/* Animated Ring */}
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-300/30 dark:border-pink-300/30" />
        </div>

        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-gray-900 transition-transform duration-300 hover:scale-105 dark:from-pink-400 dark:to-fuchsia-400 dark:text-white">
          Audience Engagement
        </h1>
      </header>

      {/* Animated Question List */}
      <div
        className={`w-full max-w-3xl space-y-4 px-4 transition-all duration-500 ease-out ${isLoaded ? "animate-in fade-in slide-in-from-bottom-8" : "translate-y-8 opacity-0"} `}
      >
        {audienceQuestions.map((question, index) => (
          <QuestionListItem
            key={question.q_no}
            question={question}
            index={index}
          />
        ))}
      </div>

      {/* Animated Bottom Gradient */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 animate-pulse bg-gradient-to-t from-blue-500/5 to-transparent dark:from-pink-500/5" />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: animate-in 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .slide-in-from-left-4 {
          animation: slideInFromLeft 0.6s ease-out forwards;
        }

        .slide-in-from-top-4 {
          animation: slideInFromTop 0.6s ease-out forwards;
        }

        .slide-in-from-bottom-8 {
          animation: slideInFromBottom 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
