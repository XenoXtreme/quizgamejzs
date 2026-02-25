// REACT
import React from "react";

// NEXT JS FONT
import { Geist } from "next/font/google";

// NEXT JS
import Link from "next/link";

// LUCIDE ICONS
import { Layers } from "lucide-react";

// FONT
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function Panel() {
  return (
    <div className={geist.className}>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-8 dark:bg-neutral-950 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3 text-center sm:mb-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <Layers className="h-6 w-6 text-neutral-900 dark:text-neutral-100" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
            Select Category
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose a quiz category to begin
          </p>
        </div>

        {/* Categories Grid */}
        <section className="grid w-full max-w-xs grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2 sm:gap-6">
          {/* Inter School */}
          <Link
            href="/quiz/prelims/interschool"
            className="group col-span-1 sm:col-span-2 sm:mx-auto sm:max-w-md"
          >
            <div className="flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-sm">
                <img
                  src="/assets/static/prelims.png"
                  loading="lazy"
                  alt="Inter School"
                  className="h-10 w-10 rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-300">
                  Inter School
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Preliminary round questions
                </p>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
