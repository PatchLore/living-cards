"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { fitScale, textBoxFits } from "../../lib/fitText";
import { kidsFontVariables } from "./kidsFonts";

/**
 * Hand-made details for the Kids keepsakes (seals, stamps, signatures), all
 * inline SVG so they print crisply and need no image files.
 */

/** A small stable number from text, for certificate and receipt numbers. */
export function stableNumber(text: string, digits = 4) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619);
  return String(Math.abs(hash) % 10 ** digits).padStart(digits, "0");
}

/** The Christmas a card belongs to: from June onwards it's this year's. */
export const christmasYear = (date = new Date()) => (date.getMonth() >= 5 ? date.getFullYear() : date.getFullYear() - 1);

const scallop = (() => {
  const lobes = 26;
  const points = Array.from({ length: lobes }, (_, i) => {
    const a0 = (i / lobes) * Math.PI * 2;
    const a1 = ((i + 0.5) / lobes) * Math.PI * 2;
    const a2 = ((i + 1) / lobes) * Math.PI * 2;
    const p = (a: number, r: number) => `${(60 + r * Math.cos(a)).toFixed(2)} ${(60 + r * Math.sin(a)).toFixed(2)}`;
    return `${i === 0 ? `M${p(a0, 50)}` : ""} Q${p(a1, 58)} ${p(a2, 50)}`;
  });
  return `${points.join(" ")} Z`;
})();

/** A red wax seal with a ring of lettering and an emblem in the middle. */
export function WaxSeal({ ring, emblem = "star", ribbon = false, className }: { ring: string; emblem?: "star" | "tooth" | "tree"; ribbon?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" viewBox="0 0 120 150" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-wax`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#d9555a" />
          <stop offset=".6" stopColor="#a3262c" />
          <stop offset="1" stopColor="#6e1519" />
        </radialGradient>
        <path id={`${id}-ring`} d="M60 60 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" />
      </defs>
      {ribbon && (
        <g>
          <path d="M44 92 L30 146 L42 138 L50 148 L60 98 Z" fill="#b8862f" />
          <path d="M76 92 L90 146 L78 138 L70 148 L60 98 Z" fill="#d4a373" />
        </g>
      )}
      <path d={scallop} fill={`url(#${id}-wax)`} />
      <circle cx="60" cy="60" r="41" fill="none" stroke="#5c1014" strokeWidth="2.5" opacity=".55" />
      <circle cx="60" cy="60" r="27" fill="none" stroke="#f3c9a8" strokeWidth="1.2" opacity=".55" />
      <text fontFamily="Georgia, serif" fontSize="9.5" fontWeight="700" letterSpacing="1.6" fill="#fbe3cf" opacity=".9">
        <textPath href={`#${id}-ring`} startOffset="0">{ring}</textPath>
      </text>
      {emblem === "star" && <path d="M60 41 L65.5 54 L79.5 54.5 L68.5 63 L72.5 76.5 L60 68.5 L47.5 76.5 L51.5 63 L40.5 54.5 L54.5 54 Z" fill="#fbe3cf" opacity=".95" />}
      {emblem === "tree" && <path d="M60 40 L74 60 L66 60 L78 76 L42 76 L54 60 L46 60 Z M57 76 h6 v6 h-6 Z" fill="#fbe3cf" opacity=".95" />}
      {emblem === "tooth" && <path d="M48 46 C48 40 56 40 60 44 C64 40 72 40 72 46 C72 56 70 60 69 70 C68 77 64 77 63 70 L61 62 C60.5 60 59.5 60 59 62 L57 70 C56 77 52 77 51 70 C50 60 48 56 48 46 Z" fill="#fbe3cf" opacity=".95" />}
      <ellipse cx="44" cy="40" rx="13" ry="7" transform="rotate(-30 44 40)" fill="#ffffff" opacity=".18" />
    </svg>
  );
}

