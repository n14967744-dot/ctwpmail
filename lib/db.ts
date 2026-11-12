import "server-only";
import { neon } from "@neondatabase/serverless";

/* Neon Postgres over HTTPS. The connection string lives only in the DATABASE_URL env var. */

let client: ReturnType<typeof neon> | null | undefined;

function sql() {
  if (client === undefined) {
    const url = process.env.DATABASE_URL;
    client = url ? neon(url, { fetchOptions: { cache: "no-store" } }) : null;
  }
  return client;
}

/** Run one parameterized statement. Returns the rows, or null when there is no database or the query failed. Never throws. */
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[] | null> {
  const run = sql();
  if (!run) return null;
  try {
    return (await run.query(text, params)) as T[];
  } catch (e) {
    console.error(`[db] ${e instanceof Error ? `${e.name}: ${e.message}` : "query failed"}`);
    return null;
  }
}
