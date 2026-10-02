import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // "My shops" moved from /my-shops to /me; keep old links and bookmarks working.
      { source: "/my-shops", destination: "/me", permanent: true },
    ];
  },
};

export default nextConfig;
