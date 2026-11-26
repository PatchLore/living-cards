import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

async function posterData(poster: string) {
  try {
    const buf = await readFile(path.join(process.cwd(), "public", poster));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Landscape social preview: card poster(s) on the left, text on the right. */
export async function renderCardOg({
  posters,
  eyebrow,
  title,
  subtitle,
}: {
  posters: string[];
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const images = (await Promise.all(posters.map(posterData))).filter((x): x is string => !!x);
  const fan = images.length > 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0b1424 0%, #13223d 60%, #1d1530 100%)",
          padding: "0 80px",
          gap: 64,
        }}
      >
        <div style={{ display: "flex", position: "relative", width: fan ? 470 : 320, height: 480 }}>
          {images.map((src, i) => {
            const offset = fan ? (i - (images.length - 1) / 2) * 70 : 0;
            const rot = fan ? (i - (images.length - 1) / 2) * 7 : 0;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                width={320}
                height={480}
                style={{
                  position: "absolute",
                  left: (fan ? 75 : 0) + offset,
                  top: 0,
                  borderRadius: 24,
                  border: "2px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
                  transform: `rotate(${rot}deg)`,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: "#fbf6ec" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#e9c97a" }}>{eyebrow}</div>
          <div style={{ fontSize: fan ? 60 : 68, lineHeight: 1.05, marginTop: 18, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 24, color: "rgba(251,246,236,0.75)" }}>{subtitle}</div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              alignSelf: "flex-start",
              background: "#b3263a",
              color: "white",
              fontSize: 28,
              padding: "14px 30px",
              borderRadius: 999,
            }}
          >
            cardroots.com
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
