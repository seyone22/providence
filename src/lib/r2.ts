// lib/r2.ts
import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
const endpoint = process.env.R2_ENDPOINT!; // e.g., https://[account-id].r2.cloudflarestorage.com

export const r2 = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

// ⚠️ Add R2_PUBLIC_URL to your .env file!
// This should be your r2.dev link or your custom domain (e.g., https://pub-asdf123.r2.dev)
// Do NOT use R2_ENDPOINT here.
export const PUBLIC_BUCKET_URL = process.env.R2_PUBLIC_URL!;