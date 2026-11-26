import {
  type Ctx,
  type LiveScene,
  H,
  TAU,
  W,
  clamp,
  drawSprite,
  easeOutCubic,
  glow,
  hash,
  twinkle,
  wrap,
} from "../engine";

const SHELF_Y = 282;
const OPEN = { x0: 210, x1: 390, archY: 470, bottom: 568 };
const FIRE_BASE = 548;
const FIRE_X = 300;
const FIRE_GLOW = "255,150,60";

function openingPath(ctx: Ctx) {
  const r = (OPEN.x1 - OPEN.x0) / 2;
  ctx.beginPath();
  ctx.moveTo(OPEN.x0, OPEN.bottom);
  ctx.lineTo(OPEN.x0, OPEN.archY);
  ctx.arc(FIRE_X, OPEN.archY, r, Math.PI, 0);
  ctx.lineTo(OPEN.x1, OPEN.bottom);
  ctx.closePath();
}

function flame(ctx: Ctx, x: number, base: number, w: number, h: number, sway: number) {
  ctx.beginPath();
  ctx.moveTo(x - w, base);
  ctx.bezierCurveTo(x - w * 1.1, base - h * 0.45, x + sway * 0.4 - w * 0.5, base - h * 0.75, x + sway, base - h);
  ctx.bezierCurveTo(x + sway * 0.4 + w * 0.5, base - h * 0.75, x + w * 1.1, base - h * 0.45, x + w, base);
  ctx.closePath();
  ctx.fill();
}

