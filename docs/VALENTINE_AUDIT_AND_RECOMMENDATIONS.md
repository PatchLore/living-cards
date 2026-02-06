# CardRoots Valentine Update — Mini Audit & Recommendations

**Date:** February 2025  
**Scope:** www.cardroots.com — Valentine gallery (10 cards), performance, accessibility, SEO, analytics, engagement.

---

## 1. Valentine Gallery Update (Done)

- **5 new cards added** (valentine6–10), for **10 total** Valentine cards.
- **New keys:** `valentine-sweetheart`, `valentine-together`, `valentine-spark`, `valentine-dream`, `valentine-treasure`.
- **Videos:** `Valentine6.mp4`–`Valentine10.mp4` in `public/cards/posters/` (paths match existing layout).
- **Layout:** Same grid, typography, spacing, and hover/play behavior as existing cards.
- **Video behavior:** Loop, muted, no autoplay sound; responsive via existing `LazyVideo` and CSS.

### Poster images for new cards (action required)

- Code expects **poster images** for instant thumbnails:  
  `valentine6.jpg`, `valentine7.jpg`, `valentine8.jpg`, `valentine9.jpg`, `valentine10.jpg` in `public/cards/posters/`.
- **If missing:** Cards still work (video plays on hover), but the poster area can show blank until the video loads.
- **Recommendation:** Add JPGs (e.g. first frame or a designed thumbnail) to `public/cards/posters/` with those exact names, or generate stills from the MP4s (e.g. `ffmpeg -i Valentine6.mp4 -vframes 1 valentine6.jpg`).

---

## 2. Page Load Speed (video-heavy sections)

| Finding | Recommendation |
|--------|-----------------|
| **10 Valentine videos** on one section; `eagerLoad` used for above-the-fold cards. | Keep **eagerLoad** only for hero + first row (e.g. first 5 cards); use lazy load (IntersectionObserver) for cards 6–10 to improve LCP and TTI. |
| No `preload="none"` until in view. | Already mitigated by lazy-loading sources; ensure poster images are small (e.g. &lt; 150 KB each) to avoid blocking. |
| Single OG image for whole site. | OK for now; consider per-card OG images later for sharing specific Valentines. |

**Actionable:** In `HomeClient.tsx`, pass `eagerLoad` only for the first 5 Valentine cards in the “New Valentine Collection” grid; omit it for cards 6–10 so they load when scrolled into view.

---

## 3. Mobile Layout & Accessibility

| Area | Status | Recommendation |
|------|--------|-----------------|
| **Alt text** | `VALENTINE_CARD_ALTS` and `getValentineCardAlt()` used for images. | Done for all 10 cards. |
| **Contrast** | Pink/rose badges and buttons. | Check contrast of pink text on light backgrounds (e.g. `text-pink-800` on `bg-pink-100`) against WCAG AA; darken text or background if ratio &lt; 4.5:1. |
| **Captions** | No captions on card videos. | Optional: add `<track kind="captions">` for accessibility if you add subtitle files; otherwise ensure product copy describes the card for screen readers (already present). |
| **Touch targets** | Buttons and card CTAs. | Ensure “Send This Card” and filter buttons are at least 44×44 px on mobile (Tailwind `min-h-[44px]` / `min-w-[44px]` where needed). |
| **Focus states** | Links and buttons. | Confirm visible focus ring (e.g. `focus-visible:ring-2`) on all interactive elements for keyboard users. |

---

## 4. Autoplay / Loop Behavior

| Item | Status |
|------|--------|
| **Autoplay sound** | Off; videos use `muted` — correct for autoplay policies. |
| **Loop** | `loop` set on `LazyVideo` — good for subtle animation. |
| **Play on hover** | Implemented via `handlePreviewPlay` / `playOnHover` and `canplay` — works after fix. |
| **Mobile** | Static poster/image on mobile; tap-to-play available where `tapToPlay` is used; consider enabling tap-to-play on Valentine grid for consistency. |

**Recommendation:** Keep current behavior; optionally enable `tapToPlay` for Valentine cards on mobile so users can preview the animation with one tap.

---

## 5. SEO & Social Sharing

| Item | Status | Recommendation |
|------|--------|-----------------|
| **Meta title/description** | Set in `layout.tsx` and per-route (e.g. valentines `[cardName]`). | Good; keep template “%s \| CardRoots” and unique descriptions per card. |
| **OG image** | `og-image.jpg` in layout; valentines pages use video URL for OG. | Consider a dedicated **OG image for Valentine collection** (e.g. collage of 2–3 cards) for `/cards/valentines` and homepage shares. |
| **Canonical URLs** | Set on valentines and main pages. | Good. |
| **Structured data** | Product/FAQ schema present. | Good; ensure each Valentine card page has Product schema with correct `name` and `description` (already added for new cards). |
| **Sitemap** | `sitemap.ts` includes all 10 Valentine card URLs. | Updated with new keys. |

---

## 6. Analytics Tracking for Video Plays

| Event | Status |
|-------|--------|
| **Video preview (hover) play** | `trackEvent("video_preview_play", { cardKey })` in `handlePreviewPlay`. |
| **Vercel Analytics** | `track(name, data)` used; `@vercel/analytics` in layout. |

**Recommendations:**

- Add **video_preview_pause** (or equivalent) on mouse leave if you want to measure “watch time” or drop-off.
- In Vercel Analytics (or your dashboard), create a report filtered by `video_preview_play` and break down by `cardKey` to see which Valentines get the most previews.
- Optional: send a **card_send_start** or **checkout_start** with `cardKey` (already done) and correlate with `video_preview_play` to measure preview → send conversion.

---

## 7. Micro-Interactions (Optional, Low Performance Cost)

Suggested tweaks to increase engagement without hurting performance:

| Idea | Implementation | Performance |
|------|----------------|-------------|
| **Hover scale** | Cards already use `hover:scale-[1.02]`; keep as-is. | Low cost. |
| **Soft shadow on hover** | e.g. `hover:shadow-lg` or `hover:shadow-xl` on the card container. | Low cost. |
| **Subtle “sparkle” or heart** | Small CSS-only pseudo-element (e.g. `::after` with a tiny dot or heart) that fades in on hover; no extra images. | Low cost. |
| **Slow pulse on poster** | Very subtle `animate-pulse` or a custom gentle scale (e.g. 1 → 1.02) on the poster image only, before hover; remove when video plays. | Low cost. |
| **Button hover state** | Slight background darkening or scale on “Send This Card” (e.g. `hover:bg-red-700` + `transition`). | Negligible. |

Avoid: extra JavaScript animations, many additional DOM nodes, or loading extra assets for sparkles; prefer CSS-only and light use of Tailwind.

---

## 8. Summary Checklist

- [x] 10 Valentine cards in gallery (5 new: sweetheart, together, spark, dream, treasure).
- [x] New cards use same styling, typography, spacing, and hover/play behavior.
- [x] Video paths and metadata updated in HomeClient, sitemap, valentines page, card viewer, share page.
- [ ] Add poster images `valentine6.jpg`–`valentine10.jpg` for best initial load (or generate from MP4s).
- [ ] Consider `eagerLoad` only for first 5 Valentine cards; lazy load 6–10.
- [ ] Check contrast for pink UI and touch target size on mobile.
- [ ] Optional: enable tap-to-play on Valentine cards on mobile; add video_preview_pause and card-level analytics breakdown.

---

*Report generated for CardRoots Valentine update. Implement code and asset changes as needed, then re-run tests and deploy.*
