import type { Metadata } from "next";
import { LawLanding } from "./LawLanding";
import { resolveLawPractice } from "./law-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "A better fit for your firm | CTWP design preview",
  description: "Review CTWP's personalized law-firm landing page.",
  robots: { index: false, follow: false },
};

async function PersonalizedReview({ searchParams }: { searchParams: Promise<{ firm?: string; practice?: string }> }) {
  const query = await searchParams;
  const businessName = typeof query.firm === "string" ? query.firm.trim().slice(0, 160) : "";
  return <LawLanding businessName={businessName} initialPractice={resolveLawPractice(query.practice)} />;
}

export default function LawReviewPage(props: { searchParams: Promise<{ firm?: string; practice?: string }> }) {
  return <Suspense fallback={<LawLanding />}><PersonalizedReview {...props} /></Suspense>;
}
