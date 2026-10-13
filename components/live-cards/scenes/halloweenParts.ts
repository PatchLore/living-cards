import { type Ctx, TAU, W, hash, wrap } from "../engine";

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
