"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PHONE_DISPLAY, PHONE_HREF, OFFICE_ADDRESS } from "@/lib/site";
import styles from "./law.module.css";
import { LegalHero } from "./LegalHero";
import { lawPractices, resolveLawPractice, type LawPractice } from "./law-content";

const campaign = {
  law: {
    audience: "For law firms in Bryan–College Station", title: <>More time on the case.<br /><em>Less at the copier.</em></>,
    intro: "Client packets. Scanned case files. One more deadline. Let’s make the paperwork easier.",
    cta: "Find the right fit for our firm", image: "Leroy + Kyocera · legal office", eyebrow: "Less friction between you and the next deadline",
    heading: <>The paperwork is part of the job.<br />The frustration shouldn’t be.</>,
    explanation: "Start with the tasks that take too many steps, too much waiting, or too much attention.",
    points: [
      ["The packet has to go out today.", "Big files, mixed paper sizes, two-sided pages, and last-minute changes. We’ll review capacity and finishing around the documents your team prepares."],
      ["Scanning shouldn’t create another task.", "If your team rescans pages or moves files by hand, show us the steps. We’ll check scan destinations, document handling, and whether searchable PDFs need extra software."],
      ["Client documents deserve more control.", "Shared equipment doesn’t have to mean an afterthought about access. We’ll discuss print release and user controls, then verify the right configuration for your firm."],
    ],
    needs: ["Preparing large document packets", "Scanning & finding files", "Document access controls", "Color printing costs", "Replacing unreliable equipment", "Not sure yet"],
    equipment: ["Not sure", "Shared copier", "Desktop printers", "Both", "Setting up a new office"],
    volumeLabel: "About how many pages each month?", volumes: ["Not sure", "Under 500", "500–2,000", "2,001–5,000", "More than 5,000"],
    equipmentLabel: "What does your firm use today?", businessLabel: "Firm name", workLabel: "Your office",
    note: "Kyocera equipment · configuration based on your needs", specialty: "Litigation, estate planning, family law, or business law: tell us what your practice handles. We’ll focus on your actual document work.",
  },
  construction: {
    audience: "For your construction team", title: <>The plans changed.<br /><em>Keep the job moving.</em></>,
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
const blank = { paper: "Not sure", equipment: "Not sure", model: "", volume: "Not sure", color: "Not sure", colorDocuments: "Not sure", cost: "", agreement: "Not sure", end: "", name: "", contact: "", business: "" };
type Answers = typeof blank;

function Arrow() { return <span aria-hidden="true">↗</span>; }

export function LawLanding({ niche = "law", businessName = "", initialPractice = "general" }: { niche?: "law" | "construction"; businessName?: string; initialPractice?: LawPractice }) {
  const content = campaign[niche];
  const [activeNeed, setActiveNeed] = useState(0);
  const [practice, setPractice] = useState<string>(niche === "law" ? initialPractice : "General contracting");
  const practices: Record<string, string> = {
    "General contracting": "Bid sets, subcontractor copies, and revised drawings. Let’s match the printer to your sheet sizes, turnaround, and project workload.",
    "Roofing": "Roof plans, details, and takeoff drawings. Let’s see which sheets you actually use and how often you need them on paper.",
    "Electrical": "Electrical plans, schedules, and color markups. Let’s review line detail, sheet size, and revision printing.",
    "Other trades": "Tell us which drawings your team uses. We’ll work from your files, paper sizes, and printing frequency.",
  };
  const legalContent = lawPractices[resolveLawPractice(practice)];
  const points = niche === "law" ? legalContent.points : content.points;
  const currentPractice = niche === "law" ? legalContent.label : practice;
  const needs = content.needs;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({ ...blank, business: businessName });
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
    <div className={styles.preview}>Layout review · temporary imagery · form preview</div>
    {niche === "law" ? <LegalHero businessName={businessName || "Your law firm"} /> : <section className={styles.hero} aria-labelledby="law-title">
      <header className={styles.header}>
        <a href="#" aria-label="CTWP home" className={styles.logo}><img src="/ctwp-mark.webp" alt="CTWP, Your Copier Company" width="111" height="63" /></a>
        <nav className={styles.nav}><a href="#needs-title">Built for your work</a><a href="#rep-title">Your local team</a></nav><div className={styles.location}>Bryan–College Station<a href={PHONE_HREF}>Let’s talk <Arrow /></a></div>
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
          <Image src="/dental/hero.jpg" width={1254} height={1254} priority sizes="(max-width: 899px) 100vw, 55vw" alt="Temporary layout image of Leroy beside a copier; final niche artwork will replace this" />
          <figcaption><span className={styles.paw}>Meet Leroy</span><span>CTWP’s company dog.<br />Your friendly introduction.</span></figcaption>
        </figure>
      </div>
    </section>}

    <div className={styles.trustStrip}><span>Local people. Real conversations.</span><span>{niche === "law" ? "Built around your document work" : "Wide-format equipment options"}</span><span>Equipment + service, considered together</span></div>

    <section className={styles.needs} aria-labelledby="needs-title">
      <div className={styles.sectionHead}><p className={styles.eyebrow}>{niche === "law" ? "For the work behind the case" : "For the work behind the build"}</p><h2 id="needs-title">{niche === "law" ? <>What’s slowing<br /><em>your firm down?</em></> : <>Plans in hand.<br /><em>One less interruption.</em></>}</h2><p>{niche === "law" ? "A new machine should solve an everyday problem. Start with the one your team notices most." : "Start with the part of getting drawings printed that keeps interrupting your day."}</p></div>
      {niche === "law" && <div className={styles.practicePicker}><label htmlFor="practice-area">What kind of work does your firm handle?</label><select id="practice-area" value={resolveLawPractice(practice)} onChange={e => setPractice(e.target.value)}>{Object.entries(lawPractices).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select><p>{legalContent.examples}</p></div>}
      <div className={styles.featureTabs} role="tablist" aria-label="Explore equipment needs">{(niche === "law" ? ["Preparing packets", "Scanning files", "Document access"] : ["Last-minute revisions", "Drawing quality", "Scanning plans"]).map((label,i) => <button key={label} type="button" role="tab" id={`need-tab-${i}`} aria-selected={activeNeed === i} aria-controls="need-panel" onClick={() => setActiveNeed(i)}><span>0{i+1}</span>{label}<Arrow /></button>)}</div>
      <div className={styles.featurePanel} role="tabpanel" id="need-panel" aria-labelledby={`need-tab-${activeNeed}`}>
        <div className={styles.featureCopy}><p className={styles.eyebrow}>A better setup starts here</p><h3>{points[activeNeed][0]}</h3><p>{points[activeNeed][1]}</p><a href="#office-review" className={styles.textLink} onClick={() => setSelected([content.needs[activeNeed]])}>Let’s look at this for our {niche === "law" ? "firm" : "team"} <Arrow /></a></div>
        <div className={styles.workflowVisual} aria-label="Illustrative document workflow">
          <div className={styles.paperStack}><span className={styles.documentLabel}>{niche === "law" ? ["CLIENT PACKET", "SCANNED CASE FILE", "CONFIDENTIAL PRINT"][activeNeed] : ["REVISED PLAN SET", "DRAWING DETAIL", "MARKED-UP ORIGINAL"][activeNeed]}</span><strong>{niche === "law" ? ["Ready for the\nnext meeting.", "From paper\nto your workflow.", "The right pages.\nThe right people."][activeNeed] : ["Revision in.\nNew set out.", "Every line.\nEvery detail.", "Keep the notes.\nShare the drawing."][activeNeed]}</strong><div className={styles.documentLines}><i/><i/><i/></div><span className={styles.documentFooter}>{niche === "law" ? "YOUR FIRM / YOUR WORKFLOW" : "YOUR TEAM / YOUR DRAWINGS"}</span></div>
          <div className={styles.workflowTag}><span>✓</span>{niche === "law" ? ["Paper handling + finishing", "Scan destinations + software", "Access + print release"][activeNeed] : ["Sheet size + turnaround", "Scale + color + line detail", "Scan width + file destination"][activeNeed]}</div>
          <small>Options to review with your CTWP rep</small>
        </div>
      </div>
    </section>

    {niche === "construction" && <section className={styles.practiceSection}><div><p className={styles.eyebrow}>The same industry. Different working days.</p><h2>Your trade has<br />its own drawing set.</h2></div><div className={styles.practiceContent}><div className={styles.practiceChips}>{Object.keys(practices).map(p => <button key={p} aria-pressed={currentPractice === p} onClick={() => setPractice(p)}>{p}</button>)}</div><p>{practices[currentPractice]}</p><span>We’ll tailor the conversation to your work.</span></div></section>}

    {niche === "law" && <section className={styles.colorSection} aria-labelledby="color-title"><div className={styles.colorHeading}><p className={styles.eyebrow}>A closer look at color costs</p><h2 id="color-title">A small color logo.<br /><em>A full-color charge?</em></h2><p>Some agreements charge one rate for every color page. Your everyday documents may tell a different story.</p></div><div className={styles.colorGrid}>{[
      ["A little color", "The logo-at-the-top page.", "Mostly black text, with a small splash of color."],
      ["A bit more color", "The chart-and-highlights page.", "Graphs, headings, or color that helps explain a point."],
      ["Color throughout", "The picture-heavy page.", "Photos, full-page graphics, and colorful presentations."],
    ].map(([label,title,description],i) => <article key={label}><div className={[styles.colorSample, styles[`colorSample${i}`]].join(" ")} aria-hidden="true"><span>YOUR FIRM</span><i/><i/><i/><b/><i/><i/></div><span className={styles.colorLabel}>{label}</span><h3>{title}</h3><p>{description}</p></article>)}</div><div className={styles.colorBottom}><p>Kyocera’s tiered color billing can price pages differently based on color coverage. We’ll compare representative documents with your current agreement and CTWP’s available rates. Savings depend on your usage and the terms. Examples above illustrate document types, not billing thresholds.</p><a className={styles.textLink} href="#office-review" onClick={() => setSelected(["Color printing costs"])}>Let’s check our color costs <Arrow /></a></div></section>}

    <section className={styles.offerSection}><div className={styles.offerHeading}><p className={styles.eyebrow}>Know what you’re comparing</p><h2>More than a machine.<br /><em>A clearer decision.</em></h2><p>Tell us about your current setup. We’ll help you work through the choices that matter.</p></div><div className={styles.offerGrid}><article><span>01 / THE EQUIPMENT</span><h3>What fits your work?</h3><p>{niche === "law" ? "Device capacity, scanning, paper handling, and the accessories you actually need." : "Print width, drawing quality, color, and whether you need a scanner as well."}</p></article><article><span>02 / THE FULL COST</span><h3>What’s included?</h3><p>Equipment, service, supplies, and usage charges—clearly separated so you can compare the arrangement.</p></article><article><span>03 / THE TIMING</span><h3>When does it make sense?</h3><p>Your current agreement, remaining obligations, and installation needs should be part of the conversation.</p></article></div></section>

    <section className={styles.repSection} aria-labelledby="rep-title"><div className={styles.repPortrait}><img src="/leroy.png" alt="Real photo of Leroy at the CTWP office" loading="lazy" /><span>Leroy handles the introduction.<br />Nick handles the conversation.</span></div><div className={styles.repIntro}><p className={styles.eyebrow}>From your neighbors at CTWP</p><h2 id="rep-title">A real person.<br /><em>Right here in Bryan.</em></h2><p>You don’t need to arrive with a model number or a perfect page count. Show me what your team is trying to do, and we’ll work through the equipment, service, and costs together.</p><p className={styles.signature}>Nick Sanford<span>Your CTWP contact · Bryan–College Station</span></p><a className={styles.textLink} href={PHONE_HREF}>Call CTWP · {PHONE_DISPLAY} <Arrow /></a></div></section>

    <section className={styles.reviewSection} id="office-review" aria-labelledby="review-title">
      <div className={styles.reviewIntro}><p className={styles.eyebrow}>Let’s start with your work</p><h2 id="review-title">Let’s find<br /><em>your better fit.</em></h2><p>A few details give us a useful starting point. Estimates and “not sure” are welcome.</p><ol className={styles.howItWorks}><li>Share a few details.</li><li>Your CTWP rep reviews your needs.</li><li>Talk through suitable options.</li></ol></div>
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
            {niche === "construction" && selectField("paper", "Largest drawing size you need?", ["Not sure", "Up to 24 inches wide", "Up to 36 inches wide", "Larger than 36 inches"])}
            {niche === "law" ? selectField("colorDocuments", "What does your color printing usually look like?", ["Not sure", "Mostly black text with a color logo", "Charts, highlights, or color headings", "Photos or full-color pages", "A mix of these", "We only print black and white"]) : selectField("color", "How often do your drawings need color?", ["Not sure", "Often", "Sometimes", "Never"])}
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
          <dl><dt>{content.businessLabel}</dt><dd>{answers.business}</dd><dt>Practice / trade</dt><dd>{currentPractice}</dd><dt>Priorities</dt><dd>{selected.join(", ") || "Not sure yet"}</dd><dt>Current equipment</dt><dd>{answers.equipment}{answers.model ? ` · ${answers.model}` : ""}</dd><dt>Print workload / color</dt><dd>{answers.volume} / {niche === "law" ? answers.colorDocuments : answers.color}</dd>{niche === "construction" && <><dt>Drawing width</dt><dd>{answers.paper}</dd></>}<dt>Approximate cost</dt><dd>{answers.cost || "Not sure"}</dd><dt>Agreement</dt><dd>{answers.agreement}{answers.agreement === "Yes" && answers.end ? ` · ends ${answers.end}` : ""}</dd><dt>Contact</dt><dd>{answers.name}<br />{answers.contact}</dd></dl>
          <button className={styles.back} onClick={() => { setComplete(false); changeStep(2); }}>Edit my answers</button>
        </div>}
      </div>
    </section>

    <section className={styles.faq}><p className={styles.eyebrow}>A few things you might be wondering</p><h2>Before you get started.</h2><details><summary>What if we’re still in a lease?</summary><p>Include the end date if you know it. Your rep will review timing and any remaining obligations before recommending a change.</p></details><details><summary>Do I need our model number or exact page counts?</summary><p>No. Start with what you know. A photo of the equipment or a recent bill can help your rep fill in the details later.</p></details><details><summary>Will I receive an instant quote?</summary><p>Your rep reviews your needs and confirms equipment, availability, and pricing before preparing a proposal. This first step starts that conversation.</p></details></section>
    <footer className={styles.footer}><img src="/ctwp-mark.webp" alt="CTWP" width="105" height="60" /><p>Your neighbors in Bryan–College Station.</p><address>{OFFICE_ADDRESS}</address><a href={PHONE_HREF}>{PHONE_DISPLAY}</a><small>{content.note}</small></footer>
  </main>;
}
