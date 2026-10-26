"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PHONE_DISPLAY, PHONE_HREF, OFFICE_ADDRESS } from "@/lib/site";
import styles from "./law.module.css";
import { LegalHero } from "./LegalHero";
import { BrandCarousel } from "./BrandCarousel";
import { additionalSolutions, practiceRepFocus, LAW_OFFICE_PHONE, LAW_OFFICE_HREF } from "./law-solutions";
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
    needs: ["Preparing large document packets", "Scanning & finding files", "Document access controls", "Understanding costs & agreements", "Replacing unreliable equipment", "Not sure yet"],
    equipment: ["Not sure", "Shared copier", "Desktop printers", "Both", "Setting up a new office"],
    volumeLabel: "About how many pages each month?", volumes: ["Not sure", "Under 500", "500–2,000", "2,001–5,000", "More than 5,000"],
    equipmentLabel: "What does your firm use today?", businessLabel: "Firm name", workLabel: "Your office",
    note: "Copiers, printers & local service · CTWP", specialty: "Litigation, estate planning, family law, or business law: tell us what your practice handles. We’ll focus on your actual document work.",
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
const blank = { paper: "Not sure", equipment: "Not sure", model: "", volume: "Not sure", color: "Not sure", cost: "", agreement: "Not sure", end: "", name: "", contact: "", business: "" };
type Answers = typeof blank;

const workflows = [
  { label: "Printing costs", priority: "Understanding costs & agreements", position: "left", alt: "Illustrative document packet representing an office printing workload", caption: "A clearer view of your costs.", checks: ["Lease payments and remaining obligations", "Included pages, color charges, and overages", "Supplies, service, and total monthly cost"] },
  { label: "Service & support", priority: "Better service & local support", position: "right", alt: "Illustration of shared office printing equipment", caption: "A local team to call.", checks: ["Who to contact when work is interrupted", "Service coverage and supply arrangements", "Training and day-to-day equipment help"] },
  { label: "Court-ready packets", priority: "Preparing large document packets", position: "left", alt: "Illustration of a collated document packet with divider tabs on an office desk", caption: "Ready for the next meeting.", checks: ["Mixed letter and legal pages", "Two-sided sets in the right order", "Sorting, stapling, and finishing options"] },
  { label: "Scanning & digital files", priority: "Scanning & finding files", position: "center", alt: "Illustration of documents being loaded into an office scanner", caption: "Paper in. A usable file out.", checks: ["Clear scans with less rescanning", "Searchable PDFs and file naming", "A route to the folders your team uses"] },
  { label: "Confidential documents", priority: "Document access controls", position: "right", alt: "Illustration of an office worker collecting documents from a copier", caption: "Collected by the right person.", checks: ["Releasing a job at the device", "User access and shared equipment", "Keeping client pages off the shared pile"] },
  { label: "Busy-day performance", priority: "Equipment capacity for busy days", position: "right", alt: "Illustration of shared office printing equipment", caption: "A setup that keeps up with your team.", checks: ["Peak workload and simultaneous jobs", "Paper sizes, trays, and finishing", "Shared devices and desktop printers"] },
] as const;

