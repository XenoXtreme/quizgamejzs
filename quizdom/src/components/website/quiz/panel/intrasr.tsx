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
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-4 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <h1 className="mt-4 mb-8 flex items-center gap-2 rounded-2xl border border-blue-100/60 bg-white/80 px-6 py-4 text-2xl font-bold text-blue-900 shadow-2xl backdrop-blur-xl sm:mb-12 sm:text-3xl md:text-4xl dark:border-blue-900/60 dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon icon={faCube} />
          Rounds:
        </h1>
        <section className="xs:max-w-sm mb-8 grid w-full max-w-xs grid-cols-4 gap-1 px-0 sm:mb-12 sm:max-w-2xl sm:grid-cols-2 sm:grid-rows-2 sm:gap-10 sm:px-2 lg:max-w-5xl lg:grid-cols-4 lg:grid-rows-1">
          {/* On Your Own */}
          <Link
            href="/quiz/intraschool/senior/round/on-your-own"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-3xl border-2 border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,80,255,0.18)] sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-blue-900/60 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-blue-900/70">
              <img
                src="/assets/static/person.jpg"
                loading="lazy"
                alt="person"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-blue-200/60 sm:mb-4 sm:h-28 sm:w-28 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
              <h1 className="xs:text-base bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-sm font-bold text-transparent transition group-hover:from-blue-900 group-hover:to-blue-500 sm:text-xl dark:text-blue-200 dark:group-hover:text-pink-400">
                On Your Own
              </h1>
            </div>
          </Link>
          {/* Pounce - Bounce */}
          <Link
            href="/quiz/intraschool/senior/round/pounce-bounce"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-3xl border-2 border-pink-200/60 bg-gradient-to-br from-white/80 via-pink-50/80 to-pink-100/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(255,0,120,0.13)] sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-pink-900/60 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-pink-900/70">
              <img
                src="/assets/static/bounce.jpg"
                loading="lazy"
                alt="bounce"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-pink-200/60 sm:mb-4 sm:h-28 sm:w-28 dark:ring-pink-900/60"
                style={{
                  background: "linear-gradient(135deg, #ffe0f0 0%, #fff 100%)",
                }}
              />
              <h1 className="xs:text-base bg-gradient-to-tr from-pink-700 via-pink-500 to-pink-400 bg-clip-text text-sm font-bold text-transparent transition group-hover:from-pink-800 group-hover:to-pink-600 sm:text-xl dark:text-pink-200">
                Pounce - Bounce
              </h1>
            </div>
          </Link>
          {/* Connections */}
          <Link
            href="/quiz/intraschool/senior/round/connections"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-3xl border-2 border-green-200/60 bg-gradient-to-br from-white/80 via-green-50/80 to-green-100/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,200,100,0.13)] sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-green-900/60 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-green-900/70">
              <img
                src="/assets/static/connection.jpg"
                loading="lazy"
                alt="connection"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-green-200/60 sm:mb-4 sm:h-28 sm:w-28 dark:ring-green-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0ffe7 0%, #fff 100%)",
                }}
              />
              <h1 className="xs:text-base bg-gradient-to-tr from-green-700 via-green-500 to-green-400 bg-clip-text text-sm font-bold text-transparent transition group-hover:from-green-800 group-hover:to-green-600 sm:text-xl dark:text-green-200">
                Connections
              </h1>
            </div>
          </Link>
          {/* On Your Fingertips */}
          <Link
            href="/quiz/intraschool/senior/round/on-your-fingertips"
            className="group"
          >
            <div className="xs:p-4 xs:min-h-[140px] xs:min-w-[120px] xs:h-[160px] flex aspect-square h-[120px] min-h-[120px] w-full min-w-[100px] cursor-pointer flex-col items-center rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-white/80 via-indigo-50/80 to-indigo-100/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(80,80,255,0.13)] sm:h-[270px] sm:min-h-[240px] sm:min-w-[240px] sm:p-8 dark:border-indigo-900/60 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-900/70">
              <img
                src="/assets/static/fingertips.png"
                loading="lazy"
                alt="fingertips"
                className="xs:w-16 xs:h-16 xs:mb-2 mb-1 h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-indigo-200/60 sm:mb-4 sm:h-28 sm:w-28 dark:ring-indigo-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
              <h1 className="xs:text-base bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400 bg-clip-text text-center text-sm font-bold text-transparent transition group-hover:from-indigo-800 group-hover:to-indigo-600 sm:text-xl dark:text-indigo-200">
                On Your Fingertips
              </h1>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
