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
  twinkle,
} from "../engine";

const SKYLINE = 520;
const CYCLE = 7.2;
const COLOURS = ["255,214,120", "255,120,170", "120,220,255", "190,140,255", "140,255,190", "255,170,110"];

/** One cycle of fireworks: launch time, x, burst height, colour, size. Repeats every CYCLE seconds. */
const BURSTS = Array.from({ length: 15 }, (_, i) => ({
  launch: 0.1 + i * 0.47 + hash(i, 1) * 0.2,
  x: lerp(90, 510, hash(i, 2)),
  y: lerp(120, 320, hash(i, 3)),
  colour: COLOURS[i % COLOURS.length],
  size: lerp(110, 170, hash(i, 4)),
  sparks: 52 + Math.floor(hash(i, 5) * 24),
}));
const RISE = 0.85;
const LIFE = 2.2;

/** Draws every firework that's visible at time t; `mirror` draws the river reflection. */
function drawFireworks(ctx: Ctx, t: number, mirror = false) {
  // reflections mirror at the waterline, squashed like rippling water
  const reflect = (y: number) => (mirror ? SKYLINE + (SKYLINE - y) * 0.45 : y);
  const fade = mirror ? 0.28 : 1;
  for (const cycle of [0, -1]) {
    for (const [i, b] of BURSTS.entries()) {
      const launch = b.launch + cycle * CYCLE + Math.floor(t / CYCLE) * CYCLE;
      const dt = t - launch;
      if (dt < 0 || dt > RISE + LIFE) continue;
      const startY = SKYLINE + 10;
      if (dt < RISE) {
        // the rocket climbing, with a short glittering trail
        const p = dt / RISE;
        const y = lerp(startY, b.y, 1 - Math.pow(1 - p, 2));
        for (let k = 0; k < 6; k++) {
          const ty = lerp(startY, b.y, 1 - Math.pow(1 - Math.max(0, p - k * 0.03), 2));
          drawSprite(ctx, glow("255,230,180"), b.x + Math.sin(k + i) * 1.5, reflect(ty), 3.5 - k * 0.4, 0.8 * (1 - k / 6) * fade);
        }
        drawSprite(ctx, glow("255,240,210"), b.x, reflect(y), 6, fade);
        continue;
      }
      const age = dt - RISE;
      const life = age / LIFE;
      // the flash, then the sparks spreading, slowing and falling
      drawSprite(ctx, glow(b.colour), b.x, reflect(b.y), b.size * 1.3 * (1 - life * 0.6), 0.75 * Math.pow(1 - life, 2.5) * fade);
      drawSprite(ctx, glow("255,250,235"), b.x, reflect(b.y), 26 * (1 - life), 0.9 * Math.pow(1 - life, 6) * fade);
      const spread = b.size * (1 - Math.exp(-age * 2.6));
      const fall = 26 * age * age;
      const alpha = Math.pow(1 - life, 1.4) * fade;
      for (let k = 0; k < b.sparks; k++) {
        const a = (k / b.sparks) * TAU + hash(k, i + 10) * 0.12;
        const r = spread * (0.82 + 0.18 * hash(k, i + 20));
        const x = b.x + Math.cos(a) * r;
        const y = b.y + Math.sin(a) * r + fall;
        const flicker = life > 0.55 ? 0.5 + 0.5 * twinkle(t * 3, k + i * 100, 6) : 1;
        drawSprite(ctx, glow(b.colour), x, reflect(y), 8 * (1 - life * 0.4), alpha * flicker);
        drawSprite(ctx, glow("255,250,235"), x, reflect(y), 2.6, alpha * flicker * 0.9);
        // a short tail pointing back towards the centre
        const tx = b.x + Math.cos(a) * r * 0.9;
        const ty = b.y + Math.sin(a) * r * 0.9 + fall * 0.9;
        drawSprite(ctx, glow(b.colour), tx, reflect(ty), 4.5, alpha * 0.55);
      }
    }
  }
}

function building(ctx: Ctx, x: number, w: number, h: number, t: number, seed: number) {
  const top = SKYLINE - h;
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0b0f22";
  ctx.fillRect(x, top, w, h + 2);
  // lit windows, a few switching on and off
  for (let row = 0; row * 14 + 10 < h - 8; row++) {
    for (let col = 0; col * 11 + 6 < w - 4; col++) {
      const s = seed * 1000 + row * 40 + col;
      if (hash(s, 1) > 0.45) continue;
      const on = hash(s, 2) > 0.12 || Math.sin(t * 0.7 + hash(s, 3) * 20) > 0;
      if (!on) continue;
      ctx.fillStyle = hash(s, 4) > 0.5 ? "rgba(255,214,140,0.85)" : "rgba(255,240,200,0.7)";
      ctx.fillRect(x + 5 + col * 11, top + 8 + row * 14, 5, 7);
    }
  }
}

