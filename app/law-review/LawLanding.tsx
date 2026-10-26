"use client";

import { useRef, useState } from "react";
import { PHONE_DISPLAY, PHONE_HREF, OFFICE_ADDRESS } from "@/lib/site";
import styles from "./law.module.css";

const campaign = {
  law: {
    audience: "For your law firm", title: <>Your deadlines.<br />Your documents.<br />Your kind of copier.</>,
    intro: "From a quick client letter to a full case file, your equipment should fit the work. Let’s look at what your firm actually needs.",
    cta: "Find the right fit for our firm", image: "Leroy + Kyocera · legal office", eyebrow: "Less friction between you and the next deadline",
    heading: <>The paperwork is part of the job.<br />The frustration shouldn’t be.</>,
    explanation: "Start with the tasks that take too many steps, too much waiting, or too much attention.",
    points: [
      ["The packet has to go out today.", "Big files, mixed paper sizes, two-sided pages, and last-minute changes. We’ll review capacity and finishing around the documents your team prepares."],
      ["Scanning shouldn’t create another task.", "If your team rescans pages or moves files by hand, show us the steps. We’ll check scan destinations, document handling, and whether searchable PDFs need extra software."],
      ["Client documents deserve more control.", "Shared equipment doesn’t have to mean an afterthought about access. We’ll discuss print release and user controls, then verify the right configuration for your firm."],
    ],
    needs: ["Preparing large document packets", "Scanning & finding files", "Document access controls", "Costs & contract", "Replacing unreliable equipment", "Not sure yet"],
    equipment: ["Not sure", "Shared copier", "Desktop printers", "Both", "Setting up a new office"],
    volumeLabel: "About how many pages each month?", volumes: ["Not sure", "Under 500", "500–2,000", "2,001–5,000", "More than 5,000"],
    equipmentLabel: "What does your firm use today?", businessLabel: "Firm name", workLabel: "Your office",
    note: "Kyocera equipment · configuration based on your needs", specialty: "Litigation, estate planning, family law, or business law: tell us what your practice handles. We’ll focus on your actual document work.",
  },
  construction: {
    audience: "For your construction team", title: <>The right plans.<br />At the right size.<br />When you need them.</>,
    intro: "Bids change. Drawings get revised. Your crew still needs the right set. Let’s see whether an in-house wide-format setup fits your work.",
    cta: "Find the right fit for our team", image: "Leroy + wide-format printer · construction office", eyebrow: "From the estimating desk to the job site",
    heading: <>A revised drawing.<br />Another trip to the print shop?</>,
    explanation: "An in-house printer should solve a real problem. We’ll help you work out where it makes sense.",
    points: [
      ["A small revision. A whole new errand.", "When plans change, waiting on another print run can interrupt the day. Tell us how often you reprint, which sheet sizes you need, and what you currently outsource."],
      ["The detail has to survive the page.", "Fine lines, readable notes, color markups, and correct scale matter. We’ll review your file types and drawing sizes, then test representative prints on a suitable machine."],
      ["Sometimes the original is on paper.", "Need to copy an existing plan or scan a marked-up drawing? That changes the setup. We’ll separate print-only needs from wide-format scanning and copying."],
    ],
    needs: ["Print revised plans in-house", "Reduce print-shop trips", "Scan or copy large drawings", "Color plans & markups", "Compare ownership costs", "Not sure yet"],
    equipment: ["Not sure", "We use a print shop", "We have a wide-format printer", "Office printer only", "Both in-house and outsourced"],
    volumeLabel: "How often do you print full-size plans?", volumes: ["Not sure", "A few times a month", "Every week", "Most days", "Large batches for bids or projects"],
    equipmentLabel: "How do you get plans printed today?", businessLabel: "Company name", workLabel: "Your workflow",
    note: "Wide-format options · equipment selected to fit your work", specialty: "General contractor, roofer, electrician, or another trade: your drawing sizes and workflow matter more than a one-size-fits-all recommendation.",
  },
};
const blank = { equipment: "Not sure", model: "", volume: "Not sure", color: "Not sure", cost: "", agreement: "Not sure", end: "", name: "", contact: "", business: "" };
type Answers = typeof blank;

function Arrow() { return <span aria-hidden="true">↗</span>; }

