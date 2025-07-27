// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

// QNS STRUCTURE
import { InterSch } from "@/types/qns-structures";

// Tie Breaker
import { Panel as TieBreaker } from "./tie";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/pounce-bounce/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <h1 className="animate-fade-in-down smooth-hover mt-4 mb-8 flex items-center gap-2 rounded-lg bg-white/80 px-6 py-3 text-3xl font-bold text-blue-900 shadow md:text-4xl dark:bg-gray-900/80 dark:text-blue-300">
            <FontAwesomeIcon
              icon={faCube}
              className="animate-bounce transition-transform duration-500 hover:scale-110 hover:rotate-12"
            />
            <span className="bg-gradient-to-r from-blue-900 to-pink-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-pink-400">
              Pounce Bounce
            </span>
          </h1>
          <div className="flex w-full flex-col gap-6">
            {InterSch.pnb.map((question: any, index: number) => (
              <div
                id={`${question.q_no}-${index}`}
                key={question.q_no}
                className="animate-fade-in-up smooth-hover group mb-2 flex w-full flex-col items-center justify-between rounded-xl border border-blue-200 bg-white/80 px-6 py-5 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:bg-blue-50 hover:shadow-2xl md:flex-row dark:border-blue-800 dark:bg-gray-900/80 dark:hover:border-blue-700 dark:hover:bg-gray-800"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: "both",
                }}
              >
                <h3 className="mb-3 text-lg font-semibold text-blue-900 transition-all duration-300 group-hover:animate-pulse hover:text-blue-700 md:mb-0 md:text-xl dark:text-blue-200 dark:hover:text-blue-100">
                  {question.display_text}
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button className="focus:ring-opacity-75 smooth-hover glass-glow animate-fade-in-right group relative w-full transform cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-500 ease-out hover:scale-110 hover:animate-pulse hover:from-blue-700 hover:to-pink-600 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 md:w-auto">
                    <span className="relative z-10 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105 group-hover:animate-bounce">
                      View
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-pink-600 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"></div>
                    <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 opacity-0 blur transition-all duration-500 group-hover:opacity-30"></div>
                    <div className="absolute top-0 left-0 h-full w-0 -translate-x-full skew-x-12 bg-gradient-to-r from-white/20 to-transparent transition-all duration-700 group-hover:w-full group-hover:translate-x-full"></div>
                    <div className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full"></div>
                  </button>
                </Link>
              </div>
            ))}
          </div>
          {/* Tie Breaker Section */}
          <TieBreaker icon={faCube} genURL={genURL} />
        </div>
      </section>
    </div>
  );
}
