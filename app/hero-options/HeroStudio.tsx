"use client";

import { useState } from "react";
import { LawHeroDirections, type HeroDirection } from "@/components/LawHeroDirections";
import { LegalHero } from "@/app/law-review/LegalHero";
import { ResponsiveLegalHero } from "@/components/ResponsiveLegalHero";
import styles from "./studio.module.css";

type CompareDirection = HeroDirection | "current" | "selected";
const options: { id: CompareDirection; letter: string; name: string; description: string }[] = [
  { id: "selected", letter: "✓", name: "Selected", description: "Your chosen combination: the original hero on mobile, and C on desktop. Applied to the law-firm demo." },
  { id: "current", letter: "Ref", name: "Original", description: "The original navy hero, kept as your mobile layout." },
  { id: "split", letter: "A", name: "Clean split", description: "A lighter first screen. Clear message and action first, with Leroy and the copier beside the copy." },
  { id: "leroy", letter: "C", name: "Leroy led", description: "A warmer, image-first composition. The artwork gets its own space, with a compact message beside it." },
];

export function HeroStudio() {
  const [direction, setDirection] = useState<CompareDirection>("selected");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [firm, setFirm] = useState("Your Law Firm");
  const [phoneHeight, setPhoneHeight] = useState(740);
  const selected = options.find(option => option.id === direction)!;
  return <main className={styles.studio}>
    <div className={styles.toolbar}>
      <div className={styles.intro}><a href="/law-test">← Back to the demo</a><h1>Your selected hero.</h1><p>The original layout on mobile. C as the starting point on desktop.</p></div>
      <div className={styles.optionButtons} role="group" aria-label="Hero direction">{options.map(option => <button key={option.id} aria-pressed={direction === option.id} onClick={() => setDirection(option.id)}><span>{option.letter}</span>{option.name}</button>)}</div>
      <div className={styles.settings}>
        <label>Try a firm name<input value={firm} maxLength={160} onChange={event => setFirm(event.target.value)} /></label>
        <div className={styles.devices} role="group" aria-label="Preview width"><button aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button><button aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>Phone</button></div>
      </div>
      {device === "phone" && direction === "selected" && <div className={styles.devices} role="group" aria-label="Phone height">{[568, 740, 844].map(height => <button key={height} aria-pressed={phoneHeight === height} onClick={() => setPhoneHeight(height)}>{height}px tall</button>)}</div>}
    </div>
    <div className={styles.caption} aria-live="polite"><strong>{selected.letter} · {selected.name}</strong><span>{selected.description}</span></div>
    <div className={`${styles.screen} ${device === "phone" ? styles.phone : ""}`}>{direction === "selected" && device === "phone" ? <iframe title="Full law-firm page on a phone" src="/banks-banks-attorneys-at-law-p-c-law-006" style={{ display: "block", width: "100%", height: phoneHeight, border: 0 }} /> : direction === "selected" ? <ResponsiveLegalHero businessName={firm} /> : direction === "current" ? <LegalHero businessName={firm} /> : <LawHeroDirections direction={direction} businessName={firm} />}</div>
    <p className={styles.bottom}>Switch between Desktop and Phone to check your selected combination. Open a firm from the demo to try its form.</p>
  </main>;
}
