/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  eslint: {
    ignoreDuringBuilds: true,
  },
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
      {
        hostname: process.env.NEXT_PUBLIC_CLOUDFLARE_DEV_URL,
        protocol: 'https',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
