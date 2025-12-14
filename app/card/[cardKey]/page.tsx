import { Metadata } from "next";
import CardViewerClient from "./CardViewerClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";

// Map card keys → actual video filenames
const CARD_VIDEO_MAP: Record<string, string> = {
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
  const url = `${siteUrl}/card/${cardKey}`;
  const imageUrl = `${siteUrl}${CARD_VIDEO_MAP[cardKey] ? `/cards/${CARD_VIDEO_MAP[cardKey]}` : '/og-image.jpg'}`;
  
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";
  
  // Structured data for Product
  const productSchema = cardMeta ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cardMeta.title,
    description: cardMeta.description,
    image: `${siteUrl}${CARD_VIDEO_MAP[cardKey] ? `/cards/${CARD_VIDEO_MAP[cardKey]}` : '/og-image.jpg'}`,
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
      url: `${siteUrl}/card/${cardKey}`,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Trees Planted",
        value: "1",
      },
      {
        "@type": "PropertyValue",
        name: "Occasion",
        value: cardMeta.occasion,
      },
    ],
  } : null;

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

