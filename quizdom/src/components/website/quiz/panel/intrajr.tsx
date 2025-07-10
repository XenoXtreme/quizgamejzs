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
        <section className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-6 px-2 sm:mb-14 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
          {/* On Your Own */}
          <Link
            href="/quiz/intraschool/junior/round/on-your-own"
            className="group"
          >
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,80,255,0.18)] sm:h-[250px] sm:min-h-[220px] sm:min-w-[180px] sm:p-8 dark:border-blue-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-blue-900/70">
              <img
                src="/assets/static/person.jpg"
                loading="lazy"
                alt="person"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-blue-200/60 sm:mb-5 sm:h-24 sm:w-24 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-blue-900 group-hover:to-blue-500 sm:text-lg">
                On Your Own
              </h1>
            </div>
          </Link>
          {/* Movie Mania */}
          <Link
            href="/quiz/intraschool/junior/round/movie-mania"
            className="group"
          >
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-yellow-200/60 bg-gradient-to-br from-white/80 via-yellow-50/80 to-yellow-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(255,215,0,0.13)] sm:h-[250px] sm:min-h-[220px] sm:min-w-[180px] sm:p-8 dark:border-yellow-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-yellow-900/70">
              <img
                src="/assets/static/movie.jpg"
                loading="lazy"
                alt="movie"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-yellow-200/60 sm:mb-5 sm:h-24 sm:w-24 dark:ring-yellow-900/60"
                style={{
                  background: "linear-gradient(135deg, #fffbe0 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-yellow-700 via-yellow-500 to-yellow-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-yellow-800 group-hover:to-yellow-600 sm:text-lg">
                Movie Mania
              </h1>
            </div>
          </Link>
          {/* On Your Fingertips */}
          <Link
            href="/quiz/intraschool/junior/round/on-your-fingertips"
            className="group"
          >
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-white/80 via-indigo-50/80 to-indigo-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(80,80,255,0.13)] sm:h-[250px] sm:min-h-[220px] sm:min-w-[180px] sm:p-8 dark:border-indigo-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-900/70">
              <img
                src="/assets/static/fingertips.png"
                loading="lazy"
                alt="fingertips"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-indigo-200/60 sm:mb-5 sm:h-24 sm:w-24 dark:ring-indigo-900/60"
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
