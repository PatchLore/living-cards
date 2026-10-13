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
} from "../engine";
import { drawBat, drawFallingLeaves, drawFog } from "./halloweenParts";

const CX = 320;
const CY = 468;
const RX = 122;
const RY = 92;
const STEP = 556;
const FLAME = "255,170,60";

/** Candle catches at 0.8s, then flickers. */
function candle(t: number) {
  if (t < 0.8) return 0;
  const on = clamp((t - 0.8) / 0.5);
  return on * (0.82 + 0.1 * Math.sin(t * 13) + 0.08 * Math.sin(t * 29 + 1));
}

function pumpkinBody(ctx: Ctx, cx: number, cy: number, rx: number, ry: number) {
  const ribs = [-2, 2, -1, 1, 0];
  for (const k of ribs) {
    const off = k * rx * 0.36;
    const w = rx * 0.56 * (1 - Math.abs(k) * 0.08);
    const g = ctx.createRadialGradient(cx + off - w * 0.3, cy - ry * 0.35, w * 0.1, cx + off, cy, ry * 1.1);
    g.addColorStop(0, "#f59a3c");
    g.addColorStop(0.55, "#c95a0c");
    g.addColorStop(1, "#6e2605");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx + off, cy, w, ry, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(110,40,5,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // stem
  ctx.fillStyle = "#4f6b2a";
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy - ry + 8);
  ctx.quadraticCurveTo(cx - 6, cy - ry - 22, cx + 10, cy - ry - 30);
  ctx.lineTo(cx + 16, cy - ry - 22);
  ctx.quadraticCurveTo(cx + 6, cy - ry - 12, cx + 9, cy - ry + 8);
  ctx.closePath();
  ctx.fill();
}

function face(ctx: Ctx) {
  ctx.beginPath();
  // eyes
  ctx.moveTo(CX - 62, CY - 14);
  ctx.lineTo(CX - 36, CY - 52);
  ctx.lineTo(CX - 12, CY - 14);
  ctx.closePath();
  ctx.moveTo(CX + 12, CY - 14);
  ctx.lineTo(CX + 36, CY - 52);
  ctx.lineTo(CX + 62, CY - 14);
  ctx.closePath();
  // nose
  ctx.moveTo(CX - 10, CY + 6);
  ctx.lineTo(CX, CY - 10);
  ctx.lineTo(CX + 10, CY + 6);
  ctx.closePath();
  // jagged grin
  ctx.moveTo(CX - 72, CY + 18);
  ctx.quadraticCurveTo(CX, CY + 40, CX + 72, CY + 18);
  ctx.lineTo(CX + 58, CY + 48);
  ctx.lineTo(CX + 40, CY + 40);
  ctx.lineTo(CX + 30, CY + 58);
  ctx.lineTo(CX + 14, CY + 46);
  ctx.lineTo(CX - 2, CY + 64);
  ctx.lineTo(CX - 16, CY + 46);
  ctx.lineTo(CX - 32, CY + 58);
  ctx.lineTo(CX - 42, CY + 40);
  ctx.lineTo(CX - 60, CY + 48);
  ctx.closePath();
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#140a26"],
    [0.45, "#2a1442"],
    [0.62, "#3c1d4c"],
    [1, "#140a1a"],
  ]);

  const fade = clamp(t / 1.2);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 70, seed: 131, yMax: 420, alpha: 0.7 * fade });
  drawSprite(ctx, glow("255,236,190"), 130, 170, 210, 0.35 * fade);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = fade;
  ctx.fillStyle = "#f6e9c4";
  ctx.beginPath();
  ctx.arc(130, 170, 62, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;

  // bats crossing the moon now and then
  for (let i = 0; i < 3; i++) {
    const cycle = 9;
    const p = ((t + i * 2.4) % cycle) / 5;
    if (p > 1) continue;
    drawBat(ctx, -40 + p * 680, 230 - i * 40 + Math.sin(p * 9 + i) * 18 - p * 60, 1.3 - i * 0.2, t * 16 + i);
  }

  // bare tree and fence on the right
  ctx.strokeStyle = "#0c0612";
  ctx.lineCap = "round";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(540, STEP);
  ctx.quadraticCurveTo(530, 420, 548, 300);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(542, 380);
  ctx.quadraticCurveTo(500, 340, 470, 300);
  ctx.moveTo(546, 330);
  ctx.quadraticCurveTo(580, 300, 600, 250);
  ctx.moveTo(500, 336);
  ctx.lineTo(486, 290);
  ctx.stroke();

  // stone step
  const step = ctx.createLinearGradient(0, STEP, 0, H);
  step.addColorStop(0, "#4a3d58");
  step.addColorStop(0.08, "#2e2539");
  step.addColorStop(1, "#0f0a14");
  ctx.fillStyle = step;
  ctx.fillRect(0, STEP, W, H - STEP);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, STEP, W, 3);

  const lit = candle(t);
  // light pooling on the step
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.45 * lit;
  ctx.drawImage(glow(FLAME), CX - 260, STEP - 30, 520, 90);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // small uncarved pumpkin beside it
  pumpkinBody(ctx, 150, 528, 50, 34);
  pumpkinBody(ctx, CX, CY, RX, RY);

  // carved face: dark inside until the candle catches
  face(ctx);
  ctx.fillStyle = "#2b1204";
  ctx.fill();
  if (lit > 0) {
    const g = ctx.createRadialGradient(CX, CY + 10, 4, CX, CY + 10, 80);
    g.addColorStop(0, "#fffbe0");
    g.addColorStop(0.4, "#ffe066");
    g.addColorStop(1, "#ff9a1f");
    face(ctx);
    ctx.globalAlpha = lit;
    ctx.fillStyle = g;
    ctx.fill();
    ctx.globalAlpha = 1;
    // carved rim so the cut-outs read as holes
    face(ctx);
    ctx.strokeStyle = "#4a1a03";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    drawSprite(ctx, glow(FLAME), CX, CY + 5, 230, 0.32 * lit);
    drawSprite(ctx, glow("255,230,160"), CX, CY + 10, 70, 0.45 * lit);
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.globalCompositeOperation = "lighter";
  drawFog(ctx, t, glow("190,170,220"), STEP - 10, 0.12 * fade);
  ctx.globalCompositeOperation = "source-over";

  drawFallingLeaves(ctx, t, 14, 3, 0.85 * fade);
  ctx.globalAlpha = 1;
}

export const pumpkinGlow: LiveScene = {
  id: "pumpkin-glow",
  name: "Pumpkin Glow",
  draw,
  stillTime: 2.5,
  text: {
    title: "Happy Halloween",
    delay: 1.6,
    color: "#f7ecdf",
    accent: "#ffad42",
    glow: "0 0 16px rgba(255,140,40,0.75)",
    scrim: "linear-gradient(to bottom, rgba(15,10,20,0) 0%, rgba(15,10,20,0.6) 40%, rgba(15,10,20,0.9) 100%)",
  },
};
