import { getCard } from "../../../lib/catalog";
import { getCardByShareId } from "../../../lib/db/cards";
import { OG_SIZE, renderCardOg } from "../../../lib/ogImage";
import { isKidsCardKey, kidsSharePreview } from "../../../lib/kids";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Someone sent you a CardRoots card";

// What WhatsApp, iMessage and social apps show when a card link is shared.
export default async function Image({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const saved = await getCardByShareId(shareId);
  const card = getCard(saved?.card_key);
  const kids = isKidsCardKey(saved?.card_key) ? kidsSharePreview(saved?.card_key) : null;
  return renderCardOg({
    posters: [kids ? kids.poster : card?.poster ?? "/cards/live/moonlit-snow.jpg"],
    eyebrow: kids ? "CardRoots For Kids" : "You've got a card",
    title: kids ? kids.title : saved ? `A card for ${saved.recipient_name}` : "A card for you",
    subtitle: kids ? kids.description : "Tap to open it. It's animated, with a message just for you.",
  });
}
