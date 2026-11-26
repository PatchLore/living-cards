import { type Ctx, type LiveScene, H, TAU, W, clamp, drawSprite, easeInOutCubic, glow, hash } from "../engine";
import { drawFire, drawRisingMist } from "./halloweenParts";

const BONE = "#f1ebdd";
const BONE_SHADE = "#cfc6b2";
const SKX = 210; // skeleton centre line

/** 0 at rest in his lap, 1 with the mug at his mouth. Sips every few seconds. */
function mugLift(t: number) {
  if (t < 0.8) return 0;
  const p = (t - 0.8) % 6;
  if (p < 0.8) return easeInOutCubic(p / 0.8);
  if (p < 1.8) return 1;
  if (p < 2.6) return 1 - easeInOutCubic((p - 1.8) / 0.8);
  return 0;
}

function drawCabin(ctx: Ctx, t: number, fire: number) {
  // log wall
  ctx.globalAlpha = 1;
  const wall = ctx.createLinearGradient(0, 0, 0, 600);
  wall.addColorStop(0, "#3a2416");
  wall.addColorStop(1, "#24160d");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  for (let y = 18; y < 560; y += 34) {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(0, y, W, 3);
    ctx.fillStyle = "rgba(255,190,130,0.06)";
    ctx.fillRect(0, y + 3, W, 2);
  }

  // stone fireplace on the right
  ctx.fillStyle = "#6e6458";
  ctx.fillRect(400, 250, 220, 330);
  ctx.strokeStyle = "rgba(40,30,22,0.35)";
  ctx.lineWidth = 2;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 6; c++) {
      ctx.strokeRect(400 + c * 40 + (r % 2) * 20 - 20, 250 + r * 33, 40, 33);
    }
  }
  ctx.fillStyle = "#130b06";
  ctx.beginPath();
  ctx.moveTo(432, 560);
  ctx.lineTo(432, 440);
  ctx.quadraticCurveTo(500, 390, 568, 440);
  ctx.lineTo(568, 560);
  ctx.closePath();
  ctx.fill();
  // logs and fire
  ctx.fillStyle = "#4a2c18";
  ctx.fillRect(452, 540, 96, 14);
  drawFire(ctx, t, 500, 548, 110, 90, fire);
  // mantel with pumpkins
  ctx.fillStyle = "#4e2f19";
  ctx.fillRect(388, 238, 230, 16);
  for (const [x, r] of [
    [440, 18],
    [478, 13],
  ] as const) {
    ctx.fillStyle = "#e07a1f";
    ctx.beginPath();
    ctx.ellipse(x, 238 - r, r * 1.2, r, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#4f6b2a";
    ctx.fillRect(x - 2, 238 - r * 2 - 6, 4, 8);
  }

  // firelight across the room
  ctx.globalCompositeOperation = "lighter";
  const flicker = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.3);
  drawSprite(ctx, glow("255,150,60"), 470, 470, 420, 0.22 * fire * flicker);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // rug
  ctx.fillStyle = "#7a2a24";
  ctx.beginPath();
  ctx.ellipse(300, 585, 250, 36, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(240,200,140,0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(300, 585, 220, 26, 0, 0, TAU);
  ctx.stroke();
}

function drawChair(ctx: Ctx) {
  const velvet = ctx.createLinearGradient(100, 0, 330, 0);
  velvet.addColorStop(0, "#1f3f2c");
  velvet.addColorStop(0.5, "#2f5a3e");
  velvet.addColorStop(1, "#1a3324");
  ctx.fillStyle = velvet;
  // tall wingback
  ctx.beginPath();
  ctx.moveTo(112, 470);
  ctx.lineTo(112, 270);
  ctx.quadraticCurveTo(116, 222, 166, 214);
  ctx.quadraticCurveTo(210, 204, 254, 214);
  ctx.quadraticCurveTo(304, 222, 308, 270);
  ctx.lineTo(308, 470);
  ctx.closePath();
  ctx.fill();
  // wings
  ctx.fillStyle = "#24472f";
  for (const [x0, x1] of [
    [96, 136],
    [284, 324],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x0, 470);
    ctx.lineTo(x0, 300);
    ctx.quadraticCurveTo((x0 + x1) / 2, 270, x1, 300);
    ctx.lineTo(x1, 470);
    ctx.closePath();
    ctx.fill();
  }
  // rolled arms and seat
  ctx.fillStyle = "#2f5a3e";
  for (const x of [116, 304]) {
    ctx.beginPath();
    ctx.ellipse(x, 400, 26, 16, 0, 0, TAU);
    ctx.fill();
    ctx.fillRect(x - 26, 400, 52, 120);
  }
  ctx.fillStyle = "#386a49";
  ctx.fillRect(130, 452, 160, 40);
  // feet
  ctx.fillStyle = "#2a1a10";
  for (const x of [104, 316]) ctx.fillRect(x - 6, 520, 12, 30);
}

function bone(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number) {
  ctx.strokeStyle = BONE;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.fillStyle = BONE;
  for (const [x, y] of [
    [x0, y0],
    [x1, y1],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, w * 0.75, 0, TAU);
    ctx.fill();
  }
}

function drawSkeleton(ctx: Ctx, t: number) {
  const lift = mugLift(t);

  // shins in striped cosy socks
  for (const kx of [SKX - 22, SKX + 22]) {
    bone(ctx, kx, 478, kx - 4, 548, 9);
    ctx.fillStyle = "#e07a1f";
    ctx.fillRect(kx - 13, 520, 22, 30);
    ctx.fillStyle = "#f1ebdd";
    for (let y = 524; y < 550; y += 10) ctx.fillRect(kx - 13, y, 22, 4);
    ctx.fillStyle = "#e07a1f";
    ctx.beginPath();
    ctx.ellipse(kx + 2, 552, 17, 8, 0, 0, TAU);
    ctx.fill();
  }

  // chunky cable-knit jumper
  ctx.fillStyle = "#d9b25a";
  ctx.beginPath();
  ctx.moveTo(SKX - 48, 336);
  ctx.quadraticCurveTo(SKX, 322, SKX + 48, 336);
  ctx.lineTo(SKX + 44, 470);
  ctx.lineTo(SKX - 44, 470);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(140,100,30,0.55)";
  ctx.lineWidth = 2;
  for (const cx of [SKX - 22, SKX, SKX + 22]) {
    ctx.beginPath();
    for (let y = 344; y < 462; y += 10) {
      ctx.moveTo(cx - 5, y);
      ctx.quadraticCurveTo(cx, y + 5, cx + 5, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "#c79c45";
  ctx.fillRect(SKX - 44, 458, 88, 14);
  // knees peeking over the hem
  for (const kx of [SKX - 22, SKX + 22]) {
    ctx.fillStyle = BONE;
    ctx.beginPath();
    ctx.arc(kx, 478, 10, 0, TAU);
    ctx.fill();
  }

  // left arm resting on the chair arm
  ctx.strokeStyle = "#d9b25a";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(SKX - 40, 350);
  ctx.quadraticCurveTo(SKX - 72, 380, SKX - 86, 396);
  ctx.stroke();
  bone(ctx, SKX - 90, 400, SKX - 106, 404, 5);

  // right arm bringing the mug up for a sip
  const mx = SKX + 60 - lift * 30;
  const my = 420 - lift * 96;
  ctx.strokeStyle = "#d9b25a";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(SKX + 40, 350);
  ctx.quadraticCurveTo(SKX + 70, 392 - lift * 20, mx - 4, my + 12);
  ctx.stroke();

  // neck and roll-neck collar
  ctx.fillStyle = BONE_SHADE;
  ctx.fillRect(SKX - 6, 314, 12, 18);
  ctx.fillStyle = "#c79c45";
  ctx.beginPath();
  ctx.ellipse(SKX, 334, 30, 9, 0, 0, TAU);
  ctx.fill();

  // skull, tilting back slightly as he sips
  ctx.save();
  ctx.translate(SKX, 288);
  ctx.rotate(-lift * 0.12 + Math.sin(t * 1.1) * 0.03);
  ctx.fillStyle = BONE;
  ctx.beginPath();
  ctx.arc(0, 0, 31, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 24, 20, 13, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#2a1f18";
  for (const dx of [-12, 12]) {
    ctx.beginPath();
    ctx.ellipse(dx, 2, 8.5, 9.5, 0, 0, TAU);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(-4, 18);
  ctx.lineTo(4, 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2a1f18";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-13, 27);
  ctx.lineTo(13, 27);
  for (let k = -10; k <= 10; k += 5) {
    ctx.moveTo(k, 23);
    ctx.lineTo(k, 31);
  }
  ctx.stroke();
  // little friendly eye glints
  ctx.fillStyle = "#ffcf7a";
  for (const dx of [-11, 13]) {
    ctx.beginPath();
    ctx.arc(dx, 0, 1.8, 0, TAU);
    ctx.fill();
  }

  // knitted beanie with pom-pom
  ctx.fillStyle = "#e07a1f";
  ctx.beginPath();
  ctx.ellipse(0, -10, 34, 30, 0, Math.PI, TAU);
  ctx.fill();
  ctx.fillStyle = "#b85e12";
  ctx.fillRect(-35, -12, 70, 12);
  ctx.strokeStyle = "rgba(255,220,170,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let k = -30; k <= 30; k += 6) {
    ctx.moveTo(k, -12);
    ctx.lineTo(k, 0);
  }
  ctx.stroke();
  ctx.fillStyle = "#f6ead2";
  ctx.beginPath();
  ctx.arc(4, -42, 10, 0, TAU);
  ctx.fill();
  ctx.restore();

  // the mug and his bony fingers round it
  ctx.fillStyle = "#c2551c";
  ctx.beginPath();
  ctx.roundRect(mx - 14, my - 18, 28, 32, 5);
  ctx.fill();
  ctx.strokeStyle = "#c2551c";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(mx + 15, my - 2, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = "#fff4e2";
  ctx.beginPath();
  ctx.ellipse(mx, my - 18, 14, 5, 0, 0, TAU);
  ctx.fill();
  for (let k = 0; k < 3; k++) bone(ctx, mx - 16, my - 6 + k * 7, mx - 6, my - 6 + k * 7, 3.5);

  return { mx, my };
}

function drawCat(ctx: Ctx, t: number) {
  const breathe = 1 + 0.03 * Math.sin(t * 1.8);
  ctx.save();
  ctx.translate(420, 568);
  ctx.scale(breathe, breathe);
  ctx.fillStyle = "#d9782f";
  ctx.beginPath();
  ctx.ellipse(0, 0, 40, 18, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-34, -2, 14, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-44, -10);
  ctx.lineTo(-42, -22);
  ctx.lineTo(-36, -13);
  ctx.moveTo(-32, -14);
  ctx.lineTo(-26, -24);
  ctx.lineTo(-24, -12);
  ctx.fill();
  // stripes
  ctx.strokeStyle = "#a9521a";
  ctx.lineWidth = 3;
  for (let k = -16; k <= 24; k += 10) {
    ctx.beginPath();
    ctx.moveTo(k, -16);
    ctx.quadraticCurveTo(k + 4, -6, k, 4);
    ctx.stroke();
  }
  // closed sleepy eye and tail wrapped round
  ctx.strokeStyle = "#4a2410";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(-36, -2, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.strokeStyle = "#d9782f";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(36, 6);
  ctx.quadraticCurveTo(20, 24, -20, 16);
  ctx.stroke();
  ctx.restore();

  // a slow "z" drifting up now and then
  const p = (t % 4) / 4;
  ctx.globalAlpha = Math.sin(p * Math.PI) * 0.7;
  ctx.fillStyle = "#f6ead2";
  ctx.font = "16px Georgia, serif";
  ctx.fillText("z", 380 - p * 10, 540 - p * 40);
  ctx.globalAlpha = 1;
}

function draw(ctx: Ctx, t: number) {
  const fire = clamp(t / 1.2);
  drawCabin(ctx, t, fire);
  drawChair(ctx);
  const { mx, my } = drawSkeleton(ctx, t);
  drawCat(ctx, t);

  // cinnamon-vanilla steam from the mug, joined by embers from the hearth
  drawRisingMist(ctx, t, {
    x: mx,
    y: my - 22,
    colors: ["255,236,210", "255,210,160"],
    count: 10,
    rise: 170,
    spread: 18,
    size: 26,
    alpha: 0.32,
    seed: 41,
  });
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 14; i++) {
    const p = ((t / (3 + hash(i, 351))) + hash(i, 352)) % 1;
    const x = 500 - p * 200 + Math.sin(p * 7 + i) * 20;
    const y = 400 - p * 300;
    drawSprite(ctx, glow("255,170,80"), x, y, 2.5, (1 - p) * 0.7 * fire);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const firesideSkeleton: LiveScene = {
  id: "fireside-skeleton",
  name: "Fireside Skeleton",
  draw,
  stillTime: 2.0,
  text: {
    title: "Spooky & Cosy",
    delay: 2.0,
    color: "#fbf1e4",
    accent: "#ffb25c",
    glow: "0 0 16px rgba(255,150,60,0.7)",
    scrim: "linear-gradient(to bottom, rgba(26,15,8,0) 0%, rgba(26,15,8,0.6) 40%, rgba(26,15,8,0.92) 100%)",
  },
};
