"use client";
// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "../css/q.module.css";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

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
          <h1 className="mt-4 mb-10 flex items-center gap-2 rounded-xl border-4 border-orange-200 bg-white/90 px-8 py-4 text-3xl font-extrabold tracking-tight text-orange-700 shadow-lg md:text-4xl dark:border-yellow-700 dark:bg-gray-900/90 dark:text-yellow-300">
            <FontAwesomeIcon
              icon={faCube}
              className="text-orange-500 dark:text-yellow-400"
            />
            Point Blank{" "}
            <span className="ml-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-yellow-900 dark:text-yellow-200">
              Rapid Fire
            </span>
          </h1>
          <div className="flex w-full flex-col gap-6">
            {InterSch.pbk.map((question: any, index: number) => (
              <div
                key={question.q_no}
                className="mb-2 flex w-full flex-col items-center justify-between rounded-xl border-2 border-orange-200 bg-white/90 px-6 py-5 shadow-xl transition-all hover:bg-orange-50 hover:shadow-2xl md:flex-row dark:border-yellow-700 dark:bg-gray-900/80 dark:hover:bg-yellow-900/60"
              >
                <h3 className="mb-3 flex-1 text-lg font-bold tracking-wide text-orange-800 md:mb-0 md:text-xl dark:text-yellow-200">
                  <span className="mr-2 inline-block rounded-full bg-orange-100 px-3 py-1 align-middle font-mono text-base text-orange-500 dark:bg-yellow-800 dark:text-yellow-200">
                    {index + 1}
                  </span>
                  {question.display_text}
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button className="focus:ring-opacity-75 w-full transform cursor-pointer rounded-lg border-2 border-orange-300 bg-gradient-to-r from-orange-500 to-yellow-400 px-7 py-2 font-bold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:from-orange-600 hover:to-yellow-500 focus:ring-2 focus:ring-orange-400 focus:outline-none md:w-auto dark:border-yellow-600">
                    View
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
