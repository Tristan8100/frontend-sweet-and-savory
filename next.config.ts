import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // Disables ALL ESLint checks during build
  },
};

export default nextConfig;
