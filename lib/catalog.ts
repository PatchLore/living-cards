// Single source of truth for every card CardRoots has ever sold.
// Pages, checkout validation, the share page, emails and the sitemap all read
// from here, so a card can't be purchasable but missing from the viewer.

export type Category = "Christmas" | "Halloween" | "Birthday" | "Thank You" | "Love" | "Valentine" | "Easter";

export type CatalogCard = {
  key: string;
  title: string;
  description: string;
  category: Category;
  /** "live" cards are drawn in code (components/live-cards); "video" cards play an MP4. */
  kind: "live" | "video";
  sceneId?: string;
  /** Path under /public for video cards. */
  video?: string;
  /** Still image used for thumbnails, emails and social previews. */
  poster: string;
  badge?: string;
  /** Shown in the shop. */
  shop: boolean;
  /** No longer sold, but old share links must keep working. */
  retired?: boolean;
};

export const PRICE_LABEL = "£5";

export const CARDS: CatalogCard[] = [
  // ---- Christmas: living cards (drawn in code, personalised animation) ----
  {
    key: "live-santa-sleigh",
    title: "Santa's Sleigh",
    description: "Santa's sleigh sweeps across a full moon, trailing gold dust over a sleeping town.",
    category: "Christmas",
    kind: "live",
    sceneId: "santa-sleigh",
    poster: "/cards/live/santa-sleigh.jpg",
    badge: "Featured",
    shop: true,
  },
  {
    key: "live-snowy-cottage",
    title: "Snowy Cottage",
    description: "A log cabin's windows glow one by one as chimney smoke curls into the falling snow.",
    category: "Christmas",
    kind: "live",
    sceneId: "snowy-cottage",
    poster: "/cards/live/snowy-cottage.jpg",
    shop: true,
  },
  {
    key: "live-gift-box",
    title: "Christmas Surprise",
    description: "A present rattles, the lid pops off and a burst of gold confetti fills the card.",
    category: "Christmas",
    kind: "live",
    sceneId: "gift-box",
    poster: "/cards/live/gift-box.jpg",
    badge: "New",
    shop: true,
  },
  {
    key: "live-starlit-tree",
    title: "Starlit Tree",
    description: "A golden garland spirals up to draw the tree, then the star bursts into light.",
    category: "Christmas",
    kind: "live",
    sceneId: "starlit-tree",
    poster: "/cards/live/starlit-tree.jpg",
    shop: true,
  },
  {
    key: "live-winter-robin",
    title: "Winter Robin",
    description: "A robin hops along a snowy branch at dawn and sings a little song.",
    category: "Christmas",
    kind: "live",
    sceneId: "winter-robin",
    poster: "/cards/live/winter-robin.jpg",
    shop: true,
  },
  {
    key: "live-northern-lights",
    title: "Northern Lights",
    description: "Aurora curtains ripple over snowy pines and a cabin with flickering windows.",
    category: "Christmas",
    kind: "live",
    sceneId: "northern-lights",
    poster: "/cards/live/northern-lights.jpg",
    shop: true,
  },
  {
    key: "live-fireside-stockings",
    title: "Fireside Stockings",
    description: "A crackling fire, swaying stockings and a twinkling garland on the mantel.",
    category: "Christmas",
    kind: "live",
    sceneId: "fireside-stockings",
    poster: "/cards/live/fireside-stockings.jpg",
    badge: "New",
    shop: true,
  },
  {
    key: "live-golden-bauble",
    title: "Golden Bauble",
    description: "A gold bauble drops in and swings to rest as glints dance across it.",
    category: "Christmas",
    kind: "live",
    sceneId: "golden-bauble",
    poster: "/cards/live/golden-bauble.jpg",
    shop: true,
  },
  {
    key: "live-snowman-lamp",
    title: "Snowman's Evening",
    description: "A snowman waves hello as an old street lamp flickers on in the snow.",
    category: "Christmas",
    kind: "live",
    sceneId: "snowman-lamp",
    poster: "/cards/live/snowman-lamp.jpg",
    shop: true,
  },
  {
    key: "live-moonlit-snow",
    title: "Moonlit Snowfall",
    description: "Crystal snowflakes tumble past a glowing winter moon.",
    category: "Christmas",
    kind: "live",
    sceneId: "moonlit-snow",
    poster: "/cards/live/moonlit-snow.jpg",
    shop: true,
  },

  // ---- Halloween: living cards ----
  {
    key: "live-witch-broom",
    title: "Witch's Flight",
    description: "A witch and her black cat sweep across a huge moon on a broomstick, trailing magic sparkles.",
    category: "Halloween",
    kind: "live",
    sceneId: "witch-broom",
    poster: "/cards/live/witch-broom.jpg",
    badge: "New",
    shop: true,
  },
  {
    key: "bubbling-cauldron",
    title: "Bubbling Cauldron",
    description: "A cauldron bubbles over a crackling fire until a spell bursts out in glowing green and purple smoke.",
    category: "Halloween",
    kind: "live",
    sceneId: "bubbling-cauldron",
    poster: "/cards/live/bubbling-cauldron.jpg",
    badge: "New",
    shop: true,
  },
  {
    key: "black-cat-bookshelf",
    title: "Black Cat",
    description: "A black cat by a candlelit window blinks its golden eyes, swishes its tail and knocks over a magic potion.",
    category: "Halloween",
    kind: "live",
    sceneId: "cat-bookshelf",
    poster: "/cards/live/cat-bookshelf.jpg",
    shop: true,
  },
  {
    key: "cozy-fireside-skeleton",
    title: "Fireside Skeleton",
    description: "A friendly skeleton in a knitted jumper and beanie sips pumpkin spice by the fire, with a ginger cat asleep on the rug.",
    category: "Halloween",
    kind: "live",
    sceneId: "fireside-skeleton",
    poster: "/cards/live/fireside-skeleton.jpg",
    shop: true,
  },
  {
    key: "velvet-armchair-vampire",
    title: "Velvet Vampire",
    description: "A polite, bespectacled vampire in a velvet armchair swirls his goblet as ruby and gold mist rises.",
    category: "Halloween",
    kind: "live",
    sceneId: "velvet-vampire",
    poster: "/cards/live/velvet-vampire.jpg",
    shop: true,
  },
  {
    key: "live-pumpkin-glow",
    title: "Pumpkin Glow",
    description: "A carved pumpkin flickers to life on a misty doorstep as bats cross the moon.",
    category: "Halloween",
    kind: "live",
    sceneId: "pumpkin-glow",
    poster: "/cards/live/pumpkin-glow.jpg",
    shop: true,
  },
  {
    key: "live-haunted-house",
    title: "Haunted Hill House",
    description: "Windows light up one by one in a crooked old house while bats circle the full moon.",
    category: "Halloween",
    kind: "live",
    sceneId: "haunted-house",
    poster: "/cards/live/haunted-house.jpg",
    shop: true,
  },
  {
    key: "live-friendly-ghost",
    title: "Friendly Ghost",
    description: "A cheerful little ghost floats up, blinks and waves hello. Perfect for kids.",
    category: "Halloween",
    kind: "live",
    sceneId: "friendly-ghost",
    poster: "/cards/live/friendly-ghost.jpg",
    badge: "For kids",
    shop: true,
  },

  // ---- Christmas: classic animated cards ----
  {
    key: "starlit-christmas-tree",
    title: "Starlit Christmas Tree",
    description: "A sparkling tree glowing under a bright star.",
    category: "Christmas",
    kind: "video",
    video: "/cards/christmas_tree.mp4",
    poster: "/cards/posters/christmas_tree.jpg",
    shop: true,
  },
  {
    key: "christmas-night-moonlight",
    title: "Christmas Night Moonlight",
    description: "Snowflakes drifting past a glowing full moon.",
    category: "Christmas",
    kind: "video",
    video: "/cards/moonlight.mp4",
    poster: "/cards/posters/moonlight.jpg",
    shop: true,
  },
  {
    key: "snowy-cottage-evening",
    title: "Snowy Cottage Evening",
    description: "A cosy cottage aglow on a snowy evening.",
    category: "Christmas",
    kind: "video",
    video: "/cards/Christmas2.mp4",
    poster: "/cards/posters/Christmas2.jpg",
    shop: true,
  },
  {
    key: "santas-moonlit-ride",
    title: "Santa's Flight",
    description: "Santa and his reindeer flying past the moon.",
    category: "Christmas",
    kind: "video",
    video: "/cards/Santa.mp4",
    poster: "/cards/posters/Santa.jpg",
    shop: true,
  },
  {
    key: "golden-christmas-tree-rise",
    title: "Golden Christmas Tree",
    description: "A golden tree rising in shimmering light.",
    category: "Christmas",
    kind: "video",
    video: "/cards/Christmas1.mp4",
    poster: "/cards/posters/Christmas1.jpg",
    shop: true,
  },
  {
    key: "winter-forest-tree",
    title: "Winter Forest",
    description: "A festive tree in a quiet winter forest.",
    category: "Christmas",
    kind: "video",
    video: "/cards/XmasTree.mp4",
    poster: "/cards/posters/XmasTree.jpg",
    shop: true,
  },

  // ---- Year-round occasions ----
  {
    key: "elegant-floral-birthday",
    title: "Elegant Floral Birthday",
    description: "Graceful blooms for a birthday to remember.",
    category: "Birthday",
    kind: "video",
    video: "/cards/Birthday2.mp4",
    poster: "/cards/posters/Birthday2.jpg",
    shop: true,
  },
  {
    key: "birthday-rose-bloom",
    title: "Birthday Rose Bloom",
    description: "A rose unfolding in full bloom.",
    category: "Birthday",
    kind: "video",
    video: "/cards/rose.mp4",
    poster: "/cards/posters/rose.jpg",
    shop: true,
  },
  {
    key: "thank-you-florals",
    title: "Thank You Florals",
    description: "A simple, heartfelt floral thank you.",
    category: "Thank You",
    kind: "video",
    video: "/cards/Thankyou2.mp4",
    poster: "/cards/posters/Thankyou2.jpg",
    shop: true,
  },
  {
    key: "warm-wishes",
    title: "Warm Wishes",
    description: "Warm wishes for any occasion.",
    category: "Thank You",
    kind: "video",
    video: "/cards/warm_wishes.mp4",
    poster: "/cards/posters/warm_wishes.jpg",
    shop: true,
  },
  {
    key: "heart-of-light",
    title: "Heart of Light",
    description: "A luminous heart for someone you love.",
    category: "Love",
    kind: "video",
    video: "/cards/heart1.mp4",
    poster: "/cards/posters/heart1.jpg",
    shop: true,
  },
  {
    key: "golden-heart-glow",
    title: "Golden Heart Glow",
    description: "A radiant golden heart.",
    category: "Love",
    kind: "video",
    video: "/cards/heart2.mp4",
    poster: "/cards/posters/heart2.jpg",
    shop: true,
  },

  // ---- Valentine's (out of season: not in the shop, SEO pages still live) ----
  ...(
    [
      ["valentine-rose", "Valentine Rose", "valentine1.mp4", "valentine1.jpg"],
      ["valentine-heart-glow", "Valentine Heart Glow", "valentine2.mp4", "valentine2.jpg"],
      ["valentine-blossom", "Valentine Blossom", "valentine3.mp4", "valentine3.jpg"],
      ["valentine-love-light", "Valentine Love Light", "valentine4.mp4", "valentine4.jpg"],
      ["valentine-forever", "Valentine Forever", "valentine5.mp4", "valentine5.jpg"],
      ["valentine-sweetheart", "Valentine Sweetheart", "Valentine6.mp4", "valentine6.jpg"],
      ["valentine-together", "Valentine Together", "Valentine7.mp4", "valentine7.jpg"],
      ["valentine-spark", "Valentine Spark", "Valentine8.mp4", "valentine8.jpg"],
      ["valentine-dream", "Valentine Dream", "Valentine9.mp4", "valentine9.jpg"],
      ["valentine-treasure", "Valentine Treasure", "Valentine10.mp4", "valentine10.jpg"],
    ] as const
  ).map(
    ([key, title, video, poster]): CatalogCard => ({
      key,
      title,
      description: "An animated Valentine's card that plants a real tree.",
      category: "Valentine",
      kind: "video",
      video: `/cards/posters/${video}`,
      poster: `/cards/posters/${poster}`,
      shop: false,
    }),
  ),

  // ---- Easter (retired: kept so past buyers' links still open) ----
  ...(
    [
      ["easter-morning", "Easter Parade", 1],
      ["easter-bloom", "Easter Chick", 2],
      ["easter-bunny", "Easter Bunny", 3],
      ["easter-eggs", "Easter Stream", 4],
      ["easter-garden", "Easter Garden", 5],
      ["easter-joy", "Easter Morning", 6],
      ["easter-sunrise", "Easter Egg Garden", 7],
      ["easter-wishes", "Easter Fox", 8],
    ] as const
  ).map(
    ([key, title, n]): CatalogCard => ({
      key,
      title,
      description: "An animated Easter card.",
      category: "Easter",
      kind: "video",
      // Easter1–7 have their own MP4s; easter8 reuses the last one.
      video: `/cards/posters/Easter${Math.min(n, 7)}.mp4`,
      poster: `/cards/posters/easter${n}.jpg`,
      shop: false,
      retired: true,
    }),
  ),
];

