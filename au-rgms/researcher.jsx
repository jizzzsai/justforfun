/* ============================================================
   Researcher Dashboard pages
   ============================================================ */

const RA = window.AU;

/* ---------- A. Dashboard Overview ---------- */
function buildResearcherTimeline(statusKey) {
  const order = ["submission", "deanScreen", "committee", "deanSign", "iras", "expert", "president", "contract", "pay1"];
  const idxMap = { draft: 0, submitted: 1, committee_review: 2, dean_sign: 3, iras_review: 4, expert_review: 5, president_review: 6, approved: 7, active: 8, completed: 9, returned: 0, rejected: 0 };
  let idx = idxMap[statusKey]; if (idx === undefined) idx = 0;
  const tl = {};
  order.forEach((k, i) => { tl[k] = i < idx ? { done: true } : (i === idx ? { current: true } : {}); });
  return tl;
}

function ResearcherDashboard({ navigate, onDownload, onView, setSelectedApplicationId }) {
  const [c, setC] = useState(null);
  const [me, setMe] = useState(null);
  const [grant, setGrant] = useState(null);
  const [apps, setApps] = useState(null);
  useEffect(() => {
    window.DB.statusCounts().then(setC).catch(() => setC({}));
    window.AUTH.profile().then(setMe).catch(() => {});
    window.DB.myGrant().then(g => setGrant(g || false)).catch(() => setGrant(false));
    window.DB.myApplications().then(setApps).catch(() => setApps([]));
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const latest = apps && apps.length ? apps[0] : null;
  const pays = grant && grant.payments && grant.payments.length ? grant.payments.slice().sort((a, b) => a.instalment - b.instalment) : [];
  const grantTotal = grant ? Number(grant.approved_amount || grant.requested_amount || 0) : 0;
  const released = pays.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
  const progressPct = grantTotal > 0 ? Math.round(released / grantTotal * 100) : 0;
  const displayPays = pays.length ? pays : (grant ? [
    { id: "t1", instalment: 1, pct: 30, amount: Math.round(grantTotal * 0.30), status: "pending" },
    { id: "t2", instalment: 2, pct: 40, amount: grantTotal - 2 * Math.round(grantTotal * 0.30), status: "pending" },
    { id: "t3", instalment: 3, pct: 30, amount: Math.round(grantTotal * 0.30), status: "pending" },
  ] : []);
  return (
    <>
      <PageHeader
        title="Researcher Dashboard"
        desc={"Welcome back" + (me ? ", " + me.full_name : "") + ". Here is the status of your research grant applications."}
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="Calendar" size={14} /> AY 2025–2026</button>
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
        <Stat label="Approved Projects"   value={n("_approved")} icon="CheckCircle" tone="green" />
      </div>

      <div className="grid-2">
        {/* Left: payment progress (live) */}
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Payment Progress{grant ? " · " + grant.code : ""}</h3>
            <div className="grow"></div>
            {grant && <Badge status={window.DB.statusBadge(grant.status)} />}
          </div>
          <div className="card-body">
            {grant === null && <div className="text-sm text-muted">Loading…</div>}
            {grant === false && <Empty title="No approved grant yet" desc="Once the President approves your application, your 30 / 40 / 30 disbursements appear here." icon="Coins" />}
            {grant && (
              <>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 17, marginBottom: 4 }}>
                  {grant.title}
                </div>
                <div className="text-sm text-muted mb-4">{grant.faculty || "—"}{grant.department ? " · " + grant.department : ""}</div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted">Disbursement progress</span>
                  <span className="text-sm font-semi">{fmtBaht(released)} of {fmtBaht(grantTotal)} released</span>
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
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Tranche {p.instalment} · {p.pct}%</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, margin: "4px 0" }}>
                        {fmtBaht(p.amount)}
                      </div>
                      <span className={"badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")}><span className="dot"></span>{p.status === "paid" ? "Paid" : "Pending"}</span>
                    </div>
                  ))}
                </div>

                <button className="btn btn-secondary mt-4" onClick={() => navigate("r-payments")}>
                  View payment status <Icon name="ArrowRight" size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: my applications (live) */}
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>My Applications</h3>
          </div>
          <div style={{ padding: "8px 0" }}>
            {apps === null && <div style={{ padding: "12px 20px", color: "var(--ink-3)", fontSize: 12 }}>Loading…</div>}
            {apps && apps.length === 0 && <div style={{ padding: "16px 20px" }}><Empty title="No applications yet" desc="Submit your first research grant application to get started." icon="FilePlus" /></div>}
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
        </div>
      </div>

      {/* Quick application snapshot (live, latest application) */}
      <div className="card card-pad-0 mt-6">
        <div className="card-head">
          <h3>Application Pipeline{latest ? " · " + latest.code : ""}</h3>
          <div className="grow"></div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("r-applications")}>
            Open detail <Icon name="ArrowRight" size={12} />
          </button>
        </div>
        <div className="card-body">
          {!latest && <Empty title="No application to track yet" desc="Your latest application's progress will appear here." icon="Folder" />}
          {latest && <HTimeline steps={RA.ALL_STAGES.slice(0, 9)} app={{ timeline: buildResearcherTimeline(latest.status) }} />}
        </div>
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
  name: "", title2: "", auId: "", email: "", phone: "",
  school: "",
  department: "",
  outcome: "",
};
const RESEARCHER_DEFAULT_BUDGET_ROWS = [
  { item: "Remuneration (research assistant)", amount: 30000, purpose: "" },
  { item: "Research equipment", amount: 40000, purpose: "" },
  { item: "Travel for off-campus data collection", amount: 18000, purpose: "" },
  { item: "Miscellaneous (postage, photocopying, binding)", amount: 12000, purpose: "" },
];

