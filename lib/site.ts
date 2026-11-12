export const PHONE_DISPLAY = "(210) 284-3727";
export const PHONE_HREF = "tel:+12102843727";
export const OFFICE_ADDRESS = "410 E. Villa Maria Rd, Bryan, TX 77801";
export const OFFICE_MAPS_QUERY = "410 E Villa Maria Rd, Bryan, TX 77801";
export const OFFICE_HOURS = "Mon–Fri, 8am–5pm";
export const DEMO_SLUG = "universitydentalassociates";

/* Swap images here. Drop a new file in /public/dental and point to it. */
export const IMAGES = {
  hero: "/dental/hero.jpg",
  logo: "/ctwp-mark.webp",
  logoWide: "/ctwp-header-logo.png",
};

export type Business = {
  slug: string;
  name: string;
  niche: string | null;
  /** Sub-group inside the niche, e.g. "accounting" or "tax prep". Picks the wording, not the page. */
  segment?: string | null;
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

/* CTWP offices, as listed in the footer of ctwp.com (checked November 11, 2026). Bryan is the local office for these pages. */
export const OFFICES: { name: string; note?: string; address: string; phone: string; tel: string }[] = [
  { name: "Bryan", address: "410 E. Villa Maria Rd, Bryan, TX 77801", phone: "(979) 779-2998", tel: "+19797792998" },
  { name: "Waco", note: "Home office", address: "3730 Franklin Ave., Waco, TX 76710", phone: "(254) 752-0376", tel: "+12547520376" },
  { name: "San Antonio", address: "2946 NE Loop 410, San Antonio, TX 78218", phone: "(210) 590-2897", tel: "+12105902897" },
  { name: "Marble Falls", address: "903 Ave H, Marble Falls, TX 78654", phone: "(830) 693-6479", tel: "+18306936479" },
  { name: "Temple", address: "1505 W. Ave M, Temple, TX 76504", phone: "(254) 774-9667", tel: "+12547749667" },
  { name: "San Angelo", address: "1821 Industrial, San Angelo, TX 76904", phone: "(325) 658-1507", tel: "+13256581507" },
  { name: "Corsicana", note: "Copy center", address: "117 S. Beaton St., Corsicana, TX 75110", phone: "(903) 872-6657", tel: "+19038726657" },
];
