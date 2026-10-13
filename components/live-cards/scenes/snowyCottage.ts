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

const APEX = { x: 300, y: 262 };
const EAVE_L = { x: 132, y: 436 };
const EAVE_R = { x: 468, y: 436 };
const BODY = { x0: 178, x1: 422, top: 424, bottom: 548 };
const WARM = "255,178,90";

/** Each light switches on in turn as the card opens. */
const LIGHT_AT = { left: 0.7, right: 1.1, attic: 1.5, door: 1.9 };

function lightLevel(t: number, at: number, id: number) {
  const on = clamp((t - at) / 0.5);
  const flicker = 0.9 + 0.1 * Math.sin(t * 7 + id) * Math.sin(t * 2.3 + id * 2);
  return on * flicker;
}

function snowyPine(ctx: Ctx, x: number, by: number, h: number, green: string, snow: string) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = green;
  ctx.fillRect(x - h * 0.03, by - h * 0.08, h * 0.06, h * 0.08);
  const tiers = 5;
  for (let k = tiers - 1; k >= 0; k--) {
    const tip = by - h + k * h * 0.16;
    const base = tip + h * 0.3;
    const half = h * 0.4 * (0.35 + (0.65 * (k + 1)) / tiers);
    ctx.fillStyle = snow;
    ctx.beginPath();
    ctx.moveTo(x, tip);
    ctx.lineTo(x + half, base);
    ctx.lineTo(x - half, base);
    ctx.closePath();
    ctx.fill();
    const d = h * 0.03;
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.moveTo(x, tip + d * 2.2);
    ctx.lineTo(x + half * 0.92, base + 1);
    ctx.lineTo(x - half * 0.92, base + 1);
    ctx.closePath();
    ctx.fill();
  }
}

function drawWindow(ctx: Ctx, x: number, y: number, w: number, h: number, light: number, arched = false) {
  const shape = () => {
    ctx.beginPath();
    if (arched) {
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + w / 2);
      ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
    } else {
      ctx.rect(x, y, w, h);
    }
  };

  // frame + shutters
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#2a150a";
  ctx.fillRect(x - 5, y - 5 + (arched ? w / 2 : 0), w + 10, h + 10 - (arched ? w / 2 : 0));
  if (!arched) {
    ctx.fillStyle = "#7c2416";
    ctx.fillRect(x - 20, y - 3, 13, h + 6);
    ctx.fillRect(x + w + 7, y - 3, 13, h + 6);
  }

  shape();
  ctx.fillStyle = "#151c2e";
  ctx.fill();
  if (light > 0) {
    const g = ctx.createRadialGradient(x + w / 2, y + h * 0.6, 0, x + w / 2, y + h / 2, Math.max(w, h));
    g.addColorStop(0, "#fff3c8");
    g.addColorStop(0.5, "#ffc066");
    g.addColorStop(1, "#e2782c");
    ctx.globalAlpha = light;
    shape();
    ctx.fillStyle = g;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#2a150a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + (arched ? 0 : 0));
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h * 0.55);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.stroke();

  // snow on the sill
  ctx.fillStyle = "#eef3fb";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 6, w / 2 + 12, 6, 0, Math.PI, TAU);
  ctx.fill();
}

/** Thick, lumpy snow blanket along both roof slopes. */
function roofSnow(ctx: Ctx) {
  const thick = (u: number) => 22 + 4 * Math.sin(u * 9) + 2.5 * Math.sin(u * 17 + 1);
  const slope = (a: { x: number; y: number }, b: { x: number; y: number }, steps: number, out: [number, number][]) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    // outward normal (pointing up/away from the roof)
    let nx = dy / len;
    let ny = -dx / len;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    for (let s = 0; s <= steps; s++) {
      const u = s / steps;
      const th = thick(u + a.x * 0.01) * (0.75 + 0.25 * Math.sin(u * Math.PI));
      out.push([a.x + dx * u + nx * th, a.y + dy * u + ny * th]);
    }
  };
  const outer: [number, number][] = [];
  slope({ x: EAVE_L.x - 10, y: EAVE_L.y + 4 }, APEX, 40, outer);
  slope(APEX, { x: EAVE_R.x + 10, y: EAVE_R.y + 4 }, 40, outer);

  const g = ctx.createLinearGradient(0, APEX.y - 30, 0, EAVE_L.y + 10);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#c8d5ea");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.beginPath();
  for (const [x, y] of outer) ctx.lineTo(x, y);
  // rounded overhang at the right eave, back along the roof line, rounded left eave
  ctx.quadraticCurveTo(EAVE_R.x + 22, EAVE_R.y + 16, EAVE_R.x - 4, EAVE_R.y + 8);
  ctx.lineTo(APEX.x, APEX.y + 10);
  ctx.lineTo(EAVE_L.x + 4, EAVE_L.y + 8);
  ctx.quadraticCurveTo(EAVE_L.x - 22, EAVE_L.y + 16, outer[0][0], outer[0][1]);
  ctx.closePath();
  ctx.fill();

  // soft blue shadow on the underside
  ctx.strokeStyle = "rgba(120,145,190,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(EAVE_L.x + 4, EAVE_L.y + 8);
  ctx.lineTo(APEX.x, APEX.y + 10);
  ctx.lineTo(EAVE_R.x - 4, EAVE_R.y + 8);
  ctx.stroke();
}

