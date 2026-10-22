"use client";

import { useEffect, useId, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
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
    <div className={styles.mobile}>
      <a
        className={styles.iconButton}
        href={PHONE_HREF}
        aria-label={`Call Ryan at ${PHONE_DISPLAY}`}
      >
        <PhoneIcon className={styles.icon} />
      </a>
      <button
        type="button"
        className={styles.iconButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <CloseIcon className={styles.icon} />
        ) : (
          <MenuIcon className={styles.icon} />
        )}
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <p className={styles.panelTagline}>Your local copier company</p>
        <a className={styles.panelPhone} href={PHONE_HREF} onClick={() => setOpen(false)}>
          <PhoneIcon className={styles.panelPhoneIcon} />
          <span>
            <span className={styles.panelPhoneName}>Ryan</span>
            <span className={styles.panelPhoneNumber}>{PHONE_DISPLAY}</span>
          </span>
        </a>
        <a className={styles.panelPrimary} href="#save" onClick={() => setOpen(false)}>
          See what I could save
        </a>
        <a className={styles.panelSecondary} href="#solutions" onClick={() => setOpen(false)}>
          Explore solutions for my practice
        </a>
      </div>
    </div>
  );
}
