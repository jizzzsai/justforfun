



const RA = window.AU;

const R3_PIPELINE = [
  { key: "submission", label: "Submitted" },
  { key: "dean", label: "Dean Review" },
  { key: "iras", label: "IRAS Verification" },
  { key: "approved", label: "Approved" },
  { key: "payment", label: "Payment" },
  { key: "completed", label: "Completed" },
];
function buildR3Timeline(statusKey) {
  const order = ["submission", "dean", "iras", "approved", "payment", "completed"];
  const idxMap = { draft: 0, submitted: 1, iras_review: 2, approved: 4, active: 5, completed: 6, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  const currentLabel = statusKey === "draft" ? "Draft" : statusKey === "returned" ? "Returned for revision" : statusKey === "rejected" ? "Not approved" : "In progress";
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true, date: "Completed" } : (i === idx ? { current: true, date: currentLabel } : { date: "Not started" }); });
  return tl;
}

const R4_PIPELINE = [
  { key: "submission", label: "Submitted" },
  { key: "dean", label: "Dean Review" },
  { key: "iras", label: "IRAS Verification" },
  { key: "approved", label: "Approved by Research Office" },
  { key: "payment", label: "Finance Payment" },
  { key: "completed", label: "Completed" },
];
function buildR4Timeline(statusKey) {
  const order = ["submission", "dean", "iras", "approved", "payment", "completed"];
  const idxMap = { draft: 0, submitted: 1, iras_review: 2, approved: 4, active: 4, completed: 6, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  const currentLabel = statusKey === "draft" ? "Draft" : statusKey === "returned" ? "Returned for revision" : statusKey === "rejected" ? "Not approved" : "In progress";
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true, date: "Completed" } : (i === idx ? { current: true, date: currentLabel } : { date: "Not started" }); });
  return tl;
}

function ResearcherDashboard({ navigate, onDownload, onView, setSelectedApplicationId, grantType }) {
  const sys = grantSystemFor(grantType || "au_r3");
  const [me, setMe] = useState(null);
  const [grant, setGrant] = useState(null);
  const [apps, setApps] = useState(null);
  const [appsError, setAppsError] = useState(false);
  useEffect(() => {
    let active = true;
    setApps(null);
    setAppsError(false);
    window.AUTH.profile().then(setMe).catch(() => {});
    window.DB.myGrant(grantType || "au_r3").then(g => setGrant(g || false)).catch(() => setGrant(false));
    window.DB.myApplications(grantType || undefined)
      .then(items => { if (active) setApps(items || []); })
      .catch(() => { if (active) setAppsError(true); });
    return () => { active = false; };
  }, [grantType]);
  const isR3 = grantType === "au_r3";
  const isR4 = grantType === "au_r4";
  const isSingle = isR3 || isR4;
  const exampleSteps = isR4 ? R4_PIPELINE : R3_PIPELINE;
  const singleGrant = isSingle && grant && grant.grant_type === grantType ? grant : null;
  const r3PayLabel = { approved: "Awaiting Finance Completion", active: "At Finance", completed: "Completed" };
  const pays = grant && grant.payments && grant.payments.length ? grant.payments.slice().sort((a, b) => a.instalment - b.instalment) : [];
  const grantTotal = grant ? Number(grant.approved_amount || grant.requested_amount || 0) : 0;
  const paidTotal = pays.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
  const progressPct = grantTotal > 0 ? Math.round(paidTotal / grantTotal * 100) : 0;
  const displayPays = pays.length ? pays : (grant ? [
    { id: "t1", instalment: 1, pct: 30, amount: Math.round(grantTotal * 0.30), status: "pending" },
    { id: "t2", instalment: 2, pct: 40, amount: grantTotal - 2 * Math.round(grantTotal * 0.30), status: "pending" },
    { id: "t3", instalment: 3, pct: 30, amount: Math.round(grantTotal * 0.30), status: "pending" },
  ] : []);
  return (
    <>
      <PageHeader
        title={sys.code + " · Researcher Dashboard"}
        desc={"Welcome back" + (me ? ", " + me.full_name : "") + ". Here is the status of your " + sys.name + " applications."}
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => navigate("r-switch-system")} title="Switch grant system"><Icon name="Repeat" size={14} /> {sys.code}</button>
            <button className="btn btn-primary" onClick={() => { if (setSelectedApplicationId) setSelectedApplicationId(null); navigate("r-submit"); }}>
              <Icon name="Plus" size={14} /> New Application
            </button>
          </>
        }
      />

      <div className="card card-pad-0 mb-6">
        <div className="card-head">
          <h3>{sys.code} Application Pipeline</h3>
          <div className="grow"></div>
          <span className="badge badge-draft">Example workflow</span>
        </div>
        <div className="card-body">
          <div className="researcher-pipeline-example">
            <p className="text-sm text-muted">{sys.code} application steps.</p>
            <HTimeline steps={exampleSteps} app={{ timeline: {} }} />
          </div>
        </div>
      </div>

      <div className={isSingle ? "grid-2" : ""}>
        {                          }
        {isSingle ? (
          <div className="card card-pad-0">
            <div className="card-head">
              <h3>{isR4 ? "Latest Claim Status" : "Grant Payment Status"}{singleGrant ? " · " + singleGrant.code : ""}</h3>
              <div className="grow"></div>
              {singleGrant && <Badge status={window.DB.statusBadge(singleGrant.status, singleGrant.grant_type)} />}
            </div>
            <div className="card-body">
              {apps === null && !appsError && <div className="text-sm text-muted">Loading…</div>}
              {apps && !singleGrant && <Empty title={isR4 ? "No approved claim yet" : "No approved conference grant yet"} desc={isR4 ? "Once IRAS approves your publication claim, its payment status appears here." : "Once your paper presentation grant is approved, its payment status appears here."} icon="Coins" />}
              {singleGrant && (
                <>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 17, marginBottom: 4 }}>{singleGrant.title}</div>
                  <div className="text-sm text-muted mb-4">{(singleGrant.pub_info && singleGrant.pub_info.journal) || (singleGrant.conference_info && singleGrant.conference_info.confName) || singleGrant.faculty || "—"}</div>
                  <div className="meta-row"><span className="l">Application ID</span><span className="r">{singleGrant.code}</span></div>
                  {isR4 && singleGrant.pub_info && <div className="meta-row"><span className="l">Journal</span><span className="r">{singleGrant.pub_info.journal}{singleGrant.pub_info.indexLabel ? " · " + singleGrant.pub_info.indexLabel : ""}</span></div>}
                  {isR3 && singleGrant.conference_info && <div className="meta-row"><span className="l">Conference</span><span className="r">{singleGrant.conference_info.confName}</span></div>}
                  <div className="meta-row"><span className="l">{isR4 ? "Requested claim" : "Requested amount"}</span><span className="r">{fmtBaht(Number(singleGrant.requested_amount || 0))}</span></div>
                  <div className="meta-row"><span className="l">{isR4 ? "IRAS-approved amount" : "Approved amount"}</span><span className="r">{singleGrant.approved_amount ? fmtBaht(Number(singleGrant.approved_amount)) : "—"}</span></div>
                  <div className="meta-row"><span className="l">Payment status</span><span className="r">{r3PayLabel[singleGrant.status] || "Pending"}</span></div>
                  <div className="meta-row"><span className="l">Payment date</span><span className="r">{["active", "completed"].includes(singleGrant.status) ? window.DB.fmtDate(singleGrant.updated_at || singleGrant.decided_at) : "—"}</span></div>
                </>
              )}
            </div>
          </div>
        ) : (
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Payment Progress{grant ? " · " + grant.code : ""}</h3>
            <div className="grow"></div>
            {grant && <Badge status={window.DB.statusBadge(grant.status)} />}
          </div>
          <div className="card-body">
            {grant === null && <div className="text-sm text-muted">Loading…</div>}
            {grant === false && <Empty title="No approved grant yet" desc="Once your application is approved, your 30 / 40 / 30 Finance approvals appear here." icon="Coins" />}
            {grant && (
              <>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 17, marginBottom: 4 }}>
                  {grant.title}
                </div>
                <div className="text-sm text-muted mb-4">{grant.faculty || "—"}{grant.department ? " · " + grant.department : ""}</div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted">Finance approval progress</span>
                  <span className="text-sm font-semi">{fmtBaht(paidTotal)} of {fmtBaht(grantTotal)} paid</span>
                </div>
                <div className="progress mb-4">
                  <div className="bar" style={{ width: progressPct + "%" }}></div>
                </div>

                <div className="grid-3">
                  {displayPays.map(p => (
                    <div key={p.id} style={{
                      padding: 14, border: "1px solid var(--line)",
                      borderRadius: "var(--r-md)", background: "var(--paper-warm)",
                    }}>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Phase {p.instalment} · {p.pct}%</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, margin: "4px 0" }}>
                        {fmtBaht(p.amount)}
                      </div>
                      <span className={"badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")}><span className="dot"></span>{p.status === "paid" ? "Paid" : "Pending Payment"}</span>
                    </div>
                  ))}
                </div>

              </>
            )}
          </div>
        </div>
        )}

        {                                                                            }
        {isSingle && <div className="card card-pad-0">
          <div className="card-head">
            <h3>My Applications</h3>
          </div>
          <div style={{ padding: "8px 0" }}>
            {appsError && <div className="text-sm text-muted" role="status" style={{ padding: "12px 20px" }}>Could not load applications. Please refresh to try again.</div>}
            {apps === null && !appsError && <div style={{ padding: "12px 20px", color: "var(--ink-3)", fontSize: 12 }}>Loading…</div>}
            {apps && apps.length === 0 && <div style={{ padding: "16px 20px" }}><Empty title="No applications yet" desc={isR4 ? "Submit your first publication reward application to get started." : isR3 ? "Submit your first paper presentation grant application to get started." : "Submit your first research grant application to get started."} icon="FilePlus" /></div>}
            {(apps || []).slice(0, 6).map((a, i) => (
              <div key={a.id} style={{
                display: "flex", gap: 12, alignItems: "center", padding: "10px 20px", cursor: "pointer",
                borderBottom: i < Math.min(apps.length, 6) - 1 ? "1px solid var(--line-2)" : "none",
              }} onClick={() => { if (setSelectedApplicationId) setSelectedApplicationId(a.id); navigate("r-detail"); }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title || "Untitled application"}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{a.code} · {window.DB.fmtDate(a.submitted_at || a.created_at)}</div>
                </div>
                <Badge status={a.statusBadge || window.DB.statusBadge(a.status, a.grant_type)} />
              </div>
            ))}
          </div>
        </div>}
      </div>

    </>
  );
}

