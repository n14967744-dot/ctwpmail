"use client";

import { useEffect, useState } from "react";
import { QuoteButton } from "./AccountingQuote";

/* The accounting page's small header and, on phones, the action bar fixed to the bottom of the screen.
   Both show the quote action only once the hero's own button has scrolled away, so there is never more
   than one red button in view. The dentist page keeps its own header (components/Header.tsx). */

/** True once the hero's button has scrolled out of view. */
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const cta = document.getElementById("hero-cta");
    if (!cta || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(cta);
    return () => io.disconnect();
  }, []);
  return past;
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" />
  </svg>
);

export function AccountingHeader({ phone }: { phone: { display: string; href: string } }) {
  const past = usePastHero();
  return (
    <header className="aHead">
      <div className="aHeadBar">
        <a href="#top" className="aBrand" aria-label="CTWP, back to top">
          <img src="/ctwp-header-logo.png" alt="CTWP, est. 1979. Your copier company." width={1042} height={180} />
        </a>
        <a href={phone.href} data-track="Call (header)" className="aCall" aria-label={`Call our Bryan office at ${phone.display}`}>
          <PhoneIcon /><span>{phone.display}</span>
        </a>
        <span className={`aHeadQuote ${past ? "show" : ""}`} aria-hidden={!past}>
          <QuoteButton className="aBtn aBtnSmall" track="Quote button (header)" tabIndex={past ? 0 : -1} />
        </span>
      </div>
    </header>
  );
}

/** Phones only: the quote action at thumb height, after the hero and until the closing ask is on screen. */
export function ActionBar() {
  const past = usePastHero();
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    const ends = document.querySelectorAll("[data-bar-hide]");
    if (!ends.length || !("IntersectionObserver" in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      setAtEnd(visible.size > 0);
    });
    ends.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const show = past && !atEnd;
  return (
    <div className={`aBar ${show ? "show" : ""}`} aria-hidden={!show}>
      <QuoteButton className="aBtn" track="Quote button (bottom bar)" tabIndex={show ? 0 : -1} />
    </div>
  );
}
