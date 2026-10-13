import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import { display, sans } from "./fonts";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

const TITLE = "Animated Digital Christmas Cards That Plant a Tree | CardRoots";
const DESCRIPTION =
  "Christmas cards that come alive: your recipient's name and message are written into an animated scene, delivered instantly by email for £5. Every card helps plant a real tree.";

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
  alternates: { canonical: baseUrl },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: baseUrl,
    siteName: "CardRoots",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${baseUrl}/cards/live/santa-sleigh.jpg`, width: 900, height: 1350, alt: "Santa's Sleigh, a CardRoots Christmas card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${baseUrl}/cards/live/santa-sleigh.jpg`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CardRoots",
  url: baseUrl,
  contactPoint: { "@type": "ContactPoint", email: "info@cardroots.com", contactType: "Customer Service" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
