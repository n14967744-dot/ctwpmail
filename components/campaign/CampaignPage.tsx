import { Header } from "@/components/Header";
import { CampaignForm } from "./CampaignForm";
import {
  ABOUT, BADGES, BRANDS, FORM, HERO, LEROY, LOCAL, NICHES, OFFICE, ORGS, TECHS, nicheKeyFor,
  type NicheContent,
} from "@/lib/campaign/content";
import type { CampaignBusiness } from "@/lib/campaign/business";
import { possessive, shortName } from "@/lib/site";
import s from "./campaign.module.css";

/* CTWP's own colors from the logo (navy, red, white, black), the Texas flag's star and stripes,
   photos from ctwp.com, and the navy-to-red rule CTWP uses under its headings. */

type Ctx = { b: CampaignBusiness; c: NicheContent };

const WORK_PHOTOS = ["/preview/photos/work-1.webp", "/preview/photos/work-2.webp", "/preview/photos/work-3.webp"];

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

function Star({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4l-6.2 3.7 1.6-7L2 9.3l7.1-.7z" />
    </svg>
  );
}

/** Heading with CTWP's navy-to-red rule under it. */
function Title({ kicker, children, light = false, center = false }: { kicker?: string; children: React.ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div className={`${s.title} ${light ? s.titleLight : ""} ${center ? s.titleCenter : ""}`}>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      <h2>{children}</h2>
      <span className={s.rule} aria-hidden />
    </div>
  );
}

function PreviewBar({ b, c }: Ctx) {
  const notes = ["Design preview", c.label, b.sample && "sample business", c.status === "draft" && "draft wording", "form sends nothing"].filter(Boolean);
  return <div className={s.previewBar}>{notes.join(" · ")}</div>;
}

/* ---------- first half: hero and how we help ---------- */

function Hero({ b, c }: Ctx) {
  const name = b.name.trim().replace(/\.$/, "");
  return (
    <section id="hero" className={s.hero}>
      <svg className={s.heroStar} viewBox="0 0 24 24" aria-hidden><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4l-6.2 3.7 1.6-7L2 9.3l7.1-.7z" /></svg>
      <span className={s.heroBand} aria-hidden />
      <div className={s.heroInner}>
        <div className={s.heroText}>
          <p className={s.tag}><Star size={14} />{HERO.eyebrow}</p>
          {b.logoUrl && <span className={s.heroLogo}><img src={b.logoUrl} alt="" /></span>}
          <h1 className={name.length > 24 ? s.nameLong : ""}>{name}.</h1>
          <p className={s.heroLead}>{c.hero.headline}</p>
          <div className={s.heroCtas}>
            <a href="#quote" className={s.heroBtn}>Start {possessive(shortName(name))} quote <span aria-hidden>→</span></a>
            <p className={s.heroNote}><Star size={13} />Free quote within 24 hours</p>
          </div>
        </div>

        <figure className={s.heroArt}>
          <img src={c.hero.image} alt={c.hero.imageAlt} className={s.heroPhoto} />
          <img src="/preview/badges/enx-elite-dealer-2025.jpg" alt="ENX Magazine Elite Dealer 2025" className={s.heroBadge} />
          <figcaption className={s.heroTile}><strong>45+</strong>years serving Texas</figcaption>
        </figure>
      </div>
      <ul className={s.heroFacts}>
        <li>In Bryan since 1979</li>
        <li>7 Texas locations</li>
        <li>Factory-trained technicians</li>
      </ul>
    </section>
  );
}

