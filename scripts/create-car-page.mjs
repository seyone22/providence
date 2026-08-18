// Create (or update) a car landing page — a spec dossier — from a JSON brief.
//
// Car pages live in the `specdossier` table, not in the repo, so they can't be
// added by committing a file. This script is the non-UI path: it takes a JSON
// brief, uploads any local images to R2, and upserts the dossier by slug.
//
//   node --env-file=.env.local scripts/create-car-page.mjs briefs/gr-yaris.json
//   node --env-file=.env.local scripts/create-car-page.mjs brief.json --dry-run
//   node --env-file=.env.local scripts/create-car-page.mjs brief.json --publish
//
// Flags:
//   --dry-run   validate and print the resolved record; touch nothing.
//   --publish   save with status "Active" (default is "Draft", so a page is
//               reviewed before it goes live).
//
// The brief format is documented in .claude/skills/car-landing-page/SKILL.md.

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import pg from "pg";

// The schema module is TypeScript with `@/` path aliases, which plain node
// can't resolve — so the one table this script writes is redeclared here.
// Keep in sync with `specDossiers` in src/db/schema.ts.
const specDossiers = pgTable("specdossier", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").default("").notNull(),
  trim: text("trim").default("").notNull(),
  condition: text("condition").default("New").notNull(),
  mileage: text("mileage").default("").notNull(),
  countryOfOrigin: text("countryOfOrigin").default("Japan").notNull(),
  engineConfig: text("engineConfig").default("").notNull(),
  displacement: text("displacement").default("").notNull(),
  maxPower: text("maxPower").default("").notNull(),
  maxTorque: text("maxTorque").default("").notNull(),
  transmission: text("transmission").default("").notNull(),
  fuelSystem: text("fuelSystem").default("Petrol").notNull(),
  steering: text("steering").default("RHD").notNull(),
  emissions: text("emissions").default("").notNull(),
  pricing: jsonb("pricing").notNull().default([]),
  exteriorColors: jsonb("exteriorColors").notNull().default([]),
  interiorColors: jsonb("interiorColors").notNull().default([]),
  upholstery: text("upholstery").default("").notNull(),
  infotainment: text("infotainment").default("").notNull(),
  features: text("features").array().notNull().default([]),
  searchTags: text("searchTags").array().notNull().default([]),
  heroImageUrl: text("heroImageUrl").default("").notNull(),
  images: text("images").array().notNull().default([]),
  customData: jsonb("customData").notNull().default([]),
  valuePoints: jsonb("valuePoints").notNull().default([]),
  slug: text("slug").default("").notNull(),
  notes: text("notes").default("").notNull(),
  status: text("status").default("Draft").notNull(),
  isUpcoming: boolean("isUpcoming").default(false).notNull(),
  expectedAvailability: text("expectedAvailability").default("").notNull(),
  newsSlug: text("newsSlug").default("").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

const IMAGE_CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function slugify(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeHex(input) {
  const raw = String(input || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(raw)) return `#${raw.toLowerCase()}`;
  return "#1a1a1a";
}

function normalizeColors(value, label) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(`"${label}" must be an array.`);
  return value.map((c, i) => {
    if (!c || typeof c !== "object" || !c.name) {
      fail(`"${label}[${i}]" needs at least a "name".`);
    }
    return {
      name: String(c.name).trim(),
      hex: normalizeHex(c.hex),
      hex2: normalizeHex(c.hex2 ?? "#f5f5f5"),
      isDualTone: c.isDualTone === true,
      secondaryName: c.secondaryName ? String(c.secondaryName).trim() : "",
    };
  });
}

function normalizePricing(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail('"pricing" must be an array.');
  return value.map((p, i) => {
    const amount = Number(p?.amount);
    if (!p?.country || !p?.currency || !Number.isFinite(amount)) {
      fail(`"pricing[${i}]" needs country, currency and a numeric amount.`);
    }
    return {
      country: String(p.country),
      currency: String(p.currency).toUpperCase(),
      amount,
      type: String(p.type || "CIF"),
    };
  });
}

function normalizePairs(value, label, keyA, keyB) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(`"${label}" must be an array.`);
  return value.map((entry, i) => {
    if (!entry?.[keyA]) fail(`"${label}[${i}]" needs a "${keyA}".`);
    return {
      [keyA]: String(entry[keyA]),
      [keyB]: String(entry[keyB] ?? ""),
    };
  });
}

