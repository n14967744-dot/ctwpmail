import "server-only";
import { rest } from "./supabase";
import { DEMO_BUSINESS, type Business } from "./site";

export async function getBusiness(slug: string): Promise<Business | null> {
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 120);
  if (!clean) return null;
  const res = await rest(`leads?slug=eq.${encodeURIComponent(clean)}&select=slug,name,niche,address,city,zip&limit=1`);
  if (!res || !res.ok) return clean === DEMO_BUSINESS.slug ? DEMO_BUSINESS : null;
  const rows = (await res.json()) as Business[];
  return rows[0] ?? null;
}

/** Counts the scan (same as increment_qr_scans) and advances the lead stage to "scanned" (never backward). */
export async function recordView(slug: string): Promise<void> {
  await rest("rpc/log_scan", { method: "POST", body: JSON.stringify({ p_slug: slug }) });
}
