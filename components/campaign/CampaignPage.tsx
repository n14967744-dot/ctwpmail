import { CampaignForm } from "./CampaignForm";
import { display, hand } from "./fonts";
import {
  ABOUT, BADGES, BRANDS, FORM, HERO, LEROY, LOCAL, NICHES, OFFICE, ORGS, TECHS, nicheKeyFor,
  type NicheContent,
} from "@/lib/campaign/content";
import type { CampaignBusiness } from "@/lib/campaign/business";
import s from "./campaign.module.css";

/* The landing page continues the mail piece: "Prepared for", the business name set large,
   Leroy and his commission slip, then the detail set like a letter on good paper. */

type Ctx = { b: CampaignBusiness; c: NicheContent };

const NUMERALS = ["I", "II", "III", "IV"];

/** Splits "Banks & Banks, Attorneys at Law, P.C." into the name set large and the line under it. */
function splitName(name: string): { main: string; suffix: string | null } {
  const clean = name.trim().replace(/[.,]+$/, (m) => (m.includes(".") ? "." : ""));
  const m = clean.match(/^(.*?),?\s+((?:Attorneys?(?:\s+(?:and|&)\s+Counselors)?\s+at\s+Law|Law\s+Offices?|CPAs?|P\.?L\.?L\.?C|L\.?L\.?P|L\.?L\.?C|P\.?C|Inc)\b.*)$/i);
  if (m && m[1].length >= 3) return { main: m[1].replace(/,$/, ""), suffix: m[2] };
  return { main: clean.replace(/\.$/, ""), suffix: null };
}

function mapLinks(origin: string | null) {
  const dest = encodeURIComponent(OFFICE.mapsQuery);
  const start = origin ? encodeURIComponent(origin) : "";
  return {
    embed: start
      ? `https://maps.google.com/maps?saddr=${start}&daddr=${dest}&output=embed`
      : `https://maps.google.com/maps?q=${dest}&z=15&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1${start ? `&origin=${start}` : ""}&destination=${dest}`,
  };
}

function Paw() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <ellipse cx="6" cy="10" rx="2" ry="2.6" /><ellipse cx="10" cy="6.2" rx="2" ry="2.6" /><ellipse cx="14" cy="6.2" rx="2" ry="2.6" /><ellipse cx="18" cy="10" rx="2" ry="2.6" />
      <path d="M12 11c-3 0-5.5 2.6-5.5 5 0 1.700 1.300 2.600 2.900 2.600 1 0 1.700-.5 2.600-.5s1.600.5 2.600.5c1.600 0 2.900-.9 2.900-2.600 0-2.400-2.500-5-5.500-5z" />
    </svg>
  );
}

function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`${s.label} ${light ? s.labelLight : ""}`}><span>{children}</span></p>;
}

function PreviewBar({ b, c }: Ctx) {
  const notes = ["Design preview", c.label, b.sample && "sample business", c.status === "draft" && "draft wording", "form sends nothing"].filter(Boolean);
  return <div className={s.previewBar}>{notes.join(" · ")}</div>;
}

function Masthead() {
  return (
    <header className={s.masthead}>
      <a href="#top" className={s.wordmark} aria-label="CTWP, your local copier company">
        <img src="/ctwp-mark.webp" alt="" />
        <span>Your local copier company</span>
      </a>
      <a href={OFFICE.phoneHref} className={s.mastPhone}>{OFFICE.phoneDisplay}</a>
    </header>
  );
}

function Hero({ b, c }: Ctx) {
  const { main, suffix } = splitName(b.name);
  const place = c.place.split(" ")[0];
  return (
    <section id="top" className={s.hero}>
      <div className={s.heroInner}>
        <div className={s.heroHead}>
          <Label light>Prepared for</Label>
          {b.logoUrl && <span className={s.heroLogo}><img src={b.logoUrl} alt="" /></span>}
          <h1 className={main.length > 22 ? s.nameLong : ""}>{main}</h1>
          {suffix && <p className={s.nameSuffix}>{suffix}</p>}
        </div>

        <figure className={s.plate}>
          <img src={c.hero.image} alt={c.hero.imageAlt} />
          <figcaption className={s.slip}>
            <span className={s.slipHead}><Paw />Leroy’s commission</span>
            <span className={s.slipRow}>Payment requested: <em>treats</em></span>
            <span className={s.slipRow}>Status: <em>pending</em></span>
          </figcaption>
        </figure>

        <div className={s.heroFoot}>
          <p className={s.heroLine}>{HERO.leroyLine} <em>{HERO.leroyPunch}</em></p>
          <a href="#quote" className={s.cta}>Explore your {place}’s options <span aria-hidden>→</span></a>
          <a href={OFFICE.phoneHref} className={s.heroLink}>{HERO.secondary}</a>
        </div>
      </div>
    </section>
  );
}

function Lede({ c }: Ctx) {
  return (
    <section className={s.lede}>
      <div className={s.measure}>
        <Label>{c.kicker}</Label>
        <h2>{c.hero.headline}</h2>
        <p className={s.ledeBody}>{c.hero.lead}</p>
      </div>
    </section>
  );
}

