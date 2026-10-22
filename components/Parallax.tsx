"use client";

import { useEffect, useRef } from "react";

export function Parallax({ src, alt }: { src: string; alt: string }) {
  const band = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = band.current;
    const pic = img.current;
    if (!el || !pic) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // p: 0 when band enters from bottom, 1 when it leaves at top
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const drift = (p - 0.5) * 70;
      const fade = p > 0.55 ? Math.max(0.15, 1 - (p - 0.55) * 2.2) : 1;
      pic.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0) scale(1.12)`;
      pic.style.opacity = fade.toFixed(3);
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="parallax" ref={band} aria-hidden={!alt}>
      <img ref={img} src={src} alt={alt} className="parallaxImg" />
      <div className="parallaxShade" />
      <p className="parallaxCaption">Leroy, CTWP&rsquo;s office dog, approves.</p>
    </div>
  );
}
