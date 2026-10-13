import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSnowDots,
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

const MOON = { x: 320, y: 240, r: 112 };
const INK = "#060a17";

// Flight path: a quadratic arc that crosses the moon at its midpoint.
const P0 = [-170, 430];
const P1 = [300, 170];
const P2 = [780, 170];

const FLIGHT_START = 0.8;
const FLIGHT_TIME = 6.5;
const CYCLE = 10;

function pathAt(s: number) {
  const a = (1 - s) * (1 - s);
  const b = 2 * (1 - s) * s;
  const c = s * s;
  const dx = 2 * (1 - s) * (P1[0] - P0[0]) + 2 * s * (P2[0] - P1[0]);
  const dy = 2 * (1 - s) * (P1[1] - P0[1]) + 2 * s * (P2[1] - P1[1]);
  return {
    x: a * P0[0] + b * P1[0] + c * P2[0],
    y: a * P0[1] + b * P1[1] + c * P2[1],
    angle: Math.atan2(dy, dx),
  };
}

/** Sleigh's position on the path at a given time, or null before the first flight. */
function sleighS(time: number) {
  const local = time - FLIGHT_START;
  if (local < 0) return null;
  const phase = local % CYCLE;
  return -0.3 + (phase / FLIGHT_TIME) * 1.4;
}

function leg(ctx: Ctx, x: number, y: number, thigh: number, bend: number) {
  const kx = x + Math.sin(thigh) * 9;
  const ky = y + Math.cos(thigh) * 9;
  const shin = thigh + bend;
  ctx.moveTo(x, y);
  ctx.lineTo(kx, ky);
  ctx.lineTo(kx + Math.sin(shin) * 9, ky + Math.cos(shin) * 9);
}

function drawReindeer(ctx: Ctx, gait: number, rudolph: boolean) {
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 7.5, 0, 0, TAU);
  ctx.fill();

  // neck + head
  ctx.beginPath();
  ctx.moveTo(11, -4);
  ctx.lineTo(21, -16);
  ctx.lineTo(27, -18);
  ctx.lineTo(33, -15);
  ctx.lineTo(33, -12);
  ctx.lineTo(25, -11);
  ctx.lineTo(17, 3);
  ctx.closePath();
  ctx.fill();
  // tail
  ctx.beginPath();
  ctx.moveTo(-18, -4);
  ctx.lineTo(-25, -8);
  ctx.lineTo(-19, 0);
  ctx.fill();

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // antlers
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(23, -18);
  ctx.lineTo(19, -28);
  ctx.lineTo(13, -34);
  ctx.moveTo(20, -26);
  ctx.lineTo(25, -33);
  ctx.moveTo(16, -31);
  ctx.lineTo(17, -38);
  ctx.moveTo(25, -18);
  ctx.lineTo(24, -27);
  ctx.lineTo(29, -32);
  ctx.stroke();

  // galloping legs, folded under like they're bounding through the air
  const sw = Math.sin(gait);
  const sw2 = Math.sin(gait + 0.6);
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  leg(ctx, 12, 4, 1.0 + 0.5 * sw, -1.9);
  leg(ctx, 9, 5, 0.8 + 0.5 * sw2, -1.7);
  leg(ctx, -13, 4, -1.1 - 0.45 * sw, 0.7);
  leg(ctx, -10, 5, -0.9 - 0.45 * sw2, 0.6);
  ctx.stroke();

  if (rudolph) {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    const pulse = 0.75 + 0.25 * Math.sin(gait * 0.5);
    drawSprite(ctx, glow("255,60,50"), 34, -13.5, 16 * pulse, 1);
    drawSprite(ctx, glow("255,190,170"), 34, -13.5, 4, 1);
    ctx.globalCompositeOperation = prev;
    ctx.globalAlpha = 1;
  }
}

