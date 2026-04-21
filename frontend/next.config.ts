/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://127.0.0.1:8000/api/:path*' // Kwenye Localhost iende kwa Python
          : '/api/:path*', // Kwenye Vercel ijishughulikie yenyewe
      },
    ];
  },
};

export default nextConfig;