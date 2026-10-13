import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawBokehField,
  drawSnowDots,
  drawSprite,
  fillGradient,
  glow,
  hash,
  lerp,
} from "../engine";

const ROBIN_X = 330;
const SCALE = 1.7;

/** The branch is a gentle curve rising from left to right. */
function branchY(x: number) {
  const u = (x + 20) / 560;
  return lerp(470, 395, u) + 18 * Math.sin(u * Math.PI);
}

function drawBranch(ctx: Ctx) {
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let x = -20; x <= 630; x += 10) {
    const y = branchY(x);
    const th = lerp(26, 8, (x + 20) / 650);
    top.push([x, y - th / 2]);
    bottom.push([x, y + th / 2]);
  }
  const bark = ctx.createLinearGradient(0, 380, 0, 500);
  bark.addColorStop(0, "#6a4a33");
  bark.addColorStop(1, "#3c2819");
  ctx.globalAlpha = 1;
  ctx.fillStyle = bark;
  ctx.beginPath();
  for (const [x, y] of top) ctx.lineTo(x, y);
  for (let i = bottom.length - 1; i >= 0; i--) ctx.lineTo(bottom[i][0], bottom[i][1]);
  ctx.closePath();
  ctx.fill();

  // side twigs
  ctx.strokeStyle = "#4a3221";
  ctx.lineCap = "round";
  for (const [x, len, ang, w] of [
    [120, 70, -2.1, 6],
    [440, 60, -1.2, 5],
    [520, 50, -2.4, 4],
  ] as const) {
    const y = branchY(x);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    ctx.stroke();
  }

  // snow along the top
  ctx.fillStyle = "#fbfdff";
  ctx.beginPath();
  ctx.moveTo(top[0][0], top[0][1] + 2);
  top.forEach(([x, y], i) => ctx.lineTo(x, y - 6 - 5 * Math.abs(Math.sin(i * 0.9)) - 3 * hash(i, 71)));
  for (let i = top.length - 1; i >= 0; i--) ctx.lineTo(top[i][0], top[i][1] + 3);
  ctx.closePath();
  ctx.fill();
}

