
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  devIndicators: {
    buildActivity: false,
  },
  // Add the allowed origin for the development server
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        "https://6000-idx-studio-1745814910643.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
      ],
    },
  }),
};

export default nextConfig;
