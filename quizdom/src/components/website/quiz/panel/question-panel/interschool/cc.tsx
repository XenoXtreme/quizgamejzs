// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "./css/cc.module.css";

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
    return `/quiz/${category}/round/connections/${q_no}`;
  }
  return (
    <div className={nunito.className}>
      <section className={styles.oyo_qns}>
        <h1 className={styles.oyo}>
          <FontAwesomeIcon icon={faCube} /> Connections
        </h1>
        {InterSch.cc.map((item, idx) => (
          <div className={styles.qns} key={item.q_no}>
            <h3 className={styles.ti}>
              {item.q_no === "answer" ? (
                <>
                  <FontAwesomeIcon icon={faCube} /> {item.display_text}
                </>
              ) : (
                item.display_text
              )}
            </h3>
            <Link href={genURL(item.q_no)}>
              <button className={styles.qns_ans}>
                {item.q_no === "answer" ? "Connection" : "View"}
              </button>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
