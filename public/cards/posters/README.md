# Card poster images

Static poster images (JPG) are used as fallbacks before the living card MP4 plays.

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
