const ROLES = ["researcher", "dean", "iras", "ofm", "admin"];
const NULLABLE_PROFILE_REFERENCES = [
  ["app_settings", "updated_by"],
  ["application_documents", "uploaded_by"],
  ["application_events", "actor_id"],
  ["approvals", "president_id"],
  ["audit_log", "actor_id"],
  ["contracts", "issued_by"],
  ["expert_assignments", "assigned_by"],
  ["payments", "processed_by"],
  ["reports", "reviewed_by"],
  ["reviews", "reviewer_id"],
  ["screenings", "screener_id"],
];

function supabaseUrl() { return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""; }
function sb(path) { return supabaseUrl().replace(/\/$/, "") + path; }
function svcHeaders() {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { "Content-Type": "application/json", apikey: k, Authorization: "Bearer " + k };
}
function messageOf(value, fallback) {
  return (value && (value.msg || value.error_description || value.message || value.error)) || fallback;
}
function bodyOf(req) {
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  return body || {};
}
async function detachProfileReferences(id) {
  for (const [table, column] of NULLABLE_PROFILE_REFERENCES) {
    const clearRes = await fetch(sb("/rest/v1/" + table + "?" + column + "=eq." + encodeURIComponent(id)), {
      method: "PATCH",
      headers: Object.assign({}, svcHeaders(), { Prefer: "return=minimal" }),
      body: JSON.stringify({ [column]: null }),
    });
    if (!clearRes.ok) {
      const detail = await clearRes.json().catch(() => ({}));
      throw new Error(messageOf(detail, "Could not detach the account from historical records."));
    }
  }
}
function validateProfile(body, requirePassword) {
  const email = String(body.email || "").trim().toLowerCase();
  const fullName = String(body.full_name || "").trim();
  const role = String(body.role || "").trim();
  const password = String(body.password || "");
  const faculty = body.faculty ? String(body.faculty).trim() : null;
  const department = body.department ? String(body.department).trim() : null;
  const nameTitle = body.name_title ? String(body.name_title).trim() : null;
  const auId = body.au_id ? String(body.au_id).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;
  const officeRoom = body.office_room ? String(body.office_room).trim() : null;
  const joinedDate = body.joined_date ? String(body.joined_date).trim() : null;

  if (!/^[^@\s]+@au\.edu$/.test(email)) return { error: "Email must be an @au.edu address." };
  if (!fullName) return { error: "Full name is required." };
  if (phone && !/^0\d{8,9}$/.test(phone)) return { error: "Phone must be a Thai number with 9–10 digits starting with 0." };
  if (joinedDate && (!/^\d{4}-\d{2}-\d{2}$/.test(joinedDate) || Number.isNaN(Date.parse(joinedDate + "T00:00:00Z")))) return { error: "Date joined must be a valid date." };
  if (joinedDate && joinedDate > new Date().toISOString().slice(0, 10)) return { error: "Date joined cannot be in the future." };
  if (ROLES.indexOf(role) === -1) return { error: "Invalid role." };
  if ((requirePassword || password) && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(password)) {
    return { error: "Password must be 12+ characters and include upper case, lower case, a number, and a symbol." };
  }
  if (role === "dean" && !faculty) return { error: "Dean accounts need a faculty." };

  return {
    email, fullName, role, password, faculty, department, nameTitle, auId, phone, officeRoom, joinedDate,
    isActive: body.is_active !== false,
  };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (["POST", "PATCH", "DELETE"].indexOf(req.method) === -1) {
    res.status(405).json({ error: "Method not allowed." }); return;
  }

  const host = req.headers.host || "", origin = req.headers.origin || "";
  if (origin) {
    let ok = false;
    try { ok = new URL(origin).host === host; } catch {}
    if (!ok) { res.status(403).json({ error: "Forbidden." }); return; }
  }
  if (Number(req.headers["content-length"] || 0) > 32768) {
    res.status(413).json({ error: "Request is too large." }); return;
  }

  if (!supabaseUrl() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: "Server not configured (missing Supabase service env vars)." }); return;
  }

  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) { res.status(401).json({ error: "Not signed in." }); return; }

    const meRes = await fetch(sb("/auth/v1/user"), {
      headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + token },
    });
    const me = await meRes.json();
    if (!meRes.ok || !me || !me.id) { res.status(401).json({ error: "Invalid session." }); return; }

    const profRes = await fetch(sb("/rest/v1/profiles?select=role&id=eq." + encodeURIComponent(me.id) + "&is_active=eq.true"), { headers: svcHeaders() });
    const prof = await profRes.json();
    if (!Array.isArray(prof) || !prof[0] || prof[0].role !== "admin") {
      res.status(403).json({ error: "Only an administrator can manage accounts." }); return;
    }

    const body = bodyOf(req);

    if (req.method === "POST") {
      const f = validateProfile(body, true);
      if (f.error) { res.status(400).json({ error: f.error }); return; }

      const createRes = await fetch(sb("/auth/v1/admin/users"), {
        method: "POST", headers: svcHeaders(),
        body: JSON.stringify({ email: f.email, password: f.password, email_confirm: true, user_metadata: { full_name: f.fullName } }),
      });
      const created = await createRes.json();
      if (!createRes.ok || !created || !created.id) {
        res.status(400).json({ error: messageOf(created, "Could not create the account (the email may already exist).") }); return;
      }

      const upRes = await fetch(sb("/rest/v1/profiles?on_conflict=id"), {
        method: "POST",
        headers: Object.assign({}, svcHeaders(), { Prefer: "resolution=merge-duplicates,return=representation" }),
        body: JSON.stringify({
          id: created.id, email: f.email, full_name: f.fullName, role: f.role,
          faculty: f.faculty, department: f.department, name_title: f.nameTitle,
          au_id: f.auId, phone: f.phone, office_room: f.officeRoom, joined_date: f.joinedDate, is_active: f.isActive,
        }),
      });
      if (!upRes.ok) {
        const e = await upRes.text();
        res.status(400).json({ error: "Account created but profile failed: " + e }); return;
      }
      res.status(200).json({ ok: true, id: created.id, email: f.email, role: f.role }); return;
    }

    const targetId = String(body.id || "").trim();
    if (!targetId) { res.status(400).json({ error: "User ID is required." }); return; }

    const targetRes = await fetch(sb("/rest/v1/profiles?select=id,full_name,email&id=eq." + encodeURIComponent(targetId)), { headers: svcHeaders() });
    const target = await targetRes.json();
    if (!Array.isArray(target) || !target[0]) { res.status(404).json({ error: "User not found." }); return; }

    if (req.method === "PATCH") {
      const f = validateProfile(body, false);
      if (f.error) { res.status(400).json({ error: f.error }); return; }
      if (targetId === me.id && f.role !== "admin") {
        res.status(400).json({ error: "You cannot remove your own administrator role." }); return;
      }
      if (targetId === me.id && !f.isActive) {
        res.status(400).json({ error: "You cannot deactivate the administrator account you are currently using." }); return;
      }

      const authPatch = { email: f.email, email_confirm: true, user_metadata: { full_name: f.fullName } };
      if (f.password) authPatch.password = f.password;
      const authRes = await fetch(sb("/auth/v1/admin/users/" + encodeURIComponent(targetId)), {
        method: "PUT", headers: svcHeaders(), body: JSON.stringify(authPatch),
      });
      const authData = await authRes.json().catch(() => ({}));
      if (!authRes.ok) {
        res.status(400).json({ error: messageOf(authData, "Could not update the login account.") }); return;
      }

      const patchRes = await fetch(sb("/rest/v1/profiles?id=eq." + encodeURIComponent(targetId)), {
        method: "PATCH",
        headers: Object.assign({}, svcHeaders(), { Prefer: "return=representation" }),
        body: JSON.stringify({
          email: f.email, full_name: f.fullName, role: f.role, faculty: f.faculty,
          department: f.department, name_title: f.nameTitle, au_id: f.auId,
          phone: f.phone, office_room: f.officeRoom, joined_date: f.joinedDate, is_active: f.isActive,
        }),
      });
      const updated = await patchRes.json().catch(() => []);
      if (!patchRes.ok || !Array.isArray(updated) || !updated[0]) {
        res.status(400).json({ error: messageOf(updated, "Login updated, but the profile could not be updated.") }); return;
      }
      res.status(200).json({ ok: true, user: updated[0] }); return;
    }

    if (targetId === me.id) {
      res.status(400).json({ error: "You cannot delete the account you are currently using." }); return;
    }

    await detachProfileReferences(targetId);

    const deleteRes = await fetch(sb("/auth/v1/admin/users/" + encodeURIComponent(targetId)), {
      method: "DELETE", headers: svcHeaders(),
    });
    const deleteData = await deleteRes.json().catch(() => ({}));
    if (!deleteRes.ok) {
      res.status(400).json({ error: messageOf(deleteData, "Could not delete this account. It may still own application records.") }); return;
    }

    const profileDelete = await fetch(sb("/rest/v1/profiles?id=eq." + encodeURIComponent(targetId)), {
      method: "DELETE", headers: svcHeaders(),
    });
    if (!profileDelete.ok) {
      res.status(400).json({ error: "Login deleted, but its profile could not be removed. Please contact the database administrator." }); return;
    }

    res.status(200).json({ ok: true, id: targetId });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || "Server error managing the account." });
  }
};