/** A clock tower in the middle of the skyline, both hands pointing to midnight. */
function clockTower(ctx: Ctx, t: number) {
  const x = 300;
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0d1228";
  ctx.fillRect(x - 26, SKYLINE - 250, 52, 252);
  ctx.beginPath();
  ctx.moveTo(x - 30, SKYLINE - 250);
  ctx.lineTo(x, SKYLINE - 320);
  ctx.lineTo(x + 30, SKYLINE - 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - 2, SKYLINE - 342, 4, 26);
  // the clock face, glowing
  const cy = SKYLINE - 212;
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,226,160"), x, cy, 50, 0.5);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff0c8";
  ctx.beginPath();
  ctx.arc(x, cy, 19, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#5a4320";
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * TAU;
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(a) * 15, cy - Math.cos(a) * 15);
    ctx.lineTo(x + Math.sin(a) * 17.5, cy - Math.cos(a) * 17.5);
    ctx.stroke();
  }
  // the minute hand ticks up to twelve as the card opens
  const settle = clamp(t / 1.2);
  const minute = lerp(-0.5, 0, 1 - Math.pow(1 - settle, 3));
  ctx.lineCap = "round";
  ctx.strokeStyle = "#2a1d0c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x, cy - 10);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x + Math.sin(minute) * 15, cy - Math.cos(minute) * 15);
  ctx.stroke();
  // windows lower down the tower
  ctx.fillStyle = "rgba(255,214,140,0.8)";
  for (let k = 0; k < 4; k++) ctx.fillRect(x - 6, SKYLINE - 160 + k * 34, 12, 16);
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#070a1c"],
    [0.4, "#15123a"],
    [0.58, "#2a1a4a"],
    [0.66, "#120f2a"],
    [1, "#06081a"],
  ]);
  const fade = clamp(t / 1);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 70, seed: 61, yMax: 360, alpha: 0.6 * fade });
  drawFireworks(ctx, t);
  ctx.globalCompositeOperation = "source-over";

  // city skyline, the clock tower in the middle
  const towers: [number, number, number][] = [
    [0, 70, 120], [66, 54, 170], [116, 60, 95], [172, 46, 140], [214, 50, 110],
    [334, 52, 120], [382, 44, 160], [422, 62, 100], [480, 48, 185], [524, 76, 130],
  ];
  towers.forEach(([x, w, h], i) => building(ctx, x, w, h, t, i + 3));
  clockTower(ctx, t);

  // the river, reflecting the fireworks and the city lights
  ctx.globalAlpha = 1;
  const water = ctx.createLinearGradient(0, SKYLINE, 0, H);
  water.addColorStop(0, "#141433");
  water.addColorStop(0.4, "#0b0c24");
  water.addColorStop(1, "#05061a");
  ctx.fillStyle = water;
  ctx.fillRect(0, SKYLINE, W, H - SKYLINE);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, SKYLINE + 6, W, H);
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  drawFireworks(ctx, t, true);
  // shimmering streaks of window light on the water
  for (let i = 0; i < 40; i++) {
    const x = hash(i, 71) * W;
    const y = SKYLINE + 14 + hash(i, 72) * 120;
    const len = 10 + hash(i, 73) * 26;
    const shimmer = 0.25 + 0.25 * Math.sin(t * 2.4 + i * 1.7);
    ctx.globalAlpha = shimmer * fade;
    ctx.fillStyle = hash(i, 74) > 0.5 ? "#ffd68c" : "#ffb0d0";
    ctx.fillRect(x + Math.sin(t * 1.5 + i) * 4, y, len, 1.6);
  }
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";

  // the embankment edge
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#04050f";
  ctx.fillRect(0, SKYLINE, W, 6);
}

export const newYearFireworks: LiveScene = {
  id: "new-year-fireworks",
  name: "New Year Fireworks",
  draw,
  stillTime: 1.8,
  text: {
    title: "Happy New Year",
    delay: 2.2,
    color: "#fff8ee",
    accent: "#ffd68c",
    glow: "0 0 18px rgba(255,180,220,0.75)",
    scrim: "linear-gradient(to bottom, rgba(6,8,26,0) 0%, rgba(6,8,26,0.55) 40%, rgba(6,8,26,0.9) 100%)",
  },
};
