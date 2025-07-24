/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mini-io-api.texnomart.uz'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'reclam.ca',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd(),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': process.cwd(),
    },
  }
};

export default nextConfig;