function drawFire(ctx: Ctx, t: number, strength: number) {
  ctx.save();
  openingPath(ctx);
  ctx.clip();

  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow(FIRE_GLOW), FIRE_X, FIRE_BASE - 30, 160, 0.6 * strength);

  const layers: [string, number, number][] = [
    ["rgba(255,110,30,0.55)", 1, 1],
    ["rgba(255,180,60,0.6)", 0.72, 0.78],
    ["rgba(255,240,190,0.75)", 0.42, 0.5],
  ];
  for (const [color, ws, hs] of layers) {
    ctx.fillStyle = color;
    for (let i = 0; i < 7; i++) {
      const x = FIRE_X - 66 + i * 22;
      const centre = 1 - Math.abs(i - 3) / 4;
      const noise = 0.5 + 0.25 * Math.sin(t * (5 + i) + i * 1.7) + 0.25 * Math.sin(t * (8.3 + i * 0.7) + i);
      const h = (45 + 75 * centre) * (0.75 + 0.45 * noise) * strength * hs;
      const sway = Math.sin(t * 3.2 + i * 0.9) * 10;
      flame(ctx, x, FIRE_BASE, 15 * ws, h, sway);
    }
  }

  // embers floating up
  for (let i = 0; i < 26; i++) {
    const life = 2.2 + hash(i, 91);
    const p = wrap(t / life + hash(i, 92), 0, 1);
    const x = FIRE_X + (hash(i, 93) - 0.5) * 120 + Math.sin(p * 9 + i) * 10;
    const y = FIRE_BASE - 10 - p * 170;
    drawSprite(ctx, glow("255,170,80"), x, y, 3 + 2 * hash(i, 94), (1 - p) * 0.9 * strength);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawLogs(ctx: Ctx) {
  ctx.globalAlpha = 1;
  for (const [x, rot] of [
    [FIRE_X - 22, 0.18],
    [FIRE_X + 22, -0.18],
  ] as const) {
    ctx.save();
    ctx.translate(x, FIRE_BASE + 4);
    ctx.rotate(rot);
    ctx.fillStyle = "#4a2e1a";
    ctx.fillRect(-58, -11, 116, 22);
    ctx.fillStyle = "#b8875a";
    ctx.beginPath();
    ctx.ellipse(rot > 0 ? -58 : 58, 0, 7, 11, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawRoom(ctx: Ctx, t: number, glowAmt: number) {
  // deep green striped wallpaper
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#16271f";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.035)";
  for (let x = 0; x < W; x += 30) ctx.fillRect(x, 0, 12, 600);

  // wooden floor
  const floor = ctx.createLinearGradient(0, 580, 0, H);
  floor.addColorStop(0, "#3a2416");
  floor.addColorStop(1, "#120a06");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 580, W, H - 580);

  // stone surround
  const stone = ctx.createLinearGradient(110, 0, 490, 0);
  stone.addColorStop(0, "#b9ab94");
  stone.addColorStop(0.5, "#ddd1bb");
  stone.addColorStop(1, "#a99b85");
  ctx.fillStyle = stone;
  ctx.fillRect(118, SHELF_Y + 18, 364, OPEN.bottom - SHELF_Y - 18);
  ctx.strokeStyle = "rgba(90,75,55,0.25)";
  ctx.lineWidth = 1.5;
  for (let y = SHELF_Y + 50; y < OPEN.bottom; y += 34) {
    ctx.beginPath();
    ctx.moveTo(118, y);
    ctx.lineTo(482, y);
    ctx.stroke();
  }

  // firebox
  openingPath(ctx);
  const soot = ctx.createLinearGradient(0, OPEN.archY - 90, 0, OPEN.bottom);
  soot.addColorStop(0, "#0b0705");
  soot.addColorStop(1, "#2a160c");
  ctx.fillStyle = soot;
  ctx.fill();

  // hearth
  ctx.fillStyle = "#8a7c68";
  ctx.fillRect(96, OPEN.bottom, 408, 16);

  // mantel shelf
  const wood = ctx.createLinearGradient(0, SHELF_Y, 0, SHELF_Y + 22);
  wood.addColorStop(0, "#8a5a36");
  wood.addColorStop(1, "#4e3018");
  ctx.fillStyle = wood;
  ctx.fillRect(92, SHELF_Y, 416, 22);
  ctx.fillStyle = "rgba(255,220,180,0.25)";
  ctx.fillRect(92, SHELF_Y, 416, 2);

  // firelight washing over the room
  ctx.globalCompositeOperation = "lighter";
  const flicker = 0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 3.7);
  drawSprite(ctx, glow(FIRE_GLOW), FIRE_X, 500, 520, 0.28 * glowAmt * flicker);
  ctx.globalCompositeOperation = "source-over";
}

function drawCandle(ctx: Ctx, t: number, x: number, i: number) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#f2e8d5";
  ctx.fillRect(x - 7, SHELF_Y - 46, 14, 46);
  ctx.globalCompositeOperation = "lighter";
  const f = 0.85 + 0.15 * Math.sin(t * 11 + i * 2);
  drawSprite(ctx, glow("255,200,110"), x, SHELF_Y - 56, 34 * f, 0.6);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffd27a";
  ctx.beginPath();
  ctx.ellipse(x + Math.sin(t * 5 + i) * 1, SHELF_Y - 55, 3.2, 7 * f, 0, 0, TAU);
  ctx.fill();
}

function drawGarland(ctx: Ctx, t: number) {
  const swag = (x: number) => SHELF_Y + 24 + 20 * Math.abs(Math.sin(((x - 92) / 416) * Math.PI * 3));
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#1d4a2c";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let x = 92; x <= 508; x += 6) ctx.lineTo(x, swag(x));
  ctx.stroke();
  ctx.fillStyle = "#2a6a40";
  for (let x = 96; x <= 504; x += 9) {
    ctx.beginPath();
    ctx.ellipse(x, swag(x) - 3 + hash(x, 101) * 6, 6, 4, hash(x, 102) * 3, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "lighter";
  const colors = ["255,210,120", "255,90,90", "120,230,150", "255,230,180"];
  let k = 0;
  for (let x = 104; x <= 500; x += 24, k++) {
    const tw = twinkle(t, k + 200, 2.4);
    drawSprite(ctx, glow(colors[k % colors.length]), x, swag(x) + 3, 7 + 6 * tw, 0.55 + 0.45 * tw);
  }
  ctx.globalCompositeOperation = "source-over";
}

function stocking(ctx: Ctx, t: number, x: number, i: number, scale: number, main: string, accent: string) {
  ctx.save();
  ctx.translate(x, SHELF_Y + 20);
  ctx.rotate(0.05 * Math.sin(t * 1.3 + i * 1.7));
  ctx.scale(scale, scale);
  ctx.globalAlpha = 1;
  // hook
  ctx.strokeStyle = "#d9b45c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 2, 4, Math.PI, TAU);
  ctx.stroke();

  ctx.fillStyle = main;
  ctx.beginPath();
  ctx.moveTo(-18, 22);
  ctx.lineTo(18, 22);
  ctx.lineTo(18, 64);
  ctx.quadraticCurveTo(46, 70, 44, 88);
  ctx.quadraticCurveTo(40, 104, 14, 100);
  ctx.lineTo(-6, 96);
  ctx.quadraticCurveTo(-20, 92, -18, 74);
  ctx.closePath();
  ctx.fill();
  // stripes / pattern
  ctx.save();
  ctx.clip();
  ctx.fillStyle = accent;
  for (let y = 34; y < 110; y += 16) ctx.fillRect(-30, y, 90, 6);
  ctx.restore();
  // heel and toe patches
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.moveTo(30, 98);
  ctx.quadraticCurveTo(44, 96, 44, 86);
  ctx.quadraticCurveTo(38, 92, 28, 92);
  ctx.closePath();
  ctx.fill();
  // fluffy cuff
  ctx.fillStyle = "#f6f1e7";
  ctx.beginPath();
  ctx.roundRect(-23, 4, 46, 20, 7);
  ctx.fill();
  ctx.restore();
}

function drawWreath(ctx: Ctx, t: number) {
  const cx = FIRE_X;
  const cy = 150;
  ctx.globalAlpha = 1;
  // ribbon it hangs from
  ctx.strokeStyle = "#a3242f";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, cy - 58);
  ctx.stroke();
  // ring of greenery
  ctx.strokeStyle = "#1d4a2c";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.arc(cx, cy, 58, 0, TAU);
  ctx.stroke();
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * TAU;
    const r = 58 + (hash(i, 111) - 0.5) * 22;
    ctx.fillStyle = i % 3 ? "#2a6a40" : "#1a4429";
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 11, 5, a + 1.2 + hash(i, 112), 0, TAU);
    ctx.fill();
  }
  // berries
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU + 0.3;
    ctx.fillStyle = "#c0222f";
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * 64, cy + Math.sin(a) * 64, 5, 0, TAU);
    ctx.fill();
  }
  // bow
  ctx.fillStyle = "#b3263a";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 56);
    ctx.quadraticCurveTo(cx + s * 34, cy + 30, cx + s * 30, cy + 66);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 60);
    ctx.lineTo(cx + s * 22, cy + 100);
    ctx.lineTo(cx + s * 10, cy + 102);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy + 58, 8, 0, TAU);
  ctx.fill();
  // fairy lights woven through
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU;
    const tw = twinkle(t, i + 300, 2);
    drawSprite(ctx, glow(i % 2 ? "255,214,140" : "255,240,200"), cx + Math.cos(a) * 52, cy + Math.sin(a) * 52, 6 + 5 * tw, 0.5 + 0.5 * tw);
  }
  ctx.globalCompositeOperation = "source-over";
}

