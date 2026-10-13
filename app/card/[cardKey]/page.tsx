import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CARDS, PRICE_LABEL, getCard } from "../../../lib/catalog";
import CardViewerClient from "./CardViewerClient";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

export function generateStaticParams() {
  return CARDS.filter((c) => !c.retired && c.category !== "Valentine").map((c) => ({ cardKey: c.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ cardKey: string }> }): Promise<Metadata> {
  const { cardKey } = await params;
  const card = getCard(cardKey);
  if (!card) return { title: "Card not found" };

  const title = `${card.title}: Animated ${card.category} Card`;
  const description = `${card.description} Personalised with your message, delivered instantly for ${PRICE_LABEL}. Every card helps plant a real tree.`;
  const url = `${baseUrl}/card/${card.key}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: card.retired ? { index: false } : undefined,
    openGraph: { type: "website", url, title, description, siteName: "CardRoots", images: [`${baseUrl}${card.poster}`] },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}${card.poster}`] },
  };
}

export default async function CardPage({ params }: { params: Promise<{ cardKey: string }> }) {
  const { cardKey } = await params;
  if (!getCard(cardKey)) notFound();
  return <CardViewerClient cardKey={cardKey} />;
}
