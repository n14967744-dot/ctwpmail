import Link from "next/link";
import { SAMPLE_BUSINESSES } from "@/lib/campaign/business";
import { NICHES, VARIANTS, nicheKeyFor, type Variant } from "@/lib/campaign/content";
import s from "@/components/campaign/campaign.module.css";

export default function Index() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>Design preview</p>
      <h1>Campaign landing page</h1>
      <p>One page that changes with the business. Each example below is a made-up business in one niche; A, B and C are the three layouts. Real businesses open at their own address, for example <code>/their-slug</code>.</p>
      <ul>
        {SAMPLE_BUSINESSES.map((b) => {
          const c = NICHES[nicheKeyFor(b.niche, b.subgroup)];
          return (
            <li key={b.slug}>
              <div className={s.indexRow}>
                <div>
                  <strong>{c.label}</strong>
                  <span>{b.name}{c.status === "draft" ? " · draft wording" : ""}</span>
                </div>
                <nav aria-label={`${c.label} versions`}>
                  {(Object.keys(VARIANTS) as Variant[]).map((k) => (
                    <Link key={k} href={`/${b.slug}?v=${k}`}>{VARIANTS[k].label}</Link>
                  ))}
                </nav>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
