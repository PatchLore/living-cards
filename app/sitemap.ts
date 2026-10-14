import type { MetadataRoute } from "next";
import { CARDS } from "../lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/corporate`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const card of CARDS) {
    if (card.retired) continue;
    pages.push({
      url: card.category === "Valentine" ? `${base}/cards/valentines/${card.key}` : `${base}/card/${card.key}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: card.category === "Christmas" ? 0.95 : 0.7,
      images: [`${base}${card.poster}`],
    });
  }
  return pages;
}
