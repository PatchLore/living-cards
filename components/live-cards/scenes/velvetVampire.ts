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
  glow,
  hash,
  lerp,
  twinkle,
} from "../engine";
import { drawBat, drawRisingMist } from "./halloweenParts";

const VX = 300; // vampire's centre line
const SKIN = "#e9e3ef";
const MIST = ["255,90,120", "255,205,120", "255,150,170"];

/** Goblet swirl: a gentle rocking that grows into a full swirl every few seconds. */
function swirl(t: number) {
  const p = t % 5;
  const strength = p < 2.2 ? Math.sin((p / 2.2) * Math.PI) : 0;
  return Math.sin(t * 6) * 0.16 * strength;
}

function drawRoom(ctx: Ctx, t: number) {
  // wine-dark wall with a faint damask
  ctx.globalAlpha = 1;
  const wall = ctx.createLinearGradient(0, 0, 0, 600);
  wall.addColorStop(0, "#1c0710");
  wall.addColorStop(1, "#2c0c18");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,190,200,0.035)";
  for (let y = 30; y < 560; y += 60) {
    for (let x = (y / 60) % 2 ? 30 : 60; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, y - 14);
      ctx.lineTo(x + 9, y);
      ctx.lineTo(x, y + 14);
      ctx.lineTo(x - 9, y);
      ctx.closePath();
      ctx.fill();
    }
  }

  // tall gothic window, moon and a bat outside
  const wx0 = 30;
  const wx1 = 150;
  const wTop = 70;
  const wBot = 360;
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(wx0, wBot);
    ctx.lineTo(wx0, wTop + 60);
    ctx.quadraticCurveTo(wx0, wTop, (wx0 + wx1) / 2, wTop - 10);
    ctx.quadraticCurveTo(wx1, wTop, wx1, wTop + 60);
    ctx.lineTo(wx1, wBot);
    ctx.closePath();
  };
  ctx.save();
  path();
  ctx.clip();
  ctx.fillStyle = "#0e1230";
  ctx.fillRect(wx0, wTop - 20, wx1 - wx0, wBot - wTop + 20);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 20, seed: 361, yMax: 360, alpha: 0.7 });
  drawSprite(ctx, glow("255,230,190"), 100, 140, 70, 0.4);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#f6ecd2";
  ctx.beginPath();
  ctx.arc(100, 140, 22, 0, TAU);
  ctx.fill();
  const p = ((t + 2) % 7) / 3.5;
  if (p < 1) drawBat(ctx, lerp(20, 170, p), 230 - Math.sin(p * Math.PI) * 40, 0.7, t * 16);
  ctx.restore();
  ctx.strokeStyle = "#120408";
  ctx.lineWidth = 9;
  path();
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo((wx0 + wx1) / 2, wTop - 10);
  ctx.lineTo((wx0 + wx1) / 2, wBot);
  ctx.moveTo(wx0, 220);
  ctx.lineTo(wx1, 220);
  ctx.stroke();

  // floor and rug
  ctx.fillStyle = "#14080a";
  ctx.fillRect(0, 540, W, H - 540);
  ctx.fillStyle = "#5c1220";
  ctx.beginPath();
  ctx.ellipse(VX, 578, 260, 34, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(230,180,90,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(VX, 578, 230, 24, 0, 0, TAU);
  ctx.stroke();
}

function drawCandelabra(ctx: Ctx, t: number) {
  // side table
  ctx.fillStyle = "#2a130c";
  ctx.fillRect(480, 400, 90, 12);
  ctx.fillRect(518, 412, 14, 140);
  ctx.fillRect(500, 548, 50, 8);
  // brass candelabra
  ctx.strokeStyle = "#c9a04f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(525, 400);
  ctx.lineTo(525, 330);
  ctx.moveTo(495, 340);
  ctx.quadraticCurveTo(525, 370, 555, 340);
  ctx.stroke();
  for (const [x, y, i] of [
    [495, 340, 0],
    [525, 322, 1],
    [555, 340, 2],
  ] as const) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#efe4cc";
    ctx.fillRect(x - 5, y - 34, 10, 34);
    const f = 0.85 + 0.15 * Math.sin(t * 11 + i * 2);
    ctx.globalCompositeOperation = "lighter";
    drawSprite(ctx, glow("255,190,100"), x, y - 44, 30 * f, 0.7);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffd27a";
    ctx.beginPath();
    ctx.ellipse(x + Math.sin(t * 5 + i), y - 42, 3, 7 * f, 0, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,160,80"), 525, 320, 260, 0.18);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

function drawArmchair(ctx: Ctx) {
  const velvet = ctx.createLinearGradient(160, 0, 440, 0);
  velvet.addColorStop(0, "#5a0d1c");
  velvet.addColorStop(0.5, "#9a1a2e");
  velvet.addColorStop(1, "#4a0a17");
  ctx.fillStyle = velvet;
  ctx.beginPath();
  ctx.moveTo(170, 480);
  ctx.lineTo(170, 250);
  ctx.quadraticCurveTo(172, 180, 230, 172);
  ctx.quadraticCurveTo(VX, 160, 370, 172);
  ctx.quadraticCurveTo(428, 180, 430, 250);
  ctx.lineTo(430, 480);
  ctx.closePath();
  ctx.fill();
  // button tufting
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const x = 200 + c * 50 + (r % 2) * 25;
      const y = 205 + r * 50;
      if (x > 420) continue;
      ctx.strokeStyle = "rgba(40,0,10,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 20);
      ctx.lineTo(x + 18, y);
      ctx.lineTo(x, y + 20);
      ctx.lineTo(x - 18, y);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "#3a0610";
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, TAU);
      ctx.fill();
    }
  }
  // rolled arms, seat and gold claw feet
  ctx.fillStyle = "#8a1628";
  for (const x of [168, 432]) {
    ctx.beginPath();
    ctx.ellipse(x, 390, 30, 18, 0, 0, TAU);
    ctx.fill();
    ctx.fillRect(x - 30, 390, 60, 120);
  }
  ctx.fillStyle = "#a8203a";
  ctx.fillRect(196, 462, 208, 44);
  ctx.fillStyle = "#c9a04f";
  for (const x of [150, 450]) {
    ctx.beginPath();
    ctx.ellipse(x, 528, 12, 8, 0, 0, TAU);
    ctx.fill();
  }
}

