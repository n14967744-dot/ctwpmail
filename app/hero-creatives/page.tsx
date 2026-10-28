import type { Metadata } from "next";
import { CreativeStudio } from "./CreativeStudio";

export const metadata: Metadata = { title: "Three LeRoy creatives · CTWP", robots: { index: false, follow: false } };
export default function Page() { return <CreativeStudio />; }
