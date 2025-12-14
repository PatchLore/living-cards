import { Suspense } from "react";
import SuccessClient from "./SuccessClient";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export const metadata: Metadata = {
  title: "Payment Successful | CardRoots",
  description: "Your digital card is ready. Share your eco-friendly card and view your tree planting confirmation.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/success`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/success`,
    title: "Payment Successful | CardRoots",
    description: "Your digital card is ready. Share your eco-friendly card and view your tree planting confirmation.",
    siteName: "CardRoots",
  },
  twitter: {
    card: "summary",
    title: "Payment Successful | CardRoots",
    description: "Your digital card is ready. Share your eco-friendly card and view your tree planting confirmation.",
  },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}
