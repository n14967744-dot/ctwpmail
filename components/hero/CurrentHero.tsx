import type { CSSProperties } from "react";
import { IMAGES, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { universityTheme } from "@/lib/hero-theme";
import styles from "./CurrentHero.module.css";

export function CurrentHero() {
  const theme = universityTheme;
  const colors = { "--hero-dark": theme.background, "--hero-accent": theme.primary, "--hero-text": theme.text, "--hero-button-text": theme.buttonText } as CSSProperties;
  return <main id="top" className={styles.hero} style={colors}>
    <img src={IMAGES.hero} className={styles.ambient} alt="" aria-hidden="true" />
    <img src={IMAGES.hero} className={styles.image} alt="Leroy beside a Konica Minolta copier in a dental office" fetchPriority="high" />
    <div className={styles.shade} />
    <header className={styles.header}>
      <a href="#top" className={styles.ctwp} aria-label="CTWP"><img src={IMAGES.logo} alt="CTWP, Your Copier Company" /></a>
      <img className={styles.recipient} src={theme.logo} alt="University Dental Associates" />
    </header>
    <div className={styles.content}>
      <h1>University Dental<br className={styles.desktopBreak} /> Associates.</h1>
      <p className={styles.description}>CTWP has helped dental offices across Texas since 1979. Here&rsquo;s what we can do for yours.</p>
      <a className={styles.button} href="/universitydentalassociates#quote" target="_top">Start University Dental&rsquo;s quote</a>
      <a className={styles.call} href={PHONE_HREF}>Call CTWP · {PHONE_DISPLAY}</a>
    </div>
  </main>;
}
