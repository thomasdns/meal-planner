import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const hasGoogleAnalytics = /^G-[A-Z0-9]+$/.test(
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "",
);

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${hasGoogleAnalytics ? " https://www.googletagmanager.com" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  connect-src 'self'${hasGoogleAnalytics ? " https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com" : ""};
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
