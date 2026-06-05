import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "sseulmo.dev-api.wie.re",
      },
      {
        protocol: "https",
        hostname: "sseulmo.api.wie.re",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
