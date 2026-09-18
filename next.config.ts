import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // In dev the browser loads images directly; production builds use the
    // Next.js image optimizer.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        // Supabase Storage public URLs (photos uploaded from the dashboard)
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
