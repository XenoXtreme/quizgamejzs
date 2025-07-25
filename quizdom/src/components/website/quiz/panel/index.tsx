// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// FONT
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div
        className={`relative flex min-h-screen w-full flex-col items-center justify-center bg-[url('/assets/static/banner.jpg')] bg-cover text-center dark:bg-none`}
      >
        {/* Dark mode overlay for glass/blur effect */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,20,30,0.85) 0%, rgba(30,30,40,0.95) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 0 120px 30px rgba(0,0,0,0.8) inset",
          }}
        />
        <section className="relative z-10 mt-1 flex w-full flex-col items-center justify-center sm:mt-8">
          {/* Prelims */}
          <section
            className={`my-2 flex h-auto w-[95vw] max-w-4xl cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 px-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.035] hover:bg-blue-50/90 sm:my-6 sm:px-6 lg:h-[25vh] lg:w-[70vw] lg:flex-row dark:border-blue-900/60 dark:bg-gradient-to-br dark:from-gray-900/70 dark:via-gray-800/80 dark:to-blue-900/60 dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] dark:backdrop-blur-2xl dark:hover:bg-gray-800/90`}
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 6px 0 rgba(0, 80, 255, 0.08)",
            }}
          >
            <div className="mr-0 mb-2 flex h-4/5 w-full items-center justify-center lg:mr-2 lg:mb-0 lg:w-1/5 sm:lg:mr-[13%]">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="xs:w-20 xs:h-20 h-16 w-16 rounded-2xl shadow-lg ring-2 ring-blue-200/60 sm:h-24 sm:w-24 lg:h-28 lg:w-28 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
            </div>
            <div className="mb-2 flex h-4/5 w-full flex-col items-center justify-center lg:mb-0 lg:w-3/5">
              <h1 className="mb-1 rounded-lg bg-white/70 bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text px-2 py-1 text-lg font-extrabold text-transparent shadow sm:mb-2 sm:px-4 sm:py-2 sm:text-2xl dark:bg-gray-900/70 dark:text-blue-100">
                Prelims
              </h1>
              <p className="w-4/5 rounded-lg px-1 py-1 text-xs font-medium text-gray-700 sm:px-3 sm:text-base dark:text-gray-200">
                Questions for Prelims.
              </p>
            </div>
            <div className="flex w-full items-center justify-center lg:w-1/5">
              <Link
                href="/quiz/prelims"
                className="flex w-4/5 justify-center sm:w-3/5"
              >
                <button
                  className={`w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 px-2 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-blue-200/60 transition hover:scale-105 hover:from-blue-800 hover:to-blue-600 sm:px-4 sm:py-2 sm:text-base dark:ring-blue-900/60`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>

          {/* Inter School */}
          <section
            className={`my-4 flex h-auto w-[95vw] max-w-4xl cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 px-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.035] hover:bg-blue-50/90 sm:my-6 sm:px-6 lg:h-[25vh] lg:w-[70vw] lg:flex-row dark:border-blue-900/60 dark:bg-gradient-to-br dark:from-gray-900/70 dark:via-gray-800/80 dark:to-blue-900/60 dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] dark:backdrop-blur-2xl dark:hover:bg-gray-800/90`}
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 6px 0 rgba(0, 80, 255, 0.08)",
            }}
          >
            <div className="mr-2 flex h-4/5 w-1/5 items-center justify-center sm:mr-[13%]">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="xs:w-20 xs:h-20 h-16 w-16 rounded-2xl shadow-lg ring-2 ring-blue-200/60 sm:h-24 sm:w-24 lg:h-28 lg:w-28 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-1 rounded-lg bg-white/70 bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text px-2 py-1 text-lg font-extrabold text-transparent shadow sm:mb-2 sm:px-4 sm:py-2 sm:text-2xl dark:bg-gray-900/70 dark:text-blue-100">
                Inter School Quiz Competition
              </h1>
              <p className="w-4/5 rounded-lg px-1 py-1 text-xs font-medium text-gray-700 sm:px-3 sm:text-base dark:text-gray-200">
                Access the questions meant for students of class IX-XII. Explore
                the world gain knowlgde and do much more!
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link
                href="/quiz/interschool"
                className="flex w-4/5 justify-center sm:w-3/5"
              >
                <button
                  className={`w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 px-2 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-blue-200/60 transition hover:scale-105 hover:from-blue-800 hover:to-blue-600 sm:px-4 sm:py-2 sm:text-base dark:ring-blue-900/60`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>
          {/* Audience */}
          <section
            className={`my-4 flex h-auto w-[95vw] max-w-4xl cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-blue-100/80 px-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.035] hover:bg-blue-50/90 sm:my-6 sm:px-6 lg:h-[25vh] lg:w-[70vw] lg:flex-row dark:border-blue-900/60 dark:bg-gradient-to-br dark:from-gray-900/70 dark:via-gray-800/80 dark:to-blue-900/60 dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] dark:backdrop-blur-2xl dark:hover:bg-gray-800/90`}
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 6px 0 rgba(0, 80, 255, 0.08)",
            }}
          >
            <div className="mr-2 flex h-4/5 w-1/5 items-center justify-center sm:mr-[13%]">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="xs:w-20 xs:h-20 h-16 w-16 rounded-2xl shadow-lg ring-2 ring-blue-200/60 sm:h-24 sm:w-24 lg:h-28 lg:w-28 dark:ring-blue-900/60"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                }}
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-1 rounded-lg bg-white/70 bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 bg-clip-text px-2 py-1 text-lg font-extrabold text-transparent shadow sm:mb-2 sm:px-4 sm:py-2 sm:text-2xl dark:bg-gray-900/70 dark:text-blue-100">
                Open Quiz for Audience
              </h1>
              <p className="w-4/5 rounded-lg px-1 py-1 text-xs font-medium text-gray-700 sm:px-3 sm:text-base dark:text-gray-200">
                Questions for audience to engage with the quiz and test their
                knowledge.
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link
                href="/quiz/audience"
                className="flex w-4/5 justify-center sm:w-3/5"
              >
                <button
                  className={`w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 px-2 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-blue-200/60 transition hover:scale-105 hover:from-blue-800 hover:to-blue-600 sm:px-4 sm:py-2 sm:text-base dark:ring-blue-900/60`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
