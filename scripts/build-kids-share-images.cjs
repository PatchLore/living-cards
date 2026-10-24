// Draws the Kids share-preview posters (what WhatsApp shows for a /c/ link).
// They never contain a child's name or message. Run: node scripts/build-kids-share-images.cjs
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "cards", "kids");
const W = 900, H = 1350;

const rand = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(42);
const stars = (n, color = "#fef3c7") => Array.from({ length: n }, () => `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * H * 0.75).toFixed(0)}" r="${(0.8 + rand() * 2.2).toFixed(1)}" fill="${color}" opacity="${(0.35 + rand() * 0.6).toFixed(2)}"/>`).join("");
const writing = (x, y, width, rows, gap, color) => Array.from({ length: rows }, (_, i) => {
  const w = width * (i === rows - 1 ? 0.55 : 0.82 + rand() * 0.18);
  let d = `M${x} ${y + i * gap}`;
  for (let px = 0; px < w; px += 18) d += ` q9 ${-6 + rand() * 4} 18 0`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity=".75"/>`;
}).join("");

function scallop(cx, cy, r) {
  let d = "";
  const lobes = 26;
  for (let i = 0; i < lobes; i++) {
    const p = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    const a0 = (i / lobes) * Math.PI * 2, a1 = ((i + 0.5) / lobes) * Math.PI * 2, a2 = ((i + 1) / lobes) * Math.PI * 2;
    d += `${i === 0 ? `M${p(a0, r)}` : ""} Q${p(a1, r * 1.16)} ${p(a2, r)}`;
  }
  return `${d} Z`;
}
const seal = (cx, cy, r) => `
  <path d="M${cx - r * .35} ${cy + r * .6} L${cx - r * .7} ${cy + r * 1.9} L${cx - r * .38} ${cy + r * 1.7} L${cx - r * .2} ${cy + r * 1.95} L${cx} ${cy + r * .75} Z" fill="#b8862f"/>
  <path d="M${cx + r * .35} ${cy + r * .6} L${cx + r * .7} ${cy + r * 1.9} L${cx + r * .38} ${cy + r * 1.7} L${cx + r * .2} ${cy + r * 1.95} L${cx} ${cy + r * .75} Z" fill="#d4a373"/>
  <path d="${scallop(cx, cy, r)}" fill="url(#wax)"/>
  <circle cx="${cx}" cy="${cy}" r="${r * .8}" fill="none" stroke="#5c1014" stroke-width="5" opacity=".5"/>
  <circle cx="${cx}" cy="${cy}" r="${r * .55}" fill="none" stroke="#f3c9a8" stroke-width="3" opacity=".5"/>
  <path d="M${cx} ${cy - r * .38} L${cx + r * .11} ${cy - r * .12} L${cx + r * .38} ${cy - r * .1} L${cx + r * .17} ${cy + r * .07} L${cx + r * .25} ${cy + r * .33} L${cx} ${cy + r * .18} L${cx - r * .25} ${cy + r * .33} L${cx - r * .17} ${cy + r * .07} L${cx - r * .38} ${cy - r * .1} L${cx - r * .11} ${cy - r * .12} Z" fill="#fbe3cf"/>`;
const defs = `<defs>
  <radialGradient id="wax" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#d9555a"/><stop offset=".6" stop-color="#a3262c"/><stop offset="1" stop-color="#6e1519"/></radialGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f3e4c6"/></linearGradient>
</defs>`;

const santa = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
  <defs><radialGradient id="bg" cx="50%" cy="35%" r="80%"><stop offset="0" stop-color="#1b4332"/><stop offset="1" stop-color="#081710"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>${stars(140)}
  <g transform="rotate(-5 450 690)">
    <rect x="140" y="250" width="620" height="860" rx="14" fill="url(#paper)" stroke="#e5d5bc" stroke-width="3"/>
    <rect x="175" y="285" width="550" height="790" rx="6" fill="none" stroke="#b8862f" stroke-width="3" opacity=".6"/>
    <rect x="215" y="340" width="300" height="22" rx="11" fill="#bc4749" opacity=".85"/>
    <rect x="215" y="400" width="380" height="54" rx="12" fill="#0f291e" opacity=".9"/>
    ${writing(215, 520, 470, 8, 58, "#1e2a4a")}
    <g transform="translate(560 300) rotate(5)">
      <rect width="130" height="160" fill="#fffdf6"/><rect x="12" y="12" width="106" height="136" fill="#1b4332"/>
      <path d="M65 40 L92 82 H80 L100 112 H30 L50 82 H38 Z" fill="#40916c"/><circle cx="90" cy="38" r="10" fill="#f4e3b5"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${8 + i * 14.3}" cy="0" r="5" fill="#081710"/><circle cx="${8 + i * 14.3}" cy="160" r="5" fill="#081710"/>`).join("")}
    </g>
    ${seal(640, 980, 78)}
  </g>
  ${Array.from({ length: 26 }, () => `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * H).toFixed(0)}" r="${(3 + rand() * 6).toFixed(1)}" fill="#ffffff" opacity="${(0.25 + rand() * 0.5).toFixed(2)}"/>`).join("")}
