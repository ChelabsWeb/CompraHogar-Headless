import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : null,
  "https://www.googletagmanager.com",
  "https://ajax.googleapis.com",
  "https://cdn.judge.me",
  "https://connect.facebook.net",
]
  .filter(Boolean)
  .join(" ");

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
          { key: "X-XSS-Protection", value: "0" },
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
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.judge.me",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://cdn.judge.me https://judgeme-public-images.imgix.net https://www.facebook.com",
              "connect-src 'self' https://*.shopify.com https://*.myshopify.com https://www.google-analytics.com https://*.googleapis.com https://judge.me https://cache.judge.me https://www.facebook.com https://connect.facebook.net",
              "frame-src 'self' https://www.googletagmanager.com https://judge.me https://www.facebook.com",
              "media-src 'self' https://cdn.shopify.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
