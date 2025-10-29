import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Thêm domain của API hoặc host ảnh
        port: '',
        pathname: '/**',         // tất cả đường dẫn
      },
    ],
  },
};

export default nextConfig;
