import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Design-only form previews must not create prospect events or recordings.
const isLawDesignReview = typeof window !== "undefined" && /^\/(?:law-review|law-test|construction-review)(?:\/|$)/.test(window.location.pathname);

if (key && typeof window !== "undefined" && !isLawDesignReview) {
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

declare global { interface Window { __ctwpSid?: string } }

// Once per full page load: tell the server about this visit (stored in landing_events + Telegram scan alert),
// then track light engagement and send one exit summary via sendBeacon. Server applies the same bot rules.
if (typeof window !== "undefined" && !isLawDesignReview) {
  const slug = window.location.pathname.split("/").filter(Boolean)[0];
  if (slug) {
    const q = new URLSearchParams(window.location.search);
    const isQr = (v: string | null) => (v ?? "").toLowerCase() === "qr";
    let sessionId = "";
    try { sessionId = key ? posthog.get_session_id() ?? "" : ""; } catch {}
    if (!sessionId) sessionId = `v-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.__ctwpSid = sessionId;
    const utm: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = q.get(k);
      if (v) utm[k] = v;
    }
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug, session_id: sessionId, source: isQr(q.get("src")) || isQr(q.get("utm_medium")) ? "qr" : "direct",
        referrer: document.referrer || null, utm, screen: `${screen.width}x${screen.height}`,
      }),
      keepalive: true,
    }).catch(() => {});
    trackEngagement(slug, sessionId);
  }
}

function trackEngagement(slug: string, sessionId: string) {
  let activeMs = 0;
  let since: number | null = document.visibilityState === "visible" ? performance.now() : null;
  let maxScroll = 0;
  let formStarted = false;
  let formSubmitted = false;
  let sent = false;
  const clicks: string[] = [];

  const onScroll = () => {
    const el = document.documentElement;
    const max = el.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 100;
    if (pct > maxScroll) maxScroll = Math.min(100, pct);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Taps: prefer data-track labels, then button/link text, then the enclosing section id.
  document.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    if (!t?.closest) return;
    const el = t.closest("[data-track]") ?? t.closest("a,button");
    if (!el?.hasAttribute("data-track") && t.closest("form")) return; // form use is tracked separately
    const label = el?.getAttribute("data-track") || el?.textContent?.replace(/\s+/g, " ").trim().slice(0, 40)
      || (t.closest("section[id]")?.id ? `#${t.closest("section[id]")!.id}` : "");
    if (label && !clicks.includes(label) && clicks.length < 20) clicks.push(label);
  }, { capture: true, passive: true });
  document.addEventListener("focusin", (e) => { if ((e.target as Element | null)?.closest?.("form")) formStarted = true; });
  document.addEventListener("change", (e) => { if ((e.target as Element | null)?.closest?.("form")) formStarted = true; });
  document.addEventListener("submit", () => { formStarted = true; formSubmitted = true; }, true);

  const flush = () => {
    if (since !== null) { activeMs += performance.now() - since; since = null; }
    if (sent) return;
    const duration = Math.round(activeMs / 1000);
    if (duration < 3) return;
    const key = `ctwp:end:${sessionId}`;
    try { if (sessionStorage.getItem(key)) { sent = true; return; } } catch {}
    sent = true;
    try { sessionStorage.setItem(key, "1"); } catch {}
    const payload = JSON.stringify({
      slug, session_id: sessionId, duration_sec: duration, max_scroll_pct: maxScroll, clicks,
      form_started: formStarted, form_submitted: formSubmitted,
    });
    const blob = new Blob([payload], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/visit/end", blob)) {
      fetch("/api/visit/end", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
    else if (since === null && !sent) since = performance.now();
  });
  window.addEventListener("pagehide", flush);
}
