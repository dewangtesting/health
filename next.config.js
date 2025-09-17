/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Netlify plugin handles image optimization; disable Next.js server optimizer
    unoptimized: true,
  },
  experimental: {
  },
}

module.exports = nextConfig
