import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import UrgencyBanner from "../components/UrgencyBanner";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Digital Christmas Cards That Plant a Tree | CardRoots",
    template: "%s | CardRoots",
  },
  description: "Send beautiful animated Christmas cards that plant real trees. Eco-friendly digital cards delivered instantly. A thoughtful sustainable gift.",
  keywords: ["digital Christmas cards", "eco-friendly Christmas cards", "digital cards that plant a tree", "sustainable gifts", "animated greeting cards", "environmental gifts"],
  authors: [{ name: "CardRoots" }],
  creator: "CardRoots",
  publisher: "CardRoots",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "CardRoots",
    title: "Digital Christmas Cards That Plant a Tree | CardRoots",
    description: "Send beautiful animated Christmas cards that plant real trees. Eco-friendly digital cards delivered instantly. A thoughtful sustainable gift.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "CardRoots - Digital Cards That Plant Real Trees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Christmas Cards That Plant a Tree | CardRoots",
    description: "Send beautiful animated Christmas cards that plant real trees. Eco-friendly digital cards delivered instantly.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";
  
  // Structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CardRoots",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "CardRoots sends beautiful animated digital cards that plant real trees. Eco-friendly digital greeting cards delivered instantly.",
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@cardroots.com",
      contactType: "Customer Service",
    },
  };

  // Structured data for SoftwareApplication
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CardRoots",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "5.00",
      priceCurrency: "GBP",
      description: "Digital card that plants a real tree",
    },
    description: "Send beautiful animated digital cards that plant real trees. Eco-friendly digital greeting cards for Christmas, birthdays, and special occasions.",
    url: siteUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />

        <div className="snow-overlay"></div>
        <div className="snow-overlay-layer3"></div>

        {/* Seasonal urgency banner (dismissible client component) */}
        <UrgencyBanner />

        {/* Main content above snow */}
        <div className="relative z-[40]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </div>

        {/* Footer trust / drop-service prompt */}
        <footer className="relative z-[40] mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-400">
            Every card plants a tree — helping restore forests and support sustainable projects worldwide. 🌱
            <div className="mt-2">
              Sending 100+ holiday cards?{" "}
              <a
                href="mailto:info@cardroots.com?subject=Managed%20Sending%20Service%20Enquiry"
                className="underline text-blue-300"
              >
                Request a Managed Sending Service
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                <a href="/terms" className="hover:text-slate-400 transition">
                  Terms & Conditions
                </a>
                <span className="text-slate-600">•</span>
                <a href="/privacy" className="hover:text-slate-400 transition">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}


