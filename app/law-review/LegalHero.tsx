import Image from "next/image";
import { PHONE_HREF } from "@/lib/site";
import styles from "./LegalHero.module.css";

export function LegalHero({ businessName = "" }: { businessName?: string }) {
  return <section className={styles.hero} aria-labelledby="law-title">
    <header className={styles.header}>
      <a href="#" className={styles.logo} aria-label="CTWP home"><img src="/ctwp-mark.webp" alt="CTWP, Your Copier Company" width="111" height="90" /></a>
      <nav className={styles.nav} aria-label="Page sections"><a href="#needs-title">Built for your work</a><a href="#rep-title">Your local team</a></nav>
      <div className={styles.contact}><span>Bryan–College Station</span><a href={PHONE_HREF}>Call CTWP <span aria-hidden="true">↗</span></a></div>
    </header>
    <div className={styles.composition}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>From your neighbors at CTWP</p>
        <p className={styles.recipient}>{businessName ? <><span>Prepared for</span>{businessName}</> : "For law firms in Bryan–College Station"}</p>
        <h1 id="law-title">More time on the case.<br /><em>Less at the copier.</em></h1>
        <p className={styles.description}>Less sorting. Less rescanning. Fewer printer headaches.<br className={styles.mobileBreak} /> Let’s make your office work a little easier.</p>
      </div>
      <figure className={styles.art}>
        <Image src="/review/law-hero.webp" width={1254} height={1254} sizes="(max-width: 899px) 100vw, 60vw" priority alt="Leroy beside a copier in a law office, campaign concept image" />
        <figcaption>Meet Leroy <span>· CTWP’s company dog</span></figcaption>
      </figure>
      <div className={styles.actions}>
        <a className={styles.button} href="#office-review">Get an equipment review <span aria-hidden="true">↗</span></a>
        <p>A few details. A real conversation with your local CTWP rep.</p>
      </div>
    </div>
  </section>;
}
