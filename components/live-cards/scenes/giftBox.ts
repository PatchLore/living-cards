import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawBokehField,
  drawSparkle,
  drawSprite,
  easeInOutCubic,
  easeOutCubic,
  glow,
  hash,
  lerp,
} from "../engine";

const CX = 300;
const BOX_W = 230;
const BOX_H = 160;
const BOX_BOTTOM = 548;
const BOX_TOP = BOX_BOTTOM - BOX_H;
const LID_W = 252;
const LID_H = 44;
const POP = 2.0;
const GOLD = "255,205,110";
const CONFETTI = ["#f6d27a", "#ffffff", "#e8384f", "#3fae6a", "#ffb347"];

function goldRibbon(ctx: Ctx, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#a67a26");
  g.addColorStop(0.45, "#f8e09a");
  g.addColorStop(1, "#b98a2e");
  return g;
}

function drawBody(ctx: Ctx, dx: number) {
  const x = CX - BOX_W / 2 + dx;
  const g = ctx.createLinearGradient(x, 0, x + BOX_W, 0);
  g.addColorStop(0, "#e2334a");
  g.addColorStop(0.55, "#c21f36");
  g.addColorStop(1, "#8c1326");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(x, BOX_TOP, BOX_W, BOX_H);
  // subtle dot pattern
  ctx.fillStyle = "rgba(255,230,200,0.13)";
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.beginPath();
      ctx.arc(x + 14 + c * 29 + (r % 2) * 14, BOX_TOP + 16 + r * 26, 3, 0, TAU);
      ctx.fill();
    }
  }
  ctx.fillStyle = goldRibbon(ctx, CX - 18 + dx, CX + 18 + dx);
  ctx.fillRect(CX - 18 + dx, BOX_TOP, 36, BOX_H);
  // shade under the lid line
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x, BOX_TOP, BOX_W, 8);
}

