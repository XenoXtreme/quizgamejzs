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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 py-8 px-2">
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 bg-white/80 dark:bg-gray-900/80 rounded-lg px-6 py-3 shadow mb-10 mt-4">
          <FontAwesomeIcon icon={faCube} />
          Category:
        </h1>
        <section className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Intra School (Junior) */}
          <Link href="/quiz/prelims/intraschool/junior" className="group">
            <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-900 bg-white/80 dark:bg-gray-900/80 p-8 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer aspect-square min-h-[200px] min-w-[200px] h-[240px]">
              <img
                src="/assets/static/prelims.png"
                loading="lazy"
                alt="person"
                className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
              />
              <h1 className="text-xl font-bold text-blue-900 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-pink-400 transition">
                Intra School (Junior)
              </h1>
            </div>
          </Link>
          {/* Intra School (Senior) */}
          <Link href="/quiz/prelims/intraschool/senior" className="group">
            <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-pink-200 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 p-8 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer aspect-square min-h-[200px] min-w-[200px] h-[240px]">
              <img
                src="/assets/static/prelims.png"
                loading="lazy"
                alt="person"
                className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
              />
              <h1 className="text-xl font-bold text-pink-700 dark:text-pink-200 group-hover:text-pink-500 transition">
                Intra School (Senior)
              </h1>
            </div>
          </Link>
          {/* Inter School */}
          <div className="col-span-1 sm:col-span-2 flex justify-center">
            <Link
              href="/quiz/prelims/interschool"
              className="group w-full sm:w-auto flex justify-center"
            >
              <div className="flex flex-col items-center rounded-2xl shadow-xl border-2 border-indigo-200 dark:border-indigo-900 bg-white/80 dark:bg-gray-900/80 p-8 hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer aspect-square min-h-[200px] min-w-[200px] h-[240px]">
                <img
                  src="/assets/static/prelims.png"
                  loading="lazy"
                  alt="person"
                  className="w-24 h-24 object-cover rounded-xl mb-4 shadow"
                />
                <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 group-hover:text-indigo-500 transition">
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