/** A perforated postage stamp with a postmark struck across one corner. */
export function PostageStamp({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const holes = [];
  for (let x = 6; x <= 84; x += 8) holes.push([x, 2], [x, 108]);
  for (let y = 10; y <= 100; y += 8) holes.push([2, y], [88, y]);
  return (
    <svg aria-hidden="true" viewBox="0 0 130 112" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`${id}-perf`}>
          <rect width="90" height="110" fill="#fff" />
          {holes.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill="#000" />)}
        </mask>
      </defs>
      <g mask={`url(#${id}-perf)`}>
        <rect width="90" height="110" fill="#fffdf6" />
        <rect x="9" y="9" width="72" height="92" fill="#1b4332" />
        <circle cx="58" cy="30" r="9" fill="#f4e3b5" />
        <path d="M45 80 L45 60 L36 60 L45 46 L39 46 L50 30 L61 46 L55 46 L64 60 L55 60 L55 80 Z" fill="#40916c" />
        <path d="M14 86 Q30 78 45 84 T80 82 L81 101 L9 101 L9 88 Z" fill="#f8fbff" />
        <text x="45" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fontWeight="700" fill="#f4e3b5" letterSpacing=".6">NORTH POLE</text>
        <text x="16" y="97" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#bc4749">1st</text>
      </g>
      <g fill="none" stroke="#6b4a3a" strokeWidth="1.6" opacity=".75">
        <circle cx="94" cy="64" r="24" />
        <circle cx="94" cy="64" r="18" />
        {[0, 8, 16, 24].map(dy => <path key={dy} d={`M58 ${52 + dy} q8 -5 16 0 t16 0 t16 0 t16 0`} />)}
      </g>
      <text x="94" y="62" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6.5" fontWeight="700" fill="#6b4a3a" opacity=".85">REINDEER</text>
      <text x="94" y="71" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6.5" fontWeight="700" fill="#6b4a3a" opacity=".85">POST</text>
    </svg>
  );
}

