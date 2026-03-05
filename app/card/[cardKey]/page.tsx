import { Metadata } from "next";
import CardViewerClient from "./CardViewerClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
const baseUrl = siteUrl.replace(/\/$/, "");

// Map card keys → path under /cards/ (Easter videos in posters/)
const CARD_VIDEO_MAP: Record<string, string> = {
  "easter-morning": "posters/easter1.mp4",
  "easter-bloom": "posters/easter2.mp4",
  "easter-bunny": "posters/easter3.mp4",
  "easter-eggs": "posters/easter4.mp4",
  "easter-garden": "posters/easter5.mp4",
  "easter-joy": "posters/easter6.mp4",
  "easter-sunrise": "posters/easter7.mp4",
  "easter-wishes": "posters/easter8.mp4",
  "starlit-christmas-tree": "christmas_tree.mp4",
  "christmas-night-moonlight": "moonlight.mp4",
  "snowy-cottage-evening": "Christmas2.mp4",
  "winter-forest-tree": "XmasTree.mp4",
  "golden-christmas-tree-rise": "Christmas1.mp4",
  "santas-moonlit-ride": "Santa.mp4",
  "elegant-floral-birthday": "Birthday2.mp4",
  "birthday-rose-bloom": "rose.mp4",
  "thank-you-florals": "Thankyou2.mp4",
  "golden-heart-glow": "heart2.mp4",
  "heart-of-light": "heart1.mp4",
  "warm-wishes": "warm_wishes.mp4",
};

// Card metadata mapping for SEO
const CARD_METADATA: Record<string, { title: string; occasion: string; description: string }> = {
  "easter-morning": {
    title: "Easter Morning",
    occasion: "Easter",
    description: "A beautiful Easter morning animation. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-bloom": {
    title: "Easter Bloom",
    occasion: "Easter",
    description: "Spring flowers blooming for Easter. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-bunny": {
    title: "Easter Bunny",
    occasion: "Easter",
    description: "A cheerful Easter bunny to brighten their day. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-eggs": {
    title: "Easter Eggs",
    occasion: "Easter",
    description: "Colourful Easter eggs for a joyful celebration. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-garden": {
    title: "Easter Garden",
    occasion: "Easter",
    description: "A garden in full spring bloom for Easter. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-joy": {
    title: "Easter Joy",
    occasion: "Easter",
    description: "Spreading joy this Easter season. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-sunrise": {
    title: "Easter Sunrise",
    occasion: "Easter",
    description: "A warm Easter sunrise to share with loved ones. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "easter-wishes": {
    title: "Easter Wishes",
    occasion: "Easter",
    description: "Warm Easter wishes for everyone you love. Digital card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "starlit-christmas-tree": {
    title: "Starlit Christmas Tree",
    occasion: "Christmas",
    description: "A calm animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "christmas-night-moonlight": {
    title: "Christmas Night Moonlight",
    occasion: "Christmas",
    description: "A serene animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "snowy-cottage-evening": {
    title: "Snowy Cottage Evening",
    occasion: "Christmas",
    description: "A peaceful animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "winter-forest-tree": {
    title: "Winter Forest Tree",
    occasion: "Christmas",
    description: "A quiet animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "golden-christmas-tree-rise": {
    title: "Golden Christmas Tree Rise",
    occasion: "Christmas",
    description: "A radiant animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "santas-moonlit-ride": {
    title: "Santa's Moonlit Ride",
    occasion: "Christmas",
    description: "A nostalgic animated Christmas card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "birthday-rose-bloom": {
    title: "Birthday Rose Bloom",
    occasion: "Birthday",
    description: "A delicate animated birthday card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "elegant-floral-birthday": {
    title: "Elegant Floral Birthday",
    occasion: "Birthday",
    description: "A graceful animated birthday card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "thank-you-florals": {
    title: "Thank You Florals",
    occasion: "Thank You",
    description: "A minimal animated thank you card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "heart-of-light": {
    title: "Heart of Light",
    occasion: "Love",
    description: "A luminous animated love card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "golden-heart-glow": {
    title: "Golden Heart Glow",
    occasion: "Love",
    description: "A radiant animated love card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
  "warm-wishes": {
    title: "Warm Wishes",
    occasion: "General",
    description: "A warm animated card that plants a real tree. A thoughtful digital gift delivered instantly.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ cardKey: string }> }): Promise<Metadata> {
  const { cardKey } = await params;
  const cardMeta = CARD_METADATA[cardKey];

  if (!cardMeta) {
    return {
      title: "Card Not Found | CardRoots",
      description: "The requested digital card could not be found.",
    };
  }

  const title = `${cardMeta.title} — Plants a Real Tree | CardRoots`;
  const url = `${baseUrl}/card/${cardKey}`;
  const imageUrl = `${baseUrl}${CARD_VIDEO_MAP[cardKey] ? `/cards/${CARD_VIDEO_MAP[cardKey]}` : "/og-image.jpg"}`;
  
  return {
    title,
    description: cardMeta.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description: cardMeta.description,
      siteName: "CardRoots",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${cardMeta.title} - Digital Card That Plants a Tree`,
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

export default async function CardViewerPage({ params }: { params: Promise<{ cardKey: string }> }) {
  const { cardKey } = await params;
  const cardMeta = CARD_METADATA[cardKey];

  // Structured data for Product (Valentine cards include aggregateRating)
  const productSchema = cardMeta
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name:
          cardMeta.occasion === "Easter"
            ? `Digital Easter Card - ${cardMeta.title}`
            : cardMeta.occasion === "Valentine's Day"
              ? `Digital Valentine Card - ${cardMeta.title}`
              : cardMeta.title,
        description: cardMeta.description,
        image: `${baseUrl}${CARD_VIDEO_MAP[cardKey] ? `/cards/${CARD_VIDEO_MAP[cardKey]}` : "/og-image.jpg"}`,
        brand: {
          "@type": "Brand",
          name: "CardRoots",
        },
        category: `${cardMeta.occasion} Digital Cards`,
        offers: {
          "@type": "Offer",
          price: "5.00",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/card/${cardKey}`,
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Trees Planted", value: "1" },
          { "@type": "PropertyValue", name: "Occasion", value: cardMeta.occasion },
        ],
        ...((cardMeta.occasion === "Valentine's Day" || cardMeta.occasion === "Easter") && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "127",
          },
        }),
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <CardViewerClient cardKey={cardKey} />
    </>
  );
}

