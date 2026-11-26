/**
 * The Squishy Workshop's option ids and the check for a saved design. Kept
 * apart from the drawings in workshopDesign.tsx so the studio can validate a
 * saved creature without bundling the (currently off-sale) Workshop itself.
 */
export const BODIES = ["mochi", "kitty", "frog", "mushroom", "acorn"] as const;
export const FACES = ["sparkle", "happy", "wink", "sleepy"] as const;
export const TOPPERS = ["none", "santa", "crown", "sprout", "bobble"] as const;
export const PALETTES = ["cherry", "mint", "honey", "lavender", "sky"] as const;

export type WorkshopDesign = {
  body: (typeof BODIES)[number];
  face: (typeof FACES)[number];
  topper: (typeof TOPPERS)[number];
  palette: (typeof PALETTES)[number];
};

export function isWorkshopDesign(value: unknown): value is WorkshopDesign {
  if (!value || typeof value !== "object") return false;
  const design = value as Record<string, unknown>;
  return (BODIES as readonly unknown[]).includes(design.body) && (FACES as readonly unknown[]).includes(design.face)
    && (TOPPERS as readonly unknown[]).includes(design.topper) && (PALETTES as readonly unknown[]).includes(design.palette);
}
