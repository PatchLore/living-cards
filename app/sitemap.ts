import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  // Static pages
  const staticPages = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${cleanBaseUrl}/corporate`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${cleanBaseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${cleanBaseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  // Card pages (important for SEO)
  const cardPages = [
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
  ].map((cardKey) => ({
    url: `${cleanBaseUrl}/card/${cardKey}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...cardPages];
}

