"use client";

import { useEffect, useState } from "react";
import { CHRISTMAS_SCENES, LiveCard } from "../../../components/live-cards";

export default function ChristmasLab() {
  const [recipient, setRecipient] = useState("Sarah");
  const [message, setMessage] = useState("Wishing you a season full of warmth, light and everyone you love.");
  const [sender, setSender] = useState("Tom");
  const [playKey, setPlayKey] = useState(0);
  // ?t=4.5 freezes every card at that second (handy for checking a moment or grabbing a poster)
  const [freezeAt, setFreezeAt] = useState<number | undefined>();
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t");
    if (t !== null && !Number.isNaN(Number(t))) setFreezeAt(Number(t));
  }, []);

  const input =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-amber-300/60 focus:outline-none";

  return (
    <main className="min-h-screen bg-[#07090d] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold">Live Christmas cards</h1>
        <p className="mt-1 text-sm text-white/60">
          Drawn entirely in code (canvas + GSAP). No video files, no AI images.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
          <label className="text-xs text-white/60">
            To
            <input className={input} value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </label>
          <label className="text-xs text-white/60">
            Message
            <input className={input} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <label className="text-xs text-white/60">
            From
            <input className={input} value={sender} onChange={(e) => setSender(e.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => setPlayKey((k) => k + 1)}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-black hover:bg-amber-300"
          >
            Replay
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHRISTMAS_SCENES.map((scene) => (
            <figure key={scene.id}>
              <LiveCard scene={scene} recipient={recipient} message={message} sender={sender} playKey={playKey} freezeAt={freezeAt} />
              <figcaption className="mt-2 text-sm text-white/70">{scene.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
