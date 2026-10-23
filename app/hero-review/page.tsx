import type { Metadata } from "next";
import { HeroReview } from "./review";

export const metadata: Metadata = {
  title: "CTWP | Hero layout comparison",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HeroReview />;
}
