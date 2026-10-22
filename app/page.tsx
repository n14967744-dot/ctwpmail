import { Suspense } from "react";
import { connection } from "next/server";
import { Landing } from "@/components/Landing";
import { getBusiness } from "@/lib/leads";
import { DEMO_BUSINESS, DEMO_SLUG } from "@/lib/site";

async function Demo() {
  await connection();
  const business = (await getBusiness(DEMO_SLUG)) ?? DEMO_BUSINESS;
  return <Landing business={business} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <Demo />
    </Suspense>
  );
}
