// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "./css/oyf.module.css";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

// QNS STRUCTURE
import { General } from "@/types/qns-structures";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/on-your-fingertips/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className="min-h-screen w-full flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat transition-all duration-300 bg-[url('/assets/static/banner2.jpg')] dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950">
        <section className="flex flex-row justify-between items-center w-full max-w-5xl py-8 px-4">
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 bg-white/70 dark:bg-gray-900/70 rounded-lg px-4 py-2 shadow">
              <FontAwesomeIcon icon={faCube} />
              On Your Fingertips
            </h1>
          </div>
          <div>
            <Link href="/quiz">
              <button className="cursor-pointer ml-4 px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition-all text-lg">
                Go to Main Page
              </button>
            </Link>
          </div>
        </section>
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 py-8 px-2">
          {General.oyf.map((item, idx) => (
            <Link key={item.q_no} href={genURL(item.q_no)} className="group">
              <button
                className={`cursor-pointer 
                  aspect-square w-full max-w-xs min-w-[120px] flex items-center justify-center rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-900
                  bg-white/80 dark:bg-gray-900/80 bg-center bg-cover relative overflow-hidden
                  transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none
                  ${[
                    "bg-[url('/assets/static/literature.png')]",
                    "bg-[url('/assets/static/history.png')]",
                    "bg-[url('/assets/static/music.jfif')]",
                    "bg-[url('/assets/static/sports.png')]",
                    "bg-[url('/assets/static/scientist.jpg')]",
                    "bg-[url('/assets/static/mystery.png')]"
                  ][idx]}
                `}
              >
                <span className="relative z-10 w-full text-center font-semibold text-blue-900 dark:text-blue-200 text-lg md:text-xl bg-white/80 dark:bg-gray-900/80 rounded-lg px-2 py-4 group-hover:bg-white/60 group-hover:dark:bg-gray-900/60 transition-all duration-200">
                  {item.display_text}
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none rounded-2xl" />
              </button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
