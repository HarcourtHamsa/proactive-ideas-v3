/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "www.educative.io", 'cdn.sanity.io', "flagsapi.com", "example.png", "example.com"],
  },
}

module.exports = nextConfig