function drawVampire(ctx: Ctx, t: number) {
  // cape collar flaring up behind the head, red lining showing
  ctx.fillStyle = "#0a0408";
  ctx.beginPath();
  ctx.moveTo(VX - 70, 330);
  ctx.lineTo(VX - 96, 196);
  ctx.lineTo(VX - 38, 252);
  ctx.lineTo(VX, 300);
  ctx.lineTo(VX + 38, 252);
  ctx.lineTo(VX + 96, 196);
  ctx.lineTo(VX + 70, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#8a0f22";
  ctx.beginPath();
  ctx.moveTo(VX - 62, 318);
  ctx.lineTo(VX - 84, 212);
  ctx.lineTo(VX - 40, 262);
  ctx.closePath();
  ctx.moveTo(VX + 62, 318);
  ctx.lineTo(VX + 84, 212);
  ctx.lineTo(VX + 40, 262);
  ctx.closePath();
  ctx.fill();

  // legs in black trousers, shoes on the rug
  ctx.fillStyle = "#120a10";
  ctx.fillRect(VX - 50, 470, 40, 90);
  ctx.fillRect(VX + 10, 470, 40, 90);
  ctx.fillStyle = "#050305";
  ctx.beginPath();
  ctx.ellipse(VX - 28, 562, 28, 9, 0, 0, TAU);
  ctx.ellipse(VX + 32, 562, 28, 9, 0, 0, TAU);
  ctx.fill();

  // burgundy smoking jacket with black satin lapels
  ctx.fillStyle = "#6e1424";
  ctx.beginPath();
  ctx.moveTo(VX - 64, 330);
  ctx.quadraticCurveTo(VX, 312, VX + 64, 330);
  ctx.lineTo(VX + 60, 478);
  ctx.lineTo(VX - 60, 478);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#14070c";
  ctx.beginPath();
  ctx.moveTo(VX - 40, 324);
  ctx.lineTo(VX, 410);
  ctx.lineTo(VX - 16, 410);
  ctx.lineTo(VX - 50, 332);
  ctx.closePath();
  ctx.moveTo(VX + 40, 324);
  ctx.lineTo(VX, 410);
  ctx.lineTo(VX + 16, 410);
  ctx.lineTo(VX + 50, 332);
  ctx.closePath();
  ctx.fill();
  // shirt and jabot
  ctx.fillStyle = "#f3eee4";
  ctx.beginPath();
  ctx.moveTo(VX - 18, 318);
  ctx.lineTo(VX + 18, 318);
  ctx.lineTo(VX, 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e0d6c4";
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.ellipse(VX, 330 + k * 12, 10 - k * 2, 6, 0, 0, TAU);
    ctx.fill();
  }

  // open spellbook on his lap, softly glowing
  ctx.fillStyle = "#3a1a0e";
  ctx.beginPath();
  ctx.moveTo(VX - 70, 470);
  ctx.lineTo(VX + 70, 470);
  ctx.lineTo(VX + 64, 440);
  ctx.lineTo(VX - 64, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#efe2c4";
  ctx.beginPath();
  ctx.moveTo(VX - 62, 462);
  ctx.quadraticCurveTo(VX - 30, 430, VX, 450);
  ctx.quadraticCurveTo(VX + 30, 430, VX + 62, 462);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(120,60,40,0.5)";
  ctx.lineWidth = 1.2;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(VX - 52, 452 - k * 3 + k);
    ctx.lineTo(VX - 12, 446 - k * 3 + k);
    ctx.moveTo(VX + 12, 446 - k * 3 + k);
    ctx.lineTo(VX + 52, 452 - k * 3 + k);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,200,150"), VX, 450, 70, 0.25 + 0.08 * Math.sin(t * 2));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // left hand resting on the book
  ctx.fillStyle = "#6e1424";
  ctx.beginPath();
  ctx.ellipse(VX - 56, 420, 16, 34, 0.5, 0, TAU);
  ctx.fill();
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.ellipse(VX - 40, 448, 12, 8, 0.3, 0, TAU);
  ctx.fill();

  // right arm raised with the goblet
  const sw = swirl(t);
  const gx = VX + 76;
  const gy = 352;
  // sleeve in a darker shade with an outline, so it stands out from the red chair
  ctx.fillStyle = "#3a0a14";
  ctx.strokeStyle = "#14070c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(VX + 50, 336);
  ctx.quadraticCurveTo(VX + 100, 372, gx + 8, gy + 30);
  ctx.lineTo(gx - 12, gy + 40);
  ctx.quadraticCurveTo(VX + 58, 396, VX + 38, 362);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // lace cuff
  ctx.fillStyle = "#f3eee4";
  ctx.beginPath();
  ctx.ellipse(gx - 2, gy + 34, 12, 6, -0.5, 0, TAU);
  ctx.fill();

  // head: slicked hair with a widow's peak, pointed ears, round gold spectacles
  ctx.save();
  ctx.translate(VX, 266);
  ctx.rotate(Math.sin(t * 0.8) * 0.03);
  ctx.fillStyle = SKIN;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * 24, -8);
    ctx.lineTo(s * 40, -22);
    ctx.lineTo(s * 26, 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 32, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#0a0408";
  ctx.beginPath();
  ctx.moveTo(-27, -4);
  ctx.quadraticCurveTo(-30, -36, 0, -38);
  ctx.quadraticCurveTo(30, -36, 27, -4);
  ctx.quadraticCurveTo(20, -22, 0, -12);
  ctx.quadraticCurveTo(-20, -22, -27, -4);
  ctx.closePath();
  ctx.fill();
  // brows, eyes, spectacles
  ctx.strokeStyle = "#0a0408";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-17, -9);
  ctx.lineTo(-5, -6);
  ctx.moveTo(17, -9);
  ctx.lineTo(5, -6);
  ctx.stroke();
  ctx.fillStyle = "#2a0a12";
  for (const dx of [-10, 10]) {
    ctx.beginPath();
    ctx.ellipse(dx, 1, 2.6, 2.2, 0, 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = "#d6b25a";
  ctx.lineWidth = 1.8;
  for (const dx of [-10, 10]) {
    ctx.beginPath();
    ctx.arc(dx, 1, 7.5, 0, TAU);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(3, 0);
  ctx.stroke();
  // polite smile with two tiny fangs
  ctx.strokeStyle = "#5a0f1e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 12, 8, 0.25, Math.PI - 0.25);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  for (const dx of [-4, 4]) {
    ctx.beginPath();
    ctx.moveTo(dx - 1.6, 18.5);
    ctx.lineTo(dx + 1.6, 18.5);
    ctx.lineTo(dx, 23);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // crystal goblet, rocking as he swirls it
  ctx.save();
  ctx.translate(gx, gy);
  ctx.rotate(sw);
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,80,110"), 0, -16, 44, 0.45);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  // wine with a sloshing surface
  ctx.fillStyle = "#a3122c";
  ctx.beginPath();
  ctx.moveTo(-15, -20 + sw * 18);
  ctx.quadraticCurveTo(0, -18, 15, -20 - sw * 18);
  ctx.quadraticCurveTo(12, 0, 0, 2);
  ctx.quadraticCurveTo(-12, 0, -15, -20 + sw * 18);
  ctx.closePath();
  ctx.fill();
  // glass
  ctx.strokeStyle = "rgba(240,230,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, -34);
  ctx.quadraticCurveTo(-18, 0, 0, 4);
  ctx.quadraticCurveTo(18, 0, 18, -34);
  ctx.moveTo(0, 4);
  ctx.lineTo(0, 26);
  ctx.moveTo(-12, 28);
  ctx.lineTo(12, 28);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(-13, -30, 3, 18);
  ctx.restore();
  // pale fingers wrapped round the stem
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.ellipse(gx, gy + 16, 7, 9, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(120,90,130,0.5)";
  ctx.lineWidth = 1;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(gx - 6, gy + 11 + k * 4);
    ctx.lineTo(gx + 6, gy + 11 + k * 4);
    ctx.stroke();
  }

  return { gx, gy };
}

function draw(ctx: Ctx, t: number) {
  drawRoom(ctx, t);
  drawCandelabra(ctx, t);
  drawArmchair(ctx);
  const { gx, gy } = drawVampire(ctx, t);

  // ruby and gold starlight mist rising from the goblet
  const rise = clamp(t / 1.6);
  drawRisingMist(ctx, t, { x: gx, y: gy - 34, colors: MIST, count: 16, rise: 260, spread: 36, size: 34, alpha: 0.3 * rise, seed: 51 });
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) {
    const life = 2.4 + hash(i, 371);
    const p = ((t / life) + hash(i, 372)) % 1;
    const x = gx + Math.sin(p * 6 + i) * 30 * (0.4 + p);
    const y = gy - 40 - p * 240;
    const tw = twinkle(t, i + 1100, 4);
    drawSparkle(ctx, x, y, 3 + 5 * tw * (1 - p), i % 2 ? "255,215,140" : "255,120,150", (1 - p) * tw * rise, p * 2);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const velvetVampire: LiveScene = {
  id: "velvet-vampire",
  name: "Velvet Vampire",
  draw,
  stillTime: 3,
  text: {
    title: "Fangtastic Halloween",
    delay: 2.0,
    color: "#fbeef0",
    accent: "#ffcf7a",
    glow: "0 0 16px rgba(255,90,120,0.75)",
    scrim: "linear-gradient(to bottom, rgba(20,8,10,0) 0%, rgba(20,8,10,0.6) 40%, rgba(20,8,10,0.92) 100%)",
  },
};
