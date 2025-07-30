// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

// QNS STRUCTURE
import { InterSch } from "@/types/qns-structures";


// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/point-blank/${q_no}`;
  }

  return (
    <div className={nunito.className}>
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 px-2 py-8 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <h1 className="animate-fade-in-down smooth-hover mt-4 mb-10 flex items-center gap-2 rounded-xl border-4 border-orange-200 bg-white/90 px-8 py-4 text-3xl font-extrabold tracking-tight text-orange-700 shadow-lg transition-all duration-500 hover:border-orange-300 hover:shadow-2xl md:text-4xl dark:border-yellow-700 dark:bg-gray-900/90 dark:text-yellow-300 dark:hover:border-yellow-600">
            <FontAwesomeIcon
              icon={faBullseye}
              className="animate-pulse text-orange-500 transition-all duration-700 hover:scale-125 hover:rotate-180 dark:text-yellow-400"
            />
            <span className="bg-gradient-to-r from-orange-700 via-red-600 to-yellow-600 bg-clip-text text-transparent dark:from-yellow-300 dark:via-orange-400 dark:to-red-400">
              Point Blank
            </span>
            <span className="ml-2 animate-pulse rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 transition-all duration-300 hover:animate-bounce hover:bg-red-100 hover:text-red-600 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-red-900 dark:hover:text-red-300">
              Rapid Fire
            </span>
          </h1>
          <div className="flex w-full flex-col gap-6">
            {InterSch.pbk.map((question: any, index: number) => (
              <div
                key={question.q_no}
                className="animate-fade-in-up smooth-hover group mb-2 flex w-full flex-col items-center justify-between rounded-xl border-2 border-orange-200 bg-white/90 px-6 py-5 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:shadow-2xl hover:shadow-orange-200/50 md:flex-row dark:border-yellow-700 dark:bg-gray-900/80 dark:hover:border-yellow-600 dark:hover:bg-gradient-to-r dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <h3 className="mb-3 flex-1 text-lg font-bold tracking-wide text-orange-800 transition-all duration-300 hover:text-red-700 md:mb-0 md:text-xl dark:text-yellow-200 dark:hover:text-red-300">
                  <span className="mr-2 inline-block rounded-full bg-orange-100 px-3 py-1 align-middle font-mono text-base text-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:animate-pulse group-hover:bg-red-100 group-hover:text-red-600 dark:bg-yellow-800 dark:text-yellow-200 dark:group-hover:bg-red-800 dark:group-hover:text-red-300">
                    {index + 1}
                  </span>
                  <span className="group-hover:animate-pulse">
                    {question.display_text}
                  </span>
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button className="focus:ring-opacity-75 smooth-hover glass-glow animate-fade-in-right group relative w-full transform cursor-pointer overflow-hidden rounded-lg border-2 border-orange-300 bg-gradient-to-r from-orange-500 to-yellow-400 px-7 py-3 font-bold text-white shadow-md transition-all duration-500 ease-out hover:scale-110 hover:border-red-400 hover:from-red-600 hover:to-orange-500 hover:shadow-xl hover:shadow-orange-500/40 focus:ring-2 focus:ring-orange-400 focus:outline-none active:scale-95 md:w-auto dark:border-yellow-600 dark:hover:border-red-500">
                    <span className="relative z-10 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105 group-hover:animate-pulse">
                      🎯 View
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"></div>
                    <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 blur transition-all duration-500 group-hover:opacity-50"></div>
                    <div className="absolute top-0 left-0 h-full w-0 -translate-x-full skew-x-12 bg-gradient-to-r from-white/40 to-transparent transition-all duration-300 group-hover:w-full group-hover:translate-x-full"></div>
                    <div className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-transparent via-red-300/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
                    <div className="absolute top-0 left-0 h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
