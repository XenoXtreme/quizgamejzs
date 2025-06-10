"use client";
// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "../css/q.module.css";

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

export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/point-blank/${q_no}`;
  }

  return (
    <div className={nunito.className}>
      <section className={styles.oyo_qns}>
        <h1 className={styles.oyo}>
          <FontAwesomeIcon icon={faCube} /> Point Blank
        </h1>
        {InterSch.pbk.map((question: any, index: any) => (
            <div key={question.q_no} className={styles.qns}>
              {/* Question display text */}
              <h3 className={styles.ti}>
                {question.display_text}
              </h3>
              {/* Link button to view the question */}
              <Link href={genURL(question.q_no)} className="no-underline">
                <button
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md
                             hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75
                             transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  View
                </button>
              </Link>
            </div>
          ))}
       
      </section>
    </div>
  );
}
