import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { getBusiness, recordView } from "@/lib/leads";

async function Personal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) notFound();
  await recordView(business.slug);
  return <Landing business={business} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Personal params={params} />
    </Suspense>
  );
}
