import "server-only";
import { rest } from "./supabase";

export type AlertPayload = {
  event: "scan" | "form_submit";
  business: string | null;
  slug: string | null;
  scan_count: number | null;
  time_iso: string;
  name?: string;
  phone?: string | null;
  email?: string | null;
  options?: string[];
  message?: string | null;
};

const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|skype|headless|lighthouse|curl|wget/i;

/** True for link-preview bots and browser/Next prefetches, which should not count as scans. */
export function isBotOrPrefetch(h: Headers): boolean {
  if (BOT_RE.test(h.get("user-agent") ?? "")) return true;
  const purpose = `${h.get("purpose") ?? ""} ${h.get("sec-purpose") ?? ""}`.toLowerCase();
  return purpose.includes("prefetch") || h.has("next-router-prefetch");
}

export async function scanCount(slug: string | null): Promise<number | null> {
  if (!slug) return null;
  const res = await rest(`leads?slug=eq.${encodeURIComponent(slug)}&select=qr_scans&limit=1`);
  if (!res || !res.ok) return null;
  const rows = (await res.json().catch(() => [])) as { qr_scans: number | null }[];
  return rows[0]?.qr_scans ?? null;
}

/** Fire-and-forget webhook. Skips silently if unset; never throws; 3s timeout. */
export async function sendAlert(payload: AlertPayload): Promise<void> {
  const url = process.env.CTWP_ALERT_WEBHOOK_URL;
  if (!url) return;
  const key = process.env.CTWP_ALERT_WEBHOOK_KEY ?? "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) {
    headers.Authorization = `Bearer ${key}`;
    headers["X-Webhook-Key"] = key;
  }
  try {
    await fetch(url, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(3000), cache: "no-store" });
  } catch {
    /* ignore */
  }
}
