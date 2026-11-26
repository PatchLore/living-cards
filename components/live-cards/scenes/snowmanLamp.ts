import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSnowDots,
  drawSprite,
  drawStars,
  fillGradient,
  glow,
  hash,
  lerp,
} from "../engine";

const GROUND = 560;
const SNOWMAN_X = 250;
const LAMP_X = 455;
const LANTERN_Y = 238;
const WARM = "255,206,130";

/** Lamp stutters on, then burns with a faint flicker. */
function lampLevel(t: number) {
  if (t < 0.6) return 0;
  if (t < 1.4) return Math.sin(t * 57) > 0 ? 1 : 0.25;
  return 0.94 + 0.06 * Math.sin(t * 7) * Math.sin(t * 3.1);
}

function drawBackdrop(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#0a1230"],
    [0.4, "#1b2850"],
    [0.6, "#2f3c66"],
    [1, "#1a2238"],
  ]);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 80, seed: 31, yMax: 420, alpha: 0.7 * clamp(t / 1.2) });
  ctx.globalCompositeOperation = "source-over";

  // distant hills and pines
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#3a4874";
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 490 - 28 * Math.sin(x * 0.009 + 1) - 10 * Math.sin(x * 0.03));
  ctx.lineTo(W, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#26325a";
  ctx.beginPath();
  for (let i = 0; i < 22; i++) {
    const x = i * 28 + hash(i, 41) * 14;
    const h = lerp(26, 56, hash(i, 42));
    const by = 500 - 22 * Math.sin(x * 0.009 + 1);
    ctx.moveTo(x, by - h);
    ctx.lineTo(x + h * 0.32, by);
    ctx.lineTo(x - h * 0.32, by);
    ctx.closePath();
  }
  ctx.fill();

  // snow ground, dark toward the bottom so the greeting reads
  const g = ctx.createLinearGradient(0, 520, 0, H);
  g.addColorStop(0, "#d6dfee");
  g.addColorStop(0.25, "#9eaecb");
  g.addColorStop(1, "#202a45");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 545);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 538 + 9 * Math.sin(x * 0.018 + 0.7));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

function drawLamp(ctx: Ctx, lit: number) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#14161f";
  // base and pole
  ctx.beginPath();
  ctx.moveTo(LAMP_X - 18, GROUND);
  ctx.lineTo(LAMP_X - 10, GROUND - 26);
  ctx.lineTo(LAMP_X + 10, GROUND - 26);
  ctx.lineTo(LAMP_X + 18, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(LAMP_X - 4, LANTERN_Y + 18, 8, GROUND - LANTERN_Y - 40);
  ctx.fillRect(LAMP_X - 26, LANTERN_Y + 36, 52, 5);

  // lantern glass
  const glass = () => {
    ctx.beginPath();
    ctx.moveTo(LAMP_X - 20, LANTERN_Y + 18);
    ctx.lineTo(LAMP_X + 20, LANTERN_Y + 18);
    ctx.lineTo(LAMP_X + 26, LANTERN_Y - 16);
    ctx.lineTo(LAMP_X - 26, LANTERN_Y - 16);
    ctx.closePath();
  };
  glass();
  ctx.fillStyle = "#2a2f40";
  ctx.fill();
  if (lit > 0) {
    ctx.globalAlpha = lit;
    glass();
    ctx.fillStyle = "#ffe2a0";
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = "#14161f";
  ctx.lineWidth = 3;
  glass();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(LAMP_X, LANTERN_Y - 16);
  ctx.lineTo(LAMP_X, LANTERN_Y + 18);
  ctx.stroke();

  // roof with a little snow
  ctx.fillStyle = "#14161f";
  ctx.beginPath();
  ctx.moveTo(LAMP_X - 32, LANTERN_Y - 16);
  ctx.lineTo(LAMP_X, LANTERN_Y - 40);
  ctx.lineTo(LAMP_X + 32, LANTERN_Y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(LAMP_X - 2, LANTERN_Y - 52, 4, 14);
  ctx.fillStyle = "#eef3fb";
  ctx.beginPath();
  ctx.moveTo(LAMP_X - 30, LANTERN_Y - 18);
  ctx.quadraticCurveTo(LAMP_X - 14, LANTERN_Y - 38, LAMP_X, LANTERN_Y - 41);
  ctx.quadraticCurveTo(LAMP_X + 14, LANTERN_Y - 38, LAMP_X + 30, LANTERN_Y - 18);
  ctx.quadraticCurveTo(LAMP_X, LANTERN_Y - 26, LAMP_X - 30, LANTERN_Y - 18);
  ctx.fill();
}

function ball(ctx: Ctx, x: number, y: number, r: number, lit: number) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.6, "#e1e9f5");
  g.addColorStop(1, "#a6b6d2");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  // warm rim from the lamp on the right
  if (lit > 0) {
    ctx.save();
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    drawSprite(ctx, glow(WARM), x + r * 0.95, y - r * 0.25, r * 1.1, 0.22 * lit);
    ctx.restore();
  }
}

