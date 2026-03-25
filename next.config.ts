import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "judgeme-public-images.imgix.net",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://ajax.googleapis.com https://cdn.judge.me",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.judge.me",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://cdn.judge.me https://judgeme-public-images.imgix.net",
              "connect-src 'self' https://*.shopify.com https://*.myshopify.com https://www.google-analytics.com https://*.googleapis.com https://judge.me https://cache.judge.me",
              "frame-src 'self' https://www.googletagmanager.com https://judge.me",
              "media-src 'self' https://cdn.shopify.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
