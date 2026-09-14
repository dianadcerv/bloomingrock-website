import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
