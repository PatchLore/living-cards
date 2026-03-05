# Full Audit: LazyVideo Valentine (Working) vs Easter (Broken)

**Reference:** Valentine working state = commit `ec5c6657` ("fix: resolve video playback race condition on hover") and the 10 Valentine cards setup.  
**Current:** Easter cards + all subsequent "fix" commits that changed LazyVideo.

---

## 1. What Worked on Valentine

- **Hover flow:** Mouse enter → video loads (sources added) → when `canplay` fires → `play()` if still hovered. No immediate `play()` on hover.
- **onMouseEnter** did: `isHoveredRef.current = true`, `requestLoad()`, `setPlayOnHover(true)`, then called parent. It did **not** call `setShouldLoad(true)` directly or `setShouldPlayOnLoad(true)`.
- **onMouseLeave** did: `isHoveredRef.current = false`, `setPlayOnHover(false)`, then parent. LazyVideo did **not** pause the video or reset `currentTime`; the parent `handlePreviewPause` did that on the same element.
- **First useEffect** (shouldLoad + shouldPlayOnLoad): Ran `play()` and then **setShouldPlayOnLoad(false)**. So it was used for tap-to-play / eager autoplay, not for hover. On hover, `shouldPlayOnLoad` was never set, so this effect did not run.
- **Second useEffect** (playOnHover): Only listened to **canplay** (one listener). When `canplay` fired, if `isHoveredRef.current` then `play()`, then `setPlayOnHover(false)`. So hover playback was entirely driven by this effect.
- **Loading overlay:** `shouldLoad && !isLoaded` (no `!poster` in that commit). Later commit `975cff2e` added `!poster` so the poster isn’t covered; that improvement should stay.

---

## 2. What Changed for Easter (and “Fixes”) That Made It Worse

### 2.1 onMouseEnter (Easter “fixes”)

- **Added** `setShouldLoad(true)` and **setShouldPlayOnLoad(true)** in addition to `requestLoad()` and `setPlayOnHover(true)`.
- **Effect:** The first useEffect (shouldLoad + shouldPlayOnLoad) now runs on hover and calls `videoRef.current.play()` in the same tick or very soon. At that moment the `<source>` may not be in the DOM yet or the video hasn’t loaded, so `play()` can fail or be a no-op. That doesn’t fix anything and can confuse the flow.
- **Valentine:** Only `requestLoad()` + `setPlayOnHover(true)`. No `shouldPlayOnLoad`, so the first effect never ran on hover; playback was only via the canplay effect.

### 2.2 First useEffect (shouldLoad + shouldPlayOnLoad)

- **Removed** `setShouldPlayOnLoad(false)` after `play()` in one of the Easter fixes.
- **Effect:** The effect can re-run or leave stale state; the original design was “try play once and clear the flag.”
- **Valentine:** Had `setShouldPlayOnLoad(false)` after `play()`.

### 2.3 Second useEffect (playOnHover + canplay)

- **Added** a **loadeddata** listener in addition to **canplay**, both calling the same `tryPlay()`.
- **Effect:** `loadeddata` can fire before the video is actually ready to play. If we call `play()` on `loadeddata` and it fails or stalls, we then call `setPlayOnHover(false)` and remove both listeners. When `canplay` fires later, the listener is already gone, so we never retry. So adding `loadeddata` can cause “play too early, fail, then never play on canplay.”
- **Valentine:** Only **canplay**; one listener, play when the video is ready.

### 2.4 onMouseLeave (inside LazyVideo)

- **Added** inside LazyVideo: `if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }`.
- **Effect:** Redundant with parent `handlePreviewPause`, which already does the same on `event.currentTarget`. Not the cause of “no play on hover,” but Valentine didn’t do this inside LazyVideo.

### 2.5 Loading overlay

- **Added** `&& !poster` so overlay doesn’t show when there’s a poster (good).
- **Added** `pointer-events-none` (good, so overlay never blocks).
- **Verdict:** Keep these; they match the poster fix and are safe.

---

## 3. Summary Table: Valentine vs Current (Easter)

| Item | Valentine (working) | Easter / current | Verdict |
|------|---------------------|------------------|--------|
| onMouseEnter | `isHoveredRef = true`, `requestLoad()`, `setPlayOnHover(true)` | Also `setShouldLoad(true)`, `setShouldPlayOnLoad(true)` | Revert: don’t set shouldPlayOnLoad on hover; use requestLoad only. |
| onMouseLeave | Ref + state only; parent pauses | Ref + state + internal pause/currentTime | Revert: remove internal pause (parent handles). |
| First useEffect | `play()` then `setShouldPlayOnLoad(false)` | `play()` only (no clear flag) | Restore `setShouldPlayOnLoad(false)`. |
| Second useEffect | Only **canplay** | **canplay** + **loadeddata** | Revert: only canplay. |
| Overlay | Later: `!poster` + no block | `!poster` + `pointer-events-none` | Keep current overlay. |

---

## 4. Root Cause of “Cards Still Not Moving” After Easter

1. **Hover sets `shouldPlayOnLoad`** → first effect runs and calls `play()` before the video has a loaded source → ineffective or failing play.
2. **Second effect listens to `loadeddata`** → sometimes we try to play on `loadeddata`, fail, then remove listeners and never run on `canplay`.
3. Combined: the “fixes” added two ways to start playback (immediate effect + early event) that don’t match how the video actually loads, and the canplay-based path (which worked in Valentine) is either not used or short-circuited.

---

## 5. Recommended Fix: Revert LazyVideo to Valentine Behavior

- **onMouseEnter:** `isHoveredRef.current = true`, `requestLoad()`, `setPlayOnHover(true)`, then `onMouseEnter?.(e)`. Do **not** set `setShouldLoad(true)` or `setShouldPlayOnLoad(true)`.
- **onMouseLeave:** `isHoveredRef.current = false`, `setPlayOnHover(false)`, then `onMouseLeave?.(e)`. Do **not** pause or set `currentTime` inside LazyVideo (parent handles it).
- **First useEffect:** After `play()`, call `setShouldPlayOnLoad(false)` again.
- **Second useEffect:** Listen only to **canplay**; remove the **loadeddata** listener.
- **Overlay:** Keep `shouldLoad && !isLoaded && !poster` and `pointer-events-none`.

Result: Hover only triggers load + playOnHover; playback starts only when `canplay` fires, with `isHoveredRef` already set on mouse enter, matching the working Valentine behavior.
