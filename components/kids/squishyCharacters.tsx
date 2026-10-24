import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Paper squishy characters, drawn for the front half of a 640×300 template
 * (centred on x=170). `outer` is the cut silhouette: it's drawn once as a thick
 * dark union outline (see CutLine), then filled, so overlapping parts read as
 * one shape to cut around. `details` sit on top with their own thin lines.
 */
export type SquishyCharacter = {
  id: string;
  name: string;
  blurb: string;
  outer: (outline: boolean) => ReactNode;
  details: (outline: boolean) => ReactNode;
  /** Lines that belong on the back too, so it colours in like the front. */
  backDetails?: (outline: boolean) => ReactNode;
  badgeY?: number;
};

const INK = "#1b4332";
const fill = (outline: boolean, colour: string) => (outline ? "#ffffff" : colour);
const Eyes = ({ y, dx = 30, r = 11 }: { y: number; dx?: number; r?: number }) => (
  <>
    <circle cx={170 - dx} cy={y} r={r} fill={INK} />
    <circle cx={170 - dx - r / 3} cy={y - r / 3} r={r / 3} fill="#ffffff" />
    <circle cx={170 + dx} cy={y} r={r} fill={INK} />
    <circle cx={170 + dx - r / 3} cy={y - r / 3} r={r / 3} fill="#ffffff" />
  </>
);
const Cheeks = ({ y, dx = 55, outline }: { y: number; dx?: number; outline: boolean }) => (
  <>
    <ellipse cx={170 - dx} cy={y} rx="10" ry="6" fill={outline ? "#f3f4f6" : "#ff8fa3"} />
    <ellipse cx={170 + dx} cy={y} rx="10" ry="6" fill={outline ? "#f3f4f6" : "#ff8fa3"} />
  </>
);
const mirror = (points: string) => points.split(" ").map(pair => { const [x, y] = pair.split(","); return `${340 - Number(x)},${y}`; }).join(" ");