</svg>`;

/** A receipt outline with torn zigzag edges top and bottom. */
const receipt = (x, y, w, h) => {
  let d = `M${x} ${y}`;
  for (let px = 0; px < w; px += 30) d += " l15 -14 l15 14";
  d += ` L${x + w} ${y + h}`;
  for (let px = 0; px < w; px += 30) d += " l-15 14 l-15 -14";
  return `${d} Z`;
};
const tooth = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1b4b"/><stop offset=".7" stop-color="#312e81"/><stop offset="1" stop-color="#0f291e"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>${stars(170)}
  <path d="M760 120 A110 110 0 1 0 820 300 A90 90 0 1 1 760 120 Z" fill="#fde68a"/>
  <g transform="rotate(-4 450 760)">
    <path d="${receipt(240, 330, 420, 860)}" fill="#fffdf7"/>
    <g transform="translate(390 360)">
      <path d="M58 46 C40 20 14 22 8 34 C20 34 26 40 30 48 C36 44 48 44 58 50 Z" fill="#c7d2fe" stroke="#312e81" stroke-width="2"/>
      <path d="M62 46 C80 20 106 22 112 34 C100 34 94 40 90 48 C84 44 72 44 62 50 Z" fill="#e0e7ff" stroke="#312e81" stroke-width="2"/>
      <path d="M44 36 C44 28 54 28 60 33 C66 28 76 28 76 36 C76 50 73 55 72 68 C71 78 65 78 64 68 L62 58 C61.5 55.5 58.5 55.5 58 58 L56 68 C55 78 49 78 48 68 C47 55 44 50 44 36 Z" fill="#ffffff" stroke="#312e81" stroke-width="2.4"/>
      <path d="M50 22 L53 14 L58 20 L60 10 L62 20 L67 14 L70 22 Z" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>
    </g>
    <rect x="290" y="490" width="320" height="26" rx="8" fill="#1e1b4b"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M290 ${580 + i * 52} H560" stroke="#9ca3af" stroke-width="4" stroke-dasharray="4 8"/><rect x="575" y="${568 + i * 52}" width="35" height="20" rx="4" fill="#374151"/>`).join("")}
    <path d="M290 905 H610" stroke="#374151" stroke-width="8" stroke-dasharray="2 0"/>
    <g transform="translate(330 930) rotate(-12)" opacity=".85"><rect width="250" height="110" rx="14" fill="none" stroke="#bc4749" stroke-width="7"/><rect x="12" y="12" width="226" height="86" rx="8" fill="none" stroke="#bc4749" stroke-width="3"/><rect x="45" y="38" width="160" height="34" rx="6" fill="#bc4749"/></g>
    ${Array.from({ length: 38 }, (_, i) => `<rect x="${310 + i * 7.6}" y="1085" width="${i % 3 ? 3 : 5}" height="60" fill="#1f2937"/>`).join("")}
  </g>
  ${[[150, 260], [720, 520], [140, 900], [780, 1080]].map(([x, y]) => `<path d="M${x} ${y - 22} l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6 Z" fill="#facc15"/>`).join("")}
