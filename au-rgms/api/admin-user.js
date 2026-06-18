// Secure admin-only user creation. The caller must be a signed-in ADMIN; the
// service-role key stays server-side. Creates an AU login + scoped profile
// (role + faculty + department), e.g. Tanachai -> Dean -> School of Music.
const ROLES = ["researcher", "dean", "committee", "iras", "expert", "president", "ofm", "admin"];

function sb(path) { return (process.env.SUPABASE_URL || "").replace(/\/$/, "") + path; }
function svcHeaders() {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { "Content-Type": "application/json", apikey: k, Authorization: "Bearer " + k };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed." }); return; }

  // Same-origin pinning (other sites cannot call this).
  const host = req.headers.host || "", origin = req.headers.origin || "";
  if (origin) { let ok = false; try { ok = new URL(origin).host === host; } catch (e) {} if (!ok) { res.status(403).json({ error: "Forbidden." }); return; } }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: "Server not configured (missing Supabase service env vars)." }); return;
  }

  try {
    // 1. Identify the caller from their bearer token.
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (!token) { res.status(401).json({ error: "Not signed in." }); return; }
    const meRes = await fetch(sb("/auth/v1/user"), { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + token } });
    const me = await meRes.json();
    if (!meRes.ok || !me || !me.id) { res.status(401).json({ error: "Invalid session." }); return; }

    // 2. Caller must be an admin.
    const profRes = await fetch(sb("/rest/v1/profiles?select=role&id=eq." + me.id), { headers: svcHeaders() });
    const prof = await profRes.json();
    if (!Array.isArray(prof) || !prof[0] || prof[0].role !== "admin") { res.status(403).json({ error: "Only an administrator can create accounts." }); return; }

    // 3. Validate input.
    let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const email = String((body && body.email) || "").trim().toLowerCase();
    const fullName = String((body && body.full_name) || "").trim();
    const role = String((body && body.role) || "").trim();
    const password = String((body && body.password) || "");
    const faculty = (body && body.faculty) ? String(body.faculty).trim() : null;
    const department = (body && body.department) ? String(body.department).trim() : null;
    const nameTitle = (body && body.name_title) ? String(body.name_title).trim() : null;
    const auId = (body && body.au_id) ? String(body.au_id).trim() : null;

    if (!/^[^@\s]+@au\.edu$/.test(email)) { res.status(400).json({ error: "Email must be an @au.edu address." }); return; }
    if (!fullName) { res.status(400).json({ error: "Full name is required." }); return; }
    if (ROLES.indexOf(role) === -1) { res.status(400).json({ error: "Invalid role." }); return; }
    if (password.length < 8) { res.status(400).json({ error: "Temporary password must be at least 8 characters." }); return; }
    if ((role === "dean" || role === "committee") && !faculty) { res.status(400).json({ error: "Dean and Committee accounts need a faculty." }); return; }

    // 4. Create the auth user.
    const createRes = await fetch(sb("/auth/v1/admin/users"), {
      method: "POST", headers: svcHeaders(),
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name: fullName } }),
    });
    const created = await createRes.json();
    if (!createRes.ok || !created || !created.id) {
      const msg = (created && (created.msg || created.error_description || created.message)) || "Could not create the account (the email may already exist).";
      res.status(400).json({ error: msg }); return;
    }

    // 5. Upsert the scoped profile.
    const upRes = await fetch(sb("/rest/v1/profiles?on_conflict=id"), {
      method: "POST",
      headers: Object.assign({}, svcHeaders(), { Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify({ id: created.id, email, full_name: fullName, role, faculty, department, name_title: nameTitle, au_id: auId, is_active: true }),
    });
    if (!upRes.ok) { const e = await upRes.text(); res.status(400).json({ error: "Account created but profile failed: " + e }); return; }

    res.status(200).json({ ok: true, id: created.id, email, role });
  } catch (e) {
    res.status(500).json({ error: "Server error creating the account." });
  }
};