function drawCottage(ctx: Ctx, t: number) {
  const { x0, x1, top, bottom } = BODY;

  // chimney (drawn first so the roof snow tucks around it)
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#5b2a1c";
  ctx.fillRect(374, 268, 32, 100);
  ctx.strokeStyle = "rgba(30,10,5,0.6)";
  ctx.lineWidth = 1;
  for (let r = 0; r < 7; r++) {
    const y = 272 + r * 12;
    ctx.beginPath();
    ctx.moveTo(374, y);
    ctx.lineTo(406, y);
    for (let c = 0; c < 3; c++) {
      const bx = 374 + ((r % 2) * 6 + c * 12);
      ctx.moveTo(bx, y);
      ctx.lineTo(bx, y + 12);
    }
    ctx.stroke();
  }

  // log walls
  const logs = ctx.createLinearGradient(0, top, 0, bottom);
  logs.addColorStop(0, "#5e3520");
  logs.addColorStop(1, "#3b1f10");
  ctx.fillStyle = logs;
  ctx.fillRect(x0, top, x1 - x0, bottom - top);
  for (let y = top + 11; y < bottom; y += 12) {
    ctx.strokeStyle = "rgba(20,8,2,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,180,120,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y + 2);
    ctx.lineTo(x1, y + 2);
    ctx.stroke();
  }
  // log ends at the corners
  for (let y = top + 6; y < bottom; y += 12) {
    for (const cx of [x0 - 4, x1 + 4]) {
      ctx.fillStyle = "#7a4a2a";
      ctx.beginPath();
      ctx.arc(cx, y, 6, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "rgba(40,18,6,0.6)";
      ctx.beginPath();
      ctx.arc(cx, y, 3, 0, TAU);
      ctx.stroke();
    }
  }

  // gable with vertical boards
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(APEX.x, APEX.y + 14);
  ctx.lineTo(x1 + 6, top);
  ctx.lineTo(x0 - 6, top);
  ctx.closePath();
  ctx.fillStyle = "#4a2615";
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = "rgba(20,8,2,0.45)";
  ctx.lineWidth = 1.5;
  for (let x = x0; x < x1; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, APEX.y);
    ctx.lineTo(x, top);
    ctx.stroke();
  }
  ctx.restore();

  // red trim under the eaves
  ctx.strokeStyle = "#7c2416";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(EAVE_L.x + 8, EAVE_L.y);
  ctx.lineTo(APEX.x, APEX.y + 6);
  ctx.lineTo(EAVE_R.x - 8, EAVE_R.y);
  ctx.stroke();

  roofSnow(ctx);

  // chimney snow cap
  ctx.fillStyle = "#f4f8ff";
  ctx.beginPath();
  ctx.ellipse(390, 268, 22, 8, 0, Math.PI, TAU);
  ctx.fill();
  ctx.fillRect(368, 266, 44, 5);

  const lit = {
    left: lightLevel(t, LIGHT_AT.left, 1),
    right: lightLevel(t, LIGHT_AT.right, 2),
    attic: lightLevel(t, LIGHT_AT.attic, 3),
    door: lightLevel(t, LIGHT_AT.door, 4),
  };

  drawWindow(ctx, 203, 446, 46, 52, lit.left);
  drawWindow(ctx, 351, 446, 46, 52, lit.right);
  drawWindow(ctx, 284, 330, 32, 44, lit.attic, true);

  // door with a little window and a wreath
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#2a150a";
  ctx.fillRect(272, 452, 56, 96);
  ctx.fillStyle = "#6b3a1f";
  ctx.fillRect(277, 457, 46, 91);
  ctx.strokeStyle = "rgba(20,8,2,0.5)";
  ctx.lineWidth = 1.5;
  for (let x = 288; x < 323; x += 11) {
    ctx.beginPath();
    ctx.moveTo(x, 457);
    ctx.lineTo(x, 548);
    ctx.stroke();
  }
  ctx.fillStyle = "#151c2e";
  ctx.fillRect(290, 466, 20, 16);
  ctx.globalAlpha = lit.door;
  ctx.fillStyle = "#ffcc7a";
  ctx.fillRect(290, 466, 20, 16);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#1f5a32";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(300, 504, 12, 0, TAU);
  ctx.stroke();
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU + 0.3;
    ctx.fillStyle = "#c8323a";
    ctx.beginPath();
    ctx.arc(300 + Math.cos(a) * 12, 504 + Math.sin(a) * 12, 2, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#c8323a";
  ctx.beginPath();
  ctx.moveTo(300, 492);
  ctx.lineTo(292, 486);
  ctx.lineTo(292, 496);
  ctx.lineTo(308, 488);
  ctx.lineTo(308, 496);
  ctx.closePath();
  ctx.fill();

  // warm light pouring out
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow(WARM), 226, 472, 80, 0.4 * lit.left);
  drawSprite(ctx, glow(WARM), 374, 472, 80, 0.4 * lit.right);
  drawSprite(ctx, glow(WARM), 300, 352, 55, 0.35 * lit.attic);
  drawSprite(ctx, glow(WARM), 300, 474, 40, 0.3 * lit.door);
  ctx.globalCompositeOperation = "source-over";

  return lit;
}

