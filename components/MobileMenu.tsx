"use client";

import { useEffect, useId, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import styles from "./Header.module.css";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.menu}>
      <button
        type="button"
        className={styles.hamburger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon className={styles.hamburgerIcon} /> : <MenuIcon className={styles.hamburgerIcon} />}
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <a href="#review" onClick={() => setOpen(false)}>
          Get my review
        </a>
        <a href={PHONE_HREF} onClick={() => setOpen(false)}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
