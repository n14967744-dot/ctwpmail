import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-serif", weight: ["500", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-sans", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "CTWP | Your Copier Company",
  description: "Your local copier company in Bryan, Texas since 1979.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
