export type KidsScene = "santa" | "advent" | "squishy" | "tooth" | "party";
export type KidsPackageType = "single" | "bundle";

export type KidsSceneDetails = { extraDetail: string; customMessage: string };

export type KidsPersonalisation = {
  scene: KidsScene;
  recipientName: string;
  extraDetail: string;
  customMessage: string;
  packageType: KidsPackageType;
  /** Bundle only: wording for the other included experiences. The name is shared. */
  bundle?: Partial<Record<KidsScene, KidsSceneDetails>>;
};

type KidsSceneConfig = {
  title: string;
  shortTitle: string;
  icon: string;
  /** Price in GBP; checkout converts this server-owned amount to pence. */
  price: number;
  description: string;
  extraLabel: string;
  defaultExtra: string;
  defaultMessage: string;
  chips: string[];
};

export const KIDS_BUNDLE_PRICE = 12;
export const KIDS_LIMITS = { recipientName: 28, extraDetail: 75, customMessage: 300 } as const;
export const KIDS_SCENES: Record<KidsScene, KidsSceneConfig> = {
  santa: {
    title: "Santa Scroll & Nice List Certificate",
    shortTitle: "Santa Scroll + Cert",
    icon: "🎅",
    price: 5,
    description: "A magical letter from Santa, with their very own Nice List certificate.",
    extraLabel: "Something great they did this year (Elves’ Report)",
    defaultExtra: "making amazing paper squishies & being so kind",
    defaultMessage: "The reindeer are resting up and polishing their bells for Christmas Eve! Keep shining brightly, and don't forget to leave out a crunchy carrot for Rudolph.",
    chips: ["The Elves loved your homemade paper squishies!", "Rudolph can't wait to visit your house on Christmas Eve!", "You've made the Top 1% of the Official Nice List this year!"],
  },
  advent: {
    title: "24-Day Interactive Digital Advent Village",
    shortTitle: "Advent Village",
    icon: "🏘️",
    price: 10,
    description: "A 24-chapter Christmas story starring them, with a new door to open every day.",
    extraLabel: "Favourite festive treat or hobby",
    defaultExtra: "hot chocolate with marshmallows & paper crafts",
    defaultMessage: "A new chapter of Berry’s Lantern opens every morning from 1 December to Christmas Eve. Can you collect all 24 sparks?",
    chips: ["Open one glowing door every morning until Christmas!", "24 chapters, 24 sparks of Christmas magic!", "Look out for Door 24 on Christmas Eve!"],
  },
  squishy: {
    title: "Printable Paper Squishy Kit + Animated Card",
    shortTitle: "Paper Squishy Kit",
    icon: "🐦",
    price: 6,
    description: "Six festive squishy friends to print, colour and make, plus a maker certificate.",
    extraLabel: "Squishy Studio Theme / Title",
    defaultExtra: "Master Paper Squishy Creator Edition",
    defaultMessage: "Print your squishy kit below, colour in your favourites, tape the edges and stuff with soft tissue. Can you make all six?",
    chips: ["Can't wait to see you craft and squish this one!", "Six squishy friends to print, colour and make!", "Colour, fold, tape, stuff and squish!"],
  },
  tooth: {
    title: "Tooth Fairy Official Receipt & Stardust Note",
    shortTitle: "Tooth Fairy Receipt",
    icon: "🧚",
    price: 5,
    description: "A sparkling official receipt to celebrate a tiny milestone.",
    extraLabel: "Tooth Inspection Grade / Note",
    defaultExtra: "Tooth #4 · Sparkling A+ Brushing Champion!",
    defaultMessage: "Thank you for such a pearly white tooth! It is already building a sparkling turret in the Starlight Castle. Keep brushing every morning and night!",
    chips: ["Grade A+ Sparkle! Left a shiny coin under your pillow!", "Your pearly tooth passed the Royal Fairy Inspection!", "Thank you for brushing so well every morning and night!"],
  },
  party: {
    title: "Animated Birthday Party Invite + RSVP",
    shortTitle: "Birthday Party Invite",
    icon: "🎂",
    price: 7,
    description: "A woodland celebration with a playful animated invitation.",
    extraLabel: "Party day, time & venue name (no home address)",
    defaultExtra: "Saturday 14th Nov · 2:00pm at Woodland Explorers HQ",
    defaultMessage: "Join us for cake, games, paper squishy crafting and adventure! Tap RSVP below so we know how many party bags to pack.",
    chips: ["Join us for cake, paper squishy making and party games!", "Turning 7! Come celebrate with woodland fun & pizza!", "Tap RSVP below so we save you a giant slice of cake!"],
  },
};

export function isKidsScene(value: unknown): value is KidsScene {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(KIDS_SCENES, value);
}

export function kidsPrice(data: Pick<KidsPersonalisation, "scene" | "packageType">): number {
  return data.packageType === "bundle" ? KIDS_BUNDLE_PRICE : KIDS_SCENES[data.scene].price;
}

export function kidsCardKey(data: Pick<KidsPersonalisation, "scene" | "packageType">): string {
  return `kids-v1:${data.scene}:${data.packageType}`;
}

