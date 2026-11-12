"use client";

import { startTransition, useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { addRequestDetails, submitAccountingRequest, type RequestState } from "@/app/actions";
import { ACTION, ACTION_DONE, type AccountingCopy } from "@/lib/accounting";

/* The quote pop-up. Three short steps (what to help with, timing, contact) save the request.
   After that the visitor can add copier details and a photo, which are merged into the same request.
   Anything on the page can open it: a QuoteButton, a HelpRow, or any link that points at #quote.
   On phones it is a bottom sheet whose main button stays pinned above the keyboard. */

const OPEN_EVENT = "ctwp:quote";

/* Whether a request was sent during this visit, so page buttons can say so. */
let sent = false;
const sentListeners = new Set<() => void>();
function markSent() {
  if (sent) return;
  sent = true;
  sentListeners.forEach((l) => l());
}
function useSent() {
  return useSyncExternalStore(
    (l) => { sentListeners.add(l); return () => sentListeners.delete(l); },
    () => sent,
    () => false,
  );
}

type OpenDetail = { choice?: string; jump?: boolean };
const openQuote = (detail: OpenDetail = {}) => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail }));

const Chevron = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Camera = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** Opens the quote pop-up. After a request is sent it says so and reopens the thank-you screen. */
export function QuoteButton({ className = "aBtn", track = ACTION, tabIndex }: { className?: string; track?: string; tabIndex?: number }) {
  const done = useSent();
  return (
    <button type="button" className={className} data-track={track} tabIndex={tabIndex} onClick={() => openQuote()}>
      {done ? ACTION_DONE : ACTION}
    </button>
  );
}

