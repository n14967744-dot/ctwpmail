import { Suspense } from "react";
import { headers } from "next/headers";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { getBusiness, recordView } from "@/lib/leads";
import { isBotOrPrefetch, scanCount, sendAlert } from "@/lib/alert";

async function Personal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) notFound();
  const h = await headers();
  if (!isBotOrPrefetch(h)) {
    await recordView(business.slug);
    after(async () => {
      sendAlert({
        event: "scan",
        business: business.name,
        slug: business.slug,
        scan_count: await scanCount(business.slug),
        time_iso: new Date().toISOString(),
      });
    });
  }
  return <Landing business={business} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} />
    </Suspense>
  );
}
