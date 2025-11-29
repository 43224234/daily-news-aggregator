import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/daily-news-aggregator',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
