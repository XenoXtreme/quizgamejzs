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

export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/point-blank/${q_no}`;
  }

  return (
    <div className={nunito.className}>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-950 py-8 px-2">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-extrabold tracking-tight text-orange-700 dark:text-yellow-300 bg-white/90 dark:bg-gray-900/90 rounded-xl px-8 py-4 shadow-lg mb-10 mt-4 border-4 border-orange-200 dark:border-yellow-700">
            <FontAwesomeIcon icon={faCube} className="text-orange-500 dark:text-yellow-400" />
            Point Blank <span className="text-xs font-semibold ml-2 bg-orange-100 dark:bg-yellow-900 text-orange-600 dark:text-yellow-200 px-3 py-1 rounded-full">Rapid Fire</span>
          </h1>
          <div className="w-full flex flex-col gap-6">
            {InterSch.pbk.map((question: any, index: number) => (
              <div
                key={question.q_no}
                className="flex flex-col md:flex-row items-center justify-between w-full rounded-xl border-2 border-orange-200 dark:border-yellow-700 bg-white/90 dark:bg-gray-900/80 shadow-xl px-6 py-5 mb-2 transition-all hover:shadow-2xl hover:bg-orange-50 dark:hover:bg-yellow-900/60"
              >
                <h3 className="text-lg md:text-xl font-bold text-orange-800 dark:text-yellow-200 mb-3 md:mb-0 tracking-wide flex-1">
                  <span className="inline-block mr-2 px-3 py-1 bg-orange-100 dark:bg-yellow-800 text-orange-500 dark:text-yellow-200 rounded-full font-mono text-base align-middle">{index + 1}</span>
                  {question.display_text}
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button
                    className="cursor-pointer w-full md:w-auto px-7 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-lg shadow-md
                      hover:from-orange-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75
                      transition-all duration-200 ease-in-out transform hover:scale-105 border-2 border-orange-300 dark:border-yellow-600"
                  >
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
