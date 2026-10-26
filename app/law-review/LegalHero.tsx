import Image from "next/image";
import { PHONE_HREF } from "@/lib/site";
import styles from "./LegalHero.module.css";

export function LegalHero({ businessName = "" }: { businessName?: string }) {
  return <section className={styles.hero} aria-labelledby="law-title">
    <div className={styles.composition}>
      <div className={styles.copy}>
        <div className={styles.sender}><span>From your neighbors at</span><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /></div>
        <p className={styles.recipient}><span>Prepared for</span>{businessName || "Your law firm"}</p>
        <h1 id="law-title">More time on the case.<br /><em>Less at the copier.</em></h1>
        <p className={styles.description}>The hearing won’t wait for the printer.<br />Let’s find a setup that keeps up with your firm.</p>
      </div>
      <figure className={styles.art}>
        <Image src="/review/leroy-law-v2.webp" width={1448} height={1086} sizes="(max-width: 899px) 100vw, 58vw" priority alt="Leroy with his blue bandana beside an office copier; AI-created campaign artwork" />
        <figcaption><strong>Meet Leroy.</strong><span>Head of greetings. Terrible at paperwork.</span></figcaption>
      </figure>
      <div className={styles.actions}>
        <a className={styles.button} href="#office-review">Let’s talk about your setup <span aria-hidden="true">↗</span></a>
        <p>Local people. Helpful answers. No model numbers needed.</p>
        <a className={styles.call} href={PHONE_HREF}>Prefer to call? Talk with Nick ↗</a>
      </div>
    </div>
  </section>;
}
