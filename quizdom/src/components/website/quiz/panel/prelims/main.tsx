// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "./css/round.module.css";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-1 py-4 sm:px-2 sm:py-8 dark:from-gray-900 dark:to-gray-950">
        <h1 className="mt-2 mb-4 flex items-center gap-2 rounded-md bg-white/80 px-2 py-2 text-lg font-bold text-blue-900 shadow sm:mt-4 sm:mb-10 sm:rounded-lg sm:px-6 sm:py-3 sm:text-3xl md:text-4xl dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon icon={faCube} />
          Category:
        </h1>
        <section className="grid w-full max-w-xs grid-cols-1 gap-2 px-0 sm:max-w-xl sm:grid-cols-2 sm:gap-8 sm:px-2">
          {/* Intra School (Junior) */}
          <Link
            href="/quiz/prelims/intraschool/junior"
            className="group w-full"
          >
            <div className="flex aspect-square h-[90px] min-h-[80px] w-full min-w-0 cursor-pointer flex-col items-center rounded-xl border-2 border-blue-200 bg-white/80 p-2 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[240px] sm:min-h-[200px] sm:min-w-[200px] sm:rounded-2xl sm:p-8 dark:border-blue-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/prelims.png"
                loading="lazy"
                alt="person"
                className="mb-1 h-10 w-10 rounded-lg object-cover shadow sm:mb-4 sm:h-24 sm:w-24 sm:rounded-xl"
              />
              <h1 className="text-xs font-bold text-blue-900 transition group-hover:text-blue-600 sm:text-xl dark:text-blue-200 dark:group-hover:text-pink-400">
                Intra School (Junior)
              </h1>
            </div>
          </Link>
          {/* Intra School (Senior) */}
          <Link
            href="/quiz/prelims/intraschool/senior"
            className="group w-full"
          >
            <div className="flex aspect-square h-[90px] min-h-[80px] w-full min-w-0 cursor-pointer flex-col items-center rounded-xl border-2 border-pink-200 bg-white/80 p-2 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[240px] sm:min-h-[200px] sm:min-w-[200px] sm:rounded-2xl sm:p-8 dark:border-pink-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/prelims.png"
                loading="lazy"
                alt="person"
                className="mb-1 h-10 w-10 rounded-lg object-cover shadow sm:mb-4 sm:h-24 sm:w-24 sm:rounded-xl"
              />
              <h1 className="text-xs font-bold text-pink-700 transition group-hover:text-pink-500 sm:text-xl dark:text-pink-200">
                Intra School (Senior)
              </h1>
            </div>
          </Link>
          {/* Inter School */}
          <div className="col-span-1 flex justify-center sm:col-span-2">
            <Link
              href="/quiz/prelims/interschool"
              className="group flex w-full justify-center sm:w-auto"
            >
              <div className="flex aspect-square h-[90px] min-h-[80px] w-full min-w-0 cursor-pointer flex-col items-center rounded-xl border-2 border-indigo-200 bg-white/80 p-2 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[240px] sm:min-h-[200px] sm:min-w-[200px] sm:rounded-2xl sm:p-8 dark:border-indigo-900 dark:bg-gray-900/80">
                <img
                  src="/assets/static/prelims.png"
                  loading="lazy"
                  alt="person"
                  className="mb-1 h-10 w-10 rounded-lg object-cover shadow sm:mb-4 sm:h-24 sm:w-24 sm:rounded-xl"
                />
                <h1 className="text-xs font-bold text-indigo-700 transition group-hover:text-indigo-500 sm:text-xl dark:text-indigo-200">
                  Inter School
                </h1>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
