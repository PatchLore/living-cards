import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardByShareId } from "../../../lib/db/cards";
import SharedCard from "./SharedCard";
import TreeCertificate from "../../../components/site/TreeCertificate";
import { getTreeEvidence } from "../../../lib/goodapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ shareId: string }> }): Promise<Metadata> {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) return { title: "Card not found", robots: { index: false } };

  const title = `A card for ${card.recipient_name}`;
  const description = "Someone sent you an animated CardRoots card. Tap to open it.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { type: "website", url: `${baseUrl}/c/${shareId}`, title, description, siteName: "CardRoots" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedCardPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) notFound();

  const evidence = card.tree_id ? await getTreeEvidence(card.tree_id) : null;

  return (
    <>
      <SharedCard cardKey={card.card_key} recipient={card.recipient_name} message={card.message} />
      {card.tree_id && (
        <div className="bg-night px-4 pb-16">
          <TreeCertificate treeId={card.tree_id} evidence={evidence} />
        </div>
      )}
    </>
  );
}
