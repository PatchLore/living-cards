import "./globals.css";
import React from "react";
import PrivateAnalytics from "../components/site/PrivateAnalytics";
import { Metadata } from "next";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import { display, sans } from "./fonts";
import JsonLd from "../components/site/JsonLd";
import { organizationLd, websiteLd } from "../lib/seo";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

const TITLE = "Animated Digital Christmas Cards That Plant a Tree | CardRoots";
const DESCRIPTION =
  "Christmas cards that come alive: their name and your message written into an animated scene, sent instantly by email for £5. Every card helps plant a tree.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: TITLE, template: "%s | CardRoots" },
  description: DESCRIPTION,
  keywords: [
    "digital Christmas cards",
    "animated Christmas cards",
    "personalised e-cards",
    "eco-friendly Christmas cards",
    "last-minute Christmas card",
    "Christmas cards that plant trees",
    "email Christmas card",
  ],
  authors: [{ name: "CardRoots" }],
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: baseUrl,
    siteName: "CardRoots",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <JsonLd data={[organizationLd, websiteLd]} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <PrivateAnalytics />
      </body>
    </html>
  );
}
