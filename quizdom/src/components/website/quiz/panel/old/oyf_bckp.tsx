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
      <section className={styles.back}>
        <section className={styles.head}>
          <div className={styles.left}><h1><FontAwesomeIcon icon={faCube} />   On Your Fingertips</h1></div>
          <div className={styles.next_btn}><Link href="/quiz" ><button>Go to Main Page</button></Link></div>
        </section>
        <div className={styles.main}>
          {General.oyf.map((item, idx) => (
            <button
              key={item.q_no}
              className={`${styles.option} ${styles["option_" + String.fromCharCode(97 + idx)]}`}
            >
              <Link href={genURL(item.q_no)}>
                {item.display_text}
              </Link>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
