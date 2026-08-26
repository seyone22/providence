import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "32mb", // Set this to a reasonable limit for your PDFs/Images
    },
  },
  async redirects() {
    return [
      // LHD luxury landing page moved out of /campaigns to a keyword-rich
      // top-level slug. 301 so the old campaign URL keeps its ranking.
      {
        source: "/campaigns/luxury-lhd-japan",
        destination: "/japanese-luxury-cars-lhd",
        permanent: true,
      },
      // Sri Lanka is a destination market and our South Asia operations base,
      // not a country we buy in — so a page under /source-cars-from asserted
      // something untrue in the URL itself. Removed 2026-08-26. 301 to the hub
      // rather than a 404 so the accumulated equity lands somewhere real.
      //
      // Sri Lanka remains a presence country everywhere else (COUNTRY_PAGES,
      // the office count, the destination lists, the blog cluster). Only the
      // sourcing page is gone.
      {
        source: "/source-cars-from/sri-lanka",
        destination: "/source-cars-from",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
