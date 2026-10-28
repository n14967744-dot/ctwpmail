"use client";

import { useEffect, useRef } from "react";
import { lawTestRun, lawTestSource } from "@/lib/law-test-client";

export function TestVisit({ slug }: { slug: string }) {
  const id = useRef("");
  useEffect(() => {
    id.current ||= crypto.randomUUID();
    fetch("/api/law-test", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id.current, runId: lawTestRun(), slug, event: "visit", source: lawTestSource() }),
    }).catch(() => {});
  }, [slug]);
  return null;
}
