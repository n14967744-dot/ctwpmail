import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignPage } from "@/components/campaign/CampaignPage";
import { getCampaignBusiness } from "@/lib/campaign/business";
import { DEFAULT_VARIANT, VARIANTS, type Variant } from "@/lib/campaign/content";

/* One page for every business in the mail campaign.
   The slug in the address picks the business; the business's niche picks the copy and picture.
   While designs are under review, ?v=a, ?v=b or ?v=c picks the layout. */

export const metadata: Metadata = {
  title: "CTWP | Your local copier company",
  robots: { index: false, follow: false },
};

type Params = Promise<{ slug: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

async function Personal({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { slug } = await params;
  const query = await searchParams;
  const pick = (Array.isArray(query.v) ? query.v[0] : query.v ?? "").toLowerCase();
  const variant: Variant = pick in VARIANTS ? (pick as Variant) : DEFAULT_VARIANT;

  const business = await getCampaignBusiness(slug);
  if (!business) notFound();
  return <CampaignPage business={business} variant={variant} />;
}

export default function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} searchParams={searchParams} />
    </Suspense>
  );
}
