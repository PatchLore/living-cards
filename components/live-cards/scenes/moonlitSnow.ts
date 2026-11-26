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
  easeOutCubic,
  glow,
  hash,
  lerp,
  snowflake,
  wrap,
} from "../engine";

function drawMoon(ctx: Ctx, x: number, y: number, r: number, alpha: number) {
  ctx.globalCompositeOperation = "lighter";
  drawSprite(ctx, glow("150,185,255"), x, y, r * 4.2, 0.5 * alpha);
  drawSprite(ctx, glow("225,236,255"), x, y, r * 1.9, 0.55 * alpha);
  ctx.globalCompositeOperation = "source-over";

  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.55, "#eef3ff");
  g.addColorStop(1, "#c3d1f0");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();

  // soft maria / craters
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 11; i++) {
    const a = hash(i, 51) * TAU;
    const d = Math.sqrt(hash(i, 52)) * r * 0.8;
    const cx = x + Math.cos(a) * d;
    const cy = y + Math.sin(a) * d;
    const cr = lerp(r * 0.08, r * 0.28, hash(i, 53));
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cg.addColorStop(0, "rgba(120,140,190,0.32)");
    cg.addColorStop(1, "rgba(120,140,190,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
  }
  ctx.restore();
}

function drawFlakes(
  ctx: Ctx,
  t: number,
  o: { count: number; seed: number; sMin: number; sMax: number; speed: number; alpha: number },
) {
  for (let i = 0; i < o.count; i++) {
    const s = i + o.seed * 1000;
    const k = hash(s, 2);
    const size = lerp(o.sMin, o.sMax, k);
    const y = wrap(hash(s, 3) * (H + 200) + t * o.speed * (0.7 + 0.6 * k), -size, H + size);
    const x = hash(s, 1) * W + Math.sin(t * 0.5 * (0.5 + hash(s, 4)) + hash(s, 5) * TAU) * 22;
    const rot = hash(s, 6) * TAU + t * (hash(s, 7) - 0.5) * 0.9;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = o.alpha * (0.7 + 0.3 * k);
    ctx.drawImage(snowflake(Math.floor(hash(s, 8) * 5)), -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

function draw(ctx: Ctx, t: number) {
  const bg = ctx.createRadialGradient(300, 330, 0, 300, 330, 760);
  bg.addColorStop(0, "#21427e");
  bg.addColorStop(0.35, "#112656");
  bg.addColorStop(0.75, "#071335");
  bg.addColorStop(1, "#040a1f");
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const rise = easeOutCubic(t / 2.6);
  const fade = clamp(t / 1.2);

  ctx.globalCompositeOperation = "lighter";
  drawStars(ctx, t, { count: 110, seed: 4, yMax: 600, alpha: 0.8 * fade });
  drawSnowDots(ctx, t, { count: 150, seed: 5, rMin: 0.7, rMax: 2, speed: 22, alpha: 0.7 * fade });
  ctx.globalCompositeOperation = "source-over";

  drawMoon(ctx, 300, lerp(420, 320, rise), 92, rise);

  ctx.globalCompositeOperation = "lighter";
  drawFlakes(ctx, t, { count: 22, seed: 6, sMin: 26, sMax: 46, speed: 30, alpha: 0.9 * fade });
  drawSnowDots(ctx, t, { count: 40, seed: 7, rMin: 2, rMax: 4, speed: 48, alpha: 0.8 * fade });
  drawFlakes(ctx, t, { count: 7, seed: 8, sMin: 80, sMax: 120, speed: 60, alpha: 0.55 * fade });
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export const moonlitSnow: LiveScene = {
  id: "moonlit-snow",
  name: "Moonlit Snowfall",
  draw,
  stillTime: 5,
  text: {
    title: "Wishing You Peace",
    delay: 2.2,
    color: "#eaf1ff",
    accent: "#ffffff",
    glow: "0 0 18px rgba(150,190,255,0.85)",
    scrim: "linear-gradient(to bottom, rgba(4,10,31,0) 0%, rgba(4,10,31,0.55) 45%, rgba(4,10,31,0.85) 100%)",
  },
};
