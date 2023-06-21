const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_APP_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co*",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/leaflet/dist/images',
            to: path.resolve(__dirname, 'public', 'leaflet', 'images')
          },
        ],
      }),
    )
    return config
  }
}

module.exports = nextConfig;