function drawSleigh(ctx: Ctx) {
  // sack
  ctx.beginPath();
  ctx.arc(-24, -21, 10, 0, TAU);
  ctx.moveTo(-28, -30);
  ctx.lineTo(-24, -37);
  ctx.lineTo(-20, -30);
  ctx.fill();

  // Santa
  ctx.beginPath();
  ctx.ellipse(-6, -20, 10, 11, 0, 0, TAU);
  ctx.arc(-4, -34, 6.5, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-9.5, -37);
  ctx.quadraticCurveTo(-14, -48, -22, -42);
  ctx.lineTo(1, -38);
  ctx.closePath();
  ctx.arc(-22, -42, 2.6, 0, TAU);
  ctx.fill();

  // body with curled back and swan-neck front
  ctx.beginPath();
  ctx.moveTo(-34, -26);
  ctx.quadraticCurveTo(-41, -30, -38, -20);
  ctx.quadraticCurveTo(-36, -4, -26, 0);
  ctx.lineTo(16, 0);
  ctx.quadraticCurveTo(26, -2, 28, -12);
  ctx.quadraticCurveTo(30, -19, 24, -16);
  ctx.lineTo(14, -10);
  ctx.lineTo(-24, -12);
  ctx.quadraticCurveTo(-28, -20, -34, -26);
  ctx.fill();

  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-34, 9);
  ctx.lineTo(26, 9);
  ctx.quadraticCurveTo(38, 9, 36, -2);
  ctx.moveTo(-20, 0);
  ctx.lineTo(-20, 9);
  ctx.moveTo(10, 0);
  ctx.lineTo(10, 9);
  // arm holding the reins
  ctx.moveTo(-1, -24);
  ctx.lineTo(14, -20);
  ctx.stroke();
}

function drawTeam(ctx: Ctx, t: number, s: number) {
  const SCALE = 1.1;
  const GAP = 0.058;
  const sleigh = pathAt(s);
  const bob = Math.sin(t * 3) * 3;

  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.shadowColor = "rgba(255,232,190,0.55)";
  ctx.shadowBlur = 8;
  ctx.globalAlpha = 1;

  // reins: from Santa's hands through each reindeer
  const chest: [number, number][] = [];
  for (let k = 1; k <= 4; k++) {
    const p = pathAt(s + GAP * k);
    chest.push([p.x + Math.cos(p.angle) * 10, p.y + Math.sin(t * 8 + k) * 2 - 2]);
  }
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sleigh.x + Math.cos(sleigh.angle) * 16, sleigh.y + bob - 22);
  for (const [x, y] of chest) ctx.lineTo(x, y);
  ctx.stroke();

  for (let k = 4; k >= 1; k--) {
    const p = pathAt(s + GAP * k);
    ctx.save();
    ctx.translate(p.x, p.y + Math.sin(t * 8 + k) * 2);
    ctx.rotate(p.angle * 0.8);
    ctx.scale(SCALE, SCALE);
    drawReindeer(ctx, t * 9 + k * 0.8, k === 4);
    ctx.restore();
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;
  }

  ctx.save();
  ctx.translate(sleigh.x, sleigh.y + bob);
  ctx.rotate(sleigh.angle * 0.7);
  ctx.scale(SCALE, SCALE);
  drawSleigh(ctx);
  ctx.restore();

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

/** Magic dust left behind the sleigh, emitted at fixed times so it never slides. */
function drawTrail(ctx: Ctx, t: number) {
  const dt = 0.018;
  const now = Math.floor(t / dt);
  for (let n = now; n > now - 220; n--) {
    const te = n * dt;
    const s = sleighS(te);
    if (s === null || s < -0.1 || s > 1.15) continue;
    const age = t - te;
    const life = 1 - age / 3.9;
    if (life <= 0) continue;
    const p = pathAt(s);
    const x = p.x - 30 + (hash(n, 1) - 0.5) * 16 * (1 + age * 2);
    const y = p.y + 6 + age * 22 + (hash(n, 2) - 0.5) * 12 * (1 + age);
    const tw = twinkle(t, n, 5);
    const a = life * (0.45 + 0.55 * tw);
    drawSprite(ctx, glow(hash(n, 3) > 0.7 ? "255,255,240" : "255,205,120"), x, y, 4 + 7 * life * tw, a);
    if (hash(n, 4) > 0.85) drawSparkle(ctx, x, y, 7 * life, "255,250,230", a, age);
  }
}

function drawMoon(ctx: Ctx, alpha: number) {
  const { x, y, r } = MOON;
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,225,170"), x, y, r * 4, 0.35 * alpha);
  drawSprite(ctx, glow("255,245,220"), x, y, r * 1.8, 0.5 * alpha);
  ctx.globalCompositeOperation = "source-over";

  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  g.addColorStop(0, "#fffdf6");
  g.addColorStop(0.6, "#fbf1d8");
  g.addColorStop(1, "#ead8ac");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 12; i++) {
    const a = hash(i, 21) * TAU;
    const d = Math.sqrt(hash(i, 22)) * r * 0.85;
    const cx = x + Math.cos(a) * d;
    const cy = y + Math.sin(a) * d;
    const cr = lerp(r * 0.06, r * 0.26, hash(i, 23));
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cg.addColorStop(0, "rgba(190,160,110,0.3)");
    cg.addColorStop(1, "rgba(190,160,110,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
  }
  ctx.restore();
}

