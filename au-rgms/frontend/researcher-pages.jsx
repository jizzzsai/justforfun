/* ============================================================
   Researcher Dashboard pages
   ============================================================ */

const RA = window.AU;

/* ---------- A. Dashboard Overview ---------- */
function buildResearcherTimeline(statusKey) {
  const order = ["submission", "deanScreen", "committee", "iras", "contract", "pay1"];
  const idxMap = { draft: 0, submitted: 1, committee_review: 2, iras_review: 3, approved: 4, active: 5, completed: 6, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true } : (i === idx ? { current: true } : {}); });
  return tl;
}

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
  const idxMap = { draft: 0, submitted: 1, iras_review: 2, approved: 3, active: 4, completed: 5, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true } : (i === idx ? { current: true } : {}); });
  return tl;
}

const R4_PIPELINE = [
  { key: "submission", label: "Submitted" },
  { key: "dean", label: "Dean Review" },
  { key: "committee", label: "Faculty Committee Review" },
  { key: "iras", label: "IRAS Verification" },
  { key: "approved", label: "Approved by Research Office" },
  { key: "payment", label: "Finance Payment" },
  { key: "paid", label: "Paid" },
];
function buildR4Timeline(statusKey) {
  const order = ["submission", "dean", "committee", "iras", "approved", "payment", "paid"];
  const idxMap = { draft: 0, submitted: 1, committee_review: 2, iras_review: 3, approved: 4, active: 5, completed: 6, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true } : (i === idx ? { current: true } : {}); });
  return tl;
}

function ResearcherDashboard({ navigate, onDownload, onView, setSelectedApplicationId, grantType }) {
  const sys = grantSystemFor(grantType || "au_r1");
  const [c, setC] = useState(null);
  const [me, setMe] = useState(null);
  const [grant, setGrant] = useState(null);
  const [apps, setApps] = useState(null);
  const [appsError, setAppsError] = useState(false);
  useEffect(() => {
    let active = true;
    setApps(null);
    setAppsError(false);
    window.DB.statusCounts(grantType || undefined).then(setC).catch(() => setC({}));
    window.AUTH.profile().then(setMe).catch(() => {});
    window.DB.myGrant(grantType || "au_r1").then(g => setGrant(g || false)).catch(() => setGrant(false));
    window.DB.myApplications(grantType || undefined)
      .then(items => { if (active) setApps(items || []); })
      .catch(() => { if (active) setAppsError(true); });
    return () => { active = false; };
  }, [grantType]);
  const isR3 = grantType === "au_r3";
  const isR4 = grantType === "au_r4";
  const isSingle = isR3 || isR4;
  const n = (k) => (c ? (c[k] || 0) : "…");
  const latest = apps && apps.length ? apps[0] : null;
  const exampleSteps = isR4 ? R4_PIPELINE : isR3 ? R3_PIPELINE : RA.ALL_STAGES;
  const showExample = !!(apps && !apps.length);
  const singleGrant = isSingle && grant && grant.grant_type === grantType ? grant : null;
  const r3PayLabel = { approved: "Awaiting Finance Payment", active: "Paid", completed: "Completed" };
  const approvedLabel = isR4 ? "Approved Publication Claims" : isR3 ? "Approved Conference Grants" : "Approved Projects";
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

      <div className="stats">
        <Stat label="Total Applications"  value={n("_total")} icon="Folder" />
        <Stat label="Draft Applications"  value={n("draft")} icon="FileText"   tone="navy" />
        <Stat label="Under Review"        value={n("_underReview")} icon="FileSearch" tone="gold" />
        <Stat label={approvedLabel} value={n("_approved")} icon="CheckCircle" tone="green" />
      </div>

      <div className="card card-pad-0 mb-6">
        <div className="card-head">
          <h3>{sys.code} Application Pipeline{latest ? " · " + latest.code : ""}</h3>
          <div className="grow"></div>
          {showExample && <span className="badge badge-draft">Example workflow</span>}
          {latest && <button className="btn btn-ghost btn-sm" onClick={() => navigate("r-applications")}>
            Open detail <Icon name="ArrowRight" size={12} />
          </button>}
        </div>
        <div className="card-body">
          {appsError && <p className="text-sm text-muted" role="status">Could not load your application pipeline. Please refresh to try again.</p>}
          {apps === null && !appsError && <p className="text-sm text-muted" role="status">Loading pipeline…</p>}
          {showExample && <div className="researcher-pipeline-example">
            <p className="text-sm text-muted">Your {sys.code} application will follow these steps.</p>
            <ol className="researcher-pipeline-steps" aria-label={sys.code + " example workflow"}>
              {exampleSteps.map((step, index) => <li key={step.key}>
                <span className="researcher-pipeline-number" aria-hidden="true">{index + 1}</span>
                <span>{step.label}</span>
                {index < exampleSteps.length - 1 && <span className="researcher-pipeline-arrow" aria-hidden="true"><Icon name="ArrowRight" size={14} /></span>}
              </li>)}
            </ol>
          </div>}
          {latest && isR4 && <HTimeline steps={R4_PIPELINE} app={{ timeline: buildR4Timeline(latest.status) }} />}
          {latest && isR3 && <HTimeline steps={R3_PIPELINE} app={{ timeline: buildR3Timeline(latest.status) }} />}
          {latest && !isSingle && <HTimeline steps={RA.ALL_STAGES.slice(0, 9)} app={{ timeline: buildResearcherTimeline(latest.status) }} />}
        </div>
      </div>

      <div className={isSingle ? "grid-2" : ""}>
        {/* Left: payment status */}
        {isSingle ? (
          <div className="card card-pad-0">
            <div className="card-head">
              <h3>{isR4 ? "Latest Claim Status" : "Grant Payment Status"}{singleGrant ? " · " + singleGrant.code : ""}</h3>
              <div className="grow"></div>
              {singleGrant && <Badge status={window.DB.statusBadge(singleGrant.status)} />}
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
                  <button className="btn btn-secondary mt-4" onClick={() => navigate("r-payments")}>
                    View payment status <Icon name="ArrowRight" size={13} />
                  </button>
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

        {/* Right: my applications (live). AU-R1 keeps this on its dedicated page. */}
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
                <Badge status={window.DB.statusBadge(a.status)} />
              </div>
            ))}
          </div>
        </div>}
      </div>

    </>
  );
}

const RESEARCHER_DEFAULT_DRAFT = {
  title: "",
  field: "",
  type: "Individual Research",
  startDate: "", endDate: "", duration: "12",
  keywords: "",
  name: "", title2: "", auId: "", email: "", phone: "", office: "", joinedDate: "",
  school: "",
  department: "",
  outcome: "",
};
const RESEARCHER_DEFAULT_SPLIT = { remuneration: 30, equipment: 40, travel: 18, misc: 12 };
const RESEARCHER_BUDGET_LABELS = [
  "Remuneration (research assistant)",
  "Research equipment",
  "Travel for off-campus data collection",
  "Miscellaneous (postage, photocopying, binding)",
];
function scaledBudgetRows(total, split) {
  const t = Number(total) || 0;
  const s = split || RESEARCHER_DEFAULT_SPLIT;
  const a = Math.round(t * (s.remuneration || 0) / 100);
  const b = Math.round(t * (s.equipment || 0) / 100);
  const c = Math.round(t * (s.travel || 0) / 100);
  const amts = [a, b, c, t - a - b - c];
  return RESEARCHER_BUDGET_LABELS.map((item, i) => ({ item: item, amount: amts[i], purpose: "" }));
}
const RESEARCHER_DEFAULT_BUDGET_ROWS = scaledBudgetRows(100000, RESEARCHER_DEFAULT_SPLIT);

const roStyle = { background: "var(--paper-warm)", color: "var(--ink-2)", cursor: "not-allowed" };

/* Upload every pending file at once instead of one after another (a sequential
   loop made submitting with several PDFs feel frozen) and report any that fail
   instead of silently dropping them. Returns the names that did not upload. */
async function uploadAllDocuments(appId, files) {
  const results = await Promise.all((files || []).map(it =>
    window.DB.uploadDocument(appId, it.file, it.docType || null)
      .then(() => null)
      .catch(() => (it.file && it.file.name) || "a file")
  ));
  return results.filter(Boolean);
}

/* Banner shown when a researcher re-opens an application that a reviewer sent
   back. Everything they already filled in is still loaded — this tells them what
   still needs fixing before they resubmit. */
