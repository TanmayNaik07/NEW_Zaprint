/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig