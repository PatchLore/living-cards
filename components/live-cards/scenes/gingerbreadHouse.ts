import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSnowDots,
  drawSparkle,
  drawSprite,
  drawStars,
  easeOutBack,
  fillGradient,
  glow,
  hash,
} from "../engine";

const WALL = { x0: 190, x1: 410, top: 392, bottom: 560 };
const APEX = { x: 300, y: 222 };
const EAVE_L = { x: 150, y: 410 };
const EAVE_R = { x: 450, y: 410 };
const WARM = "255,190,110";
const SWEETS = ["#e2384f", "#3fae6a", "#f2c230", "#4d8de6", "#e872b0", "#f08a2e"];

/** Icing pipes along the roof first, then the sweets pop on, then the lights. */
const ICING_END = 1.6;
const SWEETS_AT = 1.2;
const LIGHTS_AT = 2.2;

function gingerFill(ctx: Ctx, y0: number, y1: number) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, "#b8743a");
  g.addColorStop(1, "#8a4f22");
  return g;
}

/** A wavy line of piped icing from a to b, drawn up to `progress`. */
function pipedLine(ctx: Ctx, ax: number, ay: number, bx: number, by: number, progress: number, width = 7, waves = 10) {
  if (progress <= 0) return;
  const steps = 60;
  const len = Math.hypot(bx - ax, by - ay);
  const nx = -(by - ay) / len;
  const ny = (bx - ax) / len;
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#fffaf2";
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  const end = Math.floor(steps * clamp(progress));
  for (let s = 0; s <= end; s++) {
    const u = s / steps;
    const wobble = Math.sin(u * waves * TAU) * 4;
    const x = ax + (bx - ax) * u + nx * wobble;
    const y = ay + (by - ay) * u + ny * wobble;
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Icing drips hanging from a roof edge, each growing in turn. */
function drips(ctx: Ctx, ax: number, ay: number, bx: number, by: number, count: number, progress: number, seed: number) {
  ctx.fillStyle = "#fffaf2";
  for (let i = 0; i < count; i++) {
    const u = (i + 0.5) / count;
    const grow = clamp((progress - u * 0.8) / 0.25);
    if (grow <= 0) continue;
    const x = ax + (bx - ax) * u;
    const y = ay + (by - ay) * u;
    const len = (10 + hash(i, seed) * 18) * grow;
    const w = 7 + hash(i, seed + 1) * 4;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - 2);
    ctx.lineTo(x - w / 2, y + len);
    ctx.arc(x, y + len, w / 2, Math.PI, 0, true);
    ctx.lineTo(x + w / 2, y - 2);
    ctx.closePath();
    ctx.fill();
  }
}

function gumdrop(ctx: Ctx, x: number, y: number, r: number, color: string, pop: number) {
  if (pop <= 0) return;
  const s = easeOutBack(clamp(pop));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-r, r * 0.4);
  ctx.quadraticCurveTo(-r, -r * 1.1, 0, -r * 1.1);
  ctx.quadraticCurveTo(r, -r * 1.1, r, r * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.22, r * 0.35, -0.4, 0, TAU);
  ctx.fill();
  // sugar crystals
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let k = 0; k < 4; k++) ctx.fillRect(-r * 0.6 + k * r * 0.4, -r * 0.1 + (k % 2) * r * 0.3, 1.6, 1.6);
  ctx.restore();
}

function candyCane(ctx: Ctx, x: number, top: number, bottom: number, flip: boolean) {
  ctx.save();
  ctx.translate(x, 0);
  if (flip) ctx.scale(-1, 1);
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(0, bottom);
    ctx.lineTo(0, top + 16);
    ctx.arc(-14, top + 16, 14, 0, Math.PI, true);
  };
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fffaf2";
  ctx.lineWidth = 11;
  path();
  ctx.stroke();
  ctx.strokeStyle = "#d8283c";
  ctx.lineWidth = 11;
  ctx.setLineDash([9, 9]);
  path();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function window(ctx: Ctx, cx: number, cy: number, r: number, light: number) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#3a1d0c";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#1c1424";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
  if (light > 0) {
    const g = ctx.createRadialGradient(cx, cy + r * 0.2, 0, cx, cy, r);
    g.addColorStop(0, "#fff4cc");
    g.addColorStop(0.6, "#ffc266");
    g.addColorStop(1, "#e88a2e");
    ctx.globalAlpha = light;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#fffaf2";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, TAU);
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy + r);
  ctx.stroke();
}

