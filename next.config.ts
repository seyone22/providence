import type { NextConfig } from "next";

/** Hosts that must never be crawled or indexed. Regex, anchored ^...$ by Next. */
const NON_PROD_HOSTS = "(staging|dev)\\.providenceauto\\.co\\.uk";
/** The bare apex. Anchored, so it can never match www.* — no redirect loop. */
const APEX_HOST = "providenceauto\\.co\\.uk";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "32mb",
    },
  },
  async headers() {
    return [
      {
        // "/(.*)" matches "/" as well; "/:path*" does NOT.
        source: "/(.*)",
        has: [{ type: "host", value: NON_PROD_HOSTS }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Static imagery under public/ was being served with max-age=14400 —
        // four hours — so a returning visitor re-downloaded every logo, flag
        // and car photograph several times a day. PageSpeed booked it as
        // "Use efficient cache lifetimes".
        //
        // Thirty days rather than the usual year-and-immutable, and that is a
        // deliberate trade. These are STABLE filenames: /car_logo/audi-logo.webp
        // keeps its name when the mark is redrawn. `immutable` would be faster
        // and would also mean a replaced image never reaches anyone who had
        // already seen the old one, for a year, with no way to force it short
        // of renaming the file. Thirty days plus stale-while-revalidate keeps
        // essentially all of the performance, serves instantly from cache while
        // it revalidates in the background, and self-heals within a month.
        //
        // If a content-hashed naming convention is ever adopted for these
        // folders, this can safely become `max-age=31536000, immutable`.
        source:
          "/:path(car_logo|country|home|affiliate|cars|about|import-cars)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/robots.txt",
          has: [{ type: "host", value: NON_PROD_HOSTS }],
          destination: "/robots-noindex.txt",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      {
        source: "/campaigns/luxury-lhd-japan",
        destination: "/japanese-luxury-cars-lhd",
        permanent: true,
      },
      {
        source: "/source-cars-from/sri-lanka",
        destination: "/source-cars-from",
        permanent: true,
      },
      {
        // "/:path(.*)" matches "/" AND captures the path; "/:path*" misses "/".
        source: "/:path(.*)",
        has: [{ type: "host", value: APEX_HOST }],
        destination: "https://www.providenceauto.co.uk/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
