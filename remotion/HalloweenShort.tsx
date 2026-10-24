import { Fragment } from "react";
import { AbsoluteFill, Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { HALLOWEEN } from "../lib/catalog";

/** Seconds each card is held, and the crossfade between cards. */
export const CLIP_SECONDS = 3.6;
const CROSSFADE_SECONDS = 0.5;

const FPS = 30;
const CLIP_FRAMES = CLIP_SECONDS * FPS;
const CROSSFADE_FRAMES = Math.round(CROSSFADE_SECONDS * FPS);

const scenes = HALLOWEEN.filter((c) => c.sceneId).map((c) => ({
  id: c.sceneId as string,
  title: c.title,
  src: `cards/halloween/${c.sceneId}.mp4`,
}));

export const HALLOWEEN_SHORT = {
  fps: FPS,
  width: 1080,
  height: 1920,
  durationInFrames:
    scenes.length * CLIP_FRAMES - Math.max(0, scenes.length - 1) * CROSSFADE_FRAMES,
};

/** One card, with its name fading in as a lower third and back out before the cut. */
const Clip = ({ src, title }: { src: string; title: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const textOpacity = interpolate(
    frame,
    [12, 40, durationInFrames - CROSSFADE_FRAMES - 20, durationInFrames - CROSSFADE_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const textRise = interpolate(frame, [12, 40], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070b" }}>
      <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,11,0) 52%, rgba(5,7,11,0.55) 78%, rgba(5,7,11,0.92) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "13%",
          opacity: textOpacity,
          transform: `translateY(${textRise}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 34,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#f1d58f",
            textShadow: "0 0 18px rgba(255,180,80,0.6)",
            marginBottom: 20,
          }}
        >
          CardRoots
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 92,
            lineHeight: 1.05,
            textAlign: "center",
            color: "#fbf6ec",
            textShadow: "0 2px 30px rgba(0,0,0,0.8), 0 0 40px rgba(255,160,60,0.35)",
            padding: "0 60px",
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HalloweenShort = () => {
  const { durationInFrames } = useVideoConfig();

  // "Haunted Rhodes" runs longer than the short, so it plays from the start
  // with a short fade in and out; the tail is trimmed automatically.
  const volume = (f: number) =>
    interpolate(f, [0, 30, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070b" }}>
      <Audio src={staticFile("audio/haunted-rhodes.wav")} volume={volume} />
      <TransitionSeries>
        {scenes.map((scene, i) => (
          <Fragment key={scene.id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: CROSSFADE_FRAMES })}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={CLIP_FRAMES}>
              <Clip src={scene.src} title={scene.title} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
