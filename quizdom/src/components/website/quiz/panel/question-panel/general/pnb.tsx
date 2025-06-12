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
import { General } from "@/types/qns-structures";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/pounce-bounce/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 py-8 px-2">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 bg-white/80 dark:bg-gray-900/80 rounded-lg px-6 py-3 shadow mb-8 mt-4">
            <FontAwesomeIcon icon={faCube} />
            Pounce Bounce
          </h1>
          <div className="w-full flex flex-col gap-6">
            {General.pnb.map((question: any, index: number) => (
              <div
                key={question.q_no}
                className="flex flex-col md:flex-row items-center justify-between w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80 shadow-lg px-6 py-5 mb-2 transition-all hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                <h3 className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3 md:mb-0">
                  {question.display_text}
                </h3>
                <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                  <button
                    className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg shadow-md
                      hover:from-blue-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                      transition-all duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
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
