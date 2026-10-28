"use client";

import { useState } from "react";
import { ResponsiveLegalHero } from "@/components/ResponsiveLegalHero";
import styles from "./studio.module.css";

const creatives = [
  { id: "case-file", name: "The case file", description: "Casework in motion: LeRoy, the Kyocera, and a sweep of legal paperwork." },
  { id: "paperwork-columns", name: "Order in the paperwork", description: "Law books and case files become a courthouse-inspired backdrop." },
  { id: "takes-the-stand", name: "LeRoy takes the stand", description: "A friendly courtroom moment with LeRoy at the counsel table." },
];

export function CreativeStudio() {
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  return <main className={styles.studio}>
    <header className={styles.intro}>
      <a href="/law-test">← Open the full law-firm demo</a>
      <h1>Same hero. Three creatives.</h1>
      <p>Real-looking LeRoy, a Kyocera copier, and a little legal imagination. Only the artwork changes between these three options.</p>
      <div className={styles.devices} role="group" aria-label="Preview width">
        <button aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
        <button aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>Phone</button>
      </div>
      <p className={styles.note}>Your selected C layout on desktop; your original layout on mobile. Each image adapts to both.</p>
      <nav aria-label="Creative options">{creatives.map((creative, index) => <a key={creative.id} href={`#${creative.id}`}>{index + 1}. {creative.name}</a>)}</nav>
    </header>
    {creatives.map((creative, index) => <section className={styles.option} id={creative.id} key={creative.id} aria-labelledby={`${creative.id}-label`}>
      <div className={styles.caption}><h2 id={`${creative.id}-label`}>{index + 1} — {creative.name}</h2><p>{creative.description}</p></div>
      <div className={`${styles.screen} ${device === "phone" ? styles.phone : ""}`}>
        <ResponsiveLegalHero businessName="Your Law Firm" imageSrc={`/law/creatives/${creative.id}.webp`} idPrefix={creative.id} ctaHref="/law-test" />
      </div>
    </section>)}
  </main>;
}
