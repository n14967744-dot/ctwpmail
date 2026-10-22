export const PHONE_DISPLAY = "(210) 284-3727";
export const PHONE_HREF = "tel:+12102843727";
export const DEFAULT_PRACTICE = "Your Practice";

export function practiceFromParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return DEFAULT_PRACTICE;
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return DEFAULT_PRACTICE;
  const safe = cleaned.replace(/[^a-zA-Z0-9&'.,\- ]/g, "").slice(0, 64).trim();
  return safe || DEFAULT_PRACTICE;
}
