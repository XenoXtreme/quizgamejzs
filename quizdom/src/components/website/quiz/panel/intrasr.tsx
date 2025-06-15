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
        <h1 className="xs:text-xl mt-2 mb-4 flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-lg font-bold text-blue-900 shadow sm:mt-4 sm:mb-10 sm:px-6 sm:py-3 sm:text-3xl md:text-4xl dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon icon={faCube} />
          Rounds:
        </h1>
        <section className="xs:max-w-sm grid w-full max-w-xs grid-cols-1 gap-3 px-0 sm:max-w-2xl sm:grid-cols-2 sm:grid-rows-2 sm:gap-8 sm:px-2">
          {/* On Your Own */}
          <Link
            href="/quiz/intraschool/senior/round/on-your-own"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-2xl border-2 border-blue-200 bg-white/80 p-3 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-blue-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/person.jpg"
                loading="lazy"
                alt="person"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-xl object-cover shadow sm:mb-4 sm:h-28 sm:w-28"
              />
              <h1 className="xs:text-base text-sm font-bold text-blue-900 transition group-hover:text-blue-600 sm:text-xl dark:text-blue-200 dark:group-hover:text-pink-400">
                On Your Own
              </h1>
            </div>
          </Link>
          {/* Pounce - Bounce */}
          <Link
            href="/quiz/intraschool/senior/round/pounce-bounce"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-2xl border-2 border-pink-200 bg-white/80 p-3 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-pink-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/bounce.jpg"
                loading="lazy"
                alt="bounce"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-xl object-cover shadow sm:mb-4 sm:h-28 sm:w-28"
              />
              <h1 className="xs:text-base text-sm font-bold text-pink-700 transition group-hover:text-pink-500 sm:text-xl dark:text-pink-200">
                Pounce - Bounce
              </h1>
            </div>
          </Link>
          {/* Connections */}
          <Link
            href="/quiz/intraschool/senior/round/connections"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-2xl border-2 border-green-200 bg-white/80 p-3 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-green-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/connection.jpg"
                loading="lazy"
                alt="connection"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-xl object-cover shadow sm:mb-4 sm:h-28 sm:w-28"
              />
              <h1 className="xs:text-base text-sm font-bold text-green-700 transition group-hover:text-green-500 sm:text-xl dark:text-green-200">
                Connections
              </h1>
            </div>
          </Link>
          {/* On Your Fingertips */}
          <Link
            href="/quiz/intraschool/senior/round/on-your-fingertips"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-2xl border-2 border-indigo-200 bg-white/80 p-3 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-indigo-900 dark:bg-gray-900/80">
              <img
                src="/assets/static/fingertips.png"
                loading="lazy"
                alt="fingertips"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-xl object-cover shadow sm:mb-4 sm:h-28 sm:w-28"
              />
              <h1 className="xs:text-base text-sm font-bold text-indigo-700 transition group-hover:text-indigo-500 sm:text-xl dark:text-indigo-200">
                On Your Fingertips
              </h1>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
