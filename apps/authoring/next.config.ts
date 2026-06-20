const nextConfig = {
  transpilePackages: ["@blp/ui", "@blp/schema"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
