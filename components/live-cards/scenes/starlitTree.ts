import {
  type Ctx,
  type LiveScene,
  TAU,
  clamp,
  drawBokehField,
  drawSparkle,
  drawSprite,
  easeInOutCubic,
  easeOutBack,
  fillGradient,
  fract,
  glow,
  hash,
  twinkle,
  wrap,
} from "../engine";

const CX = 300;
const APEX = 118;
const BASE = 530;
const HALF = 180;

const GREEN = "95,255,170";
const GOLD = "255,196,105";
const WARM = "255,218,160";
const WHITE = "255,250,236";

const STAR_AT = 3.4;

/** Cone radius with stepped tiers so it reads as a fir, not a triangle. */
function radiusAt(u: number) {
  const tier = 0.7 + 0.3 * (1 - fract(u * 4.2));
  return HALF * (1 - u) * tier;
}

/** Point on the (slowly rotating) cone; depth 1 = facing viewer. */
function project(u: number, ang: number, rr = 1) {
  const r = radiusAt(u) * rr;
  return {
    x: CX + r * Math.sin(ang),
    y: BASE - u * (BASE - APEX) + r * 0.13 * Math.cos(ang),
    depth: 0.5 + 0.5 * Math.cos(ang),
  };
}

function drawSilhouette(ctx: Ctx, alpha: number) {
  ctx.beginPath();
  const steps = 160;
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    ctx.lineTo(CX - radiusAt(u), BASE - u * (BASE - APEX));
  }
  for (let s = steps; s >= 0; s--) {
    const u = s / steps;
    ctx.lineTo(CX + radiusAt(u), BASE - u * (BASE - APEX));
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(0, APEX, 0, BASE);
  g.addColorStop(0, "rgba(40,140,95,0.05)");
  g.addColorStop(1, "rgba(30,110,80,0.16)");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fill();
}

