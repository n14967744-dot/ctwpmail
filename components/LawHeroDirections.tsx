import Image from "next/image";
import { LAW_OFFICE_HREF } from "@/app/law-review/law-solutions";
import styles from "./LawHeroDirections.module.css";

export type HeroDirection = "split" | "editorial" | "leroy";

function Header() {
  return <header className={styles.header}>
    <a href="/law-test" aria-label="CTWP law-firm demo"><img src="/ctwp-mark.webp" alt="CTWP — Your Copier Company" width="111" height="90" /></a>
    <span className={styles.local}>Your local copier company<span>Bryan–College Station</span></span>
    <a className={styles.call} href={LAW_OFFICE_HREF}>Talk to CTWP <span aria-hidden="true">↗</span></a>
  </header>;
}

function Action({ text = "Start your equipment review" }: { text?: string }) {
  return <a className={styles.cta} href="/law-test">{text}<span aria-hidden="true">↗</span></a>;
}

export function LawHeroDirections({ direction, businessName }: { direction: HeroDirection; businessName: string }) {
  const firm = businessName.trim() || "Your Law Firm";
  return <section className={`${styles.hero} ${styles[direction]}`} aria-label={`${direction} hero preview`}>
    <Header />
    {direction === "split" && <>
      <div className={styles.splitBody}>
        <div className={styles.splitCopy}>
          <p className={styles.forFirm}>An equipment review for <strong>{firm}</strong></p>
          <h1>A better setup.<br /><em>A better workday.</em></h1>
          <p className={styles.description}>Copiers, scanning, and local support that fit the work your firm does every day.</p>
          <Action />
          <p className={styles.fine}>Start with what you know. Ryan will help with the rest.</p>
        </div>
        <figure className={styles.splitArt}>
          <Image src="/review/leroy-mail-original.webp" alt="Leroy beside a copier in the CTWP law-office campaign artwork" width={1448} height={1086} sizes="(max-width: 650px) 100vw, 55vw" priority />
          <figcaption><span>Meet Leroy.</span> Your introduction to the team.</figcaption>
        </figure>
      </div>
      <div className={styles.supportRow}><span>Equipment that fits</span><span>A clear view of costs</span><span>Service right here in Bryan</span></div>
    </>}
    {direction === "editorial" && <>
      <div className={styles.editorialBody}>
        <p className={styles.recipient}>Prepared for <strong>{firm}</strong></p>
        <p className={styles.eyebrow}>The work behind your cases</p>
        <h1>Make room<br />for <em>casework.</em></h1>
        <p className={styles.editorialDescription}>Printing. Scanning. One more deadline.<br />Let’s make the paperwork part easier.</p>
        <Action text="Let’s look at your setup" />
        <div className={styles.editorialFooter}>
          <p>Copiers &amp; printers<span>Service &amp; supplies</span></p>
          <div className={styles.leroyNote}><Image src="/leroy.png" alt="Leroy, CTWP’s office dog" width={64} height={64} /><p>Leroy says hello.<span>Ryan takes it from here.</span></p></div>
          <p>Local people.<span>A practical next step.</span></p>
        </div>
      </div>
    </>}
    {direction === "leroy" && <>
      <div className={styles.leroyBody}>
        <figure className={styles.leroyArt}>
          <Image src="/review/leroy-mail-original.webp" alt="Leroy welcomes your firm beside CTWP office equipment" width={1448} height={1086} sizes="(max-width: 650px) 100vw, 60vw" priority />
          <figcaption>Consider this a friendly introduction.</figcaption>
        </figure>
        <div className={styles.leroyCopy}>
          <p className={styles.forFirm}>Hello, <strong>{firm}.</strong></p>
          <h1>Good people.<br /><em>Better printing.</em></h1>
          <p className={styles.description}>A local team to help your firm find the right equipment—and keep it working.</p>
          <Action text="Meet your next setup" />
          <a className={styles.secondary} href={LAW_OFFICE_HREF}>Or talk with the Bryan team <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={styles.leroyFooter}><span>CTWP · Serving Texas since 1979</span><span>Your office. Your work. Our local support.</span></div>
    </>}
  </section>;
}
