import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '32mb', // Set this to a reasonable limit for your PDFs/Images
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
        ];
    },
};

export default nextConfig;
