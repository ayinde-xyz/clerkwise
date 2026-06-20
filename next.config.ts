import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@langchain/google",
    "@langchain/core",
  ],
};

export default nextConfig;
