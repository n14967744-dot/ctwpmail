"use client";
import { useEffect, useRef, useState } from "react";

export function DeviceHero({ device }: { device: "mobile" | "desktop" }) {
  const container = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const width = device === "desktop" ? 1440 : available && available <= 600 ? available : 390;
  const height = device === "desktop" ? 724 : 944;
  const scale = available ? Math.min(1, available / width) : 1;
  return <div ref={container} style={{ width: "100%", overflow: "hidden" }}>
    <div style={{ width: width * scale, height: height * scale, margin: "0 auto" }}>
      <iframe title="CTWP hero" src="/hero-review/frame/current" style={{ display: "block", border: 0, width, height, transform: `scale(${scale})`, transformOrigin: "top left", visibility: available ? "visible" : "hidden" }} />
    </div>
  </div>;
}
