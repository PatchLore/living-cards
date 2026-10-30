"use client";

// The interactive parts of the homepage. Everything else is rendered on the
// server (app/Home.tsx), so the browser only runs code for the hero preview,
// the card tiles and the personalise dialog.

import dynamic from "next/dynamic";
import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";
import { type CatalogCard, PRICE_LABEL, getCard } from "../lib/catalog";
import CardArt from "../components/site/CardArt";

// Only needed once someone picks a card, so it stays out of the first load.
const PersonalizeDialog = dynamic(() => import("../components/site/Personalize").then((m) => m.PersonalizeDialog));

const HERO_CARD = getCard("live-santa-sleigh")!;

// Split so typing a name only re-renders the hero, not every tile.
const PickContext = createContext<(c: CatalogCard) => void>(() => {});
const HeroNameContext = createContext<[string, (name: string) => void]>(["", () => {}]);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<CatalogCard | null>(null);
  const [heroName, setHeroName] = useState("Grandma");
  const close = useCallback(() => setActive(null), []);

  return (
    <PickContext.Provider value={setActive}>
      <HeroNameContext.Provider value={[heroName, setHeroName]}>
        {children}
        {active && <PersonalizeDialog card={active} initialRecipient={active === HERO_CARD ? heroName.trim() : ""} onClose={close} />}
      </HeroNameContext.Provider>
    </PickContext.Provider>
  );
}

export function HeroNameInput() {
  const [heroName, setHeroName] = useContext(HeroNameContext);
  const pick = useContext(PickContext);
  return (
    <div className="mt-2 flex gap-2">
      <input
        id="hero-name"
        value={heroName}
        maxLength={40}
        onChange={(e) => setHeroName(e.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-white/15 bg-night/60 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
        placeholder="Their name"
      />
      <button
        type="button"
        onClick={() => pick(HERO_CARD)}
        className="shrink-0 rounded-xl bg-berry px-5 py-3 font-semibold text-white transition hover:bg-berry-deep"
      >
        Add message →
      </button>
    </div>
  );
}

export function HeroCard() {
  const [heroName] = useContext(HeroNameContext);
  return (
    <CardArt
      card={HERO_CARD}
      withPoster
      // On phones the hero card starts below the fold; don't let its poster compete with the fonts.
      posterPriority="low"
      recipient={heroName.trim()}
      message="Wishing you a magical Christmas and a very happy new year. Love from all of us."
      className="shadow-2xl ring-1 ring-white/10"
    />
  );
}

export function CardTile({
  cardKey,
  compact,
  dark,
}: {
  cardKey: string;
  compact?: boolean;
  /** Light text for tiles on a dark section. */
  dark?: boolean;
}) {
  const card = getCard(cardKey)!;
  const pick = useContext(PickContext);
  return (
    <article className="group flex flex-col">
      <button
        type="button"
        onClick={() => pick(card)}
        aria-label={`Personalise ${card.title}`}
        className="relative block w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-ink/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
      >
        <CardArt card={card} hideTitle={compact} maxFps={30} />
        {card.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-berry shadow">
            {card.badge}
          </span>
        )}
      </button>
      <div className={`mt-3 flex items-start justify-between gap-3 ${compact ? "min-h-[3.25rem]" : "min-h-[4.5rem]"}`}>
        <div className="min-w-0">
          <h3 className={`font-display ${dark ? "text-cream" : "text-ink"} ${compact ? "text-base" : "text-lg sm:text-xl"}`}>
            {card.title}
          </h3>
          {!compact && (
            <p className={`mt-1 hidden text-sm leading-relaxed sm:block lg:hidden ${dark ? "text-cream/60" : "text-ink/60"}`}>
              {card.description}
            </p>
          )}
        </div>
        <span className={`shrink-0 pt-0.5 text-sm font-semibold ${dark ? "text-cream/70" : "text-ink/70"}`}>{PRICE_LABEL}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => pick(card)}
          className="flex-1 rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:bg-berry-deep"
        >
          Personalise
        </button>
        {!compact && (
          <Link
            href={`/card/${card.key}`}
            className={`hidden rounded-full border px-4 py-2 text-sm font-medium transition sm:inline-flex ${
              dark ? "border-white/20 text-cream/80 hover:border-white/40 hover:text-cream" : "border-ink/15 text-ink/80 hover:border-ink/30 hover:text-ink"
            }`}
          >
            View
          </Link>
        )}
      </div>
    </article>
  );
}
