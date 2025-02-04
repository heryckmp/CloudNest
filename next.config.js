/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cloud.appwrite.io',
      'img.freepik.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.appwrite.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 