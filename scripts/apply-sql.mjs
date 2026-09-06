

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.SUPABASE_DB_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error(
    "\n✗ SUPABASE_DB_URL is missing or still contains [YOUR-PASSWORD].\n" +
      "  Put the real Postgres password into .env.local first.\n"
  );
  process.exit(1);
}

const dir = path.join(process.cwd(), "supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(path.join(dir, file), "utf8");
    process.stdout.write(`→ ${file} ... `);
    await client.query(sql);
    console.log("ok");
  }
  console.log("\n✓ All migrations applied to", url.replace(/:[^:@]+@/, ":****@"));
} catch (err) {
  console.error("\n✗ Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
