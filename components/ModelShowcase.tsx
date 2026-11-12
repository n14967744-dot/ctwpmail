"use client";

import { useEffect, useRef, useState } from "react";

export type Model = { brand: string; model: string; type: string; image: string; width: number; height: number };

const HOLD_MS = 4200;

/** Swipeable row of machines. The centered one is full size, its neighbors sit back; it advances on its own
 *  until the visitor touches it. Works as a plain scrolling row without script. */
export function ModelShowcase({ models }: { models: Model[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const activeRef = useRef(0);
  const settled = useRef(true);

  const go = (i: number) => {
    const t = track.current;
    const li = t?.children[i] as HTMLElement | undefined;
    if (!t || !li) return;
    settled.current = false;
    t.scrollTo({ left: li.offsetLeft - (t.clientWidth - li.clientWidth) / 2, behavior: "smooth" });
  };

  // The slide nearest the middle of the row is the active one.
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let frame = 0;
    let idle: ReturnType<typeof setTimeout>;
    const measure = () => {
      const mid = t.scrollLeft + t.clientWidth / 2;
      let best = 0, gap = Infinity;
      Array.from(t.children).forEach((el, i) => {
        const li = el as HTMLElement;
        const d = Math.abs(li.offsetLeft + li.clientWidth / 2 - mid);
        if (d < gap) { gap = d; best = i; }
      });
      activeRef.current = best;
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
      clearTimeout(idle);
      idle = setTimeout(() => { settled.current = true; }, 140);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => { t.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); clearTimeout(idle); };
  }, []);

  // Advance on its own while on screen, until the visitor takes over.
  useEffect(() => {
    const el = root.current, t = track.current;
    if (!el || !t || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stopped = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const run = (on: boolean) => {
      clearInterval(timer);
      timer = undefined;
      if (on && !stopped) timer = setInterval(() => { if (settled.current) go((activeRef.current + 1) % models.length); }, HOLD_MS);
      setAuto(on && !stopped);
    };
    const seen = new IntersectionObserver(([e]) => run(e.isIntersecting), { threshold: 0.5 });
    seen.observe(el);
    const stop = () => { stopped = true; run(false); };
    const events = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    events.forEach((ev) => el.addEventListener(ev, stop, { passive: true }));
    return () => { seen.disconnect(); clearInterval(timer); events.forEach((ev) => el.removeEventListener(ev, stop)); };
  }, [models.length]);

  const m = models[active];
  return (
    <div className={`ms ${auto ? "auto" : ""}`} ref={root} style={{ "--ms-hold": `${HOLD_MS}ms` } as React.CSSProperties}>
      <ul className="msTrack" ref={track} aria-label="Machines we carry">
        {models.map((x, i) => (
          <li key={x.model} className={i === active ? "on" : ""} aria-label={`${x.brand} ${x.model}`}>
            <div className="msStage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.image} alt={`${x.brand} ${x.model}`} width={x.width} height={x.height} loading="lazy" decoding="async" draggable={false} />
            </div>
          </li>
        ))}
      </ul>
      <div className="msCaption" key={active} aria-live="polite">
        <p className="msBrand">{m.brand}</p>
        <p className="msModel">{m.model}</p>
        <p className="msType">{m.type}</p>
      </div>
      <div className="msDots">
        {models.map((x, i) => (
          <button key={x.model} type="button" className={i === active ? "on" : ""} aria-label={`Show ${x.brand} ${x.model}`} aria-current={i === active} onClick={() => go(i)}>
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
