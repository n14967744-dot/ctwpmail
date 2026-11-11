"use client";

import { useEffect, useState } from "react";
import { SERVICE_OPTION, type AccountingCopy } from "@/lib/accounting";

/* Review build: this form does not save or send anything yet. */

export function AskServiceButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-track="Ask about service"
      className="btn btnRed btnFull"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("ctwp:service"));
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label}
    </button>
  );
}

export function AccountingQuoteForm({ business, copy }: { business: string; copy: AccountingCopy["form"] }) {
  const [help, setHelp] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onService = () => setHelp((h) => (h.includes(SERVICE_OPTION) ? h : [...h, SERVICE_OPTION]));
    window.addEventListener("ctwp:service", onService);
    return () => window.removeEventListener("ctwp:service", onService);
  }, []);

  if (done) {
    return (
      <div className="thanks" role="status">
        <div className="thanksIcon" aria-hidden>✓</div>
        <h3>Review copy: nothing was sent.</h3>
        <p>On the live page this is where the thank-you message goes.</p>
      </div>
    );
  }

  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
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

      <button type="submit" className="btn btnRed btnFull btnBig">{copy.submit}</button>
      <p className="fine">{copy.fine}</p>
    </form>
  );
}
