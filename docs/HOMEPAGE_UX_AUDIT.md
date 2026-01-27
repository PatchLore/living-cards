# CardRoots Homepage UX/Conversion Audit

## Snapshot of current experience
- Single-page flow in `app/page.tsx` with a sticky header, hero, collection grid, how-it-works text, FAQ, and personalization form.
- Core conversion flow is: browse cards → select card → personalize form → checkout.
- Heavy use of video previews; no posters or lazy-loading for hero videos.

## Primary friction points
- Above-the-fold: hero and preview videos load immediately, increasing LCP and bandwidth.
- Video previews lack posters; users see blank frames while videos load.
- Social proof is present but static and not tied to credible counters.
- Filters are limited; category coverage does not match all card categories.
- Quick view modal exists but lacks clear “full preview” distinction and trust cues.
- CTA density is high in cards (select, quick view, personalize), which can increase choice friction.
- No structured trust section (testimonials/partners) to reduce skepticism.
- Exit intent and mobile-specific engagement cues are missing.

## Mobile and cross-device
- Grid is responsive but no mobile-first carousel or sticky CTA bar for deep scrolls.
- Sticky header can consume vertical space on small screens.
- Tap targets are generally acceptable, but quick view and personalize buttons compete.

## Performance observations (current state)
- MP4-only videos; no WebM or compression verification.
- No lazy loading with IntersectionObserver; above-the-fold videos autoplay immediately.
- No skeletons or placeholders for cards while videos load.
- Snow overlays and multiple video autoplay can impact animation smoothness on low-end devices.

## Value proposition and CTA clarity
- Headline is strong; CTA text is action-oriented.
- Pricing clarity is limited above the fold.
- “For Business” link competes with primary conversion path without segmentation.

## Trust and credibility signals
- Minimal social proof; no testimonials, logos, or certificates.
- No clear guarantee or proof of tree planting beyond text claims.

## Implemented improvements (this iteration)
- Added a hero carousel with auto-playing previews and reduced-motion fallback.
- Added full mobile navigation with a hamburger menu and sticky mobile CTA bar.
- Added responsive gallery with swipeable behavior on mobile and improved filters.
- Added quick view analytics, scroll-depth tracking, and CTA event tracking.
- Added lazy-loading for videos and loading skeletons to reduce perceived load time.
- Added badge system and inventory scarcity messaging per card.
- Added a structured “How It Works” 3-step section above the gallery.
- Added an accordion FAQ with search and expanded objection handling.
- Added exit-intent discount modal with dismiss persistence.

## Pending assets/data
- Real counters for trees planted, cards sent, and monthly trees planted.
- Testimonials (names, quotes, photos), partner logos, and before/after impact images.
- WebM video files and poster images for all cards.

## A/B test recommendations
- Hero CTA copy: “Browse Our Cards” vs “Start Personalizing”.
- Social proof placement: hero vs below How It Works.
- Quick View CTA order: Select vs Preview Full Card.
- Scarcity copy: “Only X available” vs “Limited Edition”.
- Price framing: “From £5 per card” vs “£5 includes 1 tree”.

## Screenshots and performance metrics
- Before/after screenshots and Lighthouse metrics could not be captured in this environment.

