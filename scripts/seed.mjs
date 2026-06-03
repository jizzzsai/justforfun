// Seeds demo users (one per role) + sample applications across every
// workflow stage. Uses the service-role key (bypasses RLS).
// Run AFTER db:push.  ->  npm run db:seed
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
  process.exit(1);
}

const db = createClient(URL, KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const DEMO_PASSWORD = "AuResearch#2026";

const day = 86_400_000;
const daysAgo = (n) => new Date(Date.now() - n * day).toISOString();
const ymd = (n) => new Date(Date.now() + n * day).toISOString().slice(0, 10);

const must = (error, where) => {
  if (error) {
    console.error(`✗ ${where}:`, error.message);
    process.exit(1);
  }
};

// ---------------- users ----------------
const USERS = [
  { key: "res1", email: "somchai.r@au.edu",    full_name: "Dr. Somchai Rattana",     role: "researcher", title: "Dr.",          faculty: "Science & Technology", department: "Computer Science" },
  { key: "res2", email: "niran.p@au.edu",      full_name: "Asst. Prof. Niran Phong",  role: "researcher", title: "Asst. Prof.",  faculty: "Engineering",          department: "Electrical Engineering" },
  { key: "dean", email: "dean.sci@au.edu",     full_name: "Prof. Wichai Saetang",     role: "dean",       title: "Prof.",         faculty: "Science & Technology", department: "Dean's Office" },
  { key: "com1", email: "comm.chair@au.edu",   full_name: "Assoc. Prof. Pim Areerat",  role: "committee",  title: "Assoc. Prof.", faculty: "Science & Technology", department: "Academic Committee" },
  { key: "com2", email: "comm.member@au.edu",  full_name: "Dr. Anan Kittisak",        role: "committee",  title: "Dr.",           faculty: "Engineering",          department: "Academic Committee" },
  { key: "iras", email: "iras.office@au.edu",  full_name: "Suda Wong",                role: "iras",       title: "Khun",          faculty: "Research Office",      department: "IRAS" },
  { key: "exp1", email: "expert.ml@au.edu",    full_name: "Prof. David Laurent",      role: "expert",     title: "Prof.",         faculty: "External",             department: "Machine Learning", expertise: "Machine Learning, NLP" },
  { key: "exp2", email: "expert.bio@au.edu",   full_name: "Dr. Mei Lin",              role: "expert",     title: "Dr.",           faculty: "External",             department: "Environmental Science", expertise: "Environmental Science, Marine Biology" },
  { key: "pres", email: "president@au.edu",    full_name: "Rev. Bro. Dr. Bancha",     role: "president",  title: "Rev. Bro. Dr.", faculty: "Office of the President", department: "President" },
  { key: "ofm",  email: "finance@au.edu",      full_name: "Ratana Srisuk",            role: "ofm",        title: "Khun",          faculty: "Finance",              department: "OFM" },
  { key: "admin",email: "admin@au.edu",        full_name: "System Administrator",     role: "admin",      title: "",              faculty: "IT",                   department: "Administration" },
];

console.log("→ creating demo users …");
for (const u of USERS) {
  const { error } = await db.auth.admin.createUser({
    email: u.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: u.full_name, role: u.role, title: u.title,
      faculty: u.faculty, department: u.department,
    },
  });
  if (error && !/already|registered|exists/i.test(error.message)) must(error, `createUser ${u.email}`);
}

// map email -> id
const { data: list, error: listErr } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
must(listErr, "listUsers");
const idByEmail = Object.fromEntries(list.users.map((u) => [u.email, u.id]));
const id = (key) => idByEmail[USERS.find((u) => u.key === key).email];

// upsert full profile data (role/expertise) — authoritative over the trigger
const profileRows = USERS.map((u) => ({
  id: id(u.key), email: u.email, full_name: u.full_name, role: u.role,
  title: u.title || null, faculty: u.faculty, department: u.department,
  expertise: u.expertise || null, is_active: true,
}));
must((await db.from("profiles").upsert(profileRows, { onConflict: "id" })).error, "upsert profiles");
console.log(`  ${USERS.length} users ready (password: ${DEMO_PASSWORD})`);

