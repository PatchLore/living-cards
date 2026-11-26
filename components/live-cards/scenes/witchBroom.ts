import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  drawSparkle,
  drawSprite,
  drawStars,
  easeOutCubic,
  fillGradient,
  glow,
  hash,
  lerp,
  twinkle,
} from "../engine";
import { drawBat, drawFog } from "./halloweenParts";

const MOON = { x: 300, y: 250, r: 124 };
const INK = "#0a0710";
const SPARKS = ["170,255,160", "205,160,255", "255,240,200"];

// Flight path: an arc from lower left that crosses the moon, like the
// Santa card, so the witch silhouettes against it mid-flight.
const P0 = [-180, 440];
const P1 = [300, 150];
const P2 = [790, 200];
const START = 0.6;
const FLIGHT = 6;
const CYCLE = 9;

function pathAt(s: number) {
  const a = (1 - s) * (1 - s);
  const b = 2 * (1 - s) * s;
  const c = s * s;
  const dx = 2 * (1 - s) * (P1[0] - P0[0]) + 2 * s * (P2[0] - P1[0]);
  const dy = 2 * (1 - s) * (P1[1] - P0[1]) + 2 * s * (P2[1] - P1[1]);
  return { x: a * P0[0] + b * P1[0] + c * P2[0], y: a * P0[1] + b * P1[1] + c * P2[1], angle: Math.atan2(dy, dx) };
}

function witchS(time: number) {
  const local = time - START;
  if (local < 0) return null;
  return -0.15 + ((local % CYCLE) / FLIGHT) * 1.3;
}

/** Witch, broom and cat, facing right, origin at the middle of the broom. */
function drawWitch(ctx: Ctx, t: number) {
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // broom handle
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-54, 5);
  ctx.lineTo(48, -5);
  ctx.stroke();
  // bristles
  ctx.beginPath();
  ctx.moveTo(-50, 3);
  ctx.quadraticCurveTo(-74, -8, -92, -4);
  ctx.lineTo(-96, 6);
  ctx.quadraticCurveTo(-78, 18, -50, 8);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let k = 0; k < 5; k++) {
    const y = -4 + k * 3.5;
    ctx.moveTo(-88, y);
    ctx.lineTo(-102 - (k % 2) * 4, y + (k - 2) * 2);
  }
  ctx.stroke();

  // cape streaming behind
  const flap = Math.sin(t * 9) * 3;
  ctx.beginPath();
  ctx.moveTo(-2, -24);
  ctx.quadraticCurveTo(-14, -32 + flap, -28, -30 + flap * 1.4);
  ctx.lineTo(-24, -24 + flap);
  ctx.lineTo(-29, -19 + flap * 1.2);
  ctx.quadraticCurveTo(-16, -12, -6, -4);
  ctx.closePath();
  ctx.fill();

  // dress / body
  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.lineTo(14, 2);
  ctx.quadraticCurveTo(8, -14, 3, -26);
  ctx.lineTo(-4, -26);
  ctx.quadraticCurveTo(-10, -12, -14, 2);
  ctx.closePath();
  ctx.fill();

  // leg and pointed boot
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(16, 9);
  ctx.lineTo(25, 7);
  ctx.stroke();

  // arm reaching for the broom
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(1, -20);
  ctx.lineTo(16, -6);
  ctx.stroke();

  // head, nose, flowing hair
  ctx.beginPath();
  ctx.arc(1, -32, 6, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, -33);
  ctx.lineTo(12, -30);
  ctx.lineTo(6, -29);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let k = 0; k < 3; k++) {
    ctx.moveTo(-3, -32 + k * 2);
    ctx.quadraticCurveTo(-12, -30 + k * 3 + flap * 0.5, -18, -26 + k * 3 + flap);
  }
  ctx.stroke();

  // pointed hat with a crooked tip
  ctx.beginPath();
  ctx.ellipse(1, -37, 13, 2.6, -0.08, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-6, -38);
  ctx.lineTo(8, -39);
  ctx.quadraticCurveTo(2, -52, -6, -60);
  ctx.quadraticCurveTo(-10, -62 + flap * 0.4, -14, -58);
  ctx.quadraticCurveTo(-8, -54, -6, -38);
  ctx.closePath();
  ctx.fill();

  // black cat riding behind her
  ctx.beginPath();
  ctx.ellipse(-42, -3, 8, 5, -0.1, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-34, -9, 4.2, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-37.5, -11);
  ctx.lineTo(-37, -17);
  ctx.lineTo(-34.5, -12.5);
  ctx.moveTo(-33.5, -12.5);
  ctx.lineTo(-31, -17);
  ctx.lineTo(-30.5, -11);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-49, -4);
  ctx.quadraticCurveTo(-58, -8, -55, -19 + Math.sin(t * 5) * 2);
  ctx.stroke();
}

/** Magic sparkles left behind the broom, emitted at fixed times so they never slide. */
function drawTrail(ctx: Ctx, t: number) {
  const dt = 0.02;
  const now = Math.floor(t / dt);
  for (let n = now; n > now - 200; n--) {
    const te = n * dt;
    const s = witchS(te);
    if (s === null || s < -0.1 || s > 1.15) continue;
    const age = t - te;
    const life = 1 - age / 3.4;
    if (life <= 0) continue;
    const p = pathAt(s);
    const back = 92;
    const x = p.x - Math.cos(p.angle) * back + (hash(n, 1) - 0.5) * 14 * (1 + age * 2);
    const y = p.y - Math.sin(p.angle) * back + 6 + age * 20 + (hash(n, 2) - 0.5) * 12 * (1 + age);
    const tw = twinkle(t, n, 5);
    const color = SPARKS[Math.floor(hash(n, 3) * SPARKS.length)];
    const a = life * (0.45 + 0.55 * tw);
    drawSprite(ctx, glow(color), x, y, 4 + 7 * life * tw, a);
    if (hash(n, 4) > 0.86) drawSparkle(ctx, x, y, 7 * life, color, a, age);
  }
}

