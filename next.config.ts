import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/documentation",
        destination: "/documentation/index.html",
        permanent: false,
      },
      {
        source: "/landingpage",
        destination: "/landingpage/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
