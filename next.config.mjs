/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    domains: ["ipfs.io"],
    formats: ["image/avif", "image/webp"],
  },

  // Webpack configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "lucide-react"],
  },
};

export default nextConfig;
