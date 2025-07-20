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
    return `/quiz/interschool/round/pounce-bounce/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <h1 className="mt-4 mb-8 flex items-center gap-2 rounded-lg bg-white/80 px-6 py-3 text-3xl font-bold text-blue-900 shadow md:text-4xl dark:bg-gray-900/80 dark:text-blue-300">
            <FontAwesomeIcon icon={faCube} />
            Pounce Bounce
          </h1>
          <div className="flex w-full flex-col gap-6">
            {InterSch.pnb.map((question: any, index: number) => (
              <div
                id={`${question.q_no}-${index}`}
                key={question.q_no}
                className="mb-2 flex w-full flex-col items-center justify-between rounded-xl border border-blue-200 bg-white/80 px-6 py-5 shadow-lg transition-all hover:bg-blue-50 hover:shadow-2xl md:flex-row dark:border-blue-800 dark:bg-gray-900/80 dark:hover:bg-gray-800"
              >
                <h3 className="mb-3 text-lg font-semibold text-blue-900 md:mb-0 md:text-xl dark:text-blue-200">
                  {question.display_text}
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button className="focus:ring-opacity-75 w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-2 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-pink-600 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto">
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
