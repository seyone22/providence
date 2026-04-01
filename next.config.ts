import type { NextConfig } from "next";

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '32mb', // Set this to a reasonable limit for your PDFs/Images
        },
    },
};

export default nextConfig;
