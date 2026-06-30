/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile the shared workspace package
  transpilePackages: ['@readonepage/shared'],
};

module.exports = nextConfig;
