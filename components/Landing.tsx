import { Header } from "./Header";
import { QuoteForm } from "./QuoteForm";
import { ServiceButton } from "./ServiceButton";
import {
  IMAGES, OFFICE_ADDRESS, OFFICE_HOURS, OFFICE_MAPS_QUERY, PHONE_DISPLAY, PHONE_HREF,
  fullAddress, possessive, shortName, type Business,
} from "@/lib/site";

const I = {
  card: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M7 10h6M7 14h4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 018 0v2.5" /><path d="M12 14.5v2.5" /></>,
  folder: <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M12 10.5v5M9.5 13l2.5 2.5 2.5-2.5" /></>,
  packet: <><path d="M7 3h8l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path d="M15 3v4h4M9 12h6M9 16h6" /></>,
  color: <><circle cx="9" cy="10" r="5" /><circle cx="15" cy="10" r="5" /><circle cx="12" cy="15" r="5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5.5 5.5" /></>,
};

const FEATURES: [keyof typeof I, string, string, string][] = [
  ["card", "Insurance cards, front and back, in one scan", "Lay the card on the glass and get both sides on a single page, ready for the chart.", "Your front desk checks patients in faster, and every card copy comes out clean and readable."],
  ["lock", "Patient privacy built into every print job", "Sensitive documents stay in the queue until you sign in at the machine to release them.", "Charts, statements and lab results never sit in the tray where a passing patient could see them."],
  ["folder", "Scans that file themselves", "Set up a one-touch button for each form type and the copier sends the scan straight to the right folder, already named.", "Your team spends that time with patients, not sorting files on a computer."],
  ["packet", "Patient packets ready at the front desk", "Print intake forms two-sided, collated and stapled right next to the check-in window.", "Every new patient gets a neat, professional packet the moment they walk in."],
  ["color", "Color where it counts, black and white everywhere else", "Use color for treatment plans, smile photos and marketing pieces, and set everyday forms to print in black and white automatically.", "Your monthly bill tracks what your office actually prints."],
  ["search", "Find any form in seconds", "Search past scans by patient name or date and pull up the right document right away.", "Old consent forms and insurance records are always a quick search away."],
];

function Icon({ name }: { name: keyof typeof I }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {I[name]}
    </svg>
  );
}

export function Landing({ business }: { business: Business }) {
  const name = business.name.trim();
  const short = shortName(name);
  const start = fullAddress(business);
  const office = encodeURIComponent(OFFICE_MAPS_QUERY);
  const mapSrc = start
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(start)}&daddr=${office}&output=embed`
    : `https://maps.google.com/maps?q=${office}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1${start ? `&origin=${encodeURIComponent(start)}` : ""}&destination=${office}`;

  return (
    <div id="top">
      <Header />
      <main>
        <section id="hero" className="hero">
          <img src={IMAGES.hero} alt={`Leroy, CTWP's office dog, in a white coat beside a Konica Minolta bizhub copier`} className="heroImg" />
          <div className="heroShade" />
          <div className="heroInner">
            <p className="eyebrow">Leroy stopped by</p>
            <h1>{name.replace(/\.$/, "")}.</h1>
            <p className="heroLead">CTWP has helped dental offices across Texas since 1979. Here&rsquo;s what we can do for yours.</p>
            <a href="#quote" className="btn btnRed btnBig">Start {possessive(short)} quote</a>
          </div>
          <div className="heroSpacer" />
        </section>

        <section id="solutions" className="section cream">
          <div className="wrap">
            <p className="kicker">For dental offices</p>
            <h2>Dental offices overpay for printing. Yours won&rsquo;t.</h2>
            <p className="sub">We set up a system around how your practice actually works, at a fair price, with local techs a phone call away.</p>
            <div className="cards">
              {FEATURES.map(([icon, title, a, b]) => (
                <article key={title} className="card">
                  <span className="cardIcon"><Icon name={icon} /></span>
                  <h3>{title}</h3>
                  <p>{a} {b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="service" className="section white">
          <div className="wrap">
            <p className="kicker">Right here in Bryan</p>
            <h2>Local service, real people.</h2>
            <p className="sub">Our own technicians are right here in Bryan. When your copier jams, you call us and someone actually shows up.</p>

            <div className="mapCard">
              <iframe
                src={mapSrc}
                title={start ? `Directions from ${name} to CTWP` : "CTWP office map"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map"
              />
              <div className="mapBody">
                <p className="visit">Stop by anytime. See the copiers in person and meet the techs and reps who&rsquo;ll take care of you.</p>
                <div className="addr">
                  <strong>{OFFICE_ADDRESS}</strong>
                  <span>{OFFICE_HOURS}</span>
                </div>
                <a href={directions} target="_blank" rel="noopener" className="btn btnOutline btnFull">Get directions</a>
              </div>
            </div>

            <div className="offer">
              <p className="offerTag">Service plan</p>
              <p className="offerText">Already have a copier? We&rsquo;ll service it for $30/month, even if you didn&rsquo;t get it from us and even if you&rsquo;re not on a lease.</p>
              <ServiceButton />
            </div>
          </div>
        </section>

        <section id="rep" className="section cream tight">
          <div className="wrap">
            <div className="rep">
              <div className="repPhoto" aria-hidden>R</div>
              <div className="repInfo">
                <p className="repLabel">Your local rep</p>
                <p className="repName">Ryan</p>
                <p className="repAddr">410 E. Villa Maria Rd<br />Bryan, TX 77801</p>
              </div>
            </div>
            <a href={PHONE_HREF} className="btn btnNavy btnFull btnBig">Call Ryan · {PHONE_DISPLAY}</a>
          </div>
        </section>

        <section id="quote" className="section white">
          <div className="wrap narrow">
            <p className="kicker">Free, no-pressure review</p>
            <h2>Let&rsquo;s see what could work better for {name.replace(/\.$/, "")}.</h2>
            <p className="sub">A few quick taps. No right or wrong answers.</p>
            <QuoteForm business={name} slug={business.slug} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <img src={IMAGES.logoWide} alt="CTWP, Your Copier Company" className="footLogo" />
          <p>{OFFICE_ADDRESS}</p>
          <p><a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · {OFFICE_HOURS}</p>
          <p className="copy">Serving Texas offices since 1979.</p>
        </div>
      </footer>
    </div>
  );
}
