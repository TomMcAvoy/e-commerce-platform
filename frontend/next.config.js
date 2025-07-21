/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  },
}

module.exports = nextConfig
