import type { MetadataRoute } from "next";

const EASTER_CARD_KEYS = [
  "easter-morning",
  "easter-bloom",
  "easter-bunny",
  "easter-eggs",
  "easter-garden",
  "easter-joy",
  "easter-sunrise",
  "easter-wishes",
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

  const easterCardPages = EASTER_CARD_KEYS.map((cardKey) => ({
    url: `${cleanBaseUrl}/cards/easter/${cardKey}`,
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

  return [...staticPages, ...easterCardPages, ...otherCardPages];
}

