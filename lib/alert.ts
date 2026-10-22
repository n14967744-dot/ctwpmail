import "server-only";
import { rest } from "./supabase";

export type AlertPayload = {
  event: "scan" | "form_submit";
  business: string | null;
  slug: string | null;
  /** "qr" when the visit URL carried ?src=qr (printed QR code), else "direct". */
  source?: "qr" | "direct";
  scan_count: number | null;
  time_iso: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  email?: string | null;
  options?: string[];
  message?: string | null;
  lead_id?: number | null;
  lead_phone?: string | null;
  lead_website?: string | null;
};

/** Normalize a US phone to E.164 (+1XXXXXXXXXX); null if it isn't 10 digits (or 11 starting with 1). */
export function toE164(raw: string | null | undefined): string | null {
  const d = (raw ?? "").replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return null;
}

async function leadInfo(slug: string | null): Promise<{ id: number | null; phone: string | null; website: string | null }> {
  const none = { id: null, phone: null, website: null };
  if (!slug) return none;
  const res = await rest(`leads?slug=eq.${encodeURIComponent(slug)}&select=id,phone,website&limit=1`);
  if (!res || !res.ok) return none;
  const rows = (await res.json().catch(() => [])) as { id: number; phone: string | null; website: string | null }[];
  const r = rows[0];
  return r ? { id: r.id ?? null, phone: toE164(r.phone), website: r.website?.trim() || null } : none;
}

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

async function post(label: string, url: string, headers: Record<string, string>, payload: AlertPayload) {
  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000), cache: "no-store" });
    console.log(`[alert] ${label} ${payload.event} source=${payload.source ?? "-"} status=${res.status}`);
  } catch (e) {
    console.error(`[alert] ${label} ${payload.event} error=${e instanceof Error ? e.name + ": " + e.message : "unknown"}`);
  }
}

/** Fire-and-forget webhooks (Grok Bot alert + GoHighLevel). Each skips silently if unset; never throws; 3s timeout. */
export async function sendAlert(payload: AlertPayload): Promise<void> {
  if (payload.name && !payload.first_name) {
    const parts = payload.name.trim().split(/\s+/);
    payload = { ...payload, first_name: parts[0], last_name: parts.slice(1).join(" ") || undefined };
  }
  const lead = await leadInfo(payload.slug);
  payload = { ...payload, lead_id: lead.id, lead_phone: lead.phone, lead_website: lead.website };
  // Scans carry no visitor info: use the business phone so GHL matches the mailer contact.
  if (payload.event === "scan") payload.phone = lead.phone;
  const jobs: Promise<void>[] = [];
  const url = process.env.CTWP_ALERT_WEBHOOK_URL;
  if (url) {
    const key = process.env.CTWP_ALERT_WEBHOOK_KEY ?? "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (key) {
      headers.Authorization = `Bearer ${key}`;
      headers["X-Webhook-Key"] = key;
    }
    jobs.push(post("grokbot", url, headers, payload));
  }
  const ghl = process.env.GHL_WEBHOOK_URL;
  if (ghl) jobs.push(post("ghl", ghl, { "Content-Type": "application/json" }, payload));
  await Promise.all(jobs);
}
