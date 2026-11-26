import { Config } from "@remotion/cli/config";

// Faster frame grabs for video-heavy compositions, and always overwrite the output.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// Promo-video assets live here, not in the website's public/ folder, so they
// are never uploaded or served with the site.
Config.setPublicDir("./remotion/public");

// Seeking 1080x1920 OffthreadVideo frames is I/O heavy; keep concurrency modest
// and allow slow frame fetches rather than failing the render.
Config.setConcurrency(4);
Config.setDelayRenderTimeoutInMilliseconds(120000);
