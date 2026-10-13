export { default as LiveCard } from "./LiveCard";
export { default as LiveCanvas } from "./LiveCanvas";

import { starlitTree } from "./scenes/starlitTree";
import { moonlitSnow } from "./scenes/moonlitSnow";
import { northernLights } from "./scenes/northernLights";
import { goldenBauble } from "./scenes/goldenBauble";
import { santaSleigh } from "./scenes/santaSleigh";
import { snowyCottage } from "./scenes/snowyCottage";

export { starlitTree, moonlitSnow, northernLights, goldenBauble, santaSleigh, snowyCottage };

export const CHRISTMAS_SCENES = [santaSleigh, snowyCottage, starlitTree, moonlitSnow, northernLights, goldenBauble];

const ALL_SCENES = [santaSleigh, snowyCottage, starlitTree, moonlitSnow, northernLights, goldenBauble];
export const SCENES_BY_ID: Record<string, (typeof ALL_SCENES)[number]> = Object.fromEntries(
  ALL_SCENES.map((s) => [s.id, s]),
);
