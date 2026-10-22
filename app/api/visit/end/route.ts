import { headers } from "next/headers";
import { after } from "next/server";
import { getBusiness } from "@/lib/leads";
import { rest } from "@/lib/supabase";
import { isBotOrPrefetch, replayLink, telegramText } from "@/lib/alert";
import { fmtDuration, recordingId } from "@/lib/track";

/** Exit summary beacon (navigator.sendBeacon on pagehide / hidden), at most once per session.
 *  Updates the session's 'visit' row and sends a second Telegram message. Skipped under 3 seconds. */
export async function POST(req: Request) {
  const h = await headers();
  if (isBotOrPrefetch(h)) return new Response(null, { status: 204 });
  const raw = await req.text().catch(() => "");
  let body: Record<string, unknown> = {};
  try { body = JSON.parse(raw) as Record<string, unknown>; } catch {}
  const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : "";
  const sid = typeof body.session_id === "string" ? body.session_id.slice(0, 64) : "";
  const duration = Math.max(0, Math.min(86400, Math.round(Number(body.duration_sec) || 0)));
  if (!slug || !sid || duration < 3) return new Response(null, { status: 204 });
  const scroll = Math.max(0, Math.min(100, Math.round(Number(body.max_scroll_pct) || 0)));
  const clicks = (Array.isArray(body.clicks) ? body.clicks : [])
    .filter((c): c is string => typeof c === "string").map((c) => c.trim().slice(0, 60)).filter(Boolean).slice(0, 20);
  const formStarted = body.form_started === true;
  const formSubmitted = body.form_submitted === true;

  after(async () => {
    const business = await getBusiness(slug);
    if (!business) return;
    // Only the first summary per session updates the row (duration_sec still null) and sends Telegram.
    const res = await rest(
      `landing_events?session_id=eq.${encodeURIComponent(sid)}&slug=eq.${encodeURIComponent(business.slug)}&event=eq.visit&duration_sec=is.null`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ duration_sec: duration, max_scroll_pct: scroll, clicks, form_started: formStarted || formSubmitted, form_submitted: formSubmitted }),
      },
    );
    const updated = res && res.ok ? ((await res.json().catch(() => [])) as unknown[]).length : 0;
    console.log(`[track] end status=${res?.status ?? "no-db"} rows=${updated}`);
    if (res && res.ok && updated === 0) return; // already summarized (or no visit row): don't double-send
    const form = formSubmitted ? "form submitted" : formStarted ? "form started" : "form not started";
    const text = [
      `⏱ ${business.name}: ${fmtDuration(duration)}, scrolled ${scroll}%, tapped: ${clicks.length ? clicks.join(", ") : "nothing"}; ${form}`,
      `Recording: ${replayLink(recordingId(sid), business.slug)}`,
    ].join("\n");
    await telegramText(text, "summary");
  });
  return new Response(null, { status: 204 });
}
