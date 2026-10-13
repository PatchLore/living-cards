"use client";

import Link from "next/link";
import { useState } from "react";
import { type CatalogCard, getCard, occasionLine } from "../../../lib/catalog";
import CardArt from "../../../components/site/CardArt";

// Cards bought before the catalog existed may have keys it doesn't know.
const FALLBACK: CatalogCard = {
  key: "fallback",
  title: "Your card",
  description: "",
  category: "Christmas",
  kind: "live",
  sceneId: "moonlit-snow",
  poster: "/cards/live/moonlit-snow.jpg",
  shop: false,
};

export default function SharedCard({
  cardKey,
  recipient,
  message,
  certificateUrl,
}: {
  cardKey: string;
  recipient: string;
  message: string;
  certificateUrl: string | null;
}) {
  const card = getCard(cardKey) ?? FALLBACK;
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-night px-4 py-10 text-cream sm:py-14">
      <div className="starfield absolute inset-0 opacity-50" aria-hidden />
      <div className="snowfall absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <p className="text-center text-sm uppercase tracking-[0.25em] text-gold">{occasionLine(card)}</p>
        <h1 className="mt-3 text-center font-display text-3xl sm:text-4xl">A card for {recipient}</h1>

        <div className="relative mt-8 w-full max-w-[400px]">
          <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-2xl" />
          {opened ? (
            <CardArt card={card} recipient={recipient} message={message} className="shadow-2xl ring-1 ring-white/10" />
          ) : (
            <button
              type="button"
              onClick={() => setOpened(true)}
              aria-label="Open your card"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ aspectRatio: "2 / 3" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#7d1626] via-berry to-[#5c0f1b]" />
              {/* ribbon */}
              <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-gold-deep via-gold to-gold-deep opacity-90" />
              <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-b from-gold-deep via-gold to-gold-deep opacity-90" />
              <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-center shadow-xl transition duration-300 group-hover:scale-105">
                <span className="font-display text-lg leading-tight text-berry">
                  Tap to
                  <br />
                  open
                </span>
              </div>
            </button>
          )}
        </div>

        {opened && (
          <>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copy}
                className="flex-1 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-cream transition hover:bg-white/10"
              >
                {copied ? "Link copied ✓" : "Copy link to this card"}
              </button>
              <Link
                href="/#christmas"
                className="flex-1 rounded-full bg-berry px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-berry-deep"
              >
                Send a card back
              </Link>
            </div>
            <p className="mt-8 text-center text-sm text-cream/60">
              🌳 This card helps plant a real tree.
              {certificateUrl && (
                <>
                  {" "}
                  <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
                    View the tree certificate
                  </a>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
