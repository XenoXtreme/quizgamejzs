import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { InterSch } from "@/types/qns-structures";

// Tie Breaker
import { Panel as TieBreaker } from "./tie";

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/connections/${q_no}`;
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-100 to-blue-50 py-8 transition-all duration-700 ease-in-out dark:from-gray-950 dark:to-gray-900">
      {/* Header with enhanced entrance animation */}
      <div className="animate-fade-in-down smooth-hover mb-8 flex items-center gap-3">
        <FontAwesomeIcon
          icon={faLink}
          className="animate-pulse text-3xl text-blue-600 drop-shadow transition-all duration-500 hover:scale-125 hover:rotate-180 hover:animate-spin md:text-4xl dark:text-pink-400"
          style={{
            animation: "pulse 2s ease-in-out infinite, spin 6s linear infinite",
          }}
        />
        <h1 className="animate-fade-in-right bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-2xl font-bold tracking-tight text-gray-900 text-transparent transition-all duration-500 hover:from-pink-600 hover:via-blue-600 hover:to-purple-600 md:text-3xl dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 dark:text-white">
          Connections
        </h1>
      </div>

      {/* Enhanced Glassy List with smoother staggered animations */}
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {InterSch.cc.map((question: any, index: any) => (
          <div
            id={`${question.q_no}-${index}`}
            key={question.q_no}
            className="group animate-fade-in-up smooth-hover glass-glow flex items-center justify-between rounded-2xl border border-pink-300/60 bg-gradient-to-br from-pink-100/80 via-white/60 to-pink-200/70 px-6 py-5 opacity-0 shadow-[0_4px_32px_0_rgba(255,0,128,0.10),0_1.5px_8px_0_rgba(255,0,128,0.08)] backdrop-blur-2xl transition-all duration-700 ease-out hover:-translate-y-3 hover:scale-[1.03] hover:border-pink-400/80 hover:bg-pink-50/90 hover:shadow-[0_0_20px_4px_rgba(255,0,128,0.25)] dark:border-pink-600/40 dark:bg-gradient-to-br dark:from-pink-900/60 dark:via-gray-900/60 dark:to-pink-800/40 dark:hover:bg-pink-900/70"
            style={{
              boxShadow:
                "0 4px 32px 0 rgba(255,0,128,0.10), 0 1.5px 8px 0 rgba(255,0,128,0.08), 0 0 12px 2px #ffb6d5cc",
              animationDelay: `${index * 120}ms`,
              animationFillMode: "forwards",
              ...(typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches && {
                  boxShadow:
                    "0 4px 24px 0 rgba(255,0,128,0.08), 0 1.5px 8px 0 rgba(255,0,128,0.06), 0 0 4px 1px #ffb6d580",
                }),
            }}
          >
            <span className="flex transform items-center gap-3 text-base font-semibold text-pink-900 transition-all duration-500 group-hover:translate-x-3 group-hover:scale-105 md:text-lg dark:text-pink-100">
              {/* Enhanced animated icon with conditional display */}
              {(question.display_text?.toLowerCase() === "connection" ||
                question.q_no?.toLowerCase() === "connection") && (
                <FontAwesomeIcon
                  icon={faLink}
                  className="animate-bounce text-pink-400 drop-shadow-[0_1px_4px_rgba(255,0,128,0.4)] transition-all duration-500 hover:scale-150 hover:rotate-360 hover:animate-spin dark:text-pink-300"
                  style={{
                    animation: "bounce 2s ease-in-out infinite",
                    filter:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "drop-shadow(0 0 6px #ffb6d580)"
                        : "drop-shadow(0 0 12px #ffb6d5cc)",
                  }}
                />
              )}
              <span className="transition-all duration-500 group-hover:animate-pulse group-hover:text-pink-700 dark:group-hover:text-pink-200">
                {question.display_text}
              </span>
            </span>
            <Link href={genURL(question.q_no)} className="ml-4">
              {question.q_no?.toLowerCase() === "connection" ||
              question.display_text?.toLowerCase() === "connection" ? (
                <button
                  className="smooth-hover glass-glow group relative transform cursor-pointer overflow-hidden rounded-lg bg-pink-600 px-6 py-3 font-extrabold text-white shadow-xl ring-2 ring-pink-400/80 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-115 hover:shadow-[0_0_30px_6px_rgba(255,0,128,0.3)] hover:ring-pink-400/90 active:scale-95 dark:bg-pink-500 dark:text-pink-950"
                  style={{
                    boxShadow:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "0 0 16px 3px #ffb6d5cc, 0 3px 12px 0 #ff69b455"
                        : "0 0 28px 5px #ffb6d5cc, 0 3px 16px 0 #ff69b488",
                    border: "2px solid #ff69b4",
                  }}
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2 tracking-wider drop-shadow-[0_1px_4px_rgba(255,0,128,0.22)] transition-all duration-500 group-hover:translate-x-1 group-hover:scale-105 dark:text-white">
                    <FontAwesomeIcon
                      icon={faLink}
                      className="animate-pulse text-blue-400 drop-shadow-[0_1px_4px_rgba(255,0,128,0.4)] transition-all duration-500 group-hover:rotate-180 hover:animate-bounce dark:text-pink-300"
                      style={{
                        filter:
                          typeof window !== "undefined" &&
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "drop-shadow(0 0 6px #ffb6d580)"
                            : "drop-shadow(0 0 12px #ffb6d5cc)",
                      }}
                    />
                    <span className="transition-all duration-500 group-hover:tracking-widest">
                      Link Connections
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-600 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"></div>
                  <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 blur transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="absolute top-0 left-0 h-full w-0 -translate-x-full skew-x-12 bg-gradient-to-r from-white/30 to-transparent transition-all duration-700 group-hover:w-full group-hover:translate-x-full"></div>
                  <div className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-transparent via-blue-300/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full"></div>
                </button>
              ) : (
                <button
                  className="smooth-hover glass-glow group relative transform cursor-pointer overflow-hidden rounded-lg bg-pink-500 px-6 py-3 font-bold text-white shadow-lg ring-2 ring-pink-200/60 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-110 hover:bg-pink-600 hover:text-white hover:shadow-xl hover:shadow-pink-500/40 active:scale-95"
                  style={{
                    boxShadow:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "0 0 12px 2px #ffb6d580, 0 3px 12px 0 #ff69b433"
                        : "0 0 20px 3px #ffb6d5cc, 0 3px 12px 0 #ff69b455",
                    border: "1.5px solid #FFD6E8",
                  }}
                >
                  <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(255,0,128,0.18)] transition-all duration-500 group-hover:translate-x-1 group-hover:scale-105 group-hover:tracking-wider">
                    🔍 View
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-700 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"></div>
                  <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 blur transition-all duration-500 group-hover:opacity-30"></div>
                  <div className="absolute top-0 left-0 h-full w-0 -translate-x-full skew-x-12 bg-gradient-to-r from-white/20 to-transparent transition-all duration-600 group-hover:w-full group-hover:translate-x-full"></div>
                </button>
              )}
            </Link>
          </div>
        ))}
        {/* Tie Breaker Section with enhanced delayed animation */}
        <div
          className="animate-fade-in-up smooth-hover opacity-0"
          style={{
            animationDelay: `${InterSch.cc.length * 120 + 300}ms`,
            animationFillMode: "forwards",
          }}
        >
          <TieBreaker icon={faLink} genURL={genURL} />
        </div>
      </div>
    </section>
  );
}
