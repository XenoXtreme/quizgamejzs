"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { InterSch } from "@/types/qns-structures";

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/connections/${q_no}`;
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-100 to-blue-50 py-8 transition-colors dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <FontAwesomeIcon
          icon={faLink}
          className="text-3xl text-blue-600 drop-shadow md:text-4xl dark:text-pink-400"
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
          Connections
        </h1>
      </div>

      {/* Glassy List */}
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {InterSch.cc.map((question: any, index: any) => (
          <div
            id={`${question.q_no}-${index}`}
            key={question.q_no}
            className="group flex items-center justify-between rounded-2xl border border-pink-300/60 bg-gradient-to-br from-pink-100/80 via-white/60 to-pink-200/70 px-6 py-5 shadow-[0_4px_32px_0_rgba(255,0,128,0.10),0_1.5px_8px_0_rgba(255,0,128,0.08)] backdrop-blur-2xl transition hover:bg-pink-50/90 hover:shadow-[0_0_16px_2px_rgba(255,0,128,0.18)] dark:border-pink-600/40 dark:bg-gradient-to-br dark:from-pink-900/60 dark:via-gray-900/60 dark:to-pink-800/40 dark:hover:bg-pink-900/70"
            style={{
              boxShadow:
                "0 4px 32px 0 rgba(255,0,128,0.10), 0 1.5px 8px 0 rgba(255,0,128,0.08), 0 0 12px 2px #ffb6d5cc",
              ...(typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches && {
                  boxShadow:
                    "0 4px 24px 0 rgba(255,0,128,0.08), 0 1.5px 8px 0 rgba(255,0,128,0.06), 0 0 4px 1px #ffb6d580",
                }),
            }}
          >
            <span className="flex items-center gap-3 text-base font-semibold text-pink-900 md:text-lg dark:text-pink-100">
              {/* If display_text is 'Connection' or q_no is 'Connection', add icon */}
              {(question.display_text?.toLowerCase() === "connection" ||
                question.q_no?.toLowerCase() === "connection") && (
                <FontAwesomeIcon
                  icon={faLink}
                  className="text-pink-400 drop-shadow-[0_1px_4px_rgba(255,0,128,0.4)] dark:text-pink-300"
                  style={{
                    // Subtle glow in dark mode
                    filter:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "drop-shadow(0 0 3px #ffb6d580)"
                        : "drop-shadow(0 0 8px #ffb6d5cc)",
                  }}
                />
              )}
              {question.display_text}
            </span>
            <Link href={genURL(question.q_no)} className="ml-4">
              {question.q_no?.toLowerCase() === "connection" ||
              question.display_text?.toLowerCase() === "connection" ? (
                <button
                  className="cursor-pointer rounded-lg bg-pink-600 px-5 py-2 font-extrabold text-white shadow-xl ring-2 ring-pink-400/80 transition hover:bg-white hover:text-pink-600 hover:shadow-[0_0_20px_4px_rgba(255,0,128,0.22)] hover:ring-pink-400/90 dark:bg-pink-400 dark:text-pink-950 dark:hover:bg-pink-100 dark:hover:text-pink-700"
                  style={{
                    boxShadow:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "0 0 12px 2px #ffb6d5cc, 0 2px 8px 0 #ff69b444"
                        : "0 0 24px 4px #ffb6d5cc, 0 2px 12px 0 #ff69b488",
                    border: "2px solid #ff69b4",
                  }}
                >
                  <span className="racking-wider inline-flex justify-around drop-shadow-[0_1px_4px_rgba(255,0,128,0.22)] dark:text-white">
                    <FontAwesomeIcon
                      icon={faLink}
                      className="text-blue-400 drop-shadow-[0_1px_4px_rgba(255,0,128,0.4)] dark:text-pink-300"
                      style={{
                        // Subtle glow in dark mode
                        filter:
                          typeof window !== "undefined" &&
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "drop-shadow(0 0 3px #ffb6d580)"
                            : "drop-shadow(0 0 8px #ffb6d5cc)",
                      }}
                    />
                    Link Connections
                  </span>
                </button>
              ) : (
                <button
                  className="cursor-pointer rounded-lg bg-pink-500 px-5 py-2 font-bold text-white shadow-lg ring-2 ring-pink-200/60 transition hover:bg-pink-600 hover:text-white"
                  style={{
                    boxShadow:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "0 0 8px 1px #ffb6d580, 0 2px 8px 0 #ff69b422"
                        : "0 0 16px 2px #ffb6d5cc, 0 2px 8px 0 #ff69b444",
                    border: "1.5px solid #FFD6E8",
                  }}
                >
                  <span className="drop-shadow-[0_1px_2px_rgba(255,0,128,0.18)]">
                    View
                  </span>
                </button>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
