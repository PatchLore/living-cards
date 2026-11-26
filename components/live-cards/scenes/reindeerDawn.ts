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
  easeOutCubic,
  fillGradient,
  glow,
  hash,
  lerp,
} from "../engine";

const SUN = { x: 300, y0: 520, y1: 432, r: 46 };
const GROUND = 560;
/** Where the reindeer stands (its front hooves). */
const DEER = { x: 330, y: 600 };

function pine(ctx: Ctx, x: number, base: number, h: number, color: string, snow?: string) {
  ctx.globalAlpha = 1;
  for (let k = 0; k < 5; k++) {
    const tip = base - h + k * h * 0.17;
    const half = h * 0.13 + k * h * 0.06;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, tip);
    ctx.lineTo(x + half, tip + h * 0.26);
    ctx.lineTo(x - half, tip + h * 0.26);
    ctx.closePath();
    ctx.fill();
    if (snow) {
      ctx.fillStyle = snow;
      ctx.beginPath();
      ctx.moveTo(x, tip);
      ctx.lineTo(x + half * 0.5, tip + h * 0.12);
      ctx.lineTo(x - half * 0.7, tip + h * 0.14);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.fillStyle = color;
  ctx.fillRect(x - h * 0.025, base - h * 0.04, h * 0.05, h * 0.06);
}

/** One antler: a curved beam with tines, drawn as thick strokes. */
function antler(ctx: Ctx, flip: number) {
  ctx.save();
  ctx.scale(flip, 1);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-6, -24, -22, -44, -16, -72);
  ctx.moveTo(-6, -24);
  ctx.lineTo(-22, -30);
  ctx.moveTo(-12, -44);
  ctx.lineTo(-30, -52);
  ctx.moveTo(-16, -58);
  ctx.lineTo(-6, -72);
  ctx.moveTo(-4, -12);
  ctx.lineTo(8, -20);
  ctx.stroke();
  ctx.restore();
}

