import type { Metadata } from "next";
import ChristmasLab from "./ChristmasLab";

export const metadata: Metadata = {
  title: "Live Christmas Cards (Lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ChristmasLab />;
}
