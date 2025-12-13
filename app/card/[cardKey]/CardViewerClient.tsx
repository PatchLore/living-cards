"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function CardViewerClient({ cardKey }: { cardKey: string }) {
  const search = useSearchParams();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const r = search.get("recipient") || "";
    const m = search.get("message") || "";

    setRecipient(r);
    setMessage(m);
  }, [search]);

  const videoFile = CARD_VIDEO_MAP[cardKey];

  if (!videoFile) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center p-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-3">
            Card Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The card you're trying to view doesn't exist.
          </p>
          <a
            href="/"
            className="px-5 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition"
          >
            Return Home
          </a>
        </div>
      </main>
    );
  }

  const videoSrc = `/cards/${videoFile}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 px-6">
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">
          Your Digital Card 💌
        </h1>
        <p className="text-lg text-slate-600">
          Enjoy your beautifully animated card — ready to share.
        </p>
      </section>

      <section className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl shadow-lg mb-6"
        />

        {(recipient || message) && (
          <div className="text-center space-y-2 mb-8">
            {recipient && (
              <p className="text-xl font-semibold text-slate-800">
                To: {recipient}
              </p>
            )}
            {message && (
              <p className="text-slate-700 whitespace-pre-wrap">{message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoSrc}
            download={`${cardKey}.mp4`}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition"
          >
            Download Video
          </a>

          <button
            onClick={async () => {
              const shareURL = window.location.href;
              try {
                await navigator.clipboard.writeText(shareURL);
                alert("Share link copied!");
              } catch {
                alert("Failed to copy link.");
              }
            }}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium shadow-md hover:bg-slate-900 transition"
          >
            Copy Share Link
          </button>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-800 font-medium transition"
          >
            Send another card →
          </a>
        </div>
      </section>
    </main>
  );
}

