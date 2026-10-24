import type { ReactNode } from "react";
import type { SquishyCharacter } from "./squishyCharacters";

/**
 * Squishy Workshop parts. A design is a few choices; makeWorkshopCharacter turns
 * it into a normal SquishyCharacter, so the child's creature gets the same cut
 * line, maker badge and printable template as the rest of the kit.
 */
export const BODIES = ["mochi", "kitty", "frog", "mushroom", "acorn"] as const;
export const FACES = ["sparkle", "happy", "wink", "sleepy"] as const;
export const TOPPERS = ["none", "santa", "crown", "sprout", "bobble"] as const;
export const PALETTES = ["cherry", "mint", "honey", "lavender", "sky"] as const;

export type WorkshopDesign = {
  body: (typeof BODIES)[number];
  face: (typeof FACES)[number];
  topper: (typeof TOPPERS)[number];
  palette: (typeof PALETTES)[number];
};

export const DEFAULT_DESIGN: WorkshopDesign = { body: "mochi", face: "sparkle", topper: "santa", palette: "cherry" };

export const BODY_NAMES: Record<WorkshopDesign["body"], string> = {
  mochi: "Mochi the Marshmallow",
  kitty: "Whiskers the Kitty",
  frog: "Hopper the Frog",
  mushroom: "Dotty the Mushroom",
  acorn: "Nutmeg the Acorn",
};
export const FACE_LABELS: Record<WorkshopDesign["face"], string> = { sparkle: "Sparkly", happy: "Happy", wink: "Cheeky", sleepy: "Sleepy" };
export const TOPPER_LABELS: Record<WorkshopDesign["topper"], string> = { none: "No hat", santa: "Santa hat", crown: "Crown", sprout: "Sprout", bobble: "Bobble hat" };
export const PALETTE_COLOURS: Record<WorkshopDesign["palette"], { label: string; body: string; belly: string; accent: string }> = {
  cherry: { label: "Cherry", body: "#ef6f6c", belly: "#ffe5d9", accent: "#bc4749" },
  mint: { label: "Mint", body: "#95d5b2", belly: "#effaf3", accent: "#2d6a4f" },
  honey: { label: "Honey", body: "#f6bd60", belly: "#fff3d6", accent: "#e07a5f" },
  lavender: { label: "Lavender", body: "#bdb2ff", belly: "#f1edff", accent: "#7209b7" },
  sky: { label: "Sky", body: "#a2d2ff", belly: "#eaf6ff", accent: "#0077b6" },
};

export function isWorkshopDesign(value: unknown): value is WorkshopDesign {
  if (!value || typeof value !== "object") return false;
  const design = value as Record<string, unknown>;
  return (BODIES as readonly unknown[]).includes(design.body) && (FACES as readonly unknown[]).includes(design.face)
    && (TOPPERS as readonly unknown[]).includes(design.topper) && (PALETTES as readonly unknown[]).includes(design.palette);
}

export function randomDesign(): WorkshopDesign {
  const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
  return { body: pick(BODIES), face: pick(FACES), topper: pick(TOPPERS), palette: pick(PALETTES) };
}

const INK = "#1b4332";
const white = (outline: boolean, colour: string) => (outline ? "#ffffff" : colour);
const thin = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };

/** Where the face and hat sit on each body (front half, centred on x=170). */
const LAYOUT: Record<WorkshopDesign["body"], { eyeY: number; eyeDx: number; mouthY: number; topY: number; topScale: number; badgeY: number }> = {
  mochi: { eyeY: 158, eyeDx: 30, mouthY: 180, topY: 96, topScale: 1, badgeY: 140 },
  kitty: { eyeY: 156, eyeDx: 32, mouthY: 178, topY: 88, topScale: 0.8, badgeY: 140 },
  frog: { eyeY: 100, eyeDx: 46, mouthY: 168, topY: 116, topScale: 0.55, badgeY: 150 },
  mushroom: { eyeY: 182, eyeDx: 22, mouthY: 204, topY: 84, topScale: 0.75, badgeY: 156 },
  acorn: { eyeY: 172, eyeDx: 28, mouthY: 196, topY: 84, topScale: 0.85, badgeY: 152 },
};