const robinHat = (outline: boolean, stroke = false) => (
  <>
    <path d="M105 102 C130 50, 210 50, 235 102 Z" fill={fill(outline, "#bc4749")} {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
    <rect x="98" y="95" width="144" height="18" rx="9" fill="#ffffff" {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
    <circle cx="170" cy="60" r="14" fill="#ffffff" {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
  </>
);

const antler = "136,104 122,72 104,62 98,52 106,46 116,54 124,60 122,48 128,46 134,52 136,66 150,100";
const snowmanHat = (outline: boolean, stroke = false) => (
  <>
    <rect x="130" y="50" width="80" height="52" rx="6" fill={fill(outline, "#1b263b")} {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
    <rect x="130" y="82" width="80" height="12" fill={fill(outline, "#bc4749")} {...(stroke && { stroke: INK, strokeWidth: 2 })} />
    <rect x="108" y="96" width="124" height="14" rx="7" fill={fill(outline, "#1b263b")} {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
  </>
);
const penguinHat = (outline: boolean, stroke = false) => (
  <>
    <path d="M108 106 C124 52, 216 52, 232 106 Z" fill={fill(outline, "#2a9d8f")} {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
    <rect x="102" y="98" width="136" height="18" rx="9" fill="#ffffff" {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
    <circle cx="170" cy="58" r="14" fill="#ffffff" {...(stroke && { stroke: INK, strokeWidth: 2.5 })} />
  </>
);

export const SQUISHY_CHARACTERS: SquishyCharacter[] = [
  {
    id: "robin",
    name: "Berry the Robin",
    blurb: "A cheery robin in a Santa hat",
    outer: outline => <><ellipse cx="170" cy="165" rx="85" ry="78" fill={fill(outline, "#7f4f24")} />{robinHat(outline)}</>,
    details: outline => (
      <>
        <ellipse cx="170" cy="180" rx="55" ry="50" fill={fill(outline, "#e63946")} stroke={INK} strokeWidth="2.5" />
        <Eyes y={135} dx={32} r={12} />
        <Cheeks y={150} outline={outline} />
        <polygon points="160,142 180,142 170,156" fill={fill(outline, "#ffb703")} stroke={INK} strokeWidth="2" />
        {robinHat(outline, true)}
      </>
    ),
    backDetails: outline => robinHat(outline, true),
  },
  {
    id: "reindeer",
    name: "Rudy the Reindeer",
    blurb: "Shiny red nose and antlers",
    outer: outline => (
      <>
        <polygon points={antler} fill={fill(outline, "#c8a26b")} />
        <polygon points={mirror(antler)} fill={fill(outline, "#c8a26b")} />
        <ellipse cx="96" cy="128" rx="22" ry="11" transform="rotate(-28 96 128)" fill={fill(outline, "#9c6644")} />
        <ellipse cx="244" cy="128" rx="22" ry="11" transform="rotate(28 244 128)" fill={fill(outline, "#9c6644")} />
        <ellipse cx="170" cy="172" rx="80" ry="76" fill={fill(outline, "#9c6644")} />
      </>
    ),
    details: outline => (
      <>
        <ellipse cx="170" cy="204" rx="42" ry="30" fill={fill(outline, "#e6ccb2")} stroke={INK} strokeWidth="2.5" />
        <Eyes y={150} dx={30} />
        <Cheeks y={170} dx={52} outline={outline} />
        <circle cx="170" cy="188" r="15" fill={fill(outline, "#d62828")} stroke={INK} strokeWidth="2.5" />
        <circle cx="165" cy="183" r="4" fill="#ffffff" />
        <path d="M154 214 Q170 226 186 214" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  {
    id: "snowman",
    name: "Flurry the Snowman",
    blurb: "Top hat, carrot nose, cosy scarf",
    outer: outline => <><ellipse cx="170" cy="174" rx="82" ry="74" fill="#f8fbff" />{snowmanHat(outline)}</>,
    details: outline => (
      <>
        {snowmanHat(outline, true)}
        <Eyes y={146} dx={26} r={8} />
        <Cheeks y={168} dx={50} outline={outline} />
        <polygon points="168,158 208,168 168,176" fill={fill(outline, "#f77f00")} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        {[148, 159, 170, 181, 192].map((x, i) => <circle key={x} cx={x} cy={192 + [0, 5, 7, 5, 0][i]} r="3.5" fill={INK} />)}
        <path d="M100 210 Q170 236 240 210 L236 228 Q170 254 104 228 Z" fill={fill(outline, "#2a9d8f")} stroke={INK} strokeWidth="2.5" />
        {[128, 156, 184, 212].map(x => <line key={x} x1={x} y1={218 + (x === 156 || x === 184 ? 7 : 3)} x2={x + 6} y2={232 + (x === 156 || x === 184 ? 7 : 3)} stroke={outline ? INK : "#ffffff"} strokeWidth="3" strokeLinecap="round" />)}
      </>
    ),
    backDetails: outline => snowmanHat(outline, true),
  },
  {
    id: "penguin",
    name: "Pip the Penguin",
    blurb: "A waddly penguin in a bobble hat",
    outer: outline => (
      <>
        <ellipse cx="92" cy="182" rx="16" ry="36" transform="rotate(18 92 182)" fill={fill(outline, "#22333b")} />
        <ellipse cx="248" cy="182" rx="16" ry="36" transform="rotate(-18 248 182)" fill={fill(outline, "#22333b")} />
        <ellipse cx="142" cy="246" rx="20" ry="9" fill={fill(outline, "#ffb703")} />
        <ellipse cx="198" cy="246" rx="20" ry="9" fill={fill(outline, "#ffb703")} />
        <ellipse cx="170" cy="170" rx="80" ry="76" fill={fill(outline, "#22333b")} />
        {penguinHat(outline)}
      </>
    ),
    details: outline => (
      <>
        <ellipse cx="170" cy="182" rx="56" ry="58" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
        {penguinHat(outline, true)}
        <Eyes y={150} dx={24} r={9} />
        <Cheeks y={170} dx={44} outline={outline} />
        <polygon points="160,164 180,164 170,180" fill={fill(outline, "#ffb703")} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    backDetails: outline => penguinHat(outline, true),
  },
  {
    id: "gingerbread",
    name: "Ginger the Gingerbread",
    blurb: "Fresh from the oven, with icing",
    badgeY: 142,
    outer: outline => (
      <>
        <circle cx="170" cy="96" r="42" fill={fill(outline, "#c47a3a")} />
        <ellipse cx="106" cy="160" rx="36" ry="19" transform="rotate(-22 106 160)" fill={fill(outline, "#c47a3a")} />
        <ellipse cx="234" cy="160" rx="36" ry="19" transform="rotate(22 234 160)" fill={fill(outline, "#c47a3a")} />
        <ellipse cx="142" cy="236" rx="24" ry="20" fill={fill(outline, "#c47a3a")} />
        <ellipse cx="198" cy="236" rx="24" ry="20" fill={fill(outline, "#c47a3a")} />
        <rect x="118" y="126" width="104" height="104" rx="36" fill={fill(outline, "#c47a3a")} />
      </>
    ),
    details: outline => {
      const icing = outline ? "#9ca3af" : "#ffffff";
      return (
        <>
          <path d="M80 158 l7 6 l7 -6 l7 6 l7 -6" transform="rotate(-22 106 160)" stroke={icing} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M232 158 l7 6 l7 -6 l7 6 l7 -6" transform="rotate(22 234 160)" stroke={icing} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M126 244 l7 5 l7 -5 l7 5 l7 -5" stroke={icing} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M182 244 l7 5 l7 -5 l7 5 l7 -5" stroke={icing} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Eyes y={90} dx={16} r={6} />
          <Cheeks y={104} dx={28} outline={outline} />
          <path d="M152 110 Q170 126 188 110" stroke={icing === "#ffffff" ? "#ffffff" : INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          {[["#e63946", 152], ["#2a9d8f", 178], ["#e63946", 204]].map(([colour, y]) => <circle key={y} cx="170" cy={y} r="7" fill={fill(outline, colour as string)} stroke={INK} strokeWidth="2" />)}
        </>
      );
    },
  },
  {
    id: "fox",
    name: "Fern the Fox",
    blurb: "A woodland friend for any time of year",
    outer: outline => (
      <>
        <polygon points="110,118 126,48 168,98" fill={fill(outline, "#e76f51")} />
        <polygon points={mirror("110,118 126,48 168,98")} fill={fill(outline, "#e76f51")} />
        <ellipse cx="170" cy="170" rx="84" ry="78" fill={fill(outline, "#e76f51")} />
      </>
    ),
    details: outline => (
      <>
        <polygon points="124,100 130,66 152,94" fill={fill(outline, "#fde2c8")} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <polygon points={mirror("124,100 130,66 152,94")} fill={fill(outline, "#fde2c8")} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M98 176 Q132 150 170 204 Q208 150 242 176 Q232 242 170 247 Q108 242 98 176 Z" fill="#fffaf3" stroke={INK} strokeWidth="2.5" />
        <Eyes y={150} dx={30} r={10} />
        <Cheeks y={176} dx={50} outline={outline} />
        <ellipse cx="170" cy="204" rx="11" ry="8" fill={INK} />
        <path d="M158 220 Q170 230 182 220" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    ),
  },
];

/**
 * Redraws a silhouette as one thick dark shape, so its outline traces the union
 * of every part. Written into the SVG itself rather than CSS, so it survives
 * printing and any renderer.
 */
function CutLine({ children }: { children: ReactNode }) {
  const ink = (node: ReactNode): ReactNode => Children.map(node, child => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<{ children?: ReactNode }>;
    if (element.type === Fragment) return ink(element.props.children);
    return cloneElement(element as ReactElement<Record<string, unknown>>, { fill: INK, stroke: INK, strokeWidth: 7, strokeLinejoin: "round" });
  });
  return <g>{ink(children)}</g>;
}

/** One character's front, positioned for the template's front half. */
export function SquishyFront({ character, outline }: { character: SquishyCharacter; outline: boolean }) {
  return (
    <g>
      <CutLine>{character.outer(outline)}</CutLine>
      {character.outer(outline)}
      {character.details(outline)}
    </g>
  );
}

/** The matching back: same silhouette, with the child's maker badge. */
export function SquishyBack({ character, outline, makerName }: { character: SquishyCharacter; outline: boolean; makerName: string }) {
  const y = character.badgeY ?? 130;
  const fitLongName = Array.from(makerName).length > 10;
  return (
    <g>
      <CutLine>{character.outer(outline)}</CutLine>
      {character.outer(outline)}
      {character.backDetails?.(outline)}
      <rect x="105" y={y} width="130" height="72" rx="16" fill="#faf6f0" stroke={INK} strokeWidth="2.5" />
      <text x="170" y={y + 24} textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">HANDCRAFTED BY</text>
      <text x="170" y={y + 47} textAnchor="middle" fill="#bc4749" fontSize="20" fontFamily="Fraunces, serif" fontWeight="bold" textLength={fitLongName ? 112 : undefined} lengthAdjust={fitLongName ? "spacingAndGlyphs" : undefined}>{makerName}</text>
      <text x="170" y={y + 64} textAnchor="middle" fill={INK} fontSize="9" fontFamily="Inter, sans-serif">🌲 Made with CardRoots</text>
    </g>
  );
}

/** The full cut-and-fold template for one character. */
export function SquishyTemplate({ character, outline, makerName, title = true }: { character: SquishyCharacter; outline: boolean; makerName: string; title?: boolean }) {
  return (
    <svg role="img" aria-label={`Personalised ${character.name} paper squishy template for ${makerName}. Cut around the outer dashed rectangle, fold at the centre line, tape the sides and fill with tissue before sealing the top.`} className="h-auto w-full" viewBox="0 0 640 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="600" height="260" rx="36" fill="#fffdf9" stroke={INK} strokeWidth="2.5" strokeDasharray="8 6" />
      <line x1="320" y1="20" x2="320" y2="280" stroke="#bc4749" strokeWidth="2" strokeDasharray="4 4" />
      <rect x="275" y="8" width="90" height="20" rx="10" fill="#bc4749" />
      <text x="320" y="22" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">↕ FOLD HERE</text>
      <text x="170" y="38" textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">⬆ LEAVE TOP OPEN FOR STUFFING ⬆</text>
      <text x="470" y="38" textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">⬆ LEAVE TOP OPEN FOR STUFFING ⬆</text>
      <SquishyFront character={character} outline={outline} />
      <g transform="translate(300 0)"><SquishyBack character={character} outline={outline} makerName={makerName} /></g>
      {title && <>
        <text x="170" y="273" textAnchor="middle" fill={INK} fontSize="12" fontFamily="Fraunces, serif" fontWeight="bold">{`FRONT · ${character.name}`}</text>
        <text x="470" y="273" textAnchor="middle" fill={INK} fontSize="12" fontFamily="Fraunces, serif" fontWeight="bold">BACK · Personalised Maker Badge</text>
      </>}
    </svg>
  );
}

/** A small front-only portrait, for pickers and the animated card. */
export function SquishyPortrait({ character, outline = false, className }: { character: SquishyCharacter; outline?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="60 36 220 228" fill="none" xmlns="http://www.w3.org/2000/svg">
      <SquishyFront character={character} outline={outline} />
    </svg>
  );
}
