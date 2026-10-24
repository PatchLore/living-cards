import { Caveat, Inter } from "next/font/google";

// Shared by the studio and the print-only sheets, which render outside it.
// Inter is "optional" so a late font never reflows the page (it caused most of /kids' layout shift).
export const kidsInter = Inter({ subsets: ["latin"], variable: "--font-kids-inter", display: "optional" });
export const kidsCaveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-kids-caveat", display: "swap" });
export const kidsFontVariables = `${kidsInter.variable} ${kidsCaveat.variable}`;
