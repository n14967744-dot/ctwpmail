import { Caveat, Playfair_Display } from "next/font/google";

/* Display serif for the business name and headings; handwriting for Leroy's commission slip. */
export const display = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-display", style: ["normal", "italic"], weight: ["500", "600", "700", "800"] });
export const hand = Caveat({ subsets: ["latin"], display: "swap", variable: "--font-hand", weight: ["600", "700"] });
