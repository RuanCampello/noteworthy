/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      {
        hostname: 'firebasestorage.googleapis.com',
        protocol: 'https',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