function bodyOuter(design: WorkshopDesign, outline: boolean): ReactNode {
  const { body, belly } = PALETTE_COLOURS[design.palette];
  const fill = white(outline, body);
  switch (design.body) {
    case "mochi":
      return <rect x="86" y="92" width="168" height="158" rx="72" fill={fill} />;
    case "kitty":
      return (
        <>
          <polygon points="96,118 104,52 150,94" fill={fill} />
          <polygon points="244,118 236,52 190,94" fill={fill} />
          <rect x="84" y="84" width="172" height="166" rx="58" fill={fill} />
        </>
      );
    case "frog":
      return (
        <>
          <circle cx="124" cy="100" r="32" fill={fill} />
          <circle cx="216" cy="100" r="32" fill={fill} />
          <ellipse cx="170" cy="180" rx="90" ry="70" fill={fill} />
        </>
      );
    case "mushroom":
      return (
        <>
          <rect x="118" y="134" width="104" height="116" rx="42" fill={white(outline, belly)} />
          <path d="M76 156 C76 66 264 66 264 156 Q170 172 76 156 Z" fill={fill} />
        </>
      );
    case "acorn":
      return (
        <>
          <ellipse cx="170" cy="180" rx="74" ry="72" fill={fill} />
          <path d="M88 132 C88 80 252 80 252 132 Q170 148 88 132 Z" fill={white(outline, "#9c6644")} />
        </>
      );
  }
}

