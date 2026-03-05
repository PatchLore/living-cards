import { Metadata } from "next";
import { notFound } from "next/navigation";
import CardViewerClient from "../../../card/[cardKey]/CardViewerClient";

const VALENTINE_CARD_KEYS = [
  "valentine-rose",
  "valentine-heart-glow",
  "valentine-blossom",
  "valentine-love-light",
  "valentine-forever",
  "valentine-sweetheart",
  "valentine-together",
  "valentine-spark",
  "valentine-dream",
  "valentine-treasure",
] as const;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
const cleanBase = baseUrl.replace(/\/$/, "");

const CARD_VIDEO_MAP: Record<string, string> = {
  "valentine-rose": "posters/valentine1.mp4",
  "valentine-heart-glow": "posters/valentine2.mp4",
  "valentine-blossom": "posters/valentine3.mp4",
  "valentine-love-light": "posters/valentine4.mp4",
  "valentine-forever": "posters/valentine5.mp4",
  "valentine-sweetheart": "posters/Valentine6.mp4",
  "valentine-together": "posters/Valentine7.mp4",
  "valentine-spark": "posters/Valentine8.mp4",
  "valentine-dream": "posters/Valentine9.mp4",
  "valentine-treasure": "posters/Valentine10.mp4",
};

const CARD_METADATA: Record<string, { title: string; description: string }> = {
  "valentine-rose": {
    title: "Valentine Rose",
    description: "Animated digital Valentine card that plants a real tree. A blooming rose for the one you love.",
  },
  "valentine-heart-glow": {
    title: "Valentine Heart Glow",
    description: "Animated digital Valentine card that plants a real tree. A radiant heart that says I love you.",
  },
  "valentine-blossom": {
    title: "Valentine Blossom",
    description: "Animated digital Valentine card that plants a real tree. Soft blossoms for a sweet Valentine.",
  },
  "valentine-love-light": {
    title: "Valentine Love Light",
    description: "Animated digital Valentine card that plants a real tree. Warm light for your special someone.",
  },
  "valentine-forever": {
    title: "Valentine Forever",
    description: "Animated digital Valentine card that plants a real tree. A timeless Valentine message.",
  },
  "valentine-sweetheart": {
    title: "Valentine Sweetheart",
    description: "Animated digital Valentine card that plants a real tree. A sweet animation for your special someone.",
  },
  "valentine-together": {
    title: "Valentine Together",
    description: "Animated digital Valentine card that plants a real tree. Celebrate being together with a thoughtful gesture.",
  },
  "valentine-spark": {
    title: "Valentine Spark",
    description: "Animated digital Valentine card that plants a real tree. A little spark of love for Valentine's Day.",
  },
  "valentine-dream": {
    title: "Valentine Dream",
    description: "Animated digital Valentine card that plants a real tree. A dreamy animation to say I love you.",
  },
  "valentine-treasure": {
    title: "Valentine Treasure",
    description: "Animated digital Valentine card that plants a real tree. You're a treasure — send a card that plants a tree.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardName: string }>;
}): Promise<Metadata> {
  const { cardName } = await params;
  const cardMeta = CARD_METADATA[cardName];

  if (!cardMeta) {
    return {
      title: "Card Not Found | CardRoots",
      description: "The requested digital card could not be found.",
    };
  }

  const title = `${cardMeta.title} — Digital Valentine Card That Plants a Tree | CardRoots`;
  const canonicalUrl = `${cleanBase}/cards/valentines/${cardName}`;
  const videoFile = CARD_VIDEO_MAP[cardName];
  const imageUrl = videoFile
    ? `${cleanBase}/cards/${videoFile}`
    : `${cleanBase}/og-image.jpg`;

  return {
    title,
    description: cardMeta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description: cardMeta.description,
      siteName: "CardRoots",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${cardMeta.title} - Digital Valentine Card That Plants a Tree`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cardMeta.description,
      images: [imageUrl],
    },
  };
}

export default async function ValentineCardPage({
  params,
}: {
  params: Promise<{ cardName: string }>;
}) {
  const { cardName } = await params;

  if (!VALENTINE_CARD_KEYS.includes(cardName as (typeof VALENTINE_CARD_KEYS)[number])) {
    notFound();
  }

  const cardMeta = CARD_METADATA[cardName];
  const videoFile = CARD_VIDEO_MAP[cardName];
  const imageUrl = videoFile
    ? `${cleanBase}/cards/${videoFile}`
    : `${cleanBase}/og-image.jpg`;
  const canonicalUrl = `${cleanBase}/cards/valentines/${cardName}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Digital Valentine Card - ${cardMeta.title}`,
    image: imageUrl,
    description: "Animated digital Valentine card that plants a real tree",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "5.00",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: cleanBase,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Valentine Cards",
        item: `${cleanBase}/cards/valentines`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cardMeta.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CardViewerClient cardKey={cardName} backToHash="easter-collection" />
    </>
  );
}
