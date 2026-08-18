/**
 * Generates the equirectangular land mask used by <DotGlobe /> and <DotWorldMap />.
 *
 * Stripe's globe tests each dot against a PNG of the world and reads the pixel
 * back with getImageData; this script produces that PNG. Land is white, ocean is
 * black, so the runtime test is a single channel compare.
 *
 * Source is Natural Earth 110m land via the world-atlas package on jsDelivr —
 * public domain, ~100KB of TopoJSON. We decode it here rather than at runtime so
 * the site ships one small PNG and zero geo dependencies.
 *
 *   node scripts/generate-land-mask.mjs
 *
 * Only re-run this if you want a different resolution; the output is committed.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";
const WIDTH = 2048;
const HEIGHT = 1024;
const OUT = path.join(process.cwd(), "public", "globe", "land-mask.png");

/**
 * Decodes TopoJSON's delta-encoded, quantized arcs back into absolute [lng, lat]
 * pairs. TopoJSON stores each arc as a starting point followed by deltas, all in
 * integer quantum space; `transform` carries the scale/translate back to degrees.
 */
function decodeArcs(topology) {
  const { scale, translate } = topology.transform;
  return topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/**
 * Stitches a ring's arc indices into one coordinate list. A negative index means
 * "arc ~i, reversed"; the shared endpoint between consecutive arcs is dropped so
 * the ring has no duplicate vertices.
 */
function ringToCoords(ringIndices, arcs) {
  const coords = [];
  for (const index of ringIndices) {
    const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
    coords.push(...(coords.length ? arc.slice(1) : arc));
  }
  return coords;
}

/**
 * Removes antimeridian wrap-around from a ring.
 *
 * Source longitudes are all in [-180, 180], so a ring that straddles the date
 * line (Chukotka, Fiji, Antarctica) contains a ~360 degree jump. Projected
 * naively that jump draws a horizontal band clean across the map. Accumulating
 * an offset whenever a step exceeds 180 degrees makes the ring continuous
 * again — at the cost of pushing part of it outside [-180, 180], which the
 * three-copy render below puts back on screen.
 */
function unwrapRing(coords) {
  const out = [coords[0].slice()];
  let offset = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const step = coords[i][0] - coords[i - 1][0];
    if (step > 180) offset -= 360;
    else if (step < -180) offset += 360;
    out.push([coords[i][0] + offset, coords[i][1]]);
  }
  return out;
}

/** Equirectangular projection: the whole world onto WIDTH x HEIGHT pixels. */
function project([lng, lat]) {
  return [((lng + 180) / 360) * WIDTH, ((90 - lat) / 180) * HEIGHT];
}

const fmt = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;

/**
 * Turns one unwrapped ring into an SVG subpath.
 *
 * A ring spanning the full globe is Antarctica: the source data stops at
 * -85.6 degrees, so closing it directly draws a horizontal line along the
 * coast instead of filling the cap. Routing the closure along the bottom edge
 * of the canvas fills it to the pole.
 */
function ringToPath(coords) {
  const points = coords.map(project);
  const spansGlobe =
    Math.abs(coords[coords.length - 1][0] - coords[0][0]) > 350 ||
    Math.max(...coords.map((c) => c[0])) -
      Math.min(...coords.map((c) => c[0])) >
      350;
  const isPolar = coords.every(([, lat]) => lat < 0);

  const body = points.map(fmt).join("L");
  if (spansGlobe && isPolar) {
    const closure = [
      [points[points.length - 1][0], HEIGHT],
      [points[0][0], HEIGHT],
    ];
    return `M${body}L${closure.map(fmt).join("L")}Z`;
  }
  return `M${body}Z`;
}

async function main() {
  process.stdout.write(`Fetching ${SOURCE}\n`);
  const response = await fetch(SOURCE);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  const topology = await response.json();
  const arcs = decodeArcs(topology);

  // The `land` object is a GeometryCollection of Polygon/MultiPolygon geometries.
  const geometries = topology.objects.land.geometries;
  const paths = [];
  for (const geometry of geometries) {
    const polygons =
      geometry.type === "MultiPolygon" ? geometry.arcs : [geometry.arcs];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        const coords = ringToCoords(ring, arcs);
        if (coords.length < 3) continue;
        paths.push(ringToPath(unwrapRing(coords)));
      }
    }
  }

  // fill-rule="evenodd" makes interior rings (lakes) cut holes without us having
  // to care which way each ring winds.
  //
  // The same geometry is painted three times, shifted a full world left and
  // right, so the parts that unwrapRing pushed outside [-180, 180] reappear on
  // the opposite edge. These must be three separate <path> elements: merged into
  // one, evenodd would treat an overlap between two copies as a hole and punch
  // Antarctica back out.
  const d = paths.join("");
  const layer = (offset) =>
    `<path fill="#fff" fill-rule="evenodd" transform="translate(${offset},0)" d="${d}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<rect width="${WIDTH}" height="${HEIGHT}" fill="#000"/>
${layer(-WIDTH)}${layer(0)}${layer(WIDTH)}
</svg>`;

  // Threshold to pure black/white: the runtime only ever asks "is this pixel
  // land", and a 2-colour palette is ~8x smaller than antialiased greyscale.
  const png = await sharp(Buffer.from(svg))
    .greyscale()
    .threshold(128)
    .png({ palette: true, colours: 2, compressionLevel: 9 })
    .toBuffer();

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, png);
  process.stdout.write(
    `Wrote ${OUT} (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB, ${paths.length} rings)\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exit(1);
});
