import { PRICE_LABEL } from "../lib/catalog";
import { OG_SIZE, renderCardOg } from "../lib/ogImage";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "CardRoots animated Christmas cards";

export default async function Image() {
  return renderCardOg({
    posters: ["/cards/live/snowy-cottage.jpg", "/cards/live/santa-sleigh.jpg", "/cards/live/gift-box.jpg"],
    eyebrow: "CardRoots",
    title: "Christmas cards that come alive",
    subtitle: `Their name and your message in the scene. Sent instantly for ${PRICE_LABEL}. Plants a tree.`,
  });
}
