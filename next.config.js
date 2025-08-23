/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable experimental features that slow down dev
  experimental: {
    optimizePackageImports: process.env.NODE_ENV === 'production' 
      ? ['framer-motion', 'recharts', 'lucide-react'] 
      : [],
  },
  
  // Performance optimizations
  compress: process.env.NODE_ENV === 'production',
  swcMinify: process.env.NODE_ENV === 'production',
  
  // Image optimization (disabled in dev for speed)
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Output configuration
  output: 'standalone',
  trailingSlash: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack optimization (only in production)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
          },
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            chunks: 'all',
          },
        },
      }
    }
    
    // Development optimizations
    if (dev) {
      // Faster source maps in dev
      config.devtool = 'eval-cheap-module-source-map'
      
      // Disable some optimizations in dev for faster builds
      config.optimization.minimize = false
      config.optimization.minimizer = []
    }
    
    return config
  },
  
  // Headers for security (only in production)
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ]
    }
    return []
  },
  
  // Redirects for SPA routing (only in production)
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/dashboard',
          destination: '/dashboard/',
          permanent: true,
        },
        {
          source: '/projects',
          destination: '/projects/',
          permanent: true,
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig
