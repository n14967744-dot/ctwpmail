"use client";

import { useState } from "react";
import { LawHeroDirections, type HeroDirection } from "@/components/LawHeroDirections";
import { LegalHero } from "@/app/law-review/LegalHero";
import styles from "./studio.module.css";

type CompareDirection = HeroDirection | "current";
const options: { id: CompareDirection; letter: string; name: string; description: string }[] = [
  { id: "current", letter: "Now", name: "Current", description: "The current navy hero from your ten-firm demo, using the original component and artwork." },
  { id: "split", letter: "A", name: "Clean split", description: "A lighter first screen. Clear message and action first, with Leroy and the copier beside the copy." },
  { id: "leroy", letter: "C", name: "Leroy led", description: "A warmer, image-first composition. The artwork gets its own space, with a compact message beside it." },
];

export function HeroStudio() {
  const [direction, setDirection] = useState<CompareDirection>("current");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [firm, setFirm] = useState("Your Law Firm");
  const selected = options.find(option => option.id === direction)!;
  return <main className={styles.studio}>
    <div className={styles.toolbar}>
      <div className={styles.intro}><a href="/law-test">← Back to the demo</a><h1>Compare with your current hero.</h1><p>Your current layout alongside A and C, on desktop and phone.</p></div>
      <div className={styles.optionButtons} role="group" aria-label="Hero direction">{options.map(option => <button key={option.id} aria-pressed={direction === option.id} onClick={() => setDirection(option.id)}><span>{option.letter}</span>{option.name}</button>)}</div>
      <div className={styles.settings}>
        <label>Try a firm name<input value={firm} maxLength={160} onChange={event => setFirm(event.target.value)} /></label>
        <div className={styles.devices} role="group" aria-label="Preview width"><button aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button><button aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>Phone</button></div>
      </div>
    </div>
    <div className={styles.caption} aria-live="polite"><strong>{selected.letter} · {selected.name}</strong><span>{selected.description}</span></div>
    <div className={`${styles.screen} ${device === "phone" ? styles.phone : ""}`}>{direction === "current" ? <LegalHero businessName={firm} /> : <LawHeroDirections direction={direction} businessName={firm} />}</div>
    <p className={styles.bottom}>Compare Current, A, and C above. Your ten-firm demo is available from the back link.</p>
  </main>;
}
