/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "www.educative.io", 'cdn.sanity.io', "flagsapi.com", "example.png", "example.com"],
  },
}

module.exports = nextConfig
