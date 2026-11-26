"use client";

import { useState } from "react";
import { H, W } from "../../../components/live-cards/engine";
import { SCENES_BY_ID } from "../../../components/live-cards";

// Development tool: renders each living card at its still frame and saves a
// JPEG poster (used for thumbnails, emails and social previews).
export default function PosterLab() {
  const [log, setLog] = useState<string[]>([]);

  const run = async () => {
    for (const scene of Object.values(SCENES_BY_ID)) {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      scene.draw(ctx, scene.stillTime);
      const res = await fetch("/api/dev/poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: scene.id, dataUrl: canvas.toDataURL("image/jpeg", 0.86) }),
      });
      const data = await res.json();
      setLog((l) => [...l, `${scene.id}: ${data.file ?? data.error}`]);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-2xl">Generate card posters</h1>
      <button onClick={run} className="mt-6 rounded-full bg-berry px-5 py-2.5 font-semibold text-white">
        Render and save all
      </button>
      <ul className="mt-6 space-y-1 font-mono text-sm">
        {log.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </main>
  );
}
