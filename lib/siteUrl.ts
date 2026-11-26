/** Public base URL with no trailing slash. */
export function siteUrl() {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.cardroots.com");
  return raw.replace(/\/$/, "");
}
