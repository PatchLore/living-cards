 "use client";

import React, { useEffect, useRef, useState } from "react";

type CardItem = {
  key: string;
  title: string;
  desc: string;
  src: string;
  label?: string;
};

const CARDS: CardItem[] = [
  // Christmas Cards
  {
    key: "starlit-christmas-tree",
    title: "Starlit Christmas Tree",
    desc: "A bright Christmas tree glimmers warmly beneath a sky filled with soft winter stars. Gentle golden highlights create a magical and uplifting festive moment.",
    src: "/cards/christmas_tree.mp4",
    label: "Limited Edition",
  },
  {
    key: "christmas-night-moonlight",
    title: "Christmas Night Moonlight",
    desc: "A calm winter night unfolds beneath a glowing moon with gentle drifting snow. Soft atmospheric tones create a serene and peaceful seasonal moment.",
    src: "/cards/moonlight.mp4",
    label: "Limited Edition",
  },
  {
    key: "snowy-cottage-evening",
    title: "Snowy Cottage Evening",
    desc: "A cozy snow-covered cottage glows warmly beneath softly falling winter flakes. Peaceful gentle lighting creates a comforting and serene festive moment.",
    src: "/cards/Christmas2.mp4",
    label: "Limited Edition",
  },
  {
    key: "winter-forest-tree",
    title: "Winter Forest Tree",
    desc: "A beautiful Christmas tree stands bright within a quiet snow-covered forest. Calm drifting snowflakes create a peaceful and enchanting festive moment.",
    src: "/cards/XmasTree.mp4",
    label: "Limited Edition",
  },
  {
    key: "golden-christmas-tree-rise",
    title: "Golden Christmas Tree Rise",
    desc: "A radiant Christmas tree glows with warm golden light rising softly in the night. Elegant shimmering sparks create a refined and magical festive moment.",
    src: "/cards/Christmas1.mp4",
    label: "Limited Edition",
  },
  {
    key: "santas-moonlit-ride",
    title: "Santa's Moonlit Ride",
    desc: "Santa travels across a glowing winter sky surrounded by soft drifting starlight. Nostalgic warm tones create a timeless and comforting festive moment.",
    src: "/cards/Santa.mp4",
    label: "Limited Edition",
  },
  // Birthday Cards
  {
    key: "birthday-rose-bloom",
    title: "Birthday Rose Bloom",
    desc: "A single rose gently blooms in soft cinematic light with warm drifting golden dust. Smooth delicate motion creates a refined and beautifully elegant birthday moment.",
    src: "/cards/rose.mp4",
    label: "Limited Edition",
  },
  {
    key: "elegant-floral-birthday",
    title: "Elegant Floral Birthday",
    desc: "Soft watercolor florals bloom gracefully with delicate blush and ivory tones. Warm subtle highlights create a refined and beautifully elegant birthday moment.",
    src: "/cards/Birthday2.mp4",
    label: "Limited Edition",
  },
  // Thank You Cards
  {
    key: "thank-you-florals",
    title: "Thank You Florals",
    desc: "Soft neutral florals drift gracefully across a warm minimal background. Gentle balanced lighting creates a sincere and soothing moment of gratitude.",
    src: "/cards/Thankyou2.mp4",
    label: "Limited Edition",
  },
  // Love / Heart Cards
  {
    key: "heart-of-light",
    title: "Heart of Light",
    desc: "A glowing heart formed from warm golden light shines gently in the soft darkness. Smooth subtle tones create a tender and beautifully elegant romantic moment.",
    src: "/cards/heart1.mp4",
    label: "Limited Edition",
  },
  {
    key: "golden-heart-glow",
    title: "Golden Heart Glow",
    desc: "A radiant heart glows softly with shimmering golden energy in the quiet darkness. Warm calming highlights create a peaceful and deeply heartfelt romantic moment.",
    src: "/cards/heart2.mp4",
    label: "Limited Edition",
  },
  // General Cards
  {
    key: "warm-wishes",
    title: "Warm Wishes",
    desc: "Soft golden light moves gently across a warm glowing winter scene. Cozy subtle motion creates a comforting and heartfelt seasonal moment.",
    src: "/cards/warm_wishes.mp4",
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

  const CATEGORY_ORDER: Record<string, number> = {
    "Christmas": 0,
    "Birthday": 1,
    "Thank You": 2,
    "Love": 3,
    "General": 4,
  };

  function getCategory(cardKey: string): string {
    const k = cardKey.toLowerCase();
    if (k.includes("christmas") || k.includes("xmas") || k.includes("santa")) return "Christmas";
    if (k.includes("birthday")) return "Birthday";
    if (k.includes("thank")) return "Thank You";
    if (k.includes("heart") || k.includes("love")) return "Love";
    return "General";
  }

  const sortedCards = React.useMemo(() => {
    return [...CARDS].sort((a, b) => {
      const categoryA = getCategory(a.key);
      const categoryB = getCategory(b.key);
      const catA = CATEGORY_ORDER[categoryA] ?? 999;
      const catB = CATEGORY_ORDER[categoryB] ?? 999;

      if (catA !== catB) return catA - catB;

      // alphabetic fallback inside the same category
      return a.title.localeCompare(b.title);
    });
  }, []);

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
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() =>
              collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-amber-500/90 hover:bg-amber-500 text-white font-medium shadow-md transition"
          >
            Browse Limited Collection
          </button>
          <a
            href="/corporate"
            className="inline-flex items-center px-4 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-500 text-slate-100 font-medium transition"
          >
            For Business / Bulk Orders
          </a>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          For every digital card sent, we fund the planting of a real tree. Your small gesture makes a real-world impact. 🌱
        </div>
      </section>

      {/* Collection */}
      <section
        id="collection"
        ref={collectionRef}
        className="max-w-6xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {sortedCards.map((card) => (
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
            <p className="text-sm text-slate-700 mb-2">{card.desc}</p>
            <div className="text-sm text-slate-800 font-medium mb-3">£5 — Includes 1 tree planted 🌱</div>
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

              <div className="space-y-3">
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
                {/* Temporary Stripe Diagnostic Button - REMOVE AFTER TESTING */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">🔧 Stripe Diagnostic Tools:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/stripe-diagnostic");
                          const data = await res.json();
                          console.log("📊 Stripe Diagnostic:", data);
                          alert(`Diagnostic complete! Check console for details.\n\nIssues found: ${data.issues?.length || 0}\n\nSee browser console for full report.`);
                        } catch (error) {
                          console.error("Diagnostic error:", error);
                          alert("Failed to run diagnostic. Check console.");
                        }
                      }}
                      className="px-3 py-2 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Run Diagnostic
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          console.log("🧪 Testing POST /api/checkout...");
                          const res = await fetch("/api/checkout", { method: "POST" });
                          const data = await res.json();
                          console.log("✅ Checkout Response:", data);
                          
                          if (res.ok && data.id) {
                            if (data.id === "dummy-session-id-build") {
                              alert("⚠️ Checkout returned dummy session ID. STRIPE_SECRET_KEY may be missing.");
                            } else {
                              alert(`✅ Checkout successful!\n\nSession ID: ${data.id}\n\nNote: This endpoint returns session.id, not session.url. You may need to use Stripe.js to redirect.`);
                            }
                          } else {
                            alert(`❌ Checkout failed!\n\nError: ${data.error || "Unknown error"}\n\nCheck console for details.`);
                          }
                        } catch (error) {
                          console.error("❌ Checkout test error:", error);
                          alert("Failed to test checkout. Check console.");
                        }
                      }}
                      className="px-3 py-2 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Test Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
