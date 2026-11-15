import type { NextConfig } from "next";

function contentSecurityPolicy(frameAncestors: string) {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://challenges.cloudflare.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    `frame-ancestors ${frameAncestors}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const sharedSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  ...sharedSecurityHeaders,
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy("'none'"),
  },
];

const embeddableIntakeHeaders = [
  ...sharedSecurityHeaders,
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy("*"),
  },
];

const embeddableDemoHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  ...sharedSecurityHeaders,
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy("'self'"),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bloomingrocksolutions.com" }],
        destination: "https://www.bloomingrocksolutions.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/intake/:path*",
        headers: embeddableIntakeHeaders,
      },
      {
        source: "/demo/:path*",
        headers: embeddableDemoHeaders,
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;