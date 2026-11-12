import { Header } from "./Header";
import { QuoteButton, QuoteDialog } from "./AccountingQuote";
import { Reveal } from "./Reveal";
import { OFFICE_ADDRESS, OFFICE_MAPS_QUERY, OFFICES, fullAddress, type Business } from "@/lib/site";
import { ABOUT, CUSTOMERS, SERVICE_OPTION, type AccountingCopy } from "@/lib/accounting";

/* Accounting and tax preparation version of the landing page.
   Same design as the dentist page (components/Landing.tsx); the wording comes from lib/accounting.ts. */

const HERO_IMAGE = "/accounting/hero.webp";

/* The Bryan office line published on ctwp.com/bryan. */
const BRYAN_PHONE = { display: "(979) 779-2998", href: "tel:+19797792998" };

/* Page order: hero, how we help, About CTWP, local service, closing quote button, footer with every office.
   Elements marked data-reveal fade up as they scroll into view (components/Reveal.tsx).
   The quote form is a pop-up (components/AccountingQuote.tsx) opened by any quote button or #quote link. */
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
            <div className="acctHead" data-reveal>
              <p className="acctKicker">{copy.help.kicker}</p>
              <h2>{copy.help.heading}</h2>
              <span className="acctRule" aria-hidden />
              <p className="acctIntro">{copy.help.intro}</p>
            </div>
          </div>
          {copy.help.items.map((it) => (
            <article key={it.title} className="acctSolution">
              <div data-reveal>
                <p className="acctLabel">{it.label}</p>
                <h3>{it.title}</h3>
              </div>
              <img src={it.image} alt={it.alt} width={1448} height={1086} loading="lazy" decoding="async" data-reveal />
              <div data-reveal>
                <p className="acctBody">{it.body}</p>
                <QuoteButton label={it.button} choice={it.choice} arrow className="btn btnRed btnBig acctSolutionBtn" />
              </div>
            </article>
          ))}
        </section>

        <section id="about" className="about">
          <div className="aboutFlag">
            <img src="/accounting/flags.webp" alt="The Texas flag and the United States flag flying together" loading="lazy" />
          </div>
          <div className="aboutText" data-reveal>
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
          <div className="acctHead" data-reveal>
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
          <div className="acctLocalFoot" data-reveal>
            <p className="acctMapLabel"><strong>CTWP</strong>{OFFICE_ADDRESS}</p>
            <a href={directions} target="_blank" rel="noopener" data-track="Directions" className="acctBtn">Get directions</a>
            <p className="acctServiceLine">{copy.local.calloutTitle} <QuoteButton label={copy.local.calloutButton} choice={SERVICE_OPTION} track="Ask about service" className="acctLink" /></p>
          </div>
        </section>

        <section id="quote" className="acctQuote">
          <div className="acctProof" data-reveal>
            <p>{ABOUT.badgesLabel}</p>
            <ul>
              {ABOUT.badges.map((b) => <li key={b.alt}><img src={b.src} alt={b.alt} loading="lazy" /></li>)}
            </ul>
          </div>
          <div className="acctWrap narrow" data-reveal>
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

      <footer className="acctFooter">
        <div className="acctFooterInner">
          <div className="acctFooterBrand">
            <img src="/ctwp-mark.webp" alt="CTWP, established 1979" width={409} height={356} loading="lazy" />
            <p>Your local copier company.</p>
          </div>
          <h2>Locations</h2>
          <ul className="acctOffices">
            {OFFICES.map((o, i) => (
              <li key={o.name} className={i === 0 ? "local" : undefined}>
                <p className="acctOfficeName">{o.name}{i === 0 ? <span>Your local office</span> : o.note ? <span>{o.note}</span> : null}</p>
                <p>{o.address}</p>
                <a href={`tel:${o.tel}`} data-track={`Call ${o.name} (footer)`}>{o.phone}</a>
              </li>
            ))}
          </ul>
          <div className="acctFooterBase">
            <p>
              <a href="https://www.ctwp.com/" target="_blank" rel="noopener">ctwp.com</a>
              <a href="https://www.ctwp.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
              <a href="https://www.ctwp.com/accessibility" target="_blank" rel="noopener">Accessibility</a>
            </p>
            <p>© 2026 CTWP. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <Reveal />
    </div>
  );
}
