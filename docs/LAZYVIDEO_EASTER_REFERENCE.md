# LazyVideo + Easter Card Grid — Reference Pattern

This document captures the intended behavior for LazyVideo and the Easter card grid. The main `LazyVideo` in `app/HomeClient.tsx` follows this pattern (with additional features: IntersectionObserver, eagerLoad, tapToPlay, focus/blur, webm).

## Minimal Reference Implementation

```tsx
// app/HomeClient.tsx (or your component file)
import { useRef, useState, useEffect } from "react";
import MobilePreviewModal from "./MobilePreviewModal";

type Card = {
  key: string;
  poster: string;
  src: string;
};

const easterCards: Card[] = [
  { key: "easter1", poster: "/cards/posters/easter1.jpg", src: "/cards/posters/easter1.mp4" },
  { key: "easter2", poster: "/cards/posters/easter2.jpg", src: "/cards/posters/easter2.mp4" },
  { key: "easter3", poster: "/cards/posters/easter3.jpg", src: "/cards/posters/easter3.mp4" },
  { key: "easter4", poster: "/cards/posters/easter4.jpg", src: "/cards/posters/easter4.mp4" },
  { key: "easter5", poster: "/cards/posters/easter5.jpg", src: "/cards/posters/easter5.mp4" },
  { key: "easter6", poster: "/cards/posters/easter6.jpg", src: "/cards/posters/easter6.mp4" },
  { key: "easter7", poster: "/cards/posters/easter7.jpg", src: "/cards/posters/easter7.mp4" },
  { key: "easter8", poster: "/cards/posters/easter8.jpg", src: "/cards/posters/easter8.mp4" },
];

export default function HomeClient() {
  const [mobilePreviewCard, setMobilePreviewCard] = useState<Card | null>(null);

  return (
    <div className="cards-grid">
      {easterCards.map((card) => (
        <LazyVideoCard
          key={card.key}
          card={card}
          onSelect={() => setMobilePreviewCard(card)}
        />
      ))}

      {mobilePreviewCard && (
        <MobilePreviewModal card={mobilePreviewCard} onClose={() => setMobilePreviewCard(null)} />
      )}
    </div>
  );
}

type LazyVideoCardProps = {
  card: Card;
  onSelect: () => void;
};

function LazyVideoCard({ card, onSelect }: LazyVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHoveredRef = useRef(false);
  const [playOnHover, setPlayOnHover] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const requestLoad = () => setIsLoaded(true);

  // Hover effect
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleCanPlay = () => {
      if (isHoveredRef.current) {
        videoEl.play().catch(() => undefined);
      }
    };

    videoEl.addEventListener("canplay", handleCanPlay);
    return () => videoEl.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <div
      className="lazy-video-card"
      onMouseEnter={() => {
        isHoveredRef.current = true;
        requestLoad();
        setPlayOnHover(true);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setPlayOnHover(false);
      }}
      onClick={onSelect} // Mobile tap or select
    >
      <video
        ref={videoRef}
        poster={card.poster}
        muted
        playsInline
        className="card-video"
      >
        {isLoaded && <source src={card.src} type="video/mp4" />}
      </video>
      <div className={`overlay ${playOnHover ? "hovering" : ""}`}>
        <span>Select This Card</span>
      </div>
    </div>
  );
}
```

## Notes / Key Features

### Hover behavior (desktop)

- `onMouseEnter` → sets `isHoveredRef.current = true`, calls `requestLoad()`, sets `playOnHover = true`.
- `canplay` event triggers actual `play()`. Matches Valentine behavior exactly.
- **No `loadeddata` listener** — prevents early playback issues.

### Mobile behavior

- Clicking/tapping a card sets `mobilePreviewCard` → opens `MobilePreviewModal`.
- Poster shown by default on mobile; MP4 plays in modal.

### Prevent duplication

- Only one `map()` renders the cards.
- Modal uses the same `Card` object; no duplicate DOM nodes.

### Overlay

- Shows “Select This Card” in green when hovered.
- Controlled by `playOnHover` state.

### MP4s

- Ensure the MP4 files are in `public/cards/posters/` and paths match the `src` field exactly (e.g. `easter1.mp4` … `easter8.mp4`).

## Mapping to current HomeClient LazyVideo

| Reference           | HomeClient LazyVideo                                      |
|---------------------|-----------------------------------------------------------|
| `isLoaded` gates source | `shouldLoad` gates `<source>` (plus IntersectionObserver / eagerLoad) |
| `requestLoad()`     | `requestLoad()` → `setShouldLoad(true)`                  |
| `playOnHover`       | Same state; parent can use for overlay/analytics          |
| canplay only        | Effect with `[shouldLoad, playOnHover]` adds canplay only |
| `isHoveredRef`      | Same; set in onMouseEnter/Leave and onFocus/Blur         |
| Mobile modal        | `mobilePreviewCard` + `MobilePreviewModal`; tap sets card  |

The full `LazyVideo` in `app/HomeClient.tsx` keeps this behavior and adds: intersection-based load, `eagerLoad`, `tapToPlay`, `onFocus`/`onBlur`, optional `webmSrc`, and forwarding of `onMouseEnter`/`onMouseLeave` for parent handlers (e.g. `handlePreviewPlay` / `handlePreviewPause`).
