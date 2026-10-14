import { CARDS, PRICE_LABEL, getCard } from "../../../lib/catalog";
import { OG_SIZE, renderCardOg } from "../../../lib/ogImage";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A CardRoots animated card";

export function generateStaticParams() {
  return CARDS.filter((c) => !c.retired && c.category !== "Valentine").map((c) => ({ cardKey: c.key }));
}

export default async function Image({ params }: { params: { cardKey: string } }) {
  const card = getCard(params.cardKey);
  return renderCardOg({
    posters: [card?.poster ?? "/cards/live/santa-sleigh.jpg"],
    eyebrow: `${card?.category ?? "Animated"} card`,
    title: card?.title ?? "CardRoots",
    subtitle: `Personalised in the scene, sent instantly by email. ${PRICE_LABEL}, and every card helps plant a tree.`,
  });
}
