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
  maxFps?: number;
  /** Include the poster image (for SEO and first paint) under live scenes. */
  withPoster?: boolean;
  /** "low" keeps the poster from being preloaded, e.g. when it may start below the fold. */
  posterPriority?: "high" | "low" | "auto";
  className?: string;
};

/** Renders any catalog card: code-drawn scenes live, classic cards as video. */
export default function CardArt({ card, withPoster, posterPriority, ...rest }: Props) {
  const scene = card.sceneId ? SCENES_BY_ID[card.sceneId] : undefined;
  const poster = withPoster
    ? { src: card.poster, alt: `${card.title}, an animated ${card.category} card from CardRoots`, fetchPriority: posterPriority }
    : undefined;
  if (scene) return <LiveCard scene={scene} poster={poster} {...rest} />;
  return <LiveCard video={{ src: card.video ?? "", poster: card.poster }} {...rest} />;
}
