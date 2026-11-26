import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSparkle,
  drawSprite,
  drawStars,
  fillGradient,
  glow,
  hash,
  twinkle,
  wrap,
} from "../engine";
import { drawCrescent, drawFire, drawRisingMist } from "./halloweenParts";

const CX = 300;
const RIM_Y = 360;
const POT_RX = 132;
const POT_RY = 98;
const SPELL = 2.0;
const POTION = "120,255,140";

function drawPot(ctx: Ctx) {
  // legs
  ctx.fillStyle = "#0c0b10";
  for (const dx of [-82, 0, 82]) {
    ctx.beginPath();
    ctx.moveTo(CX + dx - 9, RIM_Y + 150);
    ctx.lineTo(CX + dx + 9, RIM_Y + 150);
    ctx.lineTo(CX + dx + 5, RIM_Y + 186);
    ctx.lineTo(CX + dx - 5, RIM_Y + 186);
    ctx.closePath();
    ctx.fill();
  }
  // iron belly
  const g = ctx.createRadialGradient(CX - 45, RIM_Y + 50, 10, CX, RIM_Y + 80, 170);
  g.addColorStop(0, "#3a3644");
  g.addColorStop(0.6, "#1a1820");
  g.addColorStop(1, "#08070b");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(CX, RIM_Y + 78, POT_RX, POT_RY, 0, 0, TAU);
  ctx.fill();
  // green underglow from the potion on the iron
  ctx.globalCompositeOperation = "lighter";
  ctx.save();
  ctx.clip();
  drawSprite(ctx, glow(POTION), CX, RIM_Y + 10, 150, 0.18);
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  // thick rim
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#2b2833";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.ellipse(CX, RIM_Y, POT_RX * 0.92, 24, 0, 0, TAU);
  ctx.stroke();
}

function drawPotion(ctx: Ctx, t: number) {
  // glowing surface
  const surf = ctx.createRadialGradient(CX, RIM_Y, 4, CX, RIM_Y, POT_RX * 0.9);
  surf.addColorStop(0, "#d4ffb0");
  surf.addColorStop(0.5, "#5ce07a");
  surf.addColorStop(1, "#1f7a3a");
  ctx.fillStyle = surf;
  ctx.beginPath();
  ctx.ellipse(CX, RIM_Y, POT_RX * 0.86, 19, 0, 0, TAU);
  ctx.fill();

  // bubbles: grow, wobble up, then pop into a ring
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16; i++) {
    const period = 1.1 + hash(i, 301) * 1.2;
    const p = wrap(t / period + hash(i, 302), 0, 1);
    const bx = CX + (hash(i, 303) - 0.5) * POT_RX * 1.4;
    const by = RIM_Y - 2 - p * 26;
    if (p < 0.82) {
      const r = 3 + 9 * hash(i, 304) * (0.4 + p);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = "rgba(210,255,190,0.9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = "rgba(120,255,140,0.25)";
      ctx.fill();
    } else {
      const k = (p - 0.82) / 0.18;
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = "rgba(210,255,190,0.9)";
      ctx.beginPath();
      ctx.arc(bx, by, 6 + k * 16, 0, TAU);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#0b0a1a"],
    [0.45, "#1d1236"],
    [0.65, "#271846"],
    [1, "#0d0a14"],
  ]);
  const fade = clamp(t / 1.2);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 80, seed: 311, yMax: 360, alpha: 0.7 * fade });
  ctx.globalCompositeOperation = "source-over";

  // crescent moon
  drawCrescent(ctx, 470, 110, 34, "#f4ecc8", fade);

  // ground
  ctx.fillStyle = "#0d0a12";
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 546 + 8 * Math.sin(x * 0.02));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // fire under the pot
  ctx.fillStyle = "#3a2414";
  ctx.fillRect(CX - 70, RIM_Y + 184, 140, 12);
  drawFire(ctx, t, CX, RIM_Y + 186, 150, 70, clamp(t / 0.8));

  drawPot(ctx);
  drawPotion(ctx, t);

  // magic smoke rising, much stronger once the spell is cast
  const cast = clamp((t - SPELL) / 0.8);
  drawRisingMist(ctx, t, {
    x: CX,
    y: RIM_Y - 10,
    colors: [POTION, "190,140,255", "120,240,200"],
    count: 22,
    rise: 300,
    spread: 70,
    size: 55,
    alpha: 0.18 + 0.22 * cast,
    seed: 31,
  });

  // the moment the spell is cast: a flash and a burst of sparkles
  ctx.globalCompositeOperation = "lighter";
  const since = t - SPELL;
  if (since > 0 && since < 0.8) drawSprite(ctx, glow("200,255,190"), CX, RIM_Y - 40, 260, 1 - since / 0.8);
  if (cast > 0) {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * TAU + t * 0.25;
      const r = 120 + 60 * Math.sin(t * 0.8 + i);
      const tw = twinkle(t, i + 700, 3);
      const color = i % 2 ? POTION : "200,160,255";
      drawSparkle(ctx, CX + Math.cos(a) * r, 230 + Math.sin(a) * r * 0.55, 3 + 6 * tw, color, tw * 0.8 * cast, a);
    }
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const bubblingCauldron: LiveScene = {
  id: "bubbling-cauldron",
  name: "Bubbling Cauldron",
  draw,
  stillTime: 3.2,
  text: {
    title: "Hocus Pocus!",
    delay: SPELL + 0.3,
    color: "#eefbe9",
    accent: "#a6ff8f",
    glow: "0 0 18px rgba(120,255,140,0.8)",
    scrim: "linear-gradient(to bottom, rgba(13,10,20,0) 0%, rgba(13,10,20,0.6) 40%, rgba(13,10,20,0.92) 100%)",
  },
};
