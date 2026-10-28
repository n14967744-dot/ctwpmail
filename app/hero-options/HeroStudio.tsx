"use client";

import { useState } from "react";
import { LawHeroDirections, type HeroDirection } from "@/components/LawHeroDirections";
import styles from "./studio.module.css";

const options: { id: HeroDirection; letter: string; name: string; description: string }[] = [
  { id: "split", letter: "A", name: "Clean split", description: "A lighter first screen. Clear message and action first, with Leroy and the copier beside the copy." },
  { id: "editorial", letter: "B", name: "Bold editorial", description: "An open, type-led introduction. A strong headline and one action, with Leroy taking a smaller role." },
  { id: "leroy", letter: "C", name: "Leroy led", description: "A warmer, image-first composition. The artwork gets its own space, with a compact message beside it." },
];

export function HeroStudio() {
  const [direction, setDirection] = useState<HeroDirection>("split");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [firm, setFirm] = useState("Your Law Firm");
  const selected = options.find(option => option.id === direction)!;
  return <main className={styles.studio}>
    <div className={styles.toolbar}>
      <div className={styles.intro}><a href="/law-test">← Back to the demo</a><h1>A better first impression.</h1><p>Three hero directions. Compare the layouts on desktop and phone.</p></div>
      <div className={styles.optionButtons} role="group" aria-label="Hero direction">{options.map(option => <button key={option.id} aria-pressed={direction === option.id} onClick={() => setDirection(option.id)}><span>{option.letter}</span>{option.name}</button>)}</div>
      <div className={styles.settings}>
        <label>Try a firm name<input value={firm} maxLength={160} onChange={event => setFirm(event.target.value)} /></label>
        <div className={styles.devices} role="group" aria-label="Preview width"><button aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button><button aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>Phone</button></div>
      </div>
    </div>
    <div className={styles.caption} aria-live="polite"><strong>{selected.letter} · {selected.name}</strong><span>{selected.description}</span></div>
    <div className={`${styles.screen} ${device === "phone" ? styles.phone : ""}`}><LawHeroDirections direction={direction} businessName={firm} /></div>
    <p className={styles.bottom}>Compare A, B, and C above. Your existing ten-firm demo remains available from the back link.</p>
  </main>;
}
