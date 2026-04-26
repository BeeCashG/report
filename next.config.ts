import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Webpack and disable Turbopack build features
  experimental: {
    // @ts-ignore - disabling turbo build
    turbo: {
      enabled: false
    }
  },
  // Ensure we don't use symlinks for the build process
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  }
};

export default nextConfig;
