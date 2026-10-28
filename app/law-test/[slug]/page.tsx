import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { LawLanding } from "@/app/law-review/LawLanding";
import { resolveLawPractice } from "@/app/law-review/law-content";
import { getLawTestRecipient, publicLawTestRecipient } from "@/lib/law-test";
import { TestVisit } from "../TestVisit";

export const metadata: Metadata = { title: "Your firm’s equipment review · CTWP", robots: { index: false, follow: false } };
async function PersonalizedTest({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const sourceRecipient = await getLawTestRecipient(slug);
  const recipient = sourceRecipient ? publicLawTestRecipient(sourceRecipient) : undefined;
  if (!recipient) notFound();
  return <><TestVisit slug={slug} /><LawLanding businessName={recipient.name} initialPractice={resolveLawPractice(recipient.practice)} testRecipient={recipient} /></>;
}
export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<main aria-busy="true">Loading your page…</main>}><PersonalizedTest {...props} /></Suspense>;
}
