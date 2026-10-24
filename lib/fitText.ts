/**
 * Shrink-to-fit for names on the Kids cards. `fits(scale)` reports whether the
 * text fits when drawn at `scale` × its designed size; this returns the largest
 * scale from 1 down to `min` (in `step`s) that fits, or null if none does, in
 * which case the caller lets the text wrap mid-word instead.
 */
export function fitScale(fits: (scale: number) => boolean, { min = 0.6, step = 0.05 }: { min?: number; step?: number } = {}): number | null {
  for (let scale = 1; scale >= min - 1e-9; scale = Math.round((scale - step) * 1000) / 1000) {
    if (fits(scale)) return scale;
  }
  return null;
}

/**
 * Whether a text box fits: no word overflows its width, and it uses at most
 * `maxLines` lines.
 */
export function textBoxFits(box: { scrollWidth: number; clientWidth: number; height: number; lineHeight: number }, maxLines: number): boolean {
  return box.scrollWidth <= box.clientWidth + 1 && box.height <= box.lineHeight * maxLines + 1;
}
