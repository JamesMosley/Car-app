import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ FIX: Prevent EISDIR readlink error on Windows
  outputFileTracing: false,

  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;