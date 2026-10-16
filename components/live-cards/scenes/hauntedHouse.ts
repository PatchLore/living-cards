import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSprite,
  drawStars,
  fillGradient,
  glow,
  hash,
  lerp,
} from "../engine";
import { drawBat, drawFog } from "./halloweenParts";

const MOON = { x: 300, y: 250, r: 128 };
const INK = "#07080d";
const WINDOW = "255,170,70";

function hillY(x: number) {
  return 488 + 0.00042 * (x - 300) * (x - 300) * 1.4;
}

/** Bare tree, drawn recursively with fixed randomness. */
function branch(ctx: Ctx, x: number, y: number, ang: number, len: number, width: number, depth: number, id: number) {
  const x2 = x + Math.cos(ang) * len;
  const y2 = y + Math.sin(ang) * len;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (depth === 0) return;
  const kids = 2 + (hash(id, 1) > 0.6 ? 1 : 0);
  for (let k = 0; k < kids; k++) {
    const spread = (k - (kids - 1) / 2) * 0.55 + (hash(id * 3 + k, 2) - 0.5) * 0.4;
    branch(ctx, x2, y2, ang + spread, len * (0.62 + hash(id * 5 + k, 3) * 0.15), width * 0.62, depth - 1, id * 4 + k + 1);
  }
}

function drawHouse(ctx: Ctx, t: number) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  // main block and roof
  // walls run down into the hill so the house sits on the ground
  ctx.rect(232, 372, 150, 132);
  ctx.moveTo(220, 376);
  ctx.lineTo(306, 300);
  ctx.lineTo(394, 376);
  // crooked tower with spire
  ctx.rect(196, 318, 44, 186);
  ctx.moveTo(188, 322);
  ctx.lineTo(214, 226);
  ctx.lineTo(248, 322);
  // leaning chimney
  ctx.moveTo(344, 336);
  ctx.lineTo(348, 296);
  ctx.lineTo(364, 298);
  ctx.lineTo(362, 350);
  // porch roof
  ctx.moveTo(276, 444);
  ctx.lineTo(306, 428);
  ctx.lineTo(338, 444);
  ctx.fill();

  const lights: [number, number, number, number, number][] = [
    // x, y, w, h, on-time
    [254, 392, 22, 28, 1.4],
    [338, 392, 22, 28, 2.1],
    [210, 350, 16, 22, 2.8],
    [296, 452, 20, 32, 1.8],
  ];
  for (const [x, y, w, h, at] of lights) {
    let lit = clamp((t - at) / 0.3);
    // the tower window blinks, as if someone passes it
    if (at === 2.8) lit *= (t % 6.5) > 5.8 ? 0.15 : 1;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#1a1410";
    ctx.fillRect(x, y, w, h);
    if (lit > 0) {
      const flick = 0.88 + 0.12 * Math.sin(t * 9 + x);
      ctx.globalAlpha = lit * flick;
      ctx.fillStyle = "#ffb24a";
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = "lighter";
      drawSprite(ctx, glow(WINDOW), x + w / 2, y + h / 2, 46, 0.4 * lit * flick);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = INK;
    ctx.fillRect(x + w / 2 - 1, y, 2, h);
    ctx.fillRect(x, y + h / 2 - 1, w, 2);
  }
  // round attic window
  ctx.fillStyle = "#1a1410";
  ctx.beginPath();
  ctx.arc(306, 344, 11, 0, TAU);
  ctx.fill();
}

function drawGraves(ctx: Ctx) {
  ctx.fillStyle = "#0d0f17";
  for (const [x, w, h, tilt] of [
    [430, 22, 34, -0.12],
    [470, 18, 28, 0.08],
    [515, 24, 38, -0.05],
    [86, 20, 30, 0.1],
  ] as const) {
    const y = hillY(x) + 6;
    ctx.save();
    ctx.translate(x, y);
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
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#070b18"],
    [0.4, "#16253a"],
    [0.58, "#25394c"],
    [1, "#0a0d14"],
  ]);
  const fade = clamp(t / 1.4);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 90, seed: 141, yMax: 400, alpha: 0.7 * fade });
  drawSprite(ctx, glow("220,235,190"), MOON.x, MOON.y, MOON.r * 3.2, 0.35 * fade);
  ctx.globalCompositeOperation = "source-over";

  const moon = ctx.createRadialGradient(MOON.x - 30, MOON.y - 30, 10, MOON.x, MOON.y, MOON.r);
  moon.addColorStop(0, "#fbf8e0");
  moon.addColorStop(1, "#d9d6ab");
  ctx.globalAlpha = fade;
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(MOON.x, MOON.y, MOON.r, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;

  // thin cloud passing the moon
  ctx.globalCompositeOperation = "lighter";
  const cloudX = ((t * 12) % 900) - 200;
  ctx.globalAlpha = 0.14;
  ctx.drawImage(glow("150,165,190"), cloudX - 160, 270, 320, 26);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // hill
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) ctx.lineTo(x, hillY(x));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  drawHouse(ctx, t);
  drawGraves(ctx);

  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  branch(ctx, 70, hillY(70) + 30, -Math.PI / 2 + 0.08, 120, 14, 5, 1);

  // bats circling the house
  for (let i = 0; i < 6; i++) {
    const sp = 0.5 + hash(i, 151) * 0.4;
    const ph = hash(i, 152) * TAU;
    const x = 300 + Math.cos(t * sp + ph) * lerp(150, 230, hash(i, 153));
    const y = 230 + Math.sin(t * sp * 2 + ph) * 50 + i * 8;
    drawBat(ctx, x, y, 1 + hash(i, 154) * 0.7, t * 15 + i, "#05060a");
  }

  ctx.globalCompositeOperation = "lighter";
  drawFog(ctx, t, glow("150,170,190"), 520, 0.16 * fade);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const hauntedHouse: LiveScene = {
  id: "haunted-house",
  name: "Haunted Hill House",
  draw,
  stillTime: 3,
  text: {
    title: "Trick or Treat!",
    delay: 2.2,
    color: "#eef0e4",
    accent: "#ffa53a",
    glow: "0 0 16px rgba(255,140,40,0.7)",
    scrim: "linear-gradient(to bottom, rgba(7,8,13,0) 0%, rgba(7,8,13,0.55) 40%, rgba(7,8,13,0.9) 100%)",
  },
};
