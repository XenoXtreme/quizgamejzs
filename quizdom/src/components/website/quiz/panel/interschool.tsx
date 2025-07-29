// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

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
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-6 sm:py-8 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <h1 className="mt-4 mb-8 flex items-center gap-2 rounded-2xl border border-blue-100/60 bg-white/80 px-6 py-4 text-2xl font-bold text-blue-900 shadow-2xl backdrop-blur-xl sm:mb-12 sm:text-3xl md:text-4xl dark:border-blue-900/60 dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon icon={faCube} />
          Rounds:
        </h1>
        <section className="grid w-full max-w-5xl grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
          {/* On Your Own */}
          <Link href="/quiz/interschool/round/on-your-own" className="group">
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,80,255,0.18)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-blue-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-blue-900/70">
              <img
                src="/assets/static/person.jpg"
                loading="lazy"
                alt="person"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-blue-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-blue-900 group-hover:to-blue-500 sm:text-xl">
                On Your Own
              </h1>
            </div>
          </Link>
          {/* Pounce - Bounce */}
          <Link href="/quiz/interschool/round/pounce-bounce" className="group">
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-pink-200/60 bg-gradient-to-br from-white/80 via-pink-50/80 to-pink-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(255,0,120,0.13)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-pink-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-pink-900/70">
              <img
                src="/assets/static/bounce.jpg"
                loading="lazy"
                alt="logo"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-pink-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-pink-900/60"
                style={{
                  background: "linear-gradient(135deg, #ffe0f0 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-pink-700 via-pink-500 to-pink-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-pink-800 group-hover:to-pink-600 sm:text-xl">
                Pounce - Bounce
              </h1>
            </div>
          </Link>
          {/* Connections */}
          <Link href="/quiz/interschool/round/connections" className="group">
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-green-200/60 bg-gradient-to-br from-white/80 via-green-50/80 to-green-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,200,100,0.13)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-green-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-green-900/70">
              <img
                src="/assets/static/connection.jpg"
                loading="lazy"
                alt="connection"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-green-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-green-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0ffe7 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-green-700 via-green-500 to-green-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-green-800 group-hover:to-green-600 sm:text-xl">
                Connections
              </h1>
            </div>
          </Link>
          {/* Movie Mania */}
          <Link href="/quiz/interschool/round/movie-mania" className="group">
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-yellow-200/60 bg-gradient-to-br from-white/80 via-yellow-50/80 to-yellow-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(255,215,0,0.13)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-yellow-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-yellow-900/70">
              <img
                src="/assets/static/movie.jpg"
                loading="lazy"
                alt="movie"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-yellow-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-yellow-900/60"
                style={{
                  background: "linear-gradient(135deg, #fffbe0 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-yellow-700 via-yellow-500 to-yellow-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-yellow-800 group-hover:to-yellow-600 sm:text-xl">
                Movie Mania
              </h1>
            </div>
          </Link>
          {/* Point Blank */}
          <Link href="/quiz/interschool/round/point-blank" className="group">
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-orange-200/60 bg-gradient-to-br from-white/80 via-orange-50/80 to-orange-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(255,180,0,0.13)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-yellow-700/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-yellow-900/70">
              <img
                src="/assets/static/pointblank.jpg"
                loading="lazy"
                alt="point blank"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-orange-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-yellow-700/60"
                style={{
                  background: "linear-gradient(135deg, #fff3e0 0%, #fff 100%)",
                }}
              />
              <h1 className="bg-gradient-to-tr from-orange-700 via-orange-500 to-orange-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-orange-800 group-hover:to-orange-600 sm:text-xl">
                Point Blank
              </h1>
            </div>
          </Link>
          {/* On Your Fingertips */}
          <Link
            href="/quiz/interschool/round/on-your-fingertips"
            className="group"
          >
            <div className="flex h-[200px] min-h-[180px] min-w-[140px] cursor-pointer flex-col items-center rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-white/80 via-indigo-50/80 to-indigo-100/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(80,80,255,0.13)] sm:h-[290px] sm:min-h-[260px] sm:min-w-[220px] sm:p-8 dark:border-indigo-900/60 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-900/70">
              <img
                src="/assets/static/fingertips.png"
                loading="lazy"
                alt="fingertips"
                className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-indigo-200/60 sm:mb-5 sm:h-28 sm:w-28 dark:ring-indigo-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
              <h1 className="group_hover:to-indigo-600 bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400 bg-clip-text text-lg font-bold text-transparent transition group-hover:from-indigo-800 sm:text-xl">
                On Your Fingertips
              </h1>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