function researcherSnapshotFromDraft(draft) {
  return {
    nameTitle: String(draft.title2 || "").trim(),
    academicPosition: String(draft.academicPosition || "").trim(),
    fullName: String(draft.name || "").trim(),
    auId: String(draft.auId || "").trim(),
    email: String(draft.email || "").trim().toLowerCase(),
    phone: normalizeThaiPhone(draft.phone),
    officeRoom: String(draft.office || "").trim(),
    joinedDate: draft.joinedDate || null,
    faculty: draft.school || "",
    department: draft.department || "",
  };
}
const roStyle = { background: "var(--paper-warm)", color: "var(--ink-2)", cursor: "not-allowed" };




async function uploadAllDocuments(appId, files) {
  const results = await Promise.all((files || []).map(it =>
    window.DB.uploadDocument(appId, it.file, it.docType || null)
      .then(() => null)
      .catch(() => (it.file && it.file.name) || "a file")
  ));
  return results.filter(Boolean);
}




function ReturnNotice({ info }) {
  if (!info) return null;
  const who = (info.actor && info.actor.full_name) || ({ dean: "The Dean", iras: "IRAS" }[info.actor_role] || "A reviewer");
  return (
    <div style={{ border: "1px solid var(--au-gold)", background: "var(--au-gold-soft)", borderRadius: "var(--r-md)", padding: "14px 16px", marginBottom: 18, display: "flex", gap: 12 }}>
      <Icon name="AlertCircle" size={20} style={{ color: "var(--au-gold-deep)", flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
          Returned for revision — {who}{info.created_at ? " · " + window.DB.fmtDate(info.created_at) : ""}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {info.note || "No reason was recorded."}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
          Your previous answers are already filled in below — update only what is asked for (add the missing file or fix the details), then submit again.
        </div>
      </div>
    </div>
  );
}

function ApplicationDecisionNotice({ app }) {
  if (!app || !["returned", "rejected"].includes(app.status)) return null;
  const events = (app.events || []).filter(event => event.to_status === app.status);
  events.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const decision = events[0] || null;
  const actorName = decision && decision.actor && decision.actor.full_name
    ? decision.actor.full_name
    : ({ dean: "Dean", iras: "IRAS", ofm: "Finance Office" }[(decision && decision.actor_role) || ""] || "Reviewer");
  const rejected = app.status === "rejected";
  const reason = decision && String(decision.note || "").trim();
  return (
    <div style={{
      border: "1px solid " + (rejected ? "var(--au-crimson)" : "var(--au-gold)"),
      borderLeft: "4px solid " + (rejected ? "var(--au-crimson)" : "var(--au-gold)"),
      background: rejected ? "var(--au-crimson-soft)" : "var(--au-gold-soft)",
      borderRadius: "var(--r-md)", padding: "15px 18px", marginBottom: 20,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <Icon name={rejected ? "X" : "AlertCircle"} size={21} style={{ color: rejected ? "var(--au-crimson)" : "var(--au-gold-deep)", flexShrink: 0, marginTop: 1 }} />
      <div>
        <div style={{ fontWeight: 700, color: rejected ? "var(--au-crimson)" : "var(--ink-1)", marginBottom: 4 }}>
          {rejected ? "Application rejected" : "Returned for revision"} · {actorName}
          {decision && decision.created_at ? " · " + window.DB.fmtDate(decision.created_at) : ""}
        </div>
        <div style={{ color: "var(--ink-2)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          <strong>Reason:</strong> {reason || "No reason was recorded."}
        </div>
      </div>
    </div>
  );
}

function grantSystemFor(id) {
  const list = (RA && RA.GRANT_SYSTEMS) || [];
  return list.find(s => s.id === id) || list[0] || { id: "au_r3", code: "AU-R3", name: "Paper Presentation Grant", maxAmount: 3500, collaborative: true };
}

function fmtNiceDate(iso) {
  if (!iso) return "";
  var d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

function safeDocumentDisplayName(doc) {
  const name = String((doc && doc.name) || "");
  if (/\bau[-_\s]?r1\b/i.test(name)) return (doc && doc.doc_type) || "Uploaded document";
  return name || (doc && doc.doc_type) || "Uploaded document";
}

function monthsBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  var s = new Date(startISO), e = new Date(endISO);
  if (isNaN(s) || isNaN(e) || e < s) return 0;
  var m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() >= s.getDate()) m += 1;
  return Math.max(1, m);
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function UniversityJoinedDateField({ value, onChange, readOnly = false }) {
  const service = universityServiceEligibility(value);
  return (
    <div className="field">
      <label>Date Joined Assumption University *</label>
      {readOnly
        ? <input value={value ? fmtNiceDate(value) : "Not set — contact the administrator"} readOnly style={roStyle} />
        : <AUDatePicker value={value} onChange={onChange} min="1969-01-01" max={todayISO()} placeholder="Select joined date…" />}
      {value && (
        <div style={{ fontSize: 11, marginTop: 5, color: service.eligible ? "var(--status-approved)" : "var(--au-crimson)", fontWeight: 650 }}>
          {service.eligible
            ? "University service: " + service.months + " months · Eligible."
            : "University service: " + service.months + " months · Not eligible until " + fmtNiceDate(service.eligibleOn) + "."}
        </div>
      )}
    </div>
  );
}


const R3_DEFAULT_DRAFT = {
  confName: "", organizer: "", website: "", confType: "International", conferenceLocation: "",
  presentationDate: "", presentation: "Oral Presentation", journalDb: "", journalClassification: "",
  paperTitle: "", field: "", keywords: "", corresponding: "", paperAbstract: "", authorType: "Lead Author",
  name: "", title2: "", academicPosition: "", auId: "", email: "", phone: "", office: "", joinedDate: "", school: "", department: "",
};

function ResearcherSubmitR3({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId }) {
  const fixedGrantAmount = 3500;
  const [draft, setDraft] = useState({ ...R3_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const classificationOptions = (RA.R4_JOURNAL_CLASSIFICATIONS || {})[draft.journalDb] || null;

  const [authors, setAuthors] = useState([]);
  const addAuthor = () => setAuthors(m => m.concat([{ name: "", authorType: "Co-author", kind: "Researcher", auId: "", email: "" }]));
  const setAuthor = (i, k, v) => setAuthors(m => m.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const removeAuthor = (i) => setAuthors(m => m.filter((_, j) => j !== i));

  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("Full Conference Paper");
  const onFiles = (e) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs.map(f => ({ file: f, docType })))); e.target.value = ""; };
  const [editingId, setEditingId] = useState(applicationId || null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(!!applicationId);
  const [returnInfo, setReturnInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyKind, setBusyKind] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await window.AUTH.profile();
        if (p && p.office_room) setDraft(d => ({ ...d, office: d.office || p.office_room }));
        if (p && !applicationId) setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, joinedDate: p.joined_date || d.joinedDate, school: (RA.FACULTIES.some(f => f.name === p.faculty) ? p.faculty : d.school), department: (RA.FACULTIES.some(f => f.name === p.faculty) ? (p.department || d.department) : d.department), phone: normalizeThaiPhone(p.phone || d.phone), office: p.office_room || d.office }));
      } catch (e) {}
    })();
  }, [applicationId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!applicationId) { setEditingId(null); setExistingDocs([]); setFiles([]); setLoadingDraft(false); return; }
      setLoadingDraft(true); setErr("");
      try {
        const app = await window.DB.applicationDetail(applicationId);
        if (!app || ["draft", "returned"].indexOf(app.status) === -1) {
          if (!cancelled) { setEditingId(null); setExistingDocs([]); setErr("Only draft or returned applications can be edited here."); }
          return;
        }
        if (cancelled) return;
        const ci = app.conference_info || {};
        const researcherInfo = submittedResearcherInfo(app);
        setEditingId(app.id);
        if (app.status === "returned") { window.DB.lastReturnReason(app.id).then(r => { if (!cancelled) setReturnInfo(r); }).catch(() => {}); } else setReturnInfo(null);
        setExistingDocs(app.documents || []);
        setDraft(d => ({
          ...d,
          confName: ci.confName || "", organizer: ci.organizer || "", website: ci.website || "",
          confType: ci.confType || "International",
          conferenceLocation: ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", "),
          presentationDate: ci.presentationDate || ci.confStart || app.start_date || "",
          presentation: ci.presentation || "Oral Presentation",
          journalDb: ci.journalDb || "", journalClassification: ci.journalClassification || "",
          paperTitle: app.title || "", field: app.field || "", keywords: app.keywords || "",
          corresponding: ci.correspondingAuthor || "", paperAbstract: ci.paperAbstract || "", authorType: ci.authorType || "Lead Author",
          joinedDate: researcherInfo.joinedDate || "",
          school: researcherInfo.faculty || app.faculty || d.school,
          department: researcherInfo.department || app.department || d.department,
          name: researcherInfo.fullName || d.name,
          title2: researcherInfo.nameTitle || d.title2,
          academicPosition: researcherInfo.academicPosition || d.academicPosition,
          auId: researcherInfo.auId || d.auId,
          email: researcherInfo.email || d.email,
          phone: researcherInfo.phone || d.phone,
          office: researcherInfo.officeRoom || d.office,
        }));
        setAuthors(Array.isArray(app.co_members) ? app.co_members.map(m => ({ ...m, authorType: m.authorType || "Co-author" })) : []);
      } catch (e) { if (!cancelled) setErr((e && e.message) || "Could not load this draft."); }
      finally { if (!cancelled) setLoadingDraft(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [applicationId]);

  const deleteExistingDoc = (doc) => {
    const runDelete = async () => {
      try { await window.DB.deleteDocument(doc); setExistingDocs(ds => ds.filter(d => d.id !== doc.id)); toast(doc.name + " deleted."); }
      catch (ex) { toast("Delete error: " + ((ex && ex.message) || ex)); }
    };
    if (setConfirm) setConfirm({ kind: "danger", title: "Delete uploaded file?", message: doc.name + " will be removed from this draft and from storage.", confirmLabel: "Delete File", onConfirm: runDelete });
    else runDelete();
  };

  async function save(submit) {
    setErr("");
    if (submit && !draft.confName.trim()) { setErr("Enter the conference name."); return; }
    if (submit && !draft.organizer.trim()) { setErr("Enter the conference organizer."); return; }
    if (submit && !draft.conferenceLocation.trim()) { setErr("Enter the conference location."); return; }
    if (submit && !draft.presentationDate) { setErr("Select the presentation date."); return; }
    if (submit && !draft.paperTitle.trim()) { setErr("Enter the paper title."); return; }
    if (submit && !draft.field.trim()) { setErr("Enter the research field."); return; }
    if (submit && !draft.corresponding.trim()) { setErr("Enter the corresponding author."); return; }
    if (submit && !draft.paperAbstract.trim()) { setErr("Enter the paper abstract."); return; }
    if (submit && !draft.journalDb) { setErr("Select the Conference Database / Index."); return; }
    if (submit && !draft.journalClassification.trim()) { setErr("Select or enter the conference classification."); return; }
    if (submit && !draft.school) { setErr("Select your faculty so the application routes to the right reviewers."); return; }
    if (submit && !draft.name.trim()) { setErr("Enter your full name."); return; }
    if (submit && !draft.email.trim()) { setErr("Enter your AU email address."); return; }
    if (submit && !draft.joinedDate) { setErr("Your account has no Date Joined AU. Ask the administrator to add it in User Management."); return; }
    if (submit && !universityServiceEligibility(draft.joinedDate).eligible) { setErr("You are not eligible yet. AU-R3 applicants must have at least one year of service at Assumption University."); return; }
    if (submit && draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim())) { setErr("Email must be an Assumption University address ending in @au.edu."); return; }
    if (submit && draft.phone && !isValidThaiPhone(draft.phone)) { setErr("Phone must be a Thai number with 9–10 digits starting with 0."); return; }
    if (submit) {
      const selectedTypes = existingDocs.map(d => d.doc_type).concat(files.map(f => f.docType));
      const missingDocs = (RA.R3_DOC_TYPES || []).filter(t => selectedTypes.indexOf(t) === -1);
      if (missingDocs.length) { setErr("Upload all three required documents. Missing: " + missingDocs.join(", ") + "."); return; }
    }
    setBusy(true); setBusyKind(submit ? "submit" : "draft");
    try {
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department, office_room: draft.office }); } catch (e) {}
      const researcherSnapshot = researcherSnapshotFromDraft(draft);
      const confInfo = {
        confName: draft.confName, organizer: draft.organizer, website: draft.website,
        confType: draft.confType, conferenceLocation: draft.conferenceLocation,
        presentationDate: draft.presentationDate || null,
        presentation: draft.presentation || "Oral Presentation",
        journalDb: draft.journalDb, journalClassification: draft.journalClassification,
        correspondingAuthor: draft.corresponding, paperAbstract: draft.paperAbstract, authorType: draft.authorType,
        researcherSnapshot,
        researcherName: researcherSnapshot.fullName,
        researcherEmail: researcherSnapshot.email,
        researcherTitle: researcherSnapshot.nameTitle,
        researcherAuId: researcherSnapshot.auId,
        researcherPhone: researcherSnapshot.phone,
        researcherOffice: researcherSnapshot.officeRoom,
        researcherJoinedDate: researcherSnapshot.joinedDate,
      };
      const app = await window.DB.createApplication({
        title: draft.paperTitle, abstract: draft.paperAbstract, field: draft.field,
        faculty: draft.school, department: draft.department, keywords: draft.keywords,
        requested_amount: fixedGrantAmount, duration_months: 1,
        start_date: draft.presentationDate || null, end_date: draft.presentationDate || null,
        budget_breakdown: [{ item: "Fixed AU-R3 Grant", amount: fixedGrantAmount }],
        grant_type: "au_r3",
        co_members: authors.filter(m => (m.name || "").trim()),
        conference_info: confInfo,
      }, submit, editingId);
      const failedUploads = await uploadAllDocuments(app.id, files);
      if (!submit) { setEditingId(app.id);
        if (setSelectedApplicationId) setSelectedApplicationId(app.id); }
      else if (setSelectedApplicationId) setSelectedApplicationId(null);
      if (failedUploads.length) {
        toast(failedUploads.length + " file(s) could not be uploaded: " + failedUploads.join(", ") + ". Open the application and add them again.");
      } else {
        toast(submit ? ("Application " + app.code + " submitted") : ("Draft " + app.code + " saved"));
      }
      navigate("r-applications");
    } catch (ex) { setErr((ex && ex.message) || "Could not save the application."); setBusy(false); }
  }

  if (loadingDraft) {
    return <><PageHeader title="Edit AU-R3 Application" desc="Loading saved draft." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading draft...</div></>;
  }

  const emailBad = draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim());
  const facultyValid = RA.FACULTIES.some(f => f.name === draft.school);
  const deptOptions = (RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments;
  const deptValid = facultyValid && deptOptions.indexOf(draft.department) >= 0;
  return (
    <>
      <PageHeader
        title={(editingId ? "Edit " : "Submit ") + "AU-R3 Application"}
        desc="Paper Presentation Grant — fixed support of 3,500 THB for an accepted conference paper."
        actions={
          <>
            <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>{busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"}</button>
            <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>
              <Icon name="Send" size={13} /> {busy ? (busyKind === "submit" ? (files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…") : "Saving draft…") : "Submit Application"}
            </button>
          </>
        }
      />

      <ReturnNotice info={returnInfo} />

      <div className="card card-pad-0">
        <div className="form-section">
          <h4><span className="num">1</span> Conference Information</h4>
          <p className="section-sub">The conference where your paper has been accepted for presentation.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field full">
                <label>Conference Name</label>
                <input value={draft.confName} onChange={e => upd("confName", e.target.value)} placeholder="e.g. International Conference on Machine Learning 2027" />
              </div>
              <div className="field">
                <label>Conference Organizer</label>
                <input value={draft.organizer} onChange={e => upd("organizer", e.target.value)} placeholder="e.g. IEEE, ACM, professional association" />
              </div>
              <div className="field">
                <label>Conference Website</label>
                <input value={draft.website} onChange={e => upd("website", e.target.value)} placeholder="https://…" />
              </div>
              <div className="field">
                <label>Conference Type</label>
                <select value={draft.confType} onChange={e => upd("confType", e.target.value)}>
                  {(RA.R3_CONFERENCE_TYPES || ["Domestic", "International"]).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Presentation Type</label>
                <select value={draft.presentation} onChange={e => upd("presentation", e.target.value)}>
                  <option value="Oral Presentation">Oral Presentation</option>
                  <option value="Poster Presentation">Poster Presentation</option>
                </select>
              </div>
              <div className="field full">
                <label>Conference Location *</label>
                <input value={draft.conferenceLocation} onChange={e => upd("conferenceLocation", e.target.value)} placeholder="Type the venue, city, and country" />
              </div>
              <div className="field">
                <label>Presentation Date *</label>
                <AUDatePicker value={draft.presentationDate} onChange={v => upd("presentationDate", v)} placeholder="Select presentation date…" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">2</span> Research Paper Information</h4>
          <p className="section-sub">The accepted paper you will present.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field full">
                <label>Paper Title</label>
                <input value={draft.paperTitle} onChange={e => upd("paperTitle", e.target.value)} />
              </div>
              <div className="field">
                <label>Research Field</label>
                <input value={draft.field} onChange={e => upd("field", e.target.value)} />
              </div>
              <div className="field">
                <label>Your Author Type</label>
                <select value={draft.authorType} onChange={e => upd("authorType", e.target.value)}>
                  <option value="Lead Author">Lead Author</option>
                  <option value="Co-author">Co-author</option>
                </select>
              </div>
              <div className="field full">
                <label>Corresponding Author</label>
                <input value={draft.corresponding} onChange={e => upd("corresponding", e.target.value)} placeholder="Name of the corresponding author" />
              </div>
              <div className="field full">
                <label>Abstract *</label>
                <textarea className="comment-input" style={{ minHeight: 90 }} value={draft.paperAbstract} onChange={e => upd("paperAbstract", e.target.value)} placeholder="Paste the paper abstract here." />
              </div>
              <div className="field full">
                <label>Keywords</label>
                <input value={draft.keywords} onChange={e => upd("keywords", e.target.value)} placeholder="Enter keywords after the abstract" />
              </div>
            </div>

            <div style={{ marginTop: 6 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Author(s)</div>
              <p className="section-sub" style={{ marginTop: 0 }}>You are the main applicant. Add the other researchers and students who co-authored this paper.</p>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                <table className="tbl">
                  <thead>
                    <tr><th>Name</th><th style={{ width: 140 }}>Author Type</th><th style={{ width: 120 }}>Person Type</th><th style={{ width: 110 }}>AU ID</th><th>Email</th><th style={{ width: 48 }}></th></tr>
                  </thead>
                  <tbody>
                    {authors.length === 0 && (
                      <tr><td colSpan="6" style={{ color: "var(--ink-3)", textAlign: "center", padding: "14px" }}>No additional authors added — you are the sole author.</td></tr>
                    )}
                    {authors.map((m, i) => (
                      <tr key={i}>
                        <td><input value={m.name} onChange={e => setAuthor(i, "name", e.target.value)} placeholder="Full name" style={{ width: "100%", minWidth: 140 }} /></td>
                        <td>
                          <select value={m.authorType || "Co-author"} onChange={e => setAuthor(i, "authorType", e.target.value)}>
                            <option value="Lead Author">Lead Author</option>
                            <option value="Co-author">Co-author</option>
                          </select>
                        </td>
                        <td>
                          <select value={m.kind} onChange={e => setAuthor(i, "kind", e.target.value)}>
                            <option value="Researcher">Researcher</option>
                            <option value="Student">Student</option>
                          </select>
                        </td>
                        <td><input value={m.auId} onChange={e => setAuthor(i, "auId", e.target.value)} placeholder="ID" style={{ width: "100%", minWidth: 90 }} /></td>
                        <td><input type="email" value={m.email} onChange={e => setAuthor(i, "email", e.target.value)} placeholder="name@au.edu" style={{ width: "100%", minWidth: 150 }} /></td>
                        <td style={{ textAlign: "center" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeAuthor(i)} title="Remove author"><Icon name="Trash2" size={13} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addAuthor}><Icon name="Plus" size={13} /> Add author</button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">3</span> Researcher Information</h4>
          <p className="section-sub">Identity details come from your account. You may update your academic title, position, phone, and office / room here.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Academic Title</label>
                <select value={draft.title2} onChange={e => upd("title2", e.target.value)}>
                  <option value="">Select title…</option>
                  {RA.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Academic / Administrative Position</label>
                <select value={draft.academicPosition} onChange={e => upd("academicPosition", e.target.value)}>
                  <option value="">Select position…</option>
                  {(RA.AU_ACADEMIC_POSITIONS || []).map(position => <option key={position} value={position}>{position}</option>)}
                </select>
              </div>
              <div className="field"><label>Full Name</label><input value={draft.name} readOnly style={roStyle} /></div>
              <div className="field"><label>AU ID</label><input value={draft.auId} readOnly style={roStyle} /></div>
              <div className="field">
                <label>Email (AU only)</label>
                <input type="email" value={draft.email} readOnly style={roStyle} />
              </div>
              <div className="field"><label>Phone</label><ThaiPhoneInput value={draft.phone} onChange={value => upd("phone", value)} /></div>
              <div className="field"><label>Office / Room</label><input value={draft.office} onChange={e => upd("office", e.target.value)} placeholder="e.g. Building A, Room 512" /></div>
              <UniversityJoinedDateField value={draft.joinedDate} onChange={v => upd("joinedDate", v)} readOnly />
              <div className="field">
                <label>Faculty</label>
                <select value={facultyValid ? draft.school : ""} disabled style={roStyle}>
                  <option value="">Select your faculty…</option>
                  {RA.FACULTIES.map(f => <option key={f.code} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Department</label>
                <select value={deptValid ? draft.department : ""} disabled style={roStyle}>
                  <option value="">{draft.school ? "Select department…" : "Select a faculty first"}</option>
                  {(RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">4</span> Conference Classification</h4>
          <p className="section-sub">Select the conference proceedings database and its classification. The AU-R3 grant amount is fixed at 3,500 THB.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field"><label>Conference Database / Index *</label>
                <select value={draft.journalDb} onChange={e => setDraft(d => ({ ...d, journalDb: e.target.value, journalClassification: "" }))}>
                  <option value="">Select database / index…</option>
                  {(RA.R4_JOURNAL_DBS || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Conference Classification *</label>
                {classificationOptions ? (
                  <select value={draft.journalClassification} onChange={e => upd("journalClassification", e.target.value)} disabled={!draft.journalDb}>
                    <option value="">Select classification…</option>
                    {classificationOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <input value={draft.journalClassification} onChange={e => upd("journalClassification", e.target.value)} disabled={!draft.journalDb}
                    placeholder={draft.journalDb === "Other" ? "Enter database / index name manually" : draft.journalDb ? "Enter additional tier" : "Select a database / index first"} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">5</span> Required Documents</h4>
          <p className="section-sub">Upload the AU-R3 PDF documents. You can add or delete files while the application is still waiting for Dean screening.</p>
          <div className="section-body">
            <div style={{ background: "var(--paper-warm)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--ink-2)" }}>Documents required for an AU-R3 Paper Presentation Grant:</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {(RA.PAPER_PRESENTATION_DOCS || []).map(d => (
                  <li key={d.id}><b>{d.name.replace(/_/g, " ").replace(/\.pdf$/i, "")}</b> — {d.role.replace(/^AU-R3 requirement:?\s*/i, "")}</li>
                ))}
              </ul>
            </div>
            {existingDocs.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {existingDocs.map(d => (
                  <div className="file-row" key={d.id || d.name}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta">
                      <div className="fn">{safeDocumentDisplayName(d)}{d.doc_type && safeDocumentDisplayName(d) !== d.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{d.doc_type}</span>}</div>
                      <div className="fs">{d.size || "PDF"} - Uploaded {d.uploadedAt || "-"}</div>
                    </div>
                    <div className="factions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onView(d)}><Icon name="Eye" size={13} /> View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onDownload(d)}><Icon name="Download" size={13} /> Download</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteExistingDoc(d)}><Icon name="Trash2" size={13} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {files.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {files.map((it, i) => (
                  <div className="file-row" key={i}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta">
                      <div className="fn">{it.file.name}{it.docType && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{it.docType}</span>}</div>
                      <div className="fs">{(it.file.size / 1024).toFixed(0)} KB · ready to upload</div>
                    </div>
                    <div className="factions">
                      <button className="btn btn-secondary btn-sm" onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}><Icon name="X" size={13} /> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="field" style={{ maxWidth: 360, marginBottom: 10 }}>
              <label>Document type for the next upload</label>
              <select value={docType} onChange={e => setDocType(e.target.value)}>
                {(RA.R3_DOC_TYPES || RA.DOC_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <label className="upload-box mt-1" style={{ cursor: "pointer", display: "block" }}>
              <input type="file" accept="application/pdf,.pdf" multiple style={{ display: "none" }} onChange={onFiles} />
              <Icon name="Upload" size={26} className="icon" />
              <div className="t">Click to upload your <b>{docType}</b></div>
              <div className="s">PDF · max 10 MB per file</div>
            </label>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", background: "var(--paper-warm)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {err && <div style={{ color: "var(--au-crimson)", fontSize: 12, alignSelf: "center", marginRight: "auto" }}>{err}</div>}
          <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>{busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"}</button>
          <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>
            <Icon name="Send" size={13} /> {busy ? (busyKind === "submit" ? (files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…") : "Saving draft…") : "Submit Application"}
          </button>
        </div>
      </div>
    </>
  );
}


const R4_DEFAULT_DRAFT = {
  title: "", articleType: "Research Article", pubStatus: "Published",
  journal: "", publisher: "", website: "", articleUrl: "", doi: "", issn: "",
  acceptDate: "", pubDate: "", volume: "", issue: "", pageNumber: "", academicYear: "2025",
  journalDb: "", journalClassification: "", predatory: false,
  applicantRole: "First Author",
  name: "", title2: "", academicPosition: "", auId: "", email: "", phone: "", office: "", joinedDate: "", school: "", department: "",
  feePaid: "", feeDate: "",
  turnitin: "",
};
function ResearcherSubmitR4({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId }) {
  const sys = grantSystemFor("au_r4");
  const MAX = 80000;
  const [draft, setDraft] = useState({ ...R4_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const [authors, setAuthors] = useState([{ name: "", type: "First Author", email: "", contribution: "100" }]);
  const addAuthor = () => setAuthors(a => a.concat([{ name: "", type: "Co-author", email: "", contribution: "" }]));
  const setAuthor = (i, k, v) => setAuthors(list => {
    if (k !== "contribution") return list.map((r, j) => j === i ? { ...r, [k]: v } : r);
    const cleaned = (v + "").replace(/[^0-9.]/g, "");
    if (list.length !== 2 || cleaned === "" || !Number.isFinite(Number(cleaned))) {
      return list.map((r, j) => j === i ? { ...r, contribution: cleaned } : r);
    }
    const entered = Math.max(0, Math.min(100, Number(cleaned)));
    const normalized = String(Math.round(entered * 100) / 100);
    const complement = String(Math.round((100 - entered) * 100) / 100);
    return list.map((r, j) => j === i ? { ...r, contribution: normalized } : { ...r, contribution: complement });
  });
  const removeAuthor = (i) => setAuthors(a => a.length > 1 ? a.filter((_, j) => j !== i) : a);

  // One acknowledgement covers the published AU-R4 eligibility rules.  Keep the
  // stored array shape for older applications, but do not make researchers tick
  // seven copies of the same acknowledgement.
  const [decls, setDecls] = useState((RA.R4_DECLARATIONS || []).map(() => false));
  const allDecl = decls.length > 0 && decls.every(Boolean);

  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("Full Research Article");
  const onFiles = (e) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs.map(f => ({ file: f, docType })))); e.target.value = ""; };
  const onTypedFiles = (e, type) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs.map(f => ({ file: f, docType: type })))); e.target.value = ""; };
  const [editingId, setEditingId] = useState(applicationId || null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(!!applicationId);
  const [returnInfo, setReturnInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyKind, setBusyKind] = useState(null);
  const [err, setErr] = useState("");

  const published = draft.pubStatus === "Published";
  const classificationOptions = (RA.R4_JOURNAL_CLASSIFICATIONS || {})[draft.journalDb] || null;
  const tierSelected = draft.journalDb === "TCI" && ["Tier 1", "Tier 2"].includes(draft.journalClassification);
  const automaticReward = draft.journalDb === "SCOPUS"
    ? ({ Q1: 80000, Q2: 60000, Q3: 50000, Q4: 40000 })[draft.journalClassification] || 0
    : draft.journalDb === "Web of Science (WoS)" ? 80000
    : ["ERIC", "MathSciNet", "PubMed", "JSTOR", "Project MUSE"].includes(draft.journalDb) ? 25000 : 0;
  const requested = tierSelected ? Math.min(MAX, Number(draft.feePaid) || 0) : automaticReward;
  const catLabel = [draft.journalDb, draft.journalClassification].filter(Boolean).join(" — ");
  const showPreliminaryReward = !!draft.journalDb && !!draft.journalClassification.trim() && !tierSelected;
  const totalContrib = authors.reduce((s, a) => s + (Number(a.contribution) || 0), 0);
  const hasSecondAuthor = authors.length > 1;
  const firstContrib = Number((authors.find(a => a.type === "First Author") || {}).contribution) || 0;
  const turnitinNum = Number(draft.turnitin);
  const turnitinBad = draft.turnitin !== "" && turnitinNum > 20;
  const emailBad = draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim());
  const facultyValid = RA.FACULTIES.some(f => f.name === draft.school);
  const deptOptions = (RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments;
  const deptValid = facultyValid && deptOptions.indexOf(draft.department) >= 0;
  const isAuthorContributionDocument = (doc) => (((doc && (doc.doc_type || doc.docType)) || "") + " " + ((doc && (doc.name || (doc.file && doc.file.name))) || "")).toLowerCase().includes("author contribution");
  const contributionExistingDocs = existingDocs.filter(isAuthorContributionDocument);
  const contributionFiles = files.filter(isAuthorContributionDocument);
  // A legacy contribution statement should remain visible in the normal file
  // list if the researcher removes the second author from an edited draft.
  const otherExistingDocs = existingDocs.filter(doc => !hasSecondAuthor || !isAuthorContributionDocument(doc));
  const otherFiles = files.filter(file => !hasSecondAuthor || !isAuthorContributionDocument(file));
  const hasDocument = (keyword) => existingDocs.concat(files.map(it => ({ name: it.file.name, doc_type: it.docType })))
    .some(d => (((d && d.doc_type) || "") + " " + ((d && d.name) || "")).toLowerCase().includes(keyword));

  useEffect(() => {
    if (!hasSecondAuthor && /author contribution/i.test(docType)) setDocType("Full Research Article");
  }, [hasSecondAuthor, docType]);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.AUTH.profile();
        if (p && p.office_room) setDraft(d => ({ ...d, office: d.office || p.office_room }));
        if (p && !applicationId) {
          setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, joinedDate: p.joined_date || d.joinedDate, school: (RA.FACULTIES.some(f => f.name === p.faculty) ? p.faculty : d.school), department: (RA.FACULTIES.some(f => f.name === p.faculty) ? (p.department || d.department) : d.department), phone: normalizeThaiPhone(p.phone || d.phone), office: p.office_room || d.office }));
          setAuthors(a => a.map((r, i) => i === 0 ? { ...r, name: p.full_name || r.name, email: p.email || r.email } : r));
        }
      } catch (e) {}
    })();
  }, [applicationId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!applicationId) { setEditingId(null); setExistingDocs([]); setFiles([]); setLoadingDraft(false); return; }
      setLoadingDraft(true); setErr("");
      try {
        const app = await window.DB.applicationDetail(applicationId);
        if (!app || ["draft", "returned"].indexOf(app.status) === -1) {
          if (!cancelled) { setEditingId(null); setExistingDocs([]); setErr("Only draft or returned applications can be edited here."); }
          return;
        }
        if (cancelled) return;
        const pi = app.pub_info || {};
        const researcherInfo = submittedResearcherInfo(app);
        setEditingId(app.id);
        if (app.status === "returned") { window.DB.lastReturnReason(app.id).then(r => { if (!cancelled) setReturnInfo(r); }).catch(() => {}); } else setReturnInfo(null);
        setExistingDocs(app.documents || []);
        let loadedDb = pi.journalDb || "";
        let loadedClassification = pi.journalClassification || "";
        if (loadedDb === "TCI Tier 1" || loadedDb === "TCI Tier 2") {
          loadedClassification = loadedDb.replace("TCI ", "");
          loadedDb = "TCI";
        } else if (loadedDb === "Web of Science") {
          loadedDb = "Web of Science (WoS)";
          loadedClassification = loadedClassification || pi.wosIndex || "SCIE";
        } else if (loadedDb === "Project Muse") {
          loadedDb = "Project MUSE";
        } else if (loadedDb === "SCOPUS") {
          loadedClassification = loadedClassification || pi.quartile || "Q1";
        }
        setDraft(d => ({ ...d, ...pi,
          journalDb: loadedDb,
          journalClassification: loadedClassification,
          applicantRole: /corresponding|co-?author/i.test(pi.applicantRole || "") ? "Co-author" : "First Author",
          pubStatus: /^accepted for publication$/i.test(pi.pubStatus || "") ? "Accepted for Publication" : (pi.pubStatus || d.pubStatus),
          academicYear: ((String(pi.academicYear || d.academicYear).match(/\d{4}/) || ["2025"])[0]),
          joinedDate: researcherInfo.joinedDate || "",
          pageNumber: pi.pageNumber || ([pi.startPage, pi.endPage].filter(Boolean).join("–")),
          title: app.title || "",
          school: researcherInfo.faculty || app.faculty || d.school,
          department: researcherInfo.department || app.department || d.department,
          name: researcherInfo.fullName || d.name,
          title2: researcherInfo.nameTitle || d.title2,
          academicPosition: researcherInfo.academicPosition || d.academicPosition,
          auId: researcherInfo.auId || d.auId,
          email: researcherInfo.email || d.email,
          phone: researcherInfo.phone || d.phone,
          office: researcherInfo.officeRoom || d.office,
        }));
        if (Array.isArray(app.co_members) && app.co_members.length) {
          setAuthors(app.co_members.map((a, i) => ({
            name: a.name || "",
            // Keep older drafts usable while presenting the current AU-R4 role
            // name.  "Corresponding Author" was retired in favour of Co-author.
            type: /corresponding|co-?author/i.test(a.type || "") ? "Co-author" : "First Author",
            email: a.email || "",
            contribution: a.contribution === undefined || a.contribution === null ? (i === 0 ? "100" : "") : String(a.contribution),
          })));
        }
        if (pi.declarations && Array.isArray(pi.declarations)) {
          const accepted = !!pi.predatory && pi.declarations.every(Boolean);
          setDecls((RA.R4_DECLARATIONS || []).map(() => accepted));
        }
      } catch (e) { if (!cancelled) setErr((e && e.message) || "Could not load this draft."); }
      finally { if (!cancelled) setLoadingDraft(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [applicationId]);

  const deleteExistingDoc = (doc) => {
    const runDelete = async () => {
      try { await window.DB.deleteDocument(doc); setExistingDocs(ds => ds.filter(d => d.id !== doc.id)); toast(doc.name + " deleted."); }
      catch (ex) { toast("Delete error: " + ((ex && ex.message) || ex)); }
    };
    if (setConfirm) setConfirm({ kind: "danger", title: "Delete uploaded file?", message: doc.name + " will be removed from this draft and from storage.", confirmLabel: "Delete File", onConfirm: runDelete });
    else runDelete();
  };

  async function save(submit) {
    setErr("");
    if (submit) {
      if (!draft.title.trim()) return setErr("Enter the article title.");
      if (!draft.journal.trim()) return setErr("Enter the journal name.");
      if (!draft.website.trim()) return setErr("Enter the journal website.");
      if (!draft.issn.trim()) return setErr("Enter the ISSN or eISSN.");
      if (!draft.journalDb) return setErr("Select the Journal Database / Index.");
      if (!draft.journalClassification.trim()) return setErr("Select or enter the journal classification.");
      if (published && !draft.articleUrl.trim()) return setErr("Enter the Article URL for the published article.");
      if (published && !draft.pageNumber.trim()) return setErr("Enter the Page Number(s) for the published article.");
      if (!published && !draft.acceptDate) return setErr("Select the Acceptance Date.");
      if (!draft.school) return setErr("Your faculty is required so the application routes to your Dean.");
      if (!draft.joinedDate) return setErr("Your account has no Date Joined AU. Ask the administrator to add it in User Management.");
      if (!universityServiceEligibility(draft.joinedDate).eligible) return setErr("You are not eligible yet. AU-R4 applicants must have at least one year of service at Assumption University.");
      if (emailBad) return setErr("Email must be an Assumption University address ending in @au.edu.");
      if (draft.phone && !isValidThaiPhone(draft.phone)) return setErr("Phone must be a Thai number with 9–10 digits starting with 0.");
      if (!draft.predatory) return setErr("You must confirm the journal is not a predatory / Beall's List journal.");
      if (turnitinBad) return setErr("Turnitin similarity exceeds the 20% limit — it must be 20% or lower.");
      if (draft.turnitin === "") return setErr("Enter the Turnitin similarity percentage.");
      if (Math.round(totalContrib) !== 100) return setErr("Author contribution percentages must total 100% (currently " + totalContrib + "%).");
      if (authors.filter(a => a.type === "First Author").length !== 1) return setErr("List exactly one First Author; every additional author must be a Co-author.");
      if (firstContrib < 50) return setErr("The first author must have at least 50% contribution.");
      const lowCo = authors.some(a => Number(a.contribution) > 0 && Number(a.contribution) < 5);
      if (lowCo) return setErr("Each listed author must have at least 5% contribution.");
      if (authors.some(a => !a.name.trim() || !a.email.trim())) return setErr("Enter the name and email address for every listed author.");
      if (hasSecondAuthor && !hasDocument("author contribution")) return setErr("Attach the Author Contribution Statement for the second author.");
      if (!published && !hasDocument("acceptance")) return setErr("Attach the Acceptance Letter.");
      if (requested > MAX) return setErr("The requested claim exceeds the AU-R4 maximum of 80,000 THB per article.");
      if (tierSelected && requested <= 0) return setErr("Enter the publication fee for the selected journal tier.");
      if (!allDecl) return setErr("Read and accept the eligibility declaration before submitting.");
    }
    setBusy(true); setBusyKind(submit ? "submit" : "draft");
    try {
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department, office_room: draft.office }); } catch (e) {}
      const researcherSnapshot = researcherSnapshotFromDraft(draft);
      const pubInfo = {
        articleType: draft.articleType, pubStatus: draft.pubStatus, journal: draft.journal, publisher: draft.publisher,
        website: draft.website, articleUrl: published ? draft.articleUrl : null, doi: published ? draft.doi : null, issn: draft.issn || null,
        acceptDate: draft.acceptDate || null, pubDate: draft.pubDate || null,
        volume: draft.volume, issue: draft.issue, pageNumber: draft.pageNumber, academicYear: draft.academicYear,
        journalDb: draft.journalDb, journalClassification: draft.journalClassification, indexLabel: catLabel, predatory: draft.predatory,
        applicantRole: draft.applicantRole,
        researcherSnapshot,
        researcherName: researcherSnapshot.fullName,
        researcherEmail: researcherSnapshot.email,
        researcherTitle: researcherSnapshot.nameTitle,
        researcherAuId: researcherSnapshot.auId,
        researcherPhone: researcherSnapshot.phone,
        researcherOffice: researcherSnapshot.officeRoom,
        contactEmail: researcherSnapshot.email,
        researcherJoinedDate: researcherSnapshot.joinedDate,
        feePaid: Number(draft.feePaid) || 0, feeDate: draft.feeDate || null, turnitin: Number(draft.turnitin) || 0,
        reward: requested, requestedClaim: requested, maxAmount: MAX,
        totalContribution: totalContrib, declarations: decls,
      };
      const app = await window.DB.createApplication({
        title: draft.title, abstract: "AU-R4 publication reward — " + draft.journal + " (" + catLabel + ")",
        faculty: draft.school, department: draft.department,
        requested_amount: requested, duration_months: 12,
        grant_type: "au_r4", pub_info: pubInfo, co_members: authors.filter(a => (a.name || "").trim()),
      }, submit, editingId);
      const failedUploads = await uploadAllDocuments(app.id, files);
      if (!submit) { setEditingId(app.id);
        if (setSelectedApplicationId) setSelectedApplicationId(app.id); }
      else if (setSelectedApplicationId) setSelectedApplicationId(null);
      if (failedUploads.length) {
        toast(failedUploads.length + " file(s) could not be uploaded: " + failedUploads.join(", ") + ". Open the application and add them again.");
      } else {
        toast(submit ? ("Application " + app.code + " submitted") : ("Draft " + app.code + " saved"));
      }
      navigate("r-applications");
    } catch (ex) { setErr((ex && ex.message) || "Could not save the application."); setBusy(false); }
  }

  if (loadingDraft) {
    return <><PageHeader title="Edit AU-R4 Application" desc="Loading saved draft." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading draft...</div></>;
  }

  return (
    <>
      <PageHeader
        title={(editingId ? "Edit " : "Submit ") + "AU-R4 Application"}
        desc="Publication Fees and Reward Application — submit publication information, author contributions, and required documents."
        actions={
          <>
            <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>{busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"}</button>
            <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>
              <Icon name="Send" size={13} /> {busy ? (busyKind === "submit" ? (files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…") : "Saving draft…") : "Submit Application"}
            </button>
          </>
        }
      />

      <ReturnNotice info={returnInfo} />

      <div className="card card-pad-0">
        {                                }
        <div className="form-section">
          <h4><span className="num">1</span> Publication Information</h4>
          <p className="section-sub">The published (or accepted) article you are claiming for.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field full"><label>Article Title *</label><input value={draft.title} onChange={e => upd("title", e.target.value)} /></div>
              <div className="field"><label>Article Type *</label>
                <select value={draft.articleType} onChange={e => upd("articleType", e.target.value)}>{(RA.R4_ARTICLE_TYPES || []).map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="field"><label>Publication Status *</label>
                <select value={draft.pubStatus} onChange={e => upd("pubStatus", e.target.value)}>{(RA.R4_PUB_STATUS || []).map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="field"><label>Journal Name *</label><input value={draft.journal} onChange={e => upd("journal", e.target.value)} /></div>
              <div className="field"><label>Publisher *</label><input value={draft.publisher} onChange={e => upd("publisher", e.target.value)} /></div>
              <div className="field"><label>Journal Website *</label><input value={draft.website} onChange={e => upd("website", e.target.value)} placeholder="https://…" /></div>
              <div className="field"><label>ISSN / eISSN *</label><input value={draft.issn} onChange={e => upd("issn", e.target.value)} placeholder="e.g. 1234-5678" /></div>
              <div className="field"><label>Academic Year <span style={{ color: "var(--ink-3)", fontWeight: 700 }}>(AD)</span> *</label><input value={draft.academicYear} onChange={e => upd("academicYear", (e.target.value + "").replace(/[^0-9]/g, "").slice(0, 4))} placeholder="2025" inputMode="numeric" /></div>
              {published ? (
                <>
                  <div className="field"><label>Article URL *</label><input value={draft.articleUrl} onChange={e => upd("articleUrl", e.target.value)} placeholder="https://…" /></div>
                  <div className="field"><label>DOI</label><input value={draft.doi} onChange={e => upd("doi", e.target.value)} placeholder="10.xxxx/…" /></div>
                  <div className="field"><label>Publication Date *</label><AUDatePicker value={draft.pubDate} onChange={v => upd("pubDate", v)} placeholder="Select date…" /></div>
                  <div className="field"><label>Volume *</label><input value={draft.volume} onChange={e => upd("volume", e.target.value)} /></div>
                  <div className="field"><label>Issue *</label><input value={draft.issue} onChange={e => upd("issue", e.target.value)} /></div>
                  <div className="field"><label>Page Number(s) *</label><input value={draft.pageNumber} onChange={e => upd("pageNumber", e.target.value)} placeholder="e.g. 25–38" /></div>
                </>
              ) : (
                <>
                  <div className="field"><label>Acceptance Date *</label><AUDatePicker value={draft.acceptDate} onChange={v => upd("acceptDate", v)} placeholder="Select date…" /></div>
                  <div className="field full">
                    <label>Acceptance Letter *</label>
                    <label className="upload-box" style={{ cursor: "pointer", display: "block" }}>
                      <input type="file" accept="application/pdf,.pdf" style={{ display: "none" }} onChange={e => onTypedFiles(e, "Acceptance Letter")} />
                      <Icon name="Upload" size={24} className="icon" /><div className="t">Attach acceptance letter</div><div className="s">PDF · max 10 MB</div>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {                               }
        <div className="form-section">
          <h4><span className="num">2</span> Journal Classification</h4>
          <p className="section-sub">Select the journal database / index and its matching classification. The research office makes the final verification.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field"><label>Journal Database / Index *</label>
                <select value={draft.journalDb} onChange={e => setDraft(d => ({ ...d, journalDb: e.target.value, journalClassification: "" }))}>
                  <option value="">Select database / index…</option>
                  {(RA.R4_JOURNAL_DBS || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Classification *</label>
                {classificationOptions ? (
                  <select value={draft.journalClassification} onChange={e => upd("journalClassification", e.target.value)} disabled={!draft.journalDb}>
                    <option value="">Select classification…</option>
                    {classificationOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <input value={draft.journalClassification} onChange={e => upd("journalClassification", e.target.value)} disabled={!draft.journalDb}
                    placeholder={draft.journalDb === "Other" ? "Enter database / index name manually" : draft.journalDb ? "Enter additional tier" : "Select a database / index first"} />
                )}
              </div>
            </div>
            {showPreliminaryReward && (
              <div className="r4-reward-estimate">
                <div className="r4-reward-estimate-head">
                  <div className="r4-reward-estimate-label"><Icon name="Award" size={20} /> Preliminary reward estimate ({catLabel})</div>
                  <div className="r4-reward-estimate-amount">{automaticReward > 0 ? fmtBaht(automaticReward) : "Pending IRAS verification"}</div>
                </div>
                <p>This is a preliminary estimate only. The final eligible amount will be determined by IRAS after verifying the journal, documents, publication fee, author contribution, and previous claims. Maximum 80,000 THB per article.</p>
              </div>
            )}
          </div>
        </div>

        {                              }
        <div className="form-section">
          <h4><span className="num">3</span> Author and Contribution Information</h4>
          <p className="section-sub">Provide the First Author and any Co-author. Contributions must total 100%; the First Author needs ≥ 50%. With two authors, changing one percentage automatically balances the other.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field"><label>Your Author Role *</label>
                <select value={draft.applicantRole} onChange={e => upd("applicantRole", e.target.value)}>{(RA.R4_APPLICANT_ROLES || []).map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
              <table className="tbl">
                <thead><tr><th>Author Name</th><th style={{ width: 190 }}>Role</th><th>Author Email Address</th><th style={{ width: 100, textAlign: "right" }}>Contrib %</th><th style={{ width: 100 }}>Action</th></tr></thead>
                <tbody>
                  {authors.map((a, i) => (
                    <tr key={i}>
                      <td><input value={a.name} onChange={e => setAuthor(i, "name", e.target.value)} placeholder="Full name" style={{ width: "100%", minWidth: 130 }} /></td>
                      <td><select value={a.type} onChange={e => setAuthor(i, "type", e.target.value)} style={{ width: "100%" }}>{(RA.R4_AUTHOR_TYPES || []).map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                      <td><input type="email" value={a.email} onChange={e => setAuthor(i, "email", e.target.value)} placeholder="author@example.com" style={{ width: "100%", minWidth: 170 }} /></td>
                      <td style={{ textAlign: "right" }}><input value={a.contribution} onChange={e => setAuthor(i, "contribution", e.target.value)} style={{ width: 64, textAlign: "right" }} /></td>
                      <td style={{ textAlign: "center" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeAuthor(i)} disabled={authors.length === 1} aria-label={"Remove author " + (i + 1)}><Icon name="Trash2" size={13} /> Remove</button></td>
                    </tr>
                  ))}
                  <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}>
                    <td colSpan="3">Total contribution</td>
                    <td style={{ textAlign: "right", color: Math.round(totalContrib) === 100 ? "var(--status-approved)" : "var(--au-crimson)" }}>{totalContrib}%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addAuthor}><Icon name="Plus" size={13} /> Add author</button>
            {hasSecondAuthor && <div className="field full" style={{ marginTop: 14 }}>
              <label>Author Contribution File *</label>
              <label className="upload-box" style={{ cursor: "pointer", display: "block" }}>
                <input type="file" accept="application/pdf,.pdf" style={{ display: "none" }} onChange={e => onTypedFiles(e, "Author Contribution Statement")} />
                <Icon name={contributionExistingDocs.length || contributionFiles.length ? "FileCheck" : "Upload"} size={24} className="icon" /><div className="t">{contributionExistingDocs.length || contributionFiles.length ? "Attach updated author contribution statement" : "Attach author contribution statement"}</div><div className="s">PDF · max 10 MB</div>
              </label>
              {(contributionExistingDocs.length > 0 || contributionFiles.length > 0) && (
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginTop: 10, overflow: "hidden" }}>
                  <div style={{ padding: "9px 13px", background: "var(--paper-warm)", borderBottom: "1px solid var(--line-2)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--ink-3)" }}>Author Contribution Statement</div>
                  {contributionExistingDocs.map(d => (
                    <div className="file-row" key={d.id || d.name}>
                      <div className="ficon"><Icon name="FileText" size={18} /></div>
                      <div className="fmeta"><div className="fn">{d.name}</div><div className="fs">{d.size || "PDF"} · Uploaded {d.uploadedAt || "-"}</div></div>
                      <div className="factions">
                        <button className="btn btn-secondary btn-sm" onClick={() => onView(d)}><Icon name="Eye" size={13} /> View</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => onDownload(d)}><Icon name="Download" size={13} /> Download</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteExistingDoc(d)}><Icon name="Trash2" size={13} /> Delete</button>
                      </div>
                    </div>
                  ))}
                  {contributionFiles.map(it => {
                    const fileIndex = files.indexOf(it);
                    return <div className="file-row" key={fileIndex}>
                      <div className="ficon"><Icon name="FileText" size={18} /></div>
                      <div className="fmeta"><div className="fn">{it.file.name}</div><div className="fs">{(it.file.size / 1024).toFixed(0)} KB · ready to upload</div></div>
                      <div className="factions"><button className="btn btn-secondary btn-sm" onClick={() => setFiles(fs => fs.filter((_, index) => index !== fileIndex))}><Icon name="X" size={13} /> Remove</button></div>
                    </div>;
                  })}
                </div>
              )}
            </div>}
          </div>
        </div>

        {                               }
        <div className="form-section">
          <h4><span className="num">4</span> Researcher Information</h4>
          <p className="section-sub">Identity details come from your account. You may update your academic title, position, phone, and office / room here.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field"><label>Academic Title</label>
                <select value={draft.title2} onChange={e => upd("title2", e.target.value)}><option value="">Select title…</option>{RA.AU_TITLES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="field"><label>Academic / Administrative Position</label>
                <select value={draft.academicPosition} onChange={e => upd("academicPosition", e.target.value)}><option value="">Select position…</option>{(RA.AU_ACADEMIC_POSITIONS || []).map(position => <option key={position} value={position}>{position}</option>)}</select></div>
              <div className="field"><label>Full Name</label><input value={draft.name} readOnly style={roStyle} /></div>
              <div className="field"><label>AU ID</label><input value={draft.auId} readOnly style={roStyle} /></div>
              <div className="field"><label>Email (AU only)</label>
                <input type="email" value={draft.email} readOnly style={roStyle} /></div>
              <div className="field"><label>Phone</label><ThaiPhoneInput value={draft.phone} onChange={value => upd("phone", value)} /></div>
              <div className="field"><label>Office / Room</label><input value={draft.office} onChange={e => upd("office", e.target.value)} /></div>
              <UniversityJoinedDateField value={draft.joinedDate} onChange={v => upd("joinedDate", v)} readOnly />
              <div className="field"><label>Faculty</label>
                <select value={facultyValid ? draft.school : ""} disabled style={roStyle}>
                  <option value="">Select your faculty…</option>{RA.FACULTIES.map(f => <option key={f.code} value={f.name}>{f.name}</option>)}</select></div>
              <div className="field"><label>Department</label>
                <select value={deptValid ? draft.department : ""} disabled style={roStyle}>
                  <option value="">{draft.school ? "Select department…" : "Select a faculty first"}</option>
                  {(RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments.map(d => <option key={d}>{d}</option>)}</select></div>
            </div>
          </div>
        </div>

        {                                                                                     }
        {tierSelected && (
          <div className="form-section">
            <h4><span className="num">5</span> Publication Fee and Claim Information</h4>
            <p className="section-sub">The final eligible amount is decided by the research office after verification.</p>
            <div className="section-body">
              <div className="form-grid">
                <div className="field"><label>Publication Fee (THB) *</label>
                  <input value={draft.feePaid === "" ? "" : Number(draft.feePaid || 0).toLocaleString()} onChange={e => upd("feePaid", (e.target.value + "").replace(/[^0-9]/g, ""))} placeholder="Enter publication fee manually" inputMode="numeric" />
                </div>
                <div className="field"><label>Payment Date</label><AUDatePicker value={draft.feeDate} onChange={v => upd("feeDate", v)} placeholder="Select date…" /></div>
              </div>
            </div>
          </div>
        )}

        {                           }
        <div className="form-section">
          <h4><span className="num">6</span> Required Documents</h4>
          <p className="section-sub">Upload the supporting documents required for Dean and IRAS review.</p>
          <div className="section-body">
            <div className="form-grid" style={{ marginBottom: 10 }}>
              <div className="field"><label>Turnitin Similarity % *</label>
                <input value={draft.turnitin} onChange={e => upd("turnitin", (e.target.value + "").replace(/[^0-9.]/g, ""))} placeholder="e.g. 12"
                  style={turnitinBad ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)" } : null} />
                {turnitinBad && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Exceeds the 20% limit — submission is blocked.</div>}</div>
            </div>
            <div style={{ background: "var(--paper-warm)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--ink-2)" }}>Required for an AU-R4 claim:</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                <li><b>Full Research Article</b> — the full published article</li>
                {!published && <li><b>Acceptance Letter</b> — required for an accepted article</li>}
                {hasSecondAuthor && <li><b>Author Contribution Statement</b> — required when a second author is listed</li>}
                <li><b>Turnitin Report</b> — similarity ≤ 20%</li>
                <li><b>Original Publication Fee Receipt</b></li>
              </ul>
            </div>
            {otherExistingDocs.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {otherExistingDocs.map(d => (
                  <div className="file-row" key={d.id || d.name}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta"><div className="fn">{safeDocumentDisplayName(d)}{d.doc_type && safeDocumentDisplayName(d) !== d.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{d.doc_type}</span>}</div><div className="fs">{d.size || "PDF"} - Uploaded {d.uploadedAt || "-"}</div></div>
                    <div className="factions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onView(d)}><Icon name="Eye" size={13} /> View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onDownload(d)}><Icon name="Download" size={13} /> Download</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteExistingDoc(d)}><Icon name="Trash2" size={13} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {otherFiles.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {otherFiles.map(it => {
                  const fileIndex = files.indexOf(it);
                  return <div className="file-row" key={fileIndex}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta"><div className="fn">{it.file.name}{it.docType && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{it.docType}</span>}</div><div className="fs">{(it.file.size / 1024).toFixed(0)} KB · ready to upload</div></div>
                    <div className="factions"><button className="btn btn-secondary btn-sm" onClick={() => setFiles(fs => fs.filter((_, index) => index !== fileIndex))}><Icon name="X" size={13} /> Remove</button></div>
                  </div>
                })}
              </div>
            )}
            <div className="field" style={{ maxWidth: 360, marginBottom: 10 }}>
              <label>Document type for the next upload</label>
              <select value={docType} onChange={e => setDocType(e.target.value)}>{(RA.R4_DOC_TYPES || RA.DOC_TYPES).filter(t => hasSecondAuthor || !/author contribution/i.test(t)).map(t => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <label className="upload-box mt-1" style={{ cursor: "pointer", display: "block" }}>
              <input type="file" accept="application/pdf,.pdf" multiple style={{ display: "none" }} onChange={onFiles} />
              <Icon name="Upload" size={26} className="icon" />
              <div className="t">Click to upload your <b>{docType}</b></div>
              <div className="s">PDF · max 10 MB per file</div>
            </label>
          </div>
        </div>

        {                                }
        <div className="form-section">
          <h4>Eligibility Declaration</h4>
          <p className="section-sub">Please read these AU-R4 eligibility rules before submitting your claim.</p>
          <div className="section-body">
            <div style={{ background: "var(--paper-warm)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "14px 16px", color: "var(--ink-2)", fontSize: 13, lineHeight: 1.7 }}>
              {(RA.R4_DECLARATIONS || []).map((d, i) => <div key={i} style={{ padding: i ? "8px 0 0" : 0 }}>{i === 2 ? <>The journal is not predatory and is not listed in <a href="https://beallslist.net/" target="_blank" rel="noopener noreferrer">Beall's List</a>.</> : d}</div>)}
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, padding: "13px 14px", border: "1px solid var(--au-gold)", borderRadius: "var(--r-md)", background: "var(--au-gold-soft)", fontSize: 13, fontWeight: 600, lineHeight: 1.55, cursor: "pointer" }}>
              <input type="checkbox" checked={allDecl} onChange={e => { const accepted = e.target.checked; upd("predatory", accepted); setDecls(s => s.map(() => accepted)); }} style={{ accentColor: "var(--au-crimson)", marginTop: 3 }} />
              <span>I have read and understand these AU-R4 rules. I confirm that the information and documents in this application are true, accurate, complete, and eligible for this claim. *</span>
            </label>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", background: "var(--paper-warm)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {err && <div style={{ color: "var(--au-crimson)", fontSize: 12, alignSelf: "center", marginRight: "auto" }}>{err}</div>}
          <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>{busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"}</button>
          <button className="btn btn-primary" disabled={busy || !allDecl || turnitinBad} onClick={() => save(true)}>
            <Icon name="Send" size={13} /> {busy ? (busyKind === "submit" ? (files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…") : "Saving draft…") : "Submit Application"}
          </button>
        </div>
      </div>
    </>
  );
}


function ResearcherApplications({ navigate, onDownload, openDetail, openDraft, setSelectedApplicationId, grantType, toast, setConfirm, onGrantSwitch }) {
  const sys = grantSystemFor(grantType || "au_r3");
  const [myApps, setMyApps] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const loadApplications = async () => {
    try {
      const apps = await window.DB.myApplications(grantType || undefined);
      setMyApps(apps.map(a => {
        const decisionEvents = (a.events || []).filter(event => event.to_status === a.status && ["returned", "rejected"].includes(a.status));
        decisionEvents.sort((x, y) => new Date(y.created_at || 0) - new Date(x.created_at || 0));
        const decision = decisionEvents[0] || null;
        return {
        id: a.code, _uuid: a.id, title: a.title, faculty: a.faculty, department: a.department,
        submittedAt: a.submitted_at ? window.DB.fmtDate(a.submitted_at) : "—",
        stage: (a.statusBadge || window.DB.statusBadge(a.status, a.grant_type)).label, status: a.statusBadge || window.DB.statusBadge(a.status, a.grant_type), statusKey: a.status,
        grantType: a.grant_type,
        grantCode: grantSystemFor(a.grant_type || "au_r3").code,
        decisionReason: decision && String(decision.note || "").trim(),
        decisionRole: decision && decision.actor_role,
      };
      }));
    } catch (e) { setMyApps([]); }
  };
  useEffect(() => { setMyApps(null); loadApplications(); }, [grantType]);

  const listedApplications = myApps || [];
  const visibleApplications = listedApplications.filter(application => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [application.id, application.title, application.stage, application.faculty].some(value => String(value || "").toLowerCase().includes(query));
    const matchesStatus = statusFilter === "all"
      || (statusFilter === "open" && !["completed", "rejected"].includes(application.statusKey))
      || application.statusKey === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <PageHeader
        title="My Applications"
        desc={sys.code + " · " + sys.name + " — your submissions across academic years."}
        actions={
          <button className="btn btn-primary" onClick={() => { if (setSelectedApplicationId) setSelectedApplicationId(null); navigate("r-submit"); }}>
            <Icon name="Plus" size={14} /> New Application
          </button>
        }
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search by title, ID, or stage…" />
          </div>
          <label className="filter"><Icon name="Filter" size={12} />
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter applications by status" style={{ border: 0, background: "transparent", color: "inherit", font: "inherit", cursor: "pointer", outline: "none" }}>
              <option value="all">Status: All</option>
              <option value="open">In progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="returned">Returned</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export CSV</button>
        </div>
        <table className="tbl my-applications-table">
          <colgroup>
            <col className="app-col-id" />
            <col className="app-col-title" />
            <col className="app-col-submitted" />
            <col className="app-col-stage" />
            <col className="app-col-status" />
            <col className="app-col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Research Title</th>
              <th>Submitted</th>
              <th>Current Stage</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myApps === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading your applications…</td></tr>}
            {myApps && visibleApplications.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>{listedApplications.length ? "No applications match this search or status." : "No applications yet — click \"New Application\" to submit your first."}</td></tr>}
            {visibleApplications.map(a => (
              <tr key={a.id}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell">
                  <div className="t">{a.title}</div>
                  <div className="s">{(a.faculty || "—") + (a.department ? " · " + a.department : "")}</div>
                  {a.decisionReason && <div style={{ color: "var(--au-crimson)", fontSize: 11.5, marginTop: 4, maxWidth: 520 }}><strong>{a.statusKey === "rejected" ? "Rejection reason" : "Revision reason"}:</strong> {a.decisionReason}</div>}
                </td>
                <td>{a.submittedAt}</td>
                <td>{a.stage}</td>
                <td><Badge status={a.status} /></td>
                <td className="app-actions-cell">
                  <>
                    <div className="app-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => (a.statusKey === "draft" || a.statusKey === "returned") ? (openDraft && openDraft(a._uuid)) : (openDetail && openDetail(a._uuid))}>
                        <Icon name={(a.statusKey === "draft" || a.statusKey === "returned") ? "Edit3" : "Eye"} size={13} /> {(a.statusKey === "draft" || a.statusKey === "returned") ? "Edit" : a.statusKey === "completed" ? "View & Timeline" : "View"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openDetail && openDetail(a._uuid)}><Icon name="FolderOpen" size={13} /> Files</button>
                    </div>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


function ResearcherApplicationDetail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const canEditDocs = app && app.is_owner !== false && ["draft", "submitted", "returned"].includes(app.status);

  const load = async () => {
    setLoading(true);
    try {
      let id = applicationId;
      if (!id) {
        const apps = await window.DB.myApplications();
        id = apps && apps[0] && apps[0].id;
      }
      if (!id) { setApp(null); return; }
      setApp(await window.DB.applicationDetail(id));
    } catch (error) {
      setApp(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [applicationId]);

  const uploadMore = async event => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || !app || busy) return;
    setBusy(true);
    try {
      for (const file of files) await window.DB.uploadDocument(app.id, file, null);
      toast(files.length + " file(s) uploaded.");
      await load();
    } catch (error) {
      toast("Upload error: " + ((error && error.message) || error));
    } finally {
      setBusy(false);
    }
  };

  const deleteDoc = doc => {
    if (!canEditDocs) return;
    setConfirm({
      kind: "danger",
      title: "Delete uploaded file?",
      message: doc.name + " will be removed from this application and from storage.",
      confirmLabel: "Delete File",
      onConfirm: async () => {
        try { await window.DB.deleteDocument(doc); toast(doc.name + " deleted."); await load(); }
        catch (error) { toast("Delete error: " + ((error && error.message) || error)); }
      },
    });
  };

  if (loading) {
    return <><PageHeader title="Application Detail" desc="Loading submitted application." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  }
  if (!app) {
    return <><PageHeader title="Application Detail" desc="No application selected." /><div className="card"><Empty title="No application selected" desc="Open an application from My Applications." icon="Folder" /></div></>;
  }

  const docs = app.documents || [];
  const budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
  const applicationContact = app.grant_type === "au_r3" ? (app.conference_info || {}) : (app.pub_info || {});
  const researcherName = (app.researcher && app.researcher.full_name) || applicationContact.researcherName || "Researcher";
  const researcherEmail = (app.researcher && app.researcher.email) || applicationContact.researcherEmail || applicationContact.contactEmail || "-";
  const applicantAuthorRole = app.grant_type === "au_r4" && app.pub_info && app.pub_info.applicantRole
    ? app.pub_info.applicantRole
    : app.grant_type === "au_r3" && app.conference_info && app.conference_info.authorType
      ? app.conference_info.authorType
      : "Lead Author";
  const ownerParticipant = { id: "owner", name: researcherName, email: researcherEmail, authorRole: applicantAuthorRole };
  const listedAuthorParticipants = (app.co_members || []).map((member, index) => ({
    id: "author-" + index,
    name: member.name || member.email || "Researcher",
    email: member.email || "",
    authorRole: member.authorType || member.type || member.kind || "Co-author",
  }));
  const authorParticipants = app.grant_type === "au_r4" && listedAuthorParticipants.length
    ? listedAuthorParticipants
    : [ownerParticipant].concat(listedAuthorParticipants);
  const status = app.statusBadge || window.DB.statusBadge(app.status, app.grant_type);
  const joinedDate = researcherJoinedDate(app);
  const service = universityServiceEligibility(joinedDate);

  return (
    <>
      <PageHeader
        title={app.title}
        desc={(app.code || "Application") + " - Submitted " + window.DB.fmtDate(app.submitted_at || app.created_at)}
        actions={
          <>
            <Badge status={status} />
            {["draft", "returned"].includes(app.status) && <button className="btn btn-secondary" onClick={() => navigate("r-submit", { keepSelection: true })}><Icon name="Edit3" size={13} /> {app.status === "returned" ? "Edit & Resubmit" : "Edit Draft"}</button>}
          </>
        }
      />

      <ApplicationDecisionNotice app={app} />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>{app.grant_type === "au_r3" ? "Research Paper Information" : "Research Information"}</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">{app.grant_type === "au_r3" ? "Paper title" : "Research title"}</span><span className="r">{app.title}</span></div>
              <div className="meta-row"><span className="l">Field / discipline</span><span className="r">{app.field || "-"}</span></div>
              {app.grant_type === "au_r3" && <><div className="eyebrow mt-4 mb-2">Abstract</div><p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{(app.conference_info && app.conference_info.paperAbstract) || "No abstract entered."}</p></>}
              <div className="meta-row"><span className="l">Keywords</span><span className="r">{app.keywords || "-"}</span></div>
              {app.grant_type !== "au_r3" && <div className="meta-row"><span className="l">Duration</span><span className="r">{app.duration_months || 12} months</span></div>}
              <div className="eyebrow mt-4 mb-2">Expected outcomes / summary</div>
              <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{app.abstract || "No summary entered."}</p>
            </div>
          </div>

          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Researcher & Routing</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">Principal researcher</span><span className="r">{researcherName}</span></div>
              <div className="meta-row"><span className="l">Email</span><span className="r">{researcherEmail}</span></div>
              <div className="meta-row"><span className="l">Faculty</span><span className="r">{app.faculty || "-"}</span></div>
              <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
              <div className="meta-row"><span className="l">Joined Assumption University</span><span className="r">{joinedDate ? window.DB.fmtDate(joinedDate) + " · " + service.months + " months" : "Not recorded"}</span></div>
              <div className="meta-row"><span className="l">Service eligibility</span><span className="r" style={{ color: joinedDate && service.eligible ? "var(--status-approved)" : "var(--au-crimson)" }}>{joinedDate ? (service.eligible ? "Eligible" : "Not eligible until " + fmtNiceDate(service.eligibleOn)) : "Not recorded"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
              {(app.grant_type === "au_r3" || app.grant_type === "au_r4") && (
                <div style={{ marginTop: 8, borderTop: "1px solid var(--line-2)", paddingTop: 8 }}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Authors</div>
                  {authorParticipants.map((member, i) => (
                    <div className="meta-row" key={member.id || i}>
                      <span className="l">{member.authorRole || "Author"}</span>
                      <span className="r">{member.name}{member.email && member.email !== "-" ? " · " + member.email : ""}</span>
                    </div>
                  ))}
                </div>
              )}
              {app.conference_info && (
                <div style={{ marginTop: 8, borderTop: "1px solid var(--line-2)", paddingTop: 8 }}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Conference (AU-R3)</div>
                  <div className="meta-row"><span className="l">Conference</span><span className="r">{app.conference_info.confName || "-"}</span></div>
                  <div className="meta-row"><span className="l">Organizer</span><span className="r">{app.conference_info.organizer || "-"}</span></div>
                  <div className="meta-row"><span className="l">Conference type</span><span className="r">{app.conference_info.confType || "-"}</span></div>
                  <div className="meta-row"><span className="l">Conference location</span><span className="r">{app.conference_info.conferenceLocation || [app.conference_info.city, app.conference_info.country].filter(Boolean).join(", ") || "-"}</span></div>
                  <div className="meta-row"><span className="l">Presentation date</span><span className="r">{(app.conference_info.presentationDate || app.conference_info.confStart) ? fmtNiceDate(app.conference_info.presentationDate || app.conference_info.confStart) : "-"}</span></div>
                  <div className="meta-row"><span className="l">Presentation</span><span className="r">{app.conference_info.presentation || "Oral Presentation"}</span></div>
                  <div className="meta-row"><span className="l">Corresponding</span><span className="r">{app.conference_info.correspondingAuthor || "-"}</span></div>
                  <div className="meta-row"><span className="l">Conference Database / Index</span><span className="r">{app.conference_info.journalDb || "-"}</span></div>
                  <div className="meta-row"><span className="l">Conference Classification</span><span className="r">{app.conference_info.journalClassification || "-"}</span></div>
                </div>
              )}
              {app.pub_info && (
                <div style={{ marginTop: 8, borderTop: "1px solid var(--line-2)", paddingTop: 8 }}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Publication (AU-R4)</div>
                  <div className="meta-row"><span className="l">Journal</span><span className="r">{app.pub_info.journal || "-"}</span></div>
                  <div className="meta-row"><span className="l">Indexing</span><span className="r">{app.pub_info.indexLabel || app.pub_info.indexType || "-"}{app.pub_info.quartile ? " · " + app.pub_info.quartile : ""}</span></div>
                  <div className="meta-row"><span className="l">Classification</span><span className="r">{app.pub_info.journalClassification || app.pub_info.openAccess || "-"}</span></div>
                  <div className="meta-row"><span className="l">Status</span><span className="r">{app.pub_info.pubStatus || "-"}</span></div>
                  <div className="meta-row"><span className="l">Publication fee</span><span className="r">{fmtBaht(Number(app.pub_info.feePaid || app.pub_info.feeAmount || 0))}</span></div>
                  <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.pub_info.reward || app.requested_amount || 0))}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <ReviewCommentHistory app={app} roles={["dean", "iras"]} />
          </div>

          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>{app.grant_type === "au_r3" ? "Grant Amount" : "Budget Breakdown"}</h3></div>
            <div className="card-body" style={{ padding: 0 }}>
              {budgetRows.length === 0 && <div style={{ padding: 20, color: "var(--ink-3)" }}>{app.grant_type === "au_r3" ? "Fixed AU-R3 grant: 3,500 THB." : "No budget breakdown entered."}</div>}
              {budgetRows.length > 0 && (
                <table className="tbl">
                  <thead><tr><th>Item</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                  <tbody>
                    {budgetRows.map((b, i) => <tr key={i}><td>{b.item}</td><td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(b.amount || 0))}</td></tr>)}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Submitted Documents</h3><div className="grow"></div><span className="text-sm text-muted">{docs.length} uploaded</span></div>
            <div>
              {docs.length === 0 && <Empty title="No uploaded documents" desc="Uploaded researcher files will appear here." icon="FileText" />}
              {docs.map(d => (
                <div className="file-row" key={d.id || d.name}>
                  <div className="ficon"><Icon name="FileText" size={18} /></div>
                  <div className="fmeta"><div className="fn">{safeDocumentDisplayName(d)}</div><div className="fs">{d.size || "PDF"} - Uploaded {d.uploadedAt || "-"}</div></div>
                  <div className="factions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onView(d)}><Icon name="Eye" size={13} /> View</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => onDownload(d)}><Icon name="Download" size={13} /> Download</button>
                    {canEditDocs && <button className="btn btn-danger btn-sm" onClick={() => deleteDoc(d)}><Icon name="Trash2" size={13} /> Delete</button>}
                  </div>
                </div>
              ))}
            </div>
            {canEditDocs && (
              <div className="card-body" style={{ borderTop: "1px solid var(--line-2)" }}>
                <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer" }}>
                  <input type="file" accept="application/pdf,.pdf" multiple style={{ display: "none" }} onChange={uploadMore} disabled={busy} />
                  <Icon name="Upload" size={13} /> {busy ? "Uploading..." : "Add / Replace Files"}
                </label>
                <span className="text-sm text-muted" style={{ marginLeft: 12 }}>You can add or delete files while this is waiting for Dean screening.</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ alignSelf: "start" }}>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Application Timeline</h3><div className="grow"></div><Badge status={status} /></div>
            <div className="card-body"><ApplicationEventTimeline app={app} /></div>
          </div>

        </div>
      </div>
    </>
  );
}


Object.assign(window, {
  ResearcherDashboard, ResearcherSubmitR3, ResearcherSubmitR4,
  ResearcherApplications, ResearcherApplicationDetail,
});
