/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: "/youtube",
        destination: "https://youtubechapters.app/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