function Help({ c }: Ctx) {
  return (
    <section id="solutions" className={s.section}>
      <div className={s.wrap}>
        <div className={s.helpHead}>
          <Title kicker={c.kicker}>{c.help.heading}</Title>
          <p className={s.intro}>{c.hero.lead}</p>
        </div>
        <ol className={s.work}>
          {c.help.items.map((it, i) => (
            <li key={it.title}>
              <figure>
                <img src={WORK_PHOTOS[i]} alt="" loading="lazy" />
                <span className={s.workNo} aria-hidden>0{i + 1}</span>
                <figcaption><h3>{it.title}</h3></figcaption>
              </figure>
              <p>{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- second half: parked while the first half is being designed ---------- */

const SHOW_SECOND_HALF = false;

function Texas() {
  return (
    <section className={s.texas}>
      <img src="/preview/photos/flags.webp" alt="The Texas flag and the United States flag flying together" className={s.texasImg} loading="lazy" />
      <div className={s.texasShade} />
      <div className={`${s.wrap} ${s.texasInner}`}>
        <img src="/preview/badges/enx-elite-dealer-2025.jpg" alt="ENX Magazine Elite Dealer 2025" className={s.texasBadge} loading="lazy" />
        <Title kicker={ABOUT.kicker} light>{ABOUT.heading}</Title>
        <p className={s.texasBody}>{ABOUT.body}</p>
        <ul className={s.stats}>
          {ABOUT.stats.map((st) => <li key={st.label}><strong>{st.value}</strong><span>{st.label}</span></li>)}
        </ul>
        <p className={s.motto}><Star size={16} />{ABOUT.motto}</p>
      </div>
    </section>
  );
}

function Service() {
  return (
    <section id="service" className={s.section}>
      <div className={`${s.wrap} ${s.split}`}>
        <figure className={s.photoFrame}>
          <img src="/preview/photos/technician.webp" alt="A CTWP technician servicing a copier" loading="lazy" />
          <figcaption><strong>20+</strong>years with CTWP for many of our techs</figcaption>
        </figure>
        <div>
          <Title kicker={TECHS.kicker}>{TECHS.heading}</Title>
          <ul className={s.stars}>
            {TECHS.points.map((p) => <li key={p}><Star />{p}</li>)}
          </ul>
        </div>
      </div>
      <div className={s.wrap}>
        <ul className={s.badges}>
          {BADGES.map((bd) => (
            <li key={bd.caption}><img src={bd.src} alt={bd.alt} loading="lazy" /><span>{bd.caption}</span></li>
          ))}
        </ul>
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
      <p className={s.marqueeLabel}>{label}</p>
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
      <div className={s.lineup}><img src="/preview/photos/lineup.webp" alt="A wide-format printer, a multifunction copier and a desktop printer" loading="lazy" /></div>
      <Marquee label="Brands we carry" items={BRANDS} reverse />
    </section>
  );
}

function Local({ b, c }: Ctx) {
  const links = mapLinks(b.address);
  return (
    <section id="rep" className={s.local}>
      <div className={s.wrap}>
        <Title kicker={LOCAL.kicker} light>{LOCAL.heading}</Title>
        <p className={s.localBody}>{LOCAL.body}</p>

        <div className={s.mapCard}>
          <iframe src={links.embed} title={b.address ? `Directions from ${b.name} to CTWP in Bryan` : "CTWP Bryan office map"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className={s.mapBody}>
            <ol className={s.route}>
              {b.address && <li><span>From your {c.place}</span><strong>{b.name}</strong><em>{b.address}</em></li>}
              <li><span>To ours</span><strong>CTWP · Bryan office</strong><em>{OFFICE.address} · {OFFICE.hours}</em></li>
            </ol>
            <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn btnOutline btnFull">{b.address ? `Directions from your ${c.place}` : "Get directions"}</a>
          </div>
        </div>

        <div className={s.localRow}>
          <div className={s.team}>
            <p className={s.teamLabel}>Your local team</p>
            <div className={s.people}>
              <div><span aria-hidden>N</span><strong>Nick</strong></div>
              <div><span aria-hidden>R</span><strong>Ryan</strong></div>
            </div>
            <a href={OFFICE.phoneHref} className="btn btnRed btnFull">Call {OFFICE.phoneDisplay}</a>
          </div>
          <figure className={s.quote}>
            <blockquote>{LOCAL.quote}</blockquote>
            <figcaption>{LOCAL.quoteBy}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Leroy() {
  return (
    <section className={s.leroy}>
      <div className={`${s.wrap} ${s.split}`}>
        <figure className={s.leroyPhoto}>
          <img src="/preview/photos/leroy-at-ctwp.webp" alt="Leroy, in a gold bow tie, sitting on a copier at the CTWP office" loading="lazy" />
        </figure>
        <div>
          <Title kicker="The office dog">{LEROY.heading}</Title>
          <p className={s.intro}>{LEROY.body}</p>
        </div>
      </div>
    </section>
  );
}

function Quote({ b, c }: Ctx) {
  const name = b.name.trim().replace(/\.$/, "");
  return (
    <section id="quote" className={s.quoteSection}>
      <span className={s.stripe} aria-hidden />
      <div className={`${s.wrap} ${s.narrow}`}>
        <Title kicker={FORM.kicker} center>Let’s find the right fit for {name}.</Title>
        <p className={`${s.intro} ${s.introCenter}`}>{FORM.intro}</p>
        <CampaignForm business={b.name} timing={c.timing} emailHint={c.emailHint} />
        <aside className={s.callout}>
          <strong>{LOCAL.callout.title}</strong>
          <span>{LOCAL.callout.body}</span>
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <span className={s.stripe} aria-hidden />
      <img src="/preview/ctwp-tagline.png" alt="CTWP, Your Copier Company" className={s.footLogo} />
      <p className={s.footLead}>Your neighbors in Bryan–College Station.</p>
      <p>{OFFICE.address}</p>
      <p><a href={OFFICE.phoneHref}>{OFFICE.phoneDisplay}</a> · {OFFICE.hours}</p>
      <p className={s.copy}>Copiers, printers and local service · Serving Texas since 1979</p>
    </footer>
  );
}

export function CampaignPage({ business: b }: { business: CampaignBusiness }) {
  const c: NicheContent = NICHES[nicheKeyFor(b.niche, b.subgroup)];
  const ctx: Ctx = { b, c };
  return (
    <div id="top" className={s.page}>
      <PreviewBar {...ctx} />
      <Header />
      <main>
        <Hero {...ctx} />
        <Help {...ctx} />
        {SHOW_SECOND_HALF && <><Texas /><Service /><Logos /><Local {...ctx} /><Leroy /></>}
        <Quote {...ctx} />
      </main>
      <Footer />
    </div>
  );
}
