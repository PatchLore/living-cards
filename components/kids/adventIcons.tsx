import type { ReactNode } from "react";
import { SQUISHY_CHARACTERS, SquishyPortrait } from "./squishyCharacters";

/** Advent door illustrations, drawn on a 100×100 grid in the squishy kit’s palette and outline. */
const INK = "#1b4332";
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const character = (id: string) => SQUISHY_CHARACTERS.find(item => item.id === id)!;

const starPoints = (cx: number, cy: number, outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? inner : outer;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");

const Sparkle = ({ x, y, r = 4, fill = "#facc15" }: { x: number; y: number; r?: number; fill?: string }) => (
  <path d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`} fill={fill} />
);

const CHARACTER_DAYS: Record<number, string> = { 2: "robin", 5: "reindeer", 7: "fox", 8: "gingerbread", 13: "snowman", 19: "penguin" };

const ICONS: Record<number, () => ReactNode> = {
  1: () => (
    <>
      <circle cx="50" cy="52" r="34" fill="#facc15" opacity=".22" />
      <circle cx="50" cy="13" r="5" fill="none" {...line} />
      <path d="M38 27 L62 27 L57 18 L43 18 Z" fill="#bc4749" {...line} />
      <rect x="34" y="27" width="32" height="44" rx="7" fill="#fff3c4" {...line} />
      <path d="M50 36 C59 47 57 58 50 61 C43 58 41 47 50 36 Z" fill="#f4a261" />
      <path d="M50 46 C54 51 53 57 50 58 C47 57 46 51 50 46 Z" fill="#fde68a" />
      <rect x="30" y="71" width="40" height="9" rx="3" fill="#bc4749" {...line} />
      <Sparkle x={78} y={30} r={5} />
    </>
  ),
  3: () => (
    <>
      {[38, 48, 58].map(x => <path key={x} d={`M${x} 28 C${x - 5} 22 ${x + 5} 17 ${x} 10`} fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />)}
      <path d="M68 50 C84 50 84 72 68 72" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M68 50 C84 50 84 72 68 72" fill="none" stroke="#bc4749" strokeWidth="5" strokeLinecap="round" />
      <path d="M24 38 L72 38 L68 82 Q67 88 60 88 L36 88 Q29 88 28 82 Z" fill="#bc4749" {...line} />
      <ellipse cx="48" cy="38" rx="24" ry="6" fill="#7f4f24" {...line} />
      {[38, 48, 58].map(x => <rect key={x} x={x - 5} y="31" width="10" height="8" rx="3" fill="#ffffff" {...line} strokeWidth={2} />)}
      <path d="M34 60 Q48 66 62 60" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  4: () => (
    <>
      <rect x="14" y="28" width="72" height="48" rx="5" fill="#fffaf0" {...line} />
      <path d="M14 31 L50 58 L86 31" fill="none" {...line} />
      <path d="M14 74 L40 52 M86 74 L60 52" fill="none" {...line} strokeWidth={2} />
      <circle cx="50" cy="58" r="9" fill="#bc4749" {...line} />
      <path d="M50 62 C44 57 46 52 50 55 C54 52 56 57 50 62 Z" fill="#fde2c8" />
      <Sparkle x={82} y={20} r={5} />
    </>
  ),
  6: () => (
    <>
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <path d="M50 50 L50 12 M50 26 L40 18 M50 26 L60 18 M50 38 L43 33 M50 38 L57 33" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M50 50 L50 12 M50 26 L40 18 M50 26 L60 18 M50 38 L43 33 M50 38 L57 33" fill="none" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="50" cy="50" r="7" fill="#ffffff" {...line} />
    </>
  ),
  9: () => (
    <>
      <ellipse cx="50" cy="84" rx="40" ry="7" fill="#e0f2fe" />
      <path d="M12 72 L78 72 C90 72 92 60 84 56" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M28 60 L28 72 M64 60 L64 72" {...line} strokeWidth={4} />
      <rect x="16" y="46" width="62" height="14" rx="4" fill="#bc4749" {...line} />
      <path d="M22 53 L72 53" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 40 L22 40 M4 30 L16 30" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  10: () => (
    <>
      <ellipse cx="50" cy="84" rx="34" ry="8" fill="#ffffff" {...line} />
      <rect x="45" y="64" width="10" height="20" rx="2" fill="#7f4f24" {...line} />
      <polygon points="50,14 70,40 30,40" fill="#40916c" {...line} />
      <polygon points="50,28 76,56 24,56" fill="#2d6a4f" {...line} />
      <polygon points="50,44 80,70 20,70" fill="#40916c" {...line} />
      <path d="M38 40 Q44 36 50 40 M30 56 Q38 52 44 56 M58 70 Q66 66 74 70" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  11: () => (
    <>
      <polygon points="28,30 32,12 42,26" fill="#7f5539" {...line} />
      <polygon points="72,30 68,12 58,26" fill="#7f5539" {...line} />
      <ellipse cx="50" cy="56" rx="30" ry="34" fill="#9c6644" {...line} />
      <ellipse cx="50" cy="70" rx="18" ry="18" fill="#e6ccb2" {...line} />
      {[40, 48, 56].map(x => <path key={x} d={`M${x} 66 q4 4 8 0`} fill="none" stroke="#9c6644" strokeWidth="2" strokeLinecap="round" />)}
      <circle cx="38" cy="42" r="11" fill="#ffffff" {...line} />
      <circle cx="62" cy="42" r="11" fill="#ffffff" {...line} />
      <circle cx="39" cy="43" r="5" fill={INK} />
      <circle cx="61" cy="43" r="5" fill={INK} />
      <path d="M49 42 L51 42" {...line} />
      <polygon points="46,52 54,52 50,60" fill="#ffb703" {...line} strokeWidth={2} />
      <path d="M40 90 l0 -4 M46 90 l0 -4 M54 90 l0 -4 M60 90 l0 -4" stroke="#ffb703" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  12: () => (
    <>
      <path d="M30 66 C30 40 36 26 50 26 C64 26 70 40 70 66 L78 74 L22 74 Z" fill="#facc15" {...line} />
      <path d="M38 64 C38 46 42 36 48 33" fill="none" stroke="#fef3c7" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="80" r="7" fill="#e9a23b" {...line} />
      <ellipse cx="38" cy="22" rx="12" ry="6" transform="rotate(-20 38 22)" fill="#2d6a4f" {...line} />
      <ellipse cx="62" cy="22" rx="12" ry="6" transform="rotate(20 62 22)" fill="#2d6a4f" {...line} />
      <circle cx="46" cy="20" r="5" fill="#d62828" {...line} strokeWidth={2} />
      <circle cx="54" cy="20" r="5" fill="#d62828" {...line} strokeWidth={2} />
      <path d="M12 52 Q8 60 12 68 M88 52 Q92 60 88 68" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  14: () => (
    <>
      <path d="M50 16 C76 16 92 32 90 52 C88 66 74 64 68 70 C62 76 70 86 56 88 C30 92 10 74 10 52 C10 30 28 16 50 16 Z" fill="#f5deb3" {...line} />
      <circle cx="58" cy="74" r="6" fill="#fffaf0" {...line} strokeWidth={2} />
      <circle cx="30" cy="40" r="7" fill="#e63946" {...line} strokeWidth={2} />
      <circle cx="50" cy="32" r="7" fill="#facc15" {...line} strokeWidth={2} />
      <circle cx="72" cy="40" r="7" fill="#2a9d8f" {...line} strokeWidth={2} />
      <circle cx="28" cy="62" r="7" fill="#5e60ce" {...line} strokeWidth={2} />
      <path d="M44 66 L80 20" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M44 66 L80 20" stroke="#c47a3a" strokeWidth="5" strokeLinecap="round" />
      <path d="M38 74 Q40 64 46 63 Q50 66 46 70 Q42 76 38 74 Z" fill="#e63946" {...line} strokeWidth={2} />
    </>
  ),
  15: () => (
    <>
      <ellipse cx="50" cy="80" rx="40" ry="7" fill="#c47a3a" opacity=".35" />
      <path d="M16 74 L20 58 L14 52 L24 46 L22 36 L34 36 L38 26 L48 32 L56 24 L62 34 L72 32 L72 44 L80 50 L72 74 Z" fill="#7f5539" {...line} />
      <path d="M62 74 C62 56 74 50 84 58 C92 64 90 74 82 74 Z" fill="#e6ccb2" {...line} />
      <circle cx="89" cy="66" r="3.5" fill={INK} />
      <path d="M72 62 q4 3 8 0" fill="none" {...line} strokeWidth={2.5} />
      <path d="M10 76 C30 66 50 70 60 76 L60 82 L10 82 Z" fill="#bc4749" {...line} />
      <path d="M20 79 L24 76 M34 79 L38 75 M48 79 L52 76" stroke="#fde2c8" strokeWidth="2.5" strokeLinecap="round" />
      <text x="76" y="30" fontSize="14" fontWeight="bold" fill="#5e60ce" fontFamily="Inter, sans-serif">z</text>
      <text x="86" y="20" fontSize="10" fontWeight="bold" fill="#5e60ce" fontFamily="Inter, sans-serif">z</text>
    </>
  ),
  16: () => (
    <>
      <rect x="8" y="12" width="84" height="76" rx="16" fill="#0b1f3a" {...line} />
      <path d="M14 48 C30 30 44 54 58 36 C68 24 80 34 88 26" fill="none" stroke="#4ade80" strokeWidth="7" strokeLinecap="round" opacity=".9" />
      <path d="M14 60 C30 44 46 66 60 50 C70 40 80 48 88 42" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" opacity=".85" />
      <Sparkle x={24} y={24} r={3} fill="#fef3c7" />
      <Sparkle x={74} y={20} r={4} fill="#fef3c7" />
      <polygon points="22,86 32,66 42,86" fill="#1b4332" />
      <polygon points="38,86 50,60 62,86" fill="#14532d" />
      <polygon points="58,86 68,68 78,86" fill="#1b4332" />
    </>
  ),
  17: () => (
    <>
      <rect x="34" y="14" width="18" height="24" rx="2" transform="rotate(-12 43 26)" fill="#fffaf0" {...line} strokeWidth={2} />
      <rect x="50" y="12" width="18" height="24" rx="2" transform="rotate(10 59 24)" fill="#fffaf0" {...line} strokeWidth={2} />
      <path d="M30 40 C20 58 20 86 50 88 C80 86 80 58 70 40 Z" fill="#bc4749" {...line} />
      <path d="M28 36 L72 36 L70 44 L30 44 Z" fill="#9d2f37" {...line} />
      <circle cx="50" cy="66" r="11" fill="#facc15" {...line} />
      <polygon points={starPoints(50, 66, 7, 3)} fill="#bc4749" />
    </>
  ),
  18: () => (
    <>
      <path d="M60 88 L60 34 C60 14 34 14 34 34" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
      <path d="M60 88 L60 34 C60 14 34 14 34 34" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
      <path d="M60 88 L60 34 C60 14 34 14 34 34" fill="none" stroke="#e63946" strokeWidth="11" strokeDasharray="8 8" />
      <ellipse cx="70" cy="70" rx="10" ry="5" transform="rotate(-30 70 70)" fill="#2d6a4f" {...line} strokeWidth={2} />
      <circle cx="66" cy="76" r="4" fill="#d62828" {...line} strokeWidth={2} />
    </>
  ),
  20: () => (
    <>
      <rect x="20" y="44" width="60" height="40" rx="4" fill="#2a9d8f" {...line} />
      <rect x="16" y="34" width="68" height="14" rx="4" fill="#40b3a2" {...line} />
      <rect x="45" y="34" width="10" height="50" fill="#e63946" {...line} strokeWidth={2} />
      <path d="M50 34 C36 18 26 30 36 34 Z" fill="#e63946" {...line} />
      <path d="M50 34 C64 18 74 30 64 34 Z" fill="#e63946" {...line} />
      <circle cx="50" cy="34" r="5" fill="#e63946" {...line} />
      <Sparkle x={86} y={22} r={5} />
      <Sparkle x={12} y={24} r={3} />
    </>
  ),
  21: () => (
    <>
      <circle cx="50" cy="50" r="40" fill="#facc15" opacity=".15" />
      <path d="M73.86 61.14 A30 30 0 1 1 43.1 20.14 A26 26 0 0 0 73.86 61.14 Z" fill="#fde68a" {...line} />
      <Sparkle x={78} y={24} r={6} />
      <Sparkle x={86} y={46} r={3} />
      <Sparkle x={66} y={84} r={4} />
    </>
  ),
  22: () => (
    <>
      {[-16, 14].map(angle => (
        <g key={angle} transform={`rotate(${angle} 50 60)`}>
          <path d="M50 30 C46 18 38 14 34 16 M50 30 C50 16 52 10 56 8 M50 30 C56 20 64 18 68 20" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 32 Q50 26 62 32 L52 88 Q50 92 48 88 Z" fill="#f77f00" {...line} />
          <path d="M44 46 L52 46 M46 60 L54 60 M48 74 L52 74" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  23: () => (
    <>
      <rect x="40" y="30" width="16" height="16" rx="2" fill="#2a9d8f" {...line} strokeWidth={2} />
      <rect x="56" y="34" width="12" height="12" rx="2" fill="#facc15" {...line} strokeWidth={2} />
      <path d="M14 44 L72 44 C82 44 86 34 84 26 C94 32 94 58 76 64 L22 64 C14 64 12 54 14 44 Z" fill="#bc4749" {...line} />
      <path d="M20 52 L74 52" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 76 L80 76 C92 76 94 66 86 62" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M26 64 L26 76 M64 64 L64 76" {...line} strokeWidth={4} />
      <Sparkle x={10} y={30} r={4} />
      <Sparkle x={24} y={20} r={3} />
    </>
  ),
  24: () => (
    <>
      <circle cx="50" cy="50" r="42" fill="#facc15" opacity=".2" />
      <circle cx="50" cy="50" r="30" fill="#facc15" opacity=".25" />
      <polygon points={starPoints(50, 50, 36, 15)} fill="#facc15" {...line} />
      <polygon points={starPoints(50, 50, 18, 8)} fill="#fef3c7" />
      <Sparkle x={86} y={18} r={6} />
      <Sparkle x={14} y={82} r={5} />
      <Sparkle x={84} y={84} r={4} />
    </>
  ),
};

/** Character days reuse the squishy portraits; the rest are drawn here. */
export default function AdventIcon({ day, className }: { day: number; className?: string }) {
  if (CHARACTER_DAYS[day]) return <SquishyPortrait character={character(CHARACTER_DAYS[day])} className={className} />;
  const draw = ICONS[day];
  if (!draw) return null;
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {draw()}
    </svg>
  );
}
