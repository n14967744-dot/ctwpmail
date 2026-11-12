"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { addRequestDetails, submitAccountingRequest, type RequestState } from "@/app/actions";
import type { AccountingCopy } from "@/lib/accounting";

/* The quote pop-up. Three short steps (what to help with, timing, contact) save the request.
   After that the visitor can add copier details and a photo, which are merged into the same request.
   Anything on the page can open it: a QuoteButton, or any link that points at #quote. */

const OPEN_EVENT = "ctwp:quote";

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Camera = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** Opens the quote pop-up. `choice` pre-selects one of the "what to help with" options. */
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

/** (979) 555-0123 as the visitor types. */
function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Shrinks a phone photo to at most 1600px on its long side, as a JPEG, before upload. */
async function shrinkPhoto(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.82));
    if (!blob) throw new Error("no blob");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Step = 1 | 2 | 3;
type View = "form" | "thanks" | "details" | "finished";
const START: RequestState = { ok: false };

export function QuoteDialog({ business, slug, phone, copy }: {
  business: string; slug: string; phone: { display: string; href: string }; copy: AccountingCopy["form"];
}) {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitAccountingRequest, START);
  const [more, moreAction, morePending] = useActionState<RequestState, FormData>(addRequestDetails, START);
  const [step, setStep] = useState<Step>(1);
  const [wantsDetails, setWantsDetails] = useState(false);
  const [help, setHelp] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(business);
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState({ provider: "", equipment: "", serial: "", leaseEnd: "", spend: "" });
  const [photo, setPhoto] = useState<{ blob: Blob; preview: string } | null>(null);
  const [photoNote, setPhotoNote] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const view: View = !state.ok ? "form" : more.ok ? "finished" : wantsDetails ? "details" : "thanks";

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

  // Each new screen starts at the top with its heading focused.
  useEffect(() => {
    dialog.current?.scrollTo(0, 0);
    if (dialog.current?.open) heading.current?.focus();
  }, [step, view]);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.preview); }, [photo]);

  const toggle = (o: string) => setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o]));
  const close = () => dialog.current?.close();

  const submit = () => {
    const contact = contactType === "phone" ? tel : email.trim();
    if (!name.trim()) return setProblem("Please add your name.");
    if (contactType === "phone" ? tel.replace(/\D/g, "").length < 10 : !/^\S+@\S+\.\S+$/.test(contact))
      return setProblem(contactType === "phone" ? "Please add a 10-digit phone number." : "Please check your email address.");
    setProblem("");
    const fd = new FormData();
    help.forEach((h) => fd.append("help", h));
    fd.set("timing", timing);
    fd.set("name", name);
    fd.set("contact", contact);
    fd.set("contactType", contactType);
    fd.set("business", company);
    fd.set("slug", slug);
    const q = new URLSearchParams(window.location.search);
    const isQr = (k: string) => (q.get(k) ?? "").toLowerCase() === "qr";
    fd.set("source", isQr("src") || isQr("utm_medium") ? "qr" : "direct");
    try { fd.set("ph_session", window.__ctwpSid || posthog.get_session_id?.() || ""); } catch {}
    startTransition(() => action(fd));
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setPhotoNote("");
    try {
      const blob = await shrinkPhoto(file);
      setPhoto({ blob, preview: URL.createObjectURL(blob) });
    } catch {
      setPhoto(null);
      setPhotoNote("That photo couldn’t be read. Please try another, or type the details below.");
    }
  };

  const sendDetails = () => {
    const fd = new FormData();
    fd.set("ref", state.ref ?? "");
    for (const [k, v] of Object.entries(details)) fd.set(k, v);
    if (photo) fd.set("photo", new File([photo.blob], "copier.jpg", { type: "image/jpeg" }));
    startTransition(() => moreAction(fd));
  };
  const detail = (k: keyof typeof details) => ({
    value: details[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDetails((d) => ({ ...d, [k]: e.target.value })),
  });

  const title =
    view === "thanks" ? copy.thanksHeading
    : view === "details" ? copy.detailsHeading
    : view === "finished" ? copy.detailsThanksHeading
    : step === 1 ? copy.helpQuestion : step === 2 ? copy.timingQuestion : copy.contactQuestion;
  const error = problem || state.error;

  return (
    <dialog
      ref={dialog}
      className="qd"
      aria-labelledby="qd-title"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <form
        className="qdCard"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (view === "details") sendDetails();
          else if (view !== "form") close();
          else if (step === 1) { if (help.length) setStep(2); }
          else if (step === 2) { if (timing) setStep(3); }
          else submit();
        }}
      >
        <button type="button" className="qdClose" aria-label="Close" onClick={close}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <p className="qdEyebrow">Prepared for {business}</p>
        {view === "form" && (
          <div className="qdSteps" role="img" aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((n) => <span key={n} className={n <= step ? "on" : ""} />)}
          </div>
        )}
        <h2 id="qd-title" ref={heading} tabIndex={-1}>{title}</h2>

        {view === "thanks" && (
          <>
            <p className="qdText">{copy.thanksBody} If you would rather talk now, call <a href={phone.href}>{phone.display}</a>.</p>
            {state.ref && (
              <div className="qdInvite">
                <p className="qdInviteLabel">{copy.detailsLabel}</p>
                <p>{copy.detailsInvite}</p>
                <button type="button" className="btn btnRed btnFull qdNext" onClick={() => setWantsDetails(true)}>{copy.detailsButton} <Arrow /></button>
              </div>
            )}
            <button type="button" className="qdBack" onClick={close}>{state.ref ? "Not now" : "Done"}</button>
          </>
        )}

        {view === "finished" && (
          <>
            <p className="qdText">{copy.detailsThanksBody}</p>
            <button type="button" className="btn btnRed btnFull qdNext" onClick={close}>Done</button>
          </>
        )}

        {view === "details" && (
          <>
            <p className="qdHint">{copy.detailsHint}</p>
            <div className="qdFields">
              <div className="qdField">
                <span>Photo of the copier</span>
                <input
                  ref={picker} type="file" accept="image/*" className="qdFile" tabIndex={-1} aria-hidden
                  onChange={(e) => { void pickPhoto(e.target.files?.[0]); e.target.value = ""; }}
                />
                {photo ? (
                  <div className="qdPhoto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.preview} alt="The photo you added" />
                    <div>
                      <p>Photo added</p>
                      <button type="button" onClick={() => picker.current?.click()}>Change</button>
                      <button type="button" onClick={() => setPhoto(null)}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="qdPhotoBtn" onClick={() => picker.current?.click()}><Camera /> Take or choose a photo</button>
                )}
                <small>{photoNote || "Include the label with the serial number if you can."}</small>
              </div>
              <label className="qdField"><span>Current provider</span><input {...detail("provider")} placeholder="Who you lease or get service from" /></label>
              <label className="qdField"><span>Make and model</span><input {...detail("equipment")} placeholder="If you know it" /></label>
              <label className="qdField"><span>Serial number</span><input {...detail("serial")} autoCapitalize="characters" autoCorrect="off" placeholder="From the label on the machine" /></label>
              <label className="qdField"><span>When your lease ends</span><input {...detail("leaseEnd")} placeholder="Month and year, if you know" /></label>
              <label className="qdField"><span>Monthly cost</span><input {...detail("spend")} inputMode="decimal" placeholder="A rough number is fine" /></label>
            </div>
            {more.error && <p className="formError" role="alert">{more.error}</p>}
            <button type="submit" className="btn btnRed btnFull qdNext" disabled={morePending}>
              {morePending ? "Sending…" : <>{copy.detailsSubmit} <Arrow /></>}
            </button>
            <button type="button" className="qdBack" onClick={close}>Skip</button>
          </>
        )}

        {view === "form" && step === 1 && (
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
            <button type="submit" className="btn btnRed btnFull qdNext" disabled={!help.length}>Continue <Arrow /></button>
          </>
        )}

        {view === "form" && step === 2 && (
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
            <button type="submit" className="btn btnRed btnFull qdNext" disabled={!timing}>Continue <Arrow /></button>
            <button type="button" className="qdBack" onClick={() => setStep(1)}>Back</button>
          </>
        )}

        {view === "form" && step === 3 && (
          <>
            <div className="qdFields">
              <label className="qdField">
                <span>Your name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="First and last name" />
              </label>
              <div className="qdField">
                <span>Best way to reach you</span>
                <div className="qdSeg" role="group" aria-label="Contact method">
                  <button type="button" aria-pressed={contactType === "phone"} onClick={() => { setContactType("phone"); setProblem(""); }}>Phone</button>
                  <button type="button" aria-pressed={contactType === "email"} onClick={() => { setContactType("email"); setProblem(""); }}>Email</button>
                </div>
                {contactType === "phone" ? (
                  <input key="tel" value={tel} onChange={(e) => setTel(formatPhone(e.target.value))} type="tel" inputMode="tel" autoComplete="tel" placeholder="(979) 555-0123" aria-label="Phone number" />
                ) : (
                  <input key="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" placeholder="you@yourfirm.com" aria-label="Email address" />
                )}
              </div>
              <label className="qdField">
                <span>Business name</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
              </label>
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <button type="submit" className="btn btnRed btnFull qdNext" disabled={pending}>
              {pending ? "Sending…" : <>{copy.submit} <Arrow /></>}
            </button>
            <p className="qdFine">{copy.fine}</p>
            <button type="button" className="qdBack" onClick={() => setStep(2)}>Back</button>
          </>
        )}
      </form>
    </dialog>
  );
}
