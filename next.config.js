/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.iconscout.com", "localhost", "c8.alamy.com"],
  },
};

module.exports = nextConfig;
