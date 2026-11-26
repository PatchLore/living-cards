import {
  type Ctx,
  type LiveScene,
  H,
  W,
  clamp,
  drawSnowDots,
  drawSprite,
  drawStars,
  easeInOutCubic,
  fillGradient,
  glow,
  hash,
  lerp,
  twinkle,
} from "../engine";

let curtains: HTMLCanvasElement[] | null = null;

/** 1px-wide vertical colour strips, stretched into aurora curtains. */
function curtainStrips() {
  if (curtains) return curtains;
  const make = (stops: [number, string][]) => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, 0, 256);
    for (const [p, col] of stops) g.addColorStop(p, col);
    x.fillStyle = g;
    x.fillRect(0, 0, 4, 256);
    return c;
  };
  curtains = [
    make([
      [0, "rgba(140,70,220,0)"],
      [0.35, "rgba(110,90,230,0.22)"],
      [0.7, "rgba(50,235,155,0.6)"],
      [0.92, "rgba(175,255,215,0.95)"],
      [1, "rgba(175,255,215,0)"],
    ]),
    make([
      [0, "rgba(255,90,180,0)"],
      [0.45, "rgba(220,90,200,0.25)"],
      [0.8, "rgba(80,220,200,0.5)"],
      [1, "rgba(80,220,200,0)"],
    ]),
  ];
  return curtains;
}

const RIBBONS = [
  { base: 225, amp: 38, h: 160, f1: 0.009, f2: 0.021, s1: 0.22, s2: -0.38, strip: 0, alpha: 0.8 },
  { base: 170, amp: 28, h: 105, f1: 0.012, f2: 0.017, s1: -0.18, s2: 0.3, strip: 1, alpha: 0.55 },
];

function drawAurora(ctx: Ctx, t: number, fade: number) {
  const strips = curtainStrips();
  drawSprite(ctx, glow("60,220,150"), 300, 210, 400, 0.13 * fade);
  for (const r of RIBBONS) {
    const img = strips[r.strip];
    for (let x = -10; x < W + 10; x += 3) {
      const y = r.base + r.amp * Math.sin(x * r.f1 + t * r.s1) + r.amp * 0.5 * Math.sin(x * r.f2 + t * r.s2 + 1.3);
      const hh = r.h * (0.75 + 0.35 * Math.sin(x * 0.013 + t * 0.5));
      let inten =
        0.3 +
        0.7 * (0.5 + 0.5 * Math.sin(x * 0.018 + t * 0.6)) * (0.5 + 0.5 * Math.sin(x * 0.006 - t * 0.23 + 2));
      inten *= 0.75 + 0.25 * Math.sin(x * 0.35 + t * 1.6); // fine vertical rays
      ctx.globalAlpha = clamp(inten * r.alpha * fade);
      ctx.drawImage(img, x, y - hh, 3.6, hh * 1.15);
    }
  }
}

function pine(ctx: Ctx, x: number, by: number, h: number) {
  const w = h * 0.4;
  const tiers = 4;
  const right: [number, number][] = [];
  for (let k = 1; k <= tiers; k++) {
    const yk = by - h + (h * 0.88 * k) / tiers;
    const wk = (w * k) / tiers;
    right.push([x + wk, yk]);
    if (k < tiers) right.push([x + wk * 0.4, yk - h * 0.02]);
  }
  right.push([x + w * 0.07, by - h * 0.12], [x + w * 0.07, by]);
  ctx.moveTo(x, by - h);
  for (const [px, py] of right) ctx.lineTo(px, py);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(2 * x - right[i][0], right[i][1]);
  ctx.closePath();
}

function drawForest(
  ctx: Ctx,
  o: { seed: number; baseY: number; hMin: number; hMax: number; step: number; color: string; skip?: [number, number] },
) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = o.color;
  ctx.beginPath();
  for (let i = 0, x = -20; x < W + 30; i++, x += o.step * (0.6 + 0.8 * hash(i + o.seed, 1))) {
    if (o.skip && x > o.skip[0] && x < o.skip[1]) continue;
    const by = o.baseY + 10 * Math.sin(x * 0.012 + o.seed);
    pine(ctx, x, by, lerp(o.hMin, o.hMax, hash(i + o.seed, 2)));
  }
  ctx.fill();
}

