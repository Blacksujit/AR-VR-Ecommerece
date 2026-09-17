import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // The catalog sync stores HTTPS media returned by the configured
      // catalog provider. Migrate this origin to owned Cloudinary assets when
      // first-party product media is available.
      { protocol: 'https', hostname: 'cdn.dummyjson.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  serverExternalPackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default createMDX()(nextConfig);
