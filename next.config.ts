import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.murphslifefoundation.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
