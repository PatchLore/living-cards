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
  easeOutBack,
  fillGradient,
  glow,
  hash,
  twinkle,
} from "../engine";
import { drawCrescent } from "./halloweenParts";

const GX = 300;
const R = 92;

function miniLantern(ctx: Ctx, t: number, x: number, y: number, s: number, i: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  for (const k of [-1, 1, 0]) {
    ctx.fillStyle = k === 0 ? "#f08a1e" : "#d9690f";
    ctx.beginPath();
    ctx.ellipse(k * 14, 0, 20, 24, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#4f6b2a";
  ctx.fillRect(-3, -30, 6, 9);
  const lit = 0.8 + 0.2 * Math.sin(t * 12 + i * 2);
  ctx.fillStyle = `rgba(255,${200 + 30 * lit},90,1)`;
  ctx.beginPath();
  ctx.moveTo(-14, -6);
  ctx.lineTo(-8, -14);
  ctx.lineTo(-2, -6);
  ctx.moveTo(2, -6);
  ctx.lineTo(8, -14);
  ctx.lineTo(14, -6);
  ctx.moveTo(-14, 6);
  ctx.quadraticCurveTo(0, 16, 14, 6);
  ctx.lineTo(0, 10);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,160,60"), 0, 0, 70, 0.35 * lit);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawGhost(ctx: Ctx, t: number) {
  const rise = easeOutBack(t / 1.6);
  const y = 700 - (700 - 330) * rise + Math.sin(t * 1.6) * 12;
  const x = GX + Math.sin(t * 0.7) * 10;
  const appear = clamp(t / 0.8);

  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("210,190,255"), x, y + 40, 230, 0.35 * appear);
  ctx.globalCompositeOperation = "source-over";

  // arms first, so the body covers where they join
  ctx.globalAlpha = appear;
  ctx.fillStyle = "#e7e1f4";
  // waving arm on the right
  const waving = t % 4 < 1.8;
  const armAng = waving ? -0.6 + 0.35 * Math.sin(t * 9) : 0.3;
  ctx.save();
  ctx.translate(x + R - 18, y + 50);
  ctx.rotate(armAng);
  ctx.beginPath();
  ctx.ellipse(26, 0, 30, 16, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  // little arm on the left
  ctx.beginPath();
  ctx.ellipse(x - R + 2, y + 66, 24, 14, 0.6, 0, TAU);
  ctx.fill();

  // body with a rippling hem
  const hemY = y + 150;
  const body = ctx.createRadialGradient(x - 30, y - 40, 10, x, y + 40, 200);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(1, "#ddd6f0");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x - R, y);
  ctx.arc(x, y, R, Math.PI, 0);
  ctx.quadraticCurveTo(x + R + 6, y + 80, x + R + 14, hemY);
  const waves = 5;
  for (let k = 0; k < waves; k++) {
    const x0 = x + R + 14 - ((k + 0.5) / waves) * (2 * R + 28);
    const x1 = x + R + 14 - ((k + 1) / waves) * (2 * R + 28);
    const dip = 18 + 6 * Math.sin(t * 4 + k);
    ctx.quadraticCurveTo(x0, hemY + (k % 2 ? -dip : dip), x1, hemY);
  }
  ctx.quadraticCurveTo(x - R - 6, y + 80, x - R, y);
  ctx.closePath();
  ctx.fill();

  // face
  ctx.globalAlpha = appear;
  const blink = t % 3.7 < 0.13 ? 0.15 : 1;
  ctx.fillStyle = "#1c1430";
  for (const dx of [-32, 32]) {
    ctx.beginPath();
    ctx.ellipse(x + dx, y - 6, 12, 17 * blink, 0, 0, TAU);
    ctx.fill();
  }
  if (blink === 1) {
    ctx.fillStyle = "#ffffff";
    for (const dx of [-32, 32]) {
      ctx.beginPath();
      ctx.arc(x + dx + 4, y - 13, 4, 0, TAU);
      ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(255,140,170,0.45)";
  for (const dx of [-54, 54]) {
    ctx.beginPath();
    ctx.ellipse(x + dx, y + 20, 13, 8, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#1c1430";
  ctx.beginPath();
  ctx.ellipse(x, y + 26, 9, 11 + 2 * Math.sin(t * 3), 0, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#170b2c"],
    [0.45, "#351a55"],
    [0.62, "#552869"],
    [1, "#1a0c22"],
  ]);
  const fade = clamp(t / 1.2);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 90, seed: 161, yMax: 480, alpha: 0.75 * fade });
  ctx.globalCompositeOperation = "source-over";

  // crescent moon
  drawCrescent(ctx, 490, 110, 36, "#fbefc8", fade);

  // rolling hill
  ctx.fillStyle = "#1d0d2b";
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 560 + 16 * Math.sin(x * 0.012 + 1));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  drawGhost(ctx, t);

  miniLantern(ctx, t, 92, 566, 1.1, 0);
  miniLantern(ctx, t, 510, 560, 0.9, 1);

  // sparkles floating round the ghost
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU + t * 0.4;
    const r = 150 + 30 * Math.sin(t + i);
    const tw = twinkle(t, i + 600, 3);
    drawSparkle(ctx, GX + Math.cos(a) * r, 380 + Math.sin(a) * r * 0.7, 4 + 5 * tw * hash(i, 171), "235,220,255", tw * 0.8 * clamp((t - 1) / 1));
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const friendlyGhost: LiveScene = {
  id: "friendly-ghost",
  name: "Friendly Ghost",
  draw,
  stillTime: 2.5,
  text: {
    title: "Boo!",
    delay: 1.6,
    color: "#f5eefc",
    accent: "#ffb347",
    glow: "0 0 18px rgba(255,160,60,0.7)",
    scrim: "linear-gradient(to bottom, rgba(26,12,34,0) 0%, rgba(26,12,34,0.55) 40%, rgba(26,12,34,0.9) 100%)",
  },
};
