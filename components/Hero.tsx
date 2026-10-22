import Image from "next/image";
import styles from "./Hero.module.css";

export function Hero({ practice }: { practice: string }) {
  return (
    <>
      <section className={styles.hero} id="review" aria-labelledby="hero-heading">
        <Image
          className={styles.photo}
          src="/leroy.png"
          alt="Leroy, CTWP's Yorkie mascot"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.copy}>
          <h1 id="hero-heading" className={styles.headline}>
            See what {practice} could save on printing.
          </h1>
          <p className={styles.sub}>
            Free 10-minute copier and print-cost review from your local CTWP team.
          </p>
          <a className={styles.cta} href="#review">
            Get my review
          </a>
        </div>
      </section>
      <section className={styles.eyebrow} aria-label="Local trust">
        <p className={styles.kicker}>
          <span className={styles.accent} aria-hidden="true" />
          Local since 1979
        </p>
        <p className={styles.trusted}>Trusted by Brazos Valley offices</p>
      </section>
    </>
  );
}
