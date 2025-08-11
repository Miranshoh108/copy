/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    domains: ["bsmarket.uz", "mini-io-api.texnomart.uz"],

    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "bsmarket.uz",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http", 
        hostname: "bsmarket.uz",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "https",
        hostname: "reclam.ca",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],

    loader: "default",
    path: "/_next/image",
    unoptimized: process.env.NODE_ENV === "development", 
  },

  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": process.cwd(),
    };

    if (dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,
        net: false,
        fs: false,
      };
    }

    return config;
  },

  turbopack: {
    resolveAlias: {
      "@": process.cwd(),
    },
  },

  async headers() {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },

  async securityHeaders() {
    return [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
    ];
  },

  ...(process.env.NODE_ENV === "development" && {
    experimental: {
      serverComponentsExternalPackages: ["https"],
    },
  }),
};

export default nextConfig;
