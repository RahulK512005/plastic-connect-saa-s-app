/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webVitalsAttribution: [],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
}

export default nextConfig
