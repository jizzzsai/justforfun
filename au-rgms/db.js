/* AU-RGMS data layer — real Supabase reads/writes for the app screens.
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

  async function uid() {
    var u = await sb.auth.getUser();
    return u.data && u.data.user ? u.data.user.id : null;
  }

  async function genCode() {
    var year = new Date().getFullYear();
    var r = await sb.from("applications").select("id", { count: "exact", head: true });
    var n = (r.count || 0) + 1;
    return "RG-" + year + "-" + String(n).padStart(3, "0");
  }

  window.DB = {
    statusBadge: function (s) { return STATUS_MAP[s] || { label: s || "—", cls: "badge-draft" }; },
    fmtDate: function (iso) {
      if (!iso) return "—";
      try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }); }
      catch (e) { return iso; }
    },

    async createApplication(payload, submit) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var code = await genCode();
      var row = {
        code: code,
        researcher_id: me,
        title: payload.title || "Untitled application",
        abstract: payload.abstract || null,
        faculty: payload.faculty || null,
        department: payload.department || null,
        field: payload.field || null,
        keywords: payload.keywords || null,
        requested_amount: Number(payload.requested_amount) || 0,
        duration_months: parseInt(payload.duration_months, 10) || 12,
        budget_breakdown: payload.budget_breakdown || null,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? new Date().toISOString() : null,
      };
      var res = await sb.from("applications").insert(row).select().single();
      if (res.error) throw res.error;
      var app = res.data;
      try {
        await sb.from("application_events").insert({
          application_id: app.id, actor_id: me, actor_role: "researcher",
          action: submit ? "Submitted application" : "Saved draft",
          to_status: app.status, note: submit ? "Initial submission with required forms." : null,
        });
      } catch (e) { /* event is best-effort */ }
      return app;
    },

    async uploadDocument(appId, file, docType) {
      var me = await uid();
      var safe = (file.name || "document.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      var key = appId + "/" + Date.now() + "_" + safe;
      var up = await sb.storage.from("documents").upload(key, file, {
        contentType: file.type || "application/pdf", upsert: false,
      });
      if (up.error) throw up.error;
      var res = await sb.from("application_documents").insert({
        application_id: appId, name: file.name, doc_type: docType || null,
        storage_path: key, uploaded_by: me,
      }).select().single();
      if (res.error) throw res.error;
      return res.data;
    },

    async myApplications() {
      var me = await uid();
      var res = await sb.from("applications").select("*")
        .eq("researcher_id", me).order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data || [];
    },

    async deanQueue() {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name)")
        .eq("status", "submitted").order("submitted_at", { ascending: true });
      if (res.error) throw res.error;
      return res.data || [];
    },

    async countByStatus(status) {
      var r = await sb.from("applications").select("id", { count: "exact", head: true }).eq("status", status);
      if (r.error) throw r.error;
      return r.count || 0;
    },
  };
})();
