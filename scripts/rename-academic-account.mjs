import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local"), quiet: true });
const apply = process.argv.includes("--apply");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } });
const db = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });

let authBefore;
let authChanged = false;
let transactionStarted = false;
try {
  const { data: profiles, error } = await sb.from("profiles").select("*").eq("role", "ofm");
  if (error) throw error;
  const candidates = profiles.filter(p => ["finance@au.edu", "academic@au.edu"].includes(p.email.toLowerCase()));
  if (candidates.length !== 1) throw new Error("Expected exactly one central office demo profile; no changes made.");
  const profile = candidates[0];
  const authResult = await sb.auth.admin.getUserById(profile.id);
  if (authResult.error) throw authResult.error;
  authBefore = authResult.data.user;
  if (!["finance@au.edu", "academic@au.edu"].includes(authBefore.email?.toLowerCase())) {
    throw new Error("Demo profile and authentication identity do not match; no changes made.");
  }
  await db.connect();
  const functions = await db.query(`select oid::regprocedure::text as signature, pg_get_functiondef(oid) as definition
    from pg_proc where oid in ('public.guard_r3_r4_application_update()'::regprocedure,
      'public.transition_r3_r4_application(uuid,text,text,text)'::regprocedure)`);
  if (functions.rows.length !== 2) throw new Error("Required workflow functions were not found.");
  console.log(`${apply ? "Applying" : "Dry run"}: rename central demo account to academic@au.edu; preserve ID ${profile.id} and password.`);
  console.log(`Academic role profiles: ${profiles.length}; workflow functions: ${functions.rows.length}; permission key remains ofm.`);
  if (apply) {
    const backupDir = path.join(root, "private-backups", "academic-office-rename");
    await mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
    await writeFile(backupPath, JSON.stringify({ profiles, auth: { id: authBefore.id, email: authBefore.email,
      user_metadata: authBefore.user_metadata }, functions: functions.rows }, null, 2));
    await db.query("begin");
    transactionStarted = true;
    const sql = await readFile(path.join(root, "supabase/migrations/0031_rename_finance_office_to_academic.sql"), "utf8");
    await db.query(sql);
    const next = await sb.auth.admin.updateUserById(profile.id, {
      email: "academic@au.edu", email_confirm: true,
      user_metadata: { ...authBefore.user_metadata, full_name: "Academic Test", faculty: "Academic Office", department: "Academic" },
    });
    if (next.error) throw next.error;
    authChanged = true;
    // auth.users.email and profiles.email are both updated for the same UUID.
    await db.query("update public.profiles set email = $1 where id = $2 and role::text = 'ofm'", ["academic@au.edu", profile.id]);
    await db.query("commit");
    transactionStarted = false;
    console.log("Academic account and backend wording updated. Recovery snapshot saved locally (Git-ignored).");
  }
} catch (error) {
  if (transactionStarted) await db.query("rollback").catch(() => {});
  if (authChanged) {
    const restored = await sb.auth.admin.updateUserById(authBefore.id, {
      email: authBefore.email, email_confirm: true, user_metadata: authBefore.user_metadata,
    });
    if (restored.error) console.error("Account rollback needs attention; use the local recovery snapshot.");
  }
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await db.end().catch(() => {});
}
