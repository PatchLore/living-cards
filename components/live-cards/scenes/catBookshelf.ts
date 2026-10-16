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
  easeInOutCubic,
  glow,
  hash,
  lerp,
  twinkle,
} from "../engine";
import { drawBat } from "./halloweenParts";

const SHELF_Y = 380;
const CAT_X = 250;
const KNOCK = 1.5; // paw reaches out
const TIP = 1.9; // bottle starts to fall
const SPILL = 2.3; // bottle lands and the magic spills out
const MAGIC = "220,150,255";

const WIN = { x0: 170, x1: 430, top: 70, sill: 330 };

function windowPath(ctx: Ctx) {
  const r = (WIN.x1 - WIN.x0) / 2;
  ctx.beginPath();
  ctx.moveTo(WIN.x0, WIN.sill);
  ctx.lineTo(WIN.x0, WIN.top + r);
  ctx.arc(WIN.x0 + r, WIN.top + r, r, Math.PI, 0);
  ctx.lineTo(WIN.x1, WIN.sill);
  ctx.closePath();
}

function drawRoom(ctx: Ctx, t: number, candle: number) {
  // wall
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1c1322";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let x = 0; x < W; x += 36) ctx.fillRect(x, 0, 14, SHELF_Y);

  // night outside the window
  ctx.save();
  windowPath(ctx);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, WIN.top, 0, WIN.sill);
  sky.addColorStop(0, "#0b1030");
  sky.addColorStop(1, "#2a1d4d");
  ctx.fillStyle = sky;
  ctx.fillRect(WIN.x0, WIN.top, WIN.x1 - WIN.x0, WIN.sill - WIN.top);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 40, seed: 321, yMax: 330, alpha: 0.8 });
  drawSprite(ctx, glow("255,236,180"), 360, 150, 120, 0.4);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fbefc4";
  ctx.beginPath();
  ctx.arc(360, 150, 34, 0, TAU);
  ctx.fill();
  const p = ((t + 1.5) % 8) / 4;
  if (p < 1) drawBat(ctx, lerp(150, 450, p), 210 - Math.sin(p * Math.PI) * 50, 0.9, t * 16);
  ctx.restore();

  // window frame
  ctx.strokeStyle = "#3a2416";
  ctx.lineWidth = 12;
  windowPath(ctx);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(300, WIN.top);
  ctx.lineTo(300, WIN.sill);
  ctx.moveTo(WIN.x0, 230);
  ctx.lineTo(WIN.x1, 230);
  ctx.stroke();

  // candlelight warming the wall
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,170,80"), 450, 300, 300, 0.22 * candle);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // bookshelf
  const wood = ctx.createLinearGradient(0, SHELF_Y, 0, SHELF_Y + 18);
  wood.addColorStop(0, "#6b4226");
  wood.addColorStop(1, "#3c2414");
  ctx.fillStyle = wood;
  ctx.fillRect(30, SHELF_Y, W - 60, 18);
  ctx.fillStyle = "#2a1a10";
  ctx.fillRect(30, SHELF_Y + 18, W - 60, H - SHELF_Y);
  const spines = ["#7a2430", "#2f4a3a", "#3a3466", "#8a6a2a", "#5a2a4a", "#24425a"];
  for (const rowY of [SHELF_Y + 30, SHELF_Y + 140]) {
    let x = 44;
    for (let i = 0; x < W - 50; i++) {
      const w = 14 + hash(i + rowY, 331) * 14;
      const h = 80 + hash(i + rowY, 332) * 20;
      ctx.fillStyle = spines[i % spines.length];
      ctx.fillRect(x, rowY + 100 - h, w - 2, h);
      ctx.fillStyle = "rgba(240,210,140,0.35)";
      ctx.fillRect(x + 2, rowY + 100 - h + 10, w - 6, 2);
      x += w;
    }
    ctx.fillStyle = "#4a2e1a";
    ctx.fillRect(30, rowY + 100, W - 60, 10);
  }

  // stacked books on top, left of the cat
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = spines[(i + 2) % spines.length];
    ctx.fillRect(70 + i * 3, SHELF_Y - 16 - i * 16, 88 - i * 8, 15);
  }
}

function drawCandle(ctx: Ctx, t: number, candle: number) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#efe4cc";
  ctx.fillRect(441, SHELF_Y - 64, 18, 64);
  ctx.fillStyle = "#d9cdb3";
  ctx.beginPath();
  ctx.ellipse(450, SHELF_Y - 64, 9, 3, 0, 0, TAU);
  ctx.fill();
  const f = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 4.3);
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,190,100"), 450, SHELF_Y - 80, 46 * f, 0.7 * candle);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffd27a";
  ctx.beginPath();
  ctx.ellipse(450 + Math.sin(t * 6) * 1.2, SHELF_Y - 78, 4, 10 * f, 0, 0, TAU);
  ctx.fill();
}

