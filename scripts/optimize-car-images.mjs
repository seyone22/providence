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

import {
  readdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// .webp is included so an already-converted folder can be re-encoded in place
// when the target width changes; see the inPlace handling in the loop below.
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
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
    // A .webp source re-encodes onto its own path. Everything below therefore
    // goes through a buffer and only unlinks when the name actually changed —
    // streaming sharp straight back into the file it is reading truncates it.
    const inPlace = path.resolve(from) === path.resolve(to);

    const originalSize = (await stat(from)).size;
    // withoutEnlargement: a source already narrower than the target is
    // re-encoded at its own size rather than upscaled into softness.
    // The source is read into memory rather than handed to sharp as a path.
    // libvips keeps a cached file descriptor on any path it opens, so an
    // in-place re-encode would still be holding the file when we try to write
    // it back — EPERM on Windows. A buffer has no descriptor to hold.
    const buffer = await sharp(await readFile(from))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    // Re-encoding an already-optimised WebP can come out bigger than the
    // original. Keep whichever is smaller rather than regressing the file.
    if (inPlace && buffer.length >= originalSize) {
      before += originalSize;
      after += originalSize;
      console.log(
        `  ${name}   ${kb(originalSize)} → unchanged (already smaller)`,
      );
      continue;
    }

    // Write to a sibling temp file and rename over the target. Renaming is
    // atomic, so an interrupted run can never leave a half-written image, and
    // on Windows it avoids the EBUSY/UNKNOWN you get from opening a path for
    // writing while sharp still holds a read handle on it.
    const tmp = `${to}.tmp`;
    await writeFile(tmp, buffer);
    if (!inPlace) await unlink(from);
    await rename(tmp, to);
    const newSize = buffer.length;

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
