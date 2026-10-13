"use client";

import { useEffect, useRef } from "react";
import { H, W, type LiveScene } from "./engine";

type Props = {
  scene: LiveScene;
  playKey?: number;
  /** Render a single still frame at this time (s) instead of animating. */
  freezeAt?: number;
};

/** Runs a scene on a hi-DPI canvas; pauses while offscreen. */
export default function LiveCanvas({ scene, playKey = 0, freezeAt }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = freezeAt !== undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let elapsed = freezeAt ?? (still ? scene.stillTime : 0);
    let last = 0;
    let raf = 0;

    const render = () => {
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      scene.draw(ctx, elapsed);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round((w * dpr * H) / W));
      render();
    };

    const loop = (now: number) => {
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      render();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (still || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [scene, playKey, freezeAt]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
