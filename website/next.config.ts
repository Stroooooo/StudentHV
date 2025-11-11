/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
<<<<<<< HEAD
=======
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
>>>>>>> 0eede7c (New ability to filter)
}

module.exports = nextConfig