export function LawLanding({ niche = "law" }: { niche?: "law" | "construction" }) {
  const content = campaign[niche];
  const needs = content.needs;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>(blank);
  const [contactType, setContactType] = useState<"email" | "tel">("email");
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const update = (key: keyof Answers, value: string) => { setAnswers(a => ({ ...a, [key]: value })); setError(""); };
  const changeStep = (next: number) => { setStep(next); setError(""); requestAnimationFrame(() => stepHeading.current?.focus()); };
  const toggle = (value: string) => setSelected(a => value === "Not sure yet" ? (a.includes(value) ? [] : [value]) : a.includes(value) ? a.filter(x => x !== value) : [...a.filter(x => x !== "Not sure yet"), value]);
  const finish = () => {
    if (!answers.business.trim()) { setError("Please add your business name."); return; }
    if (!answers.name.trim()) { setError("Please add your name."); return; }
    if (contactType === "email" ? !/^\S+@\S+\.\S+$/.test(answers.contact.trim()) : answers.contact.replace(/\D/g, "").length < 10) { setError(contactType === "email" ? "Please add a valid email address." : "Please add a phone number with at least 10 digits."); return; }
    setComplete(true);
    requestAnimationFrame(() => stepHeading.current?.focus());
  };
  const selectField = (key: keyof Answers, label: string, options: string[]) => <label className={styles.field}><span>{label}</span><select value={answers[key]} onChange={e => update(key, e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>;

  return <main className={styles.page}>
    <div className={styles.preview}>Design preview · sample firm · form does not send</div>
    <section className={styles.hero} aria-labelledby="law-title">
      <header className={styles.header}>
        <a href="#" aria-label="CTWP home" className={styles.logo}><img src="/ctwp-mark.webp" alt="CTWP, Your Copier Company" width="111" height="63" /></a>
        <div className={styles.location}>Bryan–College Station<a href={PHONE_HREF}>Call CTWP <Arrow /></a></div>
      </header>
      <div className={styles.heroBody}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>From your neighbors at CTWP</p>
          <p className={styles.recipient}>{content.audience}</p>
          <h1 id="law-title">{content.title}</h1>
          <p className={styles.heroDescription}>{content.intro}</p>
          <a className={styles.primary} href="#office-review">{content.cta} <Arrow /></a>
          <p className={styles.heroNote}>Start with what you know. We’ll help with the rest.</p>
        </div>
        <figure className={styles.heroArt}>
          <div className={styles.imagePlaceholder}><span>CAMPAIGN IMAGE</span><strong>{content.image}</strong><p>Image composition comes after layout approval.</p></div>
        </figure>
      </div>
    </section>

    <section className={styles.needs} aria-labelledby="needs-title">
      <div className={styles.sectionHead}><p className={styles.eyebrow}>{content.eyebrow}</p><h2 id="needs-title">{content.heading}</h2><p>{content.explanation}</p></div>
      <div className={styles.needList}>{content.points.map(([heading, description], i) => <article className={styles.need} key={heading}><span className={styles.number}>0{i + 1}</span><div><h3>{heading}</h3><p>{description}</p></div></article>)}</div>
      <p className={styles.specialty}>{content.specialty}</p>
      <div className={styles.costNote}><span aria-hidden="true">+</span><p><strong>And yes, the numbers should make sense.</strong> We’ll look at equipment, service, supplies, and agreement timing together.</p></div>
    </section>

    <section className={styles.repSection} aria-labelledby="rep-title">
      <div className={styles.repIntro}><p className={styles.eyebrow}>A local person behind the page</p><h2 id="rep-title">Hi, I’m Nick.</h2><p>Tell me what’s working—and what isn’t. I’ll review your answers, clarify the details, and help you compare suitable options.</p><p className={styles.signature}>Nick Sanford<span>CTWP · Bryan–College Station</span></p><a className={styles.textLink} href={PHONE_HREF}>Prefer to talk? {PHONE_DISPLAY} <Arrow /></a></div>
      <div className={styles.repPortrait}><div className={styles.photoPlaceholder} aria-label="Placeholder for Nick’s portrait">NS</div><span>Rep photo goes here</span></div>
    </section>

    <section className={styles.reviewSection} id="office-review" aria-labelledby="review-title">
      <div className={styles.reviewIntro}><p className={styles.eyebrow}>Let’s start with your work</p><h2 id="review-title">You don’t need<br />all the answers.</h2><p>Estimates are fine. “Not sure” is always an option.</p><ol className={styles.howItWorks}><li>Share a few details.</li><li>Your CTWP rep reviews your needs.</li><li>Talk through suitable options.</li></ol></div>
      <div className={styles.formCard}>
        {!complete ? <>
          <div className={styles.progress} aria-label={`Step ${step + 1} of 3`}><span>{[content.workLabel, "Usage & timing", "Your contact"][step]}</span><span>{step + 1} / 3</span></div>
          <div className={styles.progressBars} aria-hidden="true">{[0,1,2].map(n => <span key={n} className={n <= step ? styles.filled : ""} />)}</div>
          <h3 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>{["What would you like to improve?", "A little about your workload.", "Who should we follow up with?"][step]}</h3>
          {step === 0 && <div className={styles.fields}>
            <fieldset className={styles.choices}><legend>Choose any that apply.</legend>{needs.map(n => <label key={n} className={styles.choice}><input type="checkbox" checked={selected.includes(n)} onChange={() => toggle(n)} /><span>{n}</span></label>)}</fieldset>
            {selectField("equipment", content.equipmentLabel, content.equipment)}
            <label className={styles.field}><span>Make or model <small>Optional</small></span><input value={answers.model} onChange={e => update("model", e.target.value)} placeholder="If you happen to know it" maxLength={120} /></label>
          </div>}
          {step === 1 && <div className={styles.fields}>
            {selectField("volume", content.volumeLabel, content.volumes)}
            {selectField("color", "How often do you need color?", ["Not sure", "Often", "Sometimes", "Never"])}
            <label className={styles.field}><span>Approximate monthly cost <small>Optional</small></span><input inputMode="decimal" value={answers.cost} onChange={e => update("cost", e.target.value)} placeholder="$  Not sure is fine" maxLength={30} /><small>Equipment and printing together. We’ll clarify what’s included.</small></label>
            {selectField("agreement", "Current lease or service agreement?", ["Not sure", "Yes", "No"])}
            {answers.agreement === "Yes" && <label className={styles.field}><span>When does it end? <small>Optional</small></span><input type="month" value={answers.end} onChange={e => update("end", e.target.value)} /></label>}
          </div>}
          {step === 2 && <div className={styles.fields}>
            <label className={styles.field}><span>{content.businessLabel}</span><input autoComplete="organization" value={answers.business} onChange={e => update("business", e.target.value)} maxLength={160} /></label>
            <label className={styles.field}><span>Your name</span><input autoComplete="name" value={answers.name} onChange={e => update("name", e.target.value)} maxLength={120} /></label>
            <fieldset className={styles.contactChoice}><legend>How would you prefer to hear from us?</legend>{(["email", "tel"] as const).map(t => <label key={t}><input type="radio" name="contact-method" checked={contactType === t} onChange={() => { setContactType(t); update("contact", ""); }} />{t === "email" ? "Email" : "Phone"}</label>)}</fieldset>
            <label className={styles.field}><span>{contactType === "email" ? "Email address" : "Phone number"}</span><input type={contactType} autoComplete={contactType} value={answers.contact} onChange={e => update("contact", e.target.value)} maxLength={160} /></label>
            <p className={styles.formNote}>This preview lets you try the questions. Your answers stay on this page and aren’t sent to CTWP.</p>
          </div>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.formActions}>{step > 0 && <button className={styles.back} onClick={() => changeStep(step - 1)}>Back</button>}<button className={styles.primary} onClick={() => step < 2 ? changeStep(step + 1) : finish()}>{step < 2 ? "Continue" : "Review my details"}<Arrow /></button></div>
          {step === 0 && <p className={styles.formNote}>You can continue without selecting an answer.</p>}
        </> : <div className={styles.summary}>
          <p className={styles.eyebrow}>Preview complete</p><h3 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>Here’s the starting point.</h3><p>This is the information your CTWP rep would review. Nothing has been sent.</p>
          <dl><dt>{content.businessLabel}</dt><dd>{answers.business}</dd><dt>Priorities</dt><dd>{selected.join(", ") || "Not sure yet"}</dd><dt>Current equipment</dt><dd>{answers.equipment}{answers.model ? ` · ${answers.model}` : ""}</dd><dt>Print workload / color</dt><dd>{answers.volume} / {answers.color}</dd><dt>Approximate cost</dt><dd>{answers.cost || "Not sure"}</dd><dt>Agreement</dt><dd>{answers.agreement}{answers.agreement === "Yes" && answers.end ? ` · ends ${answers.end}` : ""}</dd><dt>Contact</dt><dd>{answers.name}<br />{answers.contact}</dd></dl>
          <button className={styles.back} onClick={() => { setComplete(false); changeStep(2); }}>Edit my answers</button>
        </div>}
      </div>
    </section>

    <footer className={styles.footer}><img src="/ctwp-mark.webp" alt="CTWP" width="105" height="60" /><p>Your neighbors in Bryan–College Station.</p><address>{OFFICE_ADDRESS}</address><a href={PHONE_HREF}>{PHONE_DISPLAY}</a><small>{content.note}</small></footer>
  </main>;
}
