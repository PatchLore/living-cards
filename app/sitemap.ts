import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl.replace(/\/$/, "");

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/corporate`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Card pages
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
    url: `${baseUrl}/card/${cardKey}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...cardPages];
}

