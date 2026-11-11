import "server-only";
import { rest } from "@/lib/supabase";

/* The fields a landing page is allowed to show. Nothing else from the business record reaches the browser. */
export type CampaignBusiness = {
  slug: string;
  name: string;
  niche: string | null;
  subgroup: string | null;
  address: string | null;
  logoUrl: string | null;
  /** True for the made-up businesses used to review designs. */
  sample?: boolean;
};

/* Made-up businesses, one per kind of page, for reviewing designs without real prospect data. */
export const SAMPLE_BUSINESSES: CampaignBusiness[] = [
  { slug: "example-accounting-group", name: "Example Accounting Group", niche: "accounting_tax", subgroup: "Accounting", address: "3000 Briarcrest Dr, Bryan, TX 77802", logoUrl: null, sample: true },
  { slug: "example-tax-service", name: "Example Tax Service", niche: "accounting_tax", subgroup: "Tax preparation", address: "2501 S Texas Ave, College Station, TX 77840", logoUrl: null, sample: true },
  { slug: "example-law-firm", name: "Example & Example, Attorneys at Law", niche: "legal", subgroup: "Law firms", address: "300 W 26th St, Bryan, TX 77803", logoUrl: null, sample: true },
  { slug: "example-family-dental", name: "Example Family Dental", niche: "dentists", subgroup: "General & family dentistry", address: "1605 Rock Prairie Rd, College Station, TX 77845", logoUrl: null, sample: true },
  { slug: "example-family-clinic", name: "Example Family Clinic", niche: "healthcare", subgroup: "Healthcare practices & clinics", address: "2700 E 29th St, Bryan, TX 77802", logoUrl: null, sample: true },
  { slug: "example-community-church", name: "Example Community Church", niche: "churches", subgroup: "Churches & ministries", address: "1100 Carter Creek Pkwy, Bryan, TX 77802", logoUrl: null, sample: true },
  { slug: "example-builders", name: "Example Builders, Inc.", niche: "construction", subgroup: "Builders & general contractors", address: "1700 Finfeather Rd, Bryan, TX 77803", logoUrl: null, sample: true },
];

type Row = { slug: string; name: string; niche: string | null; subgroup: string | null; address: string | null; logo_url: string | null };

export function cleanSlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 160);
}

/**
 * Looks a business up by the slug in its mail piece.
 * Reads through the database function public.campaign_business, which returns selected businesses only
 * and only the display fields above. Falls back to the sample businesses when the database is not
 * configured or has no match, so design previews always work.
 */
export async function getCampaignBusiness(slug: string): Promise<CampaignBusiness | null> {
  const clean = cleanSlug(slug);
  if (!clean) return null;

  const res = await rest("rpc/campaign_business", { method: "POST", body: JSON.stringify({ p_slug: clean }) });
  if (res?.ok) {
    const rows = (await res.json().catch(() => [])) as Row[] | Row;
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (row?.slug && row?.name) {
      return { slug: row.slug, name: row.name, niche: row.niche, subgroup: row.subgroup, address: row.address, logoUrl: row.logo_url };
    }
  }
  return SAMPLE_BUSINESSES.find((b) => b.slug === clean) ?? null;
}
