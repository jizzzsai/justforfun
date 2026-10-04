

(function () {
  var sb = window.sb;
  if (!sb) { console.error("[AU] window.sb not ready for DB layer"); return; }
  var ACTIVE_GRANT_TYPES = ["au_r3", "au_r4"];
  var ANNUAL_FUNDING_LIMIT = 100000;
  var COMMITTED_STATUSES = ["submitted", "committee_review", "iras_review", "approved", "active", "completed"];
  function requireActiveGrant(grantType) {
    if (ACTIVE_GRANT_TYPES.indexOf(grantType) === -1) throw new Error("Choose AU-R3 or AU-R4.");
    return grantType;
  }
  function academicYearLabel(rawYear, referenceDate) {
    var match = String(rawYear || "").match(/(\d{4})/);
    var start;
    if (match) start = Number(match[1]);
    else {
      var date = referenceDate ? new Date(referenceDate) : new Date();
      if (isNaN(date.getTime())) date = new Date();
      start = date.getFullYear() - (date.getMonth() < 5 ? 1 : 0);
    }
    return start + "/" + (start + 1);
  }
  function applicationAcademicYear(app) {
    app = app || {};
    var details = app.grant_type === "au_r3" ? (app.conference_info || {}) : (app.pub_info || {});
    var referenceDate = details.presentationDate || details.pubDate || details.acceptDate || app.submitted_at || app.created_at;
    return academicYearLabel(app.academic_year || details.academicYear, referenceDate);
  }
  function committedAmount(app) {
    if (!app || COMMITTED_STATUSES.indexOf(app.status) === -1) return 0;
    return Math.max(0, Number(app.approved_amount != null ? app.approved_amount : app.requested_amount) || 0);
  }
  async function annualFundingSummary(researcherId, academicYear, excludeApplicationId) {
    var year = academicYearLabel(academicYear);
    var q = sb.from("applications")
      .select("id,status,grant_type,requested_amount,approved_amount,academic_year,pub_info,conference_info,submitted_at,created_at")
      .eq("researcher_id", researcherId)
      .in("grant_type", ACTIVE_GRANT_TYPES)
      .in("status", COMMITTED_STATUSES);
    if (excludeApplicationId) q = q.neq("id", excludeApplicationId);
    var res = await q;
    if (res.error) throw res.error;
    var used = (res.data || []).reduce(function (sum, app) {
      return applicationAcademicYear(app) === year ? sum + committedAmount(app) : sum;
    }, 0);
    return {
      academicYear: year,
      limit: ANNUAL_FUNDING_LIMIT,
      used: used,
      remaining: Math.max(0, ANNUAL_FUNDING_LIMIT - used),
    };
  }

  var STATUS_MAP = {
    draft:            { label: "Draft",               cls: "badge-draft" },
    submitted:        { label: "Submitted",           cls: "badge-submitted" },
    iras_review:      { label: "IRAS Verification",   cls: "badge-iras" },
    approved:         { label: "Approved",            cls: "badge-signed" },
    active:           { label: "Active",              cls: "badge-paid" },
    completed:        { label: "Completed",           cls: "badge-check" },
    rejected:         { label: "Rejected",            cls: "badge-rejected" },
    returned:         { label: "Returned",            cls: "badge-revision" },
  };

  var NEXT = {
    submitted:        { to: "iras_review",      verb: "Dean approved — forwarded to IRAS" },
    iras_review:      { to: "approved",         verb: "IRAS verified — sent to Academic Office" },
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
  async function currentActor() {
    var u = await sb.auth.getUser();
    if (u.error) throw u.error;
    if (!u.data || !u.data.user) return { id: null, role: null, profile: null };
    var r = await sb.from("profiles").select("id,role,email,full_name,faculty").eq("id", u.data.user.id).maybeSingle();
    if (r.error) throw r.error;
    return { id: u.data.user.id, role: r.data ? r.data.role : null, profile: r.data || null };
  }
  function roleLabel(role) {
    var labels = {
      researcher: "Researcher", dean: "Dean", iras: "IRAS", ofm: "Academic", admin: "Administrator",
      expert: "Expert Reviewer", president: "President"
    };
    return labels[role] || (role ? String(role) : "an unassigned account");
  }
  function badge(status, grantType) {
    var base = STATUS_MAP[status] || { label: status || "—", cls: "badge-draft" };
    if (status === "iras_review" && ACTIVE_GRANT_TYPES.indexOf(grantType) >= 0) {
      return { label: "IRAS Verification", cls: base.cls };
    }
    if (status === "active" && ACTIVE_GRANT_TYPES.indexOf(grantType) >= 0) {
      return { label: "At Academic", cls: "badge-contract" };
    }
    return base;
  }
  function expectedRoles(app, fromStatus) {
    if (fromStatus === "submitted") return ["dean"];
    if (fromStatus === "iras_review") return ["iras"];
    if (fromStatus === "approved" || fromStatus === "active") return ["ofm"];
    return [];
  }
  function assertWorkflowRole(actor, app, fromStatus) {
    if (!actor || !actor.id) throw new Error("Your login session has expired. Please sign in again.");
    var required = expectedRoles(app, fromStatus);
    if (!required.length || actor.role === "admin" || required.indexOf(actor.role) >= 0) return;
    var expected = required.map(roleLabel).join(" or ");
    throw new Error("You are signed in as " + roleLabel(actor.role) + ". This action requires " + expected + ". Please sign out and sign in with the correct account.");
  }
  async function currentFacultyScope() {
    var id = await uid();
    if (!id) return null;
    var r = await sb.from("profiles").select("role,faculty").eq("id", id).single();
    if (!r.data || r.data.role !== "dean") return null;
    return r.data.faculty || null;
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }); }
      catch { return iso; }
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
      academic_position: snapshot.academicPosition || info.researcherPosition || account.academic_position || "",
      au_id: snapshot.auId || info.researcherAuId || account.au_id || "",
      phone: snapshot.phone || info.researcherPhone || account.phone || "",
      office_room: snapshot.officeRoom || info.researcherOffice || account.office_room || "",
      faculty: snapshot.faculty || a.faculty || account.faculty || "",
      department: snapshot.department || a.department || account.department || "",
      joined_date: snapshot.joinedDate || info.researcherJoinedDate || account.joined_date || "",
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
      grant_type: a.grant_type || "au_r3", conference_info: a.conference_info || null, pub_info: a.pub_info || null,
      researcher_id: a.researcher_id,
      academic_year: applicationAcademicYear(a),
      approved_amount: approved,
      events: a.events || [],
    };
  }

  window.DB = {
    statusBadge: badge,
    fmtDate: fmtDate,
    mapRow: mapRow,
    academicYearLabel: academicYearLabel,
    applicationAcademicYear: applicationAcademicYear,
    annualFundingLimit: ANNUAL_FUNDING_LIMIT,
    async annualFundingSummary(academicYear, researcherId, excludeApplicationId) {
      var targetResearcher = researcherId || await uid();
      if (!targetResearcher) throw new Error("You must be signed in.");
      return annualFundingSummary(targetResearcher, academicYear, excludeApplicationId);
    },
    applicationResearcherInfo: applicationResearcherInfo,
    nextStep: function (status) { return NEXT[status] || null; },

    async createApplication(payload, submit, appId) {
      var me = await uid();
      if (!me) throw new Error("You must be signed in.");
      var grantType = requireActiveGrant(payload.grant_type);
      var profileResult = await sb.from("profiles")
        .select("full_name,email,name_title,au_id,phone,office_room,joined_date,faculty,department")
        .eq("id", me).single();
      if (profileResult.error || !profileResult.data) throw (profileResult.error || new Error("Your account profile could not be loaded."));
      var accountProfile = profileResult.data;
      var detailsKey = grantType === "au_r3" ? "conference_info" : "pub_info";
      var details = Object.assign({}, payload[detailsKey] || {});
      var academicYear = academicYearLabel(
        payload.academic_year || details.academicYear,
        grantType === "au_r3" ? details.presentationDate : (details.pubDate || details.acceptDate)
      );
      details.academicYear = academicYear;
      var suppliedSnapshot = details.researcherSnapshot || {};
      var lockedSnapshot = {
        nameTitle: suppliedSnapshot.nameTitle !== undefined ? suppliedSnapshot.nameTitle : (accountProfile.name_title || ""),
        academicPosition: suppliedSnapshot.academicPosition !== undefined ? suppliedSnapshot.academicPosition : "",
        fullName: accountProfile.full_name || "",
        auId: accountProfile.au_id || "",
        email: String(accountProfile.email || "").toLowerCase(),
        phone: suppliedSnapshot.phone !== undefined ? suppliedSnapshot.phone : (accountProfile.phone || ""),
        officeRoom: suppliedSnapshot.officeRoom !== undefined ? suppliedSnapshot.officeRoom : (accountProfile.office_room || ""),
        joinedDate: accountProfile.joined_date || null,
        faculty: accountProfile.faculty || "",
        department: accountProfile.department || "",
      };
      details.researcherSnapshot = lockedSnapshot;
      details.researcherName = lockedSnapshot.fullName;
      details.researcherEmail = lockedSnapshot.email;
      details.researcherTitle = lockedSnapshot.nameTitle;
      details.researcherPosition = lockedSnapshot.academicPosition;
      details.researcherAuId = lockedSnapshot.auId;
      details.researcherPhone = lockedSnapshot.phone;
      details.researcherOffice = lockedSnapshot.officeRoom;
      details.researcherJoinedDate = lockedSnapshot.joinedDate;
      payload = Object.assign({}, payload, {
        faculty: lockedSnapshot.faculty,
        department: lockedSnapshot.department,
        [detailsKey]: details,
      });
      if (submit) {
        var joinedDate = grantType === "au_r3"
          ? payload.conference_info && payload.conference_info.researcherJoinedDate
          : payload.pub_info && payload.pub_info.researcherJoinedDate;
        if (!joinedDate) throw new Error("Your account has no Date Joined AU. Ask the administrator to add it in User Management.");
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
          if (!String(conference.journalDb || "").trim()) throw new Error("Select the Conference Database / Index.");
          if (!String(conference.journalClassification || "").trim()) throw new Error("Select or enter the conference classification.");
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
      if (submit) {
        var annualSummary = await annualFundingSummary(me, academicYear, appId || null);
        var requestedForLimit = grantType === "au_r3" ? 3500 : Math.max(0, Number(payload.requested_amount) || 0);
        if (requestedForLimit > annualSummary.remaining) {
          throw new Error("This application exceeds your " + academicYear + " AU-R3/AU-R4 balance. You have " + annualSummary.remaining.toLocaleString() + " THB remaining from the 100,000 THB academic-year limit.");
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
        grant_type: grantType,
        co_members: payload.co_members || null,
        pub_info: payload.pub_info || null,
        conference_info: payload.conference_info || null,
        academic_year: academicYear,
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
        var wasReturned = !!(existing && existing.status === "returned");
        if (submit && existing && !wasReturned) {
          var earlierReturn = await sb.from("application_events").select("id").eq("application_id", existing.id).eq("to_status", "returned").limit(1);
          wasReturned = !earlierReturn.error && earlierReturn.data && earlierReturn.data.length > 0;
        }
        await sb.from("application_events").insert({
          application_id: res.data.id, actor_id: me, actor_role: "researcher",
          action: submit ? (wasReturned ? "Researcher resubmitted application" : "Submitted application") : "Saved draft",
          from_status: existing ? existing.status : null,
          to_status: res.data.status,
          note: submit ? (wasReturned ? "Revised application submitted again for review." : (existing ? "Submitted from saved draft." : "Initial submission.")) : "Draft saved.",
        });
      } catch {}
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
        try { await sb.storage.from("documents").remove([key]); } catch {}
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
          try { await sb.storage.from("documents").remove([doc.storage_path]); } catch {}
      }
      var res = await sb.from("application_documents").delete().eq("id", doc.id);
      if (res.error) throw res.error;
      return true;
    },

    async myApplications(grantType) {
      var me = await uid();
      var ownQuery = sb.from("applications")
        .select("*, researcher:profiles(full_name,email), events:application_events(id,action,to_status,note,actor_role,created_at,actor:profiles(full_name))")
        .eq("researcher_id", me)
        .in("grant_type", ACTIVE_GRANT_TYPES);
      if (grantType) ownQuery = ownQuery.eq("grant_type", requireActiveGrant(grantType));
      var result = await ownQuery.order("created_at", { ascending: false });
      if (result.error) throw result.error;
      return (result.data || []).map(function (app) {
        app.is_owner = true;
        app.access_mode = "owner";
        app.statusBadge = badge(app.status, app.grant_type);
        return app;
      });
    },

    async queue(status, grantType) {
      var q = sb.from("applications")
        .select("*, researcher:profiles(full_name)")
        .eq("status", status)
        .in("grant_type", ACTIVE_GRANT_TYPES);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      if (grantType) q = q.eq("grant_type", requireActiveGrant(grantType));
      var res = await q.order("submitted_at", { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async grantPaymentQueue(grantType) {
      grantType = requireActiveGrant(grantType);
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name), events:application_events(action,note,created_at)")
        .eq("grant_type", grantType)
        .in("status", ["approved", "active", "completed"])
        .order("decided_at", { ascending: true, nullsFirst: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async financeSummaryApplications() {
      var res = await sb.from("applications")
        .select("*, researcher:profiles(full_name,email,phone,office_room), payments(*), reports(kind,status), documents:application_documents(id,name,doc_type,storage_path,created_at)")
        .in("grant_type", ACTIVE_GRANT_TYPES)
        .in("status", ["approved", "active", "completed"])
        .order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(function (app) {
        app.statusBadge = badge(app.status, app.grant_type);
        app.documents = (app.documents || []).map(mapDocument);
        return app;
      });
    },
    async financeApplicationDetail(appId) {
      var role = await myRole();
      if (role !== "ofm" && role !== "admin") throw new Error("Academic access required.");
      var app = await this.applicationDetail(appId);
      if (!app || ACTIVE_GRANT_TYPES.indexOf(app.grant_type) < 0 || ["approved", "active", "completed"].indexOf(app.status) < 0) {
        throw new Error("This application has not been forwarded to Academic.");
      }
      return app;
    },
    async deanQueue() { return this.queue("submitted"); },

    async applicationDetail(appId) {
      var me = await uid();
      var isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId || "");
      var q = sb.from("applications")
        .select("*, researcher:profiles(full_name,email,name_title,title,au_id,phone,office_room,joined_date,faculty,department), documents:application_documents(*), reviews(*, reviewer:profiles(full_name,email,title,faculty,department)), events:application_events(*, actor:profiles(full_name)), payments(*), reports(*)")
        .eq(isUuid ? "id" : "code", appId)
        .in("grant_type", ACTIVE_GRANT_TYPES);
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
      a.access_mode = a.is_owner ? "owner" : "reviewer";
      a.academic_year = applicationAcademicYear(a);
      try {
        var funding = await annualFundingSummary(a.researcher_id, a.academic_year, a.id);
        var currentAmount = Math.max(0, Number(a.approved_amount != null ? a.approved_amount : a.requested_amount) || 0);
        a.annual_funding = Object.assign({}, funding, {
          previousCommitted: funding.used,
          currentApplicationAmount: currentAmount,
          totalWithApplication: funding.used + currentAmount,
          remainingAfterApplication: Math.max(0, funding.limit - funding.used - currentAmount),
        });
      } catch { a.annual_funding = null; }
      return a;
    },

    async firstApplicationForStatus(status, grantType) {
      var q = sb.from("applications").select("id").eq("status", status);
      if (grantType) q = q.eq("grant_type", requireActiveGrant(grantType));
      else q = q.in("grant_type", ACTIVE_GRANT_TYPES);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.order("submitted_at", { ascending: true }).limit(1);
      if (res.error) throw res.error;
      var first = res.data && res.data[0];
      return first ? this.applicationDetail(first.id) : null;
    },

    async transition(appId, fromStatus, kind, note) {
      // Always re-read the authenticated account and application.  The screen
      // may be older than the current session after an account switch or a
      // token refresh, and a queued item may have moved while it was open.
      var actor = await currentActor();
      if (!actor.id) throw new Error("Your login session has expired. Please sign in again.");
      var current = await sb.from("applications")
        .select("id,code,status,grant_type,faculty")
        .eq("id", appId).maybeSingle();
      if (current.error) throw current.error;
      var currentApp = current.data;
      if (!currentApp) {
        throw new Error("This application is not available to the signed-in " + roleLabel(actor.role) + " account. Please sign out and sign in again before approving.");
      }
      assertWorkflowRole(actor, currentApp, fromStatus);
      if (currentApp.status !== fromStatus) {
        throw new Error((currentApp.code || "This application") + " is already at " + (STATUS_MAP[currentApp.status] ? STATUS_MAP[currentApp.status].label : currentApp.status) + ". Refresh the queue before taking another action.");
      }
      var decision = kind === "return" ? "return" : kind === "reject" ? "reject" : "advance";
      var result = await sb.rpc("transition_r3_r4_application", {
        p_application_id: appId,
        p_from_status: fromStatus,
        p_decision: decision,
        p_note: note || null,
      });
      if (result.error) throw result.error;
      return result.data;
    },

    async setApprovedAmount(appId, amount) {
      var actor = await currentActor();
      if (!actor.id || ["iras", "admin"].indexOf(actor.role) === -1) throw new Error("Only IRAS or an administrator can set the verified amount.");
      var approved = Math.max(0, Number(amount) || 0);
      if (approved > 80000) throw new Error("The verified AU-R4 amount cannot exceed 80,000 THB.");
      var res = await sb.from("applications").update({ approved_amount: approved }).eq("id", appId).eq("status", "iras_review").eq("grant_type", "au_r4").select();
      if (res.error) throw res.error;
      if (!res.data || !res.data.length) throw new Error("This AU-R4 application is no longer awaiting IRAS Verification.");
      return res.data[0];
    },
    async payGrantOnce(appId, fromStatus, note) {
      var kind = "advance";
      return await this.transition(appId, fromStatus, kind, note);
    },

    async completeSingleGrant(appId) {
      var me = await uid();
      var role = await myRole();
      if (!me || ["ofm", "admin"].indexOf(role) === -1) throw new Error("Only Academic or an administrator can complete this payment.");
      var current = await sb.from("applications").select("id,code,status,grant_type").eq("id", appId).single();
      if (current.error) throw current.error;
      var app = current.data;
      if (["au_r3", "au_r4"].indexOf(app.grant_type) === -1) throw new Error("This action is only for AU-R3 and AU-R4 payments.");
      if (app.status === "completed") return app;
      if (["approved", "active"].indexOf(app.status) === -1) throw new Error("This application is not ready for Academic completion.");
      var updated = await sb.rpc("transition_r3_r4_application", {
        p_application_id: appId,
        p_from_status: app.status,
        p_decision: "complete",
        p_note: "Payment confirmed complete.",
      });
      if (updated.error) throw updated.error;
      return updated.data;
    },

    async lastReturnReason(appId) {
      var res = await sb.from("application_events")
        .select("action, note, actor_role, created_at, actor:profiles(full_name)")
        .eq("application_id", appId).eq("to_status", "returned")
        .order("created_at", { ascending: false }).limit(1);
      if (res.error) return null;
      var returnEvent = (res.data && res.data[0]) || null;
      if (returnEvent && String(returnEvent.note || "").trim()) return returnEvent;

      return returnEvent;
    },

    async myGrant(grantType) {
      var me = await uid();
      var q = sb.from("applications")
        .select("*, payments(*), reports(kind,status), contracts(contract_no,status,amount), events:application_events(action,note,created_at)")
        .eq("researcher_id", me).in("status", ["approved", "active", "completed"]);
      q = q.eq("grant_type", requireActiveGrant(grantType || "au_r3"));
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

    async notifications() {
      var prof = null;
      try { prof = await window.AUTH.profile(); } catch {}
      var role = prof && prof.role;
      var items = [];
      function push(id, icon, who, text, page, unread) {
        items.push({ id: id, icon: icon, who: who, text: text, page: page, unread: unread !== false, when: "Now" });
      }
      try {
        if (role === "researcher") {
          var apps = await this.myApplications();
          apps.slice(0, 4).forEach(function (a) { push("app-" + a.id, "Folder", a.code, badge(a.status).label, "r-applications", a.status !== "completed"); });
        } else if (role === "dean") {
          var s3 = await this.queue("submitted", "au_r3"); if (s3.length) push("dean-r3", "ClipboardCheck", "AU-R3 Dean queue", s3.length + " application(s) awaiting review.", "d-r3-screen", true);
          var s4 = await this.queue("submitted", "au_r4"); if (s4.length) push("dean-r4", "ClipboardCheck", "AU-R4 Dean queue", s4.length + " application(s) awaiting review.", "d-r4-screen", true);
          var dsc = await this.statusCounts();
          var atIras = dsc.iras_review || 0;
          if (atIras) push("dean-iras", "Send", "Now at IRAS", atIras + " application(s) from your faculty are with IRAS.", "d-history", true);
          var deanApproved = (dsc.approved || 0) + (dsc.active || 0) + (dsc.completed || 0);
          if (deanApproved) push("dean-approved", "Award", "Approved", deanApproved + " proposal(s) from your faculty have been approved.", "d-history", true);
          var deanRejected = dsc.rejected || 0;
          if (deanRejected) push("dean-rejected", "AlertCircle", "Rejected", deanRejected + " proposal(s) from your faculty were rejected.", "d-history", false);
        } else if (role === "iras") {
          var iras3 = await this.queue("iras_review", "au_r3");
          var iras4 = await this.queue("iras_review", "au_r4");
          if (iras3.length + iras4.length) push("iras-screen", "Inbox", "IRAS", (iras3.length + iras4.length) + " AU-R3/AU-R4 application(s) awaiting verification.", "i-dashboard", true);
        } else if (role === "expert") {
          var ex = await this.myExpertAssignments(); if (ex.length) push("expert", "FileSearch", "Expert review", ex.length + " proposal(s) assigned to you.", "e-assignments", true);
        } else if (role === "president") {
          var pq = await this.queue("president_review"); if (pq.length) push("president", "Award", "President", pq.length + " proposal(s) awaiting final approval.", "p-queue", true);
        } else if (role === "ofm") {
          var finance3 = await this.grantPaymentQueue("au_r3");
          var finance4 = await this.grantPaymentQueue("au_r4");
          var readyGrants = finance3.concat(finance4).filter(function (a) { return a.statusKey === "approved" || a.statusKey === "active"; });
          if (readyGrants.length) push("ofm", "Coins", "Academic Office", readyGrants.length + " AU-R3/AU-R4 payment(s) ready for completion.", "o-dashboard", true);
        } else if (role === "admin") {
          var ev = await this.auditEvents(); ev.slice(0, 5).forEach(function (e) { push("audit-" + e.id, "Clock", e.application ? e.application.code : "System", e.action, "a-audit", false); });
        }
      } catch {}
      if (!items.length) push("quiet", "CheckCircle", "AU-RGMS", "No urgent items for your role right now.", null, false);
      return items.sort(function (a, b) {
        if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
        if (a.created_at) return -1;
        if (b.created_at) return 1;
        return 0;
      }).slice(0, 8);
    },

    async statusCounts(grantType) {
      var q = sb.from("applications").select("status").in("grant_type", ACTIVE_GRANT_TYPES);
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      if (grantType) q = q.eq("grant_type", requireActiveGrant(grantType));
      var r = await q;
      if (r.error) throw r.error;
      var c = { _total: 0 };
      (r.data || []).forEach(function (a) { c[a.status] = (c[a.status] || 0) + 1; c._total++; });
      c._underReview = (c.submitted || 0) + (c.iras_review || 0);
      c._approved = (c.approved || 0) + (c.active || 0) + (c.completed || 0);
      return c;
    },
    async facultyStats() {
      var r = await sb.from("applications").select("faculty,status,requested_amount,approved_amount,grant_type").in("grant_type", ACTIVE_GRANT_TYPES);
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
      var r = await sb.from("profiles").select("id", { count: "exact", head: true }).in("role", ["researcher", "dean", "iras", "ofm", "admin"]);
      if (r.error) throw r.error;
      return r.count || 0;
    },
    async byStatuses(arr, grantType) {
      var q = sb.from("applications").select("*, researcher:profiles(full_name)").in("status", arr).in("grant_type", ACTIVE_GRANT_TYPES);
      if (grantType) q = q.eq("grant_type", requireActiveGrant(grantType));
      var faculty = await currentFacultyScope();
      if (faculty) q = q.eq("faculty", faculty);
      var res = await q.order("decided_at", { ascending: false, nullsFirst: false });
      if (res.error) throw res.error;
      return (res.data || []).map(mapRow);
    },
    async financePaymentHistory(grantType) {
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
        return payment.application && ACTIVE_GRANT_TYPES.indexOf(payment.application.grant_type) >= 0;
      }).map(function (payment) {
        var app = payment.application || {};
        return {
          key: "payment-" + payment.id,
          grant_type: app.grant_type,
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
          return (event.from_status === "approved" && event.to_status === "active") || ["Academic marked payment as paid", "Finance marked payment as paid"].indexOf(event.action) >= 0;
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
      if (grantType) rows = rows.filter(function (row) { return row.grant_type === requireActiveGrant(grantType); });
      return rows.sort(function (a, b) { return String(b.paid_at || "").localeCompare(String(a.paid_at || "")); });
    },
    async roleAnalyticsSnapshot() {
      var actor = await currentActor();
      if (["dean", "iras", "ofm"].indexOf(actor.role) < 0) throw new Error("Dean, IRAS, or Academic access required.");
      if (actor.role === "dean" && !(actor.profile && actor.profile.faculty)) throw new Error("Your Dean account is not assigned to a faculty.");

      var query = sb.from("applications")
        .select("id,code,title,grant_type,status,faculty,department,requested_amount,approved_amount,created_at,submitted_at,updated_at")
        .in("grant_type", ACTIVE_GRANT_TYPES)
        .in("status", ["draft", "submitted", "iras_review", "approved", "active", "completed", "rejected", "returned"]);
      if (actor.role === "dean") query = query.eq("faculty", actor.profile.faculty);
      if (actor.role === "ofm") query = query.in("status", ["approved", "active", "completed"]);
      var appResult = await query.order("updated_at", { ascending: false });
      if (appResult.error) throw appResult.error;
      var apps = appResult.data || [];

      var paymentResult = await sb.from("payments")
        .select("application_id,amount,status,paid_at,application:applications(id,grant_type,faculty,department,status)")
        .eq("status", "paid");
      var payments = paymentResult.error ? [] : (paymentResult.data || []).filter(function (payment) {
        var application = payment.application;
        if (!application || ACTIVE_GRANT_TYPES.indexOf(application.grant_type) < 0) return false;
        return actor.role !== "dean" || application.faculty === actor.profile.faculty;
      });
      var paidByApplication = {};
      payments.forEach(function (payment) {
        paidByApplication[payment.application_id] = (paidByApplication[payment.application_id] || 0) + Number(payment.amount || 0);
      });

      var statusLabels = {};
      var byGrantMap = { au_r3: { key: "au_r3", label: "AU-R3", total: 0, requested: 0, approved: 0, paid: 0 }, au_r4: { key: "au_r4", label: "AU-R4", total: 0, requested: 0, approved: 0, paid: 0 } };
      var facultyMap = {};
      var departmentMap = {};
      var totals = { applications: apps.length, requested: 0, approved: 0, paid: 0, pendingReview: 0, pendingPayment: 0, completed: 0 };
      apps.forEach(function (application) {
        var requested = application.grant_type === "au_r3" ? 3500 : Number(application.requested_amount || 0);
        var approved = application.approved_amount == null ? 0 : (application.grant_type === "au_r3" ? 3500 : Number(application.approved_amount || 0));
        var paid = Number(paidByApplication[application.id] || 0);
        if (!paid && application.status === "completed") paid = approved || requested;
        totals.requested += requested;
        totals.approved += approved;
        totals.paid += paid;
        if (application.status === "completed") totals.completed++;
        if ((actor.role === "dean" && application.status === "submitted") || (actor.role === "iras" && application.status === "iras_review")) totals.pendingReview++;
        if (actor.role === "ofm" && ["approved", "active"].indexOf(application.status) >= 0) totals.pendingPayment++;
        statusLabels[application.status] = (statusLabels[application.status] || 0) + 1;

        var grant = byGrantMap[application.grant_type];
        grant.total++; grant.requested += requested; grant.approved += approved; grant.paid += paid;
        var facultyName = application.faculty || "Unspecified faculty";
        var departmentName = application.department || "Unspecified department";
        if (!facultyMap[facultyName]) facultyMap[facultyName] = { label: facultyName, total: 0, requested: 0, approved: 0, paid: 0 };
        if (!departmentMap[departmentName]) departmentMap[departmentName] = { label: departmentName, total: 0, requested: 0, approved: 0, paid: 0 };
        [facultyMap[facultyName], departmentMap[departmentName]].forEach(function (group) {
          group.total++; group.requested += requested; group.approved += approved; group.paid += paid;
        });
      });
      function ranked(map) {
        return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
          var aValue = actor.role === "ofm" ? a.paid : (a.approved || a.requested);
          var bValue = actor.role === "ofm" ? b.paid : (b.approved || b.requested);
          return bValue - aValue || b.total - a.total;
        });
      }
      return {
        generatedAt: new Date().toISOString(),
        role: actor.role,
        scope: actor.role === "dean" ? actor.profile.faculty : "All Assumption University faculties",
        totals: totals,
        byStatus: Object.keys(statusLabels).map(function (key) { return { key: key, label: badge(key).label, value: statusLabels[key] }; }).sort(function (a, b) { return b.value - a.value; }),
        byGrant: [byGrantMap.au_r3, byGrantMap.au_r4],
        byFaculty: ranked(facultyMap),
        byDepartment: ranked(departmentMap),
        recentApplications: apps.slice(0, 8).map(function (application) {
          return {
            code: application.code, title: application.title,
            grant: application.grant_type === "au_r4" ? "AU-R4" : "AU-R3",
            status: badge(application.status, application.grant_type).label,
            faculty: application.faculty, department: application.department,
            amount: Number(application.approved_amount || (application.grant_type === "au_r3" ? 3500 : application.requested_amount) || 0),
            updatedAt: application.updated_at || application.submitted_at || application.created_at,
          };
        }),
      };
    },
    async adminAnalyticsSnapshot() {
      var role = await myRole();
      if (role !== "admin") throw new Error("Administrator access required.");
      var results = await Promise.all([
        sb.from("applications").select("code,title,grant_type,status,faculty,department,requested_amount,approved_amount,created_at,submitted_at,decided_at").in("grant_type", ACTIVE_GRANT_TYPES),
        sb.from("profiles").select("role,faculty,department,is_active,created_at").in("role", ["researcher", "dean", "iras", "ofm", "admin"]),
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
        payments: (results[2].data || []).filter(function (payment) { return payment.application && ACTIVE_GRANT_TYPES.indexOf(payment.application.grant_type) >= 0; }),
        publicationRewards: results[3].data || [],
        reimbursements: results[4].data || [],
      };
    },
    async allProfiles() {
      var res = await sb.from("profiles").select("*").in("role", ["researcher", "dean", "iras", "ofm", "admin"]).order("role", { ascending: true }).order("full_name", { ascending: true });
      if (res.error) throw res.error;
      return res.data || [];
    },
    async auditEvents() {
      var res = await sb.from("application_events")
        .select("*, actor:profiles(full_name,email), application:applications!inner(code,title,grant_type)")
        .in("application.grant_type", ACTIVE_GRANT_TYPES)
        .order("created_at", { ascending: false }).limit(80);
      if (res.error) throw res.error;
      return (res.data || []).map(function (event) {
        return Object.assign({}, event, { action: event.action ? event.action.replace(/\bFinance\b/g, "Academic") : event.action });
      });
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
