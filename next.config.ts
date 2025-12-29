import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/knowledge-bases",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
