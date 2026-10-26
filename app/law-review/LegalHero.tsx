import Image from "next/image";
import { PHONE_HREF } from "@/lib/site";
import styles from "./LegalHero.module.css";

export function LegalHero({ businessName = "" }: { businessName?: string }) {
  return <section className={styles.hero} aria-labelledby="law-title">
    <header className={styles.header}>
      <div className={styles.sender}><span>From your<br />neighbors at</span><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /></div>
      <a className={styles.call} href={PHONE_HREF}>Call Nick <span aria-hidden="true">↗</span></a>
    </header>
    <div className={styles.content}>
      <p className={styles.eyebrow}>{businessName ? "Prepared for" : "For law firms in Bryan–College Station"}</p>
      <h1 id="law-title">{businessName || "Your firm. Your way of working."}</h1>
      <p className={styles.description}>Printing and scanning that fit the way your firm works.</p>
      <p className={styles.detail}>From case packets to client files, let’s find the right equipment—with a local team to help.</p>
      <a className={styles.button} href="#office-review">Get an equipment review <span aria-hidden="true">↗</span></a>
      <p className={styles.note}>Start with what you know. We’ll help with the rest.</p>
    </div>
    <figure className={styles.art}>
      <Image src="/review/leroy-mail-original.webp" width={1448} height={1086} sizes="(max-width: 899px) 100vw, 60vw" priority alt="Leroy beside a copier in the original law-office campaign artwork" />
      <figcaption>Meet Leroy<span> · CTWP’s company dog</span></figcaption>
    </figure>
  </section>;
}