// journal tier ids
const { data: tiers, error: tierErr } = await db.from("journal_tiers").select("id, code");
must(tierErr, "load tiers");
const tier = (code) => tiers.find((t) => t.code === code)?.id ?? null;

// ---------------- reset sample applications ----------------
console.log("→ resetting sample applications …");
must((await db.from("applications").delete().like("code", "AU-2026-%")).error, "clear applications");

// ---------------- applications ----------------
const APPS = [
  { code: "AU-2026-001", who: "res1", status: "submitted",        tier: "Q1",   amount: 150000, dur: 12, sub: 2,  title: "Deep Learning for Thai Medical Text Extraction", field: "Artificial Intelligence",
    abstract: "A transformer-based pipeline for extracting structured clinical entities from Thai-language medical records, targeting hospital information systems." },
  { code: "AU-2026-002", who: "res2", status: "committee_review", tier: "Q2",   amount: 120000, dur: 18, sub: 8,  title: "IoT Flood Early-Warning for the Chao Phraya Basin", field: "Internet of Things",
    abstract: "A low-cost LoRaWAN sensor network and prediction model providing 6-hour flood lead-time warnings for riverside communities." },
  { code: "AU-2026-003", who: "res1", status: "dean_sign",        tier: "Q1",   amount: 140000, dur: 12, sub: 14, title: "Carbon-Neutral Campus Energy Optimisation Model", field: "Sustainability",
    abstract: "Mixed-integer optimisation of rooftop solar, storage and demand response to reach a carbon-neutral university campus." },
  { code: "AU-2026-004", who: "res2", status: "iras_review",      tier: "Q2",   amount: 110000, dur: 12, sub: 20, title: "Blockchain Provenance for Thai Handicraft Exports", field: "Distributed Systems",
    abstract: "An on-chain provenance and certification scheme to raise trust and export value of Thai OTOP handicraft products." },
  { code: "AU-2026-005", who: "res1", status: "expert_review",    tier: "Q1",   amount: 150000, dur: 24, sub: 26, title: "Explainable AI for Retail Credit Scoring", field: "Artificial Intelligence",
    abstract: "SHAP-based explanation layer for gradient-boosted credit models, evaluated for fairness across Thai demographic groups." },
  { code: "AU-2026-006", who: "res2", status: "president_review", tier: "Q1",   amount: 145000, dur: 18, sub: 33, title: "Microplastics in Gulf of Thailand Seafood", field: "Environmental Science",
    abstract: "Quantifying microplastic load across commercial seafood species and modelling dietary human exposure in coastal provinces." },
  { code: "AU-2026-007", who: "res1", status: "active",           tier: "Q2",   amount: 100000, dur: 12, sub: 60, title: "Adaptive Tutoring System for STEM Foundations", field: "Educational Technology",
    abstract: "A Bayesian knowledge-tracing tutor for first-year mathematics, with a randomised classroom trial at AU.", approved: 100000 },
  { code: "AU-2026-008", who: "res2", status: "rejected",         tier: "TCI2", amount: 30000,  dur: 6,  sub: 40, title: "Survey of Campus Coffee Preferences", field: "Social Science",
    abstract: "A descriptive survey of beverage preferences among AU students." },
  { code: "AU-2026-009", who: "res1", status: "draft",            tier: "Q3",   amount: 80000,  dur: 12, sub: null, title: "Quantum-Resistant Cryptography: A Survey", field: "Cryptography",
    abstract: "A systematic survey of lattice-based post-quantum schemes and their performance on embedded hardware." },
  { code: "AU-2026-010", who: "res2", status: "returned",         tier: "TCI1", amount: 50000,  dur: 9,  sub: 18, title: "Sentiment Analysis of Thai Political Discourse", field: "Computational Linguistics",
    abstract: "A Thai-language sentiment corpus and benchmark for social-media political discourse." },
];

