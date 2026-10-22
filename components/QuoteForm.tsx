"use client";

import { useActionState, useEffect, useState } from "react";
import posthog from "posthog-js";
import { submitRequest, type RequestState } from "@/app/actions";

const PAGES = ["Under 500", "500–2,000", "2,001–5,000", "Over 5,000", "Not sure"];
const COLOR = ["Yes", "No", "Occasionally", "Not sure"];
const SCAN = ["Yes", "No", "Not sure"];
export const SERVICE_OPTION = "Service for my current copier ($30/mo)";
const HELP = [
  "Lower printing costs",
  SERVICE_OPTION,
  "New or replacement copier",
  "Easier scanning",
  "Better document privacy",
  "Help understanding my options",
];

function Choices({ legend, name, options, value, onChange, cls = "" }: {
  legend: string; name: string; options: string[]; value: string; onChange: (v: string) => void; cls?: string;
}) {
  return (
    <fieldset className="q">
      <legend>{legend}</legend>
      <div className={`chips ${cls}`}>
        {options.map((o) => (
          <label key={o} className={`chip ${value === o ? "on" : ""}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function QuoteForm({ business, slug }: { business: string; slug: string }) {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitRequest, { ok: false });
  const [pages, setPages] = useState("");
  const [color, setColor] = useState("");
  const [scan, setScan] = useState("");
  const [help, setHelp] = useState<string[]>([]);
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [source, setSource] = useState<"qr" | "direct">("direct");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const isQr = (name: string) => (query.get(name) ?? "").toLowerCase() === "qr";
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
        <h3>Thank you. We&rsquo;ve got it.</h3>
        <p>Your local CTWP team will reach out within 24 hours. Need us sooner? Call <a href="tel:+12102843727">(210) 284-3727</a>.</p>
      </div>
    );
  }

  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));

  return (
    <form
      action={(fd: FormData) => {
        try { fd.set("ph_session", posthog.get_session_id?.() ?? ""); } catch {}
        return action(fd);
      }}
      className="form"
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="source" value={source} />
      <Choices legend="About how many pages do you print each month?" name="pages" options={PAGES} value={pages} onChange={setPages} cls="pages" />
      <Choices legend="Do you print in color?" name="color" options={COLOR} value={color} onChange={setColor} />
      <Choices legend="Do you scan documents?" name="scanning" options={SCAN} value={scan} onChange={setScan} cls="three" />
      <fieldset className="q">
        <legend>What would you like help with? <span className="hint">Pick any</span></legend>
        <div className="chips stack">
          {HELP.map((o) => (
            <label key={o} className={`chip check ${help.includes(o) ? "on" : ""}`}>
              <input type="checkbox" name="help" value={o} checked={help.includes(o)} onChange={() => toggle(o)} />
              <span className="box" aria-hidden />
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
            placeholder={contactType === "email" ? "you@yourpractice.com" : "(979) 555-0123"}
            aria-label={contactType === "email" ? "Email address" : "Phone number"}
          />
        </div>
        <label className="field">
          <span>Business name</span>
          <input name="business" defaultValue={business} autoComplete="organization" />
        </label>
      </div>

      {state.error && <p className="formError" role="alert">{state.error}</p>}
      <button type="submit" className="btn btnRed btnFull btnBig" disabled={pending}>
        {pending ? "Sending…" : "Request my free review"}
      </button>
      <p className="fine">No obligation. Your local CTWP team will follow up within 24 hours.</p>
    </form>
  );
}
