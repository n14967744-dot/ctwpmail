"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import posthog from "posthog-js";
import { submitAccountingRequest, type RequestState } from "@/app/actions";
import { SERVICE_OPTION, type AccountingCopy } from "@/lib/accounting";

export function AskServiceButton({ label, className = "btn btnRed btnFull" }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      data-track="Ask about service"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("ctwp:service"));
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label}
    </button>
  );
}

export function AccountingQuoteForm({ business, slug, phone, copy }: {
  business: string; slug: string; phone: { display: string; href: string }; copy: AccountingCopy["form"];
}) {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitAccountingRequest, { ok: false });
  const [help, setHelp] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [source, setSource] = useState<"qr" | "direct">("direct");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const isQr = (name: string) => (q.get(name) ?? "").toLowerCase() === "qr";
    if (isQr("src") || isQr("utm_medium")) setSource("qr");
  }, []);

  useEffect(() => {
    const onService = () => setHelp((h) => (h.includes(SERVICE_OPTION) ? h : [...h, SERVICE_OPTION]));
    window.addEventListener("ctwp:service", onService);
    return () => window.removeEventListener("ctwp:service", onService);
  }, []);

  if (state.ok) {
    return (
      <div className="thanks" role="status">
        <div className="thanksIcon" aria-hidden>✓</div>
        <h3>{copy.thanksHeading}</h3>
        <p>{copy.thanksBody} If you would rather talk now, call <a href={phone.href}>{phone.display}</a>.</p>
      </div>
    );
  }

  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));

  return (
    <form
      className="form"
      /* Submitted by hand rather than through the form's action, so a failed attempt keeps what was typed. */
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try { fd.set("ph_session", window.__ctwpSid || posthog.get_session_id?.() || ""); } catch {}
        startTransition(() => action(fd));
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="source" value={source} />
      <fieldset className="q">
        <legend>{copy.helpQuestion} <span className="hint">Pick any</span></legend>
        <div className="chips stack">
          {copy.help.map((o) => (
            <label key={o} className={`chip check ${help.includes(o) ? "on" : ""}`}>
              <input type="checkbox" name="help" value={o} checked={help.includes(o)} onChange={() => toggle(o)} />
              <span className="box" aria-hidden />
              {o}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="q">
        <legend>{copy.timingQuestion}</legend>
        <div className="chips">
          {copy.timing.map((o) => (
            <label key={o} className={`chip ${timing === o ? "on" : ""}`}>
              <input type="radio" name="timing" value={o} checked={timing === o} onChange={() => setTiming(o)} />
              {o}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fields">
        <label className="field">
          <span>Your name</span>
          <input name="name" autoComplete="name" required placeholder="First and last name" />
        </label>
        <div className="field">
          <span>Best way to reach you</span>
          <div className="toggle" role="group" aria-label="Contact method">
            <button type="button" className={contactType === "phone" ? "on" : ""} onClick={() => setContactType("phone")}>Phone</button>
            <button type="button" className={contactType === "email" ? "on" : ""} onClick={() => setContactType("email")}>Email</button>
          </div>
          <input type="hidden" name="contactType" value={contactType} />
          <input
            key={contactType}
            name="contact"
            required
            type={contactType === "email" ? "email" : "tel"}
            inputMode={contactType === "email" ? "email" : "tel"}
            autoComplete={contactType === "email" ? "email" : "tel"}
            placeholder={contactType === "email" ? "you@yourfirm.com" : "(979) 555-0123"}
            aria-label={contactType === "email" ? "Email address" : "Phone number"}
          />
        </div>
        <label className="field">
          <span>Business name</span>
          <input name="business" defaultValue={business} autoComplete="organization" />
        </label>
        <label className="field">
          <span>Current copier <span className="hint">Optional</span></span>
          <input name="equipment" placeholder="Make and model, if you know it" />
        </label>
        <label className="field">
          <span>About what you spend on it each month <span className="hint">Optional</span></span>
          <input name="spend" inputMode="decimal" placeholder="A rough number is fine" />
        </label>
      </div>

      {state.error && <p className="formError" role="alert">{state.error}</p>}
      <button type="submit" className="btn btnRed btnFull btnBig" disabled={pending}>
        {pending ? "Sending…" : copy.submit}
      </button>
      <p className="fine">{copy.fine}</p>
    </form>
  );
}
