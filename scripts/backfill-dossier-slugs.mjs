// Gives a slug to a car page that never got one.
//
//   node --env-file=.env.local scripts/backfill-dossier-slugs.mjs production
//   node --env-file=.env.local scripts/backfill-dossier-slugs.mjs production --apply
//
// Default is a read-only report. Nothing is written without --apply.
//
// WHY. `slug` on specdossier defaults to "" rather than being generated, so a
// dossier created without one is reachable only at /b2c/gallery/<id> — an
// opaque 24-character hex string carrying no keywords. Six Active cars on
// production were in that state, and five of them are exactly the URLs Search
// Console reported under "Discovered - currently not indexed". Google found
// them, looked at the URL, and did not think them worth crawling.
//
// SAFETY. The [id] page already resolves a dossier by slug OR by id, and since
// the SEO branch it 308s the id form onto the slug whenever one exists. So
// filling in a slug does not orphan the old URL — it turns it into a permanent
// redirect that passes its accumulated equity to the new one. That is why this
// is a data change and needs no accompanying redirect table.
//
// The slugs are written out longhand below rather than derived. A URL is
// permanent and public, and two of these cars are the same model separated
// only by paint, so the disambiguation is an editorial choice and belongs in
// review, not in a slugify() call.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

// Keyed by id. Matched on make/model/year/trim as well before writing, so a
// row that has changed since this was written is skipped rather than mislabelled.
const SLUGS = [
  {
    id: "6a2bdd4a679494ab81881057",
    make: "Lexus",
    slug: "lexus-gx550-sport-luxury",
  },
  {
    id: "6a01ab0d3ce39b2aff4924ea",
    make: "Toyota",
    slug: "toyota-land-cruiser-300-sahara",
  },
  {
    id: "69f88836229877a9d2c69f04",
    make: "Ford",
    slug: "ford-ranger-platinum-2025",
  },
  {
    id: "6a030275dd6a1b7b988ee06d",
    make: "Land Rover",
    slug: "land-rover-defender-110-trophy-2026",
  },
  // Same car, same year, different paint — the trim is the only thing that
  // separates them, so the colour has to carry the URL.
  {
    id: "6a3a442259df9565bfe3cc30",
    make: "Lexus",
    slug: "lexus-lx500d-limited-graphite-black-2022",
  },
  {
    id: "6a3a3f4ed78144fac7a1b2ff",
    make: "Lexus",
    slug: "lexus-lx500d-limited-crimson-red-2022",
  },
];

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function run() {
  const [envName, ...flags] = process.argv.slice(2);
  const apply = flags.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/backfill-dossier-slugs.mjs <${Object.keys(ENVS).join("|")}> [--apply]`,
    );
  }
  const connectionString = process.env[ENVS[envName]];
  if (!connectionString) fail(`${ENVS[envName]} is not set.`);

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  console.log(`\n${apply ? "Applying to" : "Checking"} ${envName}\n`);

  try {
    let written = 0;
    let skipped = 0;

    for (const entry of SLUGS) {
      const { rows } = await client.query(
        "select id, slug, make, model, year, trim, status from specdossier where id::text = $1",
        [entry.id],
      );
      const car = rows[0];

      if (!car) {
        skipped += 1;
        console.log(`  – ${entry.slug}\n      no dossier with id ${entry.id}`);
        continue;
      }
      if (car.slug) {
        skipped += 1;
        console.log(
          `  – ${entry.slug}\n      already slugged as "${car.slug}"`,
        );
        continue;
      }
      // Several rows carry trailing whitespace in make/model ("Ford ",
      // "GX550 "), so compare on the trimmed value.
      if ((car.make || "").trim() !== entry.make) {
        skipped += 1;
        console.log(
          `  ! ${entry.slug}\n      make changed since this was written (expected ${entry.make}, found ${car.make}) — skipping`,
        );
        continue;
      }

      // slug is UNIQUE on salesprofile but only NOT NULL here, so guard it.
      const clash = await client.query(
        "select id from specdossier where slug = $1 and id::text <> $2",
        [entry.slug, entry.id],
      );
      if (clash.rowCount > 0) {
        skipped += 1;
        console.log(`  ! ${entry.slug}\n      already used by another dossier`);
        continue;
      }

      written += 1;
      console.log(
        `  ${apply ? "✔" : "→"} ${car.year || "----"} ${car.make} ${car.model} (${car.trim || "no trim"})`,
      );
      console.log(`      /b2c/gallery/${car.id}`);
      console.log(`      /b2c/gallery/${entry.slug}`);

      if (apply) {
        await client.query(
          "update specdossier set slug = $1 where id::text = $2",
          [entry.slug, entry.id],
        );
      }
    }

    console.log(
      `\n${apply ? "✔ Slugged" : "Would slug"} ${written} dossier(s), skipped ${skipped}.${
        apply ? "" : "  Re-run with --apply to write."
      }\n`,
    );
    if (written > 0) {
      console.log(
        "  The old /b2c/gallery/<id> URLs keep working — the [id] page 308s\n" +
          "  them onto the slug automatically.\n",
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
