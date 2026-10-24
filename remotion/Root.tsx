import { Composition } from "remotion";
import { HalloweenShort, HALLOWEEN_SHORT } from "./HalloweenShort";

export const RemotionRoot = () => {
  return (
    <Composition
      id="HalloweenShort"
      component={HalloweenShort}
      durationInFrames={HALLOWEEN_SHORT.durationInFrames}
      fps={HALLOWEEN_SHORT.fps}
      width={HALLOWEEN_SHORT.width}
      height={HALLOWEEN_SHORT.height}
    />
  );
};