function draw(ctx: Ctx, t: number) {
  const strength = easeOutCubic(t / 1.6);
  drawRoom(ctx, t, strength);
  drawWreath(ctx, t);
  drawLogs(ctx);
  drawFire(ctx, t, strength);
  drawCandle(ctx, t, 128, 0);
  drawCandle(ctx, t, 472, 1);
  drawGarland(ctx, t);
  stocking(ctx, t, 168, 0, 1, "#b3263a", "rgba(255,255,255,0.85)");
  stocking(ctx, t, 300, 1, 0.85, "#1f6b45", "rgba(240,200,110,0.9)");
  stocking(ctx, t, 432, 2, 1, "#8e1c2d", "rgba(240,200,110,0.85)");

  // warm haze settling over everything once the fire is going
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("255,170,90"), FIRE_X, 420, 380, 0.08 * clamp((t - 0.5) / 2));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const firesideStockings: LiveScene = {
  id: "fireside-stockings",
  name: "Fireside Stockings",
  draw,
  stillTime: 3,
  text: {
    title: "Cosy Christmas Wishes",
    delay: 1.6,
    color: "#f8efe2",
    accent: "#ffd48a",
    glow: "0 0 16px rgba(255,170,80,0.7)",
    scrim: "linear-gradient(to bottom, rgba(18,10,6,0) 0%, rgba(18,10,6,0.6) 40%, rgba(18,10,6,0.9) 100%)",
  },
};
