// Shared facts and structured data (JSON-LD). Keeping the FAQ and the
// schema in one place means search engines and AI assistants see the same
// answers that visitors read on the page.

import { type CatalogCard, PRICE_LABEL } from "./catalog";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");
export const PRICE_AMOUNT = "5.00";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is a CardRoots living card?",
    a: `A digital greeting card that's animated live in the browser. Your greeting, their name and your message appear inside the moving scene. You send it as a link, it costs ${PRICE_LABEL}, and every card helps plant a real tree.`,
  },
  {
    q: "How much does a card cost?",
    a: `${PRICE_LABEL} per card, paid securely through Stripe. There's no postage and nothing else to pay.`,
  },
  {
    q: "How does my recipient get the card?",
    a: "Straight after payment we email you a private link to the card. Send that link to them however you like: text, WhatsApp, email or a message on social media. You can also simply forward our email.",
  },
  {
    q: "Is it too late to send a Christmas card?",
    a: "Never. Cards are ready the moment you pay, so there's no last posting date. They work on Christmas morning just as well as in early December.",
  },
  {
    q: "What does my recipient see?",
    a: "They open the link and the card plays: the scene animates and your greeting, their name and your message appear inside it. It works on any phone, tablet or computer.",
  },
  {
    q: "Do they need an app or an account?",
    a: "No. They just open the link in their web browser. There's nothing to download and no sign-up.",
  },
  {
    q: "Can I send a card to someone abroad?",
    a: "Yes. A CardRoots card is a link, so it works anywhere in the world. Prices are in pounds sterling.",
  },
  {
    q: "What makes the living cards different?",
    a: "They're animated live in the browser rather than played as a video, so your words are part of the scene instead of a caption underneath. They also stay crisp on every screen and load fast.",
  },
  {
    q: "Are the trees really planted?",
    a: "Every card sale contributes to tree planting with our planting partners. If you'd like details for your order, email info@cardroots.com.",
  },
  {
    q: "Can I send cards to lots of people?",
    a: "Yes. For teams, clients or long lists, see our business page or email info@cardroots.com and we'll handle the sending for you.",
  },
  {
    q: "What if something goes wrong?",
    a: "If your card doesn't arrive or there's any problem, email info@cardroots.com and we'll put it right or refund you.",
  },
];

const ORG_ID = `${SITE_URL}/#organization`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "CardRoots",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  description:
    "CardRoots makes animated digital greeting cards personalised inside the scene, delivered instantly by email. Every card helps plant a real tree.",
  email: "info@cardroots.com",
  areaServed: "Worldwide",
  contactPoint: { "@type": "ContactPoint", email: "info@cardroots.com", contactType: "customer service" },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "CardRoots",
  url: SITE_URL,
  inLanguage: "en-GB",
  publisher: { "@id": ORG_ID },
};

export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export function productLd(card: CatalogCard) {
  const url = card.category === "Valentine" ? `${SITE_URL}/cards/valentines/${card.key}` : `${SITE_URL}/card/${card.key}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: `${card.title}: animated ${card.category} card`,
    description: `${card.description} Personalised with your message and delivered instantly by email. Every card helps plant a real tree.`,
    image: `${SITE_URL}${card.poster}`,
    url,
    category: `Digital greeting cards > ${card.category}`,
    brand: { "@type": "Brand", name: "CardRoots" },
    offers: {
      "@type": "Offer",
      url,
      price: PRICE_AMOUNT,
      priceCurrency: "GBP",
      availability: card.retired ? "https://schema.org/Discontinued" : "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function itemListLd(name: string, cards: CatalogCard[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: cards.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/card/${c.key}`,
      name: c.title,
    })),
  };
}
