// Blur number plates (or any other region) out of a vehicle photograph.
//
// Registration plates identify a real owner, so any image we publish on a car
// page needs them obscured — press shots usually arrive clean, street and
// auction photography does not.
//
//   node scripts/blur-plates.mjs in.jpg out.jpg 116,350,120,65
//   node scripts/blur-plates.mjs in.jpg out.jpg 116,350,120,65 900,540,220,70
//   node scripts/blur-plates.mjs in.jpg --inspect        # print dimensions only
//
// Each region is `x,y,w,h` in pixels against the INPUT image's own dimensions.
// Regions are clamped to the image bounds, so a slightly generous box is safer
// than a tight one — a plate that is still readable at full resolution has not
// been redacted.

import path from "node:path";
import sharp from "sharp";

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Parses "x,y,w,h" into a rect, rejecting anything non-numeric. */
function parseRect(spec) {
  const parts = spec.split(",").map((n) => Number(n.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    fail(`Region "${spec}" must be four numbers: x,y,w,h`);
  }
  const [x, y, w, h] = parts;
  if (w <= 0 || h <= 0)
    fail(`Region "${spec}" needs a positive width and height`);
  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  };
}

/** Keeps a rect inside the image, so a generous box can't throw. */
function clamp(rect, width, height) {
  const x = Math.max(0, Math.min(rect.x, width - 1));
  const y = Math.max(0, Math.min(rect.y, height - 1));
  return {
    left: x,
    top: y,
    width: Math.max(1, Math.min(rect.w, width - x)),
    height: Math.max(1, Math.min(rect.h, height - y)),
  };
}

const [input, output, ...rectSpecs] = process.argv.slice(2);

if (!input) {
  fail(
    "Usage: node scripts/blur-plates.mjs <input> <output> x,y,w,h [x,y,w,h ...]",
  );
}

const meta = await sharp(input).metadata();

if (output === "--inspect" || rectSpecs.length === 0) {
  console.log(`${path.basename(input)}: ${meta.width}x${meta.height}`);
  if (rectSpecs.length === 0 && output !== "--inspect") {
    fail("No regions given — pass at least one x,y,w,h");
  }
  process.exit(0);
}

const regions = rectSpecs
  .map(parseRect)
  .map((r) => clamp(r, meta.width, meta.height));

// Blur each region on its own and composite the results back over the
// original. Blurring the whole frame and masking would soften the car too.
const patches = await Promise.all(
  regions.map(async (region) => ({
    input: await sharp(input)
      .extract(region)
      // Sigma scales with the plate's own size so a large plate is redacted as
      // thoroughly as a small one.
      .blur(Math.max(12, Math.round(region.width / 6)))
      .toBuffer(),
    left: region.left,
    top: region.top,
  })),
);

await sharp(input).composite(patches).jpeg({ quality: 88 }).toFile(output);

console.log(
  `${path.basename(input)} → ${path.basename(output)}  (${meta.width}x${meta.height}, ${regions.length} region${regions.length === 1 ? "" : "s"} blurred)`,
);
