import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

export const scriptFont = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });
export const serifFont = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
