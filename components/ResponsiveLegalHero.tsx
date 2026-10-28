import { LegalHero } from "@/app/law-review/LegalHero";
import { LawHeroDirections } from "./LawHeroDirections";
import styles from "./ResponsiveLegalHero.module.css";

export function ResponsiveLegalHero({ businessName = "" }: { businessName?: string }) {
  return <div className={styles.responsiveHero}>
    <div className={styles.mobile}><LegalHero businessName={businessName} /></div>
    <div className={styles.desktop}><LawHeroDirections direction="leroy" businessName={businessName} ctaHref="#office-review" headingId="desktop-law-title" /></div>
  </div>;
}
