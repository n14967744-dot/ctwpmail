import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignPage } from "@/components/campaign/CampaignPage";
import { getCampaignBusiness } from "@/lib/campaign/business";

/* One page for every business in the mail campaign.
   The slug in the address picks the business; the business's niche picks the wording and picture. */

export const metadata: Metadata = {
  title: "CTWP | Your local copier company",
  robots: { index: false, follow: false },
};

type Params = Promise<{ slug: string }>;

async function Personal({ params }: { params: Params }) {
  const { slug } = await params;
  const business = await getCampaignBusiness(slug);
  if (!business) notFound();
  return <CampaignPage business={business} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} />
    </Suspense>
  );
}
