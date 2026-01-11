import type { NextConfig } from "next";

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000");

type ExtendedNextConfig = NextConfig & {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
};

const nextConfig: ExtendedNextConfig = {
  /* config options here */
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https", // restrict type
        hostname: apiUrl.hostname,
        port: apiUrl.port || undefined, // must be string | undefined
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all paths under Cloudinary
      },
    ],
  },
};

export default nextConfig;
