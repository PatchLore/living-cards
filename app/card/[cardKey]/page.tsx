import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CARDS, type CatalogCard, PRICE_LABEL, getCard } from "../../../lib/catalog";
import { SITE_URL, breadcrumbLd, productLd } from "../../../lib/seo";
import JsonLd from "../../../components/site/JsonLd";
import CardViewerClient from "./CardViewerClient";

export function generateStaticParams() {
  return CARDS.filter((c) => !c.retired && c.category !== "Valentine").map((c) => ({ cardKey: c.key }));
}

/** Search description, kept within ~160 characters. */
function describe(card: CatalogCard) {
  const tail = ` Personalised, sent instantly by email for ${PRICE_LABEL}.`;
  const tree = " Helps plant a tree.";
  const room = 158 - tail.length;
  const lead = card.description.length > room ? `${card.description.slice(0, room - 1).replace(/\s+\S*$/, "")}…` : card.description;
  const text = lead + tail;
  return text.length + tree.length <= 160 ? text + tree : text;
}

export async function generateMetadata({ params }: { params: Promise<{ cardKey: string }> }): Promise<Metadata> {
  const { cardKey } = await params;
  const card = getCard(cardKey);
  if (!card) return { title: "Card not found" };

  const title = `${card.title}: Animated ${card.category} Card`;
  const description = describe(card);
  return {
    title,
    description,
    alternates: { canonical: `/card/${card.key}` },
    robots: card.retired ? { index: false } : undefined,
    openGraph: { type: "website", url: `/card/${card.key}`, title, description, siteName: "CardRoots" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const OCCASION_LINE: Partial<Record<CatalogCard["category"], string>> = {
  Christmas: "Perfect for family, friends and colleagues, and there's no last posting date.",
  Halloween: "Fun for friends, family and little ones, and it arrives in time for the night itself.",
  Birthday: "A birthday card that arrives on the day, wherever they are.",
  "Thank You": "A quick, heartfelt way to say thank you that they can open again and again.",
  Love: "A thoughtful way to tell someone you're thinking of them.",
  Valentine: "A thoughtful Valentine's card that arrives the moment you send it.",
};

function CardDetails({ card }: { card: CatalogCard }) {
  return (
    <section className="mt-16 grid gap-10 border-t border-ink/10 pt-12 md:grid-cols-2">
      <div>
        <h2 className="font-display text-2xl text-ink">About this card</h2>
        <p className="mt-3 leading-relaxed text-ink/70">
          {card.description}{" "}
          {card.kind === "live"
            ? "It's a living card: the scene is animated live in their browser, and your greeting, their name and your message appear inside it."
            : "It's a classic animated card: the animation plays with their name and your message written onto the card."}{" "}
          {OCCASION_LINE[card.category] ?? ""}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {[
            ["Price", `${PRICE_LABEL} per card`],
            ["Delivery", "Instant, as a link by email"],
            ["Works on", "Any phone, tablet or computer"],
            ["Gives back", "Helps plant a real tree"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-ink/10 bg-white p-4">
              <dt className="text-ink/50">{k}</dt>
              <dd className="mt-1 font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <h2 className="font-display text-2xl text-ink">How sending works</h2>
        <ol className="mt-3 space-y-3 leading-relaxed text-ink/70">
          <li>
            <strong className="text-ink">1. Personalise it.</strong> Add their name and your message, and watch them appear in
            the card as you type.
          </li>
          <li>
            <strong className="text-ink">2. Pay {PRICE_LABEL}.</strong> Checkout is handled securely by Stripe.
          </li>
          <li>
            <strong className="text-ink">3. Send the link.</strong> We email you the card straight away. Share the link by text,
            WhatsApp or email, or forward our email to them.
          </li>
        </ol>
      </div>
    </section>
  );
}

export default async function CardPage({ params }: { params: Promise<{ cardKey: string }> }) {
  const { cardKey } = await params;
  const card = getCard(cardKey);
  // Retired cards get a real 404 (middleware redirects them first), never a 200 page.
  if (!card || card.retired) notFound();

  const sectionHash = card.category === "Christmas" ? "christmas" : card.category === "Halloween" ? "halloween" : "occasions";
  return (
    <>
      <JsonLd
        data={[
          productLd(card),
          breadcrumbLd([
            { name: "Home", url: SITE_URL },
            { name: `${card.category} cards`, url: `${SITE_URL}/#${sectionHash}` },
            { name: card.title, url: `${SITE_URL}/card/${card.key}` },
          ]),
        ]}
      />
      <CardViewerClient cardKey={cardKey}>{!card.retired && <CardDetails card={card} />}</CardViewerClient>
    </>
  );
}
