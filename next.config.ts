import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['localhost:3000', '192.168.0.102:3000'],
  images: {
    minimumCacheTTL: 3600,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Adding common placeholder source just in case
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
      },
      {
        protocol: 'https',
        hostname: 'images.weserv.nl',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${process.env.R2_PUBLIC_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
