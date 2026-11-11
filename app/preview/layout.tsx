import type { Metadata } from "next";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({ subsets: ["latin"], display: "swap", variable: "--font-display", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: "CTWP | Design preview",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className={oxanium.variable}>{children}</div>;
}
