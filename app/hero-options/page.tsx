import type { Metadata } from "next";
import { HeroStudio } from "./HeroStudio";

export const metadata: Metadata = { title: "Selected responsive hero · CTWP", robots: { index: false, follow: false } };
export default function Page() { return <HeroStudio />; }
