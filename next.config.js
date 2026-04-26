/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  }
};

module.exports = nextConfig;
