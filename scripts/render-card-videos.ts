/**
 * Render code-drawn "living" cards to MP4.
 *
 * The scenes in components/live-cards are pure functions of time drawn into a
 * fixed 600x900 space, so we can replay them frame-by-frame in Node and pipe
 * the pixels straight into ffmpeg — no browser, no screen recording.
 *
 * Usage:
 *   npm run render:videos                      # all Halloween cards -> remotion/public/cards/halloween
 *   npm run render:videos -- --all             # every living scene
 *   npm run render:videos -- witch-broom       # one (or more) scene ids
 *   npm run render:videos -- --list            # print every scene id
 *
 * Flags: --seconds=8 --fps=30 --width=1080 --height=1920 --out=<dir>
 *
 * Requires ffmpeg on PATH.
 */

import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

type Options = {
  ids: string[];
  all: boolean;
  list: boolean;
  seconds: number;
  fps: number;
  width: number;
  height: number;
  out: string;
};

function parseArgs(argv: string[]): Options {
  const o: Options = {
    ids: [],
    all: false,
    list: false,
    seconds: 8,
    fps: 30,
    width: 1080,
    height: 1920,
    out: "remotion/public/cards/halloween",
  };
  for (const arg of argv) {
    const [key, value] = arg.split("=");
    if (key === "--all") o.all = true;
    else if (key === "--list") o.list = true;
    else if (key === "--seconds") o.seconds = Number(value);
    else if (key === "--fps") o.fps = Number(value);
    else if (key === "--width") o.width = Number(value);
    else if (key === "--height") o.height = Number(value);
    else if (key === "--out") o.out = value ?? o.out;
    else if (arg.startsWith("-")) throw new Error(`Unknown flag: ${arg}`);
    else o.ids.push(arg);
  }
  return o;
}

/** The engine builds its cached glow/bokeh sprites with document.createElement. */
function installDomShim() {
  const g = globalThis as Record<string, unknown>;
  if (g.document) return;
  g.document = {
    createElement(tag: string) {
      if (tag === "canvas") return createCanvas(1, 1);
      throw new Error(`document.createElement("${tag}") is not available in the video renderer`);
    },
  };
}

function writeFrame(stream: NodeJS.WritableStream, buf: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (err: Error) => reject(err);
    stream.once("error", onError);
    const done = () => {
      stream.off("error", onError);
      resolve();
    };
    if (stream.write(buf)) done();
    else stream.once("drain", done);
  });
}

type Scene = { id: string; name: string; draw: (ctx: never, t: number) => void };

async function renderScene(
  scene: Scene,
  W: number,
  H: number,
  opts: Options,
  outFile: string,
): Promise<void> {
  const { width, height, fps, seconds } = opts;
  const frames = Math.round(fps * seconds);

  // Cover-fill: scale so the (600x900) scene fills the frame, cropping the
  // overflow on the shorter axis, then centre it.
  const scale = Math.max(width / W, height / H);
  const offX = (width - W * scale) / 2;
  const offY = (height - H * scale) / 2;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const ff = spawn(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "rawvideo",
      "-pixel_format",
      "rgba",
      "-video_size",
      `${width}x${height}`,
      "-framerate",
      String(fps),
      "-i",
      "pipe:0",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-r",
      String(fps),
      outFile,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const ffExit = new Promise<number>((resolve) => ff.on("close", (code) => resolve(code ?? -1)));

  for (let f = 0; f < frames; f++) {
    const t = f / fps;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offX, offY);
    ctx.scale(scale, scale);
    (scene.draw as (c: unknown, t: number) => void)(ctx, t);
    ctx.restore();

    const img = ctx.getImageData(0, 0, width, height);
    await writeFrame(ff.stdin!, Buffer.from(img.data));
  }
  ff.stdin!.end();

  const code = await ffExit;
  if (code !== 0) throw new Error(`ffmpeg exited with code ${code} while encoding ${outFile}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  installDomShim();
  const engine = await import("../components/live-cards/engine");
  const cards = await import("../components/live-cards/registry");
  const { W, H } = engine;
  const byId = cards.SCENES_BY_ID as Record<string, Scene>;

  if (opts.list) {
    for (const s of Object.values(byId)) console.log(s.id);
    return;
  }

  let scenes: Scene[];
  if (opts.ids.length) {
    scenes = opts.ids.map((id) => {
      const s = byId[id];
      if (!s) throw new Error(`Unknown scene "${id}". Run with --list to see the ids.`);
      return s;
    });
  } else if (opts.all) {
    scenes = Object.values(byId);
  } else {
    scenes = cards.HALLOWEEN_SCENES as Scene[];
  }

  const outDir = path.isAbsolute(opts.out) ? opts.out : path.join(ROOT, opts.out);
  await mkdir(outDir, { recursive: true });

  console.log(
    `Rendering ${scenes.length} scene(s) at ${opts.width}x${opts.height}, ` +
      `${opts.seconds}s @ ${opts.fps}fps -> ${path.relative(ROOT, outDir)}`,
  );

  for (const scene of scenes) {
    const outFile = path.join(outDir, `${scene.id}.mp4`);
    const started = Date.now();
    process.stdout.write(`  • ${scene.name} (${scene.id}) … `);
    await renderScene(scene, W, H, opts, outFile);
    const { size } = await stat(outFile);
    console.log(`${(size / 1e6).toFixed(1)} MB in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  }

  console.log(`\nDone. ${scenes.length} video(s) written to ${path.relative(ROOT, outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
