// Repoints a dossier's local image paths at the WebP files that replaced them.
//
//   node --env-file=.env.local scripts/repoint-dossier-images-to-webp.mjs dev
//   node --env-file=.env.local scripts/repoint-dossier-images-to-webp.mjs dev --apply
//
// Default is a read-only report. Nothing is written without --apply.
//
// WHY THIS EXISTS. A car page is a database row, and `heroImageUrl` / `images`
// on that row store an image path as plain data. The WebP pass in the
// SEO/perf branch re-encoded public/cars/*.jpg to .webp and deleted the
// originals — which fixed every reference in src/, because those are code and
// grep finds them, and silently broke the ones held in the database, because
// those are data and grep does not. Two Active Maybach dossiers pointed at
// five .jpg files that no longer exist, so their hero and gallery images
// 404'd the moment the branch deployed.
//
// The rewrite is deliberately conservative:
//   * only local paths (an absolute http(s) URL is an R2 upload, left alone)
//   * only when the .webp replacement actually exists on disk
//   * the row is written back only if something in it changed
// so a second run reports zero changes rather than doing damage.
//
// SEQUENCING. The files ship with the deploy and the rows live in the
// database, so the two cannot switch over at the same instant. Run this
// immediately AFTER the deploy for an environment is live: the window where a
// row still names a .jpg that has already gone is then a minute or so on two
// car pages, rather than indefinite.

import { existsSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/**
 * The .webp that replaced a local raster path, or null to leave it as it is.
 * Returns null for absolute URLs, for paths that still exist, and for any path
 * whose .webp replacement is not actually on disk.
 */
function webpReplacement(value) {
  if (typeof value !== "string" || !value) return null;
  if (/^https?:/i.test(value)) return null;
  if (!/\.(jpe?g|png)$/i.test(value)) return null;

  const rel = value.startsWith("/") ? value : `/${value}`;
  if (existsSync(path.join(PUBLIC_DIR, rel))) return null;

  const candidate = rel.replace(/\.(jpe?g|png)$/i, ".webp");
  if (!existsSync(path.join(PUBLIC_DIR, candidate))) return null;

  return value.startsWith("/") ? candidate : candidate.slice(1);
}

async function run() {
  const [envName, ...flags] = process.argv.slice(2);
  const apply = flags.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/repoint-dossier-images-to-webp.mjs <${Object.keys(ENVS).join("|")}> [--apply]`,
    );
  }

  const connectionString = process.env[ENVS[envName]];
  if (!connectionString) fail(`${ENVS[envName]} is not set.`);

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  console.log(
    `\n${apply ? "Applying to" : "Checking"} ${envName} (${ENVS[envName]})\n`,
  );

  try {
    const { rows } = await client.query(
      'select id, slug, status, "heroImageUrl", images from specdossier',
    );

    let changedRows = 0;
    let changedPaths = 0;

    for (const row of rows) {
      const heroNext = webpReplacement(row.heroImageUrl);
      const images = Array.isArray(row.images) ? row.images : [];
      const imagesNext = images.map((u) => webpReplacement(u) ?? u);
      const imagesChanged = imagesNext.some((u, i) => u !== images[i]);

      if (!heroNext && !imagesChanged) continue;

      changedRows += 1;
      console.log(`  ${row.status}  ${row.slug}`);
      if (heroNext) {
        changedPaths += 1;
        console.log(`    hero    ${row.heroImageUrl}  →  ${heroNext}`);
      }
      imagesNext.forEach((u, i) => {
        if (u !== images[i]) {
          changedPaths += 1;
          console.log(`    img[${i}]  ${images[i]}  →  ${u}`);
        }
      });

      if (apply) {
        await client.query(
          'update specdossier set "heroImageUrl" = $1, images = $2 where id = $3',
          [heroNext ?? row.heroImageUrl, imagesNext, row.id],
        );
      }
    }

    if (changedRows === 0) {
      console.log("  Nothing to change — every local image path resolves.\n");
    } else {
      console.log(
        `\n${apply ? "✔ Updated" : "Would update"} ${changedPaths} path(s) across ${changedRows} dossier(s).${
          apply ? "" : "  Re-run with --apply to write."
        }\n`,
      );
    }
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
