import { LegalHero } from "@/app/law-review/LegalHero";
import { LawHeroDirections } from "./LawHeroDirections";
import styles from "./ResponsiveLegalHero.module.css";

export function ResponsiveLegalHero({ businessName = "", imageSrc, idPrefix = "law", ctaHref = "#office-review" }: { businessName?: string; imageSrc?: string; idPrefix?: string; ctaHref?: string }) {
  return <div className={styles.responsiveHero}>
    <div className={styles.mobile}><LegalHero businessName={businessName} imageSrc={imageSrc} headingId={`${idPrefix}-title`} ctaHref={ctaHref} /></div>
    <div className={styles.desktop}><LawHeroDirections direction="leroy" businessName={businessName} imageSrc={imageSrc} ctaHref={ctaHref} headingId={`${idPrefix}-desktop-title`} /></div>
  </div>;
}