const appRows = APPS.map((a) => {
  const u = USERS.find((x) => x.key === a.who);
  return {
    code: a.code, researcher_id: id(a.who), title: a.title, abstract: a.abstract,
    faculty: u.faculty, department: u.department, field: a.field,
    journal_tier_id: tier(a.tier), target_journal: a.tier === "TCI1" || a.tier === "TCI2" ? "Thai national journal" : "International journal",
    requested_amount: a.amount, approved_amount: a.approved ?? null,
    duration_months: a.dur, status: a.status,
    submitted_at: a.sub == null ? null : daysAgo(a.sub),
    decided_at: ["approved", "active", "completed", "rejected"].includes(a.status) ? daysAgo(Math.max(0, (a.sub ?? 0) - 10)) : null,
  };
});

const { data: inserted, error: appErr } = await db.from("applications").insert(appRows).select("id, code");
must(appErr, "insert applications");
const appId = Object.fromEntries(inserted.map((r) => [r.code, r.id]));
console.log(`  ${inserted.length} applications inserted`);

// ---------------- events / screenings / reviews / assignments / approvals / contracts / payments / reports ----------------
const events = [];
const ev = (code, role, action, to, n, note) =>
  events.push({ application_id: appId[code], actor_id: id(role), actor_role: USERS.find((u) => u.key === role)?.role ?? null, action, to_status: to, note: note ?? null, created_at: daysAgo(n) });

ev("AU-2026-001", "res1", "Submitted application", "submitted", 2);
ev("AU-2026-002", "res2", "Submitted application", "submitted", 8);
ev("AU-2026-002", "dean", "Passed first screening", "committee_review", 6);
ev("AU-2026-003", "res1", "Submitted application", "submitted", 14);
ev("AU-2026-003", "dean", "Passed first screening", "committee_review", 12);
ev("AU-2026-003", "com1", "Committee recommended", "dean_sign", 4);
ev("AU-2026-004", "res2", "Submitted application", "submitted", 20);
ev("AU-2026-004", "dean", "Signed & forwarded to IRAS", "iras_review", 9);
ev("AU-2026-005", "res1", "Submitted application", "submitted", 26);
ev("AU-2026-005", "iras", "Office screening passed — experts assigned", "expert_review", 7);
ev("AU-2026-006", "res2", "Submitted application", "submitted", 33);
ev("AU-2026-006", "exp1", "Expert review submitted (favorable)", "president_review", 3);
ev("AU-2026-007", "pres", "Approved by President", "approved", 50);
ev("AU-2026-007", "ofm", "Contract issued — grant active", "active", 45);
ev("AU-2026-008", "com1", "Committee did not recommend", "rejected", 30);
ev("AU-2026-010", "iras", "Returned for revision (budget)", "returned", 12);
must((await db.from("application_events").insert(events)).error, "insert events");

const screenings = [
  { application_id: appId["AU-2026-002"], kind: "dean_first", screener_id: id("dean"), decision: "pass",  notes: "Aligned with faculty research direction.", created_at: daysAgo(6) },
  { application_id: appId["AU-2026-003"], kind: "dean_first", screener_id: id("dean"), decision: "pass",  notes: "Strong sustainability impact.", created_at: daysAgo(12) },
  { application_id: appId["AU-2026-003"], kind: "dean_sign",  screener_id: id("dean"), decision: "pass",  notes: "Endorsed and forwarded after committee recommendation.", created_at: daysAgo(4) },
  { application_id: appId["AU-2026-004"], kind: "dean_first", screener_id: id("dean"), decision: "pass",  notes: "Forward to IRAS.", created_at: daysAgo(15) },
  { application_id: appId["AU-2026-004"], kind: "iras_office",screener_id: id("iras"), decision: "pass",  notes: "Documentation complete; ready for expert assignment.", created_at: daysAgo(9) },
  { application_id: appId["AU-2026-005"], kind: "iras_office",screener_id: id("iras"), decision: "pass",  notes: "Eligible; two experts to be assigned.", created_at: daysAgo(8) },
];
must((await db.from("screenings").insert(screenings)).error, "insert screenings");

