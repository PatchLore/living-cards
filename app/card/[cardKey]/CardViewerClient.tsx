"use client";

import Link from "next/link";
import { CARDS, getCard } from "../../../lib/catalog";
import CardArt from "../../../components/site/CardArt";
import { PersonalizePanel } from "../../../components/site/Personalize";

export default function CardViewerClient({
  cardKey,
  backToHash,
  children,
}: {
  cardKey: string;
  backToHash?: string;
  /** Server-rendered details shown under the personaliser. */
  children?: React.ReactNode;
}) {
  const card = getCard(cardKey);
  if (!card) return null;

  const backHref = backToHash
    ? `/#${backToHash}`
    : card.category === "Christmas"
      ? "/#christmas"
      : card.category === "Halloween"
        ? "/#halloween"
        : "/#occasions";
  const more = CARDS.filter((c) => c.shop && c.category === card.category && c.key !== card.key).slice(0, 4);

  return (
    <main className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="text-sm text-ink/60 hover:text-ink">
          ← All {card.category === "Valentine" ? "cards" : `${card.category} cards`}
        </Link>

        {card.retired ? (
          <div className="mx-auto mt-10 max-w-md text-center">
            <div className="mx-auto max-w-[280px]">
              <CardArt card={card} />
            </div>
            <h1 className="mt-8 font-display text-3xl text-ink">{card.title}</h1>
            <p className="mt-3 text-ink/70">This card is no longer available, but our Christmas collection is.</p>
            <Link href="/#christmas" className="mt-6 inline-flex rounded-full bg-berry px-6 py-3 font-semibold text-white">
              See Christmas cards
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <PersonalizePanel card={card} />
          </div>
        )}

        {children}

        {more.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl text-ink">More {card.category} cards</h2>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {more.map((c) => (
                <Link key={c.key} href={`/card/${c.key}`} className="group">
                  <div className="overflow-hidden rounded-2xl shadow-md transition group-hover:-translate-y-1 group-hover:shadow-xl">
                    <CardArt card={c} hideTitle maxFps={30} />
                  </div>
                  <p className="mt-2 font-display text-ink">{c.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
