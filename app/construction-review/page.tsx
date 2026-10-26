import type { Metadata } from "next";
import { LawLanding } from "../law-review/LawLanding";
export const metadata: Metadata = { title: "Plans that fit your work | CTWP construction preview", robots: { index: false, follow: false } };
export default function ConstructionReviewPage() { return <LawLanding niche="construction" />; }
