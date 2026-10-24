import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "../frame/[variant]/page";

export const metadata: Metadata = { title: "CTWP | Your Copier Company", robots: { index: false, follow: false } };
export function generateStaticParams() { return [{ device: "mobile" }, { device: "desktop" }]; }
export default async function Page({ params }: { params: Promise<{ device: string }> }) {
  const { device } = await params;
  if (device !== "mobile" && device !== "desktop") notFound();
  return <Hero params={Promise.resolve({ variant: "current" })} />;
}
