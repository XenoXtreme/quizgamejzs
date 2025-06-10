// REACT
import React from "react";

// NEXT JS FONT
import { Nunito } from "next/font/google";

// NEXT JS
import Link from "next/link";

// CSS
import styles from "./css/panel.module.css";

// FONT
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function Panel() {
  return (
    <div className={nunito.className}>
      <div className={styles.container}>
        <section className={styles.all}>
          <section className={styles.qz}>
            <div className={styles.left}>
              <img src="/assets/static/jzs.png" loading="lazy" alt="Logo" />
            </div>
            <div className={styles.right}>
              <h1>Prelims</h1>
              <p>Questions for Prelims.</p>
            </div>
            <div className={styles.rgt_btn}>
              <Link href="/quiz/prelims">
                <button>View</button>
              </Link>
            </div>
          </section>
          <section className={styles.qz}>
            <div className={styles.left}>
              <img src="/assets/static/jzs.png" loading="lazy" alt="Logo" />
            </div>
            <div className={styles.right}>
              <h1>Intra School - (Junior)</h1>
              <p>
                Access the questions meant for students of class VI- VIII.
                Explore the world gain knowlgde and do much more!
              </p>
            </div>
            <div className={styles.rgt_btn}>
              <Link href="/quiz/intraschool/junior">
                <button>View</button>
              </Link>
            </div>
          </section>
          <section className={styles.qz}>
            <div className={styles.left}>
              <img src="/assets/static/jzs.png" loading="lazy" alt="Logo" />
            </div>
            <div className={styles.right}>
              <h1>Intra School - (Senior)</h1>
              <p>
                Access the questions meant for students of class IX-XII. Explore
                the world gain knowlgde and do much more!
              </p>
            </div>
            <div className={styles.rgt_btn}>
              <Link href="/quiz/intraschool/senior">
                <button>View</button>
              </Link>
            </div>
          </section>
          <section className={styles.qz}>
            <div className={styles.left}>
              <img src="/assets/static/jzs.png" loading="lazy" alt="Logo" />
            </div>
            <div className={styles.right}>
              <h1>Inter School Quiz Competition</h1>
              <p>
                Access the questions meant for students of class IX-XII. Explore
                the world gain knowlgde and do much more!
              </p>
            </div>
            <div className={styles.rgt_btn}>
              <Link href="/quiz/interschool">
                <button>View</button>
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
