import { HelpRow, QuoteButton, QuoteDialog } from "./AccountingQuote";
import { AccountingHeader, ActionBar } from "./AccountingChrome";
import { Reveal } from "./Reveal";
import { OFFICE_ADDRESS, OFFICE_MAPS_QUERY, OFFICES, fullAddress, type Business } from "@/lib/site";
import { FEATURED, PROOF, type AccountingCopy } from "@/lib/accounting";

/* Accounting and tax preparation landing page, "focus" version: about five phone screens, one idea each.
   1. Hero: made out for the business, Leroy, what CTWP is, the quote button.
   2. The quote's first question as large rows; a row opens the pop-up at step two.
   3. The featured Kyocera and its three-tier color, shown as three printed pages.
   4. Four short benefits for an accounting or tax office's real day.
   5. Proof: since 1979, own technicians, the route map, customers, badges.
   6. Why now (tax season), the final ask, then a short footer.
   Wording is in lib/accounting.ts. The pop-up is components/AccountingQuote.tsx. */

const HERO_IMAGE = "/accounting/hero.webp";

/* The Bryan office line published on ctwp.com/bryan. */
const BRYAN_PHONE = { display: "(979) 779-2998", href: "tel:+19797792998" };

const ICONS: Record<AccountingCopy["benefits"]["items"][number]["icon"], React.ReactNode> = {
  stack: <><path d="M7 4h9l3 3v13H7z" /><path d="M4 7v14h12" /><path d="M10 11h6M10 14h6M10 17h4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /><path d="M12 14.5v2.5" /></>,
  cost: <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 9h16" /><path d="M8 13h3M8 16h3M14 13h2M14 16h2" /></>,
  season: <><rect x="4" y="5.5" width="16" height="14.5" rx="1.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /><path d="M8 14h2M12 14h2M8 17h2" /></>,
};

