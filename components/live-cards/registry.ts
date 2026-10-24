// React-free registry of every code-drawn scene, so non-React consumers (the
// video renderer in scripts/) can import the scenes without pulling in
// LiveCard, fonts or next/font.

import type { LiveScene } from "./engine";

import { starlitTree } from "./scenes/starlitTree";
import { moonlitSnow } from "./scenes/moonlitSnow";
import { northernLights } from "./scenes/northernLights";
import { goldenBauble } from "./scenes/goldenBauble";
import { santaSleigh } from "./scenes/santaSleigh";
import { snowyCottage } from "./scenes/snowyCottage";
import { snowmanLamp } from "./scenes/snowmanLamp";
import { giftBox } from "./scenes/giftBox";
import { winterRobin } from "./scenes/winterRobin";
import { firesideStockings } from "./scenes/firesideStockings";
import { pumpkinGlow } from "./scenes/pumpkinGlow";
import { hauntedHouse } from "./scenes/hauntedHouse";
import { friendlyGhost } from "./scenes/friendlyGhost";
import { witchBroom } from "./scenes/witchBroom";
import { bubblingCauldron } from "./scenes/bubblingCauldron";
import { catBookshelf } from "./scenes/catBookshelf";
import { firesideSkeleton } from "./scenes/firesideSkeleton";
import { velvetVampire } from "./scenes/velvetVampire";

export {
  starlitTree,
  moonlitSnow,
  northernLights,
  goldenBauble,
  santaSleigh,
  snowyCottage,
  snowmanLamp,
  giftBox,
  winterRobin,
  firesideStockings,
  pumpkinGlow,
  hauntedHouse,
  friendlyGhost,
  witchBroom,
  bubblingCauldron,
  catBookshelf,
  firesideSkeleton,
  velvetVampire,
};

export const CHRISTMAS_SCENES: LiveScene[] = [
  santaSleigh,
  snowyCottage,
  giftBox,
  starlitTree,
  winterRobin,
  northernLights,
  firesideStockings,
  goldenBauble,
  snowmanLamp,
  moonlitSnow,
];

export const HALLOWEEN_SCENES: LiveScene[] = [
  witchBroom,
  bubblingCauldron,
  catBookshelf,
  firesideSkeleton,
  velvetVampire,
  pumpkinGlow,
  hauntedHouse,
  friendlyGhost,
];

const ALL_SCENES: LiveScene[] = [...CHRISTMAS_SCENES, ...HALLOWEEN_SCENES];

export const SCENES_BY_ID: Record<string, LiveScene> = Object.fromEntries(
  ALL_SCENES.map((s) => [s.id, s]),
);