function holly(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "#1f5a3a";
  for (const [a, s] of [
    [-2.4, 1],
    [-0.9, 0.9],
    [-1.65, 1.1],
  ] as const) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // pointed oval with three soft spikes on each side
    const L = 50;
    for (let k = 1; k <= 6; k++) {
      const x = (k / 6) * L;
      const w = Math.sin((k / 6) * Math.PI) * 13;
      ctx.quadraticCurveTo(x - L / 12, -w * 0.55, x, k % 2 ? -w : -w * 0.6);
    }
    for (let k = 5; k >= 0; k--) {
      const x = (k / 6) * L;
      const w = Math.sin((k / 6) * Math.PI) * 13;
      ctx.quadraticCurveTo(x + L / 12, w * 0.55, x, k % 2 ? w : w * 0.6);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  for (const [dx, dy] of [
    [0, -4],
    [9, 2],
    [-8, 3],
  ]) {
    ctx.fillStyle = "#c0222f";
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 7, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(x + dx - 2, y + dy - 2.5, 2, 0, TAU);
    ctx.fill();
  }
}

function drawRobin(ctx: Ctx, t: number) {
  const hopPhase = (t % 7) / 0.4;
  const hop = hopPhase < 1 ? Math.sin(hopPhase * Math.PI) * 16 : 0;
  const by = branchY(ROBIN_X) - 12;
  const breathe = 1 + 0.025 * Math.sin(t * 3);
  const flick = Math.exp(-Math.pow((t % 3.1) - 0.25, 2) * 60);
  const tilt = 0.14 * Math.sin(t * 0.9) + (t % 4.3 < 0.6 ? -0.18 : 0);
  const chirp = t % 5.2 > 2.2 && t % 5.2 < 2.6;

  ctx.save();
  ctx.translate(ROBIN_X, by - hop);
  ctx.scale(-SCALE, SCALE * breathe); // face left, toward the greeting side

  // legs
  ctx.strokeStyle = "#4a3524";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-2, -10);
  ctx.lineTo(-4, 4);
  ctx.moveTo(6, -10);
  ctx.lineTo(8, 4);
  ctx.moveTo(-9, 4);
  ctx.lineTo(2, 4);
  ctx.moveTo(3, 4);
  ctx.lineTo(13, 4);
  ctx.stroke();

  // tail
  ctx.save();
  ctx.translate(-28, -24);
  ctx.rotate(-0.15 - 0.45 * flick);
  ctx.fillStyle = "#5e4128";
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(-34, -2);
  ctx.lineTo(-33, 9);
  ctx.lineTo(0, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // body
  const body = ctx.createLinearGradient(0, -60, 0, -8);
  body.addColorStop(0, "#8a6542");
  body.addColorStop(1, "#5e4128");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, -32, 34, 25, -0.12, 0, TAU);
  ctx.fill();
  // pale belly
  ctx.fillStyle = "#efe6dc";
  ctx.beginPath();
  ctx.ellipse(4, -15, 19, 9, -0.1, 0, TAU);
  ctx.fill();
  // red breast
  const breast = ctx.createRadialGradient(18, -36, 2, 16, -32, 26);
  breast.addColorStop(0, "#f07438");
  breast.addColorStop(1, "#c8471f");
  ctx.fillStyle = breast;
  ctx.beginPath();
  ctx.ellipse(16, -32, 21, 19, 0.2, 0, TAU);
  ctx.fill();
  // wing
  ctx.fillStyle = "#6b4a2f";
  ctx.beginPath();
  ctx.ellipse(-9, -36, 22, 13, -0.28, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,24,12,0.45)";
  ctx.lineWidth = 1.2;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(-24 + k * 6, -30 + k * 2);
    ctx.lineTo(-6 + k * 6, -38 + k * 2);
    ctx.stroke();
  }

  // head
  ctx.save();
  ctx.translate(20, -50);
  ctx.rotate(tilt);
  ctx.fillStyle = "#7c5a3a";
  ctx.beginPath();
  ctx.arc(4, -6, 17, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#e8622f";
  ctx.beginPath();
  ctx.ellipse(10, 0, 11, 12, 0.3, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(11, -9, 3.4, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(12, -10, 1.1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#3a2a1c";
  ctx.beginPath();
  ctx.moveTo(19, -8);
  ctx.lineTo(30, chirp ? -9 : -5);
  ctx.lineTo(19, -4);
  ctx.closePath();
  ctx.fill();
  if (chirp) {
    ctx.beginPath();
    ctx.moveTo(19, -4);
    ctx.lineTo(28, 0);
    ctx.lineTo(19, -1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();

  // little song notes after a chirp
  const sinceChirp = (t % 5.2) - 2.2;
  if (sinceChirp > 0 && sinceChirp < 1.6) {
    ctx.fillStyle = "#7a3b3f";
    ctx.font = "22px Georgia, serif";
    for (let k = 0; k < 2; k++) {
      const p = clamp((sinceChirp - k * 0.3) / 1.3);
      if (p <= 0) continue;
      ctx.globalAlpha = Math.sin(p * Math.PI) * 0.85;
      ctx.fillText(k ? "♫" : "♪", ROBIN_X - 80 - k * 18 - p * 30, by - 110 - p * 60 - k * 10);
    }
    ctx.globalAlpha = 1;
  }
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#9cb3d8"],
    [0.4, "#d6c4da"],
    [0.6, "#f5cdb4"],
    [0.72, "#f9e2cf"],
    [1, "#f6eadf"],
  ]);

  const dawn = clamp(t / 3);
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,214,170"), 450, 320, 320, 0.45 * dawn);
  drawSprite(ctx, glow("255,240,220"), 450, 320, 90, 0.5 * dawn);
  ctx.globalCompositeOperation = "source-over";

  // soft, out-of-focus snowy trees far behind
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#b9c4dc";
  ctx.beginPath();
  for (let i = 0; i < 14; i++) {
    const x = i * 46 + hash(i, 81) * 20;
    const h = lerp(90, 170, hash(i, 82));
    ctx.moveTo(x, 560 - h);
    ctx.lineTo(x + h * 0.3, 560);
    ctx.lineTo(x - h * 0.3, 560);
    ctx.closePath();
  }
  ctx.fill();
  ctx.globalAlpha = 1;

  const ground = ctx.createLinearGradient(0, 520, 0, H);
  ground.addColorStop(0, "#fbf6f3");
  ground.addColorStop(0.4, "#efe2dc");
  ground.addColorStop(1, "#e7d6d1");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, 548);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 540 + 10 * Math.sin(x * 0.014 + 0.4) + 5 * Math.sin(x * 0.041));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  drawBokehField(ctx, t, {
    count: 18,
    seed: 83,
    colors: ["255,255,255", "255,230,214"],
    yMin: 40,
    yMax: 600,
    rMin: 16,
    rMax: 46,
    alpha: 0.28,
    drift: 10,
  });

  drawBranch(ctx);
  holly(ctx, 150, branchY(150) - 8);
  drawRobin(ctx, t);

  drawSnowDots(ctx, t, { count: 90, seed: 84, rMin: 1, rMax: 3, speed: 20, alpha: 0.9, color: "255,255,255" });
  ctx.globalAlpha = 1;
}

export const winterRobin: LiveScene = {
  id: "winter-robin",
  name: "Winter Robin",
  draw,
  stillTime: 2.4,
  text: {
    title: "Warmest Wishes",
    delay: 1.4,
    color: "#3b2a33",
    accent: "#a3242f",
    glow: "0 0 12px rgba(255,255,255,0.9)",
    scrim: "linear-gradient(to bottom, rgba(249,238,228,0) 0%, rgba(249,238,228,0.78) 40%, rgba(249,238,228,0.96) 100%)",
  },
};
