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
  // Poster URLs already use ?v=easter for cache-bust; this backs it up.
  async headers() {
    return [
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
