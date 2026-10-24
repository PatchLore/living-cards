import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardByShareId } from "../../../lib/db/cards";
import SharedCard from "./SharedCard";
import TreeCertificate from "../../../components/site/TreeCertificate";
import { getTreeEvidence } from "../../../lib/goodapi";
import { isKidsCardKey, kidsSharePreview, parseKidsCard } from "../../../lib/kids";
import KidsStudio from "../../../components/kids/KidsStudio";
import { cardLinkExpired } from "../../../lib/cardRetention";
import { cardLinkExpiresAt, formatUkDate } from "../../../lib/sales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ shareId: string }> }): Promise<Metadata> {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) return { title: "Card not found", robots: { index: false } };
  if (cardLinkExpired(card.created_at)) return { title: "This card has expired", robots: { index: false, follow: false } };

  const kids = isKidsCardKey(card.card_key);
  const preview = kids ? kidsSharePreview(card.card_key) : null;
  const title = preview ? preview.title : `A card for ${card.recipient_name}`;
  const description = preview ? preview.description : "Someone sent you an animated CardRoots card. Tap to open it.";
  return {
    title,
    description,
    robots: { index: false, follow: false, ...(kids ? { noarchive: true } : {}) },
    ...(kids ? { referrer: "no-referrer" as const } : {}),
    openGraph: { type: "website", url: `${baseUrl}/c/${shareId}`, title, description, siteName: "CardRoots" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedCardPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const card = await getCardByShareId(shareId);
  if (!card) notFound();
  const evidence = card.tree_id ? await getTreeEvidence(card.tree_id) : null;
  const tree = card.tree_id && (
    <div className="bg-night px-4 pb-16">
      <TreeCertificate treeId={card.tree_id} evidence={evidence} />
    </div>
  );

  // Expired links show no name or message (the cleanup job deletes them).
  if (cardLinkExpired(card.created_at)) {
    return (
      <>
        <main className="flex min-h-[60vh] items-center justify-center bg-night px-4 py-16 text-center text-cream">
          <div className="max-w-md">
            <p className="font-display text-3xl">This card has expired</p>
            <p className="mt-3 text-cream/75">CardRoots card links stay open for a year, then the name and message are deleted to protect everyone’s privacy.{card.tree_id ? " Its tree is still growing." : ""}</p>
          </div>
        </main>
        {tree}
      </>
    );
  }

  const kids = parseKidsCard(card.card_key, card.message);
  if (isKidsCardKey(card.card_key) && !kids) notFound();

  return (
    <>
      {kids ? <KidsStudio initialData={kids} recipientOnly shareId={shareId} serverNow={Date.now()} /> : <SharedCard cardKey={card.card_key} recipient={card.recipient_name} message={card.message} />}
      <p className="bg-night px-4 pt-6 pb-2 text-center text-sm text-cream/60">This private link is open until {formatUkDate(cardLinkExpiresAt(card.created_at))}.</p>
      {tree}
    </>
  );
}