function ReturnNotice({ info }) {
  if (!info) return null;
  const who = (info.actor && info.actor.full_name) || ({ dean: "The Dean", committee: "The Faculty Committee", iras: "The research office" }[info.actor_role] || "A reviewer");
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

function grantSystemFor(id) {
  const list = (RA && RA.GRANT_SYSTEMS) || [];
  return list.find(s => s.id === id) || list[0] || { id: "au_r1", code: "AU-R1", name: "Research Grant", maxAmount: 100000, collaborative: false };
}

function fmtNiceDate(iso) {
  if (!iso) return "";
  var d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
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

function UniversityJoinedDateField({ value, onChange }) {
  const service = universityServiceEligibility(value);
  return (
    <div className="field">
      <label>Date Joined Assumption University *</label>
      <AUDatePicker value={value} onChange={onChange} max={todayISO()} placeholder="Select joined date…" />
      {value && (
        <div style={{ fontSize: 11, marginTop: 5, color: service.eligible ? "var(--status-approved)" : "var(--au-crimson)", fontWeight: 650 }}>
          {service.eligible
            ? "Eligible — at least one year of university service completed."
            : "Not eligible until " + fmtNiceDate(service.eligibleOn) + "."}
        </div>
      )}
    </div>
  );
}

/* ---------- B. Submit Application ---------- */
function ResearcherSubmit({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId, grantType }) {
  const sys = grantSystemFor(grantType || "au_r1");
  const isR3 = !!sys.collaborative;
  const maxAmount = sys.maxAmount || 100000;

  const [draft, setDraft] = useState({ ...RESEARCHER_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const [coMembers, setCoMembers] = useState([]);
  const addMember = () => setCoMembers(m => m.concat([{ name: "", kind: "Researcher", auId: "", email: "" }]));
  const setMember = (i, k, v) => setCoMembers(m => m.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const removeMember = (i) => setCoMembers(m => m.filter((_, j) => j !== i));

  const [budgetRows, setBudgetRows] = useState(scaledBudgetRows(maxAmount, RESEARCHER_DEFAULT_SPLIT));
  const total = budgetRows.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const [reqTotal, setReqTotal] = useState(String(maxAmount));
  const setAmt = (i, v) => setBudgetRows(rows => rows.map((r, j) => j === i ? { ...r, amount: (v + "").replace(/[^0-9]/g, "") } : r));
  const setPct = (i, v) => {
    const pct = Math.max(0, Math.min(100, Number((v + "").replace(/[^0-9.]/g, "")) || 0));
    const t = Number(reqTotal) || 0;
    setBudgetRows(rows => rows.map((r, j) => j === i ? { ...r, amount: Math.round(t * pct / 100) } : r));
  };

  const [items, setItems] = useState([{ purpose: "", amount: "" }]);
  const itemsTotal = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const setItem = (i, k, v) => setItems(rows => rows.map((r, j) => j === i ? { ...r, [k]: k === "amount" ? (v + "").replace(/[^0-9]/g, "") : v } : r));
  const addItem = () => setItems(rows => rows.concat([{ purpose: "", amount: "" }]));
  const removeItem = (i) => setItems(rows => rows.length > 1 ? rows.filter((_, j) => j !== i) : rows);

  const [files, setFiles] = useState([]);
  const onFiles = (e) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs.map(f => ({ file: f, docType })))); e.target.value = ""; };
  const [editingId, setEditingId] = useState(applicationId || null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(!!applicationId);
  const [returnInfo, setReturnInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyKind, setBusyKind] = useState(null);
  const [err, setErr] = useState("");
  const docTypeOptions = isR3 ? (RA.R3_DOC_TYPES || RA.DOC_TYPES) : RA.DOC_TYPES;
  const [docType, setDocType] = useState(isR3 ? "Full Research Article" : "Research Proposal");
  const [caps, setCaps] = useState(RA.DEFAULT_BUDGET_CAPS || { remuneration: 30, equipment: 50, travel: 40, misc: 20 });
  const [split, setSplit] = useState({ remuneration: 30, equipment: 40, travel: 18, misc: 12 });
  const capArr = [caps.remuneration, caps.equipment, caps.travel, caps.misc];
  const autoDuration = monthsBetween(draft.startDate, draft.endDate);

  useEffect(() => { window.DB.budgetCaps().then(setCaps).catch(() => {}); }, []);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.AUTH.profile();
        if (p && p.budget_split) setSplit(s => ({ ...s, ...p.budget_split }));
        if (p && p.office_room) setDraft(d => ({ ...d, office: d.office || p.office_room }));
        if (p && !applicationId) setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, school: (RA.FACULTIES.some(f => f.name === p.faculty) ? p.faculty : d.school), department: (RA.FACULTIES.some(f => f.name === p.faculty) ? (p.department || d.department) : d.department), phone: p.phone || d.phone, office: p.office_room || d.office }));
      } catch (e) {}
    })();
  }, [applicationId]);

  useEffect(() => {
    let cancelled = false;
    async function loadDraft() {
      if (!applicationId) {
        setEditingId(null);
        setExistingDocs([]);
        setFiles([]);
        setReqTotal(String(maxAmount));
        setBudgetRows(scaledBudgetRows(maxAmount, RESEARCHER_DEFAULT_SPLIT));
        setItems([{ purpose: "", amount: "" }]);
        setCoMembers([]);
        setDraft(d => ({
          ...RESEARCHER_DEFAULT_DRAFT,
          name: d.name,
          title2: d.title2,
          email: d.email,
          phone: d.phone,
          office: d.office,
        }));
        setLoadingDraft(false);
        return;
      }
      setLoadingDraft(true);
      setErr("");
      try {
        const app = await window.DB.applicationDetail(applicationId);
        if (!app || ["draft", "returned"].indexOf(app.status) === -1) {
          if (!cancelled) {
            setEditingId(null);
            setExistingDocs([]);
            setErr("Only draft or returned applications can be edited here.");
          }
          return;
        }
        if (cancelled) return;
        setEditingId(app.id);
        if (app.status === "returned") { window.DB.lastReturnReason(app.id).then(r => { if (!cancelled) setReturnInfo(r); }).catch(() => {}); } else setReturnInfo(null);
        setExistingDocs(app.documents || []);
        setDraft(d => ({
          ...d,
          title: app.title || "",
          field: app.field || "",
          keywords: app.keywords || "",
          duration: String(app.duration_months || 12),
          startDate: app.start_date || "",
          endDate: app.end_date || "",
          school: app.faculty || "",
          department: app.department || "",
          outcome: app.abstract || "",
          joinedDate: (app.pub_info && app.pub_info.researcherJoinedDate) || "",
          name: app.researcher ? (app.researcher.full_name || d.name) : d.name,
          email: app.researcher ? (app.researcher.email || d.email) : d.email,
        }));
        setReqTotal(String(Number(app.requested_amount || 0)));
        setBudgetRows(Array.isArray(app.budget_breakdown) && app.budget_breakdown.length ? app.budget_breakdown : scaledBudgetRows(maxAmount, RESEARCHER_DEFAULT_SPLIT));
        setItems(Array.isArray(app.budget_items) && app.budget_items.length ? app.budget_items : [{ purpose: "", amount: "" }]);
        setCoMembers(Array.isArray(app.co_members) ? app.co_members : []);
      } catch (e) {
        if (!cancelled) setErr((e && e.message) || "Could not load this draft.");
      } finally {
        if (!cancelled) setLoadingDraft(false);
      }
    }
    loadDraft();
    return () => { cancelled = true; };
  }, [applicationId]);

  const deleteExistingDoc = (doc) => {
    const runDelete = async () => {
      try {
        await window.DB.deleteDocument(doc);
        setExistingDocs(ds => ds.filter(d => d.id !== doc.id));
        toast(doc.name + " deleted.");
      } catch (ex) {
        toast("Delete error: " + ((ex && ex.message) || ex));
      }
    };
    if (setConfirm) {
      setConfirm({
        kind: "danger",
        title: "Delete uploaded file?",
        message: doc.name + " will be removed from this draft and from storage.",
        confirmLabel: "Delete File",
        onConfirm: runDelete,
      });
    } else {
      runDelete();
    }
  };

  async function save(submit) {
    setErr("");
    if (submit && !draft.title.trim()) { setErr("Research title is required."); return; }
    if (submit && !draft.school) { setErr("Select your faculty so the application routes to the right reviewers."); return; }
    if (submit && !draft.joinedDate) { setErr("Select the date you joined Assumption University."); return; }
    if (submit && !universityServiceEligibility(draft.joinedDate).eligible) { setErr("You are not eligible yet. Researchers must have at least one year of service at Assumption University."); return; }
    if (submit && draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim())) { setErr("Email must be an Assumption University address ending in @au.edu."); return; }
    if (submit && (!draft.startDate || !draft.endDate)) { setErr("Select the project start and expected end dates."); return; }
    if (submit && autoDuration <= 0) { setErr("The expected end date must be after the start date."); return; }
    if (submit && Number(reqTotal) > maxAmount) { setErr("Requested amount (" + Number(reqTotal).toLocaleString() + " THB) exceeds the " + maxAmount.toLocaleString() + " THB maximum for " + sys.code + " grants."); return; }
    if (submit && Number(reqTotal) <= 0) { setErr("Enter the grant amount you are requesting."); return; }
    if (submit && total !== Number(reqTotal)) { setErr("Budget breakdown (" + total.toLocaleString() + " THB) must equal the requested total (" + Number(reqTotal).toLocaleString() + " THB)."); return; }
    if (submit) {
      const overIdx = budgetRows.findIndex((b, i) => Number(reqTotal) > 0 && Math.round((Number(b.amount) || 0) / Number(reqTotal) * 100) > capArr[i]);
      if (overIdx !== -1) { setErr(budgetRows[overIdx].item + " exceeds its AU cap of " + capArr[overIdx] + "% of the total budget."); return; }
    }
    setBusy(true); setBusyKind(submit ? "submit" : "draft");
    try {
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department, office_room: draft.office }); } catch (e) {}
      const app = await window.DB.createApplication({
        title: draft.title, abstract: draft.outcome, field: draft.field,
        faculty: draft.school, department: draft.department, keywords: draft.keywords,
        requested_amount: Number(reqTotal), duration_months: autoDuration || draft.duration,
        start_date: draft.startDate || null, end_date: draft.endDate || null,
        budget_breakdown: budgetRows,
        budget_items: items.filter(it => (it.purpose || "").trim() || Number(it.amount) > 0),
        grant_type: sys.id,
        pub_info: { researcherJoinedDate: draft.joinedDate || null },
        co_members: isR3 ? coMembers.filter(m => (m.name || "").trim()) : null,
      }, submit, editingId);
      const failedUploads = await uploadAllDocuments(app.id, files);
      if (!submit) {
        setEditingId(app.id);
        if (setSelectedApplicationId) setSelectedApplicationId(app.id);
      } else if (setSelectedApplicationId) {
        setSelectedApplicationId(null);
      }
      if (failedUploads.length) {
        toast(failedUploads.length + " file(s) could not be uploaded: " + failedUploads.join(", ") + ". Open the application and add them again.");
      } else {
        toast(submit ? ("Application " + app.code + " submitted") : ("Draft " + app.code + " saved"));
      }
      navigate("r-applications");
    } catch (ex) { setErr((ex && ex.message) || "Could not save the application."); setBusy(false); }
  }

  if (loadingDraft) {
    return <><PageHeader title="Edit Draft" desc="Loading saved draft." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading draft...</div></>;
  }

  return (
    <>
      <PageHeader
        title={(editingId ? "Edit " : "Submit ") + sys.code + " Application"}
        desc={sys.name + (isR3 ? " — present a paper with your collaborators. " : " — ") + (editingId ? "Update this saved or returned application, then submit it to Dean screening." : "Complete each section and upload the required documents before submitting.")}
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
          <h4><span className="num">1</span> Research Information</h4>
          <p className="section-sub">Title, field, type and timing of the proposed research.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field full">
                <label>Research Title</label>
                <input value={draft.title} onChange={e => upd("title", e.target.value)} />
              </div>
              <div className="field">
                <label>Field / Discipline</label>
                <input value={draft.field} onChange={e => upd("field", e.target.value)} />
              </div>
              <div className="field">
                <label>Work Type</label>
                <select value={draft.type} onChange={e => upd("type", e.target.value)}>
                  {RA.WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Keywords</label>
                <input value={draft.keywords} onChange={e => upd("keywords", e.target.value)} />
              </div>
              <div className="field">
                <label>Start Date</label>
                <AUDatePicker value={draft.startDate} max={draft.endDate || undefined}
                  onChange={v => upd("startDate", v)} placeholder="Select start date…" />
              </div>
              <div className="field">
                <label>Expected End Date</label>
                <AUDatePicker value={draft.endDate} min={draft.startDate || undefined}
                  onChange={v => upd("endDate", v)} placeholder="Select end date…" />
              </div>
              <div className="field">
                <label>Duration</label>
                <input readOnly value={autoDuration ? autoDuration + (autoDuration === 1 ? " month" : " months") : "—"}
                  style={{ background: "var(--paper-warm)", color: "var(--ink-2)", cursor: "not-allowed" }}
                  title="Calculated automatically from the start and expected end dates" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">2</span> Researcher Information</h4>
          <p className="section-sub">Principal investigator contact details and the faculty used to route the application.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Title</label>
                <select value={draft.title2} onChange={e => upd("title2", e.target.value)}>
                  <option value="">Select title…</option>
                  {RA.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Full Name</label>
                <input value={draft.name} onChange={e => upd("name", e.target.value)} />
              </div>
              <div className="field">
                <label>AU ID</label>
                <input value={draft.auId} onChange={e => upd("auId", e.target.value)} placeholder="e.g. 5012345" />
              </div>
              <div className="field">
                <label>Email (AU only)</label>
                <input type="email" value={draft.email} onChange={e => upd("email", e.target.value)} placeholder="name@au.edu"
                  style={draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim()) ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)" } : {}} />
                {draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim()) && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Must end in @au.edu</div>}
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={draft.phone} onChange={e => upd("phone", e.target.value)} />
              </div>
              <div className="field">
                <label>Office / Room</label>
                <input value={draft.office} onChange={e => upd("office", e.target.value)} placeholder="e.g. Building A, Room 512" />
              </div>
              <UniversityJoinedDateField value={draft.joinedDate} onChange={v => upd("joinedDate", v)} />
              <div className="field">
                <label>School / Faculty</label>
                <select value={draft.school} onChange={e => { upd("school", e.target.value); upd("department", ""); }}>
                  <option value="">Select your faculty…</option>
                  {RA.FACULTIES.map(f => <option key={f.code} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Department</label>
                <select value={draft.department} onChange={e => upd("department", e.target.value)} disabled={!draft.school}>
                  <option value="">{draft.school ? "Select department…" : "Select a faculty first"}</option>
                  {(RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {isR3 && (
              <div style={{ marginTop: 18, borderTop: "1px solid var(--line-2)", paddingTop: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Collaborators (Co-members)</div>
                <p className="section-sub" style={{ marginTop: 0 }}>Add the other researchers and students collaborating on this paper. Leave empty if you are applying alone.</p>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Name</th><th style={{ width: 130 }}>Role</th><th style={{ width: 120 }}>AU ID</th><th>Email</th><th style={{ width: 48 }}></th></tr>
                    </thead>
                    <tbody>
                      {coMembers.length === 0 && (
                        <tr><td colSpan="5" style={{ color: "var(--ink-3)", textAlign: "center", padding: "14px" }}>No collaborators added — you are applying as the sole applicant.</td></tr>
                      )}
                      {coMembers.map((m, i) => (
                        <tr key={i}>
                          <td><input value={m.name} onChange={e => setMember(i, "name", e.target.value)} placeholder="Full name" style={{ width: "100%", minWidth: 140 }} /></td>
                          <td>
                            <select value={m.kind} onChange={e => setMember(i, "kind", e.target.value)}>
                              <option value="Researcher">Researcher</option>
                              <option value="Student">Student</option>
                            </select>
                          </td>
                          <td><input value={m.auId} onChange={e => setMember(i, "auId", e.target.value)} placeholder="ID" style={{ width: "100%", minWidth: 90 }} /></td>
                          <td><input type="email" value={m.email} onChange={e => setMember(i, "email", e.target.value)} placeholder="name@au.edu" style={{ width: "100%", minWidth: 150 }} /></td>
                          <td style={{ textAlign: "center" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeMember(i)} title="Remove collaborator"><Icon name="Trash2" size={13} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addMember}><Icon name="Plus" size={13} /> Add collaborator</button>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">3</span> Budget Information</h4>
          <p className="section-sub">Enter any amount up to the {maxAmount.toLocaleString()} THB {sys.code} maximum, then itemise it below. Caps: remuneration ≤{caps.remuneration}%, equipment ≤{caps.equipment}%, travel ≤{caps.travel}%, misc ≤{caps.misc}%.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Total Grant Requested (THB)</label>
                <input value={Number(reqTotal || 0).toLocaleString()}
                  onChange={e => {
                    const v = (e.target.value + "").replace(/[^0-9]/g, ""); setReqTotal(v);
                    const t = Number(v) || 0;
                    const a = Math.round(t * (split.remuneration || 0) / 100), b = Math.round(t * (split.equipment || 0) / 100), c = Math.round(t * (split.travel || 0) / 100);
                    const amts = [a, b, c, t - a - b - c];
                    setBudgetRows(rows => rows.map((r, i) => ({ ...r, amount: amts[i] })));
                  }}
                  title="Enter any amount up to 100,000 THB — the breakdown below divides automatically"
                  style={Number(reqTotal) > 100000 ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)", fontWeight: 600 } : {}} />
              </div>
              <div className="field">
                <label>Currency</label>
                <select><option>Thai Baht (THB)</option></select>
              </div>
              <div className="field full">
                <label>Budget Breakdown — divides automatically from the total above (edit any amount to customise)</label>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Budget Item</th><th style={{ textAlign: "center" }}>% of total</th><th style={{ textAlign: "center" }}>AU cap</th><th style={{ width: 150, textAlign: "right" }}>Amount (THB)</th></tr>
                    </thead>
                    <tbody>
                      {budgetRows.map((b, i) => {
                        const reqNum = Number(reqTotal) || 0;
                        const pct = reqNum > 0 ? Math.round((Number(b.amount) || 0) / reqNum * 100) : 0;
                        const over = pct > capArr[i];
                        return (
                          <tr key={i}>
                            <td>{b.item}</td>
                            <td style={{ textAlign: "center" }}>
                              <input value={pct} onChange={e => setPct(i, e.target.value)}
                                style={{ width: 48, textAlign: "center", fontFamily: "ui-monospace, monospace", color: over ? "var(--au-crimson)" : "inherit", fontWeight: over ? 600 : 400 }} />
                              <span style={{ color: over ? "var(--au-crimson)" : "var(--ink-3)" }}>%</span>
                            </td>
                            <td style={{ textAlign: "center", fontSize: 12, color: "var(--ink-3)" }}>≤ {capArr[i]}%</td>
                            <td style={{ textAlign: "right" }}>
                              <input value={(Number(b.amount) || 0).toLocaleString()} onChange={e => setAmt(i, e.target.value)}
                                style={{ width: 120, textAlign: "right", fontFamily: "ui-monospace, monospace" }} />
                            </td>
                          </tr>
                        );
                      })}
                      <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}>
                        <td>Total of breakdown</td><td></td><td></td>
                        <td style={{ textAlign: "right", color: total !== Number(reqTotal) ? "var(--au-crimson)" : "inherit" }}>{fmtBaht(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {total !== Number(reqTotal) && <div style={{ fontSize: 12, color: "var(--au-crimson)", marginTop: 6 }}>Breakdown ({fmtBaht(total)}) doesn't match your requested total ({fmtBaht(Number(reqTotal))}) — adjust the amounts.</div>}
              </div>
              <div className="field full">
                <label>Itemized Budget Breakdown — list what each amount is for (e.g. transport, materials, software)</label>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Purpose / Note</th><th style={{ width: 160, textAlign: "right" }}>Amount (THB)</th><th style={{ width: 56 }}></th></tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr key={i}>
                          <td><input value={it.purpose} onChange={e => setItem(i, "purpose", e.target.value)} placeholder="e.g. Transport to off-campus data collection site" style={{ width: "100%", minWidth: 200 }} /></td>
                          <td style={{ textAlign: "right" }}><input value={(Number(it.amount) || 0).toLocaleString()} onChange={e => setItem(i, "amount", e.target.value)} style={{ width: 120, textAlign: "right", fontFamily: "ui-monospace, monospace" }} /></td>
                          <td style={{ textAlign: "center" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(i)} title="Remove item"><Icon name="Trash2" size={13} /></button></td>
                        </tr>
                      ))}
                      <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}>
                        <td>Itemized total</td>
                        <td style={{ textAlign: "right" }}>{fmtBaht(itemsTotal)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addItem}><Icon name="Plus" size={13} /> Add item</button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">4</span> Expected Outcomes</h4>
          <p className="section-sub">Deliverables, publications, and downstream artefacts.</p>
          <div className="section-body">
            <div className="field">
              <textarea
                className="comment-input"
                style={{ minHeight: 120 }}
                value={draft.outcome}
                onChange={e => upd("outcome", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">5</span> Required Documents</h4>
          <p className="section-sub">Upload the {sys.code} PDF documents. You can add or delete files while the application is still waiting for Dean screening.</p>
          <div className="section-body">
            {isR3 ? (
              <div style={{ background: "var(--paper-warm)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--ink-2)" }}>Documents required for an {sys.code} Paper Presentation Grant:</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  {(RA.PAPER_PRESENTATION_DOCS || []).map(d => (
                    <li key={d.id}><b>{d.name.replace(/_/g, " ").replace(/\.pdf$/i, "")}</b> — {d.role.replace(/^AU-R3 requirement:?\s*/i, "")}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ background: "var(--paper-warm)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--ink-2)" }}>Download the blank AU forms you need (opens in a new tab):</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {RA.NECESSARY_DOCS.map(d => (
                    <a key={d.file} href={d.file} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                      <Icon name="Download" size={13} /> {d.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {existingDocs.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {existingDocs.map(d => (
                  <div className="file-row" key={d.id || d.name}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta">
                      <div className="fn">{d.name}{d.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{d.doc_type}</span>}</div>
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
                      <button className="btn btn-secondary btn-sm" onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}>
                        <Icon name="X" size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="field" style={{ maxWidth: 360, marginBottom: 10 }}>
              <label>Document type for the next upload</label>
              <select value={docType} onChange={e => setDocType(e.target.value)}>
                {docTypeOptions.map(t => <option key={t} value={t}>{t === "Other supporting document" && !isR3 ? t + " (optional)" : t}</option>)}
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

        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--line)",
          background: "var(--paper-warm)",
          display: "flex", gap: 8, justifyContent: "flex-end",
        }}>
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

/* ---------- B1. Submit AU-R3 Paper Presentation (conference) ---------- */
const R3_DEFAULT_DRAFT = {
  confName: "", organizer: "", website: "", confType: "International", conferenceLocation: "",
  presentationDate: "", presentation: "Oral Presentation", journalDb: "", journalClassification: "",
  paperTitle: "", field: "", keywords: "", corresponding: "", paperAbstract: "",
  name: "", title2: "", auId: "", email: "", phone: "", office: "", joinedDate: "", school: "", department: "",
  outcome: "",
};
function ResearcherSubmitR3({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId }) {
  const fixedGrantAmount = 3500;
  const [draft, setDraft] = useState({ ...R3_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const classificationOptions = (RA.R4_JOURNAL_CLASSIFICATIONS || {})[draft.journalDb] || null;

  const [authors, setAuthors] = useState([]);
  const addAuthor = () => setAuthors(m => m.concat([{ name: "", kind: "Researcher", auId: "", email: "" }]));
  const setAuthor = (i, k, v) => setAuthors(m => m.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const removeAuthor = (i) => setAuthors(m => m.filter((_, j) => j !== i));

  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("Full Research Article");
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
        if (p && !applicationId) setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, school: (RA.FACULTIES.some(f => f.name === p.faculty) ? p.faculty : d.school), department: (RA.FACULTIES.some(f => f.name === p.faculty) ? (p.department || d.department) : d.department), phone: p.phone || d.phone, office: p.office_room || d.office }));
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
          corresponding: ci.correspondingAuthor || "", paperAbstract: ci.paperAbstract || "",
          joinedDate: ci.researcherJoinedDate || "",
          school: app.faculty || d.school, department: app.department || d.department,
          outcome: app.abstract || "",
          name: app.researcher ? (app.researcher.full_name || d.name) : d.name,
          email: app.researcher ? (app.researcher.email || d.email) : d.email,
        }));
        setAuthors(Array.isArray(app.co_members) ? app.co_members : []);
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
    if (submit && !draft.journalDb) { setErr("Select the Journal Database / Index."); return; }
    if (submit && !draft.journalClassification.trim()) { setErr("Select or enter the journal classification."); return; }
    if (submit && !draft.school) { setErr("Select your faculty so the application routes to the right reviewers."); return; }
    if (submit && !draft.joinedDate) { setErr("Select the date you joined Assumption University."); return; }
    if (submit && !universityServiceEligibility(draft.joinedDate).eligible) { setErr("You are not eligible yet. AU-R3 applicants must have at least one year of service at Assumption University."); return; }
    if (submit && draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim())) { setErr("Email must be an Assumption University address ending in @au.edu."); return; }
    setBusy(true); setBusyKind(submit ? "submit" : "draft");
    try {
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department, office_room: draft.office }); } catch (e) {}
      const confInfo = {
        confName: draft.confName, organizer: draft.organizer, website: draft.website,
        confType: draft.confType, conferenceLocation: draft.conferenceLocation,
        presentationDate: draft.presentationDate || null,
        presentation: draft.presentation || "Oral Presentation",
        journalDb: draft.journalDb, journalClassification: draft.journalClassification,
        correspondingAuthor: draft.corresponding, paperAbstract: draft.paperAbstract,
        researcherJoinedDate: draft.joinedDate || null,
      };
      const app = await window.DB.createApplication({
        title: draft.paperTitle, abstract: draft.outcome, field: draft.field,
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
                    <tr><th>Name</th><th style={{ width: 130 }}>Role</th><th style={{ width: 120 }}>AU ID</th><th>Email</th><th style={{ width: 48 }}></th></tr>
                  </thead>
                  <tbody>
                    {authors.length === 0 && (
                      <tr><td colSpan="5" style={{ color: "var(--ink-3)", textAlign: "center", padding: "14px" }}>No co-authors added — you are the sole author.</td></tr>
                    )}
                    {authors.map((m, i) => (
                      <tr key={i}>
                        <td><input value={m.name} onChange={e => setAuthor(i, "name", e.target.value)} placeholder="Full name" style={{ width: "100%", minWidth: 140 }} /></td>
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
          <p className="section-sub">Auto-filled from your profile — check it before submitting. The faculty routes the application to your Dean.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Title</label>
                <select value={draft.title2} onChange={e => upd("title2", e.target.value)}>
                  <option value="">Select title…</option>
                  {RA.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Full Name</label><input value={draft.name} onChange={e => upd("name", e.target.value)} readOnly={!!draft.name} style={draft.name ? roStyle : null} /></div>
              <div className="field"><label>AU ID</label><input value={draft.auId} onChange={e => upd("auId", e.target.value)} readOnly={!!draft.auId} placeholder="e.g. 5012345" style={draft.auId ? roStyle : null} /></div>
              <div className="field">
                <label>Email (AU only)</label>
                <input type="email" value={draft.email} onChange={e => upd("email", e.target.value)} readOnly={!!draft.email} placeholder="name@au.edu"
                  style={draft.email ? roStyle : (emailBad ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)" } : null)} />
                {!draft.email && emailBad && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Must end in @au.edu</div>}
              </div>
              <div className="field"><label>Phone</label><input value={draft.phone} onChange={e => upd("phone", e.target.value)} /></div>
              <div className="field"><label>Office / Room</label><input value={draft.office} onChange={e => upd("office", e.target.value)} placeholder="e.g. Building A, Room 512" /></div>
              <UniversityJoinedDateField value={draft.joinedDate} onChange={v => upd("joinedDate", v)} />
              <div className="field">
                <label>School / Faculty</label>
                <select value={facultyValid ? draft.school : ""} onChange={e => { upd("school", e.target.value); upd("department", ""); }}>
                  <option value="">Select your faculty…</option>
                  {RA.FACULTIES.map(f => <option key={f.code} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Department</label>
                <select value={deptValid ? draft.department : ""} onChange={e => upd("department", e.target.value)} disabled={!facultyValid}>
                  <option value="">{draft.school ? "Select department…" : "Select a faculty first"}</option>
                  {(RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">4</span> Journal Classification</h4>
          <p className="section-sub">Select the journal or proceedings database and its classification. The AU-R3 grant amount is fixed at 3,500 THB.</p>
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
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">5</span> Expected Outcomes</h4>
          <p className="section-sub">Purpose of attending, expected benefits to Assumption University, and expected research impact.</p>
          <div className="section-body">
            <div className="field">
              <textarea className="comment-input" style={{ minHeight: 120 }} value={draft.outcome} onChange={e => upd("outcome", e.target.value)}
                placeholder={"e.g.\n- Purpose of attending the conference\n- Expected benefits to Assumption University\n- Expected research impact and outcomes"} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">6</span> Required Documents</h4>
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
                      <div className="fn">{d.name}{d.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{d.doc_type}</span>}</div>
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

/* ---------- B2. Submit AU-R4 Publication Fees & Reward ---------- */
const R4_DEFAULT_DRAFT = {
  title: "", articleType: "Research Article", pubStatus: "Published",
  journal: "", publisher: "", website: "", articleUrl: "", doi: "", issn: "",
  acceptDate: "", pubDate: "", volume: "", issue: "", pageNumber: "", academicYear: "2025",
  journalDb: "", journalClassification: "", predatory: false,
  applicantRole: "First Author",
  name: "", title2: "", auId: "", email: "", phone: "", office: "", joinedDate: "", school: "", department: "",
  claimType: "Publication Reward", feePaid: "", feeDate: "", paidBy: "",
  turnitin: "",
};
function ResearcherSubmitR4({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId }) {
  const sys = grantSystemFor("au_r4");
  const MAX = 80000;
  const [draft, setDraft] = useState({ ...R4_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const [authors, setAuthors] = useState([{ name: "", type: "First Author", email: "", contribution: "100" }]);
  const addAuthor = () => setAuthors(a => a.concat([{ name: "", type: "Corresponding Author", email: "", contribution: "" }]));
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
  const firstContrib = Number((authors.find(a => a.type === "First Author") || {}).contribution) || 0;
  const turnitinNum = Number(draft.turnitin);
  const turnitinBad = draft.turnitin !== "" && turnitinNum > 20;
  const emailBad = draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim());
  const facultyValid = RA.FACULTIES.some(f => f.name === draft.school);
  const deptOptions = (RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments;
  const deptValid = facultyValid && deptOptions.indexOf(draft.department) >= 0;
  const hasDocument = (keyword) => existingDocs.concat(files.map(it => ({ name: it.file.name, doc_type: it.docType })))
    .some(d => (((d && d.doc_type) || "") + " " + ((d && d.name) || "")).toLowerCase().includes(keyword));

  useEffect(() => {
    (async () => {
      try {
        const p = await window.AUTH.profile();
        if (p && p.office_room) setDraft(d => ({ ...d, office: d.office || p.office_room }));
        if (p && !applicationId) {
          setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, school: (RA.FACULTIES.some(f => f.name === p.faculty) ? p.faculty : d.school), department: (RA.FACULTIES.some(f => f.name === p.faculty) ? (p.department || d.department) : d.department), phone: p.phone || d.phone, office: p.office_room || d.office }));
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
          pubStatus: /^accepted for publication$/i.test(pi.pubStatus || "") ? "Accepted for Publication" : (pi.pubStatus || d.pubStatus),
          academicYear: ((String(pi.academicYear || d.academicYear).match(/\d{4}/) || ["2025"])[0]),
          joinedDate: pi.researcherJoinedDate || "",
          pageNumber: pi.pageNumber || ([pi.startPage, pi.endPage].filter(Boolean).join("–")),
          title: app.title || "", school: app.faculty || d.school, department: app.department || d.department,
          name: app.researcher ? (app.researcher.full_name || d.name) : d.name, email: app.researcher ? (app.researcher.email || d.email) : d.email }));
        if (Array.isArray(app.co_members) && app.co_members.length) {
          setAuthors(app.co_members.map((a, i) => ({
            name: a.name || "",
            type: /corresponding/i.test(a.type || "") ? "Corresponding Author" : "First Author",
            email: a.email || "",
            contribution: a.contribution === undefined || a.contribution === null ? (i === 0 ? "100" : "") : String(a.contribution),
          })));
        }
        if (pi.declarations && Array.isArray(pi.declarations)) {
          setDecls((RA.R4_DECLARATIONS || []).map((_, i) => i === 2 ? !!pi.predatory : !!pi.declarations[i]));
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
      if (!draft.journalDb) return setErr("Select the Journal Database / Index.");
      if (!draft.journalClassification.trim()) return setErr("Select or enter the journal classification.");
      if (published && !draft.articleUrl.trim()) return setErr("Enter the Article URL for the published article.");
      if (published && !draft.pageNumber.trim()) return setErr("Enter the Page Number(s) for the published article.");
      if (!published && !draft.acceptDate) return setErr("Select the Acceptance Date.");
      if (!draft.school) return setErr("Your faculty is required so the application routes to your Dean.");
      if (!draft.joinedDate) return setErr("Select the date you joined Assumption University.");
      if (!universityServiceEligibility(draft.joinedDate).eligible) return setErr("You are not eligible yet. AU-R4 applicants must have at least one year of service at Assumption University.");
      if (emailBad) return setErr("Email must be an Assumption University address ending in @au.edu.");
      if (!draft.predatory) return setErr("You must confirm the journal is not a predatory / Beall's List journal.");
      if (turnitinBad) return setErr("Turnitin similarity exceeds the 20% limit — it must be 20% or lower.");
      if (draft.turnitin === "") return setErr("Enter the Turnitin similarity percentage.");
      if (Math.round(totalContrib) !== 100) return setErr("Author contribution percentages must total 100% (currently " + totalContrib + "%).");
      if (firstContrib < 50) return setErr("The first author must have at least 50% contribution.");
      const lowCo = authors.some(a => Number(a.contribution) > 0 && Number(a.contribution) < 5);
      if (lowCo) return setErr("Each listed author must have at least 5% contribution.");
      if (authors.some(a => !a.name.trim() || !a.email.trim())) return setErr("Enter the name and email address for every listed author.");
      if (!hasDocument("author contribution")) return setErr("Attach the Author Contribution Statement.");
      if (!published && !hasDocument("acceptance")) return setErr("Attach the Acceptance Letter.");
      if (requested > MAX) return setErr("The requested claim exceeds the AU-R4 maximum of 80,000 THB per article.");
      if (tierSelected && requested <= 0) return setErr("Enter the publication fee for the selected journal tier.");
      if (!allDecl) return setErr("You must accept every eligibility declaration before submitting.");
    }
    setBusy(true); setBusyKind(submit ? "submit" : "draft");
    try {
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department, office_room: draft.office }); } catch (e) {}
      const pubInfo = {
        articleType: draft.articleType, pubStatus: draft.pubStatus, journal: draft.journal, publisher: draft.publisher,
        website: draft.website, articleUrl: published ? draft.articleUrl : null, doi: published ? draft.doi : null, issn: published ? draft.issn : null,
        acceptDate: draft.acceptDate || null, pubDate: draft.pubDate || null,
        volume: draft.volume, issue: draft.issue, pageNumber: draft.pageNumber, academicYear: draft.academicYear,
        journalDb: draft.journalDb, journalClassification: draft.journalClassification, indexLabel: catLabel, predatory: draft.predatory,
        applicantRole: draft.applicantRole, claimType: draft.claimType,
        researcherName: draft.name, researcherAuId: draft.auId, contactEmail: draft.email,
        researcherJoinedDate: draft.joinedDate || null,
        feePaid: Number(draft.feePaid) || 0, feeDate: draft.feeDate || null, paidBy: draft.paidBy, turnitin: Number(draft.turnitin) || 0,
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
        {/* 1. Publication Information */}
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
              <div className="field"><label>Journal Website</label><input value={draft.website} onChange={e => upd("website", e.target.value)} placeholder="https://…" /></div>
              <div className="field"><label>Academic Year <span style={{ color: "var(--ink-3)", fontWeight: 700 }}>(AD)</span> *</label><input value={draft.academicYear} onChange={e => upd("academicYear", (e.target.value + "").replace(/[^0-9]/g, "").slice(0, 4))} placeholder="2025" inputMode="numeric" /></div>
              {published ? (
                <>
                  <div className="field"><label>Article URL *</label><input value={draft.articleUrl} onChange={e => upd("articleUrl", e.target.value)} placeholder="https://…" /></div>
                  <div className="field"><label>DOI</label><input value={draft.doi} onChange={e => upd("doi", e.target.value)} placeholder="10.xxxx/…" /></div>
                  <div className="field"><label>ISSN / eISSN</label><input value={draft.issn} onChange={e => upd("issn", e.target.value)} /></div>
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

        {/* 2. Journal Classification */}
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

        {/* 3. Author & Contribution */}
        <div className="form-section">
          <h4><span className="num">3</span> Author and Contribution Information</h4>
          <p className="section-sub">Provide the First Author and Corresponding Author. Contributions must total 100%; the First Author needs ≥ 50%. With two authors, changing one percentage automatically balances the other.</p>
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
            <div className="field full" style={{ marginTop: 14 }}>
              <label>Author Contribution File *</label>
              <label className="upload-box" style={{ cursor: "pointer", display: "block" }}>
                <input type="file" accept="application/pdf,.pdf" style={{ display: "none" }} onChange={e => onTypedFiles(e, "Author Contribution Statement")} />
                <Icon name="Upload" size={24} className="icon" /><div className="t">Attach author contribution statement</div><div className="s">PDF · max 10 MB</div>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Researcher Information */}
        <div className="form-section">
          <h4><span className="num">4</span> Researcher Information</h4>
          <p className="section-sub">Auto-filled from your profile. Correct any name, ID, faculty, or major information before submitting.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field"><label>Title</label>
                <select value={draft.title2} onChange={e => upd("title2", e.target.value)}><option value="">Select title…</option>{RA.AU_TITLES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="field"><label>Full Name</label><input value={draft.name} onChange={e => upd("name", e.target.value)} /></div>
              <div className="field"><label>AU ID</label><input value={draft.auId} onChange={e => upd("auId", e.target.value)} placeholder="e.g. 5012345" /></div>
              <div className="field"><label>Email (AU only)</label>
                <input type="email" value={draft.email} onChange={e => upd("email", e.target.value)} style={emailBad ? { borderColor: "var(--au-crimson)" } : null} placeholder="name@au.edu" />
                {emailBad && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Must end in @au.edu</div>}</div>
              <div className="field"><label>Phone</label><input value={draft.phone} onChange={e => upd("phone", e.target.value)} /></div>
              <div className="field"><label>Office / Room</label><input value={draft.office} onChange={e => upd("office", e.target.value)} /></div>
              <UniversityJoinedDateField value={draft.joinedDate} onChange={v => upd("joinedDate", v)} />
              <div className="field"><label>School / Faculty</label>
                <select value={facultyValid ? draft.school : ""} onChange={e => { setDraft(d => ({ ...d, school: e.target.value, department: "" })); }}>
                  <option value="">Select your faculty…</option>{RA.FACULTIES.map(f => <option key={f.code} value={f.name}>{f.name}</option>)}</select></div>
              <div className="field"><label>Major</label>
                <select value={deptValid ? draft.department : ""} onChange={e => upd("department", e.target.value)} disabled={!facultyValid}>
                  <option value="">{draft.school ? "Select major…" : "Select a faculty first"}</option>
                  {(RA.FACULTIES.find(f => f.name === draft.school) || { departments: [] }).departments.map(d => <option key={d}>{d}</option>)}</select></div>
            </div>
          </div>
        </div>

        {/* 5. Publication Fee and Claim Information — shown only after a tier is selected. */}
        {tierSelected && (
          <div className="form-section">
            <h4><span className="num">5</span> Publication Fee and Claim Information</h4>
            <p className="section-sub">The final eligible amount is decided by the research office after verification.</p>
            <div className="section-body">
              <div className="form-grid">
                <div className="field"><label>Claim Type *</label>
                  <select value={draft.claimType} onChange={e => upd("claimType", e.target.value)}>{(RA.R4_CLAIM_TYPES || []).map(t => <option key={t} value={t}>{t}</option>)}</select>
                </div>
                <div className="field"><label>Publication Fee (THB) *</label>
                  <input value={draft.feePaid === "" ? "" : Number(draft.feePaid || 0).toLocaleString()} onChange={e => upd("feePaid", (e.target.value + "").replace(/[^0-9]/g, ""))} placeholder="Enter publication fee manually" inputMode="numeric" />
                </div>
                <div className="field"><label>Payment Date</label><AUDatePicker value={draft.feeDate} onChange={v => upd("feeDate", v)} placeholder="Select date…" /></div>
                <div className="field"><label>Paid By</label><input value={draft.paidBy} onChange={e => upd("paidBy", e.target.value)} placeholder="Name / department" /></div>
              </div>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginTop: 8 }}>
                <table className="tbl"><tbody>
                  <tr><td>Publication fee</td><td style={{ textAlign: "right" }}>{fmtBaht(Number(draft.feePaid) || 0)}</td></tr>
                  <tr><td>Preliminary reward</td><td style={{ textAlign: "right" }}>{fmtBaht(requested)}</td></tr>
                  <tr><td>Requested claim amount</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmtBaht(requested)}</td></tr>
                  <tr><td>Maximum eligible</td><td style={{ textAlign: "right" }}>{fmtBaht(MAX)} / article</td></tr>
                  <tr style={{ color: "var(--ink-3)" }}><td>Final research-office-approved amount</td><td style={{ textAlign: "right" }}>Pending verification</td></tr>
                </tbody></table>
              </div>
            </div>
          </div>
        )}

        {/* 6. Required Documents */}
        <div className="form-section">
          <h4><span className="num">6</span> Required Documents</h4>
          <p className="section-sub">Upload the supporting documents required for Dean, Faculty Committee, and research-office review.</p>
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
                <li><b>Author Contribution Statement</b></li>
                <li><b>Turnitin Report</b> — similarity ≤ 20%</li>
                <li><b>Original Publication Fee Receipt</b></li>
                <li><b>Memo for Dean Approval</b></li>
              </ul>
            </div>
            {existingDocs.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {existingDocs.map(d => (
                  <div className="file-row" key={d.id || d.name}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta"><div className="fn">{d.name}{d.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{d.doc_type}</span>}</div><div className="fs">{d.size || "PDF"} - Uploaded {d.uploadedAt || "-"}</div></div>
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
                    <div className="fmeta"><div className="fn">{it.file.name}{it.docType && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{it.docType}</span>}</div><div className="fs">{(it.file.size / 1024).toFixed(0)} KB · ready to upload</div></div>
                    <div className="factions"><button className="btn btn-secondary btn-sm" onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}><Icon name="X" size={13} /> Remove</button></div>
                  </div>
                ))}
              </div>
            )}
            <div className="field" style={{ maxWidth: 360, marginBottom: 10 }}>
              <label>Document type for the next upload</label>
              <select value={docType} onChange={e => setDocType(e.target.value)}>{(RA.R4_DOC_TYPES || RA.DOC_TYPES).map(t => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <label className="upload-box mt-1" style={{ cursor: "pointer", display: "block" }}>
              <input type="file" accept="application/pdf,.pdf" multiple style={{ display: "none" }} onChange={onFiles} />
              <Icon name="Upload" size={26} className="icon" />
              <div className="t">Click to upload your <b>{docType}</b></div>
              <div className="s">PDF · max 10 MB per file</div>
            </label>
          </div>
        </div>

        {/* 7. Eligibility Declaration */}
        <div className="form-section">
          <h4><span className="num">7</span> Eligibility Declaration</h4>
          <p className="section-sub">You must accept all declarations before you can submit.</p>
          <div className="section-body">
            {(RA.R4_DECLARATIONS || []).map((d, i) => (
              <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", fontSize: 13, borderBottom: "1px solid var(--line-2)" }}>
                {i === 2 ? (
                  <>
                    <input type="checkbox" checked={draft.predatory} onChange={e => { upd("predatory", e.target.checked); setDecls(s => s.map((v, j) => j === i ? e.target.checked : v)); }} style={{ accentColor: "var(--au-crimson)", marginTop: 3 }} />
                    <span>{i + 1}. I confirmed that this journal was not a predatory journal and was not listed in <a href="https://beallslist.net/" target="_blank" rel="noopener noreferrer">Beall's List</a>. *</span>
                  </>
                ) : (
                  <>
                    <input type="checkbox" checked={decls[i] || false} onChange={e => setDecls(s => s.map((v, j) => j === i ? e.target.checked : v))} style={{ accentColor: "var(--au-crimson)", marginTop: 3 }} />
                    <span>{i + 1}. {d}</span>
                  </>
                )}
              </label>
            ))}
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

/* ---------- C. My Applications ---------- */
function ResearcherApplications({ navigate, onDownload, openDetail, openDraft, setSelectedApplicationId, grantType }) {
  const sys = grantSystemFor(grantType || "au_r1");
  const [myApps, setMyApps] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const apps = await window.DB.myApplications(grantType || undefined);
        setMyApps(apps.map(a => ({
          id: a.code, _uuid: a.id, title: a.title, faculty: a.faculty, department: a.department,
          submittedAt: a.submitted_at ? window.DB.fmtDate(a.submitted_at) : "—",
          stage: window.DB.statusBadge(a.status).label, status: window.DB.statusBadge(a.status), statusKey: a.status,
        })));
      } catch (e) { setMyApps([]); }
    })();
  }, [grantType]);

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
            <input placeholder="Search by title, ID, or stage…" />
          </div>
          <button className="filter"><Icon name="Filter" size={12} /> Status: All</button>
          <button className="filter"><Icon name="Calendar" size={12} /> AY 2025–2026</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export CSV</button>
        </div>
        <table className="tbl">
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
            {myApps && myApps.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>No applications yet — click "New Application" to submit your first.</td></tr>}
            {(myApps || []).map(a => (
              <tr key={a.id}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell">
                  <div className="t">{a.title}</div>
                  <div className="s">{a.faculty || "—"}{a.department ? " · " + a.department : ""}</div>
                </td>
                <td>{a.submittedAt}</td>
                <td>{a.stage}</td>
                <td><Badge status={a.status} /></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => (a.statusKey === "draft" || a.statusKey === "returned") ? (openDraft && openDraft(a._uuid)) : (openDetail && openDetail(a._uuid))}>
                    <Icon name={(a.statusKey === "draft" || a.statusKey === "returned") ? "Edit3" : "Eye"} size={13} /> {(a.statusKey === "draft" || a.statusKey === "returned") ? "Edit" : "View"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openDetail && openDetail(a._uuid)}>
                    <Icon name="FolderOpen" size={13} /> Files
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* Printable project summary used by the browser's Save as PDF flow. */
function ProjectPrintSheet({ app, status }) {
  const sys = grantSystemFor(app.grant_type || "au_r1");
  const researcher = app.researcher || {};
  const researcherName = [researcher.name_title, researcher.full_name].filter(Boolean).join(" ") || "-";
  const payments = (app.payments || []).slice().sort((a, b) => Number(a.instalment) - Number(b.instalment));
  const show = value => value === 0 || value ? value : "-";
  const date = value => value ? window.DB.fmtDate(value) : "-";
  const amount = value => value === 0 || value ? fmtBaht(Number(value)) : "-";
  const isR1 = (app.grant_type || "au_r1") === "au_r1";
  const joinedDate = researcherJoinedDate(app);
  const service = universityServiceEligibility(joinedDate);
  const paymentRows = isR1
    ? [1, 2, 3].map(phase => {
        const payment = payments.find(p => Number(p.instalment) === phase);
        return {
          key: "phase-" + phase,
          label: "Phase " + phase,
          note: (phase === 2 ? 40 : 30) + "% milestone",
          amount: payment && payment.amount,
          paid: !!(payment && payment.status === "paid"),
          paidAt: payment && payment.paid_at,
        };
      })
    : [{
        key: "single-payment",
        label: sys.code + " payment",
        note: "Single payment",
        amount: app.approved_amount || app.requested_amount,
        paid: ["active", "completed"].includes(app.status),
        paidAt: ["active", "completed"].includes(app.status) ? (app.updated_at || app.decided_at) : null,
      }];
  const printDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <section className="project-print-sheet">
      <header className="project-print-header">
        <img src="assets/au-logo.png" alt="Assumption University" />
        <div>
          <div className="project-print-university">Assumption University</div>
          <div className="project-print-office">Office of Research Affairs | Research Grant Management System</div>
        </div>
        <div className="project-print-meta"><b>PROJECT SUMMARY</b><span>Printed {printDate}</span></div>
      </header>

      <div className="project-print-titlebar">
        <div>
          <span>Application ID</span>
          <b>{show(app.code)}</b>
        </div>
        <div>
          <span>Grant</span>
          <b>{sys.code} - {sys.name}</b>
        </div>
        <div>
          <span>Status</span>
          <b>{status && status.label ? status.label : show(app.status)}</b>
        </div>
      </div>

      <div className="project-print-section">
        <h2>Researcher and Project</h2>
        <div className="project-print-grid">
          <div className="left"><span>Researcher</span><b>{researcherName}</b></div>
          <div><span>AU ID</span><b>{show(researcher.au_id)}</b></div>
          <div className="wide"><span>Research title</span><b>{show(app.title)}</b></div>
          <div className="left"><span>Email</span><b>{show(researcher.email)}</b></div>
          <div><span>Faculty / Department</span><b>{show(app.faculty)}{app.department ? " - " + app.department : ""}</b></div>
          <div className="left"><span>Joined Assumption University</span><b>{date(joinedDate)}</b></div>
          <div><span>Service eligibility</span><b>{joinedDate ? (service.eligible ? "Eligible" : "Not eligible until " + date(service.eligibleOn)) : "Not recorded"}</b></div>
          <div className="left"><span>Submitted</span><b>{date(app.submitted_at || app.created_at)}</b></div>
          <div><span>Approved amount</span><b>{amount(app.approved_amount || app.requested_amount)}</b></div>
        </div>
      </div>

      <div className="project-print-section project-print-payment">
        <h2>{isR1 ? "Payment Phases" : "Payment Status"}</h2>
        <table>
          <thead><tr><th>Payment</th><th>Amount</th><th>Status</th><th>Payment date</th></tr></thead>
          <tbody>{paymentRows.map(row => <tr key={row.key}>
            <td><b>{row.label}</b><small>{row.note}</small></td>
            <td>{amount(row.amount)}</td>
            <td>{row.paid ? "Paid" : "Pending"}</td>
            <td>{date(row.paidAt)}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className="project-print-verification">
        <div><span>Researcher signature</span></div>
        <div><span>Finance officer</span></div>
        <div><span>Payment date</span></div>
      </div>
      <footer className="project-print-footer">
        <span>AU-RGMS | {show(app.code)} | Project information</span>
        <span>Page <i className="project-print-page"></i></span>
      </footer>
    </section>
  );
}

/* ---------- D. Application Detail ---------- */
function ResearcherApplicationDetail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const canEditDocs = app && ["draft", "submitted", "returned"].includes(app.status);

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
    } catch (e) {
      setApp(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [applicationId]);

  const uploadMore = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length || !app || busy) return;
    setBusy(true);
    try {
      for (const f of files) await window.DB.uploadDocument(app.id, f, null);
      toast(files.length + " file(s) uploaded.");
      await load();
    } catch (ex) {
      toast("Upload error: " + ((ex && ex.message) || ex));
    } finally {
      setBusy(false);
    }
  };

  const deleteDoc = (doc) => {
    if (!canEditDocs) return;
    setConfirm({
      kind: "danger",
      title: "Delete uploaded file?",
      message: doc.name + " will be removed from this application and from storage.",
      confirmLabel: "Delete File",
      onConfirm: async () => {
        try { await window.DB.deleteDocument(doc); toast(doc.name + " deleted."); await load(); }
        catch (ex) { toast("Delete error: " + ((ex && ex.message) || ex)); }
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
  const researcherName = app.researcher ? app.researcher.full_name : "Researcher";
  const status = app.statusBadge || window.DB.statusBadge(app.status);
  const joinedDate = researcherJoinedDate(app);
  const service = universityServiceEligibility(joinedDate);
  const isR1 = !app.grant_type || app.grant_type === "au_r1";
  const payments = app.payments || [];
  const reports = app.reports || [];
  const phaseApproved = n => payments.some(p => Number(p.instalment) === n && p.status === "paid");
  const milestoneReport = kind => reports.find(r => r.kind === kind && r.status === "accepted") || reports.find(r => r.kind === kind && r.status === "submitted");
  const progressReport = milestoneReport("progress");
  const finalReport = milestoneReport("final");
  const progressAccepted = progressReport && progressReport.status === "accepted";
  const finalAccepted = finalReport && finalReport.status === "accepted";
  const openProjectReport = kind => navigate(kind === "progress" ? "r-progress" : "r-final", { keepSelection: true });
  const printProject = () => {
    const previousTitle = document.title;
    const safeCode = String(app.code || "AU-Research-Project").replace(/[^a-zA-Z0-9_-]+/g, "-");
    document.title = safeCode + "-Project-Summary";
    window.print();
    document.title = previousTitle;
  };
  const timelineApp = {
    timeline: {
      submission: { done: true, current: app.status === "submitted", date: window.DB.fmtDate(app.submitted_at || app.created_at), who: researcherName },
      deanScreen: { current: app.status === "submitted", done: !["draft", "submitted", "returned"].includes(app.status), date: app.status === "submitted" ? "Waiting Dean screening" : !["draft", "returned"].includes(app.status) ? "Completed" : "Pending" },
      committee: { current: app.status === "committee_review", done: ["iras_review", "approved", "active", "completed"].includes(app.status), date: app.status === "committee_review" ? "In committee review" : ["iras_review", "approved", "active", "completed"].includes(app.status) ? "Completed" : "Pending" },
      iras: { current: app.status === "iras_review", done: ["approved", "active", "completed"].includes(app.status), date: app.status === "iras_review" ? "RASSC screening" : ["approved", "active", "completed"].includes(app.status) ? "Approved" : "Pending" },
      contract: { current: app.status === "approved", done: ["active", "completed"].includes(app.status), date: app.status === "approved" ? "Contract pending" : ["active", "completed"].includes(app.status) ? "Signed" : "Pending" },
      pay1: { current: ["approved", "active"].includes(app.status) && !phaseApproved(1), done: phaseApproved(1), date: phaseApproved(1) ? "Paid by Finance" : "Waiting for Finance" },
      progress: { current: phaseApproved(1) && !progressAccepted, done: !!progressAccepted, date: progressAccepted ? "Accepted by RASSC · click to view" : progressReport ? "At RASSC review · click to view" : phaseApproved(1) ? "Ready to submit · click to open" : "Opens after Phase 1 approval" },
      pay2: { current: !!progressAccepted && !phaseApproved(2), done: phaseApproved(2), date: phaseApproved(2) ? "Paid by Finance" : progressAccepted ? "Ready at Finance" : "After RASSC accepts progress report" },
      final: { current: phaseApproved(2) && !finalAccepted, done: !!finalAccepted, date: finalAccepted ? "Accepted by RASSC · click to view" : finalReport ? "At RASSC review · click to view" : phaseApproved(2) ? "Ready to submit · click to open" : "Opens after Phase 2 approval" },
      pay3: { current: !!finalAccepted && !phaseApproved(3), done: phaseApproved(3), date: phaseApproved(3) ? "Paid by Finance" : finalAccepted ? "Ready at Finance" : "After RASSC accepts final report" },
      closed: { current: phaseApproved(3) && app.status !== "completed", done: app.status === "completed", date: app.status === "completed" ? "Project completed" : "After Phase 3 approval" },
    },
  };

  return (
    <>
      <PageHeader
        title={app.title}
        desc={(app.code || "Application") + " - Submitted " + window.DB.fmtDate(app.submitted_at || app.created_at)}
        actions={
          <>
            <button className="btn btn-secondary" onClick={printProject} title="Open the print dialog, then choose Save as PDF"><Icon name="Printer" size={13} /> Print PDF</button>
            <Badge status={status} />
            {["draft", "returned"].includes(app.status) && <button className="btn btn-secondary" onClick={() => navigate("r-submit", { keepSelection: true })}><Icon name="Edit3" size={13} /> {app.status === "returned" ? "Edit & Resubmit" : "Edit Draft"}</button>}
          </>
        }
      />

      <ProjectPrintSheet app={app} status={status} />

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
              <div className="meta-row"><span className="l">Email</span><span className="r">{app.researcher ? app.researcher.email : "-"}</span></div>
              <div className="meta-row"><span className="l">School / Faculty</span><span className="r">{app.faculty || "-"}</span></div>
              <div className="meta-row"><span className="l">{app.grant_type === "au_r4" ? "Major" : "Department"}</span><span className="r">{app.department || "-"}</span></div>
              <div className="meta-row"><span className="l">Joined Assumption University</span><span className="r">{joinedDate ? window.DB.fmtDate(joinedDate) : "Not recorded"}</span></div>
              <div className="meta-row"><span className="l">Service eligibility</span><span className="r" style={{ color: joinedDate && service.eligible ? "var(--status-approved)" : "var(--au-crimson)" }}>{joinedDate ? (service.eligible ? "Eligible" : "Not eligible until " + fmtNiceDate(service.eligibleOn)) : "Not recorded"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
              {Array.isArray(app.co_members) && app.co_members.length > 0 && (
                <div style={{ marginTop: 8, borderTop: "1px solid var(--line-2)", paddingTop: 8 }}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Collaborators</div>
                  {app.co_members.map((m, i) => (
                    <div className="meta-row" key={i}>
                      <span className="l">{m.kind || "Member"}</span>
                      <span className="r">{m.name}{m.email ? " · " + m.email : ""}</span>
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
                  <div className="meta-row"><span className="l">Journal Database / Index</span><span className="r">{app.conference_info.journalDb || "-"}</span></div>
                  <div className="meta-row"><span className="l">Classification</span><span className="r">{app.conference_info.journalClassification || "-"}</span></div>
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
            <ReviewCommentHistory app={app} roles={app.grant_type === "au_r3" ? ["dean", "iras"] : ["dean", "committee", "iras"]} />
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
                  <div className="fmeta"><div className="fn">{d.name}</div><div className="fs">{d.size || "PDF"} - Uploaded {d.uploadedAt || "-"}</div></div>
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
            <div className="card-head"><h3>Approval Timeline</h3><div className="grow"></div><Badge status={status} /></div>
            <div className="card-body">{app.grant_type === "au_r4"
              ? <Timeline steps={R4_PIPELINE} app={{ timeline: buildR4Timeline(app.status) }} />
              : app.grant_type === "au_r3"
              ? <Timeline steps={R3_PIPELINE} app={{ timeline: buildR3Timeline(app.status) }} />
              : <Timeline steps={RA.ALL_STAGES} app={timelineApp} onStepClick={openProjectReport} />}</div>
          </div>

          {isR1 && <div className="card card-pad-0">
            <div className="card-head"><h3>Project Reports</h3></div>
            <div className="card-body">
              <p className="text-sm text-muted" style={{ marginTop: 0 }}>Reports here belong only to <b>{app.code}</b> · {app.title}.</p>
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between", marginBottom: 10 }} onClick={() => openProjectReport("progress")}>
                <span><Icon name="FileText" size={14} /> Progress Report</span>
                <span>{progressAccepted ? "Accepted" : progressReport ? "At RASSC" : phaseApproved(1) ? "Ready" : "Locked"} →</span>
              </button>
              <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => openProjectReport("final")}>
                <span><Icon name="FileCheck" size={14} /> Final Report</span>
                <span>{finalAccepted ? "Accepted" : finalReport ? "At RASSC" : phaseApproved(2) ? "Ready" : "Locked"} →</span>
              </button>
            </div>
          </div>}
        </div>
      </div>
    </>
  );
}

/* ---------- E. Progress Report ---------- */
function ResearcherProgress({ applicationId, navigate, onDownload, onView, toast }) {
  const [grant, setGrant] = useState(null);
  const [reports, setReports] = useState(null);
  const [busy, setBusy] = useState(false);
  const [reportingPeriod, setReportingPeriod] = useState("Month 1 — Month 6");
  const [customPeriod, setCustomPeriod] = useState("");
  const [progressSummary, setProgressSummary] = useState("");
  const [budgetUtilisation, setBudgetUtilisation] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const reload = async () => {
    if (!applicationId) { setGrant(false); setReports([]); return; }
    try {
      const project = await window.DB.applicationDetail(applicationId);
      if (project.grant_type && project.grant_type !== "au_r1") throw new Error("Progress reports are available only for AU-R1 projects.");
      setGrant(project);
      setReports(await window.DB.myReports("progress", applicationId));
    } catch (e) { setGrant(false); setReports([]); }
  };
  useEffect(() => { reload(); }, [applicationId]);
  const chooseReportFile = (event) => {
    const file = event.target.files && event.target.files[0];
    setFileError("");
    if (!file) { setReportFile(null); return; }
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setReportFile(null);
      setFileError("Please select a PDF file.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setReportFile(null);
      setFileError("The progress report must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }
    setReportFile(file);
  };
  const submit = async () => {
    if (!grant) { toast("Open an AU-R1 project from My Applications first."); return; }
    if (!reportFile) { toast("Select the progress report PDF before submitting."); return; }
    const existingReport = (reports || []).find(r => r.status === "submitted" || r.status === "accepted");
    const existingReportFile = (grant.documents || []).some(d => d.doc_type === "Progress Report");
    if (existingReport && existingReport.status === "submitted" && !existingReportFile) {
      setBusy(true);
      let attachedDocument = null;
      let attachmentSaved = false;
      try {
        attachedDocument = await window.DB.uploadDocument(grant.id, reportFile, "Progress Report");
        attachmentSaved = true;
        toast("Progress report PDF attached. RASSC can now review the submitted report.");
        setReportFile(null);
        await reload();
      } catch (e) {
        if (attachedDocument && !attachmentSaved) {
          try { await window.DB.deleteDocument(attachedDocument); } catch (_) {}
        }
        toast("Error: " + (e.message || e));
      }
      setBusy(false);
      return;
    }
    const finalPeriod = reportingPeriod === "custom" ? customPeriod.trim() : reportingPeriod;
    if (!finalPeriod) { toast("Enter the reporting period."); return; }
    setBusy(true);
    let uploadedDocument = null;
    let reportCreated = false;
    try {
      uploadedDocument = await window.DB.uploadDocument(grant.id, reportFile, "Progress Report");
      await window.DB.submitReport(grant.id, "progress", {
        reporting_period: finalPeriod,
        summary: progressSummary.trim(),
        budget_utilisation: budgetUtilisation.trim(),
        document_id: uploadedDocument.id,
      });
      reportCreated = true;
      toast("Progress report submitted. RASSC must accept it before Finance can approve the 40% phase.");
      setReportFile(null);
      setProgressSummary("");
      setBudgetUtilisation("");
      await reload();
    } catch (e) {
      if (uploadedDocument && !reportCreated) {
        try { await window.DB.deleteDocument(uploadedDocument); } catch (_) {}
      }
      toast("Error: " + (e.message || e));
    }
    setBusy(false);
  };
  if (grant === null) return <><PageHeader title="Project Progress Report" desc="Loading the selected AU-R1 project." /><div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Loading project…</div></>;
  if (!grant) return <><PageHeader title="Project Progress Report" desc="Choose the research project this report belongs to." /><div className="card"><Empty title="No project selected" desc="Open My Applications, choose View or Files, then open Progress Report from that project's timeline." icon="Folder" /><div style={{ textAlign: "center", paddingBottom: 24 }}><button className="btn btn-primary" onClick={() => navigate("r-applications")}><Icon name="ArrowLeft" size={13} /> My Applications</button></div></div></>;
  const phaseOneApproved = (grant.payments || []).some(p => Number(p.instalment) === 1 && p.status === "paid");
  const currentReport = (reports || []).find(r => r.status === "submitted" || r.status === "accepted");
  const hasReportFile = (grant.documents || []).some(d => d.doc_type === "Progress Report");
  const canAttachMissingFile = currentReport && currentReport.status === "submitted" && !hasReportFile;
  const canSubmit = phaseOneApproved && !currentReport;
  return (
    <>
      <PageHeader
        title={"Progress Report · " + grant.title}
        desc={(grant.code || "AU-R1 project") + " — this report belongs only to this selected research project."}
        actions={<><button className="btn btn-secondary" onClick={() => navigate("r-detail", { keepSelection: true })}><Icon name="ArrowLeft" size={13} /> Back to Project</button><Badge status={{ label: "Routes to RASSC", cls: "badge-iras" }} /></>}
      />

      <div className="card card-pad-0 mb-4">
        <div className="card-head"><h3>Selected Research Project</h3><div className="grow"></div><Badge status={window.DB.statusBadge(grant.status)} /></div>
        <div className="card-body">
          <div className="meta-row"><span className="l">Application ID</span><span className="r"><b>{grant.code}</b></span></div>
          <div className="meta-row"><span className="l">Research title</span><span className="r"><b>{grant.title}</b></span></div>
          <div className="meta-row"><span className="l">School / Faculty</span><span className="r">{grant.faculty || "—"}{grant.department ? " · " + grant.department : ""}</span></div>
          <div className="meta-row"><span className="l">Report unlock</span><span className="r">{phaseOneApproved ? "Phase 1 approved — report is available" : "Locked until Finance approves Phase 1"}</span></div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Submit Progress Report</h3></div>
            <div className="card-body">
              <div className="field">
                <label>Reporting period</label>
                <select value={reportingPeriod} onChange={e => setReportingPeriod(e.target.value)}>
                  <option value="Month 1 — Month 6">Month 1 — Month 6</option>
                  <option value="Month 7 — Month 9">Month 7 — Month 9</option>
                  <option value="custom">Enter manually</option>
                </select>
              </div>
              {reportingPeriod === "custom" && <div className="field">
                <label>Custom reporting period *</label>
                <input value={customPeriod} onChange={e => setCustomPeriod(e.target.value)} placeholder="Example: Month 4 — Month 8" />
              </div>}
              <div className="field">
                <label>Summary of progress</label>
                <textarea className="comment-input" style={{minHeight: 120}} value={progressSummary} onChange={e => setProgressSummary(e.target.value)} placeholder="Enter progress summary for this reporting period."></textarea>
              </div>
              <div className="field">
                <label>Budget utilisation</label>
                <textarea className="comment-input" value={budgetUtilisation} onChange={e => setBudgetUtilisation(e.target.value)} placeholder="Summarize spending for this reporting period."></textarea>
              </div>
              <div className="field">
                <label>Upload progress report (PDF) *</label>
                <label className={"upload-box" + (reportFile ? " has-file" : "")} style={{display: "block"}}>
                  <input key={reportFile ? reportFile.name + reportFile.lastModified : "empty-progress-file"} type="file" accept="application/pdf,.pdf" style={{display: "none"}} onChange={chooseReportFile} />
                  <Icon name="Upload" size={24} className="icon" />
                  <div className="t">{reportFile ? reportFile.name : hasReportFile ? "Progress report PDF is attached" : "Click to select the progress report"}</div>
                  <div className="s">{reportFile ? (reportFile.size / 1024 / 1024).toFixed(2) + " MB · Click to replace" : "PDF · max 10 MB"}</div>
                </label>
                {fileError && <div className="form-error" style={{marginTop: 7}}>{fileError}</div>}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted">Submitted first to RASSC. Finance receives Phase 2 only after RASSC accepts the report.</span>
                <button className="btn btn-primary" onClick={submit} disabled={busy || (!canSubmit && !canAttachMissingFile) || !reportFile || (!currentReport && reportingPeriod === "custom" && !customPeriod.trim())}>
                  <Icon name="Send" size={13} /> {busy ? "Uploading…" : canAttachMissingFile ? (reportFile ? "Attach PDF to Submitted Report" : "Select PDF to Attach") : currentReport ? (currentReport.status === "accepted" ? "Report Accepted" : "At RASSC Review") : !phaseOneApproved ? "Locked · Phase 1 Required" : !reportFile ? "Select PDF to Submit" : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Submitted Progress Reports</h3></div>
            <div className="card-body">
              {reports === null && <div className="text-sm text-muted">Loading reports...</div>}
              {reports && reports.length === 0 && <div className="text-sm text-muted">No progress reports submitted yet.</div>}
              {(reports || []).map(r => (
                <div key={r.id} className="flex justify-between items-center" style={{padding: "10px 0", borderBottom: "1px solid var(--line-2)"}}>
                  <div>
                  <div style={{fontWeight: 600}}>{grant.code} · {grant.title}</div>
                    <div className="text-sm text-muted">Status: {r.status}</div>
                  </div>
                  <Badge status={r.status === "accepted" ? { label: "Accepted · Sent to Finance", cls: "badge-paid" } : { label: "At RASSC Review", cls: "badge-iras" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Reporting Schedule</h3></div>
            <div className="card-body">
              <Timeline
                steps={[
                  { key: "k1", label: "Project kickoff" },
                  { key: "p1", label: "Progress Report (Month 6)" },
                  { key: "p2", label: "Phase 2 Finance Approval (40%)" },
                  { key: "f1", label: "Final Report (Month 12)" },
                  { key: "f2", label: "Phase 3 Finance Approval (30%)" },
                ]}
                app={{ timeline: {
                  k1: { done: phaseOneApproved, date: phaseOneApproved ? "Phase 1 approved" : "Waiting for Phase 1" },
                  p1: { current: phaseOneApproved && !(currentReport && currentReport.status === "accepted"), done: currentReport && currentReport.status === "accepted", date: currentReport ? (currentReport.status === "accepted" ? "Accepted by RASSC" : "At RASSC review") : phaseOneApproved ? "Ready to submit for " + grant.code : "Locked" },
                  p2: { current: currentReport && currentReport.status === "accepted", date: "After RASSC accepts progress report" },
                  f1: { date: "At project completion" },
                  f2: { date: "After RASSC accepts final report" },
                }}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- F. Final Report ---------- */
function ResearcherFinal({ applicationId, navigate, onDownload, onView, toast }) {
  const [grant, setGrant] = useState(null);
  const [reports, setReports] = useState(null);
  const [busy, setBusy] = useState(false);
  const [finalFile, setFinalFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [totalSpent, setTotalSpent] = useState("");
  const [completion, setCompletion] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [lessons, setLessons] = useState("");
  const reload = async () => {
    if (!applicationId) { setGrant(false); setReports([]); return; }
    try {
      const project = await window.DB.applicationDetail(applicationId);
      if (project.grant_type && project.grant_type !== "au_r1") throw new Error("Final reports are available only for AU-R1 projects.");
      setGrant(project);
      setReports(await window.DB.myReports("final", applicationId));
    } catch (e) { setGrant(false); setReports([]); }
  };
  useEffect(() => { reload(); }, [applicationId]);
  const chooseFinalFile = (event) => {
    const file = event.target.files && event.target.files[0];
    setFileError("");
    if (!file) { setFinalFile(null); return; }
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setFinalFile(null);
      setFileError("Please select a PDF file.");
      event.target.value = "";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setFinalFile(null);
      setFileError("The final report must be 15 MB or smaller.");
      event.target.value = "";
      return;
    }
    setFinalFile(file);
  };
  const submit = async () => {
    if (!grant) { toast("Open an AU-R1 project from My Applications first."); return; }
    if (!finalFile) { toast("Select the final report PDF before submitting."); return; }
    const existingReport = (reports || []).find(r => r.status === "submitted" || r.status === "accepted");
    const existingReportFile = (grant.documents || []).some(d => d.doc_type === "Final Report");
    if (existingReport && existingReport.status === "submitted" && !existingReportFile) {
      setBusy(true);
      let attachedDocument = null;
      let attachmentSaved = false;
      try {
        attachedDocument = await window.DB.uploadDocument(grant.id, finalFile, "Final Report");
        attachmentSaved = true;
        toast("Final report PDF attached. RASSC can now review the submitted report.");
        setFinalFile(null);
        await reload();
      } catch (e) {
        if (attachedDocument && !attachmentSaved) {
          try { await window.DB.deleteDocument(attachedDocument); } catch (_) {}
        }
        toast("Error: " + (e.message || e));
      }
      setBusy(false);
      return;
    }
    setBusy(true);
    let uploadedDocument = null;
    let reportCreated = false;
    try {
      uploadedDocument = await window.DB.uploadDocument(grant.id, finalFile, "Final Report");
      await window.DB.submitReport(grant.id, "final", {
        summary: [completion && "Completion: " + completion + "%.", outcomes && "Outcomes: " + outcomes.trim(), lessons && "Lessons: " + lessons.trim()].filter(Boolean).join(" "),
        total_spent: totalSpent,
        completion: completion,
        outcomes: outcomes.trim(),
        lessons: lessons.trim(),
        document_id: uploadedDocument.id,
      });
      reportCreated = true;
      toast("Final report submitted. RASSC must accept it before Finance can approve the final 30% phase.");
      setFinalFile(null);
      setTotalSpent("");
      setCompletion("");
      setOutcomes("");
      setLessons("");
      await reload();
    } catch (e) {
      if (uploadedDocument && !reportCreated) {
        try { await window.DB.deleteDocument(uploadedDocument); } catch (_) {}
      }
      toast("Error: " + (e.message || e));
    }
    setBusy(false);
  };
  if (grant === null) return <><PageHeader title="Project Final Report" desc="Loading the selected AU-R1 project." /><div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Loading project…</div></>;
  if (!grant) return <><PageHeader title="Project Final Report" desc="Choose the research project this report belongs to." /><div className="card"><Empty title="No project selected" desc="Open My Applications, choose View or Files, then open Final Report from that project's timeline." icon="Folder" /><div style={{ textAlign: "center", paddingBottom: 24 }}><button className="btn btn-primary" onClick={() => navigate("r-applications")}><Icon name="ArrowLeft" size={13} /> My Applications</button></div></div></>;
  const phaseTwoApproved = (grant.payments || []).some(p => Number(p.instalment) === 2 && p.status === "paid");
  const currentReport = (reports || []).find(r => r.status === "submitted" || r.status === "accepted");
  const hasReportFile = (grant.documents || []).some(d => d.doc_type === "Final Report");
  const canAttachMissingFile = currentReport && currentReport.status === "submitted" && !hasReportFile;
  const canSubmit = phaseTwoApproved && !currentReport;
  return (
    <>
      <PageHeader
        title={"Final Report · " + grant.title}
        desc={(grant.code || "AU-R1 project") + " — this report belongs only to this selected research project."}
        actions={<><button className="btn btn-secondary" onClick={() => navigate("r-detail", { keepSelection: true })}><Icon name="ArrowLeft" size={13} /> Back to Project</button><Badge status={{ label: "Routes to RASSC", cls: "badge-iras" }} /></>}
      />

      <div className="card card-pad-0 mb-4">
        <div className="card-head"><h3>Selected Research Project</h3><div className="grow"></div><Badge status={window.DB.statusBadge(grant.status)} /></div>
        <div className="card-body">
          <div className="meta-row"><span className="l">Application ID</span><span className="r"><b>{grant.code}</b></span></div>
          <div className="meta-row"><span className="l">Research title</span><span className="r"><b>{grant.title}</b></span></div>
          <div className="meta-row"><span className="l">School / Faculty</span><span className="r">{grant.faculty || "—"}{grant.department ? " · " + grant.department : ""}</span></div>
          <div className="meta-row"><span className="l">Report unlock</span><span className="r">{phaseTwoApproved ? "Phase 2 approved — report is available" : "Locked until Finance approves Phase 2"}</span></div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Submit Final Report</h3></div>
            <div className="card-body">
              <div className="field">
                <label>Final report PDF *</label>
                <label className={"upload-box" + (finalFile ? " has-file" : "")} style={{display: "block"}}>
                  <input key={finalFile ? finalFile.name + finalFile.lastModified : "empty-final-file"} type="file" accept="application/pdf,.pdf" style={{display: "none"}} onChange={chooseFinalFile} />
                  <Icon name="Upload" size={24} className="icon" />
                  <div className="t">{finalFile ? finalFile.name : hasReportFile ? "Final report PDF is attached" : "Click to select the final report"}</div>
                  <div className="s">{finalFile ? (finalFile.size / 1024 / 1024).toFixed(2) + " MB · Click to replace" : "PDF · max 15 MB"}</div>
                </label>
                {fileError && <div className="form-error" style={{marginTop: 7}}>{fileError}</div>}
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Total spent (THB)</label>
                  <input type="number" min="0" value={totalSpent} onChange={e => setTotalSpent(e.target.value)} placeholder="Enter total spent" />
                </div>
                <div className="field">
                  <label>Project completion (%)</label>
                  <input type="number" min="0" max="100" value={completion} onChange={e => setCompletion(e.target.value)} placeholder="Enter completion percentage" />
                </div>
                <div className="field full">
                  <label>Outcomes delivered</label>
                  <textarea className="comment-input" value={outcomes} onChange={e => setOutcomes(e.target.value)} placeholder="List final outcomes delivered."></textarea>
                </div>
                <div className="field full">
                  <label>Lessons learned</label>
                  <textarea className="comment-input" value={lessons} onChange={e => setLessons(e.target.value)} placeholder="Summarize lessons learned, issues, and follow-up actions."></textarea>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted">Submitted first to RASSC. Finance receives Phase 3 only after RASSC accepts the report.</span>
                <button className="btn btn-primary" onClick={submit} disabled={busy || (!canSubmit && !canAttachMissingFile) || !finalFile}>
                  <Icon name="Send" size={13} /> {busy ? "Uploading…" : canAttachMissingFile ? (finalFile ? "Attach PDF to Submitted Report" : "Select PDF to Attach") : currentReport ? (currentReport.status === "accepted" ? "Report Accepted" : "At RASSC Review") : !phaseTwoApproved ? "Locked · Phase 2 Required" : !finalFile ? "Select PDF to Submit" : "Submit Final Report"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Submitted Final Reports</h3></div>
            <div className="card-body">
              {reports === null && <div className="text-sm text-muted">Loading reports...</div>}
              {reports && reports.length === 0 && <div className="text-sm text-muted">No final reports submitted yet.</div>}
              {(reports || []).map(r => (
                <div key={r.id} className="flex justify-between items-center" style={{padding: "10px 0", borderBottom: "1px solid var(--line-2)"}}>
                  <div>
                    <div style={{fontWeight: 600}}>{grant.code} · {grant.title}</div>
                    <div className="text-sm text-muted">Status: {r.status}</div>
                  </div>
                  <Badge status={r.status === "accepted" ? { label: "Accepted · Sent to Finance", cls: "badge-paid" } : { label: "At RASSC Review", cls: "badge-iras" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Required Attachments</h3></div>
            <div className="card-body" style={{paddingTop: 8}}>
              {[
                "Final outcomes report (PDF)",
                "Final financial statement",
                "Publication or conference proofs",
                "Dataset / artefact links",
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--line-2)" : "none",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: "var(--line-2)",
                    color: "var(--ink-4)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name="Clock" size={11} />
                  </span>
                  <span style={{fontSize: 13}}>{t}</span>
                  <span className="badge badge-pending" style={{marginLeft: "auto"}}><span className="dot"></span>Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- G. Payment Status ---------- */
function SingleGrantPaymentStatus({ grantType }) {
  const isR4 = grantType === "au_r4";
  const [grant, setGrant] = useState(null);
  useEffect(() => { window.DB.myGrant(grantType).then(g => setGrant(g || false)).catch(() => setGrant(false)); }, [grantType]);
  const STEPS = ["Not yet approved", "Approved for Payment", "Finance Processing", "Paid", "Completed"];
  const stepIdx = { approved: 1, active: 3, completed: 4 };
  if (grant === null) {
    return (<><PageHeader title="Payment Status" desc="Your publication reward payment status." /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "40px" }}>Loading…</div></>);
  }
  if (!grant) {
    return (<><PageHeader title="Payment Status" desc={isR4 ? "Your publication reward payment status." : "Your paper presentation grant payment status."} /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "48px" }}>{isR4 ? "No approved claim yet. Once IRAS approves your publication claim, its payment status appears here." : "No approved grant yet. Once your paper presentation grant is approved, its payment status appears here."}</div></>);
  }
  const idx = stepIdx[grant.status] != null ? stepIdx[grant.status] : 0;
  const pi = grant.pub_info || {}, ci = grant.conference_info || {};
  return (
    <>
      <PageHeader title="Payment Status" desc={(isR4 ? "Publication reward · " : "Paper presentation grant · ") + grant.code} actions={<Badge status={window.DB.statusBadge(grant.status)} />} />
      <div className="card card-pad-0 mb-6">
        <div className="card-head"><h3>{grant.title}</h3></div>
        <div className="card-body">
          <div className="meta-row"><span className="l">Application ID</span><span className="r">{grant.code}</span></div>
          {isR4 && <div className="meta-row"><span className="l">Journal</span><span className="r">{pi.journal || "-"}{pi.indexLabel ? " · " + pi.indexLabel : ""}</span></div>}
          {!isR4 && <div className="meta-row"><span className="l">Conference</span><span className="r">{ci.confName || "-"}</span></div>}
          <div className="meta-row"><span className="l">{isR4 ? "Requested claim" : "Requested amount"}</span><span className="r">{fmtBaht(Number(grant.requested_amount || 0))}</span></div>
          <div className="meta-row"><span className="l">{isR4 ? "IRAS-approved amount" : "Approved amount"}</span><span className="r">{grant.approved_amount ? fmtBaht(Number(grant.approved_amount)) : "—"}</span></div>
          <div className="meta-row"><span className="l">Payment status</span><span className="r">{grant.status === "approved" ? "Awaiting Finance Payment" : grant.status === "active" ? "Paid" : grant.status === "completed" ? "Completed" : "Not yet approved"}</span></div>
          <div className="meta-row"><span className="l">Payment date</span><span className="r">{["active", "completed"].includes(grant.status) ? window.DB.fmtDate(grant.updated_at || grant.decided_at) : "—"}</span></div>
        </div>
      </div>
      <div className="card card-pad-0">
        <div className="card-head"><h3>Payment Progress</h3></div>
        <div className="card-body">
          <div style={{ display: "flex", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                <div style={{ height: 4, background: i <= idx ? "var(--au-crimson)" : "var(--line)", margin: "0 0 10px" }}></div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: i <= idx ? "var(--au-crimson)" : "var(--line)", margin: "-17px auto 8px", border: "2px solid var(--paper)" }}></div>
                <div style={{ fontSize: 11, color: i === idx ? "var(--au-crimson)" : "var(--ink-3)", fontWeight: i === idx ? 700 : 400 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ResearcherPayments({ onDownload, toast, grantType }) {
  if (grantType === "au_r3" || grantType === "au_r4") return <SingleGrantPaymentStatus grantType={grantType} />;
  return <R1PaymentStatus onDownload={onDownload} toast={toast} />;
}

function R1PaymentStatus({ onDownload, toast }) {
  const [grant, setGrant] = useState(null);
  useEffect(() => { window.DB.myGrant("au_r1").then(g => setGrant(g || false)).catch(() => setGrant(false)); }, []);
  const triggers = { 1: "Available after grant approval", 2: "After Phase 1 is paid + accepted progress report", 3: "After Phase 2 is paid + accepted final report" };
  const trName = { 1: "Phase 1 · 30%", 2: "Phase 2 · 40%", 3: "Phase 3 · 30%" };

  if (grant === null) {
    return (<><PageHeader title="Payment Status" desc="Your AU-R1 grant is paid in three phases." /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "40px" }}>Loading…</div></>);
  }
  if (!grant) {
    return (<><PageHeader title="Payment Status" desc="Your AU-R1 grant is paid in three phases." /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "48px" }}>No approved grant yet. Once your application is approved, the 30 / 40 / 30 payment phases will appear here.</div></>);
  }

  const pays = grant.payments || [];
  return (
    <>
      <PageHeader
        title="Payment Status"
        desc={"Three-phase payment for " + grant.code + " · Total grant " + fmtBaht(grant.approved_amount || grant.requested_amount)}
      />

      <div className="grid-3 mb-6">
        {pays.map(p => (
          <div key={p.id} className="pay-card">
            <div className="pay-num">{p.pct}%</div>
            <div className="pct">Phase {p.instalment}</div>
            <div className="amt">{fmtBaht(p.amount)}</div>
            <span className={"badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")}><span className="dot"></span>{p.status === "paid" ? "Paid" : "Pending Payment"}</span>
            <div className="meta-row mt-4"><span className="l">Condition</span><span className="r">{triggers[p.instalment]}</span></div>
            <div className="meta-row"><span className="l">Paid on</span><span className="r">{p.paid_at ? window.DB.fmtDate(p.paid_at) : "—"}</span></div>
          </div>
        ))}
      </div>

      <div className="card card-pad-0">
        <div className="card-head"><h3>Payment Log</h3></div>
        <table className="tbl">
          <thead>
            <tr><th>Phase</th><th>Amount</th><th>Condition</th><th>Status</th><th>Paid on</th></tr>
          </thead>
          <tbody>
            {pays.map(p => (
              <tr key={p.id}>
                <td>{trName[p.instalment]}</td>
                <td>{fmtBaht(p.amount)}</td>
                <td style={{ fontSize: 12, color: "var(--ink-3)" }}>{triggers[p.instalment]}</td>
                <td><span className={"badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")}><span className="dot"></span>{p.status === "paid" ? "Paid" : "Pending"}</span></td>
                <td style={{ fontSize: 12 }}>{p.paid_at ? window.DB.fmtDate(p.paid_at) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ResearcherPublicationGrants({ toast }) {
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    article_title: "",
    journal_name: "",
    indexing: "scopus",
    quartile: "Q1",
    publication_type: "journal",
    doi: "",
    published_on: "",
    requested_amount: 0,
  });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const load = () => {
    window.AUTH.profile().then(setMe).catch(() => {});
    window.DB.myPublicationGrants().then(setRows).catch(() => setRows([]));
  };
  useEffect(() => { load(); }, []);
  const estimate = window.DB.publicationAwardAmount(form.indexing, form.quartile, form.publication_type, form.requested_amount);
  const needsActual = form.indexing === "tci" || form.indexing === "other" || ["other"].includes(form.publication_type);
  const submit = async (saveDraft) => {
    setErr("");
    if (!form.article_title.trim()) { setErr("Publication title is required."); return; }
    if (!form.journal_name.trim() && form.publication_type === "journal") { setErr("Journal name is required."); return; }
    if (!saveDraft && !file) { setErr("Attach a PDF evidence file before submitting."); return; }
    if (needsActual && !Number(form.requested_amount || 0)) { setErr("Enter the publication fee for this publication type."); return; }
    setBusy(true);
    try {
      const g = await window.DB.createPublicationGrant({
        ...form,
        faculty: me && me.faculty,
        department: me && me.department,
        requested_amount: estimate,
      }, !saveDraft);
      if (file) await window.DB.uploadPublicationEvidence(g.id, file);
      toast(saveDraft ? "Publication grant draft saved." : g.code + " submitted to RASSC.");
      setForm({ article_title: "", journal_name: "", indexing: "scopus", quartile: "Q1", publication_type: "journal", doi: "", published_on: "", requested_amount: 0 });
      setFile(null);
      load();
    } catch (e) {
      setErr((e && e.message) || "Could not save publication grant.");
    } finally {
      setBusy(false);
    }
  };
  const openEvidence = async (g, download) => {
    try {
      const url = await window.DB.publicationEvidenceUrl(g, download);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast("No evidence PDF is attached to this publication grant.");
    }
  };
  return (
    <>
      <PageHeader
        title="Paper Publication Grant"
        desc="Apply for AU publication rewards under Announcement No.16/2024."
        actions={<Badge status={{ label: "Scopus Q1 80k · Q2 60k · Q3 50k · Q4 40k", cls: "badge-academic" }} />}
      />
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Publication Grant Application</h3></div>
          <div className="card-body">
            <div className="field"><label>Publication title</label><input value={form.article_title} onChange={e => setField("article_title", e.target.value)} /></div>
            <div className="form-grid">
              <div className="field"><label>Journal / venue</label><input value={form.journal_name} onChange={e => setField("journal_name", e.target.value)} /></div>
              <div className="field"><label>DOI / reference</label><input value={form.doi} onChange={e => setField("doi", e.target.value)} /></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Publication type</label><select value={form.publication_type} onChange={e => setField("publication_type", e.target.value)}><option value="journal">Journal article</option><option value="creative">Creative work</option><option value="patent">Patent</option><option value="petty">Petty patent</option><option value="other">Other reimbursable fee</option></select></div>
              <div className="field"><label>Indexing</label><select value={form.indexing} onChange={e => setField("indexing", e.target.value)}><option value="scopus">Scopus</option><option value="wos">Web of Science</option><option value="tci">TCI</option><option value="other">Other</option></select></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Quartile / tier</label><select value={form.quartile} onChange={e => setField("quartile", e.target.value)} disabled={form.indexing !== "scopus"}><option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option><option value="Q4">Q4</option></select></div>
              <div className="field"><label>Published date</label><AUDatePicker value={form.published_on} onChange={v => setField("published_on", v)} placeholder="Select published date…" /></div>
            </div>
            {needsActual && <div className="field"><label>Publication Fee (THB)</label><input value={form.requested_amount} onChange={e => setField("requested_amount", e.target.value.replace(/[^0-9]/g, ""))} /></div>}
            <div className="field"><label>Evidence PDF</label><input type="file" accept="application/pdf,.pdf" onChange={e => setFile((e.target.files || [])[0] || null)} /></div>
            <div style={{ padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--paper-warm)", marginBottom: 12 }}>
              <div className="text-sm text-muted">Estimated AU reward</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 28 }}>{fmtBaht(estimate)}</div>
            </div>
            {err && <div style={{ color: "var(--au-crimson)", fontSize: 12, marginBottom: 10 }}>{err}</div>}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" disabled={busy} onClick={() => submit(true)}>Save Draft</button>
              <button className="btn btn-primary" disabled={busy} onClick={() => submit(false)}><Icon name="Send" size={14} /> Submit to RASSC</button>
            </div>
          </div>
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>My Publication Grants</h3></div>
          <div>
            {rows === null && <div style={{ padding: 32, textAlign: "center", color: "var(--ink-3)" }}>Loading publication grants...</div>}
            {rows && rows.length === 0 && <Empty title="No publication grants yet" desc="Submitted publication rewards will appear here." icon="FileText" />}
            {(rows || []).map(g => (
              <div key={g._uuid} style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
                <div className="flex items-center gap-2 mb-2"><span className="id">{g.id}</span><Badge status={g.status} /></div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{g.title}</div>
                <div className="text-sm text-muted">{g.indexing}{g.quartile ? " · " + g.quartile : ""} · {fmtBaht(g.budgetTotal)}</div>
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEvidence(g, false)}><Icon name="Eye" size={12} /> Evidence</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEvidence(g, true)}><Icon name="Download" size={12} /> Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ResearcherReimbursements({ toast }) {
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", category: RA.REIMBURSE_CATEGORIES[0], description: "", requested_amount: "" });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const load = () => {
    window.AUTH.profile().then(setMe).catch(() => {});
    window.DB.myReimbursements().then(setRows).catch(() => setRows([]));
  };
  useEffect(() => { load(); }, []);
  const submit = async (saveDraft) => {
    setErr("");
    if (!form.title.trim()) { setErr("A short title for the claim is required."); return; }
    if (!Number(form.requested_amount || 0)) { setErr("Enter the amount you are claiming back."); return; }
    if (!saveDraft && !file) { setErr("Attach a PDF of your receipts before submitting."); return; }
    setBusy(true);
    try {
      const r = await window.DB.createReimbursement({
        title: form.title, category: form.category, description: form.description,
        requested_amount: Number(form.requested_amount), faculty: me && me.faculty, department: me && me.department,
      }, !saveDraft);
      if (file) await window.DB.uploadReimbursementEvidence(r.id, file);
      toast(saveDraft ? "Reimbursement draft saved." : r.code + " submitted to your Dean.");
      setForm({ title: "", category: RA.REIMBURSE_CATEGORIES[0], description: "", requested_amount: "" });
      setFile(null); load();
    } catch (e) { setErr((e && e.message) || "Could not save the claim."); }
    finally { setBusy(false); }
  };
  const openEvidence = async (r, download) => {
    try { window.open(await window.DB.reimbursementEvidenceUrl(r, download), "_blank", "noopener,noreferrer"); }
    catch (e) { toast("No receipt PDF is attached to this claim."); }
  };
  return (
    <>
      <PageHeader title="Reimbursement Claim" desc="Claim research expenses back after spending, with receipts. Routed: Dean → RASSC → OFM." actions={<Badge status={{ label: "Spend first · claim back", cls: "badge-academic" }} />} />
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>New Claim</h3></div>
          <div className="card-body">
            <div className="field"><label>Claim title</label><input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="e.g. Conference travel reimbursement" /></div>
            <div className="form-grid">
              <div className="field"><label>Category</label><select value={form.category} onChange={e => setField("category", e.target.value)}>{RA.REIMBURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="field"><label>Amount claimed (THB)</label><input value={form.requested_amount} onChange={e => setField("requested_amount", e.target.value.replace(/[^0-9]/g, ""))} placeholder="e.g. 8500" /></div>
            </div>
            <div className="field"><label>Description / what you spent on</label><textarea className="comment-input" value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Briefly itemise the expenses you are claiming." /></div>
            <div className="field"><label>Receipts (PDF)</label><input type="file" accept="application/pdf,.pdf" onChange={e => setFile((e.target.files || [])[0] || null)} /></div>
            {err && <div style={{ color: "var(--au-crimson)", fontSize: 12, marginBottom: 10 }}>{err}</div>}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" disabled={busy} onClick={() => submit(true)}>Save Draft</button>
              <button className="btn btn-primary" disabled={busy} onClick={() => submit(false)}><Icon name="Send" size={14} /> Submit to Dean</button>
            </div>
          </div>
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>My Claims</h3></div>
          <div>
            {rows === null && <div style={{ padding: 32, textAlign: "center", color: "var(--ink-3)" }}>Loading claims…</div>}
            {rows && rows.length === 0 && <Empty title="No reimbursement claims yet" desc="Your submitted claims will appear here." icon="Receipt" />}
            {(rows || []).map(r => (
              <div key={r._uuid} style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
                <div className="flex items-center gap-2 mb-2"><span className="id">{r.id}</span><Badge status={r.status} /></div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
                <div className="text-sm text-muted">{r.category || "—"} · claimed {fmtBaht(r.requested_amount)}{r.approved_amount != null ? " · approved " + fmtBaht(r.approved_amount) : ""}</div>
                {(r.dean_note || r.review_note) && <div className="text-sm" style={{ color: "var(--ink-2)", marginTop: 4 }}>{r.review_note || r.dean_note}</div>}
                {r.evidence_name && <div className="flex gap-2 mt-3">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEvidence(r, false)}><Icon name="Eye" size={12} /> Receipts</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEvidence(r, true)}><Icon name="Download" size={12} /> Download</button>
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  ResearcherDashboard, ResearcherSubmit, ResearcherApplications,
  ResearcherApplicationDetail, ResearcherProgress, ResearcherFinal,
  ResearcherReimbursements,
  ResearcherPayments, ResearcherPublicationGrants,
});
