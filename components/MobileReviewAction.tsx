"use client";

import { useEffect, useState } from "react";
import { legalHeroCopy } from "@/app/law-review/hero-copy";
import styles from "./MobileReviewAction.module.css";

export function MobileReviewAction() {
  const [formVisible, setFormVisible] = useState(false);
  useEffect(() => {
    const form = document.getElementById("office-review");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  return <div className={`${styles.dock} ${formVisible ? styles.hidden : ""}`}>
    <a href="#office-review">{legalHeroCopy.action}<span aria-hidden="true">↗</span></a>
  </div>;
}
