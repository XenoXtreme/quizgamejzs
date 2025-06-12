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
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 0 80px 20px rgba(0,0,0,0.7) inset",
          }}
        />
        <section className="relative z-10 mt-8 flex w-full flex-col items-center justify-center">
          {/* Prelims */}
          <section
            className={`my-4 flex h-[25vh] w-[63vw] cursor-pointer flex-row items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-white/80 px-4 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-50 dark:border-blue-900 dark:bg-gray-900/60 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] dark:backdrop-blur-md dark:hover:bg-gray-800/80`}
          >
            <div className="mr-[13%] flex h-4/5 w-1/5 items-center justify-center">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="w-4/5 rounded-xl shadow"
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-2 rounded-lg bg-white/70 px-4 py-2 text-2xl font-extrabold text-gray-900 shadow dark:bg-gray-900/70 dark:text-gray-100">
                Prelims
              </h1>
              <p className="w-4/5 rounded-lg px-3 py-1 text-base text-gray-700 dark:text-gray-300">
                Questions for Prelims.
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link href="/quiz/prelims" className="flex w-3/5 justify-center">
                <button
                  className={`w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:from-blue-800 hover:to-blue-600`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>
          {/* Intra School - Junior */}
          <section
            className={`my-4 flex h-[25vh] w-[63vw] cursor-pointer flex-row items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-white/80 px-4 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-50 dark:border-blue-900 dark:bg-gray-900/60 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] dark:backdrop-blur-md dark:hover:bg-gray-800/80`}
          >
            <div className="mr-[13%] flex h-4/5 w-1/5 items-center justify-center">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="w-4/5 rounded-xl shadow"
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-2 rounded-lg bg-white/70 px-4 py-2 text-2xl font-extrabold text-gray-900 shadow dark:bg-gray-900/70 dark:text-gray-100">
                Intra School - (Junior)
              </h1>
              <p className="w-4/5 rounded-lg px-3 py-1 text-base text-gray-700 dark:text-gray-300">
                Access the questions meant for students of class VI- VIII.
                Explore the world gain knowlgde and do much more!
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link
                href="/quiz/intraschool/junior"
                className="flex w-3/5 justify-center"
              >
                <button
                  className={`w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:from-blue-800 hover:to-blue-600`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>
          {/* Intra School - Senior */}
          <section
            className={`my-4 flex h-[25vh] w-[63vw] cursor-pointer flex-row items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-white/80 px-4 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-50 dark:border-blue-900 dark:bg-gray-900/60 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] dark:backdrop-blur-md dark:hover:bg-gray-800/80`}
          >
            <div className="mr-[13%] flex h-4/5 w-1/5 items-center justify-center">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="w-4/5 rounded-xl shadow"
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-2 rounded-lg bg-white/70 px-4 py-2 text-2xl font-extrabold text-gray-900 shadow dark:bg-gray-900/70 dark:text-gray-100">
                Intra School - (Senior)
              </h1>
              <p className="w-4/5 rounded-lg px-3 py-1 text-base text-gray-700 dark:text-gray-300">
                Access the questions meant for students of class IX-XII. Explore
                the world gain knowlgde and do much more!
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link
                href="/quiz/intraschool/senior"
                className="flex w-3/5 justify-center"
              >
                <button
                  className={`w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:from-blue-800 hover:to-blue-600`}
                >
                  View
                </button>
              </Link>
            </div>
          </section>
          {/* Inter School */}
          <section
            className={`my-4 flex h-[25vh] w-[63vw] cursor-pointer flex-row items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-white/80 px-4 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-50 dark:border-blue-900 dark:bg-gray-900/60 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] dark:backdrop-blur-md dark:hover:bg-gray-800/80`}
          >
            <div className="mr-[13%] flex h-4/5 w-1/5 items-center justify-center">
              <img
                src="/assets/static/jzs.png"
                loading="lazy"
                alt="Logo"
                className="w-4/5 rounded-xl shadow"
              />
            </div>
            <div className="flex h-4/5 w-3/5 flex-col items-center justify-center">
              <h1 className="mb-2 rounded-lg bg-white/70 px-4 py-2 text-2xl font-extrabold text-gray-900 shadow dark:bg-gray-900/70 dark:text-gray-100">
                Inter School Quiz Competition
              </h1>
              <p className="w-4/5 rounded-lg px-3 py-1 text-base text-gray-700 dark:text-gray-300">
                Access the questions meant for students of class IX-XII. Explore
                the world gain knowlgde and do much more!
              </p>
            </div>
            <div className="flex w-1/5 items-center justify-center">
              <Link
                href="/quiz/interschool"
                className="flex w-3/5 justify-center"
              >
                <button
                  className={`w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:from-blue-800 hover:to-blue-600`}
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
