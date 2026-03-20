/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://3.137.156.82:8000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;