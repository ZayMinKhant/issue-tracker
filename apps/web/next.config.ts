import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@issue-tracker/types', '@issue-tracker/utils'],
};

export default nextConfig;
