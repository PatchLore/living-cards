import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export const metadata: Metadata = {
  title: "Payment Cancelled",
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
    title: "Payment Cancelled",
    description: "Your payment was cancelled. You can try again when you're ready to send your eco-friendly digital card.",
    siteName: "CardRoots",
  },
  twitter: {
    card: "summary",
    title: "Payment Cancelled",
    description: "Your payment was cancelled. You can try again when you're ready to send your eco-friendly digital card.",
  },
};

export default function CancelPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-3xl text-ink">No problem, nothing was charged</h1>
        <p className="mt-3 text-ink/70">Your card is still waiting whenever you&apos;re ready.</p>
        <a href="/#christmas" className="mt-8 inline-flex rounded-full bg-berry px-6 py-3 font-semibold text-white hover:bg-berry-deep">
          Back to the cards
        </a>
      </div>
    </main>
  );
}