function drawSmoke(ctx: Ctx, t: number) {
  const puff = glow("226,232,244");
  const on = clamp((t - 0.4) / 1.5);
  for (let i = 0; i < 12; i++) {
    const p = (t / 6 + i / 12) % 1;
    const x = 390 + p * 80 + Math.sin(p * 6 + i) * 10;
    const y = 258 - p * 230;
    drawSprite(ctx, puff, x, y, 14 + p * 55, 0.5 * Math.sin(p * Math.PI) * on);
  }
}

function draw(ctx: Ctx, t: number) {
  fillGradient(ctx, [
    [0, "#0a1024"],
    [0.4, "#1a2544"],
    [0.62, "#2a3656"],
    [1, "#151c30"],
  ]);

  const fade = clamp(t / 1.2);
  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 90, seed: 17, yMax: 380, alpha: 0.75 * fade });
  drawSprite(ctx, glow("255,240,210"), 500, 110, 120, 0.35);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fbf3df";
  ctx.beginPath();
  ctx.arc(500, 110, 26, 0, TAU);
  ctx.fill();

  // far snowy treeline
  for (let i = 0; i < 16; i++) {
    const x = i * 40 + hash(i, 61) * 20;
    snowyPine(ctx, x, 505, lerp(70, 120, hash(i, 62)), "#1a2840", "#8195b6");
  }

  // back snowfield
  ctx.globalAlpha = 1;
  const field = ctx.createLinearGradient(0, 495, 0, H);
  field.addColorStop(0, "#b7c5dc");
  field.addColorStop(0.35, "#7586a6");
  field.addColorStop(1, "#262f47");
  ctx.fillStyle = field;
  ctx.beginPath();
  ctx.moveTo(0, 520);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 505 + 10 * Math.sin(x * 0.015 + 1));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  drawSmoke(ctx, t);
  const lit = drawCottage(ctx, t);

  // big pines framing the cottage
  snowyPine(ctx, 45, 585, 330, "#10291c", "#e8eff9");
  snowyPine(ctx, 560, 575, 300, "#10291c", "#e8eff9");
  snowyPine(ctx, -14, 600, 220, "#0c2116", "#dbe5f3");

  // front drift hiding the base of the cottage
  ctx.globalAlpha = 1;
  const drift = ctx.createLinearGradient(0, 540, 0, H);
  drift.addColorStop(0, "#dde6f3");
  drift.addColorStop(0.3, "#93a4c2");
  drift.addColorStop(1, "#2a3450");
  ctx.fillStyle = drift;
  ctx.beginPath();
  ctx.moveTo(0, 580);
  for (let x = 0; x <= W; x += 15) ctx.lineTo(x, 556 + 12 * Math.sin(x * 0.02 + 2) + 6 * Math.sin(x * 0.05));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // light spilling onto the snow
  ctx.globalCompositeOperation = "lighter";
  const spill = glow(WARM);
  const glowAmt = (lit.left + lit.right + lit.door) / 3;
  ctx.globalAlpha = 0.35 * glowAmt;
  ctx.drawImage(spill, 140, 540, 320, 80);

  drawSnowDots(ctx, t, { count: 130, seed: 18, rMin: 0.8, rMax: 2.6, speed: 26, alpha: 0.8 * fade });
  drawSnowDots(ctx, t, { count: 18, seed: 19, rMin: 3, rMax: 5, speed: 60, alpha: 0.6 * fade, sway: 24 });
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const snowyCottage: LiveScene = {
  id: "snowy-cottage",
  name: "Snowy Cottage",
  draw,
  stillTime: 4,
  text: {
    title: "Warm Winter Wishes",
    delay: 2.4,
    color: "#fbf6ec",
    accent: "#ffd28a",
    glow: "0 0 16px rgba(255,170,80,0.7)",
    scrim: "linear-gradient(to bottom, rgba(16,20,36,0) 0%, rgba(16,20,36,0.6) 40%, rgba(16,20,36,0.88) 100%)",
  },
};
