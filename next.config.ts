import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // No landing page yet: Discover is the front door. Temporary, so a future
      // src/app/page.tsx can take "/" back by deleting this entry.
      { source: "/", destination: "/shops", permanent: false },
      // "My shops" moved from /my-shops to /me; keep old links and bookmarks working.
      { source: "/my-shops", destination: "/me", permanent: true },
    ];
  },
};

export default nextConfig;