/** Lid drawn around its own centre. */
function drawLid(ctx: Ctx, x: number, y: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const g = ctx.createLinearGradient(-LID_W / 2, 0, LID_W / 2, 0);
  g.addColorStop(0, "#ec3d55");
  g.addColorStop(0.55, "#cc2339");
  g.addColorStop(1, "#931529");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(-LID_W / 2, -LID_H / 2, LID_W, LID_H);
  ctx.fillStyle = goldRibbon(ctx, -18, 18);
  ctx.fillRect(-18, -LID_H / 2, 36, LID_H);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(-LID_W / 2, -LID_H / 2, LID_W, 5);

  // bow
  ctx.fillStyle = goldRibbon(ctx, -70, 70);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, -LID_H / 2);
    ctx.bezierCurveTo(s * 30, -LID_H / 2 - 70, s * 86, -LID_H / 2 - 40, s * 10, -LID_H / 2 - 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 4, -LID_H / 2 - 2);
    ctx.lineTo(s * 40, -LID_H / 2 + 26);
    ctx.lineTo(s * 26, -LID_H / 2 + 30);
    ctx.lineTo(0, -LID_H / 2 + 4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#c99a3c";
  ctx.beginPath();
  ctx.ellipse(0, -LID_H / 2 - 6, 13, 10, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function lidPose(t: number) {
  const restY = BOX_TOP - LID_H / 2 + 2;
  if (t < POP) {
    // rattles harder as the moment approaches
    const build = clamp((t - 0.6) / (POP - 0.6));
    const lift = Math.max(0, Math.sin(t * 26)) * 7 * build;
    return { x: CX + Math.sin(t * 40) * 3 * build, y: restY - lift, rot: Math.sin(t * 31) * 0.03 * build };
  }
  const e = easeInOutCubic((t - POP) / 0.95);
  const x1 = CX + BOX_W / 2 + 22;
  const y1 = BOX_BOTTOM - LID_W / 2 + 8;
  return {
    x: lerp(CX, x1, e),
    y: lerp(restY, y1, e) - 230 * Math.sin(Math.PI * e),
    rot: lerp(0, Math.PI / 2 + TAU, easeOutCubic((t - POP) / 0.95)),
  };
}

function draw(ctx: Ctx, t: number) {
  const bg = ctx.createRadialGradient(CX, 430, 0, CX, 430, 720);
  bg.addColorStop(0, "#6e1527");
  bg.addColorStop(0.5, "#3a0a15");
  bg.addColorStop(1, "#12030a");
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const opened = clamp((t - POP) / 0.6);
  ctx.globalCompositeOperation = "lighter";
  drawBokehField(ctx, t, {
    count: 26,
    seed: 51,
    colors: [GOLD, "230,60,80", "255,170,90"],
    yMin: -20,
    yMax: 920,
    rMin: 14,
    rMax: 48,
    alpha: 0.2 * clamp(t / 1.2),
  });

  // light pouring out of the open box
  if (opened > 0) {
    for (let k = 0; k < 12; k++) {
      const a = -Math.PI / 2 + (k - 5.5) * 0.17 + Math.sin(t * 0.4 + k) * 0.04;
      const len = 520;
      const g = ctx.createLinearGradient(CX, BOX_TOP, CX + Math.cos(a) * len, BOX_TOP + Math.sin(a) * len);
      g.addColorStop(0, `rgba(255,220,150,${0.16 * opened})`);
      g.addColorStop(1, "rgba(255,220,150,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(CX - 20, BOX_TOP);
      ctx.lineTo(CX + Math.cos(a - 0.05) * len, BOX_TOP + Math.sin(a - 0.05) * len);
      ctx.lineTo(CX + Math.cos(a + 0.05) * len, BOX_TOP + Math.sin(a + 0.05) * len);
      ctx.lineTo(CX + 20, BOX_TOP);
      ctx.closePath();
      ctx.fill();
    }
  }
  // soft glow on the floor
  ctx.globalAlpha = 0.35;
  ctx.drawImage(glow(GOLD), CX - 200, BOX_BOTTOM - 20, 400, 60);
  ctx.globalCompositeOperation = "source-over";

  const shake = t < POP ? Math.sin(t * 40) * 3 * clamp((t - 0.6) / (POP - 0.6)) : 0;
  drawBody(ctx, shake);

  if (opened > 0) {
    // the open top, glowing from inside
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#3a0710";
    ctx.beginPath();
    ctx.ellipse(CX, BOX_TOP, BOX_W / 2, 12, 0, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    drawSprite(ctx, glow(GOLD), CX, BOX_TOP, 230, 0.55 * opened + 0.1 * Math.sin(t * 3));
    drawSprite(ctx, glow("255,245,220"), CX, BOX_TOP, 70, 0.9 * opened);
    ctx.globalCompositeOperation = "source-over";
  }

  const lid = lidPose(t);
  drawLid(ctx, lid.x, lid.y, lid.rot);

  ctx.globalCompositeOperation = "lighter";
  // flash at the moment it opens
  const since = t - POP;
  if (since > 0 && since < 0.7) drawSprite(ctx, glow("255,250,235"), CX, BOX_TOP, 320, 1 - since / 0.7);

  // sparkles drifting up out of the box, emitted at fixed times so they never slide
  if (since > 0) {
    const dt = 0.05;
    const now = Math.floor(t / dt);
    for (let n = now; n > now - 60; n--) {
      const te = n * dt;
      if (te < POP) break;
      const age = t - te;
      const life = 1 - age / 2.8;
      if (life <= 0) continue;
      const x = CX + (hash(n, 1) - 0.5) * BOX_W * 0.8 + Math.sin(age * 3 + n) * 10;
      const y = BOX_TOP - 10 - age * (90 + 60 * hash(n, 2));
      drawSparkle(ctx, x, y, 5 + 6 * life * hash(n, 3), "255,236,180", life * 0.9, age * 2);
    }
  }
  ctx.globalCompositeOperation = "source-over";

  // confetti burst
  if (since > 0 && since < 4.5) {
    for (let i = 0; i < 130; i++) {
      const ang = -Math.PI / 2 + (hash(i, 61) - 0.5) * 1.9;
      const speed = 320 + 380 * hash(i, 62);
      const travel = speed * (since - 0.12 * since * since);
      const x = CX + Math.cos(ang) * travel + Math.sin(since * 4 + i) * 8 * since;
      const y = BOX_TOP + Math.sin(ang) * travel + 0.5 * 420 * since * since;
      if (y > H + 20) continue;
      const fadeOut = clamp(1 - (since - 3) / 1.5);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(since * (4 + 6 * hash(i, 63)) + i);
      ctx.scale(1, Math.cos(since * (6 + 4 * hash(i, 64)) + i));
      ctx.globalAlpha = fadeOut;
      ctx.fillStyle = CONFETTI[i % CONFETTI.length];
      const s = 5 + 5 * hash(i, 65);
      ctx.fillRect(-s / 2, -s / 4, s, s / 2);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
}

export const giftBox: LiveScene = {
  id: "gift-box",
  name: "Christmas Surprise",
  draw,
  stillTime: 3.2,
  text: {
    title: "Happy Christmas!",
    delay: POP + 0.6,
    color: "#fbf1e8",
    accent: "#ffd98a",
    glow: "0 0 16px rgba(255,200,110,0.7)",
    scrim: "linear-gradient(to bottom, rgba(18,3,10,0) 0%, rgba(18,3,10,0.55) 40%, rgba(18,3,10,0.88) 100%)",
  },
};
