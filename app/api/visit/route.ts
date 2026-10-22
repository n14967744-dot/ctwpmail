import { headers } from "next/headers";
import { after } from "next/server";
import { getBusiness } from "@/lib/leads";
import { isBotOrPrefetch, scanCount, sendTelegram } from "@/lib/alert";
import { arrivalFrom, deviceLabel, fromLabel, insertEvent, place, recordingId } from "@/lib/track";

/** Client beacon, once per page load: stores a landing_events 'visit' row and sends the Telegram scan alert
 *  (with the visitor's PostHog recording link). Scan counting and the GHL scan alert stay in app/[slug]/page.tsx. */
export async function POST(req: Request) {
  const h = await headers();
  if (isBotOrPrefetch(h)) return new Response(null, { status: 204 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : "";
  if (!slug) return new Response(null, { status: 204 });
  const business = await getBusiness(slug);
  if (!business) return new Response(null, { status: 204 });
  const a = arrivalFrom(h, body, business.slug);
  after(async () => {
    await Promise.all([
      insertEvent("visit", h, a),
      sendTelegram(
        { event: "scan", business: business.name, slug: business.slug, source: a.source, scan_count: await scanCount(business.slug), time_iso: new Date().toISOString() },
        recordingId(a.session_id),
        [`from: ${fromLabel(a)}`, `where: ${place(a)}`, `device: ${deviceLabel(a.device)}`],
      ),
    ]);
  });
  return new Response(null, { status: 204 });
}

