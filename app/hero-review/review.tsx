"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./review.module.css";

const options = [
  { key: "a", name: "Original", detail: "Current white header and hero. The reference for this round." },
  { key: "b", name: "Image to the top", detail: "The image extends behind the header. Same headline size and width as A." },
  { key: "c", name: "Smaller headline", detail: "B with a 60px desktop headline instead of 72px. Everything else stays the same." },
  { key: "d", name: "Wider text", detail: "B with a wider headline column. Same 72px type, different line breaks." },
];

export function HeroReview() {
  const [variant, setVariant] = useState("b");
  const [mobile, setMobile] = useState(false);
  const [available, setAvailable] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => {
      const key = location.hash.slice(1).toLowerCase();
      setVariant(options.some((o) => o.key === key) ? key : "b");
    };
    sync();
    window.addEventListener("hashchange", sync);
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    if (stage.current) observer.observe(stage.current);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", sync); };
  }, []);
  const selected = options.find((o) => o.key === variant)!;
  const width = mobile ? 390 : 1440;
  const height = mobile ? 920 : 900;
  const scale = available ? Math.min(1, available / width) : 1;
  return (
    <main className={styles.review}>
      <div className={styles.controls}>
        <div className={styles.titleRow}>
          <div><p className={styles.label}>CTWP · Layout review</p><h1>One hero. Four refinements.</h1></div>
          <div className={styles.sizes} aria-label="Preview size">
            <button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button>
            <button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile</button>
          </div>
        </div>
        <nav className={styles.variants} aria-label="Hero variations">
          {options.map((o) => <a key={o.key} href={`#${o.key}`} aria-current={variant === o.key ? "page" : undefined}><b>{o.key.toUpperCase()}</b><span>{o.name}</span></a>)}
        </nav>
        <div className={styles.description}><p aria-live="polite">{selected.detail} {mobile && "Mobile layout is held constant this round."}</p><a href={`/hero-review/frame/${variant}`} target="_blank" rel="noopener">Open full size ↗</a></div>
      </div>
      <div className={styles.stage} ref={stage}>
        <div className={styles.frameWrap} style={{ width: width * scale, height: height * scale }}>
          <iframe title={`Version ${variant.toUpperCase()}: ${selected.name} — ${mobile ? "mobile" : "desktop"}`} src={`/hero-review/frame/${variant}`} style={{ width, height, transform: `scale(${scale})`, visibility: available ? "visible" : "hidden" }} />
        </div>
      </div>
      <p className={styles.note}>Same Leroy image and copy throughout. Choose the layout first; final artwork comes later.</p>
    </main>
  );
}
