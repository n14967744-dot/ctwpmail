import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key && typeof window !== "undefined") {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
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
