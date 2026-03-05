import { Metadata } from "next";
import { notFound } from "next/navigation";
import CardViewerClient from "../../../card/[cardKey]/CardViewerClient";

const EASTER_CARD_KEYS = [
  "easter-morning",
  "easter-bloom",
  "easter-bunny",
  "easter-eggs",
  "easter-garden",
  "easter-joy",
  "easter-sunrise",
  "easter-wishes",
] as const;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
const cleanBase = baseUrl.replace(/\/$/, "");

const CARD_VIDEO_MAP: Record<string, string> = {
  "easter-morning": "posters/easter1.mp4",
  "easter-bloom": "posters/easter2.mp4",
  "easter-bunny": "posters/easter3.mp4",
  "easter-eggs": "posters/easter4.mp4",
  "easter-garden": "posters/easter5.mp4",
  "easter-joy": "posters/easter6.mp4",
  "easter-sunrise": "posters/easter7.mp4",
  "easter-wishes": "posters/easter8.mp4",
};

const CARD_METADATA: Record<string, { title: string; description: string }> = {
  "easter-morning": {
    title: "Easter Morning",
    description: "Animated digital Easter card that plants a real tree. A beautiful Easter morning animation.",
  },
  "easter-bloom": {
    title: "Easter Bloom",
    description: "Animated digital Easter card that plants a real tree. Spring flowers blooming for Easter.",
  },
  "easter-bunny": {
    title: "Easter Bunny",
    description: "Animated digital Easter card that plants a real tree. A cheerful Easter bunny to brighten their day.",
  },
  "easter-eggs": {
    title: "Easter Eggs",
    description: "Animated digital Easter card that plants a real tree. Colourful Easter eggs for a joyful celebration.",
  },
  "easter-garden": {
    title: "Easter Garden",
    description: "Animated digital Easter card that plants a real tree. A garden in full spring bloom for Easter.",
  },
  "easter-joy": {
    title: "Easter Joy",
    description: "Animated digital Easter card that plants a real tree. Spreading joy this Easter season.",
  },
  "easter-sunrise": {
    title: "Easter Sunrise",
    description: "Animated digital Easter card that plants a real tree. A warm Easter sunrise to share with loved ones.",
  },
  "easter-wishes": {
    title: "Easter Wishes",
    description: "Animated digital Easter card that plants a real tree. Warm Easter wishes for everyone you love.",
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

  const title = `${cardMeta.title} — Digital Easter Card That Plants a Tree | CardRoots`;
  const canonicalUrl = `${cleanBase}/cards/easter/${cardName}`;
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
          alt: `${cardMeta.title} - Digital Easter Card That Plants a Tree`,
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

export default async function EasterCardPage({
  params,
}: {
  params: Promise<{ cardName: string }>;
}) {
  const { cardName } = await params;

  if (!EASTER_CARD_KEYS.includes(cardName as (typeof EASTER_CARD_KEYS)[number])) {
    notFound();
  }

  const cardMeta = CARD_METADATA[cardName];
  const videoFile = CARD_VIDEO_MAP[cardName];
  const imageUrl = videoFile
    ? `${cleanBase}/cards/${videoFile}`
    : `${cleanBase}/og-image.jpg`;
  const canonicalUrl = `${cleanBase}/cards/easter/${cardName}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Digital Easter Card - ${cardMeta.title}`,
    image: imageUrl,
    description: "Animated digital Easter card that plants a real tree",
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
        name: "Easter Cards",
        item: `${cleanBase}/cards/easter`,
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
