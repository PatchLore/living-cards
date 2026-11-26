/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/card/valentine-:slug",
        destination: "/cards/valentines/valentine-:slug",
        permanent: true,
      },
    ];
  },
  // Prevent edge from serving stale poster images (flash of old images).
  // Poster URLs already use ?v=valentine for cache-bust; this backs it up.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // The success page URL carries the Stripe session ID; never send it to another site.
      // Listed after the global rule so it overrides it.
      {
        source: "/success",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        source: "/cards/posters/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=0, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
