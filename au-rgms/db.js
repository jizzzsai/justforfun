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
  function fmtBytes(n) {
    var v = Number(n || 0);
    if (!v) return "PDF";
    if (v < 1024 * 1024) return Math.max(1, Math.round(v / 1024)) + " KB";
    return (v / 1024 / 1024).toFixed(1) + " MB";
  }
  function mapDocument(d) {
    return {
      id: d.id, name: d.name,
      size: d.size ? fmtBytes(d.size) : "PDF",
      uploadedAt: fmtDate(d.created_at),
      storage_path: d.storage_path,
      doc_type: d.doc_type,
    };
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

    async applicationDetail(appId) {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name,email), documents:application_documents(*), reviews(*, reviewer:profiles(full_name,email,title,faculty,department))")
        .eq("id", appId).single();
      if (res.error) throw res.error;
      var a = res.data;
      a.statusBadge = badge(a.status);
      a.documents = (a.documents || []).map(mapDocument);
      a.reviews = (a.reviews || []).sort(function (x, y) {
        return new Date(y.submitted_at || 0) - new Date(x.submitted_at || 0);
      });
      return a;
    },

    async firstApplicationForStatus(status) {
      var res = await sb.from("applications")
        .select("id").eq("status", status).order("submitted_at", { ascending: true }).limit(1);
      if (res.error) throw res.error;
      var first = res.data && res.data[0];
      return first ? this.applicationDetail(first.id) : null;
    },

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
      if (to === "approved") {
        try {
          var amt = Number(res.data.approved_amount || res.data.requested_amount || 0);
          if (!res.data.approved_amount) await sb.from("applications").update({ approved_amount: amt }).eq("id", appId);
          await sb.from("contracts").insert({ application_id: appId, contract_no: "CT-" + res.data.code, amount: amt, status: "issued" });
        } catch (e) {}
      }
      return res.data;
    },

    async submitExpertReview(appId, payload) {
      var me = await uid();
      var role = await myRole();
      if (!me) throw new Error("You must be signed in.");
      var score = Math.max(0, Math.min(100, parseInt(payload.score, 10) || 0));
      var recommendation = payload.recommendation || (score >= 70 ? "favorable" : "unfavorable");
      var row = {
        application_id: appId,
        kind: "expert",
        reviewer_id: me,
        recommendation: recommendation,
        score: score,
        strengths: payload.strengths || null,
        weaknesses: payload.weaknesses || null,
        comments: payload.comments || null,
        submitted_at: new Date().toISOString(),
      };
      var existing = await sb.from("reviews").select("id")
        .eq("application_id", appId).eq("kind", "expert").eq("reviewer_id", me).maybeSingle();
      if (existing.error) throw existing.error;
      var res = existing.data
        ? await sb.from("reviews").update(row).eq("id", existing.data.id).select().single()
        : await sb.from("reviews").insert(row).select().single();
      if (res.error) throw res.error;
      try {
        await sb.from("expert_assignments").update({ status: "completed" })
          .eq("application_id", appId).eq("expert_id", me);
      } catch (e) {}
      try {
        await sb.from("application_events").insert({
          application_id: appId, actor_id: me, actor_role: role || "expert",
          action: "Expert review submitted",
          from_status: "expert_review", to_status: "expert_review",
          note: "Score " + score + " / 100; recommendation: " + recommendation + ".",
        });
      } catch (e) {}
      await this.transition(appId, "expert_review", "advance");
      return res.data;
    },

    // ---- Layer 4: contracts, payments (30/40/30), reports ----
    async ofmPayments() {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name), payments(*), reports(kind,status), contracts(contract_no,status)")
        .in("status", ["approved", "active", "completed"]).order("decided_at", { ascending: false });
      if (res.error) throw res.error;
      var apps = res.data || [];
      for (var i = 0; i < apps.length; i++) {
        var a = apps[i];
        if (!a.payments || a.payments.length === 0) {
          var amount = Number(a.approved_amount || a.requested_amount || 0);
          var p1 = Math.round(amount * 0.30), p3 = Math.round(amount * 0.30), p2 = amount - p1 - p3;
          var ins = await sb.from("payments").insert([
            { application_id: a.id, instalment: 1, pct: 30, amount: p1, trigger: "After contract signing", status: "pending" },
            { application_id: a.id, instalment: 2, pct: 40, amount: p2, trigger: "After progress report", status: "pending" },
            { application_id: a.id, instalment: 3, pct: 30, amount: p3, trigger: "After final report", status: "pending" },
          ]).select();
          a.payments = ins.data || [];
        }
        a.payments.sort(function (x, y) { return x.instalment - y.instalment; });
      }
      return apps;
    },
    // can this instalment be paid yet? (report-gated)
    payable: function (app, inst) {
      if (inst === 1) return true;
      var reps = app.reports || [];
      if (inst === 2) return reps.some(function (r) { return r.kind === "progress"; });
      if (inst === 3) return reps.some(function (r) { return r.kind === "final"; });
      return false;
    },
    async markPaid(paymentId, instalment, appId) {
      var r = await sb.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", paymentId);
      if (r.error) throw r.error;
      if (instalment === 1) await sb.from("applications").update({ status: "active" }).eq("id", appId);
      if (instalment === 3) await sb.from("applications").update({ status: "completed" }).eq("id", appId);
    },
    async submitReport(appId, kind) {
      var me = await uid();
      var r = await sb.from("reports").insert({
        application_id: appId, kind: kind, status: "submitted",
        summary: (kind === "progress" ? "Progress" : "Final") + " report submitted by researcher.",
      }).select().single();
      if (r.error) throw r.error;
      try { await sb.from("application_events").insert({ application_id: appId, actor_id: me, actor_role: "researcher", action: (kind === "progress" ? "Progress" : "Final") + " report submitted" }); } catch (e) {}
      return r.data;
    },
    async myGrant() {
      var me = await uid();
      var res = await sb.from("applications")
        .select("*, payments(*), reports(kind,status), contracts(contract_no,status,amount)")
        .eq("researcher_id", me).in("status", ["approved", "active", "completed"])
        .order("decided_at", { ascending: false }).limit(1);
      if (res.error) throw res.error;
      var a = (res.data && res.data[0]) || null;
      if (a && a.payments) a.payments.sort(function (x, y) { return x.instalment - y.instalment; });
      return a;
    },

    // dashboard counts (RLS-scoped: staff see all, researcher sees own)
    async statusCounts() {
      var r = await sb.from("applications").select("status");
      if (r.error) throw r.error;
      var c = { _total: 0 };
      (r.data || []).forEach(function (a) { c[a.status] = (c[a.status] || 0) + 1; c._total++; });
      c._underReview = (c.submitted || 0) + (c.committee_review || 0) + (c.dean_sign || 0) + (c.iras_review || 0) + (c.expert_review || 0) + (c.president_review || 0);
      c._approved = (c.approved || 0) + (c.active || 0) + (c.completed || 0);
      return c;
    },
    async profileCount() {
      var r = await sb.from("profiles").select("id", { count: "exact", head: true });
      if (r.error) throw r.error;
      return r.count || 0;
    },
    // history: applications in any of the given statuses (mapped for tables)
    async byStatuses(arr) {
      var res = await sb.from("applications").select("*, researcher:profiles(full_name)")
        .in("status", arr).order("decided_at", { ascending: false, nullsFirst: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async myReviews() {
      var me = await uid();
      var res = await sb.from("reviews").select("*, application:applications(code,title)")
        .eq("reviewer_id", me).order("submitted_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data || [];
    },
    async paidPayments() {
      var res = await sb.from("payments").select("*, application:applications(code, researcher:profiles(full_name))")
        .eq("status", "paid").order("paid_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data || [];
    },
  };
})();
