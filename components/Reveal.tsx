"use client";

import { useEffect } from "react";

/** Marks elements with `data-reveal` inside `.acct` as they scroll into view (adds `.in`).
 *  The CSS decides what each one does: most rise a few pixels into place; the color-tier sheets print out.
 *  Nothing is hidden unless this script is running, and nothing moves with prefers-reduced-motion. */
export function Reveal() {
  useEffect(() => {
    const root = document.querySelector(".acct");
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = root.querySelectorAll("[data-reveal]");
    const seen = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        seen.unobserve(e.target);
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    // Anything already on screen when the script starts shows at once, without a fade.
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in", "now");
    });
    root.classList.add("revealOn");
    items.forEach((el) => { if (!el.classList.contains("in")) seen.observe(el); });
    return () => { seen.disconnect(); root.classList.remove("revealOn"); };
  }, []);
  return null;
}
