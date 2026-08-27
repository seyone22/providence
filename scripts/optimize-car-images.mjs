// Re-encodes a folder of car photographs to WebP at a sensible display width.
//
//   node scripts/optimize-car-images.mjs public/cars/nissan-patrol-y63
//   node scripts/optimize-car-images.mjs public/cars/nissan-patrol-y63 --width 1600
//
// Car pages under public/ are served as plain <img> tags, so nothing resizes
// them at request time — /_next/image is not in that path, and it is never
// edge-cached anyway. A 900 KB manufacturer JPEG is therefore 900 KB on every
// view of the page and 900 KB in the repository forever. WebP at width 1600
// typically lands the same photograph inside 150 KB with no visible loss at
// the sizes the gallery actually renders.
//
// Originals are replaced, not kept alongside: two copies of every shot in git
// is the thing this exists to avoid.

import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const DEFAULT_WIDTH = 1600;
const QUALITY = 82;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function run() {
  const args = process.argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  const widthArg = args.indexOf("--width");
  const width =
    widthArg !== -1
      ? Number(args[widthArg + 1]) || DEFAULT_WIDTH
      : DEFAULT_WIDTH;

  if (!dir) {
    fail(
      "Usage: node scripts/optimize-car-images.mjs <directory> [--width 1600]",
    );
  }

  const entries = (await readdir(dir)).filter((name) =>
    SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase()),
  );

  if (entries.length === 0) {
    console.log(`Nothing to do — no JPEG or PNG files in ${dir}.`);
    return;
  }

  let before = 0;
  let after = 0;

  for (const name of entries) {
    const from = path.join(dir, name);
    const to = path.join(dir, `${path.parse(name).name}.webp`);

    const originalSize = (await stat(from)).size;
    // withoutEnlargement: a source already narrower than the target is
    // re-encoded at its own size rather than upscaled into softness.
    await sharp(from)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(to);
    const newSize = (await stat(to)).size;

    await unlink(from);

    before += originalSize;
    after += newSize;
    console.log(
      `  ${name} → ${path.basename(to)}   ${kb(originalSize)} → ${kb(newSize)}`,
    );
  }

  const saved = Math.round((1 - after / before) * 100);
  console.log(
    `\n✔ ${entries.length} image(s): ${kb(before)} → ${kb(after)}  (${saved}% smaller)`,
  );
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
