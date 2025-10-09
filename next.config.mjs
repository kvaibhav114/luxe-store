/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow the Builder preview origin to fetch dev server RSC/HMR assets
  allowedDevOrigins: [
    "*.fly.dev",
    "*.builder.io",
  ],
}

export default nextConfig
