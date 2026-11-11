"use client";

import { useState } from "react";
import { FORM } from "./content";
import s from "./preview.module.css";

function Chips({ legend, hint, options, value, onPick, multi = false }: {
  legend: string; hint?: string; options: readonly string[]; value: string[]; onPick: (v: string) => void; multi?: boolean;
}) {
  return (
    <fieldset className={s.q}>
      <legend>{legend} {hint && <span className={s.hint}>{hint}</span>}</legend>
      <div className={s.chips}>
        {options.map((o) => (
          <label key={o} className={`${s.chip} ${value.includes(o) ? s.chipOn : ""}`}>
            <input type={multi ? "checkbox" : "radio"} checked={value.includes(o)} onChange={() => onPick(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* Preview only: nothing is saved or sent from this form. */
export function PreviewForm({ business }: { business: string }) {
  const [help, setHelp] = useState<string[]>([]);
  const [timing, setTiming] = useState<string[]>([]);
  const [lease, setLease] = useState<string[]>([]);
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={s.thanks} role="status">
        <div className={s.thanksIcon} aria-hidden>✓</div>
        <h3>That’s the end of the preview.</h3>
        <p>Nothing was saved or sent. On the real page this is where the thank-you message goes.</p>
        <button type="button" className={s.linkBtn} onClick={() => setDone(false)}>Back to the form</button>
      </div>
    );
  }

  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));

  return (
    <form className={s.form} onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <Chips legend="What would you like help with?" hint="Pick any" options={FORM.help} value={help} onPick={toggle} multi />
      <Chips legend="When are you looking to make a change?" options={FORM.timing} value={timing} onPick={(o) => setTiming([o])} />
      <Chips legend="When does your current copier lease end?" options={FORM.lease} value={lease} onPick={(o) => setLease([o])} />

      <div className={s.fields}>
        <label className={s.field}>
          <span>Current copier <em>Optional</em></span>
          <input name="equipment" placeholder="Make and model, if you know it" />
        </label>
        <label className={s.field}>
          <span>Your name</span>
          <input name="name" autoComplete="name" required placeholder="First and last name" />
        </label>
        <div className={s.field}>
          <span>Best way to reach you</span>
          <div className={s.toggle} role="group" aria-label="Contact method">
            <button type="button" className={method === "phone" ? s.toggleOn : ""} onClick={() => setMethod("phone")}>Phone</button>
            <button type="button" className={method === "email" ? s.toggleOn : ""} onClick={() => setMethod("email")}>Email</button>
          </div>
          <input
            key={method}
            name="contact"
            required
            type={method === "email" ? "email" : "tel"}
            autoComplete={method === "email" ? "email" : "tel"}
            placeholder={method === "email" ? "you@yourfirm.com" : "(979) 555-0123"}
            aria-label={method === "email" ? "Email address" : "Phone number"}
          />
        </div>
        <label className={s.field}>
          <span>Business name</span>
          <input name="business" defaultValue={business} autoComplete="organization" />
        </label>
      </div>

      <button type="submit" className={`${s.btn} ${s.btnRed} ${s.btnFull}`}>{FORM.submit}</button>
      <p className={s.fine}>{FORM.fine}</p>
    </form>
  );
}
