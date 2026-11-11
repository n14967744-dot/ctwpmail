"use client";

import { useEffect, useState } from "react";
import { IMAGES, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const LINKS: [string, string][] = [
  ["#solutions", "What we do"],
  ["#service", "Service & visit us"],
  ["#rep", "Your local rep"],
  ["#quote", "Get my quote"],
];

type HeaderProps = {
  links?: [string, string][];
  /** Phone shown in the call button. Defaults to the number used on the dentist page. */
  phone?: { display: string; href: string };
  /** A quieter call button, for pages where the hero button should be the only red one. */
  quietCall?: boolean;
};

export function Header({ links = LINKS, phone = { display: PHONE_DISPLAY, href: PHONE_HREF }, quietCall = false }: HeaderProps) {
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <header className="header">
      <div className="bar">
        <button
          type="button"
          className="hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <a href="#top" className="brand" aria-label="CTWP home">
          <img src={IMAGES.logo} alt="CTWP, est. 1979" className="logo" />
        </a>
        <div className="actions">
          <a href="#quote" data-track="Quote chip" className={`quoteChip ${pastHero ? "show" : ""}`} tabIndex={pastHero ? 0 : -1} aria-hidden={!pastHero}>
            Get my quote
          </a>
          <a href={phone.href} data-track="Call (header)" className={`callPill ${quietCall ? "quiet" : ""}`} aria-label={`Call us at ${phone.display}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" />
            </svg>
            <span className="callText">
              <small>Call us</small>
              <strong>{phone.display}</strong>
            </span>
          </a>
        </div>
      </div>
      {open && (
        <nav className="menuPanel" onClick={() => setOpen(false)}>
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a href={phone.href} data-track="Call (menu)" className="menuCall">Call {phone.display}</a>
        </nav>
      )}
    </header>
  );
}
