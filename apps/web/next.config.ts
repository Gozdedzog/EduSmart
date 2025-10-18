import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable ESLint during build for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Environment configuration
  env: {
    NEXT_PUBLIC_ML_API_URL: process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/test',
        destination: '/icerikler',
        permanent: true,
      },
      {
        source: '/testler',
        destination: '/icerikler',
        permanent: true,
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'edusmart.com', 'www.edusmart.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // Security headers
  async headers() {
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
    ];
  },
};

export default nextConfig;
