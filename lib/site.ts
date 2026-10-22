export const PHONE_DISPLAY = "(210) 284-3727";
export const PHONE_HREF = "tel:+12102843727";
export const OFFICE_ADDRESS = "410 E. Villa Maria Rd, Bryan, TX 77801";
export const OFFICE_MAPS_QUERY = "410 E Villa Maria Rd, Bryan, TX 77801";
export const OFFICE_HOURS = "Mon–Fri, 8am–5pm";
export const DEMO_SLUG = "universitydentalassociates";

/* Swap images here. Drop a new file in /public/dental and point to it. */
export const IMAGES = {
  hero: "/dental/hero.jpg",
  parallax: "/dental/leroy-parallax.jpg",
  logo: "/ctwp-mark.webp",
  logoWide: "/ctwp-header-logo.png",
};

export type Business = {
  slug: string;
  name: string;
  niche: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
};

export const DEMO_BUSINESS: Business = {
  slug: DEMO_SLUG,
  name: "University Dental Associates",
  niche: "dental",
  address: "4011 S Texas Ave",
  city: "Bryan",
  zip: "77802",
};

export function shortName(name: string): string {
  const words = name.replace(/[.,]+$/, "").split(/\s+/).filter(Boolean);
  const two = words.slice(0, 2).join(" ").replace(/[,\-–:&]+$/, "").trim();
  return two || name;
}

export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export function fullAddress(b: Business): string | null {
  if (!b.address) return null;
  return [b.address, b.city, b.city || b.zip ? `TX ${b.zip ?? ""}`.trim() : null]
    .filter(Boolean)
    .join(", ");
}
