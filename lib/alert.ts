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

const REPLAY_BASE = "https://us.posthog.com/project/681639/replay";

/** Link to the visitor's PostHog session recording, or the slug-filtered replay list if no session id. */
export function replayLink(sessionId: string | null | undefined, slug: string | null): string {
  const sid = (sessionId ?? "").trim();
  if (/^[A-Za-z0-9-]{8,64}$/.test(sid)) return `${REPLAY_BASE}/${sid}`;
  if (!slug) return REPLAY_BASE;
  const filters = { properties: [{ key: "slug", value: [slug], operator: "exact", type: "event" }], date_from: "-7d" };
  return `${REPLAY_BASE}?filters=${encodeURIComponent(JSON.stringify(filters))}`;
}

function ctTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  });
}

/** Best-effort Telegram message to Nick. Skips silently if unset; never throws; 5s timeout. Never logs the token. */
export async function sendTelegram(payload: AlertPayload, sessionId?: string | null, extra: string[] = []): Promise<void> {
  const biz = payload.business ?? "(unknown business)";
  const lines: string[] = [];
  if (payload.event === "scan") {
    lines.push(`📬 Scan: ${biz} (${payload.slug ?? "-"}), source ${payload.source ?? "direct"}, scan #${payload.scan_count ?? "?"}, ${ctTime(payload.time_iso)}`);
    lines.push(...extra);
  } else {
    lines.push(`📝 Form: ${biz}${payload.slug ? ` (${payload.slug})` : ""}`);
    if (payload.name) lines.push(`Name: ${payload.name}`);
    if (payload.phone) lines.push(`Phone: ${payload.phone}`);
    if (payload.email) lines.push(`Email: ${payload.email}`);
    if (payload.options?.length) lines.push(`Options: ${payload.options.join(", ")}`);
    if (payload.message) lines.push(`Message: ${payload.message}`);
    lines.push(`Source ${payload.source ?? "direct"}, ${ctTime(payload.time_iso)}`);
  }
  lines.push(`Recording: ${replayLink(sessionId, payload.slug)}`);
  await telegramText(lines.join("\n"), payload.event);
}

/** Send plain text to Nick's Telegram. Skips silently if unset; never throws; 5s timeout. Never logs the token. */
export async function telegramText(text: string, label: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    console.log(`[alert] telegram ${label} status=${res.status}`);
  } catch (e) {
    console.error(`[alert] telegram ${label} error=${e instanceof Error ? e.name : "unknown"}`);
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
