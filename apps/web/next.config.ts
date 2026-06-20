import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blp/ui", "@blp/engine", "@blp/schema"],
};

export default nextConfig;
