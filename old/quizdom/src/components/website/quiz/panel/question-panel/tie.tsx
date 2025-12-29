import React from "react";
import Link from "next/link";
import { GiJetFighter } from "react-icons/gi";
import { InterSch } from "@/types/qns-structures";

export function Panel(): React.JSX.Element {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/tie-breaker/${q_no}`;
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[75vw] max-w-4xl px-4 md:px-8 lg:px-12">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-yellow-50/80 px-6 py-3 text-2xl font-bold text-yellow-700 shadow dark:bg-yellow-900/60 dark:text-yellow-200">
          <GiJetFighter />
          <span>Tie Breaker</span>
        </div>
        <div className="flex w-full flex-col gap-6">
          {InterSch.tiebreaker.map((question: any, index: number) => (
            <div
              id={`tiebreaker-${question.q_no}-${index}`}
              key={`tiebreaker-${question.q_no}`}
              className="mb-2 flex w-full flex-col items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50/80 px-6 py-5 shadow-lg transition-all hover:bg-yellow-100 hover:shadow-2xl md:flex-row dark:border-yellow-800 dark:bg-yellow-900/60 dark:hover:bg-yellow-800"
            >
              <span className="mb-3 text-lg font-semibold text-yellow-800 md:mb-0 md:text-xl dark:text-yellow-100">
                {question.display_text}
              </span>
              <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                <button className="focus:ring-opacity-75 w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:from-yellow-600 hover:to-pink-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none md:w-auto">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
