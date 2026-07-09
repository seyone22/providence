import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}

async function run() {
  console.log("Connecting to PostgreSQL...");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const db = drizzle(pool);

  console.log("Applying migrations from ./drizzle...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully! 🎉");
  } catch (error) {
    console.error("Migration failed:", error);
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log("Database connection closed.");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