/** The experiences an order unlocks: a bundle adds the core three to the chosen one. */
export function kidsIncludedScenes(data: Pick<KidsPersonalisation, "scene" | "packageType">): KidsScene[] {
  return data.packageType === "bundle" ? Array.from(new Set<KidsScene>([data.scene, "santa", "advent", "squishy"])) : [data.scene];
}

/** Wording for one experience: what the buyer wrote for it, else that experience's defaults. */
export function kidsSceneDetails(data: KidsPersonalisation, scene: KidsScene): KidsSceneDetails {
  if (scene === data.scene) return { extraDetail: data.extraDetail, customMessage: data.customMessage };
  return data.bundle?.[scene] ?? { extraDetail: KIDS_SCENES[scene].defaultExtra, customMessage: KIDS_SCENES[scene].defaultMessage };
}

export function isKidsCardKey(value: string | null | undefined): boolean {
  return !!value?.startsWith("kids-v1:");
}

export function parseKidsCardKey(value: string): Pick<KidsPersonalisation, "scene" | "packageType"> | null {
  const [version, scene, packageType, ...rest] = value.split(":");
  return version === "kids-v1" && isKidsScene(scene) && (packageType === "single" || packageType === "bundle") && rest.length === 0
    ? { scene, packageType }
    : null;
}

/** Validate metadata and persisted payloads without trusting URL or database text. */
export function parseKidsPersonalisation(value: unknown): KidsPersonalisation | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!isKidsScene(data.scene) || (data.packageType !== "single" && data.packageType !== "bundle")) return null;
  if (typeof data.recipientName !== "string" || typeof data.extraDetail !== "string" || typeof data.customMessage !== "string") return null;
  const recipientName = data.recipientName.trim();
  const extraDetail = data.extraDetail.trim();
  const customMessage = data.customMessage.trim();
  if (!recipientName || recipientName.length > KIDS_LIMITS.recipientName || extraDetail.length > KIDS_LIMITS.extraDetail || customMessage.length > KIDS_LIMITS.customMessage) return null;
  const base: KidsPersonalisation = { scene: data.scene, packageType: data.packageType, recipientName, extraDetail, customMessage };
  if (data.bundle === undefined || data.packageType !== "bundle") return base;
  const bundle = parseBundleDetails(data.bundle, base);
  return bundle ? { ...base, bundle } : null;
}

function parseBundleDetails(value: unknown, base: KidsPersonalisation): KidsPersonalisation["bundle"] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const others = kidsIncludedScenes(base).filter(scene => scene !== base.scene);
  const bundle: Partial<Record<KidsScene, KidsSceneDetails>> = {};
  for (const [scene, details] of Object.entries(value as Record<string, unknown>)) {
    if (!isKidsScene(scene) || !others.includes(scene) || !details || typeof details !== "object") return null;
    const { extraDetail, customMessage } = details as Record<string, unknown>;
    if (typeof extraDetail !== "string" || typeof customMessage !== "string") return null;
    if (extraDetail.trim().length > KIDS_LIMITS.extraDetail || customMessage.trim().length > KIDS_LIMITS.customMessage) return null;
    bundle[scene] = { extraDetail: extraDetail.trim(), customMessage: customMessage.trim() };
  }
  return bundle;
}

/**
 * Stripe metadata is flat strings of up to 500 characters, so bundle wording
 * travels as one key pair per experience (e.g. adventExtra, adventMessage).
 */
export function kidsCheckoutMetadata(data: KidsPersonalisation): Record<string, string> {
  const { bundle, ...base } = data;
  const metadata: Record<string, string> = { product: "kids", kidsVersion: "1", cardKey: kidsCardKey(data), ...base };
  for (const [scene, details] of Object.entries(bundle ?? {})) {
    metadata[`${scene}Extra`] = details.extraDetail;
    metadata[`${scene}Message`] = details.customMessage;
  }
  return metadata;
}

export function parseKidsCheckoutMetadata(md: Record<string, string | undefined>): KidsPersonalisation | null {
  const bundle: Record<string, KidsSceneDetails> = {};
  for (const scene of Object.keys(KIDS_SCENES)) {
    const extraDetail = md[`${scene}Extra`];
    const customMessage = md[`${scene}Message`];
    if (extraDetail !== undefined || customMessage !== undefined) bundle[scene] = { extraDetail: extraDetail ?? "", customMessage: customMessage ?? "" };
  }
  return parseKidsPersonalisation(Object.keys(bundle).length ? { ...md, bundle } : md);
}

/** Store kids data in the existing text field so paid links need no schema migration. */
export function serializeKidsPersonalisation(data: KidsPersonalisation): string {
  return JSON.stringify({ version: 1, ...data });
}

export function parseKidsCard(cardKey: string, message: string): KidsPersonalisation | null {
  if (!isKidsCardKey(cardKey)) return null;
  try {
    const saved = JSON.parse(message);
    if (saved.version !== 1) return null;
    const data = parseKidsPersonalisation(saved);
    return data && kidsCardKey(data) === cardKey ? data : null;
  } catch {
    return null;
  }
}
