import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

if (!process.argv.includes("--confirm-delete-au-r1")) {
  throw new Error("Refusing to delete. Pass --confirm-delete-au-r1 to remove only AU-R1 applications.");
}

const databaseUrl = process.env.SUPABASE_DB_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!databaseUrl || !supabaseUrl || !serviceKey) {
  throw new Error("SUPABASE_DB_URL, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
const storage = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.resolve("private-backups", "au-r1-old-model-" + timestamp);
const filesDir = path.join(backupDir, "documents");
fs.mkdirSync(filesDir, { recursive: true });

const relatedTables = [
  "application_collaborators", "application_documents", "application_events", "approvals", "contracts",
  "expert_assignments", "payments", "reports", "reviews", "screenings",
];

await client.connect();
try {
  const applicationsResult = await client.query("select * from applications where grant_type = $1 order by created_at, id", ["au_r1"]);
  const applications = applicationsResult.rows;
  const ids = applications.map((application) => application.id);
  if (!ids.length) {
    console.log("No AU-R1 applications were found. Nothing was deleted.");
    process.exitCode = 0;
  } else {
    const backup = { exportedAt: new Date().toISOString(), grantType: "au_r1", applications, related: {} };
    for (const table of relatedTables) {
      const result = await client.query(`select * from ${table} where application_id = any($1::uuid[])`, [ids]);
      backup.related[table] = result.rows;
    }
    fs.writeFileSync(path.join(backupDir, "database-records.json"), JSON.stringify(backup, null, 2), "utf8");

    const documents = backup.related.application_documents || [];
    let downloaded = 0;
    const downloadErrors = [];
    for (let index = 0; index < documents.length; index += 1) {
      const document = documents[index];
      if (!document.storage_path) continue;
      const result = await storage.storage.from("documents").download(document.storage_path);
      if (result.error || !result.data) {
        downloadErrors.push({ storagePath: document.storage_path, error: result.error?.message || "Download failed" });
        continue;
      }
      const safeName = String(document.name || path.basename(document.storage_path) || "document")
        .replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
      const fileName = String(index + 1).padStart(3, "0") + "-" + safeName;
      fs.writeFileSync(path.join(filesDir, fileName), Buffer.from(await result.data.arrayBuffer()));
      downloaded += 1;
    }
    fs.writeFileSync(path.join(backupDir, "download-errors.json"), JSON.stringify(downloadErrors, null, 2), "utf8");

    await client.query("begin");
    const deleted = await client.query("delete from applications where grant_type = $1 returning id", ["au_r1"]);
    if (deleted.rowCount !== applications.length) {
      throw new Error(`Expected to delete ${applications.length} AU-R1 applications but deleted ${deleted.rowCount}.`);
    }
    await client.query("commit");

    const storagePaths = documents.map((document) => document.storage_path).filter(Boolean);
    let removedStorage = 0;
    const storageErrors = [];
    for (let index = 0; index < storagePaths.length; index += 100) {
      const batch = storagePaths.slice(index, index + 100);
      const result = await storage.storage.from("documents").remove(batch);
      if (result.error) storageErrors.push(result.error.message);
      else removedStorage += (result.data || []).length;
    }

    const remaining = await client.query("select count(*)::int as count from applications where grant_type = $1", ["au_r1"]);
    console.log(JSON.stringify({
      deletedApplications: deleted.rowCount,
      backedUpDocuments: downloaded,
      documentBackupErrors: downloadErrors.length,
      removedStorageObjects: removedStorage,
      storageRemovalErrors: storageErrors,
      remainingAuR1Applications: remaining.rows[0].count,
      backupDirectory: backupDir,
    }, null, 2));
  }
} catch (error) {
  try { await client.query("rollback"); } catch {}
  throw error;
} finally {
  await client.end();
}
