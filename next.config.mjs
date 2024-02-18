/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'upload.wikimedia.org',
      protocol: 'https'
    }]
  }
};

export default nextConfig;
