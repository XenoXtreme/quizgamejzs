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
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 py-2 px-2">
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 bg-white/80 dark:bg-gray-900/80 rounded-lg px-6 py-3 shadow mb-10 mt-4">
          <FontAwesomeIcon icon={faCube} />
          Rounds:
        </h1>
        <section className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* On Your Own */}
          <Link href="/quiz/intraschool/junior/round/on-your-own" className="group">
            <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-900 bg-white/80 dark:bg-gray-900/80 p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer min-h-[220px] min-w-[180px] h-[250px]">
              <img
                src="/assets/static/person.jpg"
                loading="lazy"
                alt="person"
                className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
              />
              <h1 className="text-lg font-bold text-blue-900 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-pink-400 transition">
                On Your Own
              </h1>
            </div>
          </Link>
          {/* Movie Mania */}
          <Link href="/quiz/intraschool/junior/round/movie-mania" className="group">
            <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-yellow-200 dark:border-yellow-900 bg-white/80 dark:bg-gray-900/80 p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer min-h-[220px] min-w-[180px] h-[250px]">
              <img
                src="/assets/static/movie.jpg"
                loading="lazy"
                alt="movie"
                className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
              />
              <h1 className="text-lg font-bold text-yellow-700 dark:text-yellow-200 group-hover:text-yellow-500 transition">
                Movie Mania
              </h1>
            </div>
          </Link>
          {/* On Your Fingertips */}
          <Link href="/quiz/intraschool/junior/round/on-your-fingertips" className="group">
            <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-indigo-200 dark:border-indigo-900 bg-white/80 dark:bg-gray-900/80 p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer min-h-[220px] min-w-[180px] h-[250px]">
              <img
                src="/assets/static/fingertips.png"
                loading="lazy"
                alt="fingertips"
                className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
              />
              <h1 className="text-lg font-bold text-indigo-700 dark:text-indigo-200 group-hover:text-indigo-500 transition">
                On Your Fingertips
              </h1>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