function drawSnowman(ctx: Ctx, t: number, lit: number) {
  const x = SNOWMAN_X;
  const bob = Math.sin(t * 1.6) * 1.2;

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#26304e";
  ctx.beginPath();
  ctx.ellipse(x - 6, GROUND + 4, 88, 12, 0, 0, TAU);
  ctx.fill();

  // left arm behind the body
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#5b3a1e";
  ctx.lineCap = "round";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 44, 398);
  ctx.lineTo(x - 112, 362);
  ctx.moveTo(x - 92, 372);
  ctx.lineTo(x - 104, 346);
  ctx.stroke();

  ball(ctx, x, 492, 72, lit);
  ball(ctx, x, 398, 52, lit);
  ball(ctx, x, 328 + bob, 38, lit);

  // waving right arm: waves for a couple of seconds every five
  const waving = t % 5 < 2.2;
  const angle = waving ? -1.05 + 0.38 * Math.sin(t * 9) : -0.45;
  const sx = x + 44;
  const sy = 392;
  const ex = sx + Math.cos(angle) * 78;
  const ey = sy + Math.sin(angle) * 78;
  ctx.strokeStyle = "#5b3a1e";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  const fx = sx + Math.cos(angle) * 56;
  const fy = sy + Math.sin(angle) * 56;
  ctx.moveTo(fx, fy);
  ctx.lineTo(fx + Math.cos(angle - 0.7) * 20, fy + Math.sin(angle - 0.7) * 20);
  ctx.stroke();

  // coal buttons
  ctx.fillStyle = "#1c1c24";
  for (const by of [378, 400, 422]) {
    ctx.beginPath();
    ctx.arc(x, by, 5, 0, TAU);
    ctx.fill();
  }

  // face
  const hy = 328 + bob;
  for (const dx of [-13, 13]) {
    ctx.beginPath();
    ctx.arc(x + dx, hy - 8, 4.5, 0, TAU);
    ctx.fill();
  }
  for (let k = 0; k < 5; k++) {
    const a = 0.35 + (k / 4) * (Math.PI - 0.7);
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 16, hy + 8 + Math.sin(a) * 7, 2.4, 0, TAU);
    ctx.fill();
  }
  const nose = ctx.createLinearGradient(x, hy, x + 38, hy + 6);
  nose.addColorStop(0, "#ff8c2e");
  nose.addColorStop(1, "#d9560f");
  ctx.fillStyle = nose;
  ctx.beginPath();
  ctx.moveTo(x, hy - 4);
  ctx.lineTo(x + 40, hy + 3);
  ctx.lineTo(x, hy + 5);
  ctx.closePath();
  ctx.fill();

  // top hat
  ctx.fillStyle = "#17171d";
  ctx.beginPath();
  ctx.ellipse(x, hy - 32, 46, 9, -0.06, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.translate(x, hy - 34);
  ctx.rotate(-0.06);
  ctx.fillRect(-28, -60, 56, 60);
  ctx.fillStyle = "#a3242f";
  ctx.fillRect(-28, -16, 56, 10);
  ctx.fillStyle = "#24242c";
  ctx.beginPath();
  ctx.ellipse(0, -60, 28, 5, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // scarf with a fluttering tail
  const scarf = "#c0392b";
  ctx.fillStyle = scarf;
  ctx.beginPath();
  ctx.ellipse(x, 360, 46, 12, 0, 0, TAU);
  ctx.fill();
  const sway = Math.sin(t * 2.3) * 8;
  ctx.beginPath();
  ctx.moveTo(x + 18, 362);
  ctx.quadraticCurveTo(x + 34 + sway * 0.5, 392, x + 30 + sway, 432);
  ctx.lineTo(x + 50 + sway, 428);
  ctx.quadraticCurveTo(x + 48 + sway * 0.5, 392, x + 36, 360);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f2e6d8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 40, 356);
  ctx.lineTo(x - 40, 366);
  ctx.moveTo(x - 20, 350);
  ctx.lineTo(x - 20, 371);
  ctx.moveTo(x + 32 + sway * 0.9, 412);
  ctx.lineTo(x + 50 + sway, 410);
  ctx.stroke();
}

function draw(ctx: Ctx, t: number) {
  drawBackdrop(ctx, t);
  const lit = lampLevel(t);

  // pool of lamplight on the snow
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.35 * lit;
  ctx.drawImage(glow(WARM), LAMP_X - 220, GROUND - 30, 440, 80);
  ctx.globalCompositeOperation = "source-over";

  drawLamp(ctx, lit);
  drawSnowman(ctx, t, lit);

  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow(WARM), LAMP_X, LANTERN_Y, 210, 0.35 * lit);
  drawSprite(ctx, glow("255,240,200"), LAMP_X, LANTERN_Y, 55, 0.85 * lit);

  const fade = clamp(t / 1.2);
  drawSnowDots(ctx, t, { count: 120, seed: 32, rMin: 0.8, rMax: 2.6, speed: 24, alpha: 0.75 * fade });
  // flakes catching the lamplight
  ctx.save();
  ctx.beginPath();
  ctx.arc(LAMP_X, LANTERN_Y + 40, 170, 0, TAU);
  ctx.clip();
  drawSnowDots(ctx, t, { count: 120, seed: 32, rMin: 0.8, rMax: 2.6, speed: 24, alpha: 0.6 * lit, color: WARM });
  ctx.restore();
  drawSnowDots(ctx, t, { count: 16, seed: 33, rMin: 3, rMax: 5, speed: 55, alpha: 0.55 * fade, sway: 22 });

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const snowmanLamp: LiveScene = {
  id: "snowman-lamp",
  name: "Snowman's Evening",
  draw,
  stillTime: 2,
  text: {
    title: "Season's Greetings",
    delay: 1.8,
    color: "#f4f1ea",
    accent: "#ffd48a",
    glow: "0 0 16px rgba(255,190,110,0.6)",
    scrim: "linear-gradient(to bottom, rgba(18,24,42,0) 0%, rgba(18,24,42,0.6) 40%, rgba(18,24,42,0.9) 100%)",
  },
};