/** Uploads one local file to R2 and returns its public URL. */
async function uploadImage(r2, bucket, publicUrl, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = IMAGE_CONTENT_TYPES[ext];
  if (!contentType) {
    fail(
      `Unsupported image type "${ext}" (${filePath}). Use jpg, png, webp, avif or gif.`,
    );
  }

  const body = await fs.readFile(filePath).catch(() => {
    fail(`Could not read image: ${filePath}`);
  });

  const key = `dossiers/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

/**
 * Resolves the brief's `images` into public URLs.
 *
 * Entries that already look like URLs pass straight through — that covers
 * imagery hosted elsewhere. Anything else is treated as a path relative to the
 * brief's own directory and uploaded to R2.
 */
async function resolveImages(brief, briefDir) {
  const entries = Array.isArray(brief.images) ? brief.images : [];
  if (entries.length === 0) return [];

  const local = entries.filter((e) => !/^https?:\/\//i.test(e));

  if (local.length === 0) return entries;

  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = process.env;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_ENDPOINT ||
    !bucket ||
    !publicUrl
  ) {
    fail(
      `${local.length} local image(s) need uploading, but R2 is not configured.\n` +
        "  Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME\n" +
        "  and R2_PUBLIC_URL, or list image URLs in the brief instead.",
    );
  }

  const r2 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  const uploaded = [];
  for (const entry of local) {
    const abs = path.resolve(briefDir, entry);
    process.stdout.write(`  uploading ${path.basename(abs)} … `);
    const url = await uploadImage(r2, bucket, publicUrl, abs);
    console.log("done");
    uploaded.push(url);
  }

  // Preserve the brief's ordering — the first image is the default hero.
  const uploadedByOriginal = new Map(
    local.map((original, i) => [original, uploaded[i]]),
  );
  return entries.map((e) =>
    /^https?:\/\//i.test(e) ? e : uploadedByOriginal.get(e),
  );
}

async function run() {
  const args = process.argv.slice(2);
  const briefPath = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  const publish = args.includes("--publish");

  if (!briefPath) {
    fail(
      "Usage: node --env-file=.env.local scripts/create-car-page.mjs <brief.json> [--dry-run] [--publish]",
    );
  }

  const absBrief = path.resolve(process.cwd(), briefPath);
  const raw = await fs
    .readFile(absBrief, "utf8")
    .catch(() => fail(`Could not read brief: ${absBrief}`));

  let brief;
  try {
    brief = JSON.parse(raw);
  } catch (error) {
    fail(`Brief is not valid JSON: ${error.message}`);
  }

  if (!brief.make || !brief.model) {
    fail('A brief needs at least "make" and "model".');
  }

  const slug = slugify(
    brief.slug || `${brief.make} ${brief.model} ${brief.trim || ""}`,
  );
  if (!slug) fail("Could not derive a URL slug — set one explicitly.");

  const status = publish ? "Active" : brief.status || "Draft";
  if (status === "Active" && !slug) {
    fail("An Active car page must have a slug.");
  }

  const images = await resolveImages(brief, path.dirname(absBrief));
  const heroImageUrl =
    brief.heroImageUrl && images.includes(brief.heroImageUrl)
      ? brief.heroImageUrl
      : images[0] || "";

  const record = {
    make: String(brief.make),
    model: String(brief.model),
    year: String(brief.year ?? ""),
    trim: String(brief.trim ?? ""),
    condition: brief.condition === "Used" ? "Used" : "New",
    mileage: String(brief.mileage ?? ""),
    countryOfOrigin: String(brief.countryOfOrigin ?? "Japan"),
    engineConfig: String(brief.engineConfig ?? ""),
    displacement: String(brief.displacement ?? ""),
    maxPower: String(brief.maxPower ?? ""),
    maxTorque: String(brief.maxTorque ?? ""),
    transmission: String(brief.transmission ?? ""),
    fuelSystem: String(brief.fuelSystem ?? "Petrol"),
    steering: String(brief.steering ?? "RHD"),
    emissions: String(brief.emissions ?? ""),
    pricing: normalizePricing(brief.pricing),
    exteriorColors: normalizeColors(brief.exteriorColors, "exteriorColors"),
    interiorColors: normalizeColors(brief.interiorColors, "interiorColors"),
    upholstery: String(brief.upholstery ?? ""),
    infotainment: String(brief.infotainment ?? ""),
    features: Array.isArray(brief.features) ? brief.features.map(String) : [],
    searchTags: Array.isArray(brief.searchTags)
      ? brief.searchTags.map((t) => String(t).toLowerCase())
      : [],
    heroImageUrl,
    images,
    customData: normalizePairs(
      brief.customData,
      "customData",
      "label",
      "value",
    ),
    valuePoints: normalizePairs(
      brief.valuePoints,
      "valuePoints",
      "title",
      "description",
    ),
    slug,
    notes: String(brief.notes ?? ""),
    status,
    isUpcoming: brief.isUpcoming === true,
    expectedAvailability: String(brief.expectedAvailability ?? ""),
    newsSlug: slugify(brief.newsSlug || ""),
    updatedAt: new Date(),
  };

  if (dryRun) {
    console.log("\n--dry-run — nothing written. Resolved record:\n");
    console.log(JSON.stringify(record, null, 2));
    console.log(`\nPublic URL would be: /b2c/gallery/${slug}`);
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) fail("Missing DATABASE_URL.");

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    max: 1,
    ssl:
      databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });
  const db = drizzle(pool);

  try {
    // Upsert by slug so re-running a brief edits the same page rather than
    // creating a duplicate — briefs get iterated on.
    const [existing] = await db
      .select({ id: specDossiers.id })
      .from(specDossiers)
      .where(eq(specDossiers.slug, slug))
      .limit(1);

    let id;
    if (existing) {
      await db
        .update(specDossiers)
        .set(record)
        .where(eq(specDossiers.id, existing.id));
      id = existing.id;
      console.log(`\n✔ Updated existing car page (${id})`);
    } else {
      id = crypto.randomUUID();
      await db
        .insert(specDossiers)
        .values({ ...record, id, createdAt: new Date() });
      console.log(`\n✔ Created car page (${id})`);
    }

    console.log(`  Status: ${record.status}`);
    console.log(`  URL:    /b2c/gallery/${slug}`);
    if (record.status !== "Active") {
      console.log(
        "\n  Still a Draft — review it in /admin/specs, then set it Active",
      );
      console.log("  (or re-run with --publish).");
    }
    if (record.newsSlug) {
      console.log(`  Linked to article: /latest-news/${record.newsSlug}`);
    }
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
