import type { CSSProperties } from "react";
import styles from "./SectionTwo.module.css";

export type SectionTwoLayout = "columns" | "rows";
/** Display colors must be approved by the campaign theme validation step. */
export type SectionTwoTheme = {
  accent?: string;
  tint?: string;
  action?: string;
  actionText?: string;
};

const benefits = [
  {
    label: "At check-in",
    title: "Simpler insurance-card scanning.",
    description: "Make clear copies of both sides easier to capture. We’ll recommend a scanning setup around how your team adds cards to patient records.",
    icon: "card",
  },
  {
    label: "Behind the front desk",
    title: "Less back-and-forth with paperwork.",
    description: "Consent forms, referrals and treatment plans all need a place to go. We’ll help you plan a clearer route from paper to the right destination.",
    icon: "folder",
  },
  {
    label: "When you need a hand",
    title: "A local team to call.",
    description: "When a printing problem interrupts the day, start with CTWP in Bryan. We’ll talk through the issue and the service options for your equipment.",
    icon: "phone",
  },
] as const;

function BenefitIcon({ name }: { name: (typeof benefits)[number]["icon"] }) {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "card" && <><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8" cy="10" r="1.5"/><path d="M6 15h4M13 10h5M13 14h4"/></>}
    {name === "folder" && <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M8 12h8M8 16h5"/></>}
    {name === "phone" && <path d="m8 3 2 5-3 2a15 15 0 0 0 7 7l2-3 5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-2Z"/>}
  </svg>;
}

export function SectionTwo({ layout = "columns", theme, quoteHref = "#quote", id = "office-benefits" }: {
  layout?: SectionTwoLayout;
  theme?: SectionTwoTheme;
  quoteHref?: string;
  id?: string;
}) {
  const colors = {
    "--s2-accent": theme?.accent,
    "--s2-tint": theme?.tint,
    "--s2-action": theme?.action,
    "--s2-action-text": theme?.actionText,
  } as CSSProperties;
  return <section id={id} className={`${styles.section} ${styles[layout]}`} style={colors} aria-labelledby={`${id}-title`}>
    <div className={styles.wrap}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Made for the work of a dental office</p>
        <h2 id={`${id}-title`}>Less printer friction.<br/>More room for patients.</h2>
        <p className={styles.lead}>Three everyday tasks worth making easier for your team.</p>
      </header>
      <div className={styles.benefits}>
        {benefits.map((benefit, index) => <article className={styles.benefit} key={benefit.icon}>
          <div className={styles.marker}><span className={styles.icon}><BenefitIcon name={benefit.icon}/></span><span className={styles.number}>0{index + 1}</span></div>
          <div className={styles.copy}>
            <p className={styles.label}>{benefit.label}</p>
            <h3>{benefit.title}</h3>
            <p className={styles.description}>{benefit.description}</p>
          </div>
        </article>)}
      </div>
      <div className={styles.nextStep}>
        <div><p className={styles.nextTitle}>Let’s start with how your office works.</p><p className={styles.nextDescription}>Tell us what gets in the way. We’ll help you explore a better fit.</p></div>
        <a className={styles.action} href={quoteHref}>Start my quote <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