/** Three printed pages, from a touch of color to full color. Drawn in CSS; they print out when scrolled to. */
function ColorTiers() {
  return (
    <div className="tiers" data-reveal>
      <div className="tiersSlot" aria-hidden />
      <ol>
        {FEATURED.tiers.map((t, i) => (
          <li key={t.name} style={{ "--i": i } as React.CSSProperties}>
            <div className={`sheet sheet${i + 1}`} aria-hidden>
              <span className="ink logo" />
              {i === 2 && <span className="ink photo" />}
              <span className="ln w9" />
              <span className={`ln w7 ${i >= 1 ? "ink hl" : ""}`} />
              {i >= 1 && <span className="ink bars"><i /><i /><i /></span>}
              <span className="ln w8" />
              <span className="ln w6" />
              {i === 0 && <><span className="ln w9" /><span className="ln w5" /></>}
            </div>
            <p className="tierName">{t.name}</p>
            <p className="tierNote">{t.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AccountingLanding({ business, copy }: { business: Business; copy: AccountingCopy }) {
  const name = business.name.trim().replace(/\.$/, "");
  const start = fullAddress(business);
  const office = encodeURIComponent(OFFICE_MAPS_QUERY);
  const mapSrc = start
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(start)}&daddr=${office}&output=embed`
    : `https://maps.google.com/maps?q=${office}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1${start ? `&origin=${encodeURIComponent(start)}` : ""}&destination=${office}`;
  const [bryan, ...others] = OFFICES;

  return (
    <div id="top" className="acct">
      <AccountingHeader phone={BRYAN_PHONE} />
      <main>
        {/* 1. Hero */}
        <section id="hero" className="aHero">
          <div className="aHeroFor">
            <p className="aSmall">Prepared for</p>
            <h1>{name}</h1>
          </div>
          <figure className="aHeroPhoto">
            <img src={HERO_IMAGE} alt="Leroy, CTWP's office dog, beside a copier in an office" width={1448} height={1086} fetchPriority="high" />
            <figcaption>Leroy, our office dog</figcaption>
          </figure>
          <div className="aHeroAsk">
            <p className="aHeroStatement">{copy.hero.statement}</p>
            <div id="hero-cta">
              <QuoteButton track="Quote button (hero)" />
            </div>
            <p className="aSmall">{copy.hero.fine}</p>
          </div>
        </section>

        {/* 2. The quote's first question */}
        <section id="help" className="aSection aAsk" aria-labelledby="ask-title">
          <div className="aWrap aSplit">
            <div data-reveal>
              <p className="aKnown">{copy.ask.lead}</p>
              <h2 id="ask-title">{copy.ask.heading}</h2>
              <p className="aLead">{copy.ask.intro}</p>
            </div>
            <div className="aRows" data-reveal>
              {copy.form.help.map((o) => <HelpRow key={o} choice={o} />)}
              <noscript><p className="aLead">Call our Bryan office at <a href={BRYAN_PHONE.href}>{BRYAN_PHONE.display}</a>.</p></noscript>
            </div>
          </div>
        </section>

        {/* 3. Featured Kyocera and three-tier color */}
        <section id="kyocera" className="aSection aFeature" aria-labelledby="feature-title">
          <div className="aWrap aFeatureGrid">
            <div className="aFeatureText" data-reveal>
              <div className="aModel">
                <img src={FEATURED.image} alt={`${FEATURED.brand} ${FEATURED.model} copier`} width={FEATURED.width} height={FEATURED.height} loading="lazy" decoding="async" />
                <p><strong>{FEATURED.brand}</strong> {FEATURED.model}</p>
              </div>
              <h2 id="feature-title">{FEATURED.heading}</h2>
              <p className="aLead">{FEATURED.body}</p>
            </div>
            <ColorTiers />
          </div>
        </section>

        {/* 4. Benefits */}
        <section id="benefits" className="aSection aBenefits" aria-labelledby="benefits-title">
          <div className="aWrap">
            <h2 id="benefits-title" data-reveal>{copy.benefits.heading}</h2>
            <ul className="aList">
              {copy.benefits.items.map((b) => (
                <li key={b.title} data-reveal>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[b.icon]}</svg>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Proof */}
        <section id="proof" className="aSection aProof" aria-labelledby="proof-title">
          <div className="aWrap aProofGrid">
            <div className="aProofText" data-reveal>
              <h2 id="proof-title">{PROOF.heading}</h2>
              <p className="aLead">{PROOF.body}</p>
            </div>
            <figure className="aMap" data-reveal>
              <iframe
                src={mapSrc}
                title={start ? `Route from ${name} to CTWP in Bryan` : "CTWP office map"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <figcaption>
                <span>{start ? <>From {name} to our office at {OFFICE_ADDRESS}.</> : <>Our office at {OFFICE_ADDRESS}.</>}</span>
                <a href={directions} target="_blank" rel="noopener" data-track="Directions">Directions</a>
              </figcaption>
            </figure>
            <div className="aMarks" data-reveal>
              <p className="aSmall">{PROOF.customersLabel}</p>
              <ul className="aLogos">
                {PROOF.customers.map((c) => <li key={c.name}><img src={c.src} alt={c.name} loading="lazy" /></li>)}
              </ul>
              <p className="aSmall">{PROOF.badgesLabel}</p>
              <ul className="aBadges">
                {PROOF.badges.map((b) => <li key={b.alt}><img src={b.src} alt={b.alt} loading="lazy" /></li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Why now, and the ask */}
        <section id="quote" className="aSection aFinale" aria-labelledby="finale-title">
          <div className="aWrap aFinaleInner" data-reveal>
            <h2 id="finale-title">{copy.timing.heading}</h2>
            <p className="aLead">{copy.timing.body}</p>
            <div className="aFinaleAsk" data-bar-hide>
              <QuoteButton track="Quote button (bottom)" />
              <p className="aSmall">{copy.hero.fine} Or call <a href={BRYAN_PHONE.href} data-track="Call (closing)">{BRYAN_PHONE.display}</a>.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="aFoot" data-bar-hide>
        <div className="aWrap">
          <div className="aFootBryan">
            <p className="aFootName">CTWP Bryan</p>
            <p>{bryan.address}</p>
            <a href={`tel:${bryan.tel}`} data-track="Call Bryan (footer)">{bryan.phone}</a>
          </div>
          <p className="aSmall aFootAlso">Also in</p>
          <ul className="aFootOffices">
            {others.map((o) => (
              <li key={o.name}><span>{o.name}</span> <a href={`tel:${o.tel}`} data-track={`Call ${o.name} (footer)`}>{o.phone}</a></li>
            ))}
          </ul>
          <p className="aFootBase">
            <a href="https://www.ctwp.com/" target="_blank" rel="noopener">ctwp.com</a>
            <a href="https://www.ctwp.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
            <a href="https://www.ctwp.com/accessibility" target="_blank" rel="noopener">Accessibility</a>
            <span>© 2026 CTWP</span>
          </p>
        </div>
      </footer>

      <ActionBar />
      <QuoteDialog business={name} slug={business.slug} phone={BRYAN_PHONE} copy={copy.form} />
      <Reveal />
    </div>
  );
}
