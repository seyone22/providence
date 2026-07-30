import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Global cached pool connection to avoid leaking pools on hot reload in
// development, and to avoid a second pool if the module gets instantiated more
// than once in the same server process in production.
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    // Without this, a saturated pool makes `pool.connect()` wait forever: the
    // RSC render for an admin page never resolves, so the navigation hangs on
    // the loading spinner with no error and no timeout. Failing after 10s lets
    // the error boundary actually show something.
    connectionTimeoutMillis: 10_000,
    // Hand idle clients back to Postgres instead of holding them for the life
    // of the process — Railway's connection limit is shared across replicas.
    idleTimeoutMillis: 30_000,
  });

// node-postgres emits `error` on *idle* clients (server restart, Railway
// failover, network blip). With no listener that is an unhandled 'error' event
// and it takes the whole Node process down.
pool.on("error", (err) => {
  console.error("[db] idle client error:", err);
});

globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
export * from "./schema";
