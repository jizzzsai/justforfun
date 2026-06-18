/* ============================================================
   AU RGMS · Role-specific dashboards (8 roles)
   Plus genuinely new pages for Expert Reviewer and Administrator.

   Existing detail components (FacultyAcademic, FacultyDean,
   RASSCExpert, RASSCPresident, RASSCContract, RASSCPayment) are
   reused by the router for workflow screens.
   ============================================================ */

const D = window.AU;

function initialsFromName(name, fallback = "U") {
  const text = (name || fallback || "U").trim();
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 2 && /^\d+$/.test(parts[1])) return (parts[0][0] + parts[1]).toUpperCase();
  return (parts.length ? parts : [fallback]).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

/* -----------------------------------------------------------
   Helper · small reusable queue table
   ----------------------------------------------------------- */
function QueueTable({ rows, openLabel = "Review", onOpen, columns = "full" }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Application ID</th>
          <th>Research Title</th>
          <th>Researcher</th>
          {columns === "full" && <th>Department</th>}
          <th>Submitted</th>
          {columns === "full" && <th style={{ textAlign: "right" }}>Budget</th>}
          <th>Status</th>
          <th style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(a => (
          <tr key={a.id}>
            <td><span className="id">{a.id}</span></td>
            <td className="title-cell">
              <div className="t" style={{ maxWidth: 260 }}>{a.title}</div>
            </td>
            <td style={{ fontSize: 12 }}>{a.researcher?.name || "—"}</td>
            {columns === "full" && <td style={{ fontSize: 11, color: "var(--ink-3)", maxWidth: 180 }}>{a.department}</td>}
            <td style={{ fontSize: 12 }}>{a.submittedAt}</td>
            {columns === "full" && <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600 }}>{a.budgetTotal?.toLocaleString()}</td>}
            <td><Badge status={a.status} /></td>
            <td className="actions">
              <button className="btn btn-secondary btn-sm" onClick={() => onOpen && onOpen(a)}>{openLabel}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Shared queue wired to live Supabase data + a forward action. */
function WiredQueue({ status, openLabel, confirmTitle, confirmLabel, onDownload, setConfirm, toast }) {
  const [rows, setRows] = useState(null);
  const load = () => window.DB.queue(status).then(setRows).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const act = (row) => setConfirm({
    kind: "success",
    title: confirmTitle || "Forward this application?",
    confirmLabel: confirmLabel || "Confirm",
    message: "Application " + row.id + " · " + row.title + ".",
    onConfirm: async () => {
      try { await window.DB.transition(row._uuid, status, "advance"); toast(row.id + " forwarded to the next stage."); load(); }
      catch (e) { toast("Error: " + (e.message || e)); }
    },
  });
  if (rows === null) return <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading queue…</div>;
  if (rows.length === 0) return <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>;
  return <QueueTable rows={rows} openLabel={openLabel} onOpen={act} onDownload={onDownload} />;
}

/* -----------------------------------------------------------
   DEAN — Dashboard
   ----------------------------------------------------------- */
function DeanDashboard({ navigate }) {
  const [c, setC] = useState(null);
  const [screenRows, setScreenRows] = useState(null);
  const [signRows, setSignRows] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => { window.DB.queue("submitted").then(setScreenRows).catch(() => setScreenRows([])); }, []);
  useEffect(() => { window.DB.queue("dean_sign").then(setSignRows).catch(() => setSignRows([])); }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="Dean's Dashboard"
        desc="First-screen new proposals before committee, and sign-and-forward proposals returning from committee."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="Calendar" size={14} /> AY 2025–2026</button>
            <button className="btn btn-primary" onClick={() => navigate("d-screen")}>
              <Icon name="Inbox" size={14} /> Open Screening Queue
            </button>
          </>
        }
      />

      <div className="stats">
        <Stat label="Pending First Screening"  value={n("submitted")} icon="ClipboardCheck" tone="gold" />
        <Stat label="Awaiting My Signature"    value={n("dean_sign")} icon="FileSignature" tone="navy" />
        <Stat label="At Faculty Committee"     value={n("committee_review")} icon="Users" />
        <Stat label="Approved (system)"        value={n("_approved")} icon="CheckCircle" tone="green" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>First Screening Queue</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("d-screen")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th>Researcher</th><th>Status</th></tr></thead>
            <tbody>
              {screenRows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {screenRows && screenRows.length === 0 && <tr><td colSpan="4"><Empty title="Nothing to screen" desc="New submissions will appear here." icon="ClipboardCheck" /></td></tr>}
              {(screenRows || []).slice(0, 4).map(a => (
                <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate("d-screen-detail")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
                  <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Sign &amp; Forward Queue</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("d-sign")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th>Committee Rec.</th><th>Status</th></tr></thead>
            <tbody>
              {signRows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {(signRows || []).map(a => (
                <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate("d-sign-detail")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
                  <td><span className="badge badge-approved"><span className="dot"></span>Recommend</span></td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
              {signRows && signRows.length === 0 && (
                <tr><td colSpan={4}><Empty title="Nothing to sign" desc="Proposals will appear here after committee review." icon="FileSignature" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — First Screening Queue
   ----------------------------------------------------------- */
function DeanScreenQueue({ navigate, onDownload, toast, setConfirm, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  const load = () => window.DB.queue("submitted").then(setRows).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const openDetail = (row) => {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-screen-detail");
  };
  return (
    <>
      <PageHeader
        title="First Screening Queue"
        desc="New submissions from researchers awaiting your initial screening before they are sent to the Faculty Committee."
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID, researcher, department..." />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <button className="filter"><Icon name="Briefcase" size={12} /> Department</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        {rows === null && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading queue...</div>}
        {rows && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>}
        {rows && rows.length > 0 && <QueueTable rows={rows} openLabel="View" onOpen={openDetail} />}
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — Sign & Forward Queue
   ----------------------------------------------------------- */
function DeanSignQueue({ navigate, onDownload, toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Sign &amp; Forward Queue"
        desc="Proposals returning from the Faculty Committee. Sign and forward to RASSC, or return to committee."
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <WiredQueue status="dean_sign" openLabel="Sign & Forward →"
          confirmTitle="Sign & forward to RASSC?" confirmLabel="Sign & Forward"
          onDownload={onDownload} setConfirm={setConfirm} toast={toast} />
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — Decision History (read-only)
   ----------------------------------------------------------- */
function DeanHistory({ onDownload }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.byStatuses(["committee_review", "dean_sign", "iras_review", "expert_review", "president_review", "approved", "active", "completed", "rejected", "returned"]).then(setRows).catch(() => setRows([])); }, []);
  return (
    <>
      <PageHeader title="Decision History" desc="All proposals you've previously screened or signed." />
      <div className="card card-pad-0">
        {rows && rows.length === 0
          ? <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>No decisions yet.</div>
          : <QueueTable rows={rows || []} openLabel="View" onDownload={onDownload} />}
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   COMMITTEE — Dashboard
   ----------------------------------------------------------- */
function CommitteeDashboard({ navigate, setSelectedApplicationId }) {
  const [c, setC] = useState(null);
  const [rows, setRows] = useState(null);
  const [members, setMembers] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => { window.DB.queue("committee_review").then(setRows).catch(() => setRows([])); }, []);
  useEffect(() => { window.DB.profilesByRole("committee").then(setMembers).catch(() => setMembers([])); }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="Faculty Committee Dashboard"
        desc="Review proposals forwarded by the Dean and record recommendations."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("c-queue")}>
            <Icon name="Inbox" size={14} /> Open Review Queue
          </button>
        }
      />

      <div className="stats">
        <Stat label="Awaiting Review"        value={n("committee_review")} icon="Users" tone="gold" />
        <Stat label="Forwarded to Dean"      value={n("dean_sign")} icon="FileSearch" tone="navy" />
        <Stat label="Approved (system)"      value={n("_approved")} icon="CheckCircle" tone="green" />
        <Stat label="Returned"               value={n("returned")} icon="Repeat" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Review Queue</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("c-queue")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th>Researcher</th><th>Status</th></tr></thead>
            <tbody>
              {rows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {rows && rows.length === 0 && <tr><td colSpan="4"><Empty title="Nothing for committee review" desc="Dean-approved applications will appear here." icon="Users" /></td></tr>}
              {(rows || []).map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => { if (setSelectedApplicationId) setSelectedApplicationId(a._uuid); navigate("c-review"); }}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div></td>
                  <td style={{fontSize: 12}}>{a.researcher?.name}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Committee Members</h3>
            <div className="grow"></div>
            <span className="text-sm text-muted">{members === null ? "..." : members.length + " active"}</span>
          </div>
          <div style={{padding: "8px 0"}}>
            {members === null && <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)" }}>Loading members...</div>}
            {members && members.length === 0 && <Empty title="No committee accounts" desc="Committee test accounts will appear here." icon="Users" />}
            {(members || []).map((m, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "12px 20px"}}>
                <Avatar initials={m.full_name === "Committee Test 2" ? "C2" : "CT"} color="var(--au-navy)" />
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{m.full_name}</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>{m.email}</div>
                </div>
                <span className="text-sm text-muted">Test account</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* COMMITTEE — Queue */
function CommitteeQueue({ navigate, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.queue("committee_review").then(setRows).catch(() => setRows([])); }, []);
  const openReview = (row) => {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("c-review");
  };
  return (
    <>
      <PageHeader title="Review Queue" desc="Proposals from the Dean awaiting committee review." />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        {rows === null && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading committee queue...</div>}
        {rows && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>}
        {rows && rows.length > 0 && <QueueTable rows={rows} openLabel="Review" onOpen={openReview} />}
      </div>
    </>
  );
}

function CommitteeHistory({ onDownload }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.byStatuses(["dean_sign", "iras_review", "expert_review", "president_review", "approved", "active", "completed", "rejected", "returned"]).then(setRows).catch(() => setRows([])); }, []);
  return (
    <>
      <PageHeader title="Past Reviews" desc="Proposals you've reviewed previously." />
      <div className="card card-pad-0">
        {rows && rows.length === 0
          ? <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>No past reviews yet.</div>
          : <QueueTable rows={rows || []} openLabel="View" onDownload={onDownload} />}
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   RASSC — Dashboard (refreshed for 8-role flow)
   ----------------------------------------------------------- */
function RASSCDashboardV2({ navigate }) {
  const [c, setC] = useState(null);
  const [rows, setRows] = useState(null);
  const [experts, setExperts] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => {
    window.DB.byStatuses(["iras_review", "expert_review", "president_review"]).then(setRows).catch(() => setRows([]));
  }, []);
  useEffect(() => {
    window.DB.profilesByRole("expert").then(setExperts).catch(() => setExperts([]));
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const openWork = (row) => {
    navigate(row.statusKey === "iras_review" ? "i-screen" : row.statusKey === "expert_review" ? "i-reviewers" : "i-received");
  };
  return (
    <>
      <PageHeader
        title="RASSC Research Office"
        desc="Receive forwarded proposals, screen them, and assign the required expert reviewers."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("i-assign")}>
            <Icon name="UserPlus" size={14} /> Assign Reviewers
          </button>
        }
      />

      <div className="stats">
        <Stat label="Received from Dean"        value={n("iras_review")} icon="Inbox" tone="gold" />
        <Stat label="Pending Expert Assignment" value={n("iras_review")} icon="UserPlus" tone="navy" />
        <Stat label="Under Expert Review"       value={n("expert_review")} icon="FileSearch" tone="green" />
        <Stat label="At President"              value={n("president_review")} icon="Award" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Active RASSC Workload</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("i-received")}>
              See all <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th>Faculty</th><th>Status</th></tr></thead>
            <tbody>
              {rows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {rows && rows.length === 0 && <tr><td colSpan="4"><Empty title="No active RASSC work" desc="Forwarded applications will appear here." icon="Inbox" /></td></tr>}
              {(rows || []).map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => openWork(a)}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div></td>
                  <td style={{fontSize: 11, color: "var(--ink-3)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.faculty}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Reviewer Pool Snapshot</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("i-reviewers")}>
              Manage pool <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <div style={{padding: "8px 0"}}>
            {experts === null && <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)" }}>Loading experts...</div>}
            {experts && experts.length === 0 && <Empty title="No expert accounts" desc="Expert test accounts will appear here." icon="Users" />}
            {(experts || []).map((e, i) => (
              <div key={e.id} style={{display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: i < experts.length - 1 ? "1px solid var(--line-2)" : "none"}}>
                <Avatar initials={initialsFromName(e.full_name, "E")} color="var(--au-navy)" />
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{e.full_name}</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.email}</div>
                </div>
                <span className="badge badge-iras"><span className="dot"></span>Expert</span>
                <span className="text-sm text-muted" style={{minWidth: 70, textAlign: "right"}}>Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* RASSC — Office Screening */
function RASSCScreen({ applicationId, setSelectedApplicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    const req = applicationId
      ? window.DB.applicationDetail(applicationId)
      : window.DB.firstApplicationForStatus("iras_review");
    req.then(a => {
      setApp(a);
      if (a && setSelectedApplicationId) setSelectedApplicationId(a.id);
    }).catch(() => setApp(null)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [applicationId]);

  const moveToAssignment = () => {
    if (!app) return;
    setConfirm({
      kind: "success",
      title: "Approve RASSC screening?",
      message: app.code + " will move to the expert assignment form.",
      confirmLabel: "Approve Screening",
      onConfirm: () => {
        if (setSelectedApplicationId) setSelectedApplicationId(app.id);
        toast("RASSC screening approved. Select experts next.");
        navigate("i-assign");
      },
    });
  };
  const returnToDean = () => {
    if (!app) return;
    setConfirm({
      kind: "danger",
      title: "Return to Dean?",
      message: app.code + " will leave the RASSC queue and be marked returned.",
      confirmLabel: "Return",
      onConfirm: async () => {
        try {
          await window.DB.transition(app.id, "iras_review", "return");
          toast(app.code + " returned.");
          load();
        } catch (e) {
          toast("Error: " + ((e && e.message) || e));
        }
      },
    });
  };
  const docs = (app && app.documents) || [];

  if (loading) {
    return (
      <>
        <PageHeader title="Office Screening" desc="Verify proposal completeness before assigning expert reviewers." />
        <div className="card" style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Loading application...</div>
      </>
    );
  }
  if (!app) {
    return (
      <>
        <PageHeader title="Office Screening" desc="Verify proposal completeness before assigning expert reviewers." />
        <div className="card"><Empty title="No RASSC screening item" desc="Applications appear here after Dean sign and forward." icon="ClipboardCheck" /></div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={"Office Screening - " + app.code}
        desc="Verify proposal completeness before assigning expert reviewers."
        actions={<Badge status={window.DB.statusBadge(app.status)} />}
      />
      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Forwarded Documents</h3></div>
            <div>
              {docs.length === 0 && <Empty title="No uploaded documents" desc="No PDF documents were forwarded with this application." icon="FileText" />}
              {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Application Summary</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">Title</span><span className="r">{app.title}</span></div>
              <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher ? app.researcher.full_name : "-"}</span></div>
              <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Screening Checklist</h3></div>
            <div className="card-body">
              {[
                { label: docs.length + " forwarded PDF document(s)", checked: docs.length > 0 },
                { label: "Budget total is within the 100,000 THB AU ceiling", checked: Number(app.requested_amount || 0) > 0 && Number(app.requested_amount || 0) <= 100000 },
                { label: "Researcher, faculty, and department are recorded", checked: !!(app.researcher && app.faculty && app.department) },
                { label: "Proposal is ready for expert assignment", checked: docs.length > 0 },
              ].map((item, i, arr) => (
                <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={item.checked} style={{ accentColor: "var(--au-crimson)" }} />
                  <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                </label>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-primary btn-block" disabled={docs.length === 0} onClick={moveToAssignment}>
                  <Icon name="CheckCircle" size={14} /> Approve &amp; Move to Assignment
                </button>
                <button className="btn btn-secondary btn-block" onClick={returnToDean}>
                  <Icon name="ArrowLeft" size={14} /> Return to Dean
                </button>
              </div>
              {docs.length === 0 && <div className="text-sm text-muted mt-3">Upload at least one PDF before moving this application to expert assignment.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* RASSC — Reviewer Pool */
function RASSCReviewerPool({ toast }) {
  const [pool, setPool] = useState(null);
  useEffect(() => {
    window.DB.profilesByRole("expert").then(setPool).catch(() => setPool([]));
  }, []);
  return (
    <>
      <PageHeader
        title="Reviewer Pool"
        desc="Expert test accounts available for proposal evaluation."
        actions={<button className="btn btn-primary" onClick={() => toast("Expert accounts are managed in Supabase profiles.")}><Icon name="Plus" size={14} /> Add Reviewer</button>}
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search reviewers..." />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All experts</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Reviewer pool export uses live Supabase profiles.")}><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Email</th>
              <th>Type</th>
              <th>Expertise</th>
              <th>Current Load</th>
              <th>Status</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pool === null && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading experts...</td></tr>}
            {pool && pool.length === 0 && <tr><td colSpan="7"><Empty title="No expert accounts" desc="Expert profiles will appear here." icon="Users" /></td></tr>}
            {(pool || []).map((r, i) => (
              <tr key={r.id}>
                <td>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <Avatar initials={initialsFromName(r.full_name, "E")} size={28} color="var(--au-navy)" />
                    <span style={{fontSize: 13, fontWeight: 600}}>{r.full_name}</span>
                  </div>
                </td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{r.email}</td>
                <td><span className="badge badge-iras"><span className="dot"></span>Expert</span></td>
                <td style={{fontSize: 12}}>{r.expertise || "General review"}</td>
                <td style={{fontSize: 12, fontWeight: 600}}>Available</td>
                <td><span className="badge badge-check"><span className="dot"></span>{r.is_active === false ? "Inactive" : "Active"}</span></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => toast(r.full_name + " is a live Supabase profile.")}><Icon name="Info" size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   EXPERT REVIEWER — Dashboard
   ----------------------------------------------------------- */
function ExpertDashboard({ navigate, setSelectedApplicationId, profile }) {
  const [c, setC] = useState(null);
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => { window.DB.myExpertAssignments().then(setRows).catch(() => setRows([])); }, [profile && profile.id]);
  const n = (k) => (c ? (c[k] || 0) : "...");
  const openEvaluation = (row) => {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("e-evaluate");
  };
  const reviewer = profile || { full_name: "Expert Reviewer", email: "" };
  return (
    <>
      <PageHeader
        title="Expert Reviewer Dashboard"
        desc="Proposals assigned to your test expert account for evaluation."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("e-assignments")}>
            <Icon name="Folder" size={14} /> Open Assignments
          </button>
        }
      />

      <div className="stats">
        <Stat label="Active Assignments" value={rows === null ? "..." : rows.length} icon="Folder" tone="gold" />
        <Stat label="At President" value={n("president_review")} icon="Award" tone="navy" />
        <Stat label="Approved (system)" value={n("_approved")} icon="CheckCircle" tone="green" />
        <Stat label="Avg. Turnaround" value="-" icon="TrendingDown" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Active Assignments</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("e-assignments")}>
              See all <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <div>
            {rows === null && <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-3)" }}>Loading assignments...</div>}
            {rows && rows.length === 0 && <Empty title="No expert assignments" desc="RASSC assignments will appear here." icon="Folder" />}
            {(rows || []).map(a => (
              <div key={a._uuid} style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)", cursor: "pointer" }} onClick={() => openEvaluation(a)}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="id">{a.id}</span>
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 13, maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <Badge status={a.status} />
                </div>
                <div className="flex justify-between mt-2" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  <span>{a.assignmentStatus || "pending"}</span>
                  <span>Deadline: {a.dueDate || "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Reviewer Profile</h3></div>
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials={initialsFromName(reviewer.full_name, "E")} size={48} color="var(--au-crimson)" />
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18 }}>{reviewer.full_name}</div>
                <div className="text-sm text-muted">{reviewer.email || "Expert reviewer test account"}</div>
              </div>
            </div>
            <div style={{ padding: 14, background: "var(--paper-warm)", borderRadius: "var(--r-md)" }}>
              <div className="flex justify-between mb-2"><span className="text-sm text-muted">Assigned now</span><b>{rows === null ? "..." : rows.length}</b></div>
              <div className="flex justify-between mb-2"><span className="text-sm text-muted">Reviews completed</span><b>0</b></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Current flow</span><b>RASSC to Expert to President</b></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* EXPERT — Assignments list */
function ExpertAssignments({ navigate, onDownload, setSelectedApplicationId, profile }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    window.DB.myExpertAssignments().then(setRows).catch(() => setRows([]));
  }, [profile && profile.id]);
  const openEvaluation = (row) => {
    setSelectedApplicationId(row._uuid);
    navigate("e-evaluate");
  };
  return (
    <>
      <PageHeader title="My Assignments" desc="Proposals assigned to you by the RASSC office." />
      <div className="card card-pad-0">
        {rows === null && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading assignments…</div>}
        {rows && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>No expert-review assignments right now.</div>}
        {rows && rows.length > 0 && <QueueTable rows={rows} openLabel="Evaluate →" onOpen={openEvaluation} onDownload={onDownload} />}
      </div>
    </>
  );
}

/* EXPERT — Submitted reviews history */
function ExpertHistory({ onDownload, profile }) {
  const [history, setHistory] = useState(null);
  useEffect(() => {
    window.DB.myReviews().then(rs => setHistory(rs.map(r => ({
      id: r.application ? r.application.code : "—",
      title: r.application ? r.application.title : "—",
      date: window.DB.fmtDate(r.submitted_at),
      score: r.score == null ? "—" : r.score,
      verdict: r.recommendation === "favorable" ? "Favorable" : r.recommendation === "revise" ? "Revise" : "Unfavorable",
    })))).catch(() => setHistory([]));
  }, [profile && profile.id]);
  return (
    <>
      <PageHeader title="Submitted Reviews" desc="Reviews you have previously submitted." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Submitted</th><th style={{textAlign: "right"}}>Score</th><th>Verdict</th><th style={{textAlign: "right"}}>Actions</th></tr>
          </thead>
          <tbody>
            {history === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading…</td></tr>}
            {history && history.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>No reviews submitted yet.</td></tr>}
            {(history || []).map(h => (
              <tr key={h.id}>
                <td><span className="id">{h.id}</span></td>
                <td className="title-cell"><div className="t" style={{maxWidth: 360}}>{h.title}</div></td>
                <td style={{fontSize: 12}}>{h.date}</td>
                <td style={{textAlign: "right", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 16}}>{h.score}</td>
                <td><span className={`badge ${h.verdict === "Favorable" ? "badge-approved" : h.verdict === "Revise" ? "badge-revision" : "badge-rejected"}`}>
                  <span className="dot"></span>{h.verdict}
                </span></td>
                <td className="actions">
                  <span className="text-sm text-muted">Saved in review history</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   PRESIDENT — Dashboard
   ----------------------------------------------------------- */
function PresidentDashboard({ navigate }) {
  const [c, setC] = useState(null);
  const [queueRows, setQueueRows] = useState(null);
  const [approvedRows, setApprovedRows] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => { window.DB.queue("president_review").then(setQueueRows).catch(() => setQueueRows([])); }, []);
  useEffect(() => { window.DB.byStatuses(["approved", "active", "completed"]).then(setApprovedRows).catch(() => setApprovedRows([])); }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="President's Dashboard"
        desc="Final approval queue. Approve, reject, or mark contracts as signed."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("p-queue")}>
            <Icon name="Award" size={14} /> Open Approval Queue
          </button>
        }
      />

      <div className="stats">
        <Stat label="Awaiting My Approval"     value={n("president_review")} icon="Award" tone="gold" />
        <Stat label="Active Grants"            value={n("active")} icon="FileSignature" tone="navy" />
        <Stat label="Approved (system)"        value={n("_approved")} icon="CheckCircle" tone="green" />
        <Stat label="Completed"                value={n("completed")} icon="Coins" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Approval Queue</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("p-queue")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th style={{textAlign: "right"}}>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {queueRows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {queueRows && queueRows.length === 0 && <tr><td colSpan="4"><Empty title="No applications awaiting President approval" desc="Completed expert reviews will appear here." icon="Award" /></td></tr>}
              {(queueRows || []).map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("p-approve")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div></td>
                  <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600}}>{Number(a.budgetTotal || 0).toLocaleString()}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Budget Allocated · AY 2025–2026</h3></div>
            <div className="card-body">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted">Total budget</span>
                <b>8.4M THB</b>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted">Disbursed</span>
                <b style={{color: "var(--au-crimson)"}}>5.2M (61.9%)</b>
              </div>
              <div className="progress" style={{height: 10}}><div className="bar" style={{width: "61.9%"}}></div></div>
              <div className="grid-3 mt-4" style={{paddingTop: 16, borderTop: "1px solid var(--line)"}}>
                <div><div className="text-sm text-muted">Committed</div><div style={{fontWeight: 600, fontSize: 16}}>1.8M</div></div>
                <div><div className="text-sm text-muted">Disbursed</div><div style={{fontWeight: 600, fontSize: 16, color: "var(--status-paid)"}}>5.2M</div></div>
                <div><div className="text-sm text-muted">Remaining</div><div style={{fontWeight: 600, fontSize: 16, color: "var(--au-gold)"}}>1.4M</div></div>
              </div>
            </div>
          </div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Recent Approvals</h3></div>
            <div style={{padding: "8px 0"}}>
              {approvedRows === null && <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)" }}>Loading approvals...</div>}
              {approvedRows && approvedRows.length === 0 && <Empty title="No recent approvals" desc="President-approved grants will appear here." icon="Award" />}
              {(approvedRows || []).slice(0, 3).map((a, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: i < 2 ? "1px solid var(--line-2)" : "none"}}>
                  <div style={{width: 30, height: 30, borderRadius: "50%", background: "var(--au-cream)", color: "var(--au-crimson)", display: "grid", placeItems: "center"}}>
                    <Icon name="Award" size={14} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13}}><b>{a.id}</b> - <span style={{color: "var(--ink-3)"}}>{a.title}</span></div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{a.submittedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* PRESIDENT — Approval queue */
/* President opens a proposal to read the file + expert scores before deciding. */
function PresidentReviewDetail({ app, onBack, onDownload, onView, toast, setConfirm, afterDecision }) {
  const [conditions, setConditions] = useState("Approved subject to the standard AU progress and final reporting requirements.");
  const expertReviews = (app.reviews || []).filter(r => r.kind === "expert");
  const avg = expertReviews.length ? Math.round(expertReviews.reduce((s, r) => s + Number(r.score || 0), 0) / expertReviews.length) : 0;
  const docs = app.documents || [];

  const decide = (approved) => setConfirm({
    kind: approved ? "success" : "danger",
    title: approved ? "Approve and issue contract?" : "Reject this application?",
    message: approved
      ? app.code + " will be approved and a contract record created."
      : "Rejection by the President is final.",
    confirmLabel: approved ? "Approve" : "Reject",
    onConfirm: async () => {
      try {
        await window.DB.presidentDecision(app.id, approved, conditions);
        toast(app.code + (approved ? " approved. Contract is ready." : " rejected."));
        afterDecision();
      } catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });

  return (
    <>
      <PageHeader
        title={"Final Approval - " + app.code}
        desc={app.title}
        actions={
          <>
            <button className="btn btn-secondary" onClick={onBack}><Icon name="ArrowLeft" size={13} /> Back to Queue</button>
            <Badge status={window.DB.statusBadge(app.status)} />
          </>
        }
      />
      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Application Summary</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher ? app.researcher.full_name : "—"}</span></div>
              <div className="meta-row"><span className="l">Faculty</span><span className="r">{app.faculty || "—"}</span></div>
              <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "—"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
              <div className="meta-row"><span className="l">Duration</span><span className="r">{(app.duration_months || 12) + " months"}</span></div>
              <div className="meta-row"><span className="l">Expert reviews</span><span className="r">{expertReviews.length + " submitted"}</span></div>
              <div className="meta-row"><span className="l">Average score</span><span className="r">{expertReviews.length ? avg + " / 100" : "—"}</span></div>
            </div>
          </div>

          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Application File</h3></div>
            <div>
              {docs.length === 0 && <Empty title="No uploaded documents" desc="The researcher did not upload PDF files for this application." icon="FileText" />}
              {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Expert Reviews &amp; Recommendations</h3></div>
            <div className="card-body">
              {expertReviews.length === 0 && <div className="text-sm text-muted">No expert review records were saved yet.</div>}
              {expertReviews.map(r => (
                <div key={r.id} className="comment">
                  <div className="head">
                    <div className="av">{initialsFromName(r.reviewer ? r.reviewer.full_name : "Expert")}</div>
                    <div>
                      <div className="name">{r.reviewer ? r.reviewer.full_name : "Expert reviewer"}</div>
                      <div className="role">Score {r.score != null ? r.score + " / 100" : "—"} · Recommendation: {r.recommendation || "—"}</div>
                    </div>
                  </div>
                  <div className="body">
                    {r.strengths && <div style={{ marginBottom: 6 }}><b>Strengths:</b> {r.strengths}</div>}
                    {r.weaknesses && <div style={{ marginBottom: 6 }}><b>Weaknesses:</b> {r.weaknesses}</div>}
                    {r.comments && <div><b>Comments:</b> {r.comments}</div>}
                    {!r.strengths && !r.weaknesses && !r.comments && "No written comment entered."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card card-pad-0" style={{ alignSelf: "start" }}>
          <div className="card-head"><h3>President Decision</h3></div>
          <div className="card-body">
            <div className="field">
              <label>Approval conditions</label>
              <textarea className="comment-input" value={conditions} onChange={e => setConditions(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary btn-block" onClick={() => decide(true)}><Icon name="Award" size={14} /> Approve and Issue Contract</button>
              <button className="btn btn-danger btn-block" onClick={() => decide(false)}><Icon name="X" size={14} /> Reject</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PresidentQueue({ navigate, onDownload, onView, toast, setConfirm }) {
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const load = () => window.DB.queue("president_review").then(setRows).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  const open = (row) => {
    setLoadingDetail(true);
    window.DB.applicationDetail(row._uuid)
      .then(setSelected)
      .catch(e => toast("Error: " + ((e && e.message) || e)))
      .finally(() => setLoadingDetail(false));
  };

  if (selected) {
    return <PresidentReviewDetail
      app={selected}
      onBack={() => setSelected(null)}
      onDownload={onDownload} onView={onView} toast={toast} setConfirm={setConfirm}
      afterDecision={() => { setSelected(null); load(); }} />;
  }

  return (
    <>
      <PageHeader title="Final Approval Queue" desc="Open a proposal to review the file and expert scores before approving." />
      <div className="card card-pad-0">
        {(rows === null || loadingDetail) && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading…</div>}
        {rows !== null && !loadingDetail && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>}
        {rows !== null && !loadingDetail && rows.length > 0 && <QueueTable rows={rows} openLabel="Review →" onOpen={open} onDownload={onDownload} />}
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   OFM / FINANCE — Dashboard
   ----------------------------------------------------------- */
function OFMDashboard({ navigate }) {
  const [c, setC] = useState(null);
  const [payments, setPayments] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => {
    window.DB.ofmPayments().then(apps => {
      const rows = [];
      (apps || []).forEach(a => {
        (a.payments || []).filter(p => p.status !== "paid").forEach(p => rows.push({
          id: a.code,
          who: a.researcher ? a.researcher.full_name : "-",
          stage: p.instalment === 1 ? "1st 30%" : p.instalment === 2 ? "2nd 40%" : "Final 30%",
          amount: Number(p.amount || 0),
          status: p.status,
        }));
      });
      setPayments(rows);
    }).catch(() => setPayments([]));
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="Finance / OFM Dashboard"
        desc="Disburse the 30% / 40% / 30% payment tranches as researchers reach each milestone."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("o-payments")}>
            <Icon name="Coins" size={14} /> Open Payment Queue
          </button>
        }
      />

      <div className="stats">
        <Stat label="Awaiting Disbursement"  value={n("approved")} icon="Clock" tone="gold" />
        <Stat label="Active Grants"          value={n("active")} icon="TrendingUp" tone="green" />
        <Stat label="Completed"              value={n("completed")} icon="CheckCircle" tone="navy" />
        <Stat label="Total Grants"           value={n("_approved")} icon="Coins" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Pending Disbursements</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("o-payments")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Researcher</th><th>Stage</th><th style={{textAlign: "right"}}>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {payments === null && <tr><td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {payments && payments.length === 0 && <tr><td colSpan="5"><Empty title="No pending disbursements" desc="Approved grants will appear here after contract setup." icon="Coins" /></td></tr>}
              {(payments || []).map(p => (
                <tr key={p.id + p.stage} style={{cursor: "pointer"}} onClick={() => navigate("o-detail")}>
                  <td><span className="id">{p.id}</span></td>
                  <td style={{fontSize: 12}}>{p.who}</td>
                  <td style={{fontSize: 12}}>{p.stage}</td>
                  <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600}}>{p.amount.toLocaleString()} THB</td>
                  <td><span className="badge badge-pending"><span className="dot"></span>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Monthly Disbursement</h3></div>
            <div className="card-body">
              <div style={{display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px"}}>
                {[3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 9, 11].map((v, i) => (
                  <div key={i} style={{flex: 1, height: `${v * 8}%`, background: i === 11 ? "var(--au-crimson)" : "var(--au-gold-soft)", borderRadius: 3}}></div>
                ))}
              </div>
              <div style={{display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-3)", marginTop: 6}}>
                <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
              </div>
              <div className="text-sm text-muted mt-4 text-center">Highest disbursement this October: <b style={{color: "var(--ink-1)"}}>430k THB</b></div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>By Tranche</h3></div>
            <div className="card-body">
              {[
                { l: "First 30%",  v: 9, t: 12 },
                { l: "Second 40%", v: 6, t: 12 },
                { l: "Final 30%",  v: 4, t: 12 },
              ].map((b, i) => (
                <div key={i} style={{marginBottom: 12}}>
                  <div className="flex justify-between mb-2" style={{fontSize: 12}}>
                    <span style={{fontWeight: 600}}>{b.l}</span>
                    <span className="text-muted">{b.v} of {b.t} grants</span>
                  </div>
                  <div className="progress"><div className="bar" style={{width: `${(b.v / b.t) * 100}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* OFM — Grant detail (single grant's three tranches) */
function OFMDetail({ onDownload, toast, setConfirm }) {
  const [apps, setApps] = useState(null);
  const load = () => window.DB.ofmPayments().then(setApps).catch(() => setApps([]));
  useEffect(() => { load(); }, []);
  if (apps === null) return <><PageHeader title="Grant Detail" desc="Payment tranches for an approved grant." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  if (apps.length === 0) return <><PageHeader title="Grant Detail" desc="Payment tranches for an approved grant." /><div className="card"><Empty title="No approved grant detail" desc="Approved grants will appear here after President approval." icon="Coins" /></div></>;

  const app = apps[0];
  const pays = (app.payments || []).slice().sort((a, b) => a.instalment - b.instalment);
  const pay = (p) => setConfirm({
    kind: "success",
    title: "Mark tranche " + p.instalment + " as paid?",
    message: "Disburse " + fmtBaht(p.amount) + " for " + app.code + ".",
    confirmLabel: "Mark as Paid",
    onConfirm: async () => {
      try { await window.DB.markPaid(p.id, p.instalment, app.id); toast("Tranche " + p.instalment + " paid for " + app.code); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });

  return (
    <>
      <PageHeader title={"Grant Detail - " + app.code} desc={app.title + " - " + fmtBaht(app.approved_amount || app.requested_amount)} actions={<Badge status={window.DB.statusBadge(app.status)} />} />
      <div className="grid-3 mb-6">
        {pays.map(p => {
          const ready = window.DB.payable(app, p.instalment);
          return (
            <div key={p.id} className="pay-card">
              <div className="pay-num">{p.pct}%</div>
              <div className="pct">Tranche {p.instalment}</div>
              <div className="amt">{fmtBaht(p.amount)}</div>
              <span className={"badge " + (p.status === "paid" ? "badge-paid" : ready ? "badge-approved" : "badge-draft")}><span className="dot"></span>{p.status === "paid" ? "Paid" : ready ? "Ready" : "Not due"}</span>
              <div className="meta-row mt-4"><span className="l">Trigger</span><span className="r">{p.trigger}</span></div>
              <div className="meta-row"><span className="l">Paid on</span><span className="r">{p.paid_at ? window.DB.fmtDate(p.paid_at) : "Not paid"}</span></div>
              <button className={"btn " + (ready && p.status !== "paid" ? "btn-primary" : "btn-secondary") + " mt-3"} style={{ width: "100%" }} disabled={!ready || p.status === "paid"} onClick={() => pay(p)}>
                {p.status === "paid" ? "Paid" : ready ? "Mark as Paid" : "Waiting for gate"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="card card-pad-0">
        <div className="card-head"><h3>Grant Payment Conditions</h3></div>
        <div className="card-body">
          <div className="meta-row"><span className="l">1st 30%</span><span className="r">Available after contract signing</span></div>
          <div className="meta-row"><span className="l">2nd 40%</span><span className="r">Available after accepted progress report</span></div>
          <div className="meta-row"><span className="l">Final 30%</span><span className="r">Available after accepted final report</span></div>
        </div>
      </div>
    </>
  );
}

/* OFM — Payment history */
function OFMHistory({ onDownload }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    window.DB.paidPayments().then(ps => setRows(ps.map(p => ({
      id: p.application ? p.application.code : "—",
      who: p.application && p.application.researcher ? p.application.researcher.full_name : "—",
      stage: (p.instalment === 1 ? "1st · 30%" : p.instalment === 2 ? "2nd · 40%" : "3rd · 30%"),
      amount: Number(p.amount),
      date: window.DB.fmtDate(p.paid_at),
      ref: "PAY-" + String(p.id || "").slice(0, 8),
    })))).catch(() => setRows([]));
  }, []);
  return (
    <>
      <PageHeader title="Payment History" desc="All disbursements processed by OFM." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead><tr><th>Date</th><th>Application</th><th>Researcher</th><th>Tranche</th><th style={{textAlign: "right"}}>Amount</th><th>Reference</th><th style={{textAlign: "right"}}>Receipt</th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>No payments processed yet.</td></tr>}
            {(rows || []).map((r, i) => (
              <tr key={i}>
                <td style={{fontSize: 12}}>{r.date}</td>
                <td><span className="id">{r.id}</span></td>
                <td style={{fontSize: 12}}>{r.who}</td>
                <td style={{fontSize: 12}}>{r.stage}</td>
                <td style={{textAlign: "right", fontWeight: 600}}>{r.amount.toLocaleString()} THB</td>
                <td><span className="id" style={{fontSize: 11}}>{r.ref}</span></td>
                <td className="actions"><span className="text-sm text-muted">Recorded</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   ADMINISTRATOR — Dashboard + Users + Journals + Audit + Settings
   ----------------------------------------------------------- */
function AdminDashboard({ navigate }) {
  const [c, setC] = useState(null);
  const [users, setUsers] = useState("…");
  useEffect(() => {
    window.DB.statusCounts().then(setC).catch(() => setC({}));
    window.DB.profileCount().then(setUsers).catch(() => {});
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="Administrator Dashboard"
        desc="System health, user roster, and reference data for the AU-RGMS portal."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("a-users")}>
            <Icon name="Users" size={14} /> Manage Users
          </button>
        }
      />

      <div className="stats">
        <Stat label="Total Users"          value={users} icon="Users" tone="gold" />
        <Stat label="Applications"         value={n("_total")} icon="Folder" tone="navy" />
        <Stat label="Approved Grants"      value={n("_approved")} icon="CheckCircle" tone="green" />
        <Stat label="System Uptime"        value="99.98%" icon="TrendingUp" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Users by Role</h3></div>
          <div className="card-body">
            {D.ROLES.map(r => {
              const count = D.SYSTEM_USERS.filter(u => u.role.startsWith(r.name.split(" ")[0])).length;
              const pct = (count / D.SYSTEM_USERS.length) * 100;
              return (
                <div key={r.key} style={{marginBottom: 10}}>
                  <div className="flex justify-between mb-2" style={{fontSize: 12}}>
                    <span style={{fontWeight: 600}}>{r.name}</span>
                    <span className="text-muted">{count} user{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="progress" style={{height: 5}}><div className="bar" style={{width: `${pct}%`}}></div></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Recent Audit Events</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("a-audit")}>See all <Icon name="ArrowRight" size={12} /></button>
          </div>
          <div style={{padding: "8px 0"}}>
            {D.AUDIT_LOG.slice(0, 5).map((e, i) => (
              <div key={i} style={{padding: "10px 20px", borderBottom: i < 4 ? "1px solid var(--line-2)" : "none", display: "flex", gap: 10}}>
                <div style={{width: 28, height: 28, borderRadius: "50%", background: "var(--paper-warm)", color: "var(--ink-2)", display: "grid", placeItems: "center", flexShrink: 0}}>
                  <Icon name="Clock" size={12} />
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 12, color: "var(--ink-1)"}}>{e.act}</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.who} · {e.t} · {e.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ADMIN — User management */
/* ADMIN — Journal tier reference */
function AdminJournals({ toast }) {
  return (
    <>
      <PageHeader
        title="Journal Tier Reference"
        desc="Incentive tiers used when researchers report publications. Used by OFM for publication bonuses."
        actions={<button className="btn btn-primary"><Icon name="Plus" size={14} /> Add Tier</button>}
      />
      <div className="grid-2eq mb-6">
        <div className="card">
          <div className="eyebrow mb-2">Last updated</div>
          <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>Today, 06:55</div>
          <div className="text-sm text-muted">By Admin Test</div>
        </div>
        <div className="card">
          <div className="eyebrow mb-2">Total tiers configured</div>
          <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>{D.JOURNAL_TIERS.length}</div>
          <div className="text-sm text-muted">Across Scopus, WoS, and TCI</div>
        </div>
      </div>

      <div className="card card-pad-0">
        <table className="tbl">
          <thead>
            <tr>
              <th>Code</th>
              <th>Tier</th>
              <th style={{textAlign: "right"}}>Incentive (THB)</th>
              <th style={{textAlign: "right"}}>Publications recorded</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {D.JOURNAL_TIERS.map(t => (
              <tr key={t.code}>
                <td><span className="id" style={{fontSize: 12, fontWeight: 700}}>{t.code}</span></td>
                <td style={{fontWeight: 600, fontSize: 13}}>{t.name}</td>
                <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontWeight: 600}}>{typeof t.incentive === "number" ? t.incentive.toLocaleString() : t.incentive}</td>
                <td style={{textAlign: "right", fontSize: 12, color: "var(--ink-3)"}}>{t.count}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm"><Icon name="Edit" size={13} /></button>
                  <button className="btn btn-ghost btn-sm"><Icon name="Trash" size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ADMIN — Audit log */
/* ADMIN — System settings */
function AdminUsers({ toast }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  useEffect(() => { window.DB.allProfiles().then(setUsers).catch(() => setUsers([])); }, []);
  const filtered = (users || []).filter(u => !search || (u.full_name + u.email + u.role + (u.department || "")).toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <PageHeader title="User Management" desc="Live Supabase user profiles for AU-RGMS." actions={<button className="btn btn-primary" onClick={() => toast("Create users from Supabase Auth, then profiles appear here.")}><Icon name="Plus" size={14} /> Add User</button>} />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search"><Icon name="Search" size={14} className="icon" /><input placeholder="Search by name, email, role..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button className="filter active"><Icon name="Filter" size={12} /> All roles</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Profile export is based on live Supabase profiles.")}><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Created</th><th style={{textAlign: "right"}}>Actions</th></tr></thead>
          <tbody>
            {users === null && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading users...</td></tr>}
            {users && filtered.length === 0 && <tr><td colSpan="7"><Empty title="No users found" desc="Try another search." icon="Users" /></td></tr>}
            {filtered.map(u => (
              <tr key={u.id}>
                <td><div style={{display: "flex", alignItems: "center", gap: 8}}><Avatar initials={(u.full_name || "U").split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()} size={28} color="var(--au-navy)" /><div><div style={{fontSize: 13, fontWeight: 600}}>{u.full_name}</div><div style={{fontSize: 11, color: "var(--ink-3)"}} className="id">{String(u.id).slice(0, 8)}</div></div></div></td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{u.email}</td>
                <td><span className="badge badge-academic" style={{fontSize: 10}}><span className="dot"></span>{u.role}</span></td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{u.department || "-"}</td>
                <td><span className={"badge " + (u.is_active === false ? "badge-draft" : "badge-check")}><span className="dot"></span>{u.is_active === false ? "Inactive" : "Active"}</span></td>
                <td style={{fontSize: 11, color: "var(--ink-3)"}}>{window.DB.fmtDate(u.created_at)}</td>
                <td className="actions"><button className="btn btn-ghost btn-sm" onClick={() => toast(u.full_name + " is stored in Supabase profiles.")}><Icon name="Info" size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminAudit() {
  const [events, setEvents] = useState(null);
  useEffect(() => { window.DB.auditEvents().then(setEvents).catch(() => setEvents([])); }, []);
  return (
    <>
      <PageHeader title="Audit Log" desc="Live workflow events recorded in Supabase." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead><tr><th>Timestamp</th><th>User</th><th>Application</th><th>Action</th></tr></thead>
          <tbody>
            {events === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading audit events...</td></tr>}
            {events && events.length === 0 && <tr><td colSpan="4"><Empty title="No audit events yet" desc="Workflow actions will appear here." icon="Clock" /></td></tr>}
            {(events || []).map(e => (
              <tr key={e.id}>
                <td style={{fontSize: 12}}>{window.DB.fmtDate(e.created_at)}</td>
                <td style={{fontSize: 12, fontWeight: 600}}>{e.actor ? e.actor.full_name : (e.actor_role || "-")}</td>
                <td style={{fontSize: 12}}>{e.application ? e.application.code : "-"}</td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminSettings({ toast }) {
  const settings = [
    { key: "grant_limit", label: "Maximum internal grant amount", value: 100000, unit: "THB" },
    { key: "contract_days", label: "Days to sign contract after approval", value: 45, unit: "days" },
    { key: "tranche_1", label: "First tranche", value: 30, unit: "%" },
    { key: "tranche_2", label: "Second tranche", value: 40, unit: "%" },
    { key: "tranche_3", label: "Final tranche", value: 30, unit: "%" },
  ];
  const CAP_FIELDS = [
    { key: "remuneration", label: "Remuneration (research assistant)" },
    { key: "equipment", label: "Research equipment" },
    { key: "travel", label: "Travel / data collection" },
    { key: "misc", label: "Miscellaneous" },
  ];
  const [caps, setCaps] = useState(D.DEFAULT_BUDGET_CAPS || { remuneration: 30, equipment: 50, travel: 40, misc: 20 });
  const [busy, setBusy] = useState(false);
  useEffect(() => { window.DB.budgetCaps().then(setCaps).catch(() => {}); }, []);
  const setCap = (k, v) => setCaps(c => ({ ...c, [k]: Math.max(0, Math.min(100, parseInt((v + "").replace(/[^0-9]/g, ""), 10) || 0)) }));
  const save = async () => {
    setBusy(true);
    try {
      await window.DB.saveSetting("budget_caps", caps, "Budget category caps (% of total grant)");
      await window.DB.saveSetting("workflow_policy", { settings: settings }, "Workflow policy");
      toast("Settings saved. Researcher budget caps now use these values.");
    } catch (e) {
      toast("Error: " + ((e && e.message) || e));
    } finally { setBusy(false); }
  };
  return (
    <>
      <PageHeader title="System Settings" desc="Workflow rules, payment splits, and policy values." actions={<button className="btn btn-primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save Changes"}</button>} />
      <div className="card card-pad-0 mb-4">
        <div className="card-head"><h3>Budget Category Caps</h3></div>
        <div className="card-body" style={{ paddingBottom: 4 }}>
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>Maximum each category may take as a % of the total grant. The researcher submit form enforces these live — adjust them here to allow the exceptions the policy permits.</p>
        </div>
        <div>
          {CAP_FIELDS.map((f, i) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderTop: "1px solid var(--line-2)" }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{f.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input value={caps[f.key]} onChange={e => setCap(f.key, e.target.value)} style={{ width: 80, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", textAlign: "right", fontWeight: 600 }} />
                <span className="text-sm text-muted">% max</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card card-pad-0">
        <div className="card-head"><h3>Workflow Policy</h3></div>
        <div>
          {settings.map((it, i) => (
            <div key={it.key} style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: i < settings.length - 1 ? "1px solid var(--line-2)" : "none" }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{it.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input defaultValue={it.value} style={{ width: 90, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", textAlign: "right", fontWeight: 600 }} />
                <span className="text-sm text-muted">{it.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function compactNumber(n) {
  const v = Number(n || 0);
  if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
  if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1) + "k";
  return String(v);
}

function AnalyticsBars({ rows, labelKey = "label", valueKey = "value", renderValue, emptyTitle, emptyDesc }) {
  const list = (rows || []).filter(r => Number(r[valueKey] || 0) > 0);
  const max = Math.max(1, ...list.map(r => Number(r[valueKey] || 0)));
  if (!list.length) {
    return <Empty title={emptyTitle || "No analytics data yet"} desc={emptyDesc || "Live records will appear here after users submit data."} icon="BarChart3" />;
  }
  return (
    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {list.map((r, i) => {
        const value = Number(r[valueKey] || 0);
        const pct = Math.max(4, Math.round((value / max) * 100));
        return (
          <div key={(r[labelKey] || "row") + i}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 650, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r[labelKey]}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "ui-monospace, monospace" }}>{renderValue ? renderValue(r) : compactNumber(value)}</div>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: "var(--line-2)", overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", borderRadius: 999, background: "var(--au-crimson)" }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsDashboard({ role }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([
      window.DB.statusCounts().catch(() => ({})),
      window.DB.facultyStats().catch(() => []),
      window.DB.publicationGrantStats().catch(() => ({ total: 0, byFaculty: [], byIndex: {} })),
      window.DB.paidPayments().catch(() => []),
    ]).then(([counts, faculties, publications, paid]) => {
      if (!alive) return;
      setData({ counts, faculties, publications, paid });
    });
    return () => { alive = false; };
  }, [role]);
  const isFaculty = role === "dean" || role === "committee";
  const c = data ? data.counts : {};
  const faculties = data ? data.faculties : [];
  const pub = data ? data.publications : { total: 0, byFaculty: [], byIndex: {} };
  const paid = data ? data.paid : [];
  const totalPaid = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
  const statusRows = Object.keys(c || {})
    .filter(k => k.charAt(0) !== "_")
    .map(k => ({ label: window.DB.statusBadge(k).label, value: c[k] }))
    .sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
  const budgetRows = faculties.map(f => ({
    faculty: f.faculty,
    requested_sum: Number(f.requested_sum || 0),
    approved_sum: Number(f.approved_sum || 0),
  })).sort((a, b) => b.requested_sum - a.requested_sum);
  const pubIndexRows = Object.keys(pub.byIndex || {}).map(k => ({
    label: k,
    value: pub.byIndex[k],
  })).sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader
        title="AI Analytics"
        desc="Live Supabase analytics for research grants, payments, and publication rewards."
        actions={<Badge status={{ label: role === "dean" || role === "committee" ? "Faculty scoped" : "Live data", cls: "badge-academic" }} />}
      />
      <div className="stats">
        <Stat label="Applications" value={data ? c._total || 0 : "..."} icon="Folder" />
        <Stat label="Under Review" value={data ? c._underReview || 0 : "..."} icon="FileSearch" tone="gold" />
        <Stat label="Approved / Active" value={data ? c._approved || 0 : "..."} icon="CheckCircle" tone="green" />
        <Stat label="Publication Grants" value={data ? pub.total || 0 : "..."} icon="Award" tone="navy" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Applications by Faculty</h3></div>
          <AnalyticsBars
            rows={faculties.slice(0, 8)}
            labelKey="faculty"
            valueKey="total"
            renderValue={r => r.total + " apps"}
            emptyTitle="No application analytics yet"
          />
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Workflow Status</h3></div>
          <AnalyticsBars
            rows={statusRows}
            valueKey="value"
            renderValue={r => r.value + " apps"}
            emptyTitle="No workflow data yet"
          />
        </div>
      </div>

      <div className="grid-2 mt-4">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Requested Budget by Faculty</h3></div>
          <AnalyticsBars
            rows={budgetRows.slice(0, 8)}
            labelKey="faculty"
            valueKey="requested_sum"
            renderValue={r => fmtBaht(r.requested_sum)}
            emptyTitle="No budget data yet"
          />
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Publication Rewards</h3></div>
          <AnalyticsBars
            rows={pubIndexRows}
            valueKey="value"
            renderValue={r => r.value + " grants"}
            emptyTitle="No publication grants yet"
            emptyDesc="Researcher publication reward submissions will appear after RASSC receives them."
          />
        </div>
      </div>

      <div className="grid-2 mt-4">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Publication Rewards by Faculty</h3></div>
          <AnalyticsBars
            rows={(pub.byFaculty || []).slice(0, 8)}
            labelKey="faculty"
            valueKey="total"
            renderValue={r => r.total + " grants"}
            emptyTitle="No publication faculty data yet"
          />
        </div>
        {!isFaculty && (
        <div className="card card-pad-0">
          <div className="card-head"><h3>Finance Snapshot</h3></div>
          <div className="card-body">
            <div className="meta-row"><span className="l">Paid research grant tranches</span><span className="r">{paid.length}</span></div>
            <div className="meta-row"><span className="l">Research grant disbursed</span><span className="r">{fmtBaht(totalPaid)}</span></div>
            <div className="meta-row"><span className="l">Publication rewards pending OFM</span><span className="r">{pub.payment_pending || 0}</span></div>
            <div className="meta-row"><span className="l">Publication rewards paid</span><span className="r">{pub.paid || 0}</span></div>
            <div className="meta-row"><span className="l">Publication reward amount approved</span><span className="r">{fmtBaht(pub.approved_sum || 0)}</span></div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

/* Tiny toggle */
function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(o => !o)}
      style={{
        width: 40, height: 22, borderRadius: 999,
        background: on ? "var(--au-crimson)" : "var(--line)",
        border: "none", padding: 2,
        display: "flex", alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background .15s",
        cursor: "pointer",
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }}></span>
    </button>
  );
}

Object.assign(window, {
  DeanDashboard, DeanScreenQueue, DeanSignQueue, DeanHistory,
  CommitteeDashboard, CommitteeQueue, CommitteeHistory,
  RASSCDashboardV2, RASSCScreen, RASSCReviewerPool,
  ExpertDashboard, ExpertAssignments, ExpertHistory,
  PresidentDashboard, PresidentQueue,
  OFMDashboard, OFMDetail, OFMHistory,
  AdminDashboard, AdminUsers, AdminJournals, AdminAudit, AdminSettings,
  AnalyticsDashboard,
});
