/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep existing settings
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

  // === PERFORMANCE OPTIMIZATIONS ===

  // Enable gzip/brotli compression for smaller payloads
  compress: true,

  // Enable React strict mode (helps catch issues, minor perf benefit in prod)
  reactStrictMode: true,



  // Aggressive caching headers for static assets
  async headers() {
    return [
      {
        // Cache immutable Next.js build assets for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static files in /public (images, SVGs, fonts, etc.) for 1 day with revalidation
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Cache images directory aggressively (paper textures, tape, etc.)
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
    ]
  },

  // Experimental features for faster navigation
  experimental: {
    // Optimize package imports - tree-shake large libraries so only used icons/functions are bundled
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
      '@radix-ui/react-icons',
      '@supabase/supabase-js',
    ],
    // Enable optimistic client-side navigation cache for faster tab switches
    staleTimes: {
      dynamic: 30,  // Cache dynamic pages for 30 seconds
      static: 180,  // Cache static pages for 3 minutes
    },
  },

  // Webpack optimizations for better chunk splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Separate large vendor libraries into their own chunks
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              chunks: 'all',
              enforce: true,
            },
            // Group Radix UI components together
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 30,
              chunks: 'all',
              reuseExistingChunk: true,
            },
            // Group animation libraries
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 30,
              chunks: 'all',
              reuseExistingChunk: true,
            },
            // Group Supabase client
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              priority: 30,
              chunks: 'all',
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
}

export default nextConfig