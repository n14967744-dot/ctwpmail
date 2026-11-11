import { Header } from "./Header";
import { AccountingQuoteForm, AskServiceButton } from "./AccountingQuoteForm";
import {
  IMAGES, OFFICE_ADDRESS, OFFICE_HOURS, OFFICE_MAPS_QUERY,
  fullAddress, type Business,
} from "@/lib/site";
import { ABOUT, CUSTOMERS, type AccountingCopy } from "@/lib/accounting";

/* Accounting and tax preparation version of the landing page.
   Same design as the dentist page (components/Landing.tsx); the wording comes from lib/accounting.ts. */

const HERO_IMAGE = "/accounting/hero.webp";

/* The Bryan office line published on ctwp.com/bryan. */
const BRYAN_PHONE = { display: "(979) 779-2998", href: "tel:+19797792998" };

/* Page order: hero, how we help, About CTWP, local service, quote form. The footer is switched off. */
const SHOW_FOOTER = false;

/** Driving distance from the business to the CTWP office. Worked out once per business and stored;
    the review pages pass a sample. Without it the section falls back to a general heading. */
export type Travel = { miles: string; minutes: string };

const MENU: [string, string][] = [
  ["#solutions", "How we help"],
  ["#about", "About CTWP"],
  ["#service", "Local service"],
  ["#quote", "Start my quote"],
];

/* Photos for the three "how we help" cards, in order. Use landscape 3:2 images (1536 x 1024).
   Put each file in public/accounting/ and set its path here; null shows a placeholder box. */
const HELP_IMAGES: (string | null)[] = [null, null, null];
const HELP_IMAGE_NOTES = ["Scanning client documents", "Finished client packets", "Reviewing printing costs"];

export function AccountingLanding({ business, copy, travel }: { business: Business; copy: AccountingCopy; travel?: Travel }) {
  const name = business.name.trim().replace(/\.$/, "");
  const start = fullAddress(business);
  const office = encodeURIComponent(OFFICE_MAPS_QUERY);
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
            <ol className="acctCards">
              {copy.help.items.map((it, i) => (
                <li key={it.title}>
                  <figure className="acctPhoto">
                    {HELP_IMAGES[i]
                      ? <img src={HELP_IMAGES[i] as string} alt="" loading="lazy" />
                      : <div className="acctPh"><strong>Image {i + 1} goes here</strong><span>{HELP_IMAGE_NOTES[i]}</span><span>1536 × 1024</span></div>}
                  </figure>
                  <p className="acctNo" aria-hidden>0{i + 1}</p>
                  <h3>{it.title}</h3>
                  <p className="acctBody">{it.body}</p>
                </li>
              ))}
            </ol>
          </div>
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
          <div className="acctWrap">
            <div className="acctHead">
              <p className="acctKicker">{copy.local.kicker}</p>
              {travel ? (
                <h2><span className="acctMiles">{travel.miles} miles</span> from your office.</h2>
              ) : (
                <h2>{copy.local.heading}</h2>
              )}
              <span className="acctRule" aria-hidden />
              <p className="acctIntro">
                {travel ? `About ${travel.minutes} minutes from ${name} to our door. ` : ""}{copy.local.visit}
              </p>
            </div>

            <div className="acctLocalGrid">
              <figure className="acctMap">
                {/* Stand-in route graphic. To be replaced by a real map image for each business. */}
                <svg viewBox="0 0 360 250" role="img" aria-label={`Route from ${name} to the CTWP office in Bryan`}>
                  <rect width="360" height="250" fill="#002454" />
                  <g stroke="#fff" strokeOpacity=".09" strokeWidth="10" strokeLinecap="round">
                    <path d="M-10 60 L370 28" /><path d="M-10 150 L370 118" /><path d="M-10 236 L370 204" />
                    <path d="M52 -10 L74 260" /><path d="M150 -10 L172 260" /><path d="M252 -10 L274 260" /><path d="M330 -10 L352 260" />
                  </g>
                  <g stroke="#fff" strokeOpacity=".06" strokeWidth="4">
                    <path d="M-10 104 L370 72" /><path d="M-10 194 L370 162" /><path d="M100 -10 L122 260" /><path d="M202 -10 L224 260" />
                  </g>
                  <path d="M66 198 L160 190 L154 122 L262 113 L257 58 L300 54" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M66 198 L160 190 L154 122 L262 113 L257 58 L300 54" fill="none" stroke="#b41830" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="66" cy="198" r="11" fill="#fff" /><circle cx="66" cy="198" r="5" fill="#002454" />
                  <path d="M300 56 C286 38 282 30 282 22 a18 18 0 0 1 36 0 C318 30 314 38 300 56z" fill="#b41830" stroke="#fff" strokeWidth="2.5" />
                  <path d="M300 11.5l2.8 6 6.6.7-5 4.4 1.5 6.4-5.900-3.400-5.900 3.400 1.500-6.400-5-4.400 6.600-.7z" fill="#fff" />
                </svg>
                <span className="acctTag you">Your office</span>
                <span className="acctTag us">CTWP</span>
                {travel && <span className="acctChip">{travel.miles} mi · {travel.minutes} min</span>}
              </figure>

              <div className="acctVisit">
                <ol className="acctRoute">
                  {start && <li><span>From</span><strong>{name}</strong><em>{start}</em></li>}
                  <li><span>To</span><strong>CTWP · Bryan office</strong><em>{OFFICE_ADDRESS}</em><em>{OFFICE_HOURS} · walk-ins welcome</em></li>
                </ol>
                <a href={directions} target="_blank" rel="noopener" data-track="Directions" className="acctBtn">Get directions</a>
              </div>
            </div>

            <aside className="acctService">
              <div>
                <h3>{copy.local.calloutTitle}</h3>
                <p>{copy.local.calloutBody}</p>
              </div>
              <AskServiceButton label={copy.local.calloutButton} className="acctBtn solid" />
            </aside>
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
            <AccountingQuoteForm business={name} copy={copy.form} />
          </div>
        </section>
      </main>

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
