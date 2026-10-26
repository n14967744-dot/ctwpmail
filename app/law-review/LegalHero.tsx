import Image from "next/image";
import { LAW_OFFICE_HREF } from "./law-solutions";
import styles from "./LegalHero.module.css";

export function LegalHero({ businessName = "" }: { businessName?: string }) {
  return <section className={styles.hero} aria-labelledby="law-title">
    <header className={styles.header}>
      <div className={styles.sender}><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /><span>Your neighbors in<br /><strong>Bryan–College Station</strong></span></div>
      <a className={styles.call} href={LAW_OFFICE_HREF}>Let’s talk <span aria-hidden="true">↗</span></a>
    </header>
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.recipient}><span>{businessName ? "Prepared for" : "For law firms in Bryan–College Station"}</span>{businessName && <p>{businessName}</p>}</div>
        <h1 id="law-title">Your firm’s<br />copier quote.<br /><em>Ready in 24 hours.</em></h1>
        <p className={styles.description}>Tell us what you print, scan, and want to improve. Ryan will put together equipment and pricing options for your firm.</p>
        <div className={styles.action}>
          <a className={styles.button} href="#office-review">Get my personal quote <span aria-hidden="true">↗</span></a>
          <p className={styles.note}>Not sure about page counts or models? Start with what you know.</p>
        </div>
        <p className={styles.timing}>The 24-hour turnaround starts once we have the details needed to price your setup.</p>
      </div>
      <div className={styles.visual}>
        <figure className={styles.art}>
          <Image src="/review/leroy-mail-original.webp" width={1448} height={1086} sizes="(max-width: 899px) 100vw, 50vw" priority alt="Leroy beside a copier in the law-office campaign artwork" />
          <figcaption><span>Meet your welcome committee.</span><strong>Leroy says hello.<br />Ryan handles your quote.</strong></figcaption>
        </figure>
        <div className={styles.quoteCard}><span className={styles.clock} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><strong>A quote built around your work.</strong><p>Equipment fit. Clear costs. A local contact.</p></div></div>
      </div>
    </div>
  </section>;
}
