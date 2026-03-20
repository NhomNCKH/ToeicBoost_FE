/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://144.91.104.237:3001/:path*',
      },
    ];
  },
}

module.exports = nextConfig