/** The little gingerbread figure waving from the doorway. */
function gingerFigure(ctx: Ctx, x: number, y: number, t: number, appear: number) {
  if (appear <= 0) return;
  const s = easeOutBack(clamp(appear));
  const wave = Math.sin(t * 5) * 0.45;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#c2803f";
  ctx.strokeStyle = "#c2803f";
  ctx.lineCap = "round";
  // legs and body
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(-7, 18);
  ctx.lineTo(-11, 36);
  ctx.moveTo(7, 18);
  ctx.lineTo(11, 36);
  ctx.moveTo(-6, 4);
  ctx.lineTo(-20, 14);
  ctx.stroke();
  // waving arm
  ctx.save();
  ctx.translate(6, 4);
  ctx.rotate(-1.1 + wave);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(16, 0);
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(0, 10, 12, 15, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -14, 11, 0, TAU);
  ctx.fill();
  // icing face and buttons
  ctx.fillStyle = "#2a1408";
  ctx.beginPath();
  ctx.arc(-4, -16, 1.8, 0, TAU);
  ctx.arc(4, -16, 1.8, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#fffaf2";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, -12, 4.5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.fillStyle = "#e2384f";
  ctx.beginPath();
  ctx.arc(0, 6, 2.4, 0, TAU);
  ctx.arc(0, 14, 2.4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawHouse(ctx: Ctx, t: number) {
  const { x0, x1, top, bottom } = WALL;

  // walls
  ctx.globalAlpha = 1;
  ctx.fillStyle = gingerFill(ctx, top, bottom);
  ctx.fillRect(x0, top - 10, x1 - x0, bottom - top + 10);
  // gable
  ctx.beginPath();
  ctx.moveTo(APEX.x, APEX.y + 30);
  ctx.lineTo(x1, top - 8);
  ctx.lineTo(x0, top - 8);
  ctx.closePath();
  ctx.fillStyle = gingerFill(ctx, APEX.y, top);
  ctx.fill();
  // biscuit texture dots
  ctx.fillStyle = "rgba(70,32,10,0.28)";
  for (let i = 0; i < 70; i++) {
    const x = x0 + 8 + hash(i, 3) * (x1 - x0 - 16);
    const y = top - 6 + hash(i, 4) * (bottom - top);
    ctx.beginPath();
    ctx.arc(x, y, 1.3, 0, TAU);
    ctx.fill();
  }

  const icing = clamp(t / ICING_END);
  // roof slabs (thick biscuit), with snowy icing on top
  ctx.fillStyle = "#7a431c";
  for (const [a, b] of [[EAVE_L, APEX], [APEX, EAVE_R]] as const) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(b.x, b.y + 26);
    ctx.lineTo(a.x + (a === EAVE_L ? 10 : -10), a.y + 22);
    ctx.closePath();
    ctx.fill();
  }
  // roof icing blanket grows along each slope
  const blanket = (ax: number, ay: number, bx: number, by: number, p: number) => {
    if (p <= 0) return;
    const ex = ax + (bx - ax) * p;
    const ey = ay + (by - ay) * p;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#fffaf2";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  };
  blanket(APEX.x, APEX.y, EAVE_L.x, EAVE_L.y, icing);
  blanket(APEX.x, APEX.y, EAVE_R.x, EAVE_R.y, icing);
  drips(ctx, APEX.x, APEX.y + 6, EAVE_L.x + 6, EAVE_L.y + 6, 7, icing, 11);
  drips(ctx, APEX.x, APEX.y + 6, EAVE_R.x - 6, EAVE_R.y + 6, 7, icing, 21);

  // icing trim under the walls' top and around the base
  pipedLine(ctx, x0 + 4, top - 4, x1 - 4, top - 4, (t - 0.4) / 1, 6, 12);
  pipedLine(ctx, x0 + 4, bottom - 6, x1 - 4, bottom - 6, (t - 0.8) / 1, 6, 12);

  const lights = clamp((t - LIGHTS_AT) / 0.6) * (0.9 + 0.1 * Math.sin(t * 6));
  window(ctx, 238, 455, 24, lights);
  window(ctx, 362, 455, 24, clamp((t - LIGHTS_AT - 0.3) / 0.6) * (0.9 + 0.1 * Math.sin(t * 5 + 1)));
  window(ctx, 300, 330, 18, clamp((t - LIGHTS_AT - 0.6) / 0.6));

  // door: arched, open a little, with warm light
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#3a1d0c";
  ctx.beginPath();
  ctx.moveTo(270, bottom);
  ctx.lineTo(270, 492);
  ctx.arc(300, 492, 30, Math.PI, 0);
  ctx.lineTo(330, bottom);
  ctx.closePath();
  ctx.fill();
  const doorGlow = ctx.createLinearGradient(0, 470, 0, bottom);
  doorGlow.addColorStop(0, "#ffd88a");
  doorGlow.addColorStop(1, "#e8902e");
  ctx.globalAlpha = lights;
  ctx.fillStyle = doorGlow;
  ctx.beginPath();
  ctx.moveTo(276, bottom);
  ctx.lineTo(276, 494);
  ctx.arc(300, 494, 24, Math.PI, 0);
  ctx.lineTo(324, bottom);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  pipedLine(ctx, 268, bottom, 268, 490, (t - 1) / 0.6, 4, 4);
  pipedLine(ctx, 332, bottom, 332, 490, (t - 1) / 0.6, 4, 4);

  candyCane(ctx, 256, 500, bottom + 4, false);
  candyCane(ctx, 344, 500, bottom + 4, true);

  // gumdrops along both roof edges and the ridge, popping on in turn
  const roofSweets: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const u = (i + 0.5) / 6;
    roofSweets.push([APEX.x + (EAVE_L.x - APEX.x) * u, APEX.y + (EAVE_L.y - APEX.y) * u - 10]);
    roofSweets.push([APEX.x + (EAVE_R.x - APEX.x) * u, APEX.y + (EAVE_R.y - APEX.y) * u - 10]);
  }
  roofSweets.sort((a, b) => a[1] - b[1]);
  roofSweets.forEach(([x, y], i) => gumdrop(ctx, x, y, 9, SWEETS[i % SWEETS.length], (t - SWEETS_AT - i * 0.07) / 0.35));
  // a star on the ridge
  drawSparkle(ctx, APEX.x, APEX.y - 18, 16, "255,220,120", clamp((t - 2) / 0.5) * (0.8 + 0.2 * Math.sin(t * 3)), t * 0.3);

  // warm light pouring out
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow(WARM), 238, 455, 60, 0.18 * lights);
  drawSprite(ctx, glow(WARM), 362, 455, 60, 0.18 * lights);
  drawSprite(ctx, glow(WARM), 300, 520, 60, 0.22 * lights);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  gingerFigure(ctx, 300, 516, t, (t - LIGHTS_AT - 0.4) / 0.5);
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#140f2e"],
    [0.45, "#2c2150"],
    [0.7, "#3d2d5c"],
    [1, "#1a1530"],
  ]);
  const fade = clamp(t / 1.2);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 80, seed: 41, yMax: 340, alpha: 0.75 * fade });
  ctx.globalCompositeOperation = "source-over";

  // sugar-snow hills behind
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#c9c2e2";
  ctx.beginPath();
  ctx.moveTo(0, 560);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 520 + 20 * Math.sin(x * 0.012 + 0.5));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // the house, drawn a little larger, anchored at its base
  ctx.save();
  ctx.translate(300, 560);
  ctx.scale(1.16, 1.16);
  ctx.translate(-300, -560);
  drawHouse(ctx, t);
  ctx.restore();

  // front snow drift with a lollipop path
  ctx.globalAlpha = 1;
  const drift = ctx.createLinearGradient(0, 550, 0, H);
  drift.addColorStop(0, "#f3f0fb");
  drift.addColorStop(0.35, "#a59cc6");
  drift.addColorStop(1, "#2b2448");
  ctx.fillStyle = drift;
  ctx.beginPath();
  ctx.moveTo(0, 590);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 566 + 8 * Math.sin(x * 0.03 + 1));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  for (const [x, c] of [[120, "#e2384f"], [480, "#4d8de6"]] as const) {
    ctx.strokeStyle = "#f6efe2";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x, 540);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, 528, 20, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let a = 0; a < 2.6 * TAU; a += 0.2) ctx.lineTo(x + Math.cos(a + t * 0.6) * a * 1.15, 528 + Math.sin(a + t * 0.6) * a * 1.15);
    ctx.stroke();
  }

  // sugar sparkles on the snow
  for (let i = 0; i < 14; i++) {
    const x = hash(i, 51) * W;
    const y = 580 + hash(i, 52) * 70;
    drawSparkle(ctx, x, y, 5, "255,255,255", 0.7 * Math.max(0, Math.sin(t * 2 + i * 1.7)) * fade);
  }
  ctx.globalCompositeOperation = "lighter";
  drawSnowDots(ctx, t, { count: 110, seed: 42, rMin: 0.8, rMax: 2.4, speed: 24, alpha: 0.75 * fade });
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const gingerbreadHouse: LiveScene = {
  id: "gingerbread-house",
  name: "Gingerbread House",
  draw,
  stillTime: 4,
  text: {
    title: "Sweet Christmas Wishes",
    delay: 2.6,
    color: "#fff8ee",
    accent: "#ffcf7a",
    glow: "0 0 16px rgba(255,170,90,0.7)",
    scrim: "linear-gradient(to bottom, rgba(26,21,48,0) 0%, rgba(26,21,48,0.6) 40%, rgba(26,21,48,0.9) 100%)",
  },
};
