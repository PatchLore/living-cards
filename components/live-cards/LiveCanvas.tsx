"use client";

import { useEffect, useRef } from "react";
import { H, W, type LiveScene } from "./engine";

type Props = {
  scene: LiveScene;
  playKey?: number;
  /** Render a single still frame at this time (s) instead of animating. */
  freezeAt?: number;
  /** Cap redraws, e.g. for small thumbnails where 60fps isn't noticeable. */
  maxFps?: number;
  /** A poster shows underneath, so nothing needs drawing until the animation starts. */
  overPoster?: boolean;
};

let pageReady: Promise<void> | undefined;

/** Resolves once the page has loaded and gone idle, so animations don't compete with loading. */
function whenPageReady() {
  return (pageReady ??= new Promise((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? requestIdleCallback(() => resolve(), { timeout: 1000 }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    // Don't let one slow asset hold the cards still for long.
    setTimeout(resolve, 5000);
  }));
}

/** Share of the card that must be on screen before it animates; a sliver at the edge just gets a still. */
export const PLAY_RATIO = 0.15;

/** Fraction of an element inside the viewport, 0 when it is entirely off screen. */
export function visibleFraction(el: Element) {
  const r = el.getBoundingClientRect();
  if (r.bottom <= 0 || r.right <= 0 || r.top >= window.innerHeight || r.left >= window.innerWidth || !r.height) return 0;
  return (Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height || Number.EPSILON;
}

/**
 * Runs a scene on a hi-DPI canvas. Draws only while on screen, and holds a
 * still first frame (or the poster) until the page has finished loading.
 */
export default function LiveCanvas({ scene, playKey = 0, freezeAt, maxFps, overPoster }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = freezeAt !== undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let elapsed = freezeAt ?? (still ? scene.stillTime : 0);
    let last = 0;
    let lastDraw = 0;
    let raf = 0;
    const minGap = maxFps ? 1000 / maxFps - 2 : 0;
    let ready = false;
    // Close enough to draw a first frame (unknown until the observer first reports),
    // and far enough on screen to animate.
    let near: boolean | null = null;
    let inView = false;
    // Nothing drawn since the canvas was created, resized or replayed.
    let stale = true;
    let cancelled = false;

    const render = () => {
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      scene.draw(ctx, elapsed);
      stale = false;
    };

    const loop = (now: number) => {
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      if (now - lastDraw >= minGap) {
        lastDraw = now;
        render();
      }
      raf = requestAnimationFrame(loop);
    };

    const update = () => {
      if (near === null) {
        const f = visibleFraction(canvas);
        near = f > 0;
        inView = f >= PLAY_RATIO;
      }
      if (stale && (overPoster ? ready && inView : near)) render();
      if (ready && inView && !still) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round((canvas.clientWidth * dpr * H) / W));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        stale = true;
        update();
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= PLAY_RATIO;
        if (inView) near = true;
        update();
      },
      { threshold: [0, PLAY_RATIO] },
    );
    io.observe(canvas);
    // Draws the first frame just before the card scrolls in, so it never shows up blank.
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        update();
      },
      { rootMargin: "50% 0px" },
    );
    nearIo.observe(canvas);
    whenPageReady().then(() => {
      if (cancelled) return;
      ready = true;
      update();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      nearIo.disconnect();
    };
  }, [scene, playKey, freezeAt, maxFps, overPoster]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