function drawClouds(ctx: Ctx, t: number, alpha: number) {
  const puff = glow("150,165,205");
  for (let i = 0; i < 6; i++) {
    const y = 150 + hash(i, 31) * 220;
    const x = ((hash(i, 32) * 900 + t * (6 + hash(i, 33) * 6)) % 900) - 150;
    ctx.globalAlpha = 0.16 * alpha;
    ctx.drawImage(puff, x - 140, y - 18, 280, 36);
    ctx.drawImage(puff, x - 60, y - 30, 160, 44);
  }
}

function drawTown(ctx: Ctx, t: number) {
  // moonlit hills
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#18264a";
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 500 - 30 * Math.sin(x * 0.008 + 0.5) - 12 * Math.sin(x * 0.02));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  const BASE = 585;
  const windows: [number, number, number][] = [];
  ctx.fillStyle = "#0a1024";
  ctx.beginPath();
  let x = -12;
  for (let i = 0; x < W + 20; i++) {
    if (i === 6) {
      // church steeple
      ctx.rect(x, BASE - 120, 30, 120);
      ctx.moveTo(x - 4, BASE - 120);
      ctx.lineTo(x + 15, BASE - 195);
      ctx.lineTo(x + 34, BASE - 120);
      windows.push([x + 11, BASE - 100, i * 10]);
      x += 40;
      continue;
    }
    const w = 46 + hash(i, 41) * 40;
    const h = 42 + hash(i, 42) * 46;
    const roof = w * 0.42;
    ctx.rect(x, BASE - h, w, h);
    ctx.moveTo(x - 5, BASE - h);
    ctx.lineTo(x + w / 2, BASE - h - roof);
    ctx.lineTo(x + w + 5, BASE - h);
    if (hash(i, 43) > 0.4) ctx.rect(x + w * 0.68, BASE - h - roof * 0.9, 8, roof * 0.6);
    const cols = Math.max(1, Math.floor(w / 22));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 2; r++) {
        if (hash(i * 10 + c, r + 44) > 0.45) windows.push([x + 9 + c * 20, BASE - h + 10 + r * 20, i * 10 + c + r]);
      }
    }
    x += w + 4 + hash(i, 45) * 8;
  }
  ctx.fill();

  // lit windows
  for (const [wx, wy, id] of windows) {
    const flick = 0.8 + 0.2 * twinkle(t, id + 400, 0.7);
    ctx.globalAlpha = flick;
    ctx.fillStyle = "#ffcf7a";
    ctx.fillRect(wx, wy, 7, 9);
  }
  ctx.globalCompositeOperation = "lighter";
  for (const [wx, wy, id] of windows) drawSprite(ctx, glow("255,170,80"), wx + 3.5, wy + 4.5, 16, 0.3 * twinkle(t, id + 400, 0.7));
  ctx.globalCompositeOperation = "source-over";

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#101a33";
  ctx.fillRect(0, BASE, W, H - BASE);
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#070d24"],
    [0.3, "#13214a"],
    [0.6, "#1d2d5c"],
    [1, "#0c1430"],
  ]);

  const fade = easeOutCubic(t / 1.6);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 120, seed: 14, yMax: 480, alpha: 0.85 * fade });
  ctx.globalCompositeOperation = "source-over";

  drawMoon(ctx, fade);
  drawClouds(ctx, t, fade);

  ctx.globalCompositeOperation = "lighter";
  drawTrail(ctx, t);
  ctx.globalCompositeOperation = "source-over";

  const s = sleighS(t);
  if (s !== null && s < 1.2) drawTeam(ctx, t, s);

  drawTown(ctx, t);

  ctx.globalCompositeOperation = "lighter";
  drawSnowDots(ctx, t, { count: 110, seed: 15, rMin: 0.8, rMax: 2.6, speed: 24, alpha: 0.7 * clamp(t / 1.2) });
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const santaSleigh: LiveScene = {
  id: "santa-sleigh",
  name: "Santa's Moonlit Ride",
  draw,
  stillTime: 4.5,
  text: {
    title: "Merry Christmas",
    delay: 4.2,
    color: "#f3efe6",
    accent: "#ffe2a3",
    glow: "0 0 18px rgba(255,210,140,0.6)",
    scrim: "linear-gradient(to bottom, rgba(8,12,30,0) 0%, rgba(8,12,30,0.55) 45%, rgba(8,12,30,0.85) 100%)",
  },
};
