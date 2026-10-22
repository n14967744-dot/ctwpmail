import "server-only";
import { createHash } from "node:crypto";
import { rest } from "./supabase";

const s = (v: unknown, n = 200): string | null => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);
const dec = (v: string | null) => { if (!v) return null; try { return decodeURIComponent(v); } catch { return v; } };

export type Device = { device_type: string; os: string; browser: string };

/** Tiny UA parser: enough for "iPhone Safari", "Android Chrome", "Mac Chrome", etc. */
export function parseUA(ua: string): Device {
  const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android"
    : /Windows/.test(ua) ? "Windows" : /Mac OS X|Macintosh/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "ChromeOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const browser = /FBAN|FBAV|Instagram/.test(ua) ? "In-app (Facebook/IG)" : /Edg\//.test(ua) ? "Edge" : /SamsungBrowser/.test(ua) ? "Samsung Internet"
    : /OPR\//.test(ua) ? "Opera" : /Firefox|FxiOS/.test(ua) ? "Firefox" : /CriOS|Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Other";
  const device_type = /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) ? "tablet" : /Mobi|iPhone|Android/.test(ua) ? "mobile" : "desktop";
  return { device_type, os, browser };
}

export function geo(h: Headers) {
  return { city: dec(h.get("x-vercel-ip-city")), region: dec(h.get("x-vercel-ip-country-region")), country: h.get("x-vercel-ip-country") };
}

/** sha256(salt + ip); null if no salt or ip. The raw IP is never stored. */
export function ipHash(h: Headers): string | null {
  const salt = process.env.CTWP_IP_SALT;
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "").split(",")[0].trim();
  if (!salt || !ip) return null;
  return createHash("sha256").update(salt + ip).digest("hex");
}

export async function leadId(slug: string | null): Promise<number | null> {
  if (!slug) return null;
  const res = await rest(`leads?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`);
  if (!res || !res.ok) return null;
  const rows = (await res.json().catch(() => [])) as { id: number }[];
  return rows[0]?.id ?? null;
}

export type Arrival = {
  slug: string; source: "qr" | "direct"; session_id: string | null; referrer: string | null; screen: string | null;
  utm: Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string | null>;
  device: Device; city: string | null; region: string | null; country: string | null;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function arrivalFrom(h: Headers, body: Record<string, unknown>, slug: string): Arrival {
  const utmIn = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, s(utmIn[k], 120)])) as Arrival["utm"];
  return {
    slug, source: body.source === "qr" ? "qr" : "direct", session_id: s(body.session_id, 64),
    referrer: s(body.referrer, 500), screen: s(body.screen, 20), utm, device: parseUA(h.get("user-agent") ?? ""), ...geo(h),
  };
}

/** Insert a landing_events row. Best-effort; never throws. */
export async function insertEvent(event: "visit" | "form_submit", h: Headers, a: Omit<Arrival, "utm"> & { utm?: Arrival["utm"] }, extra: Record<string, unknown> = {}) {
  const row = {
    lead_id: await leadId(a.slug), slug: a.slug, event, source: a.source, ...(a.utm ?? {}), referrer: a.referrer,
    user_agent: s(h.get("user-agent"), 400), ip_hash: ipHash(h), request_id: h.get("x-vercel-id"), session_id: a.session_id,
    ...a.device, screen: a.screen, city: a.city, region: a.region, country: a.country, ...extra,
  };
  const res = await rest("landing_events", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
  console.log(`[track] insert ${event} status=${res?.status ?? "no-db"}`);
}

/** Advance a lead's stage (DB function never moves it backward). */
export async function advanceStage(slug: string | null, stage: "scanned" | "requested_info") {
  if (!slug) return;
  await rest("rpc/advance_lead_stage", { method: "POST", body: JSON.stringify({ p_slug: slug, p_stage: stage }) });
}

/** "from: QR · campaign spring" / "from: google.com" / "from: direct". */
export function fromLabel(a: Pick<Arrival, "source" | "referrer" | "utm">): string {
  let ref: string | null = null;
  if (a.referrer) { try { ref = new URL(a.referrer).hostname.replace(/^www\./, ""); } catch { ref = a.referrer.slice(0, 60); } }
  const base = a.source === "qr" ? "QR" : ref ?? "direct";
  const camp = a.utm.utm_campaign;
  return camp ? `${base} · ${camp}` : base;
}

export const place = (a: { city: string | null; region: string | null; country: string | null }) =>
  [a.city, a.region].filter(Boolean).join(", ") || a.country || "unknown";

export const deviceLabel = (d: Device) => `${d.os} ${d.browser}`;

export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60), r = Math.round(sec % 60);
  return m ? `${m}m ${r}s` : `${r}s`;
}

/** Client falls back to a local "v-" id when PostHog is unavailable; that id has no recording. */
export function recordingId(sid: string | null): string | null {
  return sid && !sid.startsWith("v-") ? sid : null;
}
