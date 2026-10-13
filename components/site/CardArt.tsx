"use client";

import type { CatalogCard } from "../../lib/catalog";
import { SCENES_BY_ID } from "../live-cards";
import LiveCard from "../live-cards/LiveCard";

type Props = {
  card: CatalogCard;
  recipient?: string;
  message?: string;
  playKey?: number;
  freezeAt?: number;
  hideTitle?: boolean;
  className?: string;
};

/** Renders any catalog card: code-drawn scenes live, classic cards as video. */
export default function CardArt({ card, ...rest }: Props) {
  const scene = card.sceneId ? SCENES_BY_ID[card.sceneId] : undefined;
  if (scene) return <LiveCard scene={scene} {...rest} />;
  return <LiveCard video={{ src: card.video ?? "", poster: card.poster }} {...rest} />;
}
