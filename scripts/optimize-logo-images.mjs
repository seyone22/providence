// Re-encodes the brand-logo and country-flag folders to small WebP marks.
//
//   node scripts/optimize-logo-images.mjs --dry-run
//   node scripts/optimize-logo-images.mjs
//   node scripts/optimize-logo-images.mjs --width 192
//
// This is the sibling of optimize-car-images.mjs, and it exists because logos
// are a different problem from photographs. Every file in public/car_logo and
// public/country was a 2000x2000 PNG, and every one of them is displayed at
// 88x88 — PageSpeed measured 4,353 KiB of wasted image bytes on the home page
// alone, most of it these two folders (4.57 MB + 2.69 MB on disk). The home
// page renders each mark TWICE, because the marquee duplicates its track to
// loop seamlessly, so the waste is doubled at request time.
//
// Two things happen here that the photo script does not do:
//
//  1. ALPHA IS PRESERVED. These are transparent marks sitting on white and on
//     photographs; flattening them onto a background would show. WebP keeps the
//     alpha channel, which is why this is not a JPEG pipeline.
//
//  2. FILENAMES ARE NORMALISED to kebab-case. The originals contain spaces and
//     inconsistent capitalisation ("Bentley Logo.png", "audi logo.png",
//     "land rover logo.png"), so every reference had to be percent-encoded in
//     the served HTML and no two were spelled the same way. Renaming is safe
//     because nothing builds these paths from a database value — they all go
//     through the explicit mapping in src/lib/logo-utils.ts or a hardcoded
//     array. The script prints the old -> new map so those call sites can be
//     updated in the same commit.
//
// Originals are replaced, not kept alongside: two copies of every mark in git
// is the thing this exists to avoid. SVGs are skipped — they are already
// resolution-independent and smaller than any raster we could produce.

import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const FOLDERS = ["public/car_logo", "public/country"];
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
/** 2x the 88px the marks are actually displayed at, so they stay crisp on a
 *  retina phone without paying for 2000px. */
const DEFAULT_WIDTH = 192;
const QUALITY = 82;

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

/** "Bentley Logo.png" -> "bentley-logo", "Trinidad and Tobago.png" -> "trinidad-and-tobago" */
function kebab(basename) {
  return basename
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const widthArg = args.indexOf("--width");
  const width =
    widthArg !== -1
      ? Number(args[widthArg + 1]) || DEFAULT_WIDTH
      : DEFAULT_WIDTH;

  let beforeTotal = 0;
  let afterTotal = 0;
  const renames = [];

  for (const folder of FOLDERS) {
    let files;
    try {
      files = await readdir(folder);
    } catch {
      console.error(`✖ Cannot read ${folder}`);
      continue;
    }

    console.log(
      `\n── ${folder} ${"─".repeat(Math.max(0, 56 - folder.length))}`,
    );

    for (const file of files.sort()) {
      const ext = path.extname(file).toLowerCase();
      if (!SOURCE_EXTENSIONS.has(ext)) continue;

      const from = path.join(folder, file);
      const before = (await stat(from)).size;
      const target = `${kebab(path.basename(file, ext))}.webp`;
      const to = path.join(folder, target);

      const buffer = await sharp(from)
        .resize({
          width,
          height: width,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, alphaQuality: 100 })
        .toBuffer();

      beforeTotal += before;
      afterTotal += buffer.length;
      renames.push([
        `${path.basename(folder)}/${file}`,
        `${path.basename(folder)}/${target}`,
      ]);

      const saved = Math.round((1 - buffer.length / before) * 100);
      console.log(
        `  ${file.padEnd(34)} ${kb(before).padStart(8)} -> ${kb(buffer.length).padStart(7)}  (-${saved}%)  ${target}`,
      );

      if (dryRun) continue;

      await sharp(buffer).toFile(to);
      if (path.resolve(from) !== path.resolve(to)) await unlink(from);
    }
  }

  console.log(
    `\n${dryRun ? "[dry run] " : ""}Total ${kb(beforeTotal)} -> ${kb(afterTotal)}  ` +
      `(saved ${kb(beforeTotal - afterTotal)}, -${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`,
  );

  console.log(`\nRename map (${renames.length} files) — update call sites:`);
  for (const [from, to] of renames) console.log(`  ${from}  ->  ${to}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
