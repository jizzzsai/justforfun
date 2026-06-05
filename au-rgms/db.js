/* AU-RGMS data layer — real Supabase reads/writes + workflow engine.
   Loaded after supabase.js (window.sb) and before the React app. */
(function () {
  var sb = window.sb;
  if (!sb) { console.error("[AU] window.sb not ready for DB layer"); return; }

  // app_status enum -> badge { label, cls }
  var STATUS_MAP = {
    draft:            { label: "Draft",               cls: "badge-draft" },
    submitted:        { label: "Submitted",           cls: "badge-submitted" },
    committee_review: { label: "Committee Review",    cls: "badge-academic" },
    dean_sign:        { label: "Dean Sign & Forward", cls: "badge-dean" },
    iras_review:      { label: "RASSC Screening",     cls: "badge-iras" },
    expert_review:    { label: "Under Expert Review", cls: "badge-expert" },
    president_review: { label: "President Approval",  cls: "badge-president" },
    approved:         { label: "Approved",            cls: "badge-signed" },
    active:           { label: "Active",              cls: "badge-paid" },
    completed:        { label: "Completed",           cls: "badge-check" },
    rejected:         { label: "Rejected",            cls: "badge-rejected" },
    returned:         { label: "Returned",            cls: "badge-revision" },
  };

  // forward workflow: current status -> { to, verb }
  var NEXT = {
    submitted:        { to: "committee_review", verb: "Dean approved — sent to Faculty Committee" },
    committee_review: { to: "dean_sign",        verb: "Committee recommended — returned to Dean to sign & forward" },
    dean_sign:        { to: "iras_review",      verb: "Dean signed & forwarded to RASSC" },
    iras_review:      { to: "expert_review",    verb: "RASSC assigned experts — sent for expert review" },
    expert_review:    { to: "president_review", verb: "Expert review complete — sent to the President" },
    president_review: { to: "approved",         verb: "Approved by the President — contract to be issued" },
    approved:         { to: "active",           verb: "Contract signed — project active" },
  };

  async function uid() {
    var u = await sb.auth.getUser();
    return u.data && u.data.user ? u.data.user.id : null;
  }
  async function myRole() {
    var id = await uid();
    if (!id) return null;
    var r = await sb.from("profiles").select("role").eq("id", id).single();
    return r.data ? r.data.role : null;
  }
  async function genCode() {
    var year = new Date().getFullYear();
    var r = await sb.from("applications").select("id", { count: "exact", head: true });
    return "RG-" + year + "-" + String((r.count || 0) + 1).padStart(3, "0");
  }
  function badge(s) { return STATUS_MAP[s] || { label: s || "—", cls: "badge-draft" }; }
  function fmtDate(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }); }
    catch (e) { return iso; }
  }
  // map a DB application row -> the shape the QueueTable / tables expect
  function mapRow(a) {
    return {
      id: a.code, _uuid: a.id, title: a.title,
      researcher: { name: a.researcher ? a.researcher.full_name : "—" },
      faculty: a.faculty, department: a.department,
      submittedAt: a.submitted_at ? fmtDate(a.submitted_at) : fmtDate(a.created_at),
      budgetTotal: a.requested_amount, requested_amount: a.requested_amount,
      status: badge(a.status), statusKey: a.status,
    };
  }

  window.DB = {
    statusBadge: badge,
    fmtDate: fmtDate,
    mapRow: mapRow,
    nextStep: function (status) { return NEXT[status] || null; },

    async createApplication(payload, submit) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var code = await genCode();
      var row = {
        code: code, researcher_id: me,
        title: payload.title || "Untitled application",
        abstract: payload.abstract || null, faculty: payload.faculty || null,
        department: payload.department || null, field: payload.field || null,
        keywords: payload.keywords || null,
        requested_amount: Number(payload.requested_amount) || 0,
        duration_months: parseInt(payload.duration_months, 10) || 12,
        budget_breakdown: payload.budget_breakdown || null,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? new Date().toISOString() : null,
      };
      var res = await sb.from("applications").insert(row).select().single();
      if (res.error) throw res.error;
      try {
        await sb.from("application_events").insert({
          application_id: res.data.id, actor_id: me, actor_role: "researcher",
          action: submit ? "Submitted application" : "Saved draft",
          to_status: res.data.status, note: submit ? "Initial submission." : null,
        });
      } catch (e) {}
      return res.data;
    },

    async uploadDocument(appId, file, docType) {
      var me = await uid();
      var safe = (file.name || "document.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      var key = appId + "/" + Date.now() + "_" + safe;
      var up = await sb.storage.from("documents").upload(key, file, { contentType: file.type || "application/pdf", upsert: false });
      if (up.error) throw up.error;
      var res = await sb.from("application_documents").insert({
        application_id: appId, name: file.name, doc_type: docType || null, storage_path: key, uploaded_by: me,
      }).select().single();
      if (res.error) throw res.error;
      return res.data;
    },

    async myApplications() {
      var me = await uid();
      var res = await sb.from("applications").select("*").eq("researcher_id", me).order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data || [];
    },

    // generic role queue: applications at a given status, with researcher name
    async queue(status) {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name)")
        .eq("status", status).order("submitted_at", { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async deanQueue() { return this.queue("submitted"); },

    async countByStatus(status) {
      var r = await sb.from("applications").select("id", { count: "exact", head: true }).eq("status", status);
      if (r.error) throw r.error;
      return r.count || 0;
    },

    // advance / return / reject an application
    async transition(appId, fromStatus, kind) {
      var me = await uid();
      var role = await myRole();
      var to;
      if (kind === "return") to = "returned";
      else if (kind === "reject") to = "rejected";
      else { var n = NEXT[fromStatus]; if (!n) throw new Error("No next step from " + fromStatus); to = n.to; }
      var patch = { status: to };
      if (to === "approved" || to === "rejected") patch.decided_at = new Date().toISOString();
      var res = await sb.from("applications").update(patch).eq("id", appId).select().single();
      if (res.error) throw res.error;
      var label = kind === "return" ? "Returned to researcher"
        : kind === "reject" ? "Application rejected"
        : (NEXT[fromStatus] ? NEXT[fromStatus].verb : "Advanced");
      try {
        await sb.from("application_events").insert({
          application_id: appId, actor_id: me, actor_role: role,
          action: label, from_status: fromStatus, to_status: to,
        });
      } catch (e) {}
      return res.data;
    },
  };
})();
