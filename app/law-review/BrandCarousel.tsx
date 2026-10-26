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
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update(); motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  return <div className={styles.carousel} role="region" aria-label="Brands CTWP carries">
    <div className={styles.heading}><h3>Brands we carry</h3>{!reducedMotion && <button type="button" className={styles.control} aria-label={paused ? "Play brand slideshow" : "Pause brand slideshow"} onClick={() => setPaused(p => !p)}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>{paused ? "Play" : "Pause"}</button>}</div>
    <div className={styles.viewport}>
      <div className={styles.track} style={{ animationPlayState: paused ? "paused" : undefined }}>
        {[0, 1].map(copy => <div className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {brands.map(brand => <div className={styles.brand} key={brand.name}><img src={brand.src} alt={copy === 0 ? brand.name : ""} width="180" height="80" /></div>)}
        </div>)}
      </div>
    </div>
  </div>;
}
