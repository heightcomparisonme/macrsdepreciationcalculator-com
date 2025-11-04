import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";
import path from "path";
import { fileURLToPath } from "url";
const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone", // Temporarily disabled due to Windows symlink permissions (enable for Docker deployment)
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  typescript: {
    // Temporarily ignore TypeScript errors during builds
    // TODO: Fix remaining TypeScript errors in AI SDK
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
    // Next.js 16: Allow images that resolve to private IPs (e.g., Unsplash CDN)
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
  },
  async redirects() {
    return [];
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      sweph: path.resolve(__dirname, "src/services/ephemeris/sweph-stub.ts"),
    };
    return config;
  },
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
