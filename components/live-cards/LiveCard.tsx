"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import LiveCanvas, { PLAY_RATIO, visibleFraction } from "./LiveCanvas";
import type { LiveScene } from "./engine";
import { scriptFont, serifFont } from "./fonts";

type TextStyle = LiveScene["text"];

/** Text styling for video cards, which have no scene of their own. */
const VIDEO_TEXT: TextStyle = {
  title: "",
  delay: 0.8,
  color: "#fbf6ec",
  accent: "#f1d58f",
  glow: "0 0 14px rgba(255,200,120,0.55)",
  scrim: "linear-gradient(to bottom, rgba(6,9,16,0) 0%, rgba(6,9,16,0.6) 40%, rgba(6,9,16,0.88) 100%)",
};

type Props = {
  /** A code-drawn scene, or… */
  scene?: LiveScene;
  /** …a video card. */
  video?: { src: string; poster: string };
  recipient?: string;
  message?: string;
  sender?: string;
  /** Change to replay the card from the start. */
  playKey?: number;
  /** Show a still frame at this time (s), with the text fully revealed. */
  freezeAt?: number;
  /** Hide the greeting title (e.g. on small thumbnails). */
  hideTitle?: boolean;
  /** Cap the animation frame rate (thumbnails). */
  maxFps?: number;
  /** Still image under a code-drawn scene: shows before it starts and gives search engines an image. */
  poster?: { src: string; alt: string; fetchPriority?: "high" | "low" | "auto" };
  className?: string;
};

/** `sizes` for poster images, which render at most ~420px wide. */
export const POSTER_SIZES = "(min-width: 480px) 420px, 100vw";

function CardVideo({ src, poster, playKey }: { src: string; poster: string; playKey: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Attach the video file only as the card nears the screen, so a page of video
  // cards doesn't fetch every video header on load. The poster stays in the HTML
  // as a lazy image, so the card is never blank and crawlers still see it.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px" });
    io.observe(v);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !near) return;
    v.currentTime = 0;
    // Only play while on screen; saves battery and data on long pages.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, [playKey, near]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" aria-hidden loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={near ? poster : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
    </>
  );
}

export default function LiveCard({
  scene,
  video,
  recipient,
  message,
  sender,
  playKey = 0,
  freezeAt,
  hideTitle,
  maxFps,
  poster,
  className = "",
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const text = scene?.text ?? VIDEO_TEXT;
  const title = hideTitle ? "" : text.title;
  const hasText = !!(title || recipient || message || sender);
  const long = (message?.length ?? 0) > 160;

  useLayoutEffect(() => {
    const root = textRef.current;
    if (!root) return;
    const reduce = freezeAt !== undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only cards on screen play the intro. The rest show their text straight away,
    // as they would by the time anyone scrolls to them, which spares a page of
    // cards dozens of offscreen per-letter tweens while it loads.
    if (visibleFraction(boxRef.current!) < PLAY_RATIO) return;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({ delay: text.delay });
      if (root.querySelector("[data-ch]")) {
        tl.from("[data-ch]", {
          opacity: 0,
          y: 18,
          filter: "blur(8px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.055,
        });
      }
      if (root.querySelector("[data-line]")) {
        tl.from("[data-line]", { opacity: 0, y: 14, duration: 0.9, ease: "power2.out", stagger: 0.35 }, "-=0.4");
      }
    }, root);
    return () => ctx.revert();
    // Text edits shouldn't replay the intro; playKey does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, video?.src, playKey, freezeAt, text.delay, hideTitle]);

  return (
    <div
      ref={boxRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-[#05070b] ${className}`}
      // Text is sized in cqw; only cards with text need to be size containers,
      // which makes layout of a long grid slower.
      style={{ aspectRatio: "2 / 3", containerType: hasText ? "inline-size" : undefined }}
    >
      {scene && poster && (
        <Image
          src={poster.src}
          alt={poster.alt}
          width={900}
          height={1350}
          sizes={POSTER_SIZES}
          loading="eager"
          fetchPriority={poster.fetchPriority}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {scene && <LiveCanvas scene={scene} playKey={playKey} freezeAt={freezeAt} maxFps={maxFps} overPoster={!!poster} />}
      {video && <CardVideo src={video.src} poster={video.poster} playKey={playKey} />}
      {hasText && (
        <div
          ref={textRef}
          className={`pointer-events-none absolute inset-x-0 bottom-0 text-center ${serifFont.className}`}
          style={{ padding: "24cqw 8cqw 9cqw", background: text.scrim, color: text.color }}
        >
          {title && (
            <p
              aria-label={title}
              className={scriptFont.className}
              style={{
                fontSize: `${Math.min(12, 165 / title.length)}cqw`,
                lineHeight: 1.1,
                color: text.accent,
                textShadow: text.glow,
              }}
            >
              {title.split(" ").map((word, w) => (
                <Fragment key={w}>
                  {w > 0 && " "}
                  <span aria-hidden className="inline-block whitespace-nowrap">
                    {Array.from(word).map((ch, i) => (
                      <span key={i} data-ch className="inline-block">
                        {ch}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </p>
          )}
          {recipient && (
            <p data-line style={{ fontSize: "5.6cqw", fontStyle: "italic", marginTop: title ? "3cqw" : 0 }}>
              Dear {recipient},
            </p>
          )}
          {message && (
            <p
              data-line
              className="whitespace-pre-wrap break-words"
              style={{ fontSize: long ? "3.9cqw" : "4.6cqw", lineHeight: 1.35, marginTop: "2cqw", opacity: 0.92 }}
            >
              {message}
            </p>
          )}
          {sender && (
            <p data-line style={{ fontSize: "4.6cqw", fontStyle: "italic", marginTop: "3cqw", color: text.accent }}>
              With love, {sender}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
