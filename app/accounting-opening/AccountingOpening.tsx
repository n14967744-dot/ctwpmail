'use client';

import { useEffect, useRef, useState } from 'react';
import s from './opening.module.css';

const needs = [
  { label: 'DOCUMENT SCANNING', title: 'Turn paper stacks into searchable files.', body: 'Receipts, statements and signed forms. Scan them into searchable PDFs and send them where your team keeps client records.', choice: 'Scanning and client documents', button: 'Talk about scanning', image: 'workflow-scanning.webp', alt: 'Client documents being loaded into a copier’s automatic document feeder' },
  { label: 'CLIENT PACKETS', title: 'Get client packets ready for the deadline.', body: 'Prepare reports and client copies with equipment sized for your busiest days. We’ll help you choose the right speed, capacity and finishing options.', choice: 'New or replacement equipment', button: 'Talk about equipment', image: 'workflow-packets.webp', alt: 'Finished financial report packets being organized beside a commercial copier' },
  { label: 'PRINTING COSTS', title: 'Know what printing really costs.', body: 'Equipment, page charges, toner and service. See the full cost of your current setup and compare options that make sense for your office.', choice: 'Reviewing printing costs', button: 'Talk about printing costs', image: 'workflow-costs.webp', alt: 'Two people comparing copier and service estimates with a calculator' },
];
const Arrow = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" /></svg>;
const Phone = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.4 3 2.2 5.1-2.2 1.8a15.5 15.5 0 0 0 6.7 6.7l1.8-2.2 5.1 2.2v3.2c0 .7-.6 1.2-1.3 1.2A16.7 16.7 0 0 1 3 4.3C3 3.6 3.5 3 4.2 3h3.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;

export default function AccountingOpening() {
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
      <a href="https://www.ctwp.com/" className={s.brand} aria-label="CTWP — Your local copier company"><img src="/ctwp-mark.webp" alt="CTWP" width="409" height="356" /><span>Your local<br />copier company.</span></a>
      <div className={s.headerRight}><span className={s.local}>Bryan–College Station</span><a href="tel:+19797792998" className={s.phone} aria-label="Call CTWP at 979 779 2998"><Phone /><span><small>Call us</small><strong>(979) 779-2998</strong></span></a></div>
    </header>

    <main id="main">
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={s.heroInner}>
          <p className={s.prepared}>Prepared for</p>
          <h1 id="hero-title">Seidel Schroeder.</h1>
          <p className={s.intro}>Less time handling paperwork.<br /><span>More time serving clients.</span></p>
        </div>
        <div className={s.heroScene}>
          <img className={s.heroImage} src="/accounting-opening/leroy-office-v2.webp" alt="Leroy in his blue bandana, standing on the office rug beside a commercial copier" width="1536" height="1024" fetchPriority="high" />
        </div>
        <div className={s.heroAction}>
          <button className={`${s.primary} ${s.heroQuote}`} onClick={() => openQuote()}>Start my quote <Arrow /></button>
          <a className={s.explore} href="#how-we-help">See how we can help <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="how-we-help" className={s.help} aria-label="Printing and scanning solutions for your accounting office">
        {needs.map((need, index) => <article className={s.solution} key={need.image} aria-labelledby={`solution-title-${index}`}>
          <div className={s.solutionHeading} data-reveal>
            <p className={s.eyebrow}>{need.label}</p>
            <h2 id={`solution-title-${index}`}>{need.title}</h2>
          </div>
          <img className={s.solutionImage} src={`/accounting-opening/${need.image}`} alt={need.alt} width="1448" height="1086" loading="lazy" decoding="async" data-reveal />
          <div className={s.solutionBody} data-reveal>
            <p>{need.body}</p>
            <button className={`${s.primary} ${s.heroQuote} ${s.solutionButton}`} onClick={() => openQuote(need.choice)}>{need.button} <Arrow /></button>
          </div>
        </article>)}
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
