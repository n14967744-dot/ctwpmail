"use client";

import { useEffect, useState } from "react";
import styles from "./BrandCarousel.module.css";

const brands = [
  { name: "Kyocera", src: "https://www.ctwp.com/wp-content/uploads/2024/11/kyocera-logo.jpg" },
  { name: "Canon", src: "https://www.ctwp.com/wp-content/uploads/2024/11/cannon.jpg" },
  { name: "Konica Minolta", src: "https://www.ctwp.com/wp-content/uploads/2024/11/Logo_Konica_Minolta.svg-768x446.png" },
  { name: "Xerox", src: "https://www.ctwp.com/wp-content/uploads/2024/11/xerox-platinum-authorized-dealer-768x654.png" },
  { name: "Lexmark", src: "https://www.ctwp.com/wp-content/uploads/2024/11/LexmarkLogo_RGB_1200-768x161.jpg" },
  { name: "KIP", src: "https://www.ctwp.com/wp-content/uploads/2024/11/KIP-Logo-Circle.png" },
];

export function BrandCarousel() {
  const [perSlide, setPerSlide] = useState(2);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true);
  const [hovered, setHovered] = useState(false);
  const total = Math.ceil(brands.length / perSlide);
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 900px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => { setPerSlide(screen.matches ? 3 : 2); setActive(0); };
    const preference = () => setPaused(motion.matches);
    resize(); preference();
    screen.addEventListener("change", resize);
    motion.addEventListener("change", preference);
    return () => { screen.removeEventListener("change", resize); motion.removeEventListener("change", preference); };
  }, []);
  useEffect(() => {
    if (paused || hovered) return;
    const timer = window.setInterval(() => setActive(n => (n + 1) % total), 4500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, total]);
  const move = (direction: number) => { setPaused(true); setActive(n => (n + direction + total) % total); };
  return <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Brands CTWP carries" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)}>
    <div className={styles.heading}><p>Brands we carry</p><div className={styles.controls}>
      <button type="button" aria-label="Previous brands" onClick={() => move(-1)}>←</button>
      <button type="button" aria-label={paused ? "Play brand slideshow" : "Pause brand slideshow"} onClick={() => setPaused(p => !p)}>{paused ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor"/></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4v12M14 4v12" stroke="currentColor" strokeWidth="3"/></svg>}</button>
      <button type="button" aria-label="Next brands" onClick={() => move(1)}>→</button>
    </div></div>
    <div className={styles.viewport} aria-live={paused ? "polite" : "off"}>
      <div className={styles.track} style={{ transform: `translateX(-${active * 100}%)` }}>
        {Array.from({ length: total }, (_, page) => <div key={page} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${page + 1} of ${total}`} aria-hidden={page !== active} style={{ gridTemplateColumns: `repeat(${perSlide}, minmax(0, 1fr))` }}>
          {brands.slice(page * perSlide, (page + 1) * perSlide).map(brand => <div className={styles.brand} key={brand.name}><img src={brand.src} alt={brand.name} width="180" height="80" /></div>)}
        </div>)}
      </div>
    </div>
    <div className={styles.dots} aria-hidden="true">{Array.from({ length: total }, (_, page) => <span key={page} className={page === active ? styles.active : ""} />)}</div>
  </div>;
}
