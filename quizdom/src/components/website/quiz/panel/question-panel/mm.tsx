import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { InterSch } from "@/types/qns-structures";

// Tie Breaker
import { Panel as TieBreaker } from "./tie";

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/movie-mania/${q_no}`;
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="animate-fade-in-down smooth-hover mt-4 mb-8 flex items-center gap-2 rounded-lg bg-white/80 px-6 py-3 text-3xl font-bold text-blue-900 shadow md:text-4xl dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon
            icon={faVideoCamera}
            className="animate-pulse transition-all duration-700 hover:scale-110 hover:rotate-[360deg]"
          />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent transition-all duration-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400">
            Movie Mania
          </span>
        </div>
        <div className="flex w-full flex-col gap-6">
          {InterSch.mm.map((question: any, index: number) => (
            <div
              id={`${question.q_no}-${index}`}
              key={question.q_no}
              className="animate-fade-in-up smooth-hover group mb-2 flex w-full flex-col items-center justify-between rounded-xl border border-blue-200 bg-white/80 px-6 py-5 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-2xl hover:shadow-purple-200/50 md:flex-row dark:border-blue-800 dark:bg-gray-900/80 dark:hover:border-purple-700 dark:hover:bg-gradient-to-r dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationFillMode: "both",
              }}
            >
              <span className="mb-3 text-lg font-semibold text-blue-900 transition-all duration-300 group-hover:animate-pulse hover:text-purple-700 md:mb-0 md:text-xl dark:text-blue-200 dark:hover:text-purple-300">
                {question.display_text}
              </span>
              <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                <button className="focus:ring-opacity-75 smooth-hover glass-glow animate-fade-in-right group relative w-full transform cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:scale-110 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:shadow-xl hover:shadow-purple-500/30 focus:ring-2 focus:ring-purple-500 focus:outline-none active:scale-95 md:w-auto">
                  <span className="relative z-10 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105 group-hover:animate-pulse">
                    🎬 View
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"></div>
                  <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 blur transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="absolute top-0 left-0 h-full w-0 -translate-x-full skew-x-12 bg-gradient-to-r from-white/30 to-transparent transition-all duration-700 group-hover:w-full group-hover:translate-x-full"></div>
                  <div className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full"></div>
                  <div className="absolute top-0 left-0 h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
                </button>
              </Link>
            </div>
          ))}
        </div>
        {/* Tie Breaker Section */}
        <TieBreaker icon={faVideoCamera} genURL={genURL} />
      </div>
    </section>
  );
}
