import type { Metadata } from "next";
import { HeroStudio } from "./HeroStudio";

export const metadata: Metadata = { title: "Current vs. new hero layouts · CTWP", robots: { index: false, follow: false } };
export default function Page() { return <HeroStudio />; }
