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
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 py-8 px-2">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 bg-white/80 dark:bg-gray-900/80 rounded-lg px-6 py-3 shadow mb-8 mt-4">
          <FontAwesomeIcon icon={faFilm} />
          <span>Movie Mania</span>
        </div>
        <div className="w-full flex flex-col gap-6">
          {General.mm.map((question: any, index: number) => (
            <div
              key={question.q_no}
              className="flex flex-col md:flex-row items-center justify-between w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80 shadow-lg px-6 py-5 mb-2 transition-all hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              <span className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3 md:mb-0">
                {question.display_text}
              </span>
              <Link href={genURL(question.q_no)} className="w-full md:w-auto">
                <button
                  className="cursor-pointer w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg shadow-md
                    hover:from-blue-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                    transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
