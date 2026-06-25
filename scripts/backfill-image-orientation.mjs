// One-off backfill: normalize EXIF orientation for images already in R2.
//
// Why: phone photos store the image sideways with an EXIF "rotate me" flag.
// Browsers honour it, but link-preview crawlers (iMessage/Slack/WhatsApp)
// render the raw bytes and show portrait shots sideways. New uploads are now
// normalized at upload time (src/lib/file-actions.ts); this script fixes the
// images that were already stored before that change.
//
// What it does: lists objects under a prefix (default "dossiers/"), and for
// any image whose EXIF orientation is set and != 1, rotates the pixels upright,
// strips the orientation tag, and re-uploads to the SAME key (so existing URLs
// keep working). Images with no/normal orientation are left untouched.
//
// Requires R2 credentials in the environment (same names as src/lib/r2.ts):
//   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME
//
// Run (Node >= 20.6 for --env-file):
//   node --env-file=.env.local scripts/backfill-image-orientation.mjs --dry-run
//   node --env-file=.env.local scripts/backfill-image-orientation.mjs
// Optional flags:
//   --prefix=dossiers/   limit to a key prefix (default "dossiers/")
//   --dry-run            report what would change without writing

import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const prefixArg = args.find((a) => a.startsWith("--prefix="));
const PREFIX = prefixArg ? prefixArg.split("=")[1] : "dossiers/";

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME } = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET_NAME) {
    console.error(
        "Missing R2 credentials. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME\n" +
            "(e.g. `vercel env pull .env.r2` then `node --env-file=.env.r2 scripts/backfill-image-orientation.mjs`).",
    );
    process.exit(1);
}

const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const CONTENT_TYPES = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    tif: "image/tiff",
    tiff: "image/tiff",
};

function contentTypeFor(key) {
    const ext = key.split(".").pop()?.toLowerCase() || "";
    return CONTENT_TYPES[ext];
}

async function listAllKeys(prefix) {
    const keys = [];
    let token;
    do {
        const res = await s3.send(
            new ListObjectsV2Command({
                Bucket: R2_BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: token,
            }),
        );
        for (const obj of res.Contents || []) {
            if (obj.Key && contentTypeFor(obj.Key)) keys.push(obj.Key);
        }
        token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return keys;
}

async function main() {
    console.log(
        `Backfill orientation — bucket "${R2_BUCKET_NAME}", prefix "${PREFIX}"${DRY_RUN ? " (dry run)" : ""}`,
    );

    const keys = await listAllKeys(PREFIX);
    console.log(`Found ${keys.length} image object(s) to inspect.\n`);

    let rotated = 0;
    let skipped = 0;
    let failed = 0;

    for (const key of keys) {
        try {
            const obj = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
            const bytes = await obj.Body.transformToByteArray();
            const buffer = Buffer.from(bytes);

            const meta = await sharp(buffer).metadata();
            const orientation = meta.orientation || 1;

            if (orientation === 1) {
                skipped++;
                continue;
            }

            if (DRY_RUN) {
                console.log(`would rotate: ${key} (orientation ${orientation})`);
                rotated++;
                continue;
            }

            const normalized = await sharp(buffer).rotate().toBuffer();
            await s3.send(
                new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: key,
                    Body: normalized,
                    ContentType: obj.ContentType || contentTypeFor(key),
                }),
            );
            console.log(`rotated: ${key} (orientation ${orientation})`);
            rotated++;
        } catch (err) {
            failed++;
            console.error(`failed: ${key} — ${err?.message || err}`);
        }
    }

    console.log(
        `\nDone. ${DRY_RUN ? "Would rotate" : "Rotated"}: ${rotated}, already-upright: ${skipped}, failed: ${failed}.`,
    );
}

main().catch((err) => {
    console.error("Backfill aborted:", err);
    process.exit(1);
});
