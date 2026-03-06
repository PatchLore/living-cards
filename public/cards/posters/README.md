# Card poster images

Static poster images (JPG) are used as fallbacks before the living card MP4 plays.

## Easter cards

All 8 Easter living cards have matching posters in this folder. Source MP4s are named `Easter1.mp4`–`Easter8.mp4` (capital E); the app uses lowercase paths `easter1.jpg`/`easter1.mp4` etc.

| File | Card |
|------|------|
| `easter1.jpg` | Easter Morning |
| `easter2.jpg` | Easter Bloom |
| `easter3.jpg` | Easter Bunny |
| `easter4.jpg` | Easter Eggs |
| `easter5.jpg` | Easter Garden |
| `easter6.jpg` | Easter Joy |
| `easter7.jpg` | Easter Sunrise |
| `easter8.jpg` | Easter Wishes |

### Regenerating Easter posters from MP4s

To regenerate first-frame JPGs from the Easter MP4s (requires [ffmpeg](https://ffmpeg.org/)):

```bash
cd public/cards/posters
ffmpeg -i Easter1.mp4 -vframes 1 -q:v 2 easter1.jpg -y
ffmpeg -i Easter2.mp4 -vframes 1 -q:v 2 easter2.jpg -y
ffmpeg -i Easter3.mp4 -vframes 1 -q:v 2 easter3.jpg -y
ffmpeg -i Easter4.mp4 -vframes 1 -q:v 2 easter4.jpg -y
ffmpeg -i Easter5.mp4 -vframes 1 -q:v 2 easter5.jpg -y
ffmpeg -i Easter6.mp4 -vframes 1 -q:v 2 easter6.jpg -y
ffmpeg -i Easter7.mp4 -vframes 1 -q:v 2 easter7.jpg -y
ffmpeg -i Easter8.mp4 -vframes 1 -q:v 2 easter8.jpg -y
```

## Valentine cards

All 10 Valentine living cards have matching posters in this folder:

| File | Card |
|------|------|
| `valentine1.jpg` | Valentine Rose |
| `valentine2.jpg` | Valentine Heart Glow |
| `valentine3.jpg` | Valentine Blossom |
| `valentine4.jpg` | Valentine Love Light |
| `valentine5.jpg` | Valentine Forever |
| `valentine6.jpg` | Valentine Sweetheart |
| `valentine7.jpg` | Valentine Together |
| `valentine8.jpg` | Valentine Spark |
| `valentine9.jpg` | Valentine Dream |
| `valentine10.jpg` | Valentine Treasure |

Each card uses `poster="/cards/posters/valentineN.jpg"` so the static image shows on initial load; the MP4 plays on hover (desktop) or when the video loads (lazy). If you replace or regenerate a poster, use the same filename.

### Regenerating posters from MP4s

To regenerate first-frame JPGs from the MP4s (requires [ffmpeg](https://ffmpeg.org/)):

```bash
cd public/cards/posters
ffmpeg -i valentine1.mp4 -vframes 1 -q:v 2 valentine1.jpg -y
ffmpeg -i valentine2.mp4 -vframes 1 -q:v 2 valentine2.jpg -y
# ... valentine3, valentine4, valentine5
ffmpeg -i Valentine6.mp4 -vframes 1 -q:v 2 valentine6.jpg -y
ffmpeg -i Valentine7.mp4 -vframes 1 -q:v 2 valentine7.jpg -y
ffmpeg -i Valentine8.mp4 -vframes 1 -q:v 2 valentine8.jpg -y
ffmpeg -i Valentine9.mp4 -vframes 1 -q:v 2 valentine9.jpg -y
ffmpeg -i Valentine10.mp4 -vframes 1 -q:v 2 valentine10.jpg -y
```
