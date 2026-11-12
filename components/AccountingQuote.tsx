"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { submitAccountingRequest, type RequestState } from "@/app/actions";
import type { AccountingCopy } from "@/lib/accounting";

/* The quote pop-up: three short steps (what to improve, timing, contact), saved through the server action.
   Anything on the page can open it: a QuoteButton, or any link that points at #quote. */

const OPEN_EVENT = "ctwp:quote";

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Opens the quote pop-up. `choice` pre-selects one of the "what to improve" options. */
export function QuoteButton({ label, choice, className = "btn btnRed btnBig", track, arrow = false }: {
  label: string; choice?: string; className?: string; track?: string; arrow?: boolean;
}) {
  return (
    <button
      type="button"
      className={className}
      data-track={track ?? label}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { choice } }))}
    >
      {label}{arrow && <Arrow />}
    </button>
  );
}

type Step = 1 | 2 | 3;

export function QuoteDialog({ business, slug, phone, copy }: {
  business: string; slug: string; phone: { display: string; href: string }; copy: AccountingCopy["form"];
}) {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitAccountingRequest, { ok: false });
  const [step, setStep] = useState<Step>(1);
  const [help, setHelp] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState(business);
  const [equipment, setEquipment] = useState("");
  const [spend, setSpend] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const open = (choice?: string) => {
      // A button that names a topic adds it and starts from the first step, so the choice is visible.
      if (choice) { setHelp((h) => (h.includes(choice) ? h : [...h, choice])); setStep(1); }
      const d = dialog.current;
      if (d && !d.open) d.showModal();
    };
    const onEvent = (e: Event) => open((e as CustomEvent<{ choice?: string }>).detail?.choice);
    // Links to #quote (header button, hero button, menu) open the pop-up instead of scrolling.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href="#quote"]');
      if (!link) return;
      e.preventDefault();
      open();
    };
    window.addEventListener(OPEN_EVENT, onEvent);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(OPEN_EVENT, onEvent);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Keep the page behind the pop-up from scrolling while it is open.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const root = document.documentElement;
    const sync = () => { root.style.overflow = d.open ? "hidden" : ""; };
    const watch = new MutationObserver(sync);
    watch.observe(d, { attributes: true, attributeFilter: ["open"] });
    return () => { watch.disconnect(); root.style.overflow = ""; };
  }, []);

  const go = (next: Step) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));
  const close = () => dialog.current?.close();

  const submit = () => {
    const fd = new FormData();
    help.forEach((h) => fd.append("help", h));
    fd.set("timing", timing);
    fd.set("name", name);
    fd.set("contact", contact);
    fd.set("contactType", contactType);
    fd.set("business", company);
    fd.set("equipment", equipment);
    fd.set("spend", spend);
    fd.set("slug", slug);
    const q = new URLSearchParams(window.location.search);
    const isQr = (k: string) => (q.get(k) ?? "").toLowerCase() === "qr";
    fd.set("source", isQr("src") || isQr("utm_medium") ? "qr" : "direct");
    try { fd.set("ph_session", window.__ctwpSid || posthog.get_session_id?.() || ""); } catch {}
    startTransition(() => action(fd));
  };

  const done = state.ok;
  const title = done ? copy.thanksHeading : step === 1 ? copy.helpQuestion : step === 2 ? copy.timingQuestion : copy.contactQuestion;

  return (
    <dialog
      ref={dialog}
      className="qd"
      aria-labelledby="qd-title"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <form
        className="qdCard"
        noValidate={step !== 3}
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 1) { if (help.length) go(2); }
          else if (step === 2) { if (timing) go(3); }
          else submit();
        }}
      >
        <button type="button" className="qdClose" aria-label="Close" onClick={close}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
        <p className="qdEyebrow">Prepared for {business}</p>
        {!done && (
          <div className="qdSteps" role="img" aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((n) => <span key={n} className={n <= step ? "on" : ""} />)}
          </div>
        )}
        <h2 id="qd-title" ref={heading} tabIndex={-1}>{title}</h2>

        {done ? (
          <>
            <p className="qdText">{copy.thanksBody} If you would rather talk now, call <a href={phone.href}>{phone.display}</a>.</p>
            <button type="button" className="btn btnRed btnBig btnFull" onClick={close}>Done</button>
          </>
        ) : step === 1 ? (
          <>
            <p className="qdHint">Choose any that apply.</p>
            <div className="qdChoices">
              {copy.help.map((o) => (
                <label key={o} className={help.includes(o) ? "on" : ""}>
                  <input type="checkbox" checked={help.includes(o)} onChange={() => toggle(o)} />
                  <span className="qdMark" aria-hidden />
                  <span>{o}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="btn btnRed btnBig btnFull qdNext" disabled={!help.length}>Continue <Arrow /></button>
          </>
        ) : step === 2 ? (
          <>
            <div className="qdChoices">
              {copy.timing.map((o) => (
                <label key={o} className={timing === o ? "on" : ""}>
                  <input type="radio" name="timing" checked={timing === o} onChange={() => setTiming(o)} />
                  <span className="qdMark round" aria-hidden />
                  <span>{o}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="btn btnRed btnBig btnFull qdNext" disabled={!timing}>Continue <Arrow /></button>
            <button type="button" className="qdBack" onClick={() => go(1)}>Back</button>
          </>
        ) : (
          <>
            <div className="qdFields">
              <label className="field">
                <span>Your name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="First and last name" />
              </label>
              <div className="field">
                <span>Best way to reach you</span>
                <div className="toggle" role="group" aria-label="Contact method">
                  <button type="button" className={contactType === "phone" ? "on" : ""} onClick={() => { setContactType("phone"); setContact(""); }}>Phone</button>
                  <button type="button" className={contactType === "email" ? "on" : ""} onClick={() => { setContactType("email"); setContact(""); }}>Email</button>
                </div>
                <input
                  key={contactType}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
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
                <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
              </label>
              <details className="qdMore">
                <summary>Add copier details <span>Optional</span></summary>
                <label className="field">
                  <span>Current copier</span>
                  <input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="Make and model, if you know it" />
                </label>
                <label className="field">
                  <span>About what you spend on it each month</span>
                  <input value={spend} onChange={(e) => setSpend(e.target.value)} inputMode="decimal" placeholder="A rough number is fine" />
                </label>
              </details>
            </div>
            {state.error && <p className="formError" role="alert">{state.error}</p>}
            <button type="submit" className="btn btnRed btnBig btnFull qdNext" disabled={pending}>
              {pending ? "Sending…" : <>{copy.submit} <Arrow /></>}
            </button>
            <p className="qdFine">{copy.fine}</p>
            <button type="button" className="qdBack" onClick={() => go(2)}>Back</button>
          </>
        )}
      </form>
    </dialog>
  );
}
