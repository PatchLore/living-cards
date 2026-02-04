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
};

export default nextConfig;
