import { type Ctx, TAU, W, drawSprite, glow, hash, wrap } from "../engine";

/** Silhouette bat; `phase` drives the wing flap. */
export function drawBat(ctx: Ctx, x: number, y: number, s: number, phase: number, color = "#0b0710") {
  const f = Math.sin(phase);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 4, 6, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-3, -4);
  ctx.lineTo(-2.5, -9);
  ctx.lineTo(0, -5);
  ctx.lineTo(2.5, -9);
  ctx.lineTo(3, -4);
  ctx.closePath();
  ctx.fill();
  for (const side of [-1, 1]) {
    const tip = -10 * f;
    ctx.beginPath();
    ctx.moveTo(side * 3, -2);
    ctx.quadraticCurveTo(side * 12, -6 + tip * 0.6, side * 22, tip - 2);
    ctx.quadraticCurveTo(side * 18, tip + 6, side * 15, tip * 0.5 + 4);
    ctx.quadraticCurveTo(side * 11, tip * 0.3 + 8, side * 8, 4);
    ctx.quadraticCurveTo(side * 5, 6, side * 3, 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Autumn leaves tumbling down the card. */
export function drawFallingLeaves(ctx: Ctx, t: number, count: number, seed: number, alpha: number) {
  const colors = ["#c4561c", "#e08a2a", "#9c3b17", "#d9a038"];
  for (let i = 0; i < count; i++) {
    const s = i + seed * 100;
    const speed = 30 + 30 * hash(s, 1);
    const y = wrap(hash(s, 2) * 1000 + t * speed, -30, 930);
    const x = hash(s, 3) * W + Math.sin(t * 0.9 + hash(s, 4) * TAU) * 40;
    const size = 7 + 6 * hash(s, 5);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * (1 + hash(s, 6)) + s);
    ctx.scale(1, Math.cos(t * 2 + s));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.9, -size * 0.2, 0, size);
    ctx.quadraticCurveTo(-size * 0.9, -size * 0.2, 0, -size);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

/** Low mist drifting sideways. */
export function drawFog(ctx: Ctx, t: number, mist: HTMLCanvasElement, y: number, alpha: number) {
  for (let i = 0; i < 5; i++) {
    const x = wrap(hash(i, 121) * 900 + t * (8 + i * 3), -300, 900) - 150;
    ctx.globalAlpha = alpha * (0.6 + 0.4 * hash(i, 122));
    ctx.drawImage(mist, x - 220, y - 30 + i * 12, 440, 70);
  }
  ctx.globalAlpha = 1;
}

/** Layered flickering flames with a warm glow and rising embers. */
export function drawFire(ctx: Ctx, t: number, x: number, base: number, width: number, height: number, strength = 1) {
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  drawSpriteGlow(ctx, "255,140,50", x, base - height * 0.35, width * 1.4, 0.55 * strength);
  const tongues = 5;
  const layers: [string, number, number][] = [
    ["rgba(255,110,30,0.55)", 1, 1],
    ["rgba(255,180,60,0.6)", 0.7, 0.75],
    ["rgba(255,240,190,0.75)", 0.42, 0.48],
  ];
  for (const [color, ws, hs] of layers) {
    ctx.fillStyle = color;
    for (let i = 0; i < tongues; i++) {
      const fx = x - width / 2 + ((i + 0.5) / tongues) * width;
      const centre = 1 - Math.abs(i - (tongues - 1) / 2) / tongues;
      const noise = 0.5 + 0.25 * Math.sin(t * (5 + i) + i * 1.7) + 0.25 * Math.sin(t * (8.3 + i * 0.7) + i);
      const h = height * (0.45 + 0.55 * centre) * (0.75 + 0.45 * noise) * strength * hs;
      const w = (width / tongues) * 0.75 * ws;
      const sway = Math.sin(t * 3.2 + i * 0.9) * w * 0.6;
      ctx.beginPath();
      ctx.moveTo(fx - w, base);
      ctx.bezierCurveTo(fx - w * 1.1, base - h * 0.45, fx + sway * 0.4 - w * 0.5, base - h * 0.75, fx + sway, base - h);
      ctx.bezierCurveTo(fx + sway * 0.4 + w * 0.5, base - h * 0.75, fx + w * 1.1, base - h * 0.45, fx + w, base);
      ctx.closePath();
      ctx.fill();
    }
  }
  for (let i = 0; i < 12; i++) {
    const p = wrap(t / (1.8 + hash(i, 201)) + hash(i, 202), 0, 1);
    const ex = x + (hash(i, 203) - 0.5) * width + Math.sin(p * 8 + i) * 6;
    drawSpriteGlow(ctx, "255,170,80", ex, base - p * height * 1.6, 2.5, (1 - p) * 0.9 * strength);
  }
  ctx.globalCompositeOperation = prev;
  ctx.globalAlpha = 1;
}

/** Soft wisps rising and drifting from a point: steam, smoke or magic mist. */
export function drawRisingMist(
  ctx: Ctx,
  t: number,
  o: { x: number; y: number; colors: string[]; count: number; rise: number; spread: number; size: number; alpha: number; seed: number },
) {
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < o.count; i++) {
    const s = i + o.seed * 100;
    const life = 2.4 + hash(s, 211) * 1.6;
    const p = wrap(t / life + hash(s, 212), 0, 1);
    const x = o.x + Math.sin(p * 5 + hash(s, 213) * TAU) * o.spread * (0.3 + p) + (hash(s, 214) - 0.5) * o.spread * 0.4;
    const y = o.y - p * o.rise;
    const color = o.colors[i % o.colors.length];
    drawSpriteGlow(ctx, color, x, y, o.size * (0.4 + p), o.alpha * Math.sin(p * Math.PI));
  }
  ctx.globalCompositeOperation = prev;
  ctx.globalAlpha = 1;
}

/** Shorthand for drawing one glow sprite. */
function drawSpriteGlow(ctx: Ctx, color: string, x: number, y: number, r: number, alpha: number) {
  drawSprite(ctx, glow(color), x, y, r, alpha);
}

/** Crescent moon with the bite cut away, so the sky shows through it. */
export function drawCrescent(ctx: Ctx, x: number, y: number, r: number, color: string, alpha: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);
  ctx.arc(x + r * 0.45, y - r * 0.35, r * 0.9, 0, TAU, true);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}