function Help({ c }: Ctx) {
  return (
    <section className={s.paper}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <h2>{c.help.heading}</h2>
          <p className={s.sectionIntro}>{c.help.intro}</p>
        </div>
        <ol className={s.articles}>
          {c.help.items.map((it, i) => (
            <li key={it.title}>
              <span className={s.numeral} aria-hidden>{NUMERALS[i]}</span>
              <div><h3>{it.title}</h3><p>{it.body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className={s.ink}>
      <div className={s.wrap}>
        <Label light>{ABOUT.kicker}</Label>
        <h2 className={s.inkTitle}>{ABOUT.heading}</h2>
        <p className={s.inkBody}>{ABOUT.body}</p>

        <dl className={s.ledger}>
          {ABOUT.stats.map((st) => (
            <div key={st.label}><dt>{st.label}</dt><dd>{st.value}</dd></div>
          ))}
        </dl>

        <div className={s.creds}>
          <div>
            <h3 className={s.inkSub}>{TECHS.heading}</h3>
            <ul className={s.ruled}>
              {TECHS.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <ul className={s.plaques}>
            {BADGES.map((bd) => (
              <li key={bd.caption}><img src={bd.src} alt={bd.alt} loading="lazy" /><span>{bd.caption}</span></li>
            ))}
          </ul>
        </div>
        <p className={s.mottoLine}>{ABOUT.motto}</p>
      </div>
    </section>
  );
}

function Marquee({ label, items, reverse = false }: { label: string; items: { src: string; name: string; wide?: boolean }[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <ul className={s.marqueeRow} aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.name} className={it.wide ? s.logoWide : ""}><img src={it.src} alt={hidden ? "" : it.name} loading="lazy" /></li>
      ))}
    </ul>
  );
  return (
    <div className={s.marqueeBlock}>
      <Label>{label}</Label>
      <div className={`${s.marquee} ${reverse ? s.marqueeReverse : ""}`}>
        <div className={s.marqueeTrack}>{row(false)}{row(true)}{row(true)}</div>
      </div>
    </div>
  );
}

function Logos() {
  return (
    <section className={s.logos}>
      <Marquee label="Some of the organizations we serve" items={ORGS} />
      <Marquee label="Brands we carry" items={BRANDS} reverse />
    </section>
  );
}

function Local({ b, c }: Ctx) {
  const links = mapLinks(b.address);
  return (
    <section className={s.paper}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <Label>{LOCAL.kicker}</Label>
          <h2>{LOCAL.heading}</h2>
          <p className={s.sectionIntro}>{LOCAL.body}</p>
        </div>

        <div className={s.localGrid}>
          <div className={s.mapPlate}>
            <iframe src={links.embed} title={b.address ? `Directions from ${b.name} to CTWP in Bryan` : "CTWP Bryan office map"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className={s.itinerary}>
            <ol>
              {b.address && <li><span>From your {c.place}</span><strong>{b.name}</strong><em>{b.address}</em></li>}
              <li><span>To ours</span><strong>CTWP · Bryan office</strong><em>{OFFICE.address}<br />{OFFICE.hours}</em></li>
            </ol>
            <a href={links.directions} target="_blank" rel="noopener noreferrer" className={s.textLink}>{b.address ? `Directions from your ${c.place}` : "Get directions"} <span aria-hidden>→</span></a>

            <div className={s.cards}>
              <div className={s.card}><span className={s.cardMono} aria-hidden>N</span><strong>Nick</strong><em>CTWP · Bryan</em></div>
              <div className={s.card}><span className={s.cardMono} aria-hidden>R</span><strong>Ryan</strong><em>CTWP · Bryan</em></div>
            </div>
            <a href={OFFICE.phoneHref} className={s.textLink}>Call {OFFICE.phoneDisplay} <span aria-hidden>→</span></a>
          </div>
        </div>

        <figure className={s.pull}>
          <blockquote>{LOCAL.quote}</blockquote>
          <figcaption>{LOCAL.quoteBy}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Leroy() {
  return (
    <section className={s.leroy}>
      <div className={s.leroyInner}>
        <figure className={s.snapshot}>
          <img src="/leroy.png" alt="Leroy, a small black and tan dog wearing a blue bandana" loading="lazy" />
          <figcaption>Leroy, on the job</figcaption>
        </figure>
        <div>
          <h2>{LEROY.heading}</h2>
          <p>{LEROY.body}</p>
        </div>
      </div>
    </section>
  );
}

function Quote({ b, c }: Ctx) {
  const { main } = splitName(b.name);
  return (
    <section id="quote" className={s.quoteSection}>
      <div className={s.sheet}>
        <Label>{FORM.kicker}</Label>
        <h2>Let’s find the right fit for {main}.</h2>
        <p className={s.sheetIntro}>{FORM.intro}</p>
        <CampaignForm business={b.name} timing={c.timing} emailHint={c.emailHint} />
        <aside className={s.aside}>
          <strong>{LOCAL.callout.title}</strong> {LOCAL.callout.body}
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <p className={s.footMark}>C T W P</p>
      <p className={s.footLead}>Your neighbors in Bryan–College Station.</p>
      <p>{OFFICE.address}</p>
      <p><a href={OFFICE.phoneHref}>{OFFICE.phoneDisplay}</a> · {OFFICE.hours}</p>
      <p className={s.copy}>Copiers, printers and local service · Est. 1979</p>
    </footer>
  );
}

export function CampaignPage({ business: b }: { business: CampaignBusiness }) {
  const c: NicheContent = NICHES[nicheKeyFor(b.niche, b.subgroup)];
  const ctx: Ctx = { b, c };
  return (
    <div className={`${s.page} ${display.variable} ${hand.variable}`}>
      <PreviewBar {...ctx} />
      <Masthead />
      <main>
        <Hero {...ctx} />
        <Lede {...ctx} />
        <Help {...ctx} />
        <Credentials />
        <Logos />
        <Local {...ctx} />
        <Leroy />
        <Quote {...ctx} />
      </main>
      <Footer />
    </div>
  );
}
