/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile the shared workspace package
  transpilePackages: ['@mirror/shared'],
};

module.exports = nextConfig;