/** The loop under a handwritten signature. */
export function Flourish({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 24" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 C40 4 70 22 98 12 C120 4 132 6 128 14 C124 22 108 18 120 12 C140 2 170 10 196 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Two holly leaves and berries, used as a divider. */
export function HollyDivider({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 28" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 14 H82 M138 14 H212" stroke="#b8862f" strokeWidth="1.5" />
      <path d="M110 14 C100 4 88 6 84 10 C90 11 88 15 92 16 C88 18 90 22 86 23 C94 26 104 22 110 14 Z" fill="#2d6a4f" />
      <path d="M110 14 C120 4 132 6 136 10 C130 11 132 15 128 16 C132 18 130 22 134 23 C126 26 116 22 110 14 Z" fill="#40916c" />
      <circle cx="106" cy="16" r="4" fill="#bc4749" /><circle cx="114" cy="16" r="4" fill="#bc4749" /><circle cx="110" cy="10" r="4" fill="#d6555a" />
    </svg>
  );
}

/** A swirl for one corner of the certificate frame; rotate it for the others. */
export function CornerFlourish({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 60" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#b8862f" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 56 V12 Q4 4 12 4 H56" />
        <path d="M10 50 V18 Q10 10 18 10 H50" opacity=".6" />
        <path d="M16 16 C24 10 34 16 28 22 C24 26 20 20 24 18" />
      </g>
      <circle cx="16" cy="16" r="2.4" fill="#bc4749" />
    </svg>
  );
}

/** Queen Celeste's crest: a tooth with wings and a little crown. */
export function ToothFairyCrest({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M58 46 C40 20 14 22 8 34 C20 34 26 40 30 48 C36 44 48 44 58 50 Z" fill="#c7d2fe" stroke="#312e81" strokeWidth="2" />
      <path d="M62 46 C80 20 106 22 112 34 C100 34 94 40 90 48 C84 44 72 44 62 50 Z" fill="#e0e7ff" stroke="#312e81" strokeWidth="2" />
      <path d="M44 36 C44 28 54 28 60 33 C66 28 76 28 76 36 C76 50 73 55 72 68 C71 78 65 78 64 68 L62 58 C61.5 55.5 58.5 55.5 58 58 L56 68 C55 78 49 78 48 68 C47 55 44 50 44 36 Z" fill="#ffffff" stroke="#312e81" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M50 22 L53 14 L58 20 L60 10 L62 20 L67 14 L70 22 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M96 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z M20 10 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5 Z" fill="#facc15" />
    </svg>
  );
}

/** Decorative barcode bars generated from the receipt number. */
export function Barcode({ seed, className }: { seed: string; className?: string }) {
  const bars: [number, number][] = [];
  let x = 0;
  for (const char of `*${seed}*${seed}`) {
    const code = char.codePointAt(0)!;
    for (let bit = 0; bit < 4; bit++) {
      const width = 1 + ((code >> bit) & 1) * 2;
      if (bit % 2 === 0) bars.push([x, width]);
      x += width + 1;
    }
  }
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${x} 30`} preserveAspectRatio="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {bars.map(([bx, w]) => <rect key={bx} x={bx} y="0" width={w} height="30" fill="#1f2937" />)}
    </svg>
  );
}

/** A rubber stamp, struck at an angle in red ink. */
export function InkStamp({ lines, className }: { lines: [string, string]; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 90" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#bc4749" strokeWidth="4" opacity=".82">
        <rect x="4" y="4" width="192" height="82" rx="10" />
        <rect x="12" y="12" width="176" height="66" rx="6" strokeWidth="1.6" />
      </g>
      <text x="100" y="46" textAnchor="middle" fontFamily="Georgia, serif" fontSize="30" fontWeight="700" letterSpacing="4" fill="#bc4749" opacity=".85">{lines[0]}</text>
      <text x="100" y="68" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" letterSpacing="3" fill="#bc4749" opacity=".85">{lines[1]}</text>
    </svg>
  );
}

/**
 * Text that shrinks (down to 60%) until it fits its box in `maxLines` lines,
 * measured in the browser after fonts load. If nothing fits, it wraps mid-word.
 * Size it with the --fit-size custom property.
 */
export function FitText({ children, fitKey, maxLines = 1, className = "", style }: { children: ReactNode; fitKey: string; maxLines?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (!el.clientWidth) return;
      delete el.dataset.wrap;
      const fits = (scale: number) => {
        el.style.setProperty("--fit", String(scale));
        const cs = getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
        return textBoxFits({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, height: el.getBoundingClientRect().height, lineHeight }, maxLines);
      };
      if (fitScale(fits) === null) {
        el.style.setProperty("--fit", "0.6");
        el.dataset.wrap = "anywhere";
      }
    };
    run();
    const observer = new ResizeObserver(run);
    if (el.parentElement) observer.observe(el.parentElement);
    document.fonts?.ready.then(run).catch(() => {});
    return () => observer.disconnect();
  }, [fitKey, maxLines]);
  return <span ref={ref} className={`kc-fit ${className}`} style={style}>{children}</span>;
}

/**
 * A print-only copy of a keepsake. It lives under <body> (so printing shows
 * just this sheet, on A4 or A5) and sits off-screen until then, where text
 * fitting can still measure it.
 */
/** A4's printable height (297mm less 12mm margins) at 96 CSS px per inch, with a little slack. */
const PAGE_HEIGHT_PX = Math.floor(((297 - 24) / 25.4) * 96) - 12;

export function PrintSheet({ children, label }: { children: ReactNode; label: string }) {
  const [mounted, setMounted] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  // Keep every keepsake on one page: if it's taller than A4, scale the sheet down to fit.
  useEffect(() => {
    const el = sheet.current;
    if (!mounted || !el) return;
    const fit = () => {
      el.style.zoom = "1";
      const height = el.offsetHeight;
      if (height > PAGE_HEIGHT_PX) el.style.zoom = String(Math.floor((PAGE_HEIGHT_PX / height) * 1000) / 1000);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el.firstElementChild ?? el);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;
  return createPortal(
    <div className={`kids-print-root kc-print ${kidsFontVariables}`} aria-hidden="true" data-print-label={label}>
      <div ref={sheet} className="kc-print-sheet">{children}</div>
    </div>,
    document.body,
  );
}
