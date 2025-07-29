/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  images: {
    domains: [
      'via.placeholder.com',
      'images.unsplash.com',
      'fakestoreapi.com',
      'i.dummyjson.com',
      'cdn.dummyjson.com',
      'localhost'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  experimental: {
    // Future features
  },
};

module.exports = nextConfig;
