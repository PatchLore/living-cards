import HomeClient from "./HomeClient";

// Force dynamic rendering so the homepage is never served from static cache.
// Prevents "flash of old images" when CDN served stale HTML from a previous build.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <HomeClient />;
}
