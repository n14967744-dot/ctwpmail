import { Suspense } from "react";
import { headers } from "next/headers";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { getBusiness, recordView } from "@/lib/leads";
import { isBotOrPrefetch, scanCount, sendAlert } from "@/lib/alert";

type SP = Promise<Record<string, string | string[] | undefined>>;

async function Personal({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  const { slug } = await params;
  const src = (await searchParams).src;
  const source: "qr" | "direct" = (Array.isArray(src) ? src[0] : src) === "qr" ? "qr" : "direct";
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
  return <Landing business={business} />;
}

export default function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} searchParams={searchParams} />
    </Suspense>
  );
}
