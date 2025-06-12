"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { General } from "@/types/qns-structures";

export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/movie-mania/${q_no}`;
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-100 to-blue-50 py-8 transition-colors dark:from-gray-950 dark:to-gray-900">
      {/* Header with icon and round name */}
      <div className="mb-8 flex items-center gap-3">
        <FontAwesomeIcon
          icon={faFilm}
          className="text-3xl text-blue-600 drop-shadow md:text-4xl dark:text-pink-400"
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
          Movie Mania
        </h1>
      </div>

      {/* Questions List with spacing */}
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {General.mm.map((question: any) => (
          <div
            key={question.q_no}
            className="group flex items-center justify-between rounded-xl border border-white/30 bg-white/30 px-5 py-4 shadow-lg backdrop-blur-md transition hover:bg-white/60 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-700/60"
          >
            {/* Question text */}
            <span className="text-base font-medium text-gray-800 md:text-lg dark:text-gray-100">
              {question.display_text}
            </span>
            {/* View Button */}
            <Link href={genURL(question.q_no)} className="ml-4">
              <button className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-pink-500 dark:bg-pink-600 dark:hover:bg-blue-500">
                View
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
