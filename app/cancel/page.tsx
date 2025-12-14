import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export const metadata: Metadata = {
  title: "Payment Cancelled | CardRoots",
  description: "Your payment was cancelled. You can try again when you're ready to send your eco-friendly digital card.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/cancel`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/cancel`,
    title: "Payment Cancelled | CardRoots",
    description: "Your payment was cancelled. You can try again when you're ready to send your eco-friendly digital card.",
    siteName: "CardRoots",
  },
  twitter: {
    card: "summary",
    title: "Payment Cancelled | CardRoots",
    description: "Your payment was cancelled. You can try again when you're ready to send your eco-friendly digital card.",
  },
};

export default function CancelPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-semibold">Payment Cancelled</h1>
      <p>You can try again when you're ready.</p>
    </div>
  );
}


