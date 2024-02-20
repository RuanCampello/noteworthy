/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [{
      hostname: 'upload.wikimedia.org',
      protocol: 'https'
    }]
  }
};

export default nextConfig;