function drawStar(ctx: Ctx, t: number) {
  const age = t - STAR_AT;
  const e = easeOutBack(age / 0.9);
  const x = CX;
  const y = APEX - 16;
  const pulse = 1 + 0.06 * Math.sin(t * 2.6);

  // shockwave as it ignites
  if (age < 1.4) {
    ctx.globalAlpha = (1 - age / 1.4) * 0.5;
    ctx.strokeStyle = `rgb(${WARM})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, age * 260, 0, TAU);
    ctx.stroke();
  }

  drawSprite(ctx, glow(WARM), x, y, 160 * e * pulse, 0.5);
  drawSprite(ctx, glow(WHITE), x, y, 48 * e * pulse, 0.95);

  // horizontal lens flare
  ctx.globalAlpha = 0.4 * clamp(e);
  ctx.drawImage(glow(WARM), x - 300 * e, y - 4, 600 * e, 8);

  for (let k = 0; k < 8; k++) {
    const a = (k * TAU) / 8 + t * 0.08;
    const len = (k % 2 ? 55 : 110) * e * pulse * (0.9 + 0.1 * Math.sin(t * 3 + k));
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const g = ctx.createLinearGradient(x, y, x + dx * len, y + dy * len);
    g.addColorStop(0, "rgba(255,246,222,0.95)");
    g.addColorStop(1, "rgba(255,206,140,0)");
    const w = k % 2 ? 2 : 3.2;
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - dy * w, y + dx * w);
    ctx.lineTo(x + dx * len, y + dy * len);
    ctx.lineTo(x + dy * w, y - dx * w);
    ctx.closePath();
    ctx.fill();
  }

  // solid five-point core
  ctx.globalAlpha = clamp(e);
  ctx.fillStyle = "#fff8e6";
  ctx.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const r = (k % 2 ? 6.5 : 17) * e;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#04060a"],
    [0.55, "#0b1017"],
    [1, "#1a1209"],
  ]);

  ctx.globalCompositeOperation = "lighter";

  drawBokehField(ctx, t, {
    count: 18,
    seed: 11,
    colors: [GOLD, GREEN],
    yMin: 40,
    yMax: 650,
    rMin: 6,
    rMax: 20,
    alpha: 0.16 * clamp(t / 2),
    drift: 8,
  });

  const grow = easeInOutCubic((t - 0.2) / 3.2);
  const rot = t * 0.32;

  if (grow > 0) drawSilhouette(ctx, grow);

  // fairy lights scattered through the branches
  for (let i = 0; i < 560; i++) {
    const u = 1 - Math.sqrt(1 - hash(i, 1) * 0.985); // more lights where the cone is wider
    if (u > grow) continue;
    const appear = clamp((grow - u) * 10);
    const p = project(u, hash(i, 2) * TAU + rot, 0.5 + 0.5 * Math.sqrt(hash(i, 3)));
    const c = hash(i, 4);
    const color = c < 0.62 ? GREEN : c < 0.92 ? GOLD : WHITE;
    const tw = twinkle(t, i, 2.4);
    const b = (0.22 + 0.78 * p.depth) * appear;
    drawSprite(ctx, glow(color), p.x, p.y, (4 + 6 * hash(i, 5)) * (0.7 + 0.5 * tw), b * (0.35 + 0.65 * tw));
  }

  // golden garland spiralling up as the tree "draws itself"
  const N = 460;
  for (let j = 0; j < N; j++) {
    const u = j / N;
    if (u > grow) break;
    const p = project(u, u * 6.5 * TAU + rot, 1.03);
    const b = 0.18 + 0.82 * p.depth;
    const tw = twinkle(t, j + 1000, 3);
    drawSprite(ctx, glow(GOLD), p.x, p.y, 7 + 3 * tw, b * (0.5 + 0.5 * tw));
    if (j % 2 === 0) drawSprite(ctx, glow(WHITE), p.x, p.y, 2.6, b * 0.9);
  }

  if (grow > 0 && grow < 1) {
    const p = project(grow, grow * 6.5 * TAU + rot, 1.03);
    drawSprite(ctx, glow(WHITE), p.x, p.y, 34, 0.9);
    drawSparkle(ctx, p.x, p.y, 16, WHITE, 0.9, t * 2);
  }

  if (t > STAR_AT) {
    drawStar(ctx, t);

    // glitter drifting down after the star lights
    const gp = clamp((t - STAR_AT - 0.2) / 1.5);
    const streak = glow(WARM);
    for (let i = 0; i < 80; i++) {
      const x = CX + (hash(i, 31) - 0.5) * 580;
      const y = wrap(hash(i, 32) * 900 + t * (22 + 40 * hash(i, 33)), -20, 920);
      const a = gp * twinkle(t, i + 3000, 4) * 0.75 * (1 - (y / 900) * 0.6);
      if (a <= 0.01) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(streak, x - 1.2, y - 10, 2.4, 20);
      if (hash(i, 34) > 0.8) drawSparkle(ctx, x, y, 5, WHITE, a, 0.4);
    }
  }

  drawBokehField(ctx, t, {
    count: 30,
    seed: 77,
    colors: ["255,165,85", "255,205,130", "105,210,165"],
    yMin: 600,
    yMax: 940,
    rMin: 18,
    rMax: 54,
    alpha: 0.34 * clamp((t - 0.8) / 2),
    drift: 14,
  });

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const starlitTree: LiveScene = {
  id: "starlit-tree",
  name: "Starlit Tree",
  draw,
  stillTime: 6,
  text: {
    title: "Merry Christmas",
    delay: 3.9,
    color: "#f6eedf",
    accent: "#ffd889",
    glow: "0 0 18px rgba(255,200,110,0.65)",
    scrim: "linear-gradient(to bottom, rgba(10,8,5,0) 0%, rgba(10,8,5,0.55) 45%, rgba(10,8,5,0.8) 100%)",
  },
};
