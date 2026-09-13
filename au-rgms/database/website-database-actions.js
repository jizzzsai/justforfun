

(function () {
  var sb = window.sb;
  if (!sb) { console.error("[AU] window.sb not ready for DB layer"); return; }

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

  var NEXT = {
    submitted:        { to: "committee_review", verb: "Dean approved — sent to Faculty Committee" },
    committee_review: { to: "iras_review",      verb: "Committee recommended — forwarded to RASSC" },
    iras_review:      { to: "approved",          verb: "RASSC approved — contract issued, sent to Finance Office" },
    approved:         { to: "active",           verb: "Contract signed — project active" },
    active:           { to: "completed",        verb: "Payment completed — application closed" },
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
  async function currentFacultyScope() {
    var id = await uid();
    if (!id) return null;
    var r = await sb.from("profiles").select("role,faculty").eq("id", id).single();
    if (!r.data || ["dean", "committee"].indexOf(r.data.role) === -1) return null;
    return r.data.faculty || null;
  }
  async function genPublicationCode() {
    var year = new Date().getFullYear();
    var r = await sb.from("publication_grants").select("id", { count: "exact", head: true });
    return "PG-" + year + "-" + String((r.count || 0) + 1).padStart(3, "0");
  }
  async function genReimbursementCode() {
    var year = new Date().getFullYear();
    var r = await sb.from("reimbursements").select("id", { count: "exact", head: true });
    return "RB-" + year + "-" + String((r.count || 0) + 1).padStart(3, "0");
  }
  function reimbursementBadge(s) {
    var m = {
      draft: { label: "Draft", cls: "badge-draft" },
      submitted: { label: "Submitted to Dean", cls: "badge-submitted" },
      rassc_review: { label: "RASSC Review", cls: "badge-iras" },
      payment_pending: { label: "OFM Payment Pending", cls: "badge-pending" },
      paid: { label: "Paid", cls: "badge-paid" },
      returned: { label: "Returned", cls: "badge-revision" },
      rejected: { label: "Rejected", cls: "badge-rejected" },
    };
    return m[s] || { label: s || "Reimbursement", cls: "badge-draft" };
  }
  function badge(s, grantType) {
    var base = STATUS_MAP[s] || { label: s || "—", cls: "badge-draft" };
    if (s === "iras_review" && (grantType === "au_r3" || grantType === "au_r4")) {
      return { label: "IRAS Screening", cls: base.cls };
    }
    return base;
  }
  function publicationBadge(s) {
    var m = {
      draft: { label: "Draft", cls: "badge-draft" },
      submitted: { label: "Submitted to RASSC", cls: "badge-submitted" },
      returned: { label: "Returned", cls: "badge-revision" },
      rejected: { label: "Rejected", cls: "badge-rejected" },
      payment_pending: { label: "OFM Payment Pending", cls: "badge-pending" },
      paid: { label: "Paid", cls: "badge-paid" },
    };
    return m[s] || { label: s || "Publication Grant", cls: "badge-draft" };
  }
  function publicationAmount(indexing, quartile, type, requested) {
    var idx = (indexing || "").toLowerCase();
    var q = (quartile || "").toUpperCase();
    var t = (type || "").toLowerCase();
    if (t === "creative") return 25000;
    if (t === "patent") return 10000;
    if (t === "petty") return 3000;
    if (idx === "scopus") {
      if (q === "Q1") return 80000;
      if (q === "Q2") return 60000;
      if (q === "Q3") return 50000;
      if (q === "Q4") return 40000;
    }
    if (idx === "wos") return 80000;
    if (idx === "tci") return Math.max(0, Number(requested || 0));
    return Math.max(0, Number(requested || 0));
  }
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
  function applicationResearcherInfo(a) {
    a = a || {};
    var info = a.grant_type === "au_r3" ? (a.conference_info || {}) : (a.pub_info || {});
    var snapshot = info.researcherSnapshot || {};
    var account = a.researcher || {};
    var fullName = snapshot.fullName || info.researcherName || account.full_name || account.name || "—";
    return Object.assign({}, account, {
      full_name: fullName,
      name: fullName,
      email: snapshot.email || info.researcherEmail || info.contactEmail || account.email || "",
      name_title: snapshot.nameTitle || info.researcherTitle || account.name_title || account.title || "",
      au_id: snapshot.auId || info.researcherAuId || account.au_id || "",
      phone: snapshot.phone || info.researcherPhone || account.phone || "",
      office_room: snapshot.officeRoom || info.researcherOffice || account.office_room || "",
      faculty: snapshot.faculty || a.faculty || account.faculty || "",
      department: snapshot.department || a.department || account.department || "",
      joined_date: snapshot.joinedDate || info.researcherJoinedDate || "",
    });
  }
  function mapRow(a) {
    var requested = a.grant_type === "au_r3" ? 3500 : a.requested_amount;
    var approved = a.grant_type === "au_r3" && a.approved_amount != null ? 3500 : a.approved_amount;
    var researcher = applicationResearcherInfo(a);
    return {
      id: a.code, _uuid: a.id, title: a.title,
      researcher: { name: researcher.full_name, full_name: researcher.full_name, email: researcher.email },
      faculty: a.faculty, department: a.department,
      submittedAt: a.submitted_at ? fmtDate(a.submitted_at) : fmtDate(a.created_at),
      budgetTotal: requested, requested_amount: requested,
      status: badge(a.status, a.grant_type), statusKey: a.status,
      grant_type: a.grant_type || "au_r1", conference_info: a.conference_info || null, pub_info: a.pub_info || null,
      approved_amount: approved,
      events: a.events || [],
    };
  }

  function mapPublicationGrant(g) {
    return {
      id: g.code, _uuid: g.id, title: g.article_title,
      researcher: { name: g.researcher ? g.researcher.full_name : "-" },
      faculty: g.faculty, department: g.department,
      submittedAt: g.submitted_at ? fmtDate(g.submitted_at) : fmtDate(g.created_at),
      budgetTotal: Number(g.approved_amount || g.requested_amount || 0),
      requested_amount: Number(g.requested_amount || 0),
      status: publicationBadge(g.status), statusKey: g.status,
      indexing: g.indexing, quartile: g.quartile, publication_type: g.publication_type,
      journal_name: g.journal_name, doi: g.doi, evidence_name: g.evidence_name,
      evidence_path: g.evidence_path, review_note: g.review_note, payment_note: g.payment_note,
      paid_at: g.paid_at, raw: g,
    };
  }

  function mapReimbursement(r) {
    return {
      id: r.code, _uuid: r.id, title: r.title,
      researcher: { name: r.researcher ? r.researcher.full_name : "-" },
      faculty: r.faculty, department: r.department,
      submittedAt: r.submitted_at ? fmtDate(r.submitted_at) : fmtDate(r.created_at),
      budgetTotal: Number(r.approved_amount || r.requested_amount || 0),
      requested_amount: Number(r.requested_amount || 0),
      approved_amount: r.approved_amount != null ? Number(r.approved_amount) : null,
      status: reimbursementBadge(r.status), statusKey: r.status,
      category: r.category, description: r.description,
      evidence_name: r.evidence_name, evidence_path: r.evidence_path,
      dean_note: r.dean_note, review_note: r.review_note, payment_note: r.payment_note,
      paid_at: r.paid_at, raw: r,
    };
  }

  window.DB = {
    statusBadge: badge,
    publicationStatusBadge: publicationBadge,
    reimbursementStatusBadge: reimbursementBadge,
    publicationAwardAmount: publicationAmount,
    fmtDate: fmtDate,
    mapRow: mapRow,
    applicationResearcherInfo: applicationResearcherInfo,
    nextStep: function (status) { return NEXT[status] || null; },

    async createApplication(payload, submit, appId) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      if (submit) {
        var grantType = payload.grant_type || "au_r1";
        var joinedDate = grantType === "au_r3"
          ? payload.conference_info && payload.conference_info.researcherJoinedDate
          : payload.pub_info && payload.pub_info.researcherJoinedDate;
        if (!joinedDate) throw new Error("Select the date you joined Assumption University.");
        var joined = new Date(joinedDate + "T00:00:00");
        if (isNaN(joined.getTime())) throw new Error("Enter a valid university joined date.");
        var eligibleOn = new Date(joined.getFullYear() + 1, joined.getMonth(), joined.getDate());
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today < eligibleOn) throw new Error("Researchers must complete at least one year of service at Assumption University before applying.");
        if (grantType === "au_r3") {
          var conference = payload.conference_info || {};
          if (!String(conference.confName || "").trim()) throw new Error("Enter the conference name.");
          if (!String(conference.organizer || "").trim()) throw new Error("Enter the conference organizer.");
          if (!String(conference.conferenceLocation || "").trim()) throw new Error("Enter the conference location.");
          if (!conference.presentationDate) throw new Error("Select the presentation date.");
          if (!String(conference.paperAbstract || "").trim()) throw new Error("Enter the paper abstract.");
          if (!String(conference.journalDb || "").trim()) throw new Error("Select the Journal Database / Index.");
          if (!String(conference.journalClassification || "").trim()) throw new Error("Select or enter the journal classification.");
        }
      }
      var existing = null;
      if (appId) {
        var ex = await sb.from("applications").select("id,code,status,submitted_at")
          .eq("id", appId).eq("researcher_id", me).single();
        if (ex.error) throw ex.error;
        existing = ex.data;
        if (["draft", "returned"].indexOf(existing.status) === -1) {
          throw new Error("Only draft or returned applications can be edited from this form.");
        }
      }
      var row = {
        title: payload.title || "Untitled application",
        abstract: payload.abstract || null, faculty: payload.faculty || null,
        department: payload.department || null, field: payload.field || null,
        keywords: payload.keywords || null,
        requested_amount: Number(payload.requested_amount) || 0,
        duration_months: parseInt(payload.duration_months, 10) || 12,
        start_date: payload.start_date || null,
        end_date: payload.end_date || null,
        budget_breakdown: payload.budget_breakdown || null,
        budget_items: payload.budget_items || null,
        grant_type: payload.grant_type || "au_r1",
        co_members: payload.co_members || null,
        pub_info: payload.pub_info || null,
        conference_info: payload.conference_info || null,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? new Date().toISOString() : (existing ? existing.submitted_at : null),
      };
      if (row.grant_type === "au_r3") {
        row.requested_amount = 3500;
        row.duration_months = 1;
        row.budget_breakdown = [{ item: "Fixed AU-R3 Grant", amount: 3500 }];
      }
      if (!existing) {
        row.researcher_id = me;
      }
      var res = existing
        ? await sb.from("applications").update(row).eq("id", appId).eq("researcher_id", me).select().single()
        : await sb.from("applications").insert(row).select().single();
      if (res.error) throw res.error;
      try {
        await sb.from("application_events").insert({
          application_id: res.data.id, actor_id: me, actor_role: "researcher",
          action: submit ? "Submitted application" : "Saved draft",
          from_status: existing ? existing.status : null,
          to_status: res.data.status,
          note: submit ? (existing ? "Submitted from saved draft." : "Initial submission.") : "Draft saved.",
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
      if (res.error) {
        try { await sb.storage.from("documents").remove([key]); } catch (e) {}
        throw res.error;
      }
      return res.data;
    },

    async documentUrl(doc, download) {
      if (!doc || !doc.storage_path) throw new Error("No uploaded file is attached to this document row.");
      var res = await sb.storage.from("documents").createSignedUrl(doc.storage_path, 60 * 5, {
        download: download ? (doc.name || true) : false,
      });
      if (res.error) throw res.error;
      return res.data.signedUrl;
    },

    async deleteDocument(doc) {
      if (!doc || !doc.id) throw new Error("No document selected.");
      if (doc.storage_path) {
        try { await sb.storage.from("documents").remove([doc.storage_path]); } catch (e) {}
      }
      var res = await sb.from("application_documents").delete().eq("id", doc.id);
      if (res.error) throw res.error;
      return true;
    },

    async myApplications(grantType) {
      var me = await uid();
      var ownQuery = sb.from("applications")
        .select("*, researcher:profiles(full_name,email), events:application_events(id,action,to_status,note,actor_role,created_at,actor:profiles(full_name))")
        .eq("researcher_id", me);
      if (grantType) ownQuery = ownQuery.eq("grant_type", grantType);
      var invitedQuery = sb.from("application_collaborators")
        .select("id,status,author_role,invited_at,responded_at,application:applications(*,researcher:profiles(full_name,email),events:application_events(id,action,to_status,note,actor_role,created_at,actor:profiles(full_name)))")
        .eq("user_id", me)
        .in("status", ["pending", "accepted"]);
      var results = await Promise.all([
        ownQuery.order("created_at", { ascending: false }),
        invitedQuery.order("invited_at", { ascending: false }),
      ]);
      if (results[0].error) throw results[0].error;
      if (results[1].error) throw results[1].error;

      var rows = (results[0].data || []).map(function (app) {
        app.is_owner = true;
        app.access_mode = "owner";
        app.statusBadge = badge(app.status, app.grant_type);
        return app;
      });
      (results[1].data || []).forEach(function (invitation) {
        var app = invitation.application;
        if (!app || (grantType && app.grant_type !== grantType && invitation.status !== "pending")) return;
        if (rows.some(function (row) { return row.id === app.id; })) return;
        app.is_owner = false;
        app.access_mode = "collaborator";
        app.statusBadge = badge(app.status, app.grant_type);
        app.collaboration = {
          id: invitation.id,
          status: invitation.status,
          author_role: invitation.author_role,
          invited_at: invitation.invited_at,
          responded_at: invitation.responded_at,
        };
        rows.push(app);
      });
      return rows.sort(function (a, b) {
        return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0);
      });
    },

    async respondToCollaboration(invitationId, accept) {
      if (!invitationId) throw new Error("No co-author invitation selected.");
      var res = await sb.rpc("respond_to_collaboration", {
        p_invitation_id: invitationId,
        p_accept: !!accept,
      });
      if (res.error) throw res.error;
      return res.data;
    },

    async queue(status, grantType) {
      var q = sb.from("applications")
        .select("*, researcher:profiles(full_name)")
        .eq("status", status);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      if (grantType) {
        if (grantType.charAt(0) === "!") q = q.neq("grant_type", grantType.slice(1));
        else q = q.eq("grant_type", grantType);
      }
      var res = await q.order("submitted_at", { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async grantPaymentQueue(grantType) {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name), events:application_events(action,note,created_at)")
        .eq("grant_type", grantType)
        .in("status", ["approved", "active", "completed"])
        .order("decided_at", { ascending: true, nullsFirst: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async deanQueue() { return this.queue("submitted"); },

    async applicationDetail(appId) {
      var me = await uid();
      var isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId || "");
      var q = sb.from("applications")
        .select("*, researcher:profiles(full_name,email,name_title,title,au_id,phone,office_room), collaborators:application_collaborators(id,user_id,email,full_name,author_role,status,invited_at,responded_at), documents:application_documents(*), reviews(*, reviewer:profiles(full_name,email,title,faculty,department)), events:application_events(*, actor:profiles(full_name)), payments(*), reports(*)")
        .eq(isUuid ? "id" : "code", appId);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.single();
      if (res.error) throw res.error;
      var a = res.data;
      a.researcher = applicationResearcherInfo(a);
      if (a.grant_type === "au_r3") {
        a.requested_amount = 3500;
        if (a.approved_amount != null) a.approved_amount = 3500;
        a.budget_breakdown = [{ item: "Fixed AU-R3 Grant", amount: 3500 }];
      }
      a.statusBadge = badge(a.status, a.grant_type);
      a.documents = (a.documents || []).map(mapDocument);
      a.reviews = (a.reviews || []).sort(function (x, y) {
        return new Date(y.submitted_at || 0) - new Date(x.submitted_at || 0);
      });
      a.events = (a.events || []).sort(function (x, y) {
        return new Date(x.created_at || 0) - new Date(y.created_at || 0);
      });
      a.is_owner = a.researcher_id === me;
      a.collaboration = (a.collaborators || []).find(function (item) { return item.user_id === me; }) || null;
      a.access_mode = a.is_owner ? "owner" : (a.collaboration ? "collaborator" : "reviewer");
      return a;
    },

    async firstApplicationForStatus(status) {
      var q = sb.from("applications").select("id").eq("status", status);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.order("submitted_at", { ascending: true }).limit(1);
      if (res.error) throw res.error;
      var first = res.data && res.data[0];
      return first ? this.applicationDetail(first.id) : null;
    },

    async profilesByRole(role) {
      var q = sb.from("profiles").select("*").eq("role", role);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.order("full_name", { ascending: true });
      if (res.error) throw res.error;
      return res.data || [];
    },

    async myExpertAssignments() {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var res = await sb.from("expert_assignments")
        .select("status,due_date, application:applications(*, researcher:profiles(full_name))")
        .eq("expert_id", me).neq("status", "completed").order("due_date", { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).filter(function (x) {
        return x.application && x.application.status === "expert_review";
      }).map(function (x) {
        var row = mapRow(x.application);
        row.dueDate = fmtDate(x.due_date);
        row.assignmentStatus = x.status;
        return row;
      });
    },

    async assignExperts(appId, expertIds, dueDate) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      if (!expertIds || expertIds.length === 0) throw new Error("Select at least one expert reviewer.");
      var rows = expertIds.map(function (expertId) {
        return {
          application_id: appId,
          expert_id: expertId,
          assigned_by: me,
          status: "pending",
          due_date: dueDate || null,
        };
      });
      var ins = await sb.from("expert_assignments").upsert(rows, {
        onConflict: "application_id,expert_id",
      }).select();
      if (ins.error) throw ins.error;
      return await this.transition(appId, "iras_review", "advance");
    },

    async countByStatus(status) {
      var r = await sb.from("applications").select("id", { count: "exact", head: true }).eq("status", status);
      if (r.error) throw r.error;
      return r.count || 0;
    },

    async submitCommitteeReview(appId, payload) {
      var me = await uid();
      var role = await myRole();
      if (!me) throw new Error("You must be signed in.");
      var score = Math.max(0, Math.min(100, parseInt(payload.score, 10) || 0));
      var recommendation = payload.recommendation || (score >= 70 ? "favorable" : "revise");
      var committeeComment = String(payload.comments || "").trim();
      var row = {
        application_id: appId,
        kind: "committee",
        reviewer_id: me,
        recommendation: recommendation,
        score: score,
        comments: committeeComment || null,
        submitted_at: new Date().toISOString(),
      };
      var existing = await sb.from("reviews").select("id")
        .eq("application_id", appId).eq("kind", "committee").eq("reviewer_id", me).maybeSingle();
      if (existing.error) throw existing.error;
      var res = existing.data
        ? await sb.from("reviews").update(row).eq("id", existing.data.id).select().single()
        : await sb.from("reviews").insert(row).select().single();
      if (res.error) throw res.error;
      try {
        await sb.from("application_events").insert({
          application_id: appId, actor_id: me, actor_role: role || "committee",
          action: "Faculty Committee review submitted",
          from_status: "committee_review", to_status: "iras_review",
          note: "Score " + score + " / 100; recommendation: " + recommendation + "." + (committeeComment ? " Comment: " + committeeComment : ""),
        });
      } catch (e) {}
      if (recommendation === "unfavorable") return await this.transition(appId, "committee_review", "reject", committeeComment);
      if (recommendation === "revise") return await this.transition(appId, "committee_review", "return", committeeComment);
      await this.transition(appId, "committee_review", "advance", committeeComment);
      return res.data;
    },

    async transition(appId, fromStatus, kind, note, requestedLabel) {
      var me = await uid();
      var role = await myRole();
      var to, labelOverride = requestedLabel || null;
      if (kind === "return") to = "returned";
      else if (kind === "reject") to = "rejected";
      else {
        var n = NEXT[fromStatus]; if (!n) throw new Error("No next step from " + fromStatus); to = n.to;
        if (["submitted", "committee_review", "iras_review"].indexOf(fromStatus) >= 0) {
          try {
            var gt = await sb.from("applications").select("grant_type").eq("id", appId).single();
            var grantType = gt.data && gt.data.grant_type;
            if (fromStatus === "submitted" && grantType === "au_r3") {
              to = "iras_review";
              labelOverride = "Dean approved — forwarded to IRAS";
            }
            if (fromStatus === "committee_review" && grantType === "au_r4") {
              labelOverride = "Committee recommended — forwarded to IRAS";
            }
            if (fromStatus === "iras_review" && (grantType === "au_r3" || grantType === "au_r4")) {
              labelOverride = "IRAS approved — sent to Finance Office";
            }
          } catch (e) {}
        }
      }
      var patch = { status: to };
      if (to === "approved" || to === "rejected") patch.decided_at = new Date().toISOString();
      var upd = await sb.from("applications").update(patch).eq("id", appId).eq("status", fromStatus).select();
      if (upd.error) throw upd.error;
      if (!upd.data || upd.data.length === 0) {
        throw new Error("No application was updated. Sign in with the correct role for this queue, or refresh if the application already moved.");
      }
      if (upd.data.length > 1) {
        throw new Error("More than one application matched this action. Refresh and try again.");
      }
      var app = upd.data[0];
      var label = kind === "return" ? "Returned to researcher"
        : kind === "reject" ? "Application rejected"
        : (labelOverride || (NEXT[fromStatus] ? NEXT[fromStatus].verb : "Advanced"));
      try {
        await sb.from("application_events").insert({
          application_id: appId, actor_id: me, actor_role: role,
          action: label, from_status: fromStatus, to_status: to, note: note || null,
        });
      } catch (e) {}
      if (to === "approved") {
        try {
          var amt = app.grant_type === "au_r3" ? 3500 : Number(app.approved_amount || app.requested_amount || 0);
          if (app.grant_type === "au_r3") {
            await sb.from("applications").update({ requested_amount: 3500, approved_amount: 3500, budget_breakdown: [{ item: "Fixed AU-R3 Grant", amount: 3500 }] }).eq("id", appId);
            app.requested_amount = 3500;
            app.approved_amount = 3500;
          } else if (!app.approved_amount) await sb.from("applications").update({ approved_amount: amt }).eq("id", appId);
          await sb.from("contracts").insert({ application_id: appId, contract_no: "CT-" + app.code, amount: amt, status: "issued" });
        } catch (e) {}
      }
      return app;
    },

    async setApprovedAmount(appId, amount) {
      var res = await sb.from("applications").update({ approved_amount: Number(amount) || 0 }).eq("id", appId).select();
      if (res.error) throw res.error;
      return res.data && res.data[0];
    },
    async payGrantOnce(appId, fromStatus, note) {
      var kind = "advance";
      var label = fromStatus === "approved" ? "Finance marked payment as paid" : "Finance completed payment record";
      return await this.transition(appId, fromStatus, kind, note, label);
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
      var rem = await sb.from("expert_assignments")
        .select("id").eq("application_id", appId).neq("status", "completed");
      if (rem.error) throw rem.error;
      var remaining = rem.data || [];
      if (remaining.length === 0) {
        try {
          await sb.from("application_events").insert({
            application_id: appId, actor_id: me, actor_role: role || "expert",
            action: "All expert reviews complete",
            from_status: "expert_review", to_status: "president_review",
            note: "Final expert score " + score + " / 100; recommendation: " + recommendation + ".",
          });
        } catch (e) {}
        await this.transition(appId, "expert_review", "advance");
      } else {
        try {
          await sb.from("application_events").insert({
            application_id: appId, actor_id: me, actor_role: role || "expert",
            action: "Expert review submitted",
            from_status: "expert_review", to_status: "expert_review",
            note: "Score " + score + " / 100; recommendation: " + recommendation + ". Waiting for " + remaining.length + " expert review(s).",
          });
        } catch (e) {}
      }
      return res.data;
    },

    async presidentDecision(appId, approved, conditions) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      if (!approved) return await this.transition(appId, "president_review", "reject");
      var app = await this.transition(appId, "president_review", "advance");
      try {
        await sb.from("approvals").insert({
          application_id: appId,
          president_id: me,
          approved: true,
          approved_amount: app.approved_amount || app.requested_amount,
          conditions: conditions || null,
        });
      } catch (e) {}
      return app;
    },

    async contractQueue() {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name), contracts(*)")
        .in("status", ["approved", "active"]).order("decided_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data || [];
    },
    async signContract(appId) {
      var me = await uid();
      var role = await myRole();
      var cres = await sb.from("contracts").update({ status: "active" }).eq("application_id", appId).select();
      if (cres.error) throw cres.error;
      var upd = await sb.from("applications").update({ status: "active" }).eq("id", appId).eq("status", "approved").select();
      if (upd.error) throw upd.error;
      if (!upd.data || upd.data.length === 0) throw new Error("No approved application was updated. Refresh if it already moved.");
      try {
        await sb.from("application_events").insert({
          application_id: appId, actor_id: me, actor_role: role,
          action: "Contract signed and project activated",
          from_status: "approved", to_status: "active",
        });
      } catch (e) {}
      return upd.data[0];
    },
    async lastReturnReason(appId) {
      var res = await sb.from("application_events")
        .select("action, note, actor_role, created_at, actor:profiles(full_name)")
        .eq("application_id", appId).eq("to_status", "returned")
        .order("created_at", { ascending: false }).limit(1);
      if (res.error) return null;
      var returnEvent = (res.data && res.data[0]) || null;
      if (returnEvent && String(returnEvent.note || "").trim()) return returnEvent;

      // Older committee returns stored the reason on the review but not on the
      // return event. Preserve those records by falling back to that review.
      var review = await sb.from("reviews")
        .select("comments, submitted_at, reviewer:profiles(full_name)")
        .eq("application_id", appId).eq("kind", "committee")
        .not("comments", "is", null)
        .order("submitted_at", { ascending: false }).limit(1);
      if (!review.error && review.data && review.data[0] && String(review.data[0].comments || "").trim()) {
        return {
          action: returnEvent ? returnEvent.action : "Returned to researcher",
          note: review.data[0].comments,
          actor_role: (returnEvent && returnEvent.actor_role) || "committee",
          created_at: (returnEvent && returnEvent.created_at) || review.data[0].submitted_at,
          actor: (returnEvent && returnEvent.actor) || review.data[0].reviewer || null,
        };
      }
      return returnEvent;
    },

    async ofmPayments() {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name), payments(*), reports(kind,status), contracts(contract_no,status), events:application_events(action,note,created_at)")
        .in("status", ["approved", "active", "completed"])
        .or("grant_type.eq.au_r1,grant_type.is.null")
        .order("decided_at", { ascending: false });
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
        var uniquePayments = {};
        (a.payments || []).forEach(function (payment) {
          var previous = uniquePayments[payment.instalment];
          if (!previous || (payment.status === "paid" && previous.status !== "paid")) uniquePayments[payment.instalment] = payment;
        });
        a.payments = Object.keys(uniquePayments).map(function (key) { return uniquePayments[key]; });
        a.payments.sort(function (x, y) { return x.instalment - y.instalment; });
      }
      return apps;
    },
    payable: function (app, inst) {
      if (!app) return false;
      var reps = app.reports || [];
      var paid = function (i) { return (app.payments || []).some(function (p) { return p.instalment === i && p.status === "paid"; }); };
      if (inst === 1) return app.status === "approved" || app.status === "active" || app.status === "completed";
      if (inst === 2) return paid(1) && reps.some(function (r) { return r.kind === "progress" && r.status === "accepted"; });
      if (inst === 3) return paid(2) && reps.some(function (r) { return r.kind === "final" && r.status === "accepted"; });
      return false;
    },
    payBlockedReason: function (app, inst) {
      if (!app) return "";
      var reps = app.reports || [];
      var paid = function (i) { return (app.payments || []).some(function (p) { return p.instalment === i && p.status === "paid"; }); };
      if (inst === 1) return "Waiting for RASSC / IRAS approval.";
      if (inst === 2) {
        if (!paid(1)) return "Phase 1 must be marked paid by Finance first.";
        return "Waiting for the progress report to be accepted.";
      }
      if (inst === 3) {
        if (!paid(2)) return "Phase 2 must be marked paid by Finance first.";
        return "Waiting for the final report to be accepted.";
      }
      return "";
    },
    async markPaid(paymentId, instalment, appId, note) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var currentPayment = await sb.from("payments").select("status,application_id").eq("id", paymentId).single();
      if (currentPayment.error) throw currentPayment.error;
      if (!currentPayment.data || currentPayment.data.application_id !== appId) throw new Error("Payment phase does not match this application.");
      if (currentPayment.data.status === "paid") return currentPayment.data;
      if (currentPayment.data.status !== "pending") throw new Error("This payment phase cannot be paid.");
      var gate = await sb.from("applications").select("status,payments(instalment,status),reports(kind,status)").eq("id", appId).single();
      if (gate.error) throw gate.error;
      if (!this.payable(gate.data, instalment)) throw new Error(this.payBlockedReason(gate.data, instalment) || "This phase is not ready for payment.");
      var paidAt = new Date().toISOString();
      var r = await sb.from("payments").update({ status: "paid", paid_at: paidAt, processed_by: me }).eq("id", paymentId).select().single();
      if (r.error) throw r.error;
      if (instalment === 1) await sb.from("applications").update({ status: "active" }).eq("id", appId);
      if (instalment === 3) await sb.from("applications").update({ status: "completed" }).eq("id", appId);
      await sb.from("application_events").insert({
        application_id: appId,
        actor_id: me,
        actor_role: "ofm",
        action: "Finance paid Phase " + instalment,
        from_status: instalment === 1 ? "approved" : "active",
        to_status: instalment === 3 ? "completed" : "active",
        note: note || null,
      });
      return r.data;
    },
    async submitReport(appId, kind, details) {
      var me = await uid();
      if (["progress", "final"].indexOf(kind) < 0) throw new Error("Unknown AU-R1 report type.");
      var appCheck = await sb.from("applications")
        .select("researcher_id,grant_type,status,payments(instalment,status),reports(id,kind,status)")
        .eq("id", appId).single();
      if (appCheck.error) throw appCheck.error;
      var checkedApp = appCheck.data;
      if (checkedApp.researcher_id !== me) throw new Error("You can submit reports only for your own AU-R1 grant.");
      if (checkedApp.grant_type && checkedApp.grant_type !== "au_r1") throw new Error("Progress and final reports are available only for AU-R1 grants.");
      var requiredPhase = kind === "progress" ? 1 : 2;
      var priorApproved = (checkedApp.payments || []).some(function (payment) {
        return Number(payment.instalment) === requiredPhase && payment.status === "paid";
      });
      if (!priorApproved) throw new Error("Finance must mark Phase " + requiredPhase + " as paid before you can submit this report.");
      var existing = (checkedApp.reports || []).find(function (report) {
        return report.kind === kind && ["submitted", "accepted"].indexOf(report.status) >= 0;
      });
      if (existing) throw new Error((kind === "progress" ? "Progress" : "Final") + " report is already " + (existing.status === "accepted" ? "accepted" : "waiting for RASSC review") + ".");
      var reportDetails = details || {};
      var reportSummary = (kind === "progress" ? "Progress" : "Final") + " report submitted by researcher and routed to RASSC.";
      if (kind === "progress" && reportDetails.reporting_period) reportSummary += " Reporting period: " + reportDetails.reporting_period + ".";
      if (reportDetails.summary) reportSummary += " Summary: " + String(reportDetails.summary).replace(/[\r\n]+/g, " ").slice(0, 1000);
      if (kind === "progress" && reportDetails.budget_utilisation) reportSummary += " Budget utilisation: " + String(reportDetails.budget_utilisation).replace(/[\r\n]+/g, " ").slice(0, 500);
      var r = await sb.from("reports").insert({
        application_id: appId, kind: kind, status: "submitted",
        summary: reportSummary,
      }).select().single();
      if (r.error) throw r.error;
      try { await sb.from("application_events").insert({
        application_id: appId, actor_id: me, actor_role: "researcher",
        action: (kind === "progress" ? "Progress" : "Final") + " report submitted to RASSC",
        note: "Waiting for RASSC acceptance before routing Phase " + (kind === "progress" ? "2 (40%)" : "3 (30%)") + " to Finance.",
      }); } catch (e) {}
      return r.data;
    },
    async myReports(kind, appId) {
      var apps = await this.myApplications();
      var ids = (apps || []).filter(function (a) {
        return !a.grant_type || a.grant_type === "au_r1";
      }).map(function (a) { return a.id; });
      if (!ids.length) return [];
      if (appId && ids.indexOf(appId) < 0) throw new Error("This AU-R1 project does not belong to the signed-in researcher.");
      var q = sb.from("reports")
        .select("*, application:applications(code,title)")
        .order("submitted_at", { ascending: false });
      q = appId ? q.eq("application_id", appId) : q.in("application_id", ids);
      if (kind) q = q.eq("kind", kind);
      var res = await q;
      if (res.error) throw res.error;
      return res.data || [];
    },
    async reportQueue() {
      var res = await sb.from("reports")
        .select("*, application:applications(code,title,grant_type,researcher:profiles(full_name),documents:application_documents(*))")
        .eq("status", "submitted").order("submitted_at", { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).filter(function (report) {
        return report.application && (!report.application.grant_type || report.application.grant_type === "au_r1");
      }).map(function (report) {
        if (report.application) report.application.documents = (report.application.documents || []).map(mapDocument);
        return report;
      });
    },
    async acceptReport(reportId) {
      var me = await uid();
      var role = await myRole();
      if (role !== "iras") throw new Error("Only RASSC can accept milestone reports and release them to Finance.");
      var current = await sb.from("reports")
        .select("id,kind,status,application_id,application:applications(id,code,grant_type)")
        .eq("id", reportId).single();
      if (current.error) throw current.error;
      if (!current.data.application || (current.data.application.grant_type && current.data.application.grant_type !== "au_r1")) {
        throw new Error("Only AU-R1 milestone reports can be forwarded to Finance.");
      }
      if (current.data.status !== "submitted") throw new Error("This report is no longer awaiting RASSC review.");
      var r = await sb.from("reports").update({ status: "accepted" }).eq("id", reportId).eq("status", "submitted")
        .select("*, application:applications(id,code,grant_type)").single();
      if (r.error) throw r.error;
      try {
        await sb.from("application_events").insert({
          application_id: r.data.application_id,
          actor_id: me,
          actor_role: role,
          action: (r.data.kind === "progress" ? "Progress" : "Final") + " report accepted by RASSC and forwarded to Finance",
          note: "Finance payment gate opened for Phase " + (r.data.kind === "progress" ? "2 (40%)" : "3 (30%)") + ".",
        });
      } catch (e) {}
      return r.data;
    },
    async myGrant(grantType) {
      var me = await uid();
      var q = sb.from("applications")
        .select("*, payments(*), reports(kind,status), contracts(contract_no,status,amount), events:application_events(action,note,created_at)")
        .eq("researcher_id", me).in("status", ["approved", "active", "completed"]);
      if (grantType === "au_r1") q = q.or("grant_type.eq.au_r1,grant_type.is.null");
      else if (grantType) q = q.eq("grant_type", grantType);
      var res = await q.order("decided_at", { ascending: false }).limit(1);
      if (res.error) throw res.error;
      var a = (res.data && res.data[0]) || null;
      if (a && a.grant_type === "au_r3") {
        a.requested_amount = 3500;
        if (a.approved_amount != null) a.approved_amount = 3500;
      }
      if (a && a.payments) a.payments.sort(function (x, y) { return x.instalment - y.instalment; });
      return a;
    },

    async createPublicationGrant(payload, submit, grantId) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var prof = await sb.from("profiles").select("faculty,department").eq("id", me).single();
      var existing = null;
      if (grantId) {
        var ex = await sb.from("publication_grants").select("*").eq("id", grantId).eq("researcher_id", me).single();
        if (ex.error) throw ex.error;
        existing = ex.data;
        if (["draft", "returned"].indexOf(existing.status) === -1) throw new Error("Only draft or returned publication grants can be edited.");
      }
      var estimate = publicationAmount(payload.indexing, payload.quartile, payload.publication_type, payload.requested_amount);
      var row = {
        article_title: payload.article_title || "Untitled publication",
        journal_name: payload.journal_name || null,
        indexing: payload.indexing || "scopus",
        quartile: payload.quartile || null,
        publication_type: payload.publication_type || "journal",
        doi: payload.doi || null,
        published_on: payload.published_on || null,
        requested_amount: Number(payload.requested_amount || estimate || 0),
        faculty: payload.faculty || (prof.data && prof.data.faculty) || null,
        department: payload.department || (prof.data && prof.data.department) || null,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? new Date().toISOString() : (existing ? existing.submitted_at : null),
        updated_at: new Date().toISOString(),
      };
      if (!existing) {
        row.code = await genPublicationCode();
        row.researcher_id = me;
      }
      var res = existing
        ? await sb.from("publication_grants").update(row).eq("id", grantId).eq("researcher_id", me).select().single()
        : await sb.from("publication_grants").insert(row).select().single();
      if (res.error) throw res.error;
      return res.data;
    },

    async uploadPublicationEvidence(grantId, file) {
      var safe = (file.name || "publication_evidence.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      var key = "publication_grants/" + grantId + "/" + Date.now() + "_" + safe;
      var up = await sb.storage.from("documents").upload(key, file, { contentType: file.type || "application/pdf", upsert: false });
      if (up.error) throw up.error;
      var r = await sb.from("publication_grants").update({
        evidence_name: file.name, evidence_path: key, updated_at: new Date().toISOString(),
      }).eq("id", grantId).select().single();
      if (r.error) throw r.error;
      return r.data;
    },

    async publicationEvidenceUrl(grant, download) {
      if (!grant || !grant.evidence_path) throw new Error("No uploaded publication evidence file is attached.");
      var res = await sb.storage.from("documents").createSignedUrl(grant.evidence_path, 60 * 5, {
        download: download ? (grant.evidence_name || true) : false,
      });
      if (res.error) throw res.error;
      return res.data.signedUrl;
    },

    async myPublicationGrants() {
      var me = await uid();
      var res = await sb.from("publication_grants").select("*, researcher:profiles(full_name)")
        .eq("researcher_id", me).order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapPublicationGrant);
    },

    async publicationGrantQueue(statuses) {
      var q = sb.from("publication_grants").select("*, researcher:profiles(full_name)")
        .order("submitted_at", { ascending: true, nullsFirst: false });
      if (statuses && statuses.length) q = q.in("status", statuses);
      var res = await q;
      if (res.error) throw res.error;
      return (res.data || []).map(mapPublicationGrant);
    },

    async reviewPublicationGrant(grantId, decision, note, amount) {
      var status = decision === "return" ? "returned" : decision === "reject" ? "rejected" : "payment_pending";
      var row = {
        status: status,
        review_note: note || null,
        decided_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (status === "payment_pending") row.approved_amount = Number(amount || 0);
      var res = await sb.from("publication_grants").update(row).eq("id", grantId).select().single();
      if (res.error) throw res.error;
      return res.data;
    },

    async payPublicationGrant(grantId, note) {
      var res = await sb.from("publication_grants").update({
        status: "paid", paid_at: new Date().toISOString(), payment_note: note || null,
        updated_at: new Date().toISOString(),
      }).eq("id", grantId).select().single();
      if (res.error) throw res.error;
      return res.data;
    },

    async publicationGrantStats() {
      var res = await sb.from("publication_grants").select("faculty,status,requested_amount,approved_amount,indexing,publication_type");
      if (res.error) throw res.error;
      var out = { total: 0, submitted: 0, payment_pending: 0, paid: 0, rejected: 0, requested_sum: 0, approved_sum: 0, byFaculty: {}, byIndex: {} };
      (res.data || []).forEach(function (g) {
        out.total++;
        out[g.status] = (out[g.status] || 0) + 1;
        out.requested_sum += Number(g.requested_amount || 0);
        out.approved_sum += Number(g.approved_amount || 0);
        var f = g.faculty || "Unspecified";
        if (!out.byFaculty[f]) out.byFaculty[f] = { faculty: f, total: 0, paid: 0, approved_sum: 0 };
        out.byFaculty[f].total++;
        if (g.status === "paid") out.byFaculty[f].paid++;
        out.byFaculty[f].approved_sum += Number(g.approved_amount || 0);
        var idx = g.indexing || g.publication_type || "Other";
        out.byIndex[idx] = (out.byIndex[idx] || 0) + 1;
      });
      out.byFaculty = Object.keys(out.byFaculty).map(function (k) { return out.byFaculty[k]; }).sort(function (a, b) { return b.total - a.total; });
      return out;
    },

    async createReimbursement(payload, submit, id) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var prof = await sb.from("profiles").select("faculty,department").eq("id", me).single();
      var existing = null;
      if (id) {
        var ex = await sb.from("reimbursements").select("*").eq("id", id).eq("researcher_id", me).single();
        if (ex.error) throw ex.error;
        existing = ex.data;
        if (["draft", "returned"].indexOf(existing.status) === -1) throw new Error("Only draft or returned claims can be edited.");
      }
      var row = {
        title: payload.title || "Untitled claim",
        description: payload.description || null,
        category: payload.category || null,
        requested_amount: Number(payload.requested_amount || 0),
        faculty: payload.faculty || (prof.data && prof.data.faculty) || null,
        department: payload.department || (prof.data && prof.data.department) || null,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? new Date().toISOString() : (existing ? existing.submitted_at : null),
        updated_at: new Date().toISOString(),
      };
      if (!existing) { row.code = await genReimbursementCode(); row.researcher_id = me; }
      var res = existing
        ? await sb.from("reimbursements").update(row).eq("id", id).eq("researcher_id", me).select().single()
        : await sb.from("reimbursements").insert(row).select().single();
      if (res.error) throw res.error;
      return res.data;
    },
    async uploadReimbursementEvidence(id, file) {
      var safe = (file.name || "receipt.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      var key = "reimbursements/" + id + "/" + Date.now() + "_" + safe;
      var up = await sb.storage.from("documents").upload(key, file, { contentType: file.type || "application/pdf", upsert: false });
      if (up.error) throw up.error;
      var r = await sb.from("reimbursements").update({ evidence_name: file.name, evidence_path: key, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (r.error) throw r.error;
      return r.data;
    },
    async reimbursementEvidenceUrl(claim, download) {
      var path = claim && (claim.evidence_path || (claim.raw && claim.raw.evidence_path));
      if (!path) throw new Error("No receipt file is attached.");
      var res = await sb.storage.from("documents").createSignedUrl(path, 60 * 5, { download: download ? (claim.evidence_name || true) : false });
      if (res.error) throw res.error;
      return res.data.signedUrl;
    },
    async myReimbursements() {
      var me = await uid();
      var res = await sb.from("reimbursements").select("*, researcher:profiles(full_name)").eq("researcher_id", me).order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapReimbursement);
    },
    async reimbursementQueue(statuses) {
      var q = sb.from("reimbursements").select("*, researcher:profiles(full_name)").order("submitted_at", { ascending: true, nullsFirst: false });
      if (statuses && statuses.length) q = q.in("status", statuses);
      var res = await q;
      if (res.error) throw res.error;
      return (res.data || []).map(mapReimbursement);
    },
    async reviewReimbursement(id, stage, decision, note, amount) {
      var row = { updated_at: new Date().toISOString() };
      if (decision === "return") row.status = "returned";
      else if (decision === "reject") row.status = "rejected";
      else if (stage === "dean") { row.status = "rassc_review"; row.dean_at = new Date().toISOString(); }
      else { row.status = "payment_pending"; row.decided_at = new Date().toISOString(); row.approved_amount = Number(amount || 0); }
      if (stage === "dean") row.dean_note = note || null; else row.review_note = note || null;
      var res = await sb.from("reimbursements").update(row).eq("id", id).select().single();
      if (res.error) throw res.error;
      return res.data;
    },
    async payReimbursement(id, note) {
      var res = await sb.from("reimbursements").update({ status: "paid", paid_at: new Date().toISOString(), payment_note: note || null, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (res.error) throw res.error;
      return res.data;
    },
    async reimbursementStats() {
      var res = await sb.from("reimbursements").select("faculty,status,requested_amount,approved_amount");
      if (res.error) throw res.error;
      var out = { total: 0, submitted: 0, rassc_review: 0, payment_pending: 0, paid: 0, requested_sum: 0, approved_sum: 0 };
      (res.data || []).forEach(function (r) {
        out.total++; out[r.status] = (out[r.status] || 0) + 1;
        out.requested_sum += Number(r.requested_amount || 0);
        out.approved_sum += Number(r.approved_amount || 0);
      });
      return out;
    },

    async notifications() {
      var prof = null;
      try { prof = await window.AUTH.profile(); } catch (e) {}
      var role = prof && prof.role;
      var items = [];
      function push(id, icon, who, text, page, unread) {
        items.push({ id: id, icon: icon, who: who, text: text, page: page, unread: unread !== false, when: "Now" });
      }
      try {
        if (role === "researcher") {
          var apps = await this.myApplications();
          apps.slice(0, 4).forEach(function (a) { push("app-" + a.id, "Folder", a.code, badge(a.status).label, "r-applications", a.status !== "completed"); });
          var pgs = await this.myPublicationGrants();
          pgs.slice(0, 3).forEach(function (g) { push("pg-" + g._uuid, "FileText", g.id, g.status.label, "r-publications", g.statusKey !== "paid"); });
        } else if (role === "dean") {
          var s = await this.queue("submitted"); if (s.length) push("dean-screen", "ClipboardCheck", "Dean queue", s.length + " proposal(s) awaiting first screening.", "d-screen", true);
          var ds = await this.queue("dean_sign"); if (ds.length) push("dean-sign", "FileSignature", "Dean sign", ds.length + " proposal(s) awaiting sign and forward.", "d-sign", true);
          var dsc = await this.statusCounts();
          var atRassc = dsc.iras_review || 0;
          if (atRassc) push("dean-rassc", "Send", "Now at RASSC", atRassc + " proposal(s) from your faculty passed committee and are with RASSC.", "d-history", true);
          var deanApproved = (dsc.approved || 0) + (dsc.active || 0) + (dsc.completed || 0);
          if (deanApproved) push("dean-approved", "Award", "Approved", deanApproved + " proposal(s) from your faculty have been approved.", "d-history", true);
          var deanRejected = dsc.rejected || 0;
          if (deanRejected) push("dean-rejected", "AlertCircle", "Rejected", deanRejected + " proposal(s) from your faculty were rejected.", "d-history", false);
        } else if (role === "committee") {
          var cq = await this.queue("committee_review"); if (cq.length) push("committee", "Users", "Committee", cq.length + " proposal(s) awaiting review.", "c-queue", true);
          var mine = await this.myReviews();
          var cseen = {}, cdecided = 0;
          (mine || []).forEach(function (r) {
            if (r.recommendation === "favorable" && r.application && r.application_id && !cseen[r.application_id]
                && ["approved", "active", "completed", "rejected", "returned"].indexOf(r.application.status) >= 0) {
              cseen[r.application_id] = true; cdecided++;
            }
          });
          if (cdecided) push("committee-decided", "Bell", "RASSC outcome", cdecided + " proposal(s) you recommended now have a RASSC decision.", "c-history", true);
        } else if (role === "iras") {
          var iq = await this.queue("iras_review"); if (iq.length) push("iras-screen", "Inbox", "RASSC", iq.length + " research proposal(s) awaiting screening.", "i-received", true);
          var reports = await this.reportQueue(); if (reports.length) push("reports", "FileCheck", "Reports", reports.length + " report(s) awaiting RASSC acceptance.", "i-reports", true);
          var pgq = await this.publicationGrantQueue(["submitted"]); if (pgq.length) push("pub-review", "FileText", "Publication grants", pgq.length + " publication grant(s) awaiting RASSC review.", "i-publications", true);
        } else if (role === "expert") {
          var ex = await this.myExpertAssignments(); if (ex.length) push("expert", "FileSearch", "Expert review", ex.length + " proposal(s) assigned to you.", "e-assignments", true);
        } else if (role === "president") {
          var pq = await this.queue("president_review"); if (pq.length) push("president", "Award", "President", pq.length + " proposal(s) awaiting final approval.", "p-queue", true);
        } else if (role === "ofm") {
          var pay = await this.ofmPayments();
          var readyPhases = [];
          for (var payIndex = 0; payIndex < (pay || []).length; payIndex++) {
            var payApp = pay[payIndex];
            for (var phaseIndex = 0; phaseIndex < (payApp.payments || []).length; phaseIndex++) {
              var payPhase = payApp.payments[phaseIndex];
              if (payPhase.status !== "paid" && this.payable(payApp, payPhase.instalment)) readyPhases.push(payPhase);
            }
          }
          if (readyPhases.length) push("ofm", "Coins", "Finance Office", readyPhases.length + " AU-R1 phase(s) ready for Finance approval after RASSC release.", "o-payments", true);
          var pgp = await this.publicationGrantQueue(["payment_pending"]); if (pgp.length) push("pub-pay", "Coins", "Publication approvals", pgp.length + " publication reward(s) awaiting Finance approval.", "o-publications", true);
        } else if (role === "admin") {
          var ev = await this.auditEvents(); ev.slice(0, 5).forEach(function (e) { push("audit-" + e.id, "Clock", e.application ? e.application.code : "System", e.action, "a-audit", false); });
        }
      } catch (e) {}
      if (!items.length) push("quiet", "CheckCircle", "AU-RGMS", "No urgent items for your role right now.", null, false);
      return items.sort(function (a, b) {
        if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
        if (a.created_at) return -1;
        if (b.created_at) return 1;
        return 0;
      }).slice(0, 8);
    },

    async statusCounts(grantType) {
      var q = sb.from("applications").select("status");
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      if (grantType) {
        if (grantType.charAt(0) === "!") q = q.neq("grant_type", grantType.slice(1));
        else q = q.eq("grant_type", grantType);
      }
      var r = await q;
      if (r.error) throw r.error;
      var c = { _total: 0 };
      (r.data || []).forEach(function (a) { c[a.status] = (c[a.status] || 0) + 1; c._total++; });
      c._underReview = (c.submitted || 0) + (c.committee_review || 0) + (c.dean_sign || 0) + (c.iras_review || 0) + (c.expert_review || 0) + (c.president_review || 0);
      c._approved = (c.approved || 0) + (c.active || 0) + (c.completed || 0);
      return c;
    },
    async facultyStats() {
      var r = await sb.from("applications").select("faculty,status,requested_amount,approved_amount,grant_type");
      if (r.error) throw r.error;
      var map = {};
      (r.data || []).forEach(function (a) {
        var f = a.faculty || "Unspecified";
        if (!map[f]) map[f] = { faculty: f, total: 0, approved: 0, active: 0, completed: 0, requested_sum: 0, approved_sum: 0 };
        map[f].total++;
        if (["approved", "active", "completed"].indexOf(a.status) >= 0) map[f].approved++;
        if (a.status === "active") map[f].active++;
        if (a.status === "completed") map[f].completed++;
        var requestedAmount = a.grant_type === "au_r3" ? 3500 : Number(a.requested_amount || 0);
        var approvedAmount = a.grant_type === "au_r3" && a.approved_amount != null ? 3500 : Number(a.approved_amount || 0);
        map[f].requested_sum += requestedAmount;
        map[f].approved_sum += approvedAmount;
      });
      return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return b.total - a.total; });
    },
    async profileCount() {
      var r = await sb.from("profiles").select("id", { count: "exact", head: true });
      if (r.error) throw r.error;
      return r.count || 0;
    },
    async byStatuses(arr) {
      var q = sb.from("applications").select("*, researcher:profiles(full_name)").in("status", arr);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.order("decided_at", { ascending: false, nullsFirst: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async myReviews() {
      var me = await uid();
      var res = await sb.from("reviews").select("*, application:applications(code,title,status)")
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
    async financePaymentHistory() {
      var results = await Promise.all([
        sb.from("payments")
          .select("*, application:applications(id,code,title,grant_type,status,researcher:profiles(full_name))")
          .eq("status", "paid").order("paid_at", { ascending: false }),
        sb.from("applications")
          .select("id,code,title,grant_type,status,requested_amount,approved_amount,decided_at,updated_at,events:application_events(id,action,from_status,to_status,note,created_at),researcher:profiles(full_name)")
          .in("grant_type", ["au_r3", "au_r4"])
          .in("status", ["active", "completed"]),
      ]);
      results.forEach(function (result) { if (result.error) throw result.error; });

      var rows = (results[0].data || []).filter(function (payment) {
        return !payment.application || !payment.application.grant_type || payment.application.grant_type === "au_r1";
      }).map(function (payment) {
        var app = payment.application || {};
        return {
          key: "payment-" + payment.id,
          grant_type: app.grant_type || "au_r1",
          code: app.code || "—",
          researcher: app.researcher ? app.researcher.full_name : "—",
          payment_label: payment.instalment === 1 ? "Phase 1 · 30%" : payment.instalment === 2 ? "Phase 2 · 40%" : "Phase 3 · 30%",
          amount: Number(payment.amount || 0),
          paid_at: payment.paid_at,
          reference: "PAY-" + String(payment.id || "").slice(0, 8),
          status: "paid",
        };
      });

      (results[1].data || []).forEach(function (app) {
        var events = app.events || [];
        var paidEvent = events.filter(function (event) {
          return (event.from_status === "approved" && event.to_status === "active") || event.action === "Finance marked payment as paid";
        }).sort(function (a, b) { return String(b.created_at || "").localeCompare(String(a.created_at || "")); })[0];
        rows.push({
          key: "grant-" + app.id,
          grant_type: app.grant_type,
          code: app.code || "—",
          researcher: app.researcher ? app.researcher.full_name : "—",
          payment_label: app.grant_type === "au_r4" ? "Publication fee / reward" : "Conference grant",
          amount: Number(app.approved_amount || app.requested_amount || 0),
          paid_at: (paidEvent && paidEvent.created_at) || app.updated_at || app.decided_at,
          reference: "PAY-" + String((paidEvent && paidEvent.id) || app.id || "").slice(0, 8),
          status: app.status === "completed" ? "completed" : "paid",
        });
      });
      return rows.sort(function (a, b) { return String(b.paid_at || "").localeCompare(String(a.paid_at || "")); });
    },
    async adminAnalyticsSnapshot() {
      var role = await myRole();
      if (role !== "admin") throw new Error("Administrator access required.");
      var results = await Promise.all([
        sb.from("applications").select("code,title,grant_type,status,faculty,department,requested_amount,approved_amount,created_at,submitted_at,decided_at"),
        sb.from("profiles").select("role,faculty,department,is_active,created_at"),
        sb.from("payments").select("amount,pct,instalment,status,paid_at,application:applications(code,grant_type,faculty,status)"),
        sb.from("publication_grants").select("code,article_title,status,faculty,department,requested_amount,approved_amount,indexing,quartile,publication_type,submitted_at,paid_at"),
        sb.from("reimbursements").select("code,title,status,faculty,department,requested_amount,approved_amount,category,submitted_at,paid_at"),
      ]);
      results.forEach(function (result) { if (result.error) throw result.error; });
      var profiles = results[1].data || [];
      var usersByRole = {};
      var usersByFaculty = {};
      profiles.forEach(function (profile) {
        var roleKey = profile.role || "unspecified";
        var facultyKey = profile.faculty || "Unspecified";
        usersByRole[roleKey] = (usersByRole[roleKey] || 0) + 1;
        usersByFaculty[facultyKey] = (usersByFaculty[facultyKey] || 0) + 1;
      });
      return {
        generatedAt: new Date().toISOString(),
        applications: results[0].data || [],
        users: {
          total: profiles.length,
          active: profiles.filter(function (profile) { return profile.is_active; }).length,
          inactive: profiles.filter(function (profile) { return !profile.is_active; }).length,
          byRole: usersByRole,
          byFaculty: usersByFaculty,
        },
        payments: results[2].data || [],
        publicationRewards: results[3].data || [],
        reimbursements: results[4].data || [],
      };
    },
    async allProfiles() {
      var res = await sb.from("profiles").select("*").order("role", { ascending: true }).order("full_name", { ascending: true });
      if (res.error) throw res.error;
      return res.data || [];
    },
    async journalTiers() {
      var res = await sb.from("journal_tiers").select("*").order("sort_order", { ascending: true });
      if (res.error) throw res.error;
      return res.data || [];
    },
    async auditEvents() {
      var res = await sb.from("application_events")
        .select("*, actor:profiles(full_name,email), application:applications(code,title)")
        .order("created_at", { ascending: false }).limit(80);
      if (res.error) throw res.error;
      return res.data || [];
    },
    async saveSetting(key, value, label) {
      var me = await uid();
      var res = await sb.from("app_settings").upsert({
        key: key, value: value, label: label || key, updated_by: me, updated_at: new Date().toISOString(),
      }, { onConflict: "key" }).select().single();
      if (res.error) throw res.error;
      return res.data;
    },
    async getSetting(key, fallback) {
      var res = await sb.from("app_settings").select("value").eq("key", key).maybeSingle();
      if (res.error || !res.data) return fallback;
      return res.data.value;
    },
    async budgetCaps() {
      var def = (window.AU && window.AU.DEFAULT_BUDGET_CAPS) || { remuneration: 30, equipment: 50, travel: 40, misc: 20 };
      var v = await this.getSetting("budget_caps", def);
      return Object.assign({}, def, v || {});
    },
    async adminCreateUser(payload) {
      var s = await sb.auth.getSession();
      var token = s && s.data && s.data.session && s.data.session.access_token;
      if (!token) throw new Error("You must be signed in as an administrator.");
      var res = await fetch("/api/admin-user-management", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not create the account.");
      return data;
    },
    async adminUpdateUser(payload) {
      var s = await sb.auth.getSession();
      var token = s && s.data && s.data.session && s.data.session.access_token;
      if (!token) throw new Error("You must be signed in as an administrator.");
      var res = await fetch("/api/admin-user-management", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not update the account.");
      return data;
    },
    async adminDeleteUser(id) {
      var s = await sb.auth.getSession();
      var token = s && s.data && s.data.session && s.data.session.access_token;
      if (!token) throw new Error("You must be signed in as an administrator.");
      var res = await fetch("/api/admin-user-management", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ id: id }),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not delete the account.");
      return data;
    },
    async updateMyProfile(fields) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var roleCheck = await sb.from("profiles").select("role").eq("id", me).single();
      if (roleCheck.error || !roleCheck.data || roleCheck.data.role !== "admin") {
        throw new Error("Account information can only be changed by an administrator.");
      }
      var patch = {};
      ["full_name", "name_title", "au_id", "phone", "title", "department", "budget_split", "office_room"].forEach(function (k) {
        if (fields[k] !== undefined && fields[k] !== null) patch[k] = fields[k];
      });
      if (!Object.keys(patch).length) return null;
      var res = await sb.from("profiles").update(patch).eq("id", me).select().single();
      if (res.error) throw res.error;
      return res.data;
    },
  };
})();