function bodyDetails(design: WorkshopDesign, outline: boolean): ReactNode {
  const { belly } = PALETTE_COLOURS[design.palette];
  switch (design.body) {
    case "mochi":
      return <ellipse cx="170" cy="226" rx="44" ry="17" fill={white(outline, belly)} {...thin} />;
    case "kitty":
      return (
        <>
          <polygon points="110,96 112,66 136,90" fill={outline ? "#ffffff" : "#ffb3c1"} {...thin} strokeWidth={2} />
          <polygon points="230,96 228,66 204,90" fill={outline ? "#ffffff" : "#ffb3c1"} {...thin} strokeWidth={2} />
          <ellipse cx="170" cy="226" rx="46" ry="17" fill={white(outline, belly)} {...thin} />
          <path d="M96 170 L72 164 M96 180 L72 184 M244 170 L268 164 M244 180 L268 184" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case "frog":
      return (
        <>
          <circle cx="124" cy="100" r="20" fill="#ffffff" {...thin} />
          <circle cx="216" cy="100" r="20" fill="#ffffff" {...thin} />
          <ellipse cx="170" cy="220" rx="54" ry="22" fill={white(outline, belly)} {...thin} />
        </>
      );
    case "mushroom":
      return (
        <>
          <path d="M76 156 C76 66 264 66 264 156 Q170 172 76 156 Z" fill={white(outline, PALETTE_COLOURS[design.palette].body)} {...thin} />
          {[[120, 120, 13], [170, 100, 16], [222, 122, 12], [146, 140, 8], [200, 142, 9]].map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" {...thin} strokeWidth={2} />)}
        </>
      );
    case "acorn":
      return (
        <>
          <path d="M88 132 C88 80 252 80 252 132 Q170 148 88 132 Z" fill={white(outline, "#9c6644")} {...thin} />
          <path d="M110 110 L130 96 M140 118 L170 92 M178 118 L208 94 M214 116 L232 104" stroke={outline ? "#9ca3af" : "#7f5539"} strokeWidth="3" strokeLinecap="round" />
          {design.topper === "none" && <rect x="164" y="64" width="12" height="22" rx="4" fill={white(outline, "#7f5539")} {...thin} />}
        </>
      );
  }
}

function face(design: WorkshopDesign, outline: boolean): ReactNode {
  const { eyeY, eyeDx, mouthY } = LAYOUT[design.body];
  const left = 170 - eyeDx;
  const right = 170 + eyeDx;
  const r = design.body === "frog" ? 9 : 10;
  const dot = (x: number) => (
    <>
      <circle cx={x} cy={eyeY} r={r} fill={INK} />
      <circle cx={x - r / 3} cy={eyeY - r / 3} r={r / 3} fill="#ffffff" />
    </>
  );
  const arc = (x: number, up: boolean) => <path d={up ? `M${x - 10} ${eyeY + 3} Q${x} ${eyeY - 10} ${x + 10} ${eyeY + 3}` : `M${x - 10} ${eyeY - 2} Q${x} ${eyeY + 9} ${x + 10} ${eyeY - 2}`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
  const eyes = {
    sparkle: <>{dot(left)}{dot(right)}</>,
    happy: <>{arc(left, true)}{arc(right, true)}</>,
    wink: <>{dot(left)}{arc(right, true)}</>,
    sleepy: <>{arc(left, false)}{arc(right, false)}</>,
  }[design.face];
  const cheekY = design.body === "frog" ? mouthY - 14 : eyeY + 16;
  const cheekDx = design.body === "frog" ? 56 : eyeDx + 22;
  return (
    <>
      {eyes}
      <ellipse cx={170 - cheekDx} cy={cheekY} rx="9" ry="5.5" fill={outline ? "#f3f4f6" : "#ff8fa3"} />
      <ellipse cx={170 + cheekDx} cy={cheekY} rx="9" ry="5.5" fill={outline ? "#f3f4f6" : "#ff8fa3"} />
      {design.face === "sleepy"
        ? <ellipse cx="170" cy={mouthY + 2} rx="5" ry="6" fill={INK} />
        : <path d={`M${170 - (design.body === "frog" ? 26 : 10)} ${mouthY} Q170 ${mouthY + (design.body === "frog" ? 16 : 11)} ${170 + (design.body === "frog" ? 26 : 10)} ${mouthY}`} stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />}
    </>
  );
}

/** Hats drawn around (0,0) = the middle of their brim, then placed on each body. */
function topper(design: WorkshopDesign, outline: boolean, stroke: boolean): ReactNode {
  if (design.topper === "none") return null;
  const { topY, topScale } = LAYOUT[design.body];
  const lines = stroke ? thin : {};
  const shapes = {
    santa: (
      <>
        <path d="M-52 4 C-28 -50 28 -50 52 4 Z" fill={white(outline, "#bc4749")} {...lines} />
        <rect x="-58" y="-4" width="116" height="16" rx="8" fill="#ffffff" {...lines} />
        <circle cx="0" cy="-38" r="12" fill="#ffffff" {...lines} />
      </>
    ),
    crown: <polygon points="-44,8 -50,-30 -20,-10 0,-38 20,-10 50,-30 44,8" fill={white(outline, "#facc15")} {...lines} />,
    sprout: (
      <>
        <rect x="-3" y="-30" width="6" height="34" rx="3" fill={white(outline, "#2d6a4f")} {...lines} />
        <ellipse cx="-18" cy="-30" rx="18" ry="9" transform="rotate(-24 -18 -30)" fill={white(outline, "#52b788")} {...lines} />
        <ellipse cx="18" cy="-30" rx="18" ry="9" transform="rotate(24 18 -30)" fill={white(outline, "#52b788")} {...lines} />
      </>
    ),
    bobble: (
      <>
        <path d="M-50 6 C-36 -44 36 -44 50 6 Z" fill={white(outline, PALETTE_COLOURS[design.palette].accent)} {...lines} />
        <rect x="-56" y="-2" width="112" height="16" rx="8" fill="#ffffff" {...lines} />
        <circle cx="0" cy="-36" r="12" fill="#ffffff" {...lines} />
      </>
    ),
  }[design.topper];
  return <g transform={`translate(170 ${topY}) scale(${topScale})`}>{shapes}</g>;
}

export function makeWorkshopCharacter(design: WorkshopDesign, makerName: string): SquishyCharacter {
  return {
    id: "workshop",
    name: BODY_NAMES[design.body],
    blurb: `Designed by ${makerName} in the Squishy Workshop`,
    badgeY: LAYOUT[design.body].badgeY,
    outer: outline => <>{bodyOuter(design, outline)}{topper(design, outline, false)}</>,
    details: outline => <>{bodyDetails(design, outline)}{face(design, outline)}{topper(design, outline, true)}</>,
    backDetails: outline => <>{design.body === "mushroom" || design.body === "acorn" ? bodyDetails(design, outline) : null}{topper(design, outline, true)}</>,
  };
}
