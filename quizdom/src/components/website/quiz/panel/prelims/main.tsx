// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "./css/round.module.css";

// FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

// FONT
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div className={styles.mainq}>
        <h1 className={styles.head1}>
          <FontAwesomeIcon icon={faCube} /> Cateogry:{" "}
        </h1>
        <section className={styles.injr}>
          <div className={styles.rounds}>
            <Link href="/quiz/prelims/intraschool/junior">
              <div className={styles.first}>
                <img src="/_asset/static/prelims.png" loading="lazy" alt="person" />
              </div>
              <div className={styles.second}>
                <h1>Intra School (Junior)</h1>
              </div>
            </Link>
          </div>

          <div className={styles.rounds}>
             <Link href="/quiz/prelims/intraschool/senior">
              <div className={styles.first}>
                <img src="/_asset/static/prelims.png" loading="lazy" alt="person" />
              </div>
              <div className={styles.second}>
                <h1>Intra School (Senior)</h1>
              </div>
            </Link>
          </div>
        
          
          <div className={styles.rounds}>
             <Link href="/quiz/prelims/interschool">
              <div className={styles.first}>
                <img src="/_asset/static/prelims.png" loading="lazy" alt="person" />
              </div>
              <div className={styles.second}>
                <h1>Inter School</h1>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
