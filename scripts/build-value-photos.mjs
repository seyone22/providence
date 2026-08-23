/**
 * Builds the six /about-us values photos into static, pre-sized WebPs.
 *
 * Why these are not served through next/image:
 *
 *   Cloudflare returns `cf-cache-status: DYNAMIC` for /_next/image, so every
 *   optimised image travels to Railway on every request, for every visitor,
 *   forever. Measured against the live site on 2026-08-23, a 362-byte 32w
 *   thumbnail took 613ms TTFB from a desktop connection — that number is
 *   round-trip, not payload, so the real photos pay it too and a phone pays
 *   more. Six of them in one horizontal scroller is why the last cards in the
 *   row arrived late and stuttered as you reached them.
 *
 *   Anything under public/ is a static asset and comes back
 *   `cf-cache-status: REVALIDATED` — served from the edge. So the sizes the
 *   layout actually needs are generated here, once, and committed. The page
 *   then uses a plain <img srcset> pointing at them.
 *
 * Widths follow the two layouts the row has:
 *   280px card below lg  -> 560w covers 2x
 *   410px card in the lg 3-up grid, and 3x phones -> 840w
 *
 * Also re-emits the 8x10 LQIP data URLs that the cards paint as a background
 * while the photo is in flight (see --fan-lqip in globals.css). Paste the
 * printed values into VALUES in src/app/(marketing)/about-us/page.tsx.
 *
 * The value-<name>.jpg masters stay in public/about/ but nothing links them —
 * the page only ever requests the -560/-840 WebPs generated here.
 *
 * Run after replacing any source photo in public/about/:
 *   node scripts/build-value-photos.mjs
 */
import { statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "public", "about");

const NAMES = [
  "trust",
  "reliability",
  "transparency",
  "commitment",
  "honesty",
  "relationship",
];

// 4:5, matching the card. `cover` centre-crops, which is what object-cover
// would have done in the browser — so nothing is lost by cropping here, and
// the pixels that would have been thrown away are never sent.
const WIDTHS = [560, 840];
const QUALITY = 74;

const kb = (n) => `${(n / 1024).toFixed(1)}kB`;

let totalBefore = 0;
let total560 = 0;

for (const name of NAMES) {
  const source = join(DIR, `value-${name}.jpg`);
  totalBefore += statSync(source).size;
  const line = [`value-${name}`.padEnd(20)];

  for (const width of WIDTHS) {
    const out = join(DIR, `value-${name}-${width}.webp`);
    const buf = await sharp(source)
      .resize(width, Math.round((width * 5) / 4), { fit: "cover" })
      .webp({ quality: QUALITY })
      .toBuffer();
    writeFileSync(out, buf);
    if (width === 560) total560 += buf.length;
    line.push(`${width}w ${kb(buf.length).padStart(8)}`);
  }

  const lqip = await sharp(source)
    .resize(8, 10, { fit: "cover" })
    .webp({ quality: 40 })
    .toBuffer();
  line.push(`lqip ${String(lqip.length).padStart(3)}B`);
  console.log(line.join("   "));
  console.log(`    data:image/webp;base64,${lqip.toString("base64")}`);
}

console.log(
  `\nsource JPGs ${kb(totalBefore)} -> 560w set ${kb(total560)} (what a phone downloads)`,
);
