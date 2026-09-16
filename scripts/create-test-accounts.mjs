import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const password = "123456789";
const faculties = [
  { code: "vmes", name: "Vincent Mary School of Engineering, Science and Technology", department: "Computer Science" },
  { code: "msme", name: "Martin de Tours School of Management and Economics", department: "Business Administration" },
  { code: "arts", name: "Theodore Maria School of Arts", department: "English" },
  { code: "comm", name: "Albert Laurence School of Communication Arts", department: "Advertising" },
  { code: "arch", name: "Montfort del Rosario School of Architecture and Design", department: "Architecture" },
  { code: "nurse", name: "Bernadette de Lourdes School of Nursing Science", department: "Nursing Science" },
  { code: "law", name: "School of Law", department: "Business Law" },
  { code: "biotech", name: "School of Biotechnology", department: "Food Technology" },
  { code: "music", name: "School of Music", department: "Music Performance" },
];

const accounts = faculties.flatMap(faculty => [
  { email: faculty.code + "researcher@au.edu", full_name: faculty.code.toUpperCase() + " Researcher Test", role: "researcher", faculty: faculty.name, department: faculty.department, name_title: "Dr." },
  { email: faculty.code + "dean@au.edu", full_name: faculty.code.toUpperCase() + " Dean Test", role: "dean", faculty: faculty.name, department: "Dean's Office", name_title: "Prof." },
  { email: faculty.code + "committee@au.edu", full_name: faculty.code.toUpperCase() + " Committee Test", role: "committee", faculty: faculty.name, department: "Faculty Committee", name_title: "Assoc. Prof." },
]).concat([
  { email: "felix@au.edu", full_name: "Felix Researcher", role: "researcher", faculty: "Vincent Mary School of Engineering, Science and Technology", department: "Information Technology", name_title: "Mr." },
  { email: "james@au.edu", full_name: "James Researcher", role: "researcher", faculty: "Vincent Mary School of Engineering, Science and Technology", department: "Information Technology", name_title: "Mr." },
  { email: "rassc@au.edu", full_name: "RASSC Test", role: "rassc", faculty: "Research Affairs", department: "RASSC", name_title: "" },
  { email: "iras@au.edu", full_name: "IRAS Test", role: "iras", faculty: "Research Affairs", department: "IRAS", name_title: "" },
  { email: "finance@au.edu", full_name: "Finance Test", role: "ofm", faculty: "Office of Financial Management", department: "Finance", name_title: "" },
  { email: "admin@au.edu", full_name: "Administrator Test", role: "admin", faculty: "Information Technology", department: "Administration", name_title: "" },
]);

const requestedEmails = new Set(process.argv.slice(2).map(email => email.trim().toLowerCase()).filter(Boolean));
const selectedAccounts = requestedEmails.size
  ? accounts.filter(account => requestedEmails.has(account.email.toLowerCase()))
  : accounts;
if (requestedEmails.size && selectedAccounts.length !== requestedEmails.size) {
  throw new Error("One or more requested test-account emails are not defined in this script.");
}

const listed = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listed.error) throw listed.error;
const existing = new Map(listed.data.users.map(user => [String(user.email || "").toLowerCase(), user]));
let created = 0;
let updated = 0;

for (const account of selectedAccounts) {
  let user = existing.get(account.email);
  const metadata = { full_name: account.full_name, role: account.role, faculty: account.faculty, department: account.department, name_title: account.name_title };
  if (user) {
    const result = await db.auth.admin.updateUserById(user.id, { password, email_confirm: true, user_metadata: metadata });
    if (result.error) throw result.error;
    user = result.data.user;
    updated += 1;
  } else {
    const result = await db.auth.admin.createUser({ email: account.email, password, email_confirm: true, user_metadata: metadata });
    if (result.error) throw result.error;
    user = result.data.user;
    created += 1;
  }

  const profile = await db.from("profiles").upsert({
    id: user.id,
    email: account.email,
    full_name: account.full_name,
    role: account.role,
    faculty: account.faculty,
    department: account.department,
    title: account.name_title || null,
    name_title: account.name_title || null,
    is_active: true,
  }, { onConflict: "id" });
  if (profile.error) throw profile.error;
}

console.log(JSON.stringify({ total: selectedAccounts.length, created, updated }));