/** Seated black cat facing the viewer, slightly turned to the right. */
function drawCat(ctx: Ctx, t: number) {
  const base = SHELF_Y;
  const ink = "#08060b";
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineCap = "round";

  // tail swishing out to the left
  const swish = Math.sin(t * 1.6) * 0.35;
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(CAT_X - 30, base - 8);
  ctx.quadraticCurveTo(CAT_X - 95, base - 10 + swish * 30, CAT_X - 100 + swish * 40, base - 70);
  ctx.stroke();

  // body
  ctx.beginPath();
  ctx.moveTo(CAT_X - 50, base);
  ctx.bezierCurveTo(CAT_X - 62, base - 70, CAT_X - 30, base - 118, CAT_X + 4, base - 120);
  ctx.bezierCurveTo(CAT_X + 40, base - 116, CAT_X + 56, base - 60, CAT_X + 46, base);
  ctx.closePath();
  ctx.fill();

  // paw: tucked, then reaching out to the bottle
  const reach = clamp((t - KNOCK) / 0.35) * (1 - clamp((t - SPILL - 0.4) / 0.5));
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(CAT_X + 22, base - 40);
  ctx.quadraticCurveTo(CAT_X + 34 + reach * 20, base - 30 - reach * 6, CAT_X + 30 + reach * 50, base - 8 - reach * 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(CAT_X - 6, base - 4, 14, 7, 0, 0, TAU);
  ctx.fill();

  // head, tilting towards the bottle as it reaches
  ctx.save();
  ctx.translate(CAT_X + 8, base - 142);
  ctx.rotate(0.06 * Math.sin(t * 0.9) + reach * 0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 33, 0, 0, TAU);
  ctx.fill();
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * 34, -6);
    ctx.lineTo(s * 30, -48);
    ctx.lineTo(s * 8, -26);
    ctx.closePath();
    ctx.fill();
  }

  // golden eyes that blink every few seconds
  const blink = t % 4.2 < 0.14 ? 0.12 : 1;
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.translate(s * 15, -2);
    ctx.scale(1, blink);
    ctx.globalCompositeOperation = "lighter";
    drawSprite(ctx, glow("255,200,80"), 0, 0, 18, 0.5);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const eye = ctx.createRadialGradient(0, 0, 1, 0, 0, 9);
    eye.addColorStop(0, "#fff2a0");
    eye.addColorStop(1, "#e3a21a");
    ctx.fillStyle = eye;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.ellipse(1 + reach * 2, 0, 2.2, 6, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawBottle(ctx: Ctx, t: number) {
  const tip = easeInOutCubic((t - TIP) / (SPILL - TIP));
  const px = 352;
  ctx.save();
  // pivot on the bottom-right edge so it topples away from the cat
  ctx.translate(px, SHELF_Y);
  ctx.rotate(tip * (Math.PI / 2));
  ctx.translate(-14, 0);

  ctx.fillStyle = "rgba(200,170,255,0.35)";
  ctx.strokeStyle = "rgba(240,225,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -16, 15, 0, TAU);
  ctx.moveTo(-5, -30);
  ctx.lineTo(-5, -44);
  ctx.lineTo(5, -44);
  ctx.lineTo(5, -30);
  ctx.fill();
  ctx.stroke();
  // glowing potion inside
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow(MAGIC), 0, -14, 22, 0.8 * (1 - clamp((t - SPILL) / 0.6) * 0.7));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  // cork
  ctx.fillStyle = "#8a5a32";
  ctx.fillRect(-6, -50, 12, 7);
  ctx.restore();

  // spilt magic: a glowing puddle and a puff of sparkles
  const since = t - SPILL;
  if (since > 0) {
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5 * clamp(since / 0.4);
    ctx.drawImage(glow(MAGIC), px + 10, SHELF_Y - 10, 110, 18);
    if (since < 0.6) drawSprite(ctx, glow("245,225,255"), px + 40, SHELF_Y - 10, 160, 1 - since / 0.6);
    for (let i = 0; i < 30; i++) {
      const life = 2.2 + hash(i, 341);
      const p = ((since + hash(i, 342) * life) % life) / life;
      const x = px + 30 + (hash(i, 343) - 0.5) * 90 + Math.sin(p * 6 + i) * 18;
      const y = SHELF_Y - 14 - p * 260;
      const tw = twinkle(t, i + 900, 4);
      drawSparkle(ctx, x, y, 3 + 6 * tw * (1 - p), i % 3 ? MAGIC : "255,220,160", (1 - p) * tw * clamp(since / 0.3), p * 3);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
}

function draw(ctx: Ctx, t: number) {
  const candle = clamp(t / 0.8);
  drawRoom(ctx, t, candle);
  drawCandle(ctx, t, candle);
  drawBottle(ctx, t);
  // moonlit halo so a black cat still reads against the dark window
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("170,160,255"), CAT_X + 8, SHELF_Y - 150, 150, 0.28);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  drawCat(ctx, t);
  ctx.globalAlpha = 1;
}

export const catBookshelf: LiveScene = {
  id: "cat-bookshelf",
  name: "Black Cat",
  draw,
  stillTime: 3.4,
  text: {
    title: "Purrfectly Spooky",
    delay: SPILL + 0.2,
    color: "#f6eefb",
    accent: "#e2b8ff",
    glow: "0 0 16px rgba(200,140,255,0.75)",
    scrim: "linear-gradient(to bottom, rgba(28,19,34,0) 0%, rgba(28,19,34,0.6) 40%, rgba(28,19,34,0.92) 100%)",
  },
};
