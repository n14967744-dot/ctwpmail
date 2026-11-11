'use client';

import { useEffect, useRef, useState } from 'react';
import s from './opening.module.css';

const needs = [
  { title: 'Less sorting. Easier scanning.', short: 'Bring client records together.', body: 'Receipts, statements, signed forms. Turn the incoming stack into searchable PDFs, with scanning options that fit how your team organizes client files.', note: 'Searchable PDFs · Document intake · Scan destinations', choice: 'Scanning and client documents' },
  { title: 'Ready for the deadline.', short: 'Keep reports and client packets moving.', body: 'Print financial reports and prepare client copies with equipment sized for your workload. We’ll help you choose the speed, capacity and finishing options your office actually needs.', note: 'Client packets · Two-sided printing · Finishing options', choice: 'New or replacement equipment' },
  { title: 'Know what printing really costs.', short: 'See the full picture before you decide.', body: 'Equipment payments, page charges, toner and service all add up. We’ll help you compare the total cost and explore a setup that makes sense for your office.', note: 'Equipment · Supplies · Service', choice: 'Reviewing printing costs' },
];
const Arrow = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" /></svg>;

export default function AccountingOpening() {
  const [active, setActive] = useState<number | null>(0);
  const [choice, setChoice] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const root = useRef<HTMLDivElement>(null);
  function openQuote(value = '') { setChoice(value); setReviewing(false); modal.current?.showModal(); }

  useEffect(() => {
    const items = root.current?.querySelectorAll('[data-reveal]');
    if (!items) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-visible', 'true'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <div className={s.page} ref={root}>
    <a className={s.skip} href="#main">Skip to content</a>
    <header className={s.header}>
      <a href="https://www.ctwp.com/" className={s.brand} aria-label="CTWP — Your local copier company"><img src="/accounting-opening/ctwp-logo.png" alt="CTWP — Your Copier Company" width="400" height="80" /></a>
      <div className={s.headerRight}><span className={s.local}>Your Bryan–College Station team</span><a href="tel:+19797792998" className={s.phone}>979 779 2998 <span aria-hidden="true">↗</span></a></div>
    </header>

    <main id="main">
      <section className={s.hero} aria-labelledby="hero-title">
        <img className={s.heroImage} src="/accounting-opening/leroy-office.webp" alt="Happy Leroy, CTWP’s office dog, beside a commercial copier in an accounting-office scene" width="1536" height="1024" fetchPriority="high" />
        <div className={s.heroInner}>
          <div className={s.personalized}><p>Prepared for</p><img src="/accounting-opening/seidel-schroeder.png" alt="Seidel Schroeder" width="1800" height="600" /></div>
          <h1 id="hero-title">Less paperwork.<br /><span>More client time.</span></h1>
          <p className={s.intro}>Printing, scanning and local support.<br />Built around the way your office works.</p>
          <button className={s.primary} onClick={() => openQuote()}>Start my quote <Arrow /></button>
          <a className={s.explore} href="#how-we-help">See how we can help <span aria-hidden="true">↓</span></a>
        </div>
        <div className={s.heroCaption}><span className={s.captionLine} />A friendly introduction from Leroy.</div>
      </section>

      <section id="how-we-help" className={s.help} aria-labelledby="help-title">
        <div className={s.helpIntro} data-reveal>
          <p className={s.eyebrow}>FOR YOUR ACCOUNTING OFFICE</p>
          <h2 id="help-title">Make the<br />paperwork<br /><span>part easier.</span></h2>
          <p className={s.helpLead}>From the first client document<br />to the final report.</p>
          <a className={s.textLink} href="tel:+19797792998">Talk with our local team <Arrow /></a>
        </div>
        <div className={s.workflows} data-reveal>
          {needs.map((need, index) => <article className={`${s.workflow} ${active === index ? s.active : ''}`} key={need.title}>
            <h3><button className={s.workflowTrigger} aria-expanded={active === index} aria-controls={`workflow-${index}`} id={`trigger-${index}`} onClick={() => setActive(active === index ? null : index)}>
              <span className={s.number}>0{index + 1}</span><span>{need.title}<small>{need.short}</small></span><span className={s.plus} aria-hidden="true">{active === index ? '−' : '+'}</span>
            </button></h3>
            <div id={`workflow-${index}`} role="region" aria-labelledby={`trigger-${index}`} className={s.workflowBody} hidden={active !== index}>
              <p>{need.body}</p><p className={s.details}>{need.note}</p><button className={s.textLink} onClick={() => openQuote(need.choice)}>Let’s talk about this <Arrow /></button>
            </div>
          </article>)}
          <div className={s.existing}><p>Already have a copier you like?</p><button onClick={() => openQuote('Service for existing equipment')}>Ask us about service <Arrow /></button><small>We’ll confirm support for your make and model.</small></div>
        </div>
      </section>
    </main>

    <dialog ref={modal} className={s.dialog} aria-labelledby="quote-title" onClick={e => { if (e.target === e.currentTarget) modal.current?.close(); }}>
      <button className={s.close} aria-label="Close quote preview" onClick={() => modal.current?.close()}>×</button>
      <p className={s.eyebrow}>PREPARED FOR SEIDEL SCHROEDER</p>
      <h2 id="quote-title">{reviewing ? 'A useful place to start.' : 'What would you like to improve?'}</h2>
      {!reviewing ? <><div className={s.choices}>{['New or replacement equipment', 'Scanning and client documents', 'Reviewing printing costs', 'Service for existing equipment', 'Not sure yet'].map(value => <label key={value}><input type="radio" name="need" value={value} checked={choice === value} onChange={() => setChoice(value)} /><span>{value}</span></label>)}</div><button className={s.primary} disabled={!choice} onClick={() => setReviewing(true)}>Continue <Arrow /></button></> : <><p className={s.dialogBody}>Your interest: <strong>{choice}</strong></p><p className={s.dialogBody}>The next step will ask about timing and the best way to reach you.</p><a className={s.primary} href="tel:+19797792998">Call the Bryan team <Arrow /></a></>}
      <p className={s.previewNote}>Design preview only. Nothing is submitted or sent.</p>
    </dialog>
  </div>;
}
