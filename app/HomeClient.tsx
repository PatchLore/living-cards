"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  type CatalogCard,
  CHRISTMAS_CLASSIC,
  CHRISTMAS_LIVE,
  HALLOWEEN,
  HALLOWEEN_ENDS,
  OTHER_OCCASIONS,
  PRICE_LABEL,
  getCard,
} from "../lib/catalog";
import CardArt from "../components/site/CardArt";
import { PersonalizeDialog } from "../components/site/Personalize";
import { FAQ } from "../lib/seo";

const HERO_CARD = getCard("live-santa-sleigh")!;


function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-berry">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-ink/70 sm:text-lg">{children}</p>}
    </div>
  );
}

function CardTile({
  card,
  onPersonalize,
  compact,
  dark,
}: {
  card: CatalogCard;
  onPersonalize: (c: CatalogCard) => void;
  compact?: boolean;
  /** Light text for tiles on a dark section. */
  dark?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <button
        type="button"
        onClick={() => onPersonalize(card)}
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
      <div className="mt-3 flex items-start justify-between gap-3">
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
          onClick={() => onPersonalize(card)}
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

export default function Home() {
  const [active, setActive] = useState<CatalogCard | null>(null);
  const [heroName, setHeroName] = useState("Grandma");
  const close = useCallback(() => setActive(null), []);
  // Hides itself after 31 October without a redeploy (the homepage renders per request).
  const showHalloween = HALLOWEEN.length > 0 && Date.now() < HALLOWEEN_ENDS.getTime();

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-night text-cream">
        <div className="starfield absolute inset-0 opacity-60" aria-hidden />
        <div className="snowfall absolute inset-0 opacity-40" aria-hidden />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28">
          <div>
            {showHalloween && (
              <a
                href="#halloween"
                className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#ff8c2a]/15 px-3 py-1 text-sm font-medium text-[#ffb35c] ring-1 ring-[#ff8c2a]/40 transition hover:bg-[#ff8c2a]/25"
              >
                🎃 Halloween cards are here <span aria-hidden>→</span>
              </a>
            )}
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              ✦ The Christmas collection
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Christmas cards that <em className="text-gold">come alive</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
              Animated scenes with their name and your message written right into the magic. Delivered instantly by
              email for {PRICE_LABEL}, and every card helps plant a real tree.
            </p>

            <div className="mt-8 max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <label htmlFor="hero-name" className="text-sm text-cream/70">
                Try it: who&apos;s your card for?
              </label>
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
                  onClick={() => setActive(HERO_CARD)}
                  className="shrink-0 rounded-xl bg-berry px-5 py-3 font-semibold text-white transition hover:bg-berry-deep"
                >
                  Send it
                </button>
              </div>
            </div>

            <ul className="mt-8 grid max-w-xl gap-3 text-sm text-cream/80 sm:grid-cols-3">
              <li className="flex items-center gap-2"><span aria-hidden>⚡</span> Arrives instantly</li>
              <li className="flex items-center gap-2"><span aria-hidden>✍️</span> Personalised animation</li>
              <li className="flex items-center gap-2"><span aria-hidden>🌳</span> Helps plant a tree</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[380px]">
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-2xl" />
            <CardArt
              card={HERO_CARD}
              withPoster
              recipient={heroName.trim()}
              message="Wishing you a magical Christmas and a very happy new year. Love from all of us."
              className="shadow-2xl ring-1 ring-white/10"
            />
            <p className="mt-3 text-center text-xs text-cream/50">Live preview: type a name to see it in the card</p>
          </div>
        </div>
      </section>

      {/* ---------- Halloween (until 31 October) ---------- */}
      {showHalloween && (
        <section id="halloween" className="relative scroll-mt-16 overflow-hidden bg-[#1a0c26] px-4 py-20 text-cream sm:px-6 lg:px-8">
          <div className="starfield absolute inset-0 opacity-40" aria-hidden />
          <div aria-hidden className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#ff8c2a]/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffa53a]">Until 31 October</p>
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Halloween cards</h2>
              <p className="mt-4 text-cream/70 sm:text-lg">
                Spooky, and not-so-spooky, living cards for friends, family and little ones.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-3">
              {HALLOWEEN.map((card) => (
                <CardTile key={card.key} card={card} onPersonalize={setActive} dark />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Living Christmas collection ---------- */}
      <section id="christmas" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="New for Christmas" title="The living Christmas collection">
          Each scene is animated live, so your greeting, their name and your message appear inside the card itself.
        </SectionHeading>
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-5 lg:gap-x-6">
          {CHRISTMAS_LIVE.map((card) => (
            <CardTile key={card.key} card={card} onPersonalize={setActive} />
          ))}
        </div>
      </section>

      {/* ---------- Classic Christmas ---------- */}
      <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Also for Christmas" title="Classic animated cards">
          Our original hand-picked Christmas animations, with your message added to the card.
        </SectionHeading>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
          {CHRISTMAS_CLASSIC.map((card) => (
            <CardTile key={card.key} card={card} onPersonalize={setActive} compact />
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Simple as that" title="How it works" />
        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            ["Pick a scene", "Choose from the living collection or our classic animations."],
            ["Make it theirs", "Add their name and your message, and watch them appear in the card as you type."],
            ["Send it instantly", `Pay ${PRICE_LABEL} and we email you the card link to share however you like. A tree gets planted too.`],
          ].map(([title, body], i) => (
            <li key={title} className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-berry font-display text-lg text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Why ---------- */}
      <section className="relative overflow-hidden bg-pine px-4 py-20 text-cream sm:px-6 lg:px-8">
        <div className="snowfall absolute inset-0 opacity-25" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">A card that gives back</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">No paper, no postage, no landfill. Just a tree.</h2>
            <p className="mt-5 leading-relaxed text-cream/75">
              Billions of paper cards are thrown away after Christmas. A CardRoots card is kept as a link they can open
              again and again, and every one sold helps fund planting a real tree.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["Instant", "Delivered the moment you pay"],
              [PRICE_LABEL, "Per card, no postage"],
              ["1 tree", "Planted with every card"],
              ["Any device", "Nothing to download"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <dt className="font-display text-2xl text-gold">{k}</dt>
                <dd className="mt-1 text-sm text-cream/70">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Other occasions ---------- */}
      <section id="occasions" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="All year round" title="Birthdays, thank yous & love" />
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
          {OTHER_OCCASIONS.map((card) => (
            <CardTile key={card.key} card={card} onPersonalize={setActive} compact />
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-16 bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Questions" title="Good to know" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                {q}
                <span aria-hidden className="text-xl text-berry transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Business + final CTA ---------- */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-night p-8 text-cream sm:p-12">
            <div className="starfield absolute inset-0 opacity-50" aria-hidden />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl">Still need a card for someone?</h2>
              <p className="mt-3 max-w-md text-cream/70">It takes two minutes, and it&apos;s with them before the kettle boils.</p>
              <a
                href="#christmas"
                className="mt-7 inline-flex rounded-full bg-berry px-6 py-3 font-semibold text-white transition hover:bg-berry-deep"
              >
                Choose a Christmas card
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white p-8 sm:p-10">
            <h3 className="font-display text-2xl text-ink">Sending to clients or your team?</h3>
            <p className="mt-3 text-ink/70">Bulk pricing for teams and businesses. Request a quote and we reply within a working day.</p>
            <Link href="/corporate" className="mt-6 inline-flex font-semibold text-berry hover:text-berry-deep">
              Business cards →
            </Link>
          </div>
        </div>
      </section>

      {active && <PersonalizeDialog card={active} initialRecipient={active === HERO_CARD ? heroName.trim() : ""} onClose={close} />}
    </main>
  );
}
