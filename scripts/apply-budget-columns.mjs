// Adds the inquiry-form budget columns to one environment's database.
//
// These are the columns from drizzle/0003_budget_columns.sql. They're applied
// with this script rather than scripts/migrate.mjs because the drizzle
// migrator is currently unusable: migration 0001 is listed in
// drizzle/meta/_journal.json but its .sql file was never committed, so
// readMigrationFiles throws before any SQL runs.
//
//   node --env-file=.env.local scripts/apply-budget-columns.mjs dev
//   node --env-file=.env.local scripts/apply-budget-columns.mjs dev --apply
//
// Default is a read-only check. Nothing is written without --apply.
//
// Both statements are ADD COLUMN IF NOT EXISTS on nullable columns, so
// applying twice is a no-op and applying before the deploy is harmless.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const COLUMNS = [
  ["request", "budgetAmount"],
  ["request", "budgetCurrency"],
];

const STATEMENTS = [
  `ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "budgetAmount" double precision`,
  `ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "budgetCurrency" text`,
];

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Which of the columns already exist. */
async function present(pool) {
  const { rows } = await pool.query(
    `SELECT table_name, column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND (table_name, column_name) IN (${COLUMNS.map(
       (_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`,
     ).join(", ")})`,
    COLUMNS.flat(),
  );
  return new Set(rows.map((r) => `${r.table_name}.${r.column_name}`));
}

function report(found) {
  for (const [table, column] of COLUMNS) {
    const key = `${table}.${column}`;
    console.log(`  ${found.has(key) ? "✔" : "·"} ${key}`);
  }
  console.log(`\n  ${found.size}/${COLUMNS.length} present`);
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/apply-budget-columns.mjs <${Object.keys(
        ENVS,
      ).join("|")}> [--apply]`,
    );
  }

  const varName = ENVS[envName];
  const connectionString = process.env[varName];
  if (!connectionString) {
    fail(`${varName} is not set. Add it to .env.local (or export it).`);
  }

  // Show which host is about to be touched — the guard against running
  // production changes while thinking you're on dev.
  const host = connectionString.replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`\nEnvironment : ${envName}  (${varName})`);
  console.log(`Host        : ${host}`);
  console.log(
    `Mode        : ${apply ? "APPLY (writes)" : "check (read-only)"}`,
  );

  const pool = new pg.Pool({
    connectionString,
    max: 1,
    ssl:
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  try {
    console.log("\nBefore:");
    const before = await present(pool);
    report(before);

    if (!apply) {
      if (before.size < COLUMNS.length) {
        console.log("\n  Re-run with --apply to add the missing columns.");
      } else {
        console.log("\n  Nothing to do — this environment is ready.");
      }
      return;
    }

    if (before.size === COLUMNS.length) {
      console.log("\n✔ Already applied. No changes made.");
      return;
    }

    // Both or neither: a lead written with an amount but no currency column is
    // a lead nobody can act on.
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const statement of STATEMENTS) {
        await client.query(statement);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    console.log("\nAfter:");
    const after = await present(pool);
    report(after);

    if (after.size !== COLUMNS.length) {
      fail("Some columns are still missing — do not deploy this environment.");
    }
    console.log(`\n✔ ${envName} is ready. Safe to deploy the branch to it.`);
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