/** A reindeer in profile facing left, drawn around its front hooves. */
function drawReindeer(ctx: Ctx, t: number) {
  const breathe = Math.sin(t * 1.6) * 1.5;
  const nod = Math.sin(t * 0.7) * 0.05;
  ctx.save();
  ctx.translate(DEER.x, DEER.y);

  const coat = ctx.createLinearGradient(0, -170, 0, 0);
  coat.addColorStop(0, "#7a4a2c");
  coat.addColorStop(1, "#4a2a18");
  ctx.fillStyle = coat;
  ctx.strokeStyle = coat;
  ctx.globalAlpha = 1;

  // legs (back pair a shade darker)
  ctx.lineCap = "round";
  for (const [x, w, shade] of [[-118, 11, "#3e2314"], [-96, 12, "#4a2a18"], [-18, 11, "#3e2314"], [4, 12, "#4a2a18"]] as const) {
    ctx.strokeStyle = shade;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, -80);
    ctx.lineTo(x + 3, -42);
    ctx.lineTo(x - 1, -6);
    ctx.stroke();
    ctx.fillStyle = "#24140a";
    ctx.beginPath();
    ctx.ellipse(x, -3, 8, 5, 0, 0, TAU);
    ctx.fill();
  }

  // body
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.ellipse(-56, -104 + breathe * 0.3, 80, 38 + breathe * 0.4, -0.03, 0, TAU);
  ctx.fill();
  // pale belly and rump
  ctx.fillStyle = "#c9a882";
  ctx.beginPath();
  ctx.ellipse(-60, -78, 54, 12, 0, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-130, -108, 12, 18, 0.3, 0, TAU);
  ctx.fill();
  // tail
  ctx.fillStyle = "#e9dcc6";
  ctx.beginPath();
  ctx.ellipse(-140, -122, 7, 10, 0.6, 0, TAU);
  ctx.fill();

  // neck with a shaggy cream mane, then head (nodding gently)
  ctx.save();
  ctx.translate(2, -128);
  ctx.rotate(nod);
  ctx.fillStyle = "#6e4128";
  ctx.beginPath();
  ctx.moveTo(-26, 30);
  ctx.quadraticCurveTo(-10, -30, 14, -58);
  ctx.lineTo(40, -50);
  ctx.quadraticCurveTo(26, -10, 22, 34);
  ctx.closePath();
  ctx.fill();
  // soft pale ruff down the front of the neck, ending in shaggy tufts
  ctx.fillStyle = "#b58e66";
  ctx.beginPath();
  ctx.ellipse(25, -4, 9, 34, 0.12, 0, TAU);
  ctx.fill();
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(16 + k * 6, 22);
    ctx.lineTo(19 + k * 6, 40);
    ctx.lineTo(24 + k * 6, 22);
    ctx.closePath();
    ctx.fill();
  }

  // head
  ctx.save();
  ctx.translate(26, -58);
  // drawn facing left, mirrored so it looks the way the reindeer is facing
  ctx.scale(-1, 1);
  ctx.fillStyle = "#6a3e24";
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 17, -0.2, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-22, 10, 18, 11, -0.35, 0, TAU);
  ctx.fill();
  // muzzle and nose
  ctx.fillStyle = "#3a2214";
  ctx.beginPath();
  ctx.ellipse(-37, 15, 7, 6, 0, 0, TAU);
  ctx.fill();
  // eye
  ctx.fillStyle = "#140a04";
  ctx.beginPath();
  ctx.arc(-6, -4, 3.4, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.arc(-7, -5.2, 1.1, 0, TAU);
  ctx.fill();
  // ear
  ctx.fillStyle = "#7a4a2c";
  ctx.beginPath();
  ctx.ellipse(12, -10, 13, 6, -0.7, 0, TAU);
  ctx.fill();
  // antlers
  ctx.strokeStyle = "#cdb48c";
  ctx.save();
  ctx.translate(2, -14);
  antler(ctx, -1);
  ctx.restore();
  ctx.strokeStyle = "#b59a72";
  ctx.save();
  ctx.translate(-6, -12);
  ctx.globalAlpha = 0.85;
  antler(ctx, 1);
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();

  // golden rim light from the dawn behind
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "rgba(255,200,120,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(-56, -104, 80, 38, -0.03, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

/** Breath clouds puffing from the nose every couple of seconds. */
function drawBreath(ctx: Ctx, t: number) {
  const nose = { x: DEER.x + 68, y: DEER.y - 172 };
  const puff = glow("236,240,250");
  for (let k = 0; k < 3; k++) {
    const age = ((t + k * 0.9) % 2.7) / 2.7;
    const x = nose.x + age * 70;
    const y = nose.y - age * 30 + Math.sin(age * 5 + k) * 4;
    drawSprite(ctx, puff, x, y, 10 + age * 34, 0.42 * Math.sin(age * Math.PI) * clamp(t / 1.5));
  }
}

function draw(ctx: Ctx, t: number) {
  const rise = easeOutCubic(clamp(t / 4));
  // dawn sky: deep blue fading to rose and gold at the horizon, brightening as the sun rises
  fillGradient(ctx, [
    [0, "#1b2a55"],
    [0.32, lerp(0, 1, rise) > 0.5 ? "#3d4f86" : "#33447a"],
    [0.52, "#c27a8e"],
    [0.6, "#f2b07c"],
    [0.66, "#ffd9a0"],
    [1, "#20283f"],
  ]);

  // fading stars
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 40; i++) {
    const x = hash(i, 71) * W;
    const y = hash(i, 72) * 260;
    drawSprite(ctx, glow("230,236,255"), x, y, 2.4, (0.7 - rise * 0.6) * (0.5 + 0.5 * Math.sin(t * 2 + i)));
  }

  // the sun rising over the hills, with soft rays
  const sunY = lerp(SUN.y0, SUN.y1, rise);
  drawSprite(ctx, glow("255,214,150"), SUN.x, sunY, 260, 0.55);
  drawSprite(ctx, glow("255,236,200"), SUN.x, sunY, 120, 0.7);
  ctx.save();
  ctx.translate(SUN.x, sunY);
  for (let k = 0; k < 12; k++) {
    const a = -Math.PI + (k / 11) * Math.PI;
    const len = 300 + 60 * Math.sin(t * 0.8 + k * 1.3);
    const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
    g.addColorStop(0, "rgba(255,220,160,0.16)");
    g.addColorStop(1, "rgba(255,220,160,0)");
    ctx.fillStyle = g;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a - 0.05) * len, Math.sin(a - 0.05) * len);
    ctx.lineTo(Math.cos(a + 0.05) * len, Math.sin(a + 0.05) * len);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff6e2";
  ctx.beginPath();
  ctx.arc(SUN.x, sunY, SUN.r, 0, TAU);
  ctx.fill();

  // far hills hide the bottom of the sun
  ctx.fillStyle = "#6d6f9a";
  ctx.beginPath();
  ctx.moveTo(0, 470);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 462 + 18 * Math.sin(x * 0.01 + 2));
  ctx.lineTo(W, 560);
  ctx.lineTo(0, 560);
  ctx.closePath();
  ctx.fill();

  // misty pine forest on either side
  for (let i = 0; i < 14; i++) {
    const left = i < 7;
    const x = left ? 10 + i * 28 + hash(i, 81) * 14 : 400 + (i - 7) * 30 + hash(i, 81) * 14;
    pine(ctx, x, 540, lerp(110, 170, hash(i, 82)), "#3b4170", "#a7a9cc");
  }

  // the snowy clearing, warm where the sun touches it
  const field = ctx.createLinearGradient(0, 500, 0, H);
  field.addColorStop(0, "#f7e2cf");
  field.addColorStop(0.2, "#d9cbe0");
  field.addColorStop(0.55, "#8d8fb8");
  field.addColorStop(1, "#262c48");
  ctx.fillStyle = field;
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, GROUND - 14 + 10 * Math.sin(x * 0.018 + 0.7));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // the reindeer's long shadow and hoofprints
  ctx.fillStyle = "rgba(60,62,110,0.28)";
  ctx.beginPath();
  ctx.ellipse(DEER.x - 30, DEER.y + 6, 120, 10, 0, 0, TAU);
  ctx.fill();
  for (let k = 0; k < 7; k++) {
    ctx.fillStyle = "rgba(90,90,140,0.35)";
    ctx.beginPath();
    ctx.ellipse(DEER.x + 40 + k * 26, DEER.y + 18 + k * 9, 5, 2.5, 0, 0, TAU);
    ctx.fill();
  }

  drawReindeer(ctx, t);
  drawBreath(ctx, t);

  // near pines framing the scene
  pine(ctx, 40, 700, 320, "#1d2445", "#dfe3f3");
  pine(ctx, 570, 690, 280, "#1d2445", "#dfe3f3");

  // glints of sunlight on the snow, and a few drifting flakes
  for (let i = 0; i < 16; i++) {
    const x = hash(i, 91) * W;
    const y = 570 + hash(i, 92) * 90;
    drawSparkle(ctx, x, y, 5, "255,236,200", 0.75 * Math.max(0, Math.sin(t * 1.8 + i * 2.1)) * rise);
  }
  ctx.globalCompositeOperation = "lighter";
  drawSnowDots(ctx, t, { count: 50, seed: 93, rMin: 0.8, rMax: 2, speed: 14, alpha: 0.55, color: "255,240,225" });
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const reindeerDawn: LiveScene = {
  id: "reindeer-dawn",
  name: "Reindeer at Dawn",
  draw,
  stillTime: 4.5,
  text: {
    title: "Peace and Joy This Christmas",
    delay: 2.4,
    color: "#fff8ee",
    accent: "#ffd29a",
    glow: "0 0 16px rgba(255,180,110,0.7)",
    scrim: "linear-gradient(to bottom, rgba(32,40,63,0) 0%, rgba(32,40,63,0.6) 40%, rgba(32,40,63,0.9) 100%)",
  },
};