/** A large row on the page that answers the pop-up's first question and opens it at the next step. */
export function HelpRow({ choice }: { choice: string }) {
  return (
    <button type="button" className="aRow" data-track={`Help: ${choice}`} onClick={() => openQuote({ choice, jump: true })}>
      <span>{choice}</span>
      <Chevron />
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
  const [problem, setProblem] = useState("");
  // The server's error stays until the visitor changes something.
  const [serverErrorShown, setServerErrorShown] = useState(true);
  const [details, setDetails] = useState({ provider: "", equipment: "", serial: "", leaseEnd: "", spend: "" });
  const [photo, setPhoto] = useState<{ blob: Blob; preview: string } | null>(null);
  const [photoNote, setPhotoNote] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const contactInput = useRef<HTMLInputElement>(null);
  const advance = useRef<number | undefined>(undefined);

  const view: View = !state.ok ? "form" : more.ok ? "finished" : wantsDetails ? "details" : "thanks";

  useEffect(() => { if (state.ok) markSent(); }, [state.ok]);

  useEffect(() => {
    const open = ({ choice, jump }: OpenDetail = {}) => {
      if (choice) {
        setHelp((h) => (h.includes(choice) ? h : [...h, choice]));
        setProblem("");
        // A row on the page already answered the first question, so go straight to the next one.
        setStep(jump ? 2 : 1);
      }
      const d = dialog.current;
      if (d && !d.open) d.showModal();
    };
    const onEvent = (e: Event) => open((e as CustomEvent<OpenDetail>).detail ?? {});
    // Links to #quote open the pop-up instead of scrolling.
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

  // On phones, sit on top of the on-screen keyboard so the main button stays in view.
  useEffect(() => {
    const vv = window.visualViewport;
    const d = dialog.current;
    if (!vv || !d) return;
    const sync = () => {
      const kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      d.style.setProperty("--kb", `${kb}px`);
      d.style.setProperty("--vvh", `${Math.round(vv.height)}px`);
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => { vv.removeEventListener("resize", sync); vv.removeEventListener("scroll", sync); };
  }, []);

  // Each new screen starts at the top with its heading focused.
  useEffect(() => {
    dialog.current?.querySelector(".qdBody")?.scrollTo(0, 0);
    if (dialog.current?.open) heading.current?.focus({ preventScroll: true });
  }, [step, view]);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.preview); }, [photo]);
  useEffect(() => () => window.clearTimeout(advance.current), []);

  const toggle = (o: string) => { setProblem(""); setHelp((h) => (h.includes(o) ? h.filter((x) => x !== o) : [...h, o])); };
  const close = () => dialog.current?.close();
  const edited = () => { setProblem(""); setServerErrorShown(false); };

  const pickTiming = (o: string) => {
    setTiming(o);
    setProblem("");
    window.clearTimeout(advance.current);
    // A short pause so the choice is seen before the next question slides in.
    advance.current = window.setTimeout(() => setStep(3), 260);
  };

  const next = () => {
    if (step === 1) return help.length ? setStep(2) : setProblem("Choose at least one to continue.");
    if (step === 2) return timing ? setStep(3) : setProblem("Choose one to continue.");
    submit();
  };

  const submit = () => {
    if (pending) return;
    const contact = contactType === "phone" ? tel : email.trim();
    if (!name.trim()) return setProblem("Please add your name.");
    if (contactType === "phone" ? tel.replace(/\D/g, "").length < 10 : !/^\S+@\S+\.\S+$/.test(contact))
      return setProblem(contactType === "phone" ? "Please add a 10-digit phone number." : "Please check your email address.");
    setProblem("");
    setServerErrorShown(true);
    const fd = new FormData();
    help.forEach((h) => fd.append("help", h));
    fd.set("timing", timing);
    fd.set("name", name);
    fd.set("contact", contact);
    fd.set("contactType", contactType);
    fd.set("business", business);
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
    if (morePending) return;
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

  /* Return in a details field moves to the next field instead of sending. The last field just closes the keyboard. */
  const detailsKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) return;
    e.preventDefault();
    const inputs = Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>("input:not([type=file])"));
    const i = inputs.indexOf(e.target);
    if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus();
    else e.target.blur();
  };

  const title =
    view === "thanks" ? copy.thanksHeading
    : view === "details" ? copy.detailsHeading
    : view === "finished" ? copy.detailsThanksHeading
    : step === 1 ? copy.helpQuestion : step === 2 ? copy.timingQuestion : copy.contactQuestion;
  const error = problem || (serverErrorShown ? state.error : "");

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
          else next();
        }}
      >
        <div className="qdTop">
          <p className="qdFor">
            {view === "form" ? <>Step {step} of 3</> : <>For {business}</>}
          </p>
          <button type="button" className="qdClose" aria-label="Close" onClick={close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {view === "form" && (
          <div className="qdSteps" aria-hidden="true">
            <span style={{ transform: `scaleX(${step / 3})` }} />
          </div>
        )}

        <div className="qdBody" key={`${view}-${step}`}>
          <h2 id="qd-title" ref={heading} tabIndex={-1}>{title}</h2>

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
            </>
          )}

          {view === "form" && step === 2 && (
            <div className="qdChoices" role="group" aria-labelledby="qd-title">
              {copy.timing.map((o) => (
                <button key={o} type="button" aria-pressed={timing === o} className={timing === o ? "on" : ""} onClick={() => pickTiming(o)}>
                  <span className="qdMark round" aria-hidden />
                  <span>{o}</span>
                </button>
              ))}
            </div>
          )}

          {view === "form" && step === 3 && (
            <div className="qdFields">
              <label className="qdField">
                <span>Your name</span>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); edited(); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); contactInput.current?.focus(); } }}
                  autoComplete="name" enterKeyHint="next" placeholder="First and last name"
                />
              </label>
              <div className="qdField">
                <span id="qd-contact-label">Best way to reach you</span>
                <div className="qdSeg" role="group" aria-labelledby="qd-contact-label">
                  <button type="button" aria-pressed={contactType === "phone"} onClick={() => { setContactType("phone"); edited(); }}>Phone</button>
                  <button type="button" aria-pressed={contactType === "email"} onClick={() => { setContactType("email"); edited(); }}>Email</button>
                </div>
                {contactType === "phone" ? (
                  <input key="tel" ref={contactInput} value={tel} onChange={(e) => { setTel(formatPhone(e.target.value)); edited(); }} type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="send" placeholder="(979) 555-0123" aria-label="Phone number" />
                ) : (
                  <input key="email" ref={contactInput} value={email} onChange={(e) => { setEmail(e.target.value); edited(); }} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" enterKeyHint="send" placeholder="you@yourfirm.com" aria-label="Email address" />
                )}
              </div>
              <p className="qdHint">For {business}.</p>
            </div>
          )}

          {view === "thanks" && (
            <>
              <p className="qdText">{copy.thanksBody} If you would rather talk now, call <a href={phone.href}>{phone.display}</a>.</p>
              {state.ref && <p className="qdText">{copy.detailsInvite}</p>}
            </>
          )}

          {view === "finished" && <p className="qdText">{copy.detailsThanksBody}</p>}

          {view === "details" && (
            <>
              <p className="qdHint">{copy.detailsHint}</p>
              <div className="qdFields" onKeyDown={detailsKeys}>
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
                      <div className="qdPhotoActions">
                        <button type="button" onClick={() => picker.current?.click()}>Change photo</button>
                        <button type="button" onClick={() => setPhoto(null)}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="qdPhotoBtn" onClick={() => picker.current?.click()}><Camera /> Take or choose a photo</button>
                  )}
                  <small>{photoNote || "Include the label with the serial number if you can."}</small>
                </div>
                <label className="qdField"><span>Current provider</span><input {...detail("provider")} enterKeyHint="next" placeholder="Who you lease or get service from" /></label>
                <label className="qdField"><span>Make and model</span><input {...detail("equipment")} enterKeyHint="next" placeholder="If you know it" /></label>
                <label className="qdField"><span>Serial number</span><input {...detail("serial")} enterKeyHint="next" autoCapitalize="characters" autoCorrect="off" placeholder="From the label on the machine" /></label>
                <label className="qdField"><span>When your lease ends</span><input {...detail("leaseEnd")} enterKeyHint="next" placeholder="Month and year, if you know" /></label>
                <label className="qdField"><span>Monthly cost</span><input {...detail("spend")} enterKeyHint="done" inputMode="decimal" placeholder="A rough number is fine" /></label>
              </div>
            </>
          )}
        </div>

        <div className="qdFoot">
          {view === "form" && (
            <>
              {error && <p className="qdError" role="alert">{error}</p>}
              <button type="submit" className="aBtn" aria-disabled={pending || undefined} data-track={step === 3 ? "Send quote request" : undefined}>
                {step < 3 ? "Next" : pending ? "Sending…" : copy.submit}
              </button>
              {step === 3 && <p className="qdFine">{copy.fine}</p>}
              {step > 1 && <button type="button" className="qdBack" onClick={() => { setProblem(""); setStep((s) => (s - 1) as Step); }}>Back</button>}
            </>
          )}
          {view === "thanks" && (
            <>
              {state.ref && <button type="button" className="aBtn" onClick={() => setWantsDetails(true)}>{copy.detailsButton}</button>}
              <button type="button" className={state.ref ? "qdBack" : "aBtn"} onClick={close}>{state.ref ? "Not now" : "Done"}</button>
            </>
          )}
          {view === "details" && (
            <>
              {more.error && <p className="qdError" role="alert">{more.error}</p>}
              <button type="submit" className="aBtn" aria-disabled={morePending || undefined}>{morePending ? "Sending…" : copy.detailsSubmit}</button>
              <button type="button" className="qdBack" onClick={close}>Skip</button>
            </>
          )}
          {view === "finished" && <button type="button" className="aBtn" onClick={close}>Done</button>}
        </div>
      </form>
    </dialog>
  );
}
