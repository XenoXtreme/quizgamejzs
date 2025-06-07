// REACT
import React from "react";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "../css/q.module.css";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";


export default function Panel({ category }: { category: string }) {
  function genURL(q_no: string) {
    return `/quiz/${category}/round/movie-mania/${q_no}`;
  }
  // QNS STRUCTURE
  const movieManiaQuestions = [
  {
    "q_no": "1",
    "display_text": "Question - I",
  },
  {
    "q_no": "2",
    "display_text": "Question - II",
  },
  {
    "q_no": "3",
    "display_text": "Question - III",
  },
  {
    "q_no": "4",
    "display_text": "Question - IV",
  },
  {
    "q_no": "5",
    "display_text": "Question - V",
  },
  {
    "q_no": "6",
    "display_text": "Question - VI",
  },
  {
    "q_no": "7",
    "display_text": "Question - VII",
  },
  {
    "q_no": "8",
    "display_text": "Question - VIII",
  }
]

  return (
    <div >
      <section className={styles.oyo_qns}>
        <h1 className={styles.oyo}>
          <FontAwesomeIcon icon={faCube} /> Movie Mania
        </h1>
        {movieManiaQuestions.map((question: any, index: any) => (
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
