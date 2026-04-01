import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.fal.media" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
};

export default nextConfig;