function drawCabin(ctx: Ctx, t: number) {
  const x = 330;
  const y = 528;
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#04080c";
  ctx.fillRect(x, y - 40, 74, 40);
  ctx.fillRect(x + 52, y - 66, 10, 22); // chimney
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 38);
  ctx.lineTo(x + 37, y - 72);
  ctx.lineTo(x + 84, y - 38);
  ctx.closePath();
  ctx.fill();
  // snow on the roof
  ctx.strokeStyle = "rgba(205,225,240,0.75)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 39);
  ctx.lineTo(x + 37, y - 72);
  ctx.lineTo(x + 83, y - 39);
  ctx.stroke();

  const flicker = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.7);
  ctx.fillStyle = `rgba(255,196,110,${flicker})`;
  ctx.fillRect(x + 14, y - 28, 14, 14);
  ctx.fillRect(x + 44, y - 28, 14, 14);
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,170,80"), x + 36, y - 21, 70, 0.4 * flicker);

  // chimney smoke
  for (let i = 0; i < 7; i++) {
    const p = (t * 0.18 + i / 7) % 1;
    const sx = x + 57 + Math.sin(p * 5 + i) * 8 + p * 30;
    const sy = y - 70 - p * 120;
    drawSprite(ctx, glow("150,165,185"), sx, sy, 10 + p * 26, 0.16 * Math.sin(p * Math.PI));
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawShootingStar(ctx: Ctx, t: number) {
  if (t < 4.5) return;
  const cycle = Math.floor((t - 4.5) / 7);
  const p = ((t - 4.5) % 7) / 0.9;
  if (p > 1) return;
  const sx = 70 + hash(cycle, 61) * 260;
  const sy = 60 + hash(cycle, 62) * 90;
  const hx = sx + p * 260;
  const hy = sy + p * 95;
  const g = ctx.createLinearGradient(hx - 120, hy - 44, hx, hy);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(1, `rgba(255,255,255,${0.9 * Math.sin(p * Math.PI)})`);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = g;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hx - 120, hy - 44);
  ctx.lineTo(hx, hy);
  ctx.stroke();
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#030612"],
    [0.45, "#071a2c"],
    [0.75, "#0d2a3a"],
    [1, "#0a1a26"],
  ]);

  const fade = easeInOutCubic((t - 0.3) / 3.5);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 170, seed: 9, yMax: 420, alpha: 0.9 * clamp(t / 1.2) });
  drawAurora(ctx, t, fade);
  ctx.globalCompositeOperation = "source-over";
  drawShootingStar(ctx, t);

  // distant mountains, tinted by the aurora
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0e2232";
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) {
    const y = 405 - 60 * Math.abs(Math.sin(x * 0.007 + 0.6)) - 25 * Math.abs(Math.sin(x * 0.021 + 1.7));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  drawForest(ctx, { seed: 3, baseY: 455, hMin: 28, hMax: 58, step: 14, color: "#08151f" });

  // moonlit snowfield
  const snow = ctx.createLinearGradient(0, 475, 0, H);
  snow.addColorStop(0, "#22374b");
  snow.addColorStop(0.3, "#132331");
  snow.addColorStop(1, "#070e15");
  ctx.fillStyle = snow;
  ctx.beginPath();
  ctx.moveTo(0, 497);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 485 + 14 * Math.sin(x * 0.011 + 0.4));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("60,220,150"), 300, 505, 260, 0.08 * fade);
  ctx.globalCompositeOperation = "source-over";

  drawCabin(ctx, t);
  drawForest(ctx, { seed: 21, baseY: 575, hMin: 85, hMax: 155, step: 30, color: "#03070b", skip: [190, 470] });

  ctx.globalCompositeOperation = "lighter";
  drawSnowDots(ctx, t, { count: 90, seed: 10, rMin: 0.8, rMax: 2.6, speed: 26, alpha: 0.75 * clamp(t / 1.5) });
  // a few stars catching the eye
  for (let i = 0; i < 3; i++) {
    const x = 90 + i * 190 + hash(i, 71) * 60;
    const y = 80 + hash(i, 72) * 120;
    drawSprite(ctx, glow("230,240,255"), x, y, 9 * (0.7 + 0.5 * twinkle(t, i + 500, 1.2)), 0.8);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const northernLights: LiveScene = {
  id: "northern-lights",
  name: "Northern Lights",
  draw,
  stillTime: 6,
  text: {
    title: "Happy Holidays",
    delay: 2.8,
    color: "#e4f4ef",
    accent: "#bfffe0",
    glow: "0 0 18px rgba(80,240,170,0.7)",
    scrim: "linear-gradient(to bottom, rgba(3,7,11,0) 0%, rgba(3,7,11,0.5) 40%, rgba(3,7,11,0.82) 100%)",
  },
};