const reviews = [
  { application_id: appId["AU-2026-003"], kind: "committee", reviewer_id: id("com1"), recommendation: "favorable",   score: 86, strengths: "Clear methodology, strong impact.", weaknesses: "Budget slightly high.", comments: "Recommend with minor budget trim.", submitted_at: daysAgo(5) },
  { application_id: appId["AU-2026-008"], kind: "committee", reviewer_id: id("com1"), recommendation: "unfavorable", score: 41, strengths: "Easy to execute.", weaknesses: "Limited scholarly contribution.", comments: "Not at grant level.", submitted_at: daysAgo(31) },
  { application_id: appId["AU-2026-006"], kind: "expert",    reviewer_id: id("exp2"), recommendation: "favorable",   score: 90, strengths: "Timely environmental topic, rigorous sampling.", weaknesses: "Add QA/QC detail.", comments: "Strongly support.", submitted_at: daysAgo(4) },
  { application_id: appId["AU-2026-006"], kind: "expert",    reviewer_id: id("exp1"), recommendation: "favorable",   score: 83, strengths: "Sound exposure modelling.", weaknesses: "Sample size.", comments: "Support with conditions.", submitted_at: daysAgo(3) },
];
must((await db.from("reviews").insert(reviews)).error, "insert reviews");

const assignments = [
  { application_id: appId["AU-2026-005"], expert_id: id("exp1"), assigned_by: id("iras"), status: "accepted", due_date: ymd(7),  created_at: daysAgo(7) },
  { application_id: appId["AU-2026-005"], expert_id: id("exp2"), assigned_by: id("iras"), status: "pending",  due_date: ymd(7),  created_at: daysAgo(7) },
  { application_id: appId["AU-2026-006"], expert_id: id("exp1"), assigned_by: id("iras"), status: "completed",due_date: ymd(-2), created_at: daysAgo(14) },
  { application_id: appId["AU-2026-006"], expert_id: id("exp2"), assigned_by: id("iras"), status: "completed",due_date: ymd(-2), created_at: daysAgo(14) },
];
must((await db.from("expert_assignments").insert(assignments)).error, "insert assignments");

must((await db.from("approvals").insert([
  { application_id: appId["AU-2026-007"], president_id: id("pres"), approved: true, approved_amount: 100000, conditions: "Quarterly progress reports required.", created_at: daysAgo(50) },
]).error), "insert approvals");

const { data: contracts, error: cErr } = await db.from("contracts").insert([
  { application_id: appId["AU-2026-007"], contract_no: "AU-CT-2026-007", amount: 100000, start_date: ymd(-45), end_date: ymd(320), status: "active", issued_by: id("pres"), issued_at: daysAgo(45) },
]).select("id, application_id");
must(cErr, "insert contracts");
const contractId = contracts[0].id;

must((await db.from("payments").insert([
  { application_id: appId["AU-2026-007"], contract_id: contractId, instalment: 1, pct: 30, amount: 30000, trigger: "On contract signing",          status: "paid",      due_date: ymd(-44), paid_at: daysAgo(43), processed_by: id("ofm") },
  { application_id: appId["AU-2026-007"], contract_id: contractId, instalment: 2, pct: 40, amount: 40000, trigger: "On approved progress report",   status: "scheduled", due_date: ymd(20) },
  { application_id: appId["AU-2026-007"], contract_id: contractId, instalment: 3, pct: 30, amount: 30000, trigger: "On approved final report",      status: "pending",   due_date: ymd(300) },
]).error), "insert payments");

must((await db.from("reports").insert([
  { application_id: appId["AU-2026-007"], kind: "progress", summary: "Knowledge-tracing model trained; classroom trial recruiting participants. On schedule.", status: "submitted", submitted_at: daysAgo(5) },
]).error), "insert reports");

console.log("✓ Seed complete.\n");
console.log("Demo logins (all use password: " + DEMO_PASSWORD + "):");
for (const u of USERS) console.log(`  ${u.role.padEnd(11)} ${u.email}`);
