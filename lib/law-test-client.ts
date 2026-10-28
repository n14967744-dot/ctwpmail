"use client";

let fallbackRun = "";
export function lawTestRun() {
  try {
    const key = "ctwp-law-test-run-v1";
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return fallbackRun ||= crypto.randomUUID();
  }
}
export function lawTestSource() {
  const query = new URLSearchParams(window.location.search);
  return [query.get("src"), query.get("utm_medium")].some(value => value?.toLowerCase() === "qr") ? "qr" : "direct";
}
