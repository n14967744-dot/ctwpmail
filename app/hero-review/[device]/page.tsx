import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SingleHeroReview } from "../single-review";

export const metadata: Metadata = { title: "CTWP | Hero workspace", robots: { index: false, follow: false } };
export function generateStaticParams() { return [{ device: "mobile" }, { device: "desktop" }]; }
export default async function Page({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  if (device !== "mobile" && device !== "desktop") notFound();
  return <SingleHeroReview device={device} />;
}