function SolutionIcon({ index }: { index: number }) {
  const paths = [
    <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h1m4 0h1m-6 4h1m4 0h1m-6 3h6"/></>,
    <><path d="M4 13v-2a8 8 0 0 1 16 0v2M20 16v2a3 3 0 0 1-3 3h-4"/><rect x="2" y="11" width="4" height="7" rx="2"/><rect x="18" y="11" width="4" height="7" rx="2"/></>,
    <><path d="M8 3h9l3 3v12H8zM4 7v15h12M16 3v4h4M11 11h6M11 15h6"/></>,
    <><path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5M2 12h20"/><path d="M9 8h6M9 16h6"/></>,
    <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    <><path d="M4 18a9 9 0 1 1 16 0M12 13l5-5M5 12h2M12 5v2M17 12h2"/><circle cx="12" cy="13" r="2"/></>,
  ];
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}

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
  const legalContent = lawPractices[resolveLawPractice(initialPractice)];
  const points = niche === "law" ? [additionalSolutions[0], additionalSolutions[1], ...legalContent.points, additionalSolutions[2]] : content.points;
  const tabCount = points.length;
  const repName = niche === "law" ? "Ryan" : "Nick";
  const officePhone = niche === "law" ? LAW_OFFICE_PHONE : PHONE_DISPLAY;
  const officeHref = niche === "law" ? LAW_OFFICE_HREF : PHONE_HREF;
  const repFocus = practiceRepFocus[resolveLawPractice(initialPractice)];
  const solutionPriorities = workflows.map(workflow => workflow.priority);
  const currentPractice = niche === "law" ? legalContent.label : practice;
  const needs = niche === "law" ? [...solutionPriorities, "Not sure yet"] : content.needs;
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

  return <main className={`${styles.page} ${niche === "law" ? styles.lawPage : ""}`}>
    {niche === "law" ? <LegalHero businessName={businessName} /> : <section className={styles.hero} aria-labelledby="law-title">
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

    {niche === "law" ? <section className={styles.companyIntro} aria-labelledby="company-title">
      <div className={styles.companyIdentity}><img src="/ctwp-mark.webp" alt="CTWP — Your Copier Company" width="111" height="90" /><p>Serving Texas since 1979</p></div>
      <div className={styles.companyCopy}><h2 id="company-title">A Texas equipment dealer.<br />A local team behind you.</h2><p>CTWP sells and services copiers, printers, and office equipment from leading brands. Our Bryan–College Station team helps with equipment selection, supplies, training, and ongoing service—so your firm has a place to turn after installation, too.</p><BrandCarousel /></div>
    </section> : <div className={styles.trustStrip}><span>Bryan–College Station</span><span>Wide-format equipment options</span><span>A setup that fits your office</span></div>}

    <section className={styles.needs} aria-labelledby="needs-title">
      <div className={styles.sectionHead}><p className={styles.eyebrow}>{niche === "law" ? "CTWP for law firms" : "For the work behind the build"}</p><h2 id="needs-title">{niche === "law" ? <>What would make your workday easier?</> : <>Plans in hand.<br /><em>One less interruption.</em></>}</h2><p>{niche === "law" ? "Choose a topic to see how CTWP can help with the work behind your cases." : "Start with the part of getting drawings printed that keeps interrupting your day."}</p></div>

      <div className={styles.featureTabs} role="tablist" aria-label="Explore equipment needs">
        {(niche === "law" ? workflows.map(w => w.label) : ["Last-minute revisions", "Drawing quality", "Scanning plans"]).map((label,i) => <button key={label} type="button" role="tab" id={`need-tab-${i}`} aria-selected={activeNeed === i} aria-controls="need-panel" tabIndex={activeNeed === i ? 0 : -1} onKeyDown={e => { const next = e.key === "ArrowRight" ? (i + 1) % tabCount : e.key === "ArrowLeft" ? (i + tabCount - 1) % tabCount : e.key === "Home" ? 0 : e.key === "End" ? tabCount - 1 : -1; if (next >= 0) { e.preventDefault(); setActiveNeed(next); document.getElementById(`need-tab-${next}`)?.focus(); } }} onClick={() => setActiveNeed(i)}>
          <span className={styles.tabLabel}>{niche === "law" ? <SolutionIcon index={i} /> : <small>{`0${i+1}`}</small>}{label}</span><Arrow />
        </button>)}
      </div>
      <div className={styles.featurePanel} role="tabpanel" tabIndex={0} id="need-panel" aria-labelledby={`need-tab-${activeNeed}`}>
        <div className={styles.featureCopy}><p className={styles.eyebrow}>{niche === "law" ? "A little less friction in your day" : "A better setup starts here"}</p><h3>{points[activeNeed][0]}</h3><p>{points[activeNeed][1]}</p>
          {niche === "law" && <div className={styles.checkList}><h4>What we’ll look at together</h4><ul>{workflows[activeNeed].checks.map(check => <li key={check}>{check}</li>)}</ul></div>}
          <a href="#office-review" className={styles.textLink} onClick={() => setSelected([niche === "law" ? solutionPriorities[activeNeed] : content.needs[activeNeed]])}>{niche === "law" ? "Talk with Ryan about this" : "Let’s look at this for our team"} <Arrow /></a>
        </div>
        {niche === "law" ? <figure className={styles.featurePhoto}><img src="/law/workflows-v1.webp" alt={workflows[activeNeed].alt} width="2172" height="724" style={{objectPosition:workflows[activeNeed].position}} loading="lazy" /><figcaption><span>0{activeNeed+1}</span>{workflows[activeNeed].caption}</figcaption></figure> : <div className={styles.workflowVisual} aria-label="Illustrative document workflow">
          <div className={styles.paperStack}><span className={styles.documentLabel}>{["REVISED PLAN SET", "DRAWING DETAIL", "MARKED-UP ORIGINAL"][activeNeed]}</span><strong>{["Revision in.\nNew set out.", "Every line.\nEvery detail.", "Keep the notes.\nShare the drawing."][activeNeed]}</strong><div className={styles.documentLines}><i/><i/><i/></div><span className={styles.documentFooter}>YOUR TEAM / YOUR DRAWINGS</span></div>
          <div className={styles.workflowTag}><span>✓</span>{["Sheet size + turnaround", "Scale + color + line detail", "Scan width + file destination"][activeNeed]}</div><small>Options to review with your CTWP rep</small>
        </div>}
      </div>
      {niche === "law" && <p className={styles.capabilityNote}>We’ll confirm the features and software your setup needs. Workflow images are illustrative.</p>}

    </section>

    {niche === "construction" && <section className={styles.practiceSection}><div><p className={styles.eyebrow}>The same industry. Different working days.</p><h2>Your trade has<br />its own drawing set.</h2></div><div className={styles.practiceContent}><div className={styles.practiceChips}>{Object.keys(practices).map(p => <button key={p} aria-pressed={currentPractice === p} onClick={() => setPractice(p)}>{p}</button>)}</div><p>{practices[currentPractice]}</p><span>We’ll tailor the conversation to your work.</span></div></section>}


    <section className={styles.offerSection}><div className={styles.offerHeading}><p className={styles.eyebrow}>What an equipment review covers</p><h2>A clear plan for<br /><em>your next setup.</em></h2><p>We’ll put the equipment, costs, and timing together—so you can see whether a change makes sense.</p></div><div className={styles.offerGrid}><article><span>01 / YOUR WORK</span><h3>The right capabilities.</h3><p>{niche === "law" ? "We’ll look at the documents your team handles and where the current setup falls short. Then match the equipment and accessories to that work." : "We’ll look at drawing sizes, print quality, and whether your team needs scanning as well as printing."}</p></article><article><span>02 / YOUR COSTS</span><h3>The complete cost.</h3><p>Equipment, service, supplies, included pages, and overages. See what you’d be paying for before comparing proposals.</p></article><article><span>03 / YOUR NEXT STEP</span><h3>A practical changeover.</h3><p>Review the current agreement, installation needs, and who needs to be involved. Plan the change around your office.</p></article></div></section>

    <section className={styles.repSection} aria-labelledby="rep-title"><div className={styles.repPortrait}><img src="/leroy.png" alt="Real photo of Leroy at the CTWP office" loading="lazy" /><span>Leroy handles the introduction.<br />{repName} handles the conversation.</span></div><div className={styles.repIntro}><div className={styles.repBrand}><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /><span>Your local copier company<br /><small>Bryan–College Station</small></span></div><h2 id="rep-title">Meet {repName}.<br /><em>Let’s talk about your practice.</em></h2><h3 className={styles.repFocusTitle}>{niche === "law" ? repFocus.title : "Your workflow comes first."}</h3><p>{niche === "law" ? repFocus.copy : "Tell me what’s working, what isn’t, and what you’d rather spend less time on. I’ll help you make sense of the options."}</p><p className={styles.repPromise}>My focus: fewer unnecessary steps, a setup that fits, and a clear view of where you could save.</p><p className={styles.signature}>{repName}<span>Your CTWP contact · Bryan–College Station</span></p><a className={styles.textLink} href="#office-review">Start a review with {repName} <Arrow /></a><a className={styles.repOfficeLink} href={officeHref}>Call {niche === "law" ? "the Bryan office" : "CTWP"} · {officePhone}</a></div></section>

    <section className={styles.reviewSection} id="office-review" aria-labelledby="review-title">
      <div className={styles.reviewIntro}><p className={styles.eyebrow}>Your equipment review</p><h2 id="review-title">Start with<br /><em>what you know.</em></h2><p>No model numbers handy? No problem. A little about your office is enough to begin.</p><ol className={styles.howItWorks}><li>Share a few details.</li><li>{repName} reviews your needs.</li><li>Talk through suitable options.</li></ol></div>
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
            {selectField("color", niche === "law" ? "Do you need color printing?" : "How often do your drawings need color?", ["Not sure", "Often", "Sometimes", "Never"])}
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
          {step === 0 && <p className={styles.formNote}>Not sure? Continue with what you know. This form is a preview; nothing is sent.</p>}
        </> : <div className={styles.summary}>
          <p className={styles.eyebrow}>Preview complete</p><h3 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>Here’s the starting point.</h3><p>This is the information your CTWP rep would review. Nothing has been sent.</p>
          <dl><dt>{content.businessLabel}</dt><dd>{answers.business}</dd><dt>Practice / trade</dt><dd>{currentPractice}</dd><dt>Priorities</dt><dd>{selected.join(", ") || "Not sure yet"}</dd><dt>Current equipment</dt><dd>{answers.equipment}{answers.model ? ` · ${answers.model}` : ""}</dd><dt>Print workload / color</dt><dd>{answers.volume} / {answers.color}</dd>{niche === "construction" && <><dt>Drawing width</dt><dd>{answers.paper}</dd></>}<dt>Approximate cost</dt><dd>{answers.cost || "Not sure"}</dd><dt>Agreement</dt><dd>{answers.agreement}{answers.agreement === "Yes" && answers.end ? ` · ends ${answers.end}` : ""}</dd><dt>Contact</dt><dd>{answers.name}<br />{answers.contact}</dd></dl>
          <button className={styles.back} onClick={() => { setComplete(false); changeStep(2); }}>Edit my answers</button>
        </div>}
      </div>
    </section>

    <section className={styles.faq}><p className={styles.eyebrow}>A few things you might be wondering</p><h2>Before you get started.</h2><details><summary>What if we’re still in a lease?</summary><p>Include the end date if you know it. Your rep will review timing and any remaining obligations before recommending a change.</p></details><details><summary>Do I need our model number or exact page counts?</summary><p>No. Start with what you know. A photo of the equipment or a recent bill can help your rep fill in the details later.</p></details><details><summary>What happens after we share our details?</summary><p>{repName} reviews what you’ve shared, follows up on any gaps, and talks through suitable options. Equipment, availability, and pricing are confirmed before a proposal is prepared.</p></details></section>
    <footer className={styles.footer}><img src="/ctwp-mark.webp" alt="CTWP" width="105" height="60" /><p>Your neighbors in Bryan–College Station.</p><address>{OFFICE_ADDRESS}</address><a href={officeHref}>{officePhone}</a><small>{content.note}</small></footer>
  </main>;
}
