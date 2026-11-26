import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// Development-only: saves a rendered card still to public/cards/live/. See /lab/posters.
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse("Not found", { status: 404 });
  const { id, dataUrl } = await req.json();
  if (!/^[a-z-]+$/.test(id) || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/jpeg;base64,")) {
    return NextResponse.json({ error: "Bad input" }, { status: 400 });
  }
  const file = path.join(process.cwd(), "public", "cards", "live", `${id}.jpg`);
  await writeFile(file, Buffer.from(dataUrl.split(",")[1], "base64"));
  return NextResponse.json({ ok: true, file: `/cards/live/${id}.jpg` });
}
