"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./review.module.css";

const options = {
  a: { title: "Three clear benefits", description: "Three columns on desktop; individual cards on mobile. Recommended for quick scanning." },
  b: { title: "A guided read", description: "Headline on the left, three rows on the right. A continuous list on mobile." },
};

export default function Review() {
  const [variant, setVariant] = useState<"a" | "b">("a");
  const [width, setWidth] = useState(1200);
  const [available, setAvailable] = useState(1200);
  const [height, setHeight] = useState(1200);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const update = () => {
      const [v, w] = window.location.hash.slice(1).split("-");
      if (v === "a" || v === "b") setVariant(v);
      if ([320, 360, 390, 430, 768, 1200, 1440].includes(Number(w))) setWidth(Number(w));
    };
    update(); window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;
    const measure = () => {
      observer?.disconnect();
      const body = iframe.contentDocument?.body;
      if (!body) return;
      observer = new ResizeObserver(() => setHeight(Math.ceil(body.getBoundingClientRect().height)));
      observer.observe(body);
    };
    iframe.addEventListener("load", measure); measure();
    return () => { iframe.removeEventListener("load", measure); observer?.disconnect(); };
  }, [variant]);
  const choose = (v: "a" | "b", w: number) => { setVariant(v); setWidth(w); window.location.hash = `${v}-${w}`; };
  const scale = Math.min(1, available / width);
  return <div className={styles.review}>
    <header className={styles.controls}>
      <p className={styles.small}>CTWP · Section two · Design review</p>
      <div className={styles.headingRow}><h1>What improves for your office?</h1><a href="/hero-review#d" target="_blank" rel="noopener">Hero D reference ↗</a></div>
      <div className={styles.options} role="group" aria-label="Layout">
        {(["a", "b"] as const).map(v => <a key={v} href={`#${v}-${width}`} aria-current={variant === v ? "page" : undefined} onClick={() => choose(v, width)}><b>{v.toUpperCase()}</b><span>{options[v].title}{v === "a" && <small>Recommended</small>}</span></a>)}
      </div>
      <div className={styles.tools}>
        <div role="group" aria-label="Preview size" className={styles.sizes}>
          <button aria-pressed={width >= 768} onClick={() => choose(variant, 1200)}>Desktop</button>
          <button aria-pressed={width < 768} onClick={() => choose(variant, 390)}>Mobile</button>
          <label className={styles.width}>Width <select aria-label="Viewport width" value={width} onChange={event => choose(variant, Number(event.target.value))}>{[320,360,390,430,768,1200,1440].map(w => <option key={w} value={w}>{w}px</option>)}</select></label>
        </div>
        <a href={`/section-two-review/frame/${variant}`} target="_blank" rel="noopener">Open layout {variant.toUpperCase()} full size ↗</a>
      </div>
      <p className={styles.description}>{options[variant].description}</p>
    </header>
    <div ref={stage} className={styles.stage}>
      <div className={styles.frameWrap} style={{ width: width * scale, height: height * scale }}>
        <iframe ref={frame} title={`Layout ${variant.toUpperCase()} at ${width}px`} src={`/section-two-review/frame/${variant}`} style={{ width, height, transform: `scale(${scale})` }}/>
      </div>
    </div>
    <p className={styles.note}>Same copy, colors and action in both layouts. The small CTWP header is review context; this section will sit directly after the approved hero.</p>
  </div>;
}
