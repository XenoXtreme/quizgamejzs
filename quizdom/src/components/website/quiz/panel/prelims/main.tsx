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
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-1 py-6 sm:px-2 sm:py-10 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <h1 className="mt-2 mb-6 flex items-center gap-2 rounded-2xl border border-blue-100/60 bg-white/80 px-6 py-4 text-lg font-bold text-blue-900 shadow-2xl backdrop-blur-xl sm:mt-4 sm:mb-12 sm:px-8 sm:py-5 sm:text-3xl md:text-4xl dark:border-blue-900/60 dark:bg-gray-900/80 dark:text-blue-300">
          <FontAwesomeIcon icon={faCube} />
          Category:
        </h1>
        <section className="grid w-full max-w-xs grid-cols-1 gap-5 px-0 sm:max-w-xl sm:grid-cols-2 sm:gap-10 sm:px-2">
          {/* Inter School */}
          <div className="col-span-1 flex justify-center sm:col-span-2">
            <Link
              href="/quiz/prelims/interschool"
              className="group flex w-full justify-center sm:w-auto"
            >
              <div className="flex aspect-square h-[100px] min-h-[90px] w-full min-w-0 cursor-pointer flex-col items-center rounded-2xl border-2 border-indigo-200/60 bg-gradient-to-br from-white/80 via-indigo-50/80 to-indigo-100/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(80,80,255,0.13)] sm:h-[240px] sm:min-h-[200px] sm:min-w-[200px] sm:p-8 dark:border-indigo-900/60 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-900/70">
                <img
                  src="/assets/static/prelims.png"
                  loading="lazy"
                  alt="person"
                  className="mb-2 h-12 w-12 rounded-xl object-cover shadow-lg ring-2 ring-indigo-200/60 sm:mb-4 sm:h-24 sm:w-24 dark:ring-indigo-900/60"
                  style={{
                    background:
                      "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                  }}
                />
                <h1 className="bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400 bg-clip-text text-sm font-bold text-transparent transition group-hover:from-indigo-800 group-hover:to-indigo-600 sm:text-xl dark:text-indigo-200">
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
