import { getCard } from "../../../lib/catalog";
import { getCardByShareId } from "../../../lib/db/cards";
import { OG_SIZE, renderCardOg } from "../../../lib/ogImage";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Someone sent you a CardRoots card";

// What WhatsApp, iMessage and social apps show when a card link is shared.
export default async function Image({ params }: { params: { shareId: string } }) {
  const saved = await getCardByShareId(params.shareId);
  const card = getCard(saved?.card_key);
  return renderCardOg({
    posters: [card?.poster ?? "/cards/live/moonlit-snow.jpg"],
    eyebrow: "You've got a card",
    title: saved ? `A card for ${saved.recipient_name}` : "A card for you",
    subtitle: "Tap to open it. It's animated, with a message just for you.",
  });
}
