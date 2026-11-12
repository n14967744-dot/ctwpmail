import { Suspense } from "react";
import { headers } from "next/headers";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { AccountingLanding } from "@/components/AccountingLanding";
import { Landing } from "@/components/Landing";
import { accountingCopy } from "@/lib/accounting";
import { getBusiness, recordView } from "@/lib/leads";
import { isBotOrPrefetch, scanCount, sendAlert } from "@/lib/alert";
import type { Business } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

/** One page per niche; the segment inside a niche only changes the wording. Add new niches here. */
function NichePage({ business }: { business: Business }) {
  switch (business.niche) {
    case "accounting":
      return <AccountingLanding business={business} copy={accountingCopy(business.segment)} />;
    default:
      return <Landing business={business} />;
  }
}

async function Personal({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  const { slug } = await params;
  const query = await searchParams;
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const isQr = (value: string | string[] | undefined) => first(value).toLowerCase() === "qr";
  const source: "qr" | "direct" = isQr(query.src) || isQr(query.utm_medium) ? "qr" : "direct";
  const business = await getBusiness(slug);
  if (!business) notFound();
  const h = await headers();
  if (!isBotOrPrefetch(h)) {
    await recordView(business.slug);
    after(async () => {
      await sendAlert({
        event: "scan",
        business: business.name,
        slug: business.slug,
        source,
        scan_count: await scanCount(business.slug),
        time_iso: new Date().toISOString(),
      });
    });
  }
  return <NichePage business={business} />;
}

export default function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} searchParams={searchParams} />
    </Suspense>
  );
}
