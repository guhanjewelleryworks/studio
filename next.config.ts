
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added placehold.co
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
