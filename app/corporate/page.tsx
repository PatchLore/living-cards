import React from "react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export const metadata: Metadata = {
  title: "Corporate & Bulk Orders",
  description: "Send 50+ eco-friendly digital cards with custom branding. Bulk orders and managed sending service available.",
  alternates: {
    canonical: `${siteUrl}/corporate`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/corporate`,
    title: "Corporate & Bulk Orders",
    description: "Send 50+ eco-friendly digital cards with custom branding. Bulk orders and managed sending service available.",
    siteName: "CardRoots",
  },
  twitter: {
    card: "summary",
    title: "Corporate & Bulk Orders",
    description: "Send 50+ eco-friendly digital cards with custom branding. Bulk orders and managed sending service available.",
  },
};

export default function CorporatePage() {
  return (
    <main className="min-h-[60vh] bg-paper py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="font-display text-4xl text-ink mb-4">Corporate & Bulk Orders</h1>
        <p className="text-slate-700 mb-6">
          Need to send 50+ cards? We handle everything for you — including custom branding, scheduled sending, and sustainability certificates.
        </p>

        <a
          href="mailto:info@cardroots.com?subject=Corporate%20Bulk%20Card%20Order"
          className="inline-flex items-center px-6 py-3 rounded-full bg-berry text-white font-semibold shadow-md hover:bg-berry-deep transition"
        >
          Contact Us for a Bulk Quote
        </a>

        <div className="mt-8 text-slate-600">
          <h2 className="font-display text-2xl mb-3 text-ink">Drop-service workflow</h2>
          <p className="mb-4">
            Prefer us to manage your recipient list? Simply email us your names, messages, and delivery dates — we'll handle the rest.
          </p>
          <p className="mt-3">
            Sending 100+ holiday cards?{" "}
            <a
              href="mailto:info@cardroots.com?subject=Managed%20Sending%20Service%20Enquiry"
              className="underline text-berry hover:text-berry-deep"
            >
              Request a Managed Sending Service
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}


