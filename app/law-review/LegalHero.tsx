import Image from "next/image";
import styles from "./LegalHero.module.css";
import { legalHeroCopy } from "./hero-copy";

export function LegalHero({ businessName = "", imageSrc = "/review/leroy-mail-original.webp", headingId = "law-title", ctaHref = "#office-review" }: { businessName?: string; imageSrc?: string; headingId?: string; ctaHref?: string }) {
  return <section className={styles.hero} aria-labelledby={headingId}>
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.recipient}><span>Prepared for</span><h1 className={styles.firmName} id={headingId}>{businessName || "Your Law Firm"}</h1></div>
        <p className={styles.message}>{legalHeroCopy.mobileMessage(businessName)}</p>
      </div>
      <div className={styles.action}>
        <a className={styles.button} href={ctaHref}>{legalHeroCopy.action} <span aria-hidden="true">↗</span></a>
        <p className={styles.note}>Your office. Your needs. A local person to help.</p>
      </div>
      <figure className={styles.art}>
        <Image src={imageSrc} width={1448} height={1086} sizes="(max-width: 899px) 100vw, 55vw" priority alt="Leroy beside a copier in the law-office campaign artwork" />
        <figcaption><strong>Meet Leroy.</strong> Your friendly introduction to CTWP.</figcaption>
      </figure>
    </div>
  </section>;
}
