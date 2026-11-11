import Link from "next/link";
import { PreviewForm } from "./PreviewForm";
import {
  ABOUT, BADGES, BRANDS, FORM, HELP, HERO, LEROY, LOCAL, OFFICE, ORGS, SAMPLE, TECHS, VARIANTS, type Variant,
} from "./content";
import s from "./preview.module.css";

const ICONS = {
  scan: <><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" /><path d="M8 9h8M8 12h8M8 15h5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  phone: <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" />,
};

function Icon({ name, size = 24, fill = false }: { name: keyof typeof ICONS; size?: number; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

function mapLinks(origin: string) {
  const dest = encodeURIComponent(OFFICE.mapsQuery);
  const start = encodeURIComponent(origin);
  return {
    embed: `https://maps.google.com/maps?saddr=${start}&daddr=${dest}&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${dest}`,
  };
}

/* ---------- shared pieces ---------- */

function PreviewBar({ v }: { v: Variant }) {
  return (
    <div className={s.previewBar}>
      <span>Design preview · sample business · form sends nothing</span>
      <nav aria-label="Versions">
        {(Object.keys(VARIANTS) as Variant[]).map((k) => (
          <Link key={k} href={`/preview/accounting/${k}`} className={k === v ? s.previewOn : ""} aria-current={k === v ? "page" : undefined}>
            {VARIANTS[k].label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Header() {
  return (
    <header className={s.header}>
      <div className={s.bar}>
        <a href="#top" className={s.brand} aria-label="CTWP, Your Copier Company">
          <img src="/ctwp-mark.webp" alt="" className={s.logoMark} />
          <span className={s.brandText}>Your local<br />copier company</span>
        </a>
        <a href={OFFICE.phoneHref} className={s.callPill} aria-label={`Call us at ${OFFICE.phoneDisplay}`}>
          <Icon name="phone" size={18} fill />
          <span><small>Call us</small><strong>{OFFICE.phoneDisplay}</strong></span>
        </a>
      </div>
    </header>
  );
}

function Heading({ kicker, title, sub, center = false }: { kicker?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`${s.heading} ${center ? s.center : ""}`}>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      <h2>{title}</h2>
      <span className={s.rule} aria-hidden />
      {sub && <p className={s.sub}>{sub}</p>}
    </div>
  );
}

function Marquee({ label, items, reverse = false }: { label: string; items: { src: string; name: string; wide?: boolean }[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <ul className={s.marqueeRow} aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.name} className={it.wide ? s.logoWide : ""}>
          <img src={it.src} alt={hidden ? "" : it.name} loading="lazy" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={s.marqueeBlock}>
      <h3 className={s.marqueeLabel}>{label}</h3>
      <div className={`${s.marquee} ${reverse ? s.marqueeReverse : ""}`}>
        <div className={s.marqueeTrack}>
          {row(false)}{row(true)}{row(true)}
        </div>
      </div>
    </div>
  );
}

function Stats({ dark = false, skipFirst = false }: { dark?: boolean; skipFirst?: boolean }) {
  return (
    <ul className={`${s.stats} ${dark ? s.statsDark : ""}`}>
      {ABOUT.stats.slice(skipFirst ? 1 : 0).map((st) => (
        <li key={st.label}><strong>{st.value}</strong><span>{st.label}</span></li>
      ))}
    </ul>
  );
}

function Badges() {
  return (
    <ul className={s.badges}>
      {BADGES.map((b) => (
        <li key={b.caption}>
          <span className={s.badgeImg}><img src={b.src} alt={b.alt} loading="lazy" /></span>
          <span className={s.badgeCap}>{b.caption}</span>
        </li>
      ))}
    </ul>
  );
}

function TechList() {
  return (
    <ul className={s.techList}>
      {TECHS.points.map((p) => (
        <li key={p}><span className={s.tick}><Icon name="check" size={18} /></span>{p}</li>
      ))}
    </ul>
  );
}

function MapCard() {
  const links = mapLinks(SAMPLE.address);
  return (
    <div className={s.mapCard}>
      <div className={s.mapFrame}>
        <iframe src={links.embed} title={`Directions from ${SAMPLE.name} to CTWP in Bryan`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <span className={s.distance}><Icon name="pin" size={16} />{SAMPLE.distance}</span>
      </div>
      <div className={s.mapBody}>
        <ol className={s.route}>
          <li><span>From</span><strong>{SAMPLE.name}</strong><em>{SAMPLE.address}</em></li>
          <li><span>To</span><strong>CTWP · Bryan office</strong><em>{OFFICE.address} · {OFFICE.hours}</em></li>
        </ol>
        <a href={links.directions} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnOutline} ${s.btnFull}`}>Directions from your office</a>
      </div>
    </div>
  );
}

function Team() {
  return (
    <div className={s.team}>
      <p className={s.teamLabel}>Your local team</p>
      <div className={s.people}>
        <div className={s.person}><span className={s.avatar} aria-hidden>N</span><strong>Nick</strong><em>Bryan office</em></div>
        <div className={s.person}><span className={s.avatar} aria-hidden>R</span><strong>Ryan</strong><em>Bryan office</em></div>
      </div>
      <a href={OFFICE.phoneHref} className={`${s.btn} ${s.btnNavy} ${s.btnFull}`}>Call {OFFICE.phoneDisplay}</a>
    </div>
  );
}

function Testimonial() {
  return (
    <figure className={s.quote}>
      <blockquote>“{LOCAL.quote}”</blockquote>
      <figcaption>{LOCAL.quoteBy}</figcaption>
    </figure>
  );
}

function Callout() {
  return (
    <div className={s.callout}>
      <h3>{LOCAL.callout.title}</h3>
      <p>{LOCAL.callout.body}</p>
      <a href="#quote" className={`${s.btn} ${s.btnRed}`}>{LOCAL.callout.button}</a>
    </div>
  );
}

/* ---------- sections ---------- */

function Hero({ v }: { v: Variant }) {
  const text = (
    <div className={s.heroText}>
      <p className={s.prepared}>Prepared for <strong>{SAMPLE.name}</strong></p>
      <h1>{HERO.headline}</h1>
      <p className={s.heroLead}>{HERO.lead}</p>
      <div className={s.heroCtas}>
        <a href="#quote" className={`${s.btn} ${s.btnRed} ${s.btnBig}`}>{HERO.primary}</a>
        <a href={OFFICE.phoneHref} className={s.heroLink}>{HERO.secondary} <span aria-hidden>→</span></a>
      </div>
    </div>
  );
  const image = (
    <div className={s.heroArt}>
      <img src="/preview/leroy-office.webp" alt="Leroy, CTWP’s office dog, standing beside a copier in an office" />
      {v === "a" && <p className={s.heroCaption}><strong>Meet Leroy.</strong> Your friendly introduction to CTWP.</p>}
      {v === "b" && <>
        <span className={s.heroTile}><strong>45+</strong>Years of service</span>
        <img src="/preview/badges/enx-elite-dealer-2025.jpg" alt="ENX Magazine Elite Dealer 2025" className={s.heroBadge} />
      </>}
      {v === "c" && <span className={s.heroChip}><Icon name="pin" size={16} />{SAMPLE.distance}</span>}
    </div>
  );
  return <section id="top" className={s.hero}><div className={s.heroInner}>{text}{image}</div></section>;
}

function Help({ v }: { v: Variant }) {
  return (
    <section className={`${s.section} ${s.tintA}`}>
      <div className={s.wrap}>
        <Heading kicker={HELP.kicker} title={HELP.heading} sub={HELP.intro} />
        <ol className={s.helpList}>
          {HELP.items.map((it, i) => (
            <li key={it.title} className={s.helpItem}>
              <span className={s.helpMark}>{v === "b" ? `0${i + 1}` : <Icon name={v === "c" ? "check" : it.icon} size={v === "c" ? 20 : 26} />}</span>
              <div><h3>{it.title}</h3><p>{it.body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About({ v }: { v: Variant }) {
  if (v === "c") {
    return (
      <section className={s.section}>
        <div className={s.wrap}>
          <div className={s.aboutCard}>
            <p className={s.kicker}>{ABOUT.kicker}</p>
            <h2>{ABOUT.heading}</h2>
            <p>{ABOUT.body}</p>
            <Stats dark />
            <p className={s.motto}>{ABOUT.motto}</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={s.section}>
      <div className={`${s.wrap} ${s.aboutGrid}`}>
        <div>
          <Heading kicker={ABOUT.kicker} title={ABOUT.heading} />
          <p className={s.body}>{ABOUT.body}</p>
          <p className={s.motto}>{ABOUT.motto}</p>
        </div>
        <Stats />
      </div>
    </section>
  );
}

function StatsBand() {
  return <section className={s.statsBand}><div className={s.wrap}><Stats dark skipFirst /></div></section>;
}

function Proof({ v }: { v: Variant }) {
  return (
    <section className={`${s.section} ${s.proof}`}>
      <div className={s.wrap}>
        <div className={s.proofGrid}>
          <div>
            <Heading kicker={TECHS.kicker} title={TECHS.heading} />
            <TechList />
          </div>
          <div>
            <h3 className={s.miniHead}>Recognized for it</h3>
            <Badges />
          </div>
        </div>
        {v === "b" && <p className={s.mottoBand}>{ABOUT.body} <strong>{ABOUT.motto}</strong></p>}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className={s.trust} aria-label="Recognition">
      <ul>
        {BADGES.map((b) => <li key={b.caption}><img src={b.src} alt={b.alt} /></li>)}
      </ul>
    </section>
  );
}

function Logos() {
  return (
    <section className={`${s.section} ${s.logos}`}>
      <Marquee label="Some of the organizations we serve" items={ORGS} />
      <Marquee label="Brands we carry" items={BRANDS} reverse />
    </section>
  );
}

function Local({ v }: { v: Variant }) {
  return (
    <section className={`${s.section} ${s.tintB}`}>
      <div className={s.wrap}>
        <Heading kicker={LOCAL.kicker} title={LOCAL.heading} sub={LOCAL.body} />
        <div className={s.localGrid}>
          <MapCard />
          <div className={s.localSide}>
            <Team />
            <Testimonial />
            <p className={s.affil}><img src="/preview/customers/bcs-chamber.png" alt="" />Member, B/CS Chamber of Commerce</p>
          </div>
        </div>
        {v !== "c" && <Callout />}
      </div>
    </section>
  );
}

function Leroy() {
  return (
    <section className={s.section}>
      <div className={`${s.wrap} ${s.leroy}`}>
        <img src="/leroy.png" alt="Leroy, a small black and tan dog wearing a blue bandana" loading="lazy" />
        <div><h2>{LEROY.heading}</h2><span className={s.rule} aria-hidden /><p>{LEROY.body}</p></div>
      </div>
    </section>
  );
}

function Quote({ v }: { v: Variant }) {
  return (
    <section id="quote" className={`${s.section} ${s.quoteSection}`}>
      <div className={`${s.wrap} ${s.narrow}`}>
        <Heading kicker={FORM.kicker} title={`Let’s find the right fit for ${SAMPLE.name}.`} sub={FORM.intro} />
        {v === "c" && <Callout />}
        <PreviewForm business={SAMPLE.name} />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <img src="/preview/ctwp-tagline.png" alt="CTWP, Your Copier Company" className={s.footLogo} />
        <p className={s.footLead}>Your neighbors in Bryan–College Station.</p>
        <p>{OFFICE.address}</p>
        <p><a href={OFFICE.phoneHref}>{OFFICE.phoneDisplay}</a> · {OFFICE.hours}</p>
        <p className={s.copy}>Copiers, printers and local service · Serving Texas since 1979</p>
      </div>
    </footer>
  );
}

function StickyCta() {
  return (
    <div className={s.sticky}>
      <a href="#quote" className={`${s.btn} ${s.btnRed}`}>{HERO.primary}</a>
      <a href={OFFICE.phoneHref} className={s.stickyCall} aria-label={`Call ${OFFICE.phoneDisplay}`}><Icon name="phone" size={22} fill /></a>
    </div>
  );
}

/* ---------- page ---------- */

export function Preview({ variant: v }: { variant: Variant }) {
  return (
    <div className={`${s.page} ${s[v]}`}>
      <PreviewBar v={v} />
      <Header />
      <main>
        <Hero v={v} />
        {v === "a" && <><Help v={v} /><About v={v} /><Proof v={v} /><Logos /><Local v={v} /><Leroy /><Quote v={v} /></>}
        {v === "b" && <><StatsBand /><Help v={v} /><Proof v={v} /><Logos /><Local v={v} /><Leroy /><Quote v={v} /></>}
        {v === "c" && <><TrustStrip /><Local v={v} /><Help v={v} /><About v={v} /><Logos /><Proof v={v} /><Leroy /><Quote v={v} /></>}
      </main>
      <Footer />
      {v === "c" && <StickyCta />}
    </div>
  );
}
