import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key && typeof window !== "undefined") {
  posthog.init(key, {
    api_host: "/ingest", // first-party reverse proxy (next.config.ts rewrites) -> us.i.posthog.com
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    person_profiles: "identified_only",
    disable_session_recording: false,
    session_recording: { maskAllInputs: true },
  });

  // Tag every event (and so every replay) with the business slug, QR vs direct, and UTM params.
  const url = new URL(window.location.href);
  const slug = url.pathname.split("/").filter(Boolean)[0];
  if (slug) {
    const q = url.searchParams;
    const isQr = (v: string | null) => (v ?? "").toLowerCase() === "qr";
    const props: Record<string, string> = {
      slug,
      source: isQr(q.get("src")) || isQr(q.get("utm_medium")) ? "qr" : "direct",
    };
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = q.get(k);
      if (v) props[k] = v;
    }
    posthog.register(props);
  }
}

// Once per full page load: tell the server about this visit (with the PostHog session id) so it can
// send the Telegram scan alert with a recording link. Server applies the same bot/prefetch rules.
if (typeof window !== "undefined") {
  const slug = window.location.pathname.split("/").filter(Boolean)[0];
  if (slug) {
    const q = new URLSearchParams(window.location.search);
    const isQr = (v: string | null) => (v ?? "").toLowerCase() === "qr";
    let sessionId = "";
    try { sessionId = key ? posthog.get_session_id() ?? "" : ""; } catch {}
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, session_id: sessionId, source: isQr(q.get("src")) || isQr(q.get("utm_medium")) ? "qr" : "direct" }),
      keepalive: true,
    }).catch(() => {});
  }
}
