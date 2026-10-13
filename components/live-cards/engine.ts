// Shared drawing toolkit for code-drawn "living" cards.
// Every scene draws in a fixed 600x900 (2:3) space and is a pure function of
// time, so the same scene can later be rendered frame-by-frame (e.g. Remotion).

export const W = 600;
export const H = 900;
export const TAU = Math.PI * 2;

export type Ctx = CanvasRenderingContext2D;

export type LiveScene = {
  id: string;
  name: string;
  draw: (ctx: Ctx, t: number) => void;
  /** Time (s) to freeze on when the viewer prefers reduced motion. */
  stillTime: number;
  text: {
    title: string;
    /** Seconds before the greeting starts writing in. */
    delay: number;
    color: string;
    accent: string;
    glow: string;
    scrim: string;
  };
};

// ---------- math ----------

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const fract = (x: number) => x - Math.floor(x);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOutCubic = (t: number) => {
  t = clamp(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOutBack = (t: number) => {
  t = clamp(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Deterministic pseudo-random in [0,1) for particle `i`, property `k`. */
export const hash = (i: number, k = 0) =>
  fract(Math.sin(i * 127.1 + k * 311.7) * 43758.5453);

export const wrap = (v: number, min: number, max: number) => {
  const span = max - min;
  return min + (((v - min) % span) + span) % span;
};

/** 0..1 shimmer, unique phase and speed per particle. */
export const twinkle = (t: number, i: number, speed = 2) =>
  0.5 + 0.5 * Math.sin(t * speed * (0.6 + hash(i, 9)) + hash(i, 8) * TAU);

// ---------- cached sprites ----------
// Colors are "r,g,b" strings so alpha can be layered on.

const sprites = new Map<string, HTMLCanvasElement>();

function sprite(key: string, size: number, paint: (c: Ctx, s: number) => void) {
  let c = sprites.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = c.height = size;
    paint(c.getContext("2d")!, size);
    sprites.set(key, c);
  }
  return c;
}

export function glow(color: string) {
  return sprite(`glow:${color}`, 128, (c, s) => {
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, `rgba(${color},1)`);
    g.addColorStop(0.15, `rgba(${color},0.5)`);
    g.addColorStop(0.45, `rgba(${color},0.12)`);
    g.addColorStop(1, `rgba(${color},0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
  });
}

/** Out-of-focus disc with the slightly brighter rim real bokeh has. */
export function bokeh(color: string) {
  return sprite(`bokeh:${color}`, 128, (c, s) => {
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, `rgba(${color},0.45)`);
    g.addColorStop(0.72, `rgba(${color},0.55)`);
    g.addColorStop(0.86, `rgba(${color},0.7)`);
    g.addColorStop(1, `rgba(${color},0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
  });
}

/** Six-armed ice crystal; `variant` changes the branching. */
export function snowflake(variant: number) {
  return sprite(`flake:${variant}`, 128, (c, s) => {
    const R = s * 0.42;
    c.translate(s / 2, s / 2);
    c.strokeStyle = "#fff";
    c.lineCap = "round";
    c.shadowColor = "rgba(170,205,255,0.95)";
    c.shadowBlur = 6;
    const branches = [0.3, 0.55, 0.78].map((p, k) => ({
      p: p + (hash(variant, k) - 0.5) * 0.12,
      len: 0.12 + hash(variant, k + 5) * 0.2,
    }));
    for (let arm = 0; arm < 6; arm++) {
      c.rotate(TAU / 6);
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -R);
      c.stroke();
      c.lineWidth = 2.6;
      for (const b of branches) {
        const y = -R * b.p;
        const l = R * b.len * (1 - b.p * 0.4);
        c.beginPath();
        c.moveTo(l, y - l * 0.9);
        c.lineTo(0, y);
        c.lineTo(-l, y - l * 0.9);
        c.stroke();
      }
    }
    c.lineWidth = 2.4;
    c.beginPath();
    for (let k = 0; k <= 6; k++) {
      const a = (k / 6) * TAU;
      c.lineTo(Math.cos(a) * R * 0.14, Math.sin(a) * R * 0.14);
    }
    c.stroke();
  });
}

// ---------- primitives ----------

export function drawSprite(
  ctx: Ctx,
  img: HTMLCanvasElement,
  x: number,
  y: number,
  r: number,
  alpha: number,
) {
  if (alpha <= 0.004 || r <= 0) return;
  ctx.globalAlpha = Math.min(alpha, 1);
  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
}

/** Four-point glint. */
export function drawSparkle(
  ctx: Ctx,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number,
  rot = 0,
) {
  if (alpha <= 0.004) return;
  drawSprite(ctx, glow(color), x, y, size * 1.4, alpha * 0.6);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = Math.min(alpha, 1);
  ctx.fillStyle = `rgb(${color})`;
  const q = size * 0.12;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(q, -q);
  ctx.lineTo(size, 0);
  ctx.lineTo(q, q);
  ctx.lineTo(0, size);
  ctx.lineTo(-q, q);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-q, -q);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawBokehField(
  ctx: Ctx,
  t: number,
  o: {
    count: number;
    seed: number;
    colors: string[];
    yMin: number;
    yMax: number;
    rMin: number;
    rMax: number;
    alpha: number;
    drift?: number;
  },
) {
  const drift = o.drift ?? 12;
  for (let i = 0; i < o.count; i++) {
    const s = i + o.seed * 1000;
    const x = hash(s, 1) * W + Math.sin(t * 0.25 * (0.5 + hash(s, 2)) + hash(s, 3) * TAU) * drift;
    const y = lerp(o.yMin, o.yMax, hash(s, 4)) + Math.cos(t * 0.2 * (0.5 + hash(s, 5)) + hash(s, 6) * TAU) * drift * 0.6;
    const r = lerp(o.rMin, o.rMax, hash(s, 7));
    const color = o.colors[Math.floor(hash(s, 10) * o.colors.length)];
    const pulse = 0.7 + 0.3 * twinkle(t, s, 0.8);
    drawSprite(ctx, bokeh(color), x, y, r, o.alpha * pulse);
  }
}

export function drawSnowDots(
  ctx: Ctx,
  t: number,
  o: {
    count: number;
    seed: number;
    rMin: number;
    rMax: number;
    speed: number;
    alpha: number;
    sway?: number;
    color?: string;
  },
) {
  const sway = o.sway ?? 14;
  const img = glow(o.color ?? "255,255,255");
  for (let i = 0; i < o.count; i++) {
    const s = i + o.seed * 1000;
    const k = hash(s, 2);
    const r = lerp(o.rMin, o.rMax, k);
    const speed = o.speed * (0.55 + 0.9 * k);
    const y = wrap(hash(s, 3) * (H + 40) + t * speed, -20, H + 20);
    const x = hash(s, 1) * W + Math.sin(t * 0.7 * (0.5 + hash(s, 4)) + hash(s, 5) * TAU) * sway;
    drawSprite(ctx, img, x, y, r * 3, o.alpha * (0.55 + 0.45 * k));
  }
}

export function drawStars(
  ctx: Ctx,
  t: number,
  o: { count: number; seed: number; yMax: number; alpha: number },
) {
  const img = glow("225,235,255");
  for (let i = 0; i < o.count; i++) {
    const s = i + o.seed * 1000;
    const x = hash(s, 1) * W;
    const y = Math.pow(hash(s, 2), 1.4) * o.yMax;
    const big = hash(s, 3) > 0.92;
    const tw = twinkle(t, s, 1.8);
    drawSprite(ctx, img, x, y, (big ? 5 : 2.6) * (0.7 + 0.5 * tw), o.alpha * (0.35 + 0.65 * tw));
  }
}

export function fillGradient(ctx: Ctx, stops: [number, string][], vertical = true) {
  const g = vertical ? ctx.createLinearGradient(0, 0, 0, H) : ctx.createLinearGradient(0, 0, W, 0);
  for (const [p, c] of stops) g.addColorStop(p, c);
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
