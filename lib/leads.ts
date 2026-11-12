import "server-only";
import { query } from "./db";
import { DEMO_BUSINESS, type Business } from "./site";

export async function getBusiness(slug: string): Promise<Business | null> {
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 120);
  if (!clean) return null;
  const rows = await query<Business>("select slug, name, niche, segment, address, city, zip from leads where slug = $1 limit 1", [clean]);
  if (!rows) return clean === DEMO_BUSINESS.slug ? DEMO_BUSINESS : null;
  return rows[0] ?? null;
}

/** Counts the scan and advances the lead stage to "scanned" (never backward). */
export async function recordView(slug: string): Promise<void> {
  await query("select log_scan($1)", [slug]);
}