// Whole months between two ISO dates (min 1). Used to auto-derive duration.
function monthsBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  var s = new Date(startISO), e = new Date(endISO);
  if (isNaN(s) || isNaN(e) || e < s) return 0;
  var m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() >= s.getDate()) m += 1; // count the final partial month
  return Math.max(1, m);
}

/* ---------- B. Submit Application ---------- */
function ResearcherSubmit({ applicationId, navigate, onDownload, onView, toast, setConfirm, setSelectedApplicationId }) {
  const [draft, setDraft] = useState({ ...RESEARCHER_DEFAULT_DRAFT });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const [budgetRows, setBudgetRows] = useState(RESEARCHER_DEFAULT_BUDGET_ROWS.map(r => ({ ...r })));
  const total = budgetRows.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const [reqTotal, setReqTotal] = useState("100000");
  const setAmt = (i, v) => setBudgetRows(rows => rows.map((r, j) => j === i ? { ...r, amount: (v + "").replace(/[^0-9]/g, "") } : r));

  // Separate itemized budget breakdown — free-form Purpose + Amount lines.
  const [items, setItems] = useState([{ purpose: "", amount: "" }]);
  const itemsTotal = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const setItem = (i, k, v) => setItems(rows => rows.map((r, j) => j === i ? { ...r, [k]: k === "amount" ? (v + "").replace(/[^0-9]/g, "") : v } : r));
  const addItem = () => setItems(rows => rows.concat([{ purpose: "", amount: "" }]));
  const removeItem = (i) => setItems(rows => rows.length > 1 ? rows.filter((_, j) => j !== i) : rows);

  const [files, setFiles] = useState([]);
  const onFiles = (e) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs)); e.target.value = ""; };
  const [editingId, setEditingId] = useState(applicationId || null);
  const [existingDocs, setExistingDocs] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(!!applicationId);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [docType, setDocType] = useState("Research Proposal");
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
        if (p && !applicationId) setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.name_title || p.title || d.title2, auId: p.au_id || d.auId, email: p.email || d.email, school: p.faculty || d.school, department: p.department || d.department, phone: p.phone || d.phone }));
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
        setReqTotal("100000");
        setBudgetRows(RESEARCHER_DEFAULT_BUDGET_ROWS.map(r => ({ ...r })));
        setItems([{ purpose: "", amount: "" }]);
        setDraft(d => ({
          ...RESEARCHER_DEFAULT_DRAFT,
          name: d.name,
          title2: d.title2,
          email: d.email,
          phone: d.phone,
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
          name: app.researcher ? (app.researcher.full_name || d.name) : d.name,
          email: app.researcher ? (app.researcher.email || d.email) : d.email,
        }));
        setReqTotal(String(Number(app.requested_amount || 0)));
        setBudgetRows(Array.isArray(app.budget_breakdown) && app.budget_breakdown.length ? app.budget_breakdown : RESEARCHER_DEFAULT_BUDGET_ROWS.map(r => ({ ...r })));
        setItems(Array.isArray(app.budget_items) && app.budget_items.length ? app.budget_items : [{ purpose: "", amount: "" }]);
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
    if (submit && draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim())) { setErr("Email must be an Assumption University address ending in @au.edu."); return; }
    if (submit && (!draft.startDate || !draft.endDate)) { setErr("Select the project start and expected end dates."); return; }
    if (submit && autoDuration <= 0) { setErr("The expected end date must be after the start date."); return; }
    if (submit && Number(reqTotal) > 100000) { setErr("Requested amount (" + Number(reqTotal).toLocaleString() + " THB) exceeds the 100,000 THB maximum for AU-R1 research grants."); return; }
    if (submit && Number(reqTotal) <= 0) { setErr("Enter the grant amount you are requesting."); return; }
    if (submit && total !== Number(reqTotal)) { setErr("Budget breakdown (" + total.toLocaleString() + " THB) must equal the requested total (" + Number(reqTotal).toLocaleString() + " THB)."); return; }
    if (submit) {
      const overIdx = budgetRows.findIndex((b, i) => total > 0 && Math.round((Number(b.amount) || 0) / total * 100) > capArr[i]);
      if (overIdx !== -1) { setErr(budgetRows[overIdx].item + " exceeds its AU cap of " + capArr[overIdx] + "% of the total budget."); return; }
    }
    setBusy(true);
    try {
      // Persist the applicant's own details to their profile (enter once, reused).
      try { await window.DB.updateMyProfile({ full_name: draft.name, name_title: draft.title2, au_id: draft.auId, phone: draft.phone, department: draft.department }); } catch (e) {}
      const app = await window.DB.createApplication({
        title: draft.title, abstract: draft.outcome, field: draft.field,
        faculty: draft.school, department: draft.department, keywords: draft.keywords,
        requested_amount: Number(reqTotal), duration_months: autoDuration || draft.duration,
        start_date: draft.startDate || null, end_date: draft.endDate || null,
        budget_breakdown: budgetRows,
        budget_items: items.filter(it => (it.purpose || "").trim() || Number(it.amount) > 0),
      }, submit, editingId);
      for (const f of files) { try { await window.DB.uploadDocument(app.id, f, docType || null); } catch (e) {} }
      if (!submit) {
        setEditingId(app.id);
        if (setSelectedApplicationId) setSelectedApplicationId(app.id);
      } else if (setSelectedApplicationId) {
        setSelectedApplicationId(null);
      }
      toast(submit ? ("Application " + app.code + " submitted") : ("Draft " + app.code + " saved"));
      navigate("r-applications");
    } catch (ex) { setErr((ex && ex.message) || "Could not save the application."); setBusy(false); }
  }

  if (loadingDraft) {
    return <><PageHeader title="Edit Draft" desc="Loading saved draft." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading draft...</div></>;
  }

  return (
    <>
      <PageHeader
        title={editingId ? "Edit Application" : "Submit Research Grant Application"}
        desc={editingId ? "Update this saved or returned application, add files, or submit it to Dean screening." : "Complete each section and upload the AU-R1 PDF documents before submitting."}
        actions={
          <>
            <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>Save as Draft</button>
            <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>
              <Icon name="Send" size={13} /> {busy ? "Saving…" : "Submit Application"}
            </button>
          </>
        }
      />

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
                <input type="date" value={draft.startDate} max={draft.endDate || undefined}
                  onChange={e => upd("startDate", e.target.value)} />
              </div>
              <div className="field">
                <label>Expected End Date</label>
                <input type="date" value={draft.endDate} min={draft.startDate || undefined}
                  onChange={e => upd("endDate", e.target.value)} />
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
          <p className="section-sub">Principal investigator contact details.</p>
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
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">3</span> Faculty / Department</h4>
          <p className="section-sub">Affiliation used for routing the application.</p>
          <div className="section-body">
            <div className="form-grid">
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
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">4</span> Budget Information</h4>
          <p className="section-sub">Enter any amount up to the 100,000 THB AU-R1 maximum, then itemise it below. Caps: remuneration ≤{caps.remuneration}%, equipment ≤{caps.equipment}%, travel ≤{caps.travel}%, misc ≤{caps.misc}%.</p>
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
                        const pct = total > 0 ? Math.round((Number(b.amount) || 0) / total * 100) : 0;
                        const over = pct > capArr[i];
                        return (
                          <tr key={i}>
                            <td>{b.item}</td>
                            <td style={{ textAlign: "center", color: over ? "var(--au-crimson)" : "var(--ink-3)", fontWeight: over ? 600 : 400 }}>{pct}%</td>
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
          <h4><span className="num">5</span> Expected Outcomes</h4>
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
          <h4><span className="num">6</span> Required Documents</h4>
          <p className="section-sub">Upload AU-R1 PDF documents. You can add or delete files while the application is still waiting for Dean screening.</p>
          <div className="section-body">
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
            {existingDocs.length > 0 && (
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                {existingDocs.map(d => (
                  <div className="file-row" key={d.id || d.name}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta">
                      <div className="fn">{d.name}</div>
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
                {files.map((f, i) => (
                  <div className="file-row" key={i}>
                    <div className="ficon"><Icon name="FileText" size={18} /></div>
                    <div className="fmeta">
                      <div className="fn">{f.name}</div>
                      <div className="fs">{(f.size / 1024).toFixed(0)} KB · ready to upload</div>
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
                {RA.DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
          <button className="btn btn-secondary" disabled={busy} onClick={() => save(false)}>Save as Draft</button>
          <button className="btn btn-primary" disabled={busy} onClick={() => save(true)}>
            <Icon name="Send" size={13} /> {busy ? "Saving…" : "Submit Application"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- C. My Applications ---------- */
function ResearcherApplications({ navigate, onDownload, openDetail, openDraft, setSelectedApplicationId }) {
  const [myApps, setMyApps] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const apps = await window.DB.myApplications();
        setMyApps(apps.map(a => ({
          id: a.code, _uuid: a.id, title: a.title, faculty: a.faculty, department: a.department,
          submittedAt: a.submitted_at ? window.DB.fmtDate(a.submitted_at) : "—",
          stage: window.DB.statusBadge(a.status).label, status: window.DB.statusBadge(a.status), statusKey: a.status,
        })));
      } catch (e) { setMyApps([]); }
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="My Applications"
        desc="All research grant submissions across academic years."
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
  const timelineApp = {
    timeline: {
      submission: { done: true, current: app.status === "submitted", date: window.DB.fmtDate(app.submitted_at || app.created_at), who: researcherName },
      deanScreen: { current: app.status === "submitted", done: !["draft", "submitted", "returned"].includes(app.status), date: app.status === "submitted" ? "Waiting Dean screening" : "Completed" },
      committee: { current: app.status === "committee_review", done: ["dean_sign", "iras_review", "expert_review", "president_review", "approved", "active", "completed"].includes(app.status), date: app.status === "committee_review" ? "In committee review" : "Pending" },
      deanSign: { current: app.status === "dean_sign", done: ["iras_review", "expert_review", "president_review", "approved", "active", "completed"].includes(app.status), date: app.status === "dean_sign" ? "Waiting Dean sign" : "Pending" },
      iras: { current: app.status === "iras_review", done: ["expert_review", "president_review", "approved", "active", "completed"].includes(app.status), date: app.status === "iras_review" ? "RASSC screening" : "Pending" },
      expert: { current: app.status === "expert_review", done: ["president_review", "approved", "active", "completed"].includes(app.status), date: app.status === "expert_review" ? "Expert review" : "Pending" },
      president: { current: app.status === "president_review", done: ["approved", "active", "completed"].includes(app.status), date: app.status === "president_review" ? "President review" : "Pending" },
      contract: { current: app.status === "approved", done: ["active", "completed"].includes(app.status), date: app.status === "approved" ? "Contract pending" : "Pending" },
      pay1: { current: app.status === "active", done: app.status === "completed", date: app.status === "active" ? "Active grant" : "Pending" },
    },
  };

  return (
    <>
      <PageHeader
        title={app.title}
        desc={(app.code || "Application") + " - Submitted " + window.DB.fmtDate(app.submitted_at || app.created_at)}
        actions={
          <>
            <Badge status={status} />
            {app.status === "draft" && <button className="btn btn-secondary" onClick={() => navigate("r-submit")}><Icon name="Edit3" size={13} /> Edit Draft</button>}
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Research Information</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">Research title</span><span className="r">{app.title}</span></div>
              <div className="meta-row"><span className="l">Field / discipline</span><span className="r">{app.field || "-"}</span></div>
              <div className="meta-row"><span className="l">Keywords</span><span className="r">{app.keywords || "-"}</span></div>
              <div className="meta-row"><span className="l">Duration</span><span className="r">{app.duration_months || 12} months</span></div>
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
              <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
            </div>
          </div>

          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Budget Breakdown</h3></div>
            <div className="card-body" style={{ padding: 0 }}>
              {budgetRows.length === 0 && <div style={{ padding: 20, color: "var(--ink-3)" }}>No budget breakdown entered.</div>}
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

        <div className="card card-pad-0" style={{ alignSelf: "start", position: "sticky", top: 116 }}>
          <div className="card-head"><h3>Approval Timeline</h3><div className="grow"></div><Badge status={status} /></div>
          <div className="card-body"><Timeline steps={RA.ALL_STAGES} app={timelineApp} /></div>
        </div>
      </div>
    </>
  );
}

/* ---------- E. Progress Report ---------- */
function ResearcherProgress({ onDownload, onView, toast }) {
  const [grant, setGrant] = useState(null);
  const [reports, setReports] = useState(null);
  const [busy, setBusy] = useState(false);
  const reload = () => {
    window.DB.myGrant().then(setGrant).catch(() => setGrant(false));
    window.DB.myReports("progress").then(setReports).catch(() => setReports([]));
  };
  useEffect(() => { reload(); }, []);
  const submit = async () => {
    if (!grant) { toast("No approved grant found - your application must be approved first."); return; }
    setBusy(true);
    try { await window.DB.submitReport(grant.id, "progress"); toast("Progress report submitted. RASSC must accept it before the 40% tranche can be paid."); reload(); }
    catch (e) { toast("Error: " + (e.message || e)); }
    setBusy(false);
  };
  return (
    <>
      <PageHeader
        title="Progress Report"
        desc="Mid-project progress report — required before second disbursement (40%)."
        actions={<Badge status={RA.STATUS.expert} />}
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Submit Progress Report</h3></div>
            <div className="card-body">
              <div className="field">
                <label>Reporting period</label>
                <select><option>Month 1 — Month 6</option><option>Month 7 — Month 9</option></select>
              </div>
              <div className="field">
                <label>Summary of progress</label>
                <textarea className="comment-input" style={{minHeight: 120}} placeholder="Enter progress summary for this reporting period."></textarea>
              </div>
              <div className="field">
                <label>Budget utilisation</label>
                <textarea className="comment-input" placeholder="Summarize spending and attach the official report file when available."></textarea>
              </div>
              <div className="field">
                <label>Upload progress report (PDF)</label>
                <div className="upload-box">
                  <Icon name="Upload" size={24} className="icon" />
                  <div className="t">Click to upload Progress_Report.pdf</div>
                  <div className="s">PDF · max 10 MB</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted">Once submitted, the RASSC office and Finance will be notified.</span>
                <button className="btn btn-primary" onClick={submit} disabled={busy}>
                  <Icon name="Send" size={13} /> {busy ? "Submitting…" : "Submit Report"}
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
                    <div style={{fontWeight: 600}}>{r.application ? r.application.code : "Application"} - Progress Report</div>
                    <div className="text-sm text-muted">Status: {r.status}</div>
                  </div>
                  <Badge status={r.status === "accepted" ? RA.STATUS.completed : RA.STATUS.submitted} />
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
                  { key: "p2", label: "Second Disbursement (40%)" },
                  { key: "f1", label: "Final Report (Month 12)" },
                  { key: "f2", label: "Final Disbursement (30%)" },
                ]}
                app={{ timeline: {
                  k1: { done: !!grant, date: grant ? "Contract active" : "Pending approval" },
                  p1: { current: !!grant, date: grant ? "Submit when due" : "Pending approval" },
                  p2: { date: "After RASSC accepts progress report" },
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
function ResearcherFinal({ onDownload, onView, toast }) {
  const [grant, setGrant] = useState(null);
  const [reports, setReports] = useState(null);
  const [busy, setBusy] = useState(false);
  const reload = () => {
    window.DB.myGrant().then(setGrant).catch(() => setGrant(false));
    window.DB.myReports("final").then(setReports).catch(() => setReports([]));
  };
  useEffect(() => { reload(); }, []);
  const submit = async () => {
    if (!grant) { toast("No approved grant found - your application must be approved first."); return; }
    setBusy(true);
    try { await window.DB.submitReport(grant.id, "final"); toast("Final report submitted. RASSC must accept it before the final 30% tranche can be paid."); reload(); }
    catch (e) { toast("Error: " + (e.message || e)); }
    setBusy(false);
  };
  return (
    <>
      <PageHeader
        title="Final Report"
        desc="End-of-project report — required before third disbursement (30%)."
        actions={<Badge status={RA.STATUS.expert} />}
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Submit Final Report</h3></div>
            <div className="card-body">
              <div className="field">
                <label>Final report PDF</label>
                <div className="upload-box">
                  <Icon name="Upload" size={24} className="icon" />
                  <div className="t">Drop Final_Report.pdf here or click to browse</div>
                  <div className="s">PDF · max 15 MB</div>
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Total spent (THB)</label>
                  <input placeholder="Enter total spent" />
                </div>
                <div className="field">
                  <label>Project completion (%)</label>
                  <input placeholder="Enter completion percentage" />
                </div>
                <div className="field full">
                  <label>Outcomes delivered</label>
                  <textarea className="comment-input" placeholder="List final outcomes delivered."></textarea>
                </div>
                <div className="field full">
                  <label>Lessons learned</label>
                  <textarea className="comment-input" placeholder="Summarize lessons learned, issues, and follow-up actions."></textarea>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted">Once submitted, the file will be routed to RASSC.</span>
                <button className="btn btn-primary" onClick={submit} disabled={busy}>
                  <Icon name="Send" size={13} /> {busy ? "Submitting…" : "Submit Final Report"}
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
                    <div style={{fontWeight: 600}}>{r.application ? r.application.code : "Application"} - Final Report</div>
                    <div className="text-sm text-muted">Status: {r.status}</div>
                  </div>
                  <Badge status={r.status === "accepted" ? RA.STATUS.completed : RA.STATUS.submitted} />
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
function ResearcherPayments({ onDownload, toast }) {
  const [grant, setGrant] = useState(null);
  useEffect(() => { window.DB.myGrant().then(g => setGrant(g || false)).catch(() => setGrant(false)); }, []);
  const triggers = { 1: "After contract signing", 2: "After progress report", 3: "After final report" };
  const trName = { 1: "1st · 30%", 2: "2nd · 40%", 3: "3rd · 30%" };

  if (grant === null) {
    return (<><PageHeader title="Payment Status" desc="Your grant disbursement tranches." /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "40px" }}>Loading…</div></>);
  }
  if (!grant) {
    return (<><PageHeader title="Payment Status" desc="Your grant disbursement tranches." /><div className="card" style={{ textAlign: "center", color: "var(--ink-3)", padding: "48px" }}>No approved grant yet. Once the President approves your application, your 30 / 40 / 30 payments will appear here.</div></>);
  }

  const pays = grant.payments || [];
  return (
    <>
      <PageHeader
        title="Payment Status"
        desc={"Disbursement tranches for " + grant.code + " · Total grant " + fmtBaht(grant.approved_amount || grant.requested_amount)}
      />

      <div className="grid-3 mb-6">
        {pays.map(p => (
          <div key={p.id} className="pay-card">
            <div className="pay-num">{p.pct}%</div>
            <div className="pct">Tranche {p.instalment}</div>
            <div className="amt">{fmtBaht(p.amount)}</div>
            <span className={"badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")}><span className="dot"></span>{p.status === "paid" ? "Paid" : "Pending"}</span>
            <div className="meta-row mt-4"><span className="l">Condition</span><span className="r">{triggers[p.instalment]}</span></div>
            <div className="meta-row"><span className="l">Paid on</span><span className="r">{p.paid_at ? window.DB.fmtDate(p.paid_at) : "—"}</span></div>
          </div>
        ))}
      </div>

      <div className="card card-pad-0">
        <div className="card-head"><h3>Disbursement Log</h3></div>
        <table className="tbl">
          <thead>
            <tr><th>Tranche</th><th>Amount</th><th>Condition</th><th>Status</th><th>Paid on</th></tr>
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
    if (needsActual && !Number(form.requested_amount || 0)) { setErr("Enter the actual fee amount for this publication type."); return; }
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
              <div className="field"><label>Published date</label><input type="date" value={form.published_on} onChange={e => setField("published_on", e.target.value)} /></div>
            </div>
            {needsActual && <div className="field"><label>Actual fee amount (THB)</label><input value={form.requested_amount} onChange={e => setField("requested_amount", e.target.value.replace(/[^0-9]/g, ""))} /></div>}
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
