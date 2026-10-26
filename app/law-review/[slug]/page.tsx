import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LawLanding } from "../LawLanding";
import { resolveLawPractice } from "../law-content";
import recipients from "../recipients.json";

export const metadata: Metadata = {
  title: "Your firm's equipment review | CTWP",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return recipients.map(({ slug }) => ({ slug }));
}

async function RecipientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipient = recipients.find((record) => record.slug === slug);
  if (!recipient) notFound();
  return <LawLanding key={recipient.id} businessName={recipient.name} initialPractice={resolveLawPractice(recipient.practice)} />;
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<main aria-busy="true">Loading your firm's page…</main>}><RecipientPage {...props} /></Suspense>;
}
