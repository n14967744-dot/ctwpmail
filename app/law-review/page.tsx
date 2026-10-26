import type { Metadata } from "next";
import { LawLanding } from "./LawLanding";

export const metadata: Metadata = {
  title: "A better fit for your firm | CTWP design preview",
  description: "Review CTWP's personalized law-firm landing page.",
  robots: { index: false, follow: false },
};

export default function LawReviewPage() {
  return <LawLanding />;
}
