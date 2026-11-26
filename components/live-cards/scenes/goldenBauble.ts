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
  easeOutBack,
  glow,
  hash,
  twinkle,
  wrap,
} from "../engine";

const ANCHOR_X = 300;
const ANCHOR_Y = -10;
const LENGTH = 360;
const R = 118;

const GOLD = "255,205,110";
const PALE = "255,240,200";

function drawBauble(ctx: Ctx, t: number) {
  // body
  const body = ctx.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.05, 0, 0, R * 1.25);
  body.addColorStop(0, "#fff7d8");
  body.addColorStop(0.22, "#f3c95e");
  body.addColorStop(0.58, "#b98228");
  body.addColorStop(1, "#4a2a0a");
  ctx.globalAlpha = 1;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, TAU);
  ctx.fill();

  ctx.save();
  ctx.clip();

  // burgundy band around the equator
  const band = ctx.createLinearGradient(-R, 0, R, 0);
  band.addColorStop(0, "#3a0710");
  band.addColorStop(0.35, "#9b1b2a");
  band.addColorStop(0.5, "#c4303d");
  band.addColorStop(1, "#2a050b");
  ctx.strokeStyle = band;
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.ellipse(0, 6, R * 1.02, R * 0.22, 0, 0, TAU);
  ctx.stroke();

  // gold beads on the front of the band
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI;
    const bx = Math.cos(a) * R * 1.02;
    const by = 6 + Math.sin(a) * R * 0.22;
    const tw = twinkle(t, k + 700, 2.2);
    ctx.fillStyle = `rgba(255,${215 + 30 * tw},${140 + 60 * tw},1)`;
    ctx.beginPath();
    ctx.arc(bx, by, 3.4 * (0.6 + 0.4 * Math.sin(a)), 0, TAU);
    ctx.fill();
  }

  // rim shadow for roundness
  const rim = ctx.createRadialGradient(0, 0, R * 0.6, 0, 0, R);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(20,8,0,0.45)");
  ctx.fillStyle = rim;
  ctx.fillRect(-R, -R, R * 2, R * 2);

  // window-light reflection
  ctx.globalCompositeOperation = "lighter";
  ctx.save();
  ctx.translate(-R * 0.42, -R * 0.45);
  ctx.rotate(-0.6);
  ctx.scale(1, 0.55);
  drawSprite(ctx, glow("255,250,235"), 0, 0, R * 0.42, 0.75);
  ctx.restore();
  drawSprite(ctx, glow("255,255,255"), -R * 0.36, -R * 0.42, 9, 1);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();

  // cap and loop
  const cap = ctx.createLinearGradient(-22, 0, 22, 0);
  cap.addColorStop(0, "#5b3a12");
  cap.addColorStop(0.35, "#f6dc8f");
  cap.addColorStop(0.6, "#b88a34");
  cap.addColorStop(1, "#4a2c0b");
  ctx.fillStyle = cap;
  ctx.fillRect(-22, -R - 20, 44, 28);
  ctx.strokeStyle = "rgba(60,35,8,0.6)";
  ctx.lineWidth = 1.2;
  for (let k = -16; k <= 16; k += 8) {
    ctx.beginPath();
    ctx.moveTo(k, -R - 20);
    ctx.lineTo(k, -R + 8);
    ctx.stroke();
  }
  ctx.strokeStyle = "#d9b45c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -R - 28, 9, 0, TAU);
  ctx.stroke();

  // glints dancing over the surface
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < 4; k++) {
    const cycle = Math.floor(t / 2.2 + k * 0.37);
    const p = (t / 2.2 + k * 0.37) % 1;
    const a = hash(cycle * 7 + k, 81) * TAU;
    const d = Math.sqrt(hash(cycle * 7 + k, 82)) * R * 0.75;
    drawSparkle(ctx, Math.cos(a) * d, Math.sin(a) * d, 14, PALE, Math.sin(p * Math.PI) * 0.9, p);
  }
  ctx.globalCompositeOperation = "source-over";
}

function draw(ctx: Ctx, t: number) {
  const bg = ctx.createRadialGradient(300, 380, 0, 300, 380, 720);
  bg.addColorStop(0, "#14402e");
  bg.addColorStop(0.5, "#0a2519");
  bg.addColorStop(1, "#03100a");
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const fade = clamp(t / 1.5);
  ctx.globalCompositeOperation = "lighter";
  drawBokehField(ctx, t, {
    count: 26,
    seed: 41,
    colors: [GOLD, "220,70,70", "255,170,90"],
    yMin: -20,
    yMax: 920,
    rMin: 14,
    rMax: 46,
    alpha: 0.22 * fade,
    drift: 10,
  });

  // drop in, then a gentle settling swing
  const drop = easeOutBack(t / 1.6);
  const amp = 0.05 + 0.18 * Math.exp(-t * 0.7);
  const theta = amp * Math.sin(t * 1.35);
  const offsetY = (1 - drop) * -520;

  ctx.save();
  ctx.translate(ANCHOR_X, ANCHOR_Y + offsetY);
  ctx.rotate(-theta);

  drawSprite(ctx, glow(GOLD), 0, LENGTH, R * 2.6, 0.32);
  ctx.globalCompositeOperation = "source-over";

  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#c9a24f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, LENGTH - R - 36);
  ctx.stroke();

  ctx.translate(0, LENGTH);
  drawBauble(ctx, t);
  ctx.restore();

  // gold dust
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 90; i++) {
    const x = hash(i, 91) * W + Math.sin(t * 0.6 + hash(i, 92) * TAU) * 16;
    const y = wrap(hash(i, 93) * 900 + t * (14 + 26 * hash(i, 94)), -20, 920);
    const tw = twinkle(t, i + 900, 3);
    drawSprite(ctx, glow(GOLD), x, y, 2 + 3 * tw, 0.7 * tw * fade);
    if (hash(i, 95) > 0.88) drawSparkle(ctx, x, y, 6 * tw, PALE, tw * fade, 0.3);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const goldenBauble: LiveScene = {
  id: "golden-bauble",
  name: "Golden Bauble",
  draw,
  stillTime: 5,
  text: {
    title: "Merry & Bright",
    delay: 1.6,
    color: "#f7efdc",
    accent: "#ffd77a",
    glow: "0 0 16px rgba(255,190,90,0.6)",
    scrim: "linear-gradient(to bottom, rgba(3,16,10,0) 0%, rgba(3,16,10,0.55) 45%, rgba(3,16,10,0.85) 100%)",
  },
};
