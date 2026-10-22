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
  return <Landing business={business} />;
}

export default function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} searchParams={searchParams} />
    </Suspense>
  );
}