const BY_KEY = new Map(CARDS.map((c) => [c.key, c]));

export function getCard(key: string | null | undefined): CatalogCard | undefined {
  return key ? BY_KEY.get(key) : undefined;
}

export function isPurchasable(key: string | null | undefined): boolean {
  const card = getCard(key);
  return !!card && !card.retired;
}

export const CHRISTMAS_LIVE = CARDS.filter((c) => c.shop && c.category === "Christmas" && c.kind === "live");
export const CHRISTMAS_CLASSIC = CARDS.filter((c) => c.shop && c.category === "Christmas" && c.kind === "video");
export const HALLOWEEN = CARDS.filter((c) => c.shop && c.category === "Halloween");
export const OTHER_OCCASIONS = CARDS.filter((c) => c.shop && c.category !== "Christmas" && c.category !== "Halloween");

/** The Halloween section shows on the homepage until this moment (midnight UK time, 1 Nov). */
export const HALLOWEEN_ENDS = new Date("2026-11-01T00:00:00Z");

/** Greeting used when a card has no built-in title text (video cards). */
export function occasionLine(card: CatalogCard | undefined): string {
  switch (card?.category) {
    case "Christmas":
      return "Sent with warm Christmas wishes";
    case "Halloween":
      return "A spooky little something for you";
    case "Birthday":
      return "A birthday message just for you";
    case "Thank You":
      return "A heartfelt thank you";
    case "Love":
    case "Valentine":
      return "Sent with love";
    default:
      return "A message sent with care";
  }
}

export const LIMITS = { recipient: 40, message: 300 } as const;
