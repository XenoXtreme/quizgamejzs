// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

// QNS STRUCTURE
import { InterSch } from "@/types/qns-structures";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel() {
  function genURL(q_no: string) {
    return `/quiz/interschool/round/on-your-fingertips/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-[url('/assets/static/banner2.jpg')] bg-cover bg-center bg-no-repeat text-center transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950">
        <section className="flex w-full max-w-5xl flex-row items-center justify-center px-4 py-8">
          <div className="flex flex-1 items-center justify-center">
            <h1 className="flex items-center gap-2 rounded-lg bg-white/70 px-4 py-2 text-3xl font-bold text-blue-900 shadow md:text-4xl dark:bg-gray-900/70 dark:text-blue-300">
              <FontAwesomeIcon icon={faCube} />
              On Your Fingertips
            </h1>
          </div>
        </section>
        <div className="grid w-full max-w-5xl grid-cols-1 gap-5 px-2 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
          {InterSch.oyf.map((item, idx) => (
            <Link key={item.q_no} href={genURL(item.q_no)} className="group">
              <button
                className={`relative flex aspect-square w-full max-w-xs min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-blue-200 bg-white/80 bg-cover bg-center shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none dark:border-blue-900 dark:bg-gray-900/80 ${
                  [
                    "bg-[url('/assets/static/literature.png')]",
                    "bg-[url('/assets/static/history.png')]",
                    "bg-[url('/assets/static/music.png')]",
                    "bg-[url('/assets/static/sports.png')]",
                    "bg-[url('/assets/static/mythology.jpg')]",
                    "bg-[url('/assets/static/defence.jpg')]",
                    "bg-[url('/assets/static/world.jpg')]",
                    "bg-[url('/assets/static/mystery.png')]",
                  ][idx]
                } `}
              >
                <span className="relative z-10 w-full rounded-lg bg-white/80 px-2 py-4 text-center text-lg font-semibold text-blue-900 transition-all duration-200 group-hover:bg-white/60 md:text-xl dark:bg-gray-900/80 dark:text-blue-200 group-hover:dark:bg-gray-900/60">
                  {item.display_text}
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80" />
              </button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
