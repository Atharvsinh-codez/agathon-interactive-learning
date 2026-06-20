import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blp/ui", "@blp/engine", "@blp/schema"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
