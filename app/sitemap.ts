import type { MetadataRoute } from "next";

const VALENTINE_CARD_KEYS = [
  "valentine-rose",
  "valentine-heart-glow",
  "valentine-blossom",
  "valentine-love-light",
  "valentine-forever",
];

const OTHER_CARD_KEYS = [
  "starlit-christmas-tree",
  "christmas-night-moonlight",
  "snowy-cottage-evening",
  "winter-forest-tree",
  "golden-christmas-tree-rise",
  "santas-moonlit-ride",
  "birthday-rose-bloom",
  "elegant-floral-birthday",
  "thank-you-florals",
  "heart-of-light",
  "golden-heart-glow",
  "warm-wishes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  const staticPages = [
    { url: cleanBaseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${cleanBaseUrl}/corporate`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${cleanBaseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${cleanBaseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const valentineCardPages = VALENTINE_CARD_KEYS.map((cardKey) => ({
    url: `${cleanBaseUrl}/cards/valentines/${cardKey}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.95,
  }));

  const otherCardPages = OTHER_CARD_KEYS.map((cardKey) => ({
    url: `${cleanBaseUrl}/card/${cardKey}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...valentineCardPages, ...otherCardPages];
}

