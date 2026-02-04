/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/card/valentine-:path*",
        destination: "/cards/valentines/valentine-:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