</svg>`;

const balloon = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 110 C-48 104 -60 50 -54 20 C-46 -24 -20 -40 0 -40 C20 -40 46 -24 54 20 C60 50 48 104 0 110 Z" fill="${c}"/><path d="M-8 110 L0 122 L8 110 Z" fill="${c}"/><path d="M0 122 C-14 160 14 180 0 240" fill="none" stroke="#6b7280" stroke-width="3"/><ellipse cx="-22" cy="-4" rx="11" ry="22" fill="#ffffff" opacity=".35"/></g>`;
const party = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
  <defs><linearGradient id="cream" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset=".55" stop-color="#faf6f0"/><stop offset="1" stop-color="#ffe4e6"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#cream)"/>
  <path d="M0 90 Q450 220 900 90" fill="none" stroke="#b8862f" stroke-width="4"/>
  ${Array.from({ length: 14 }, (_, i) => { const x = 10 + i * 64; const y = 90 + 130 * Math.sin((x / 900) * Math.PI) * 0.95; return `<polygon points="${x},${y} ${x + 50},${y + 2} ${x + 25},${y + 58}" fill="${["#bc4749", "#facc15", "#2d6a4f", "#5e60ce"][i % 4]}"/>`; }).join("")}
  ${balloon(230, 380, "#bc4749", 1.25)}${balloon(450, 320, "#facc15", 1.4)}${balloon(670, 390, "#5e60ce", 1.25)}
  <g transform="translate(450 1000)">
    <ellipse cx="0" cy="190" rx="300" ry="34" fill="#0f291e" opacity=".12"/>
    <rect x="-240" y="40" width="480" height="150" rx="22" fill="#f4a3b4"/>
    <path d="M-240 70 Q-200 110 -160 70 T-80 70 T0 70 T80 70 T160 70 T240 70" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
    <rect x="-180" y="-80" width="360" height="130" rx="20" fill="#fde68a"/>
    <path d="M-180 -50 Q-150 -20 -120 -50 T-60 -50 T0 -50 T60 -50 T120 -50 T180 -50" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
    ${[-110, -40, 30, 100].map((x, i) => `<rect x="${x - 7}" y="-170" width="14" height="92" rx="5" fill="${["#5e60ce", "#2d6a4f", "#bc4749", "#5e60ce"][i]}"/><path d="M${x} -205 C${x + 14} -188 ${x + 10} -172 ${x} -168 C${x - 10} -172 ${x - 14} -188 ${x} -205 Z" fill="#f59e0b"/><path d="M${x} -194 C${x + 6} -184 ${x + 4} -176 ${x} -174 C${x - 4} -176 ${x - 6} -184 ${x} -194 Z" fill="#fde68a"/>`).join("")}
  </g>
  ${Array.from({ length: 60 }, () => `<rect x="${(rand() * W).toFixed(0)}" y="${(260 + rand() * 1000).toFixed(0)}" width="10" height="16" rx="2" fill="${["#bc4749", "#facc15", "#2d6a4f", "#5e60ce"][Math.floor(rand() * 4)]}" opacity=".7" transform="rotate(${(rand() * 90).toFixed(0)} 0 0)"/>`).join("")}
</svg>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, svg] of [["santa", santa], ["tooth", tooth], ["party", party]]) {
    const img = await loadImage(Buffer.from(svg));
    const canvas = createCanvas(W, H);
    canvas.getContext("2d").drawImage(img, 0, 0, W, H);
    fs.writeFileSync(path.join(OUT, `${name}.jpg`), canvas.toBuffer("image/jpeg", 88));
    console.log(`wrote public/cards/kids/${name}.jpg`);
  }
})();
