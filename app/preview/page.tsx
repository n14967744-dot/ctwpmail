import Link from "next/link";
import { SAMPLE_BUSINESSES } from "@/lib/campaign/business";
import { NICHES, nicheKeyFor } from "@/lib/campaign/content";
import s from "@/components/campaign/campaign.module.css";

export default function Index() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>Design preview</p>
      <h1>Campaign landing page</h1>
      <p>One page that changes with the business. Each example below is a made-up business in one niche. Real businesses open at their own address, for example <code>/their-slug</code>.</p>
      <ul>
        {SAMPLE_BUSINESSES.map((b) => {
          const c = NICHES[nicheKeyFor(b.niche, b.subgroup)];
          return (
            <li key={b.slug}>
              <Link href={`/${b.slug}`} className={s.indexRow}>
                <strong>{c.label}</strong>
                <span>{b.name}{c.status === "draft" ? " · draft wording" : ""}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
