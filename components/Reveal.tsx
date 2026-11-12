"use client";

import { useEffect } from "react";

/** Fades sections up as they scroll into view. Marks: any element with `data-reveal` inside `.acct`.
 *  Nothing is hidden unless this script is running, so the page reads fine without it. */
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
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    root.classList.add("revealOn");
    items.forEach((el) => seen.observe(el));
    return () => { seen.disconnect(); root.classList.remove("revealOn"); };
  }, []);
  return null;
}
