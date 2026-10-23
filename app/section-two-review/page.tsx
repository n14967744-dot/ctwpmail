import type { Metadata } from "next";
import Review from "./review";

export const metadata: Metadata = { title: "CTWP | Section two comparison", robots: { index: false, follow: false } };
export default function Page() { return <Review/>; }
