import "server-only";
import { createHash } from "node:crypto";
import { query } from "./db";

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
  const rows = await query<{ id: number | string }>("select id from leads where slug = $1 limit 1", [slug]);
  const id = rows?.[0]?.id;
  return id == null ? null : Number(id);
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
export async function insertEvent(
  event: "visit" | "form_submit", h: Headers, a: Omit<Arrival, "utm"> & { utm?: Arrival["utm"] },
  extra: { form_started?: boolean; form_submitted?: boolean } = {},
) {
  const u = a.utm;
  const rows = await query(
    `insert into landing_events
       (lead_id, slug, event, source, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer,
        user_agent, ip_hash, request_id, session_id, device_type, os, browser, screen, city, region, country,
        form_started, form_submitted)
     values ((select id from leads where slug = $1), $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21::boolean, $22::boolean)
     returning id`,
    [
      a.slug, event, a.source, u?.utm_source ?? null, u?.utm_medium ?? null, u?.utm_campaign ?? null, u?.utm_content ?? null,
      u?.utm_term ?? null, a.referrer, s(h.get("user-agent"), 400), ipHash(h), h.get("x-vercel-id"), a.session_id,
      a.device.device_type, a.device.os, a.device.browser, a.screen, a.city, a.region, a.country,
      extra.form_started === true, extra.form_submitted === true,
    ],
  );
  console.log(`[track] insert ${event} ${rows ? "ok" : "failed-or-no-db"}`);
}

/** Advance a lead's stage (DB function never moves it backward). */
export async function advanceStage(slug: string | null, stage: "scanned" | "requested_info") {
  if (!slug) return;
  await query("select advance_lead_stage($1, $2)", [slug, stage]);
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
