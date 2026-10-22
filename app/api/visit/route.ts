import { headers } from "next/headers";
import { after } from "next/server";
import { getBusiness } from "@/lib/leads";
import { isBotOrPrefetch, scanCount, sendTelegram } from "@/lib/alert";

/** Client beacon, once per page load: sends the Telegram scan alert with the visitor's PostHog recording link.
 *  Scan counting and the GHL/Grok Bot scan alert stay in app/[slug]/page.tsx, unchanged. */
export async function POST(req: Request) {
  const h = await headers();
  if (isBotOrPrefetch(h)) return new Response(null, { status: 204 });
  const body = (await req.json().catch(() => ({}))) as { slug?: unknown; session_id?: unknown; source?: unknown };
  const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : "";
  const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 64) : "";
  const source: "qr" | "direct" = body.source === "qr" ? "qr" : "direct";
  if (!slug) return new Response(null, { status: 204 });
  const business = await getBusiness(slug);
  if (!business) return new Response(null, { status: 204 });
  after(async () => {
    await sendTelegram(
      { event: "scan", business: business.name, slug: business.slug, source, scan_count: await scanCount(business.slug), time_iso: new Date().toISOString() },
      sessionId,
    );
  });
  return new Response(null, { status: 204 });
}
