"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./single-review.module.css";

export function SingleHeroReview({ device }: { device: "mobile" | "desktop" }) {
  const stage = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const width = device === "mobile" ? 390 : 1440;
  const height = device === "mobile" ? 944 : 724;
  const scale = available ? Math.min(1, available / width) : 1;
  return <main className={styles.workspace}>
    <header className={styles.heading}>
      <p>CTWP · HERO WORKSPACE</p>
      <h1>{device === "mobile" ? "Mobile" : "Desktop"}</h1>
    </header>
    <div className={styles.stage} ref={stage}>
      <div className={styles.frame} style={{ width: width * scale, height: height * scale }}>
        <iframe title={`${device === "mobile" ? "Mobile" : "Desktop"} hero`} src="/hero-review/frame/current" style={{ width, height, transform: `scale(${scale})`, visibility: available ? "visible" : "hidden" }} />
      </div>
    </div>
    <p className={styles.note}>Hero only · Working draft</p>
  </main>;
}
