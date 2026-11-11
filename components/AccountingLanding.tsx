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

/* Page order: hero, how we help, one About CTWP section, quote form.
   The local-service section and the footer are kept in this file and switched off. */
const SHOW_LOCAL = false;
const SHOW_FOOTER = false;

const MENU: [string, string][] = [
  ["#solutions", "How we help"],
  ["#about", "About CTWP"],
  ["#quote", "Start my quote"],
];

/* Photos for the three "how we help" cards, in order. Use landscape 3:2 images (1536 x 1024).
   Put each file in public/accounting/ and set its path here; null shows a placeholder box. */
const HELP_IMAGES: (string | null)[] = [null, null, null];
const HELP_IMAGE_NOTES = ["Scanning client documents", "Finished client packets", "Reviewing printing costs"];

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

        {SHOW_LOCAL && (
          <section id="service" className="section white">
            <div className="wrap">
              <p className="kicker">{copy.local.kicker}</p>
              <h2>{copy.local.heading}</h2>
              <p className="sub wide">{copy.local.body}</p>
              <div className="mapCard">
                <iframe src={mapSrc} title={start ? `Directions from ${name} to CTWP` : "CTWP office map"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="map" />
                <div className="mapBody">
                  <div className="addr"><strong>{OFFICE_ADDRESS}</strong><span>{OFFICE_HOURS}</span></div>
                  <a href={directions} target="_blank" rel="noopener" data-track="Directions" className="btn btnOutline btnFull">Get directions</a>
                </div>
              </div>
              <div className="offer">
                <p className="offerText">{copy.local.calloutTitle}<span className="offerSmall">{copy.local.calloutBody}</span></p>
                <AskServiceButton label={copy.local.calloutButton} />
              </div>
            </div>
          </section>
        )}

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
