import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
const baseUrl = canonicalUrl.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Digital Valentine Cards That Plant Real Trees | Eco-Friendly Instant Delivery | CardRoots",
    template: "%s | CardRoots",
  },
  description: "Send beautiful animated Valentine cards instantly via email. Every card plants a verified tree. Eco-friendly alternative to paper cards. £5 per card, delivered in seconds.",
  keywords: [
    "digital Valentine cards",
    "eco-friendly Valentine cards",
    "send Valentine card instantly",
    "Valentine cards that plant trees",
    "last-minute Valentine gifts",
    "sustainable greeting cards",
    "animated Valentine cards",
    "email Valentine cards",
    "digital cards that plant a tree",
    "eco-friendly alternative to paper cards",
    "instant digital Valentine delivery",
    "verified tree planting greeting cards",
    "Valentine gift that plants a real tree",
  ],
  authors: [{ name: "CardRoots" }],
  creator: "CardRoots",
  publisher: "CardRoots",
  alternates: {
    canonical: baseUrl,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: baseUrl,
    siteName: "CardRoots",
    title: "Digital Valentine Cards That Plant Real Trees | Eco-Friendly Instant Delivery | CardRoots",
    description: "Send beautiful animated Valentine cards instantly via email. Every card plants a verified tree. Eco-friendly alternative to paper cards. £5 per card, delivered in seconds.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "CardRoots - Digital Valentine Cards That Plant Real Trees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Valentine Cards That Plant Real Trees | Eco-Friendly Instant Delivery | CardRoots",
    description: "Send beautiful animated Valentine cards instantly via email. Every card plants a verified tree. Eco-friendly alternative to paper cards. £5 per card, delivered in seconds.",
    images: [`${baseUrl}/og-image.jpg`],
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
  const baseUrl = siteUrl.replace(/\/$/, "");

  // Structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CardRoots",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://twitter.com/cardroots",
      "https://instagram.com/cardroots",
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
    description: "Send beautiful animated digital cards that plant real trees. Eco-friendly digital greeting cards for Valentine's Day, Christmas, birthdays, and special occasions.",
    url: baseUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAF9] relative">
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

        {/* Main content above snow */}
        <div className="relative z-[40]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>

        {/* Footer trust / drop-service prompt */}
        <footer className="relative z-[40] mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-[#1A1A1A]/70">
            Every card plants a tree — helping restore forests and support sustainable projects worldwide.
            <div className="mt-2">
              Sending 100+ holiday cards?{" "}
              <a
                href="mailto:info@cardroots.com?subject=Managed%20Sending%20Service%20Enquiry"
                className="underline text-[#2D6A4F]"
              >
                Request a Managed Sending Service
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#1A1A1A]/60">
                <a href="/terms" className="hover:text-[#1A1A1A] transition">
                  Terms & Conditions
                </a>
                <span className="text-slate-600">•</span>
                <a href="/privacy" className="hover:text-[#1A1A1A] transition">
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


