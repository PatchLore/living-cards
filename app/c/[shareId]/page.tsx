import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCard } from "../../../lib/catalog";
import { getCardByShareId } from "../../../lib/db/cards";
import SharedCard from "./SharedCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ shareId: string }> }): Promise<Metadata> {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) return { title: "Card not found", robots: { index: false } };

  const catalogCard = getCard(card.card_key);
  const title = `A card for ${card.recipient_name}`;
  const description = "Someone sent you an animated CardRoots card. Tap to open it.";
  const image = `${baseUrl}${catalogCard?.poster ?? "/og-image.jpg"}`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { type: "website", url: `${baseUrl}/c/${shareId}`, title, description, siteName: "CardRoots", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SharedCardPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) notFound();

  return (
    <SharedCard
      cardKey={card.card_key}
      recipient={card.recipient_name}
      message={card.message}
      certificateUrl={card.tree_certificate_url}
    />
  );
}
