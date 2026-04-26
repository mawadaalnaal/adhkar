import type { NextConfig } from "next";

const defaultRuntimeCaching = require("next-pwa/cache");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/workbox-:hash(.*).js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
};

const withPwa = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  clientsClaim: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  reloadOnOnline: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 86400,
        },
      },
    },
    ...defaultRuntimeCaching,
  ],
});

export default withPwa(nextConfig);
