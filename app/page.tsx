 "use client";

import { useEffect, useRef, useState } from "react";

type CardItem = {
  key: string;
  title: string;
  desc: string;
  src: string;
  label?: string;
};

const CARDS: CardItem[] = [
  {
    key: "christmas_tree",
    title: "Starlit Christmas Tree",
    desc: "A warm festive glow with gentle, shimmering lights.",
    src: "/cards/christmas_tree.mp4",
    label: "Limited Edition",
  },
  {
    key: "warm_wishes",
    title: "Warm Wishes",
    desc: "Soft golden tones with cozy motion and gentle sparkle.",
    src: "/cards/warm_wishes.mp4",
    label: "Limited Edition",
  },
  {
    key: "with_love",
    title: "With Love",
    desc: "A tender animation filled with warmth and heartfelt charm.",
    src: "/cards/with_love.mp4",
    label: "Limited Edition",
  },
];

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const collectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const selectedCardItem = CARDS.find((c) => c.key === selectedCard) ?? null;

  useEffect(() => {
    if (selectedCard && formRef.current) {
      // small timeout to allow layout changes before scrolling
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [selectedCard]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 px-6 relative overflow-hidden">

      {/* Decorative soft vignette / blur (visuals added later) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"></div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center space-y-6 mb-12">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-slate-800">
          Limited Edition Digital Cards That Plant a Tree
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          A beautiful animated card. A personal message. A real tree planted.
        </p>
        <div className="pt-4">
          <button
            onClick={() =>
              collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-amber-500/90 hover:bg-amber-500 text-white font-medium shadow-md transition"
          >
            Browse Limited Collection
          </button>
        </div>
      </section>

      {/* Collection */}
      <section
        id="collection"
        ref={collectionRef}
        className="max-w-6xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {CARDS.map((card) => (
          <article
            key={card.key}
            className="rounded-3xl bg-white border border-slate-200 p-4 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition transform"
          >
            <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-2">
              {card.label}
            </div>
            <div className="rounded-2xl overflow-hidden mb-4">
              <video
                className="w-full h-56 object-cover"
                src={card.src}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{card.title}</h3>
            <p className="text-sm text-slate-700 mb-4">{card.desc}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCard(card.key)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
              >
                Select This Card
              </button>
              <button
                onClick={() => {
                  setSelectedCard(card.key);
                  // also scroll to form
                  formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Personalize
              </button>
            </div>
          </article>
        ))}

        {/* Placeholder tiles for future cards */}
        {/*
        <article className="rounded-3xl bg-white border border-slate-200 p-4 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-2">Limited Edition</div>
          <div className="rounded-2xl overflow-hidden mb-4 h-56 bg-slate-100" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Coming Soon</h3>
          <p className="text-sm text-slate-700 mb-4">More curated cards arriving this season.</p>
        </article>
        */}
      </section>

      {/* Personalization Form (hidden until a card is selected) */}
      <div className="max-w-3xl mx-auto" ref={formRef}>
        {selectedCardItem && (
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-7">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Personalize Your Card — {selectedCardItem.title}
            </h2>
            <p className="text-sm text-slate-700 mb-6">Step 2 — Add a personal touch to your selected card.</p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-800 font-medium">Recipient name</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-green-500/40 bg-white"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., Maya"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-800 font-medium">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-green-500/40 bg-white resize-none h-32"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a heartfelt message..."
                  maxLength={240}
                />
                <p className="text-xs text-right text-slate-700">{message.length}/240</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold shadow-md">
                  Continue to Payment
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-700"
                >
                  Back to Collection
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
