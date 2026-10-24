import type { Metadata } from "next";
import { CurrentHero } from "@/components/hero/CurrentHero";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { IMAGES, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import styles from "../../review.module.css";

export const metadata: Metadata = { title: "CTWP | Hero preview", robots: { index: false, follow: false } };
export function generateStaticParams() { return ["a", "b", "c", "d", "current"].map((variant) => ({ variant })); }

export default async function Page({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const heroOnly = variant === "current";
  if (!["a", "b", "c", "d", "current"].includes(variant)) notFound();
  if (heroOnly) return <CurrentHero />;
  return (
    <div id="top" className={`${styles.preview} ${styles[heroOnly ? "d" : variant]}`}>
      <div className={styles.originalHeader}><Header /></div>
      <main>
        <section id="hero" className={`hero ${styles.hero}`}>
          <img src={IMAGES.hero} alt="Leroy in a white coat beside a Konica Minolta copier in a dental office" className="heroImg" fetchPriority="high" />
          <div className="heroShade" />
          {variant !== "a" && <header className={styles.overlayHeader}>
            <a href="#top" className={styles.brand} aria-label="CTWP home"><img src={IMAGES.logo} alt="CTWP, est. 1979" /></a>
            <a href={PHONE_HREF} className={styles.phone}>Call us <strong>{PHONE_DISPLAY}</strong></a>
          </header>}
          <div className="heroInner">
            <p className="eyebrow">Leroy stopped by</p>
            <h1>University Dental Associates.</h1>
            <p className="heroLead">CTWP has helped dental offices across Texas since 1979. Here&rsquo;s what we can do for yours.</p>
            <a href={heroOnly ? "/universitydentalassociates#quote" : "#quote"} target={heroOnly ? "_top" : undefined} className="btn btnRed btnBig">Start University Dental&rsquo;s quote</a>
          </div>
          <div className="heroSpacer" />
        </section>
        {!heroOnly && <>
        <section className="section cream" id="solutions"><div className="wrap">
          <p className="kicker">For dental offices</p>
          <h2>Dental offices overpay for printing. Yours won&rsquo;t.</h2>
          <p className="sub">We set up a system around how your practice actually works, at a fair price, with local techs a phone call away.</p>
        </div></section>
        <section id="quote" className={`section white ${styles.quotePreview}`}><div className="wrap narrow">
          <p className="kicker">Layout preview</p>
          <h2>This is where the quote section continues.</h2>
          <p className="sub">This review is focused on the hero. The customer page keeps its existing quote form.</p>
          <a className="btn btnNavy" href="/universitydentalassociates#quote" target="_blank" rel="noopener">View the current quote form ↗</a>
        </div></section>
        </>}
      </main>
    </div>
  );
}