function drawMoon(ctx: Ctx, alpha: number) {
  const { x, y, r } = MOON;
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,214,150"), x, y, r * 3.6, 0.35 * alpha);
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  g.addColorStop(0, "#fff6d6");
  g.addColorStop(0.6, "#ffe3a0");
  g.addColorStop(1, "#f2c06a");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 10; i++) {
    const a = hash(i, 181) * TAU;
    const d = Math.sqrt(hash(i, 182)) * r * 0.85;
    const cr = lerp(r * 0.06, r * 0.24, hash(i, 183));
    const cx = x + Math.cos(a) * d;
    const cy = y + Math.sin(a) * d;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cg.addColorStop(0, "rgba(200,140,60,0.28)");
    cg.addColorStop(1, "rgba(200,140,60,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
  }
  ctx.restore();
}

function drawHill(ctx: Ctx, t: number) {
  const hill = (x: number) => 520 + 0.00035 * (x - 380) * (x - 380);
  ctx.globalAlpha = 1;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) ctx.lineTo(x, hill(x));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // crooked dead tree
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(110, hill(110) + 10);
  ctx.quadraticCurveTo(96, 470, 120, 400);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(118, 420);
  ctx.quadraticCurveTo(80, 400, 60, 372);
  ctx.moveTo(120, 405);
  ctx.quadraticCurveTo(150, 380, 170, 350);
  ctx.moveTo(82, 398);
  ctx.lineTo(74, 380);
  ctx.moveTo(150, 382);
  ctx.lineTo(160, 396);
  ctx.stroke();

  // tombstones and a glowing pumpkin on the hill
  for (const [x, w, h, tilt] of [
    [340, 22, 32, -0.1],
    [390, 18, 26, 0.08],
    [470, 24, 36, -0.05],
  ] as const) {
    ctx.save();
    ctx.translate(x, hill(x) + 5);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w / 2, -h + w / 2);
    ctx.arc(0, -h + w / 2, w / 2, Math.PI, 0);
    ctx.lineTo(w / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  const px = 250;
  const py = hill(px) - 10;
  ctx.fillStyle = "#c95a0c";
  ctx.beginPath();
  ctx.ellipse(px, py, 18, 14, 0, 0, TAU);
  ctx.fill();
  const lit = 0.8 + 0.2 * Math.sin(t * 11);
  ctx.fillStyle = `rgba(255,${200 + 30 * lit},90,1)`;
  ctx.beginPath();
  ctx.moveTo(px - 10, py - 3);
  ctx.lineTo(px - 5, py - 9);
  ctx.lineTo(px - 1, py - 3);
  ctx.moveTo(px + 1, py - 3);
  ctx.lineTo(px + 5, py - 9);
  ctx.lineTo(px + 10, py - 3);
  ctx.moveTo(px - 9, py + 3);
  ctx.quadraticCurveTo(px, py + 10, px + 9, py + 3);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,150,50"), px, py, 60, 0.4 * lit);
  ctx.globalCompositeOperation = "source-over";
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#0d0820"],
    [0.4, "#24134a"],
    [0.6, "#3a1f5c"],
    [1, "#100a18"],
  ]);
  const fade = easeOutCubic(t / 1.4);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 110, seed: 191, yMax: 460, alpha: 0.8 * fade });
  ctx.globalCompositeOperation = "source-over";

  drawMoon(ctx, fade);

  // wisps of cloud over the moon
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const cx = ((t * (8 + i * 4) + hash(i, 192) * 900) % 900) - 150;
    ctx.globalAlpha = 0.13 * fade;
    ctx.drawImage(glow("170,150,210"), cx - 150, 220 + i * 46, 300, 26);
  }
  drawTrail(ctx, t);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // a few bats fluttering about
  for (let i = 0; i < 4; i++) {
    const sp = 0.6 + hash(i, 193) * 0.4;
    const x = 300 + Math.cos(t * sp + hash(i, 194) * TAU) * lerp(170, 250, hash(i, 195));
    const y = 120 + Math.sin(t * sp * 1.7 + i) * 40 + i * 22;
    drawBat(ctx, x, y, 0.9 + hash(i, 196) * 0.5, t * 15 + i, "#07050c");
  }

  const s = witchS(t);
  if (s !== null && s < 1.25) {
    const p = pathAt(s);
    const bob = Math.sin(t * 3.2) * 4;
    ctx.save();
    ctx.translate(p.x, p.y + bob);
    ctx.rotate(p.angle * 0.7 + Math.sin(t * 2.4) * 0.04);
    ctx.scale(1.25, 1.25);
    ctx.shadowColor = "rgba(210,170,255,0.55)";
    ctx.shadowBlur = 8;
    drawWitch(ctx, t);
    ctx.restore();
  }

  drawHill(ctx, t);

  ctx.globalCompositeOperation = "lighter";
  drawFog(ctx, t, glow("150,120,190"), 540, 0.14 * fade);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const witchBroom: LiveScene = {
  id: "witch-broom",
  name: "Witch's Flight",
  draw,
  stillTime: 3.6,
  text: {
    title: "Happy Haunting!",
    delay: 3.2,
    color: "#f4ecfb",
    accent: "#c4f28a",
    glow: "0 0 16px rgba(170,120,255,0.75)",
    scrim: "linear-gradient(to bottom, rgba(16,10,24,0) 0%, rgba(16,10,24,0.55) 40%, rgba(16,10,24,0.9) 100%)",
  },
};
