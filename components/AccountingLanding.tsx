import { Header } from "./Header";
import { QuoteButton, QuoteDialog } from "./AccountingQuote";
import {
  IMAGES, OFFICE_ADDRESS, OFFICE_HOURS, OFFICE_MAPS_QUERY,
  fullAddress, type Business,
} from "@/lib/site";
import { ABOUT, CUSTOMERS, SERVICE_OPTION, type AccountingCopy } from "@/lib/accounting";

/* Accounting and tax preparation version of the landing page.
   Same design as the dentist page (components/Landing.tsx); the wording comes from lib/accounting.ts. */

const HERO_IMAGE = "/accounting/hero.webp";

/* The Bryan office line published on ctwp.com/bryan. */
const BRYAN_PHONE = { display: "(979) 779-2998", href: "tel:+19797792998" };

/* Page order: hero, how we help, About CTWP, local service, closing quote button. The footer is switched off.
   The quote form is a pop-up (components/AccountingQuote.tsx) opened by any quote button or #quote link. */
const SHOW_FOOTER = false;



const MENU: [string, string][] = [
  ["#solutions", "How we help"],
  ["#about", "About CTWP"],
  ["#service", "Local service"],
  ["#quote", "Start my quote"],
];

export function AccountingLanding({ business, copy }: { business: Business; copy: AccountingCopy }) {
  const name = business.name.trim().replace(/\.$/, "");
  const start = fullAddress(business);
  const office = encodeURIComponent(OFFICE_MAPS_QUERY);
  const mapSrc = start
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(start)}&daddr=${office}&output=embed`
    : `https://maps.google.com/maps?q=${office}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1${start ? `&origin=${encodeURIComponent(start)}` : ""}&destination=${office}`;

  return (
    <div id="top" className="acct">
      <Header links={MENU} phone={BRYAN_PHONE} quietCall />
      <main>
        <section id="hero" className="hero">
          <img src={HERO_IMAGE} alt="Leroy, CTWP's office dog, beside a copier in an office" className="heroImg" />
          <div className="heroShade" />
          <div className="heroInner">
            <p className="eyebrow">Prepared for</p>
            <h1>{name}.</h1>
            <p className="heroLead"><strong>{copy.hero.headline}</strong></p>
          </div>
          <div className="heroSpacer" />
          <div className="heroCta">
            <a href="#quote" data-track="Quote button" className="btn btnRed btnBig">{copy.hero.primary}</a>
          </div>
        </section>

        <section id="solutions" className="acctHelp">
          <div className="acctWrap">
            <div className="acctHead">
              <p className="acctKicker">{copy.help.kicker}</p>
              <h2>{copy.help.heading}</h2>
              <span className="acctRule" aria-hidden />
              <p className="acctIntro">{copy.help.intro}</p>
            </div>
          </div>
          {copy.help.items.map((it) => (
            <article key={it.title} className="acctSolution">
              <p className="acctLabel">{it.label}</p>
              <h3>{it.title}</h3>
              <img src={it.image} alt={it.alt} width={1448} height={1086} loading="lazy" decoding="async" />
              <p className="acctBody">{it.body}</p>
              <QuoteButton label={it.button} choice={it.choice} arrow className="btn btnRed btnBig acctSolutionBtn" />
            </article>
          ))}
        </section>

        <section id="about" className="about">
          <div className="aboutFlag">
            <img src="/accounting/flags.webp" alt="The Texas flag and the United States flag flying together" loading="lazy" />
          </div>
          <div className="aboutText">
            <p className="aboutKicker">{ABOUT.kicker}</p>
            <h2>{ABOUT.heading}</h2>
            <span className="aboutRule" aria-hidden />
            <p className="aboutBody">{ABOUT.body}</p>
            <p className="aboutLife">{CUSTOMERS.line}</p>
            <ul className="aboutLogos">
              {CUSTOMERS.logos.map((c) => <li key={c.name}><img src={c.src} alt={c.name} loading="lazy" /></li>)}
            </ul>
          </div>
        </section>

        <section id="service" className="acctLocal">
          <div className="acctHead">
            <h2>{copy.local.heading}</h2>
            <span className="acctRule" aria-hidden />
            <p className="acctIntro">{copy.local.body}</p>
          </div>
          <div className="acctMapWrap">
            <iframe
              src={mapSrc}
              title={start ? `Directions from ${name} to CTWP` : "CTWP office map"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="acctLocalFoot">
            <p className="acctMapLabel"><strong>CTWP</strong>{OFFICE_ADDRESS}</p>
            <a href={directions} target="_blank" rel="noopener" data-track="Directions" className="acctBtn">Get directions</a>
            <p className="acctServiceLine">{copy.local.calloutTitle} <QuoteButton label={copy.local.calloutButton} choice={SERVICE_OPTION} track="Ask about service" className="acctLink" /></p>
          </div>
        </section>

        <section id="quote" className="acctQuote">
          <div className="acctProof">
            <p>{ABOUT.badgesLabel}</p>
            <ul>
              {ABOUT.badges.map((b) => <li key={b.alt}><img src={b.src} alt={b.alt} loading="lazy" /></li>)}
            </ul>
          </div>
          <div className="acctWrap narrow">
            <h2>{copy.form.heading.replace("{business}", name)}</h2>
            <span className="acctRule center" aria-hidden />
            <p className="acctIntro center">{copy.form.intro}</p>
            <div className="acctQuoteCta">
              <QuoteButton label={copy.form.cta} arrow track="Quote button (bottom)" className="btn btnRed btnBig" />
              <p className="acctQuoteFine">{copy.form.fine}</p>
            </div>
          </div>
        </section>
      </main>

      <QuoteDialog business={name} slug={business.slug} phone={BRYAN_PHONE} copy={copy.form} />

      {SHOW_FOOTER && <footer className="footer">
        <div className="wrap">
          <img src={IMAGES.logoWide} alt="CTWP, Your Copier Company" className="footLogo" />
          <p>{OFFICE_ADDRESS}</p>
          <p><a href={BRYAN_PHONE.href} data-track="Call (footer)">{BRYAN_PHONE.display}</a> · {OFFICE_HOURS}</p>
          <p className="copy">Serving Texas offices since 1979.</p>
        </div>
      </footer>}
    </div>
  );
}
