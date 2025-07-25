"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faUsers } from "@fortawesome/free-solid-svg-icons";

// Dummy data: 20 audience engagement questions
const audienceQuestions = Array.from({ length: 20 }).map((_, i) => ({
  q_no: `${i + 1}`,
  display_text: `Audience Engagement Question ${i + 1}`,
  summary: `This is a fun engagement question for audiences: #${i + 1}`,
}));

export default function AudienceEngagePanel() {
  function genURL(q_no: any) {
    return `/quiz/audience/${q_no}`;
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-100 to-pink-50 py-8 transition-colors dark:from-blue-950 dark:to-pink-950">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <FontAwesomeIcon
          icon={faUsers}
          className="text-3xl text-blue-600 drop-shadow md:text-4xl dark:text-pink-400"
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
          Audience Engagement
        </h1>
      </div>

      {/* Glassy List */}
      <div className="flex w-full max-w-3xl flex-col gap-6">
        {audienceQuestions.map((question, index) => (
          <div
            id={`${question.q_no}-${index}`}
            key={question.q_no}
            className="group flex items-center justify-between rounded-2xl border border-blue-300/60 bg-gradient-to-br from-blue-100/80 via-white/60 to-pink-100/70 px-6 py-5 shadow-[0_4px_32px_0_rgba(0,128,255,0.10),0_1.5px_8px_0_rgba(0,128,255,0.08)] backdrop-blur-2xl transition hover:bg-blue-50/90 hover:shadow-[0_0_16px_2px_rgba(0,128,255,0.18)] dark:border-pink-600/40 dark:bg-gradient-to-br dark:from-blue-900/60 dark:via-gray-900/60 dark:to-pink-800/40 dark:hover:bg-blue-900/70"
            style={{
              boxShadow:
                "0 4px 32px 0 rgba(0,128,255,0.10), 0 1.5px 8px 0 rgba(0,128,255,0.08), 0 0 12px 2px #b6e2ffcc",
              ...(typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches && {
                  boxShadow:
                    "0 4px 24px 0 rgba(0,128,255,0.08), 0 1.5px 8px 0 rgba(0,128,255,0.06), 0 0 4px 1px #b6e2ff80",
                }),
            }}
          >
            <span className="flex items-center gap-3 text-base font-semibold text-blue-900 md:text-lg dark:text-pink-100">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="text-blue-400 drop-shadow-[0_1px_4px_rgba(0,128,255,0.4)] dark:text-pink-300"
                style={{
                  filter:
                    typeof window !== "undefined" &&
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "drop-shadow(0 0 3px #b6e2ff80)"
                      : "drop-shadow(0 0 8px #b6e2ffcc)",
                }}
              />
              {question.display_text}
            </span>
            <Link href={genURL(question.q_no)} className="ml-4">
              <button
                className="cursor-pointer rounded-lg bg-blue-500 px-5 py-2 font-bold text-white shadow-lg ring-2 ring-blue-200/60 transition hover:bg-pink-400 hover:text-white"
                style={{
                  boxShadow:
                    typeof window !== "undefined" &&
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "0 0 8px 1px #b6e2ff80, 0 2px 8px 0 #69b4ff22"
                      : "0 0 16px 2px #b6e2ffcc, 0 2px 8px 0 #69b4ff44",
                  border: "1.5px solid #B6E2FF",
                }}
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,128,255,0.18)]">
                  Engage
                </span>
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
