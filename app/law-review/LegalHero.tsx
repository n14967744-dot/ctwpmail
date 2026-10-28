import Image from "next/image";
import { LAW_OFFICE_HREF } from "./law-solutions";
import styles from "./LegalHero.module.css";

export function LegalHero({ businessName = "", imageSrc = "/review/leroy-mail-original.webp", headingId = "law-title", ctaHref = "#office-review" }: { businessName?: string; imageSrc?: string; headingId?: string; ctaHref?: string }) {
  return <section className={styles.hero} aria-labelledby={headingId}>
    <header className={styles.header}>
      <div className={styles.sender}><span>From your<br />neighbors at</span><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /></div>
      <a className={styles.call} href={LAW_OFFICE_HREF}>Call CTWP <span aria-hidden="true">↗</span></a>
    </header>
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.recipient}><span>{businessName ? "Prepared for" : "Right here in Bryan–College Station"}</span>{businessName && <p>{businessName}</p>}</div>
        <h1 id={headingId}>More time on the case.<br /><em>Less at the copier.</em></h1>
        <p className={styles.description}>Case packets, client files, one more deadline. Let’s make the paperwork part easier.</p>
      </div>
      <figure className={styles.art}>
        <Image src={imageSrc} width={1448} height={1086} sizes="(max-width: 899px) 100vw, 55vw" priority alt="Leroy beside a copier in the law-office campaign artwork" />
        <figcaption><strong>Meet Leroy.</strong> Your friendly introduction to CTWP.</figcaption>
      </figure>
      <div className={styles.action}>
        <a className={styles.button} href={ctaHref}>Get an equipment review <span aria-hidden="true">↗</span></a>
        <p className={styles.note}>Your office. Your needs. A local person to help.</p>
      </div>
    </div>
  </section>;
}
