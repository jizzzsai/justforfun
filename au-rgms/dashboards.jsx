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
  // The Dean handles three pipelines: AU-R1 (via Faculty Committee) and AU-R3 /
  // AU-R4 (straight to IRAS). Toggle between them.
  const [sys, setSys] = useState("au_r1");
  const isR3 = sys === "au_r3";
  const isR4 = sys === "au_r4";
  const [c, setC] = useState(null);
  const [screenRows, setScreenRows] = useState(null);
  useEffect(() => {
    setC(null); setScreenRows(null);
    window.DB.statusCounts(sys).then(setC).catch(() => setC({}));
    window.DB.queue("submitted", sys).then(setScreenRows).catch(() => setScreenRows([]));
  }, [sys]);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const openQueue = () => navigate(isR4 ? "d-r4-screen" : isR3 ? "d-r3-screen" : "d-screen");
  const rowPage = isR4 ? "d-r4-screen" : isR3 ? "d-r3-screen" : "d-screen-detail";
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r1", label: "AU-R1" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => setSys(t.id)}
          style={{ padding: "7px 15px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
            background: sys === t.id ? "var(--au-crimson)" : "transparent",
            color: sys === t.id ? "#fff" : "var(--ink-2)" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader
        title={isR4 ? "AU-R4 · Dean's Dashboard" : isR3 ? "AU-R3 · Dean's Dashboard" : "Dean's Dashboard"}
        desc={isR4
          ? "Review publication fee and reward applications before forwarding eligible claims to IRAS for verification."
          : isR3
          ? "Review paper presentation grant applications from your faculty and forward eligible applications to IRAS for verification."
          : "Screen new proposals from your faculty, then forward them to the Faculty Committee."}
        actions={
          <>
            {sysToggle}
            <button className="btn btn-primary" onClick={openQueue}>
              <Icon name="Inbox" size={14} /> {isR4 ? "Open AU-R4 Screening Queue" : isR3 ? "Open AU-R3 Screening Queue" : "Open Screening Queue"}
            </button>
          </>
        }
      />

      {isR4 ? (
        <div className="stats">
          <Stat label="Pending Dean Review"    value={n("submitted")} icon="ClipboardCheck" tone="gold" />
          <Stat label="Returned for Revision"  value={n("returned")} icon="Repeat" tone="navy" />
          <Stat label="Forwarded to IRAS"      value={n("iras_review")} icon="Send" />
          <Stat label="Approved / Paid"        value={(c ? (c.approved || 0) + (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
        </div>
      ) : isR3 ? (
        <div className="stats">
          <Stat label="Pending Dean Review" value={n("submitted")} icon="ClipboardCheck" tone="gold" />
          <Stat label="Forwarded to IRAS"   value={n("iras_review")} icon="Send" tone="navy" />
          <Stat label="At Finance"          value={n("approved")} icon="Coins" />
          <Stat label="Approved / Paid"     value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
        </div>
      ) : (
        <div className="stats">
          <Stat label="Pending Screening"      value={n("submitted")} icon="ClipboardCheck" tone="gold" />
          <Stat label="At Faculty Committee"   value={n("committee_review")} icon="Users" tone="navy" />
          <Stat label="At RASSC"               value={n("iras_review")} icon="Landmark" />
          <Stat label="Approved (system)"      value={n("_approved")} icon="CheckCircle" tone="green" />
        </div>
      )}

      <div className="card card-pad-0">
        <div className="card-head">
          <h3>{isR4 ? "AU-R4 Screening Queue" : isR3 ? "AU-R3 Screening Queue" : "Screening Queue"}</h3>
          <div className="grow"></div>
          <button className="btn btn-ghost btn-sm" onClick={openQueue}>
            Open queue <Icon name="ArrowRight" size={12} />
          </button>
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Title</th><th>Researcher</th><th>Status</th></tr></thead>
          <tbody>
            {screenRows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
            {screenRows && screenRows.length === 0 && <tr><td colSpan="4"><Empty title="Nothing to screen" desc="New submissions will appear here." icon="ClipboardCheck" /></td></tr>}
            {(screenRows || []).slice(0, 8).map(a => (
              <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate(rowPage)}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell"><div className="t" style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
                <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
                <td><Badge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — AU-R3 Screening Queue (paper presentation requests)
   ----------------------------------------------------------- */
function DeanR3Queue({ navigate, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.queue("submitted", "au_r3").then(setRows).catch(() => setRows([])); }, []);
  const open = (row) => {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-r3-detail");
  };
  return (
    <>
      <PageHeader
        title="AU-R3 Screening Queue"
        desc="Paper presentation grant requests awaiting your review before they are forwarded to IRAS."
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID, paper, conference…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Application ID</th><th>Paper Title</th><th>Conference</th><th>Researcher</th><th style={{ textAlign: "right" }}>Requested</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading queue…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--ink-3)" }}>No AU-R3 requests waiting right now.</td></tr>}
            {(rows || []).map(a => {
              const ci = a.conference_info || {};
              const intl = ci.confType === "International";
              return (
                <tr key={a.id}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell">
                    <div className="t" style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div className="s">{a.department || a.faculty || ""}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ci.confName || "—"}</div>
                    {ci.confType && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                        color: intl ? "var(--au-crimson)" : "var(--au-gold-deep)",
                        background: intl ? "var(--au-crimson-soft)" : "var(--au-gold-soft)" }}>
                        {ci.confType}
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
                  <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(a.requested_amount || 0))}</td>
                  <td><Badge status={a.status} /></td>
                  <td className="actions">
                    <button className="btn btn-primary btn-sm" onClick={() => open(a)}>Review</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — AU-R4 Screening Queue (publication fee & reward)
   ----------------------------------------------------------- */
function DeanR4Queue({ navigate, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  useEffect(() => { window.DB.queue("submitted", "au_r4").then(setRows).catch(() => setRows([])); }, []);
  const open = (row) => { if (setSelectedApplicationId) setSelectedApplicationId(row._uuid); navigate("d-r4-detail"); };
  const filtered = (rows || []).filter(a => {
    if (!q.trim()) return true;
    const pi = a.conference_info; // n/a
    const hay = [a.id, a.title, a.researcher && a.researcher.name, a.department].join(" ").toLowerCase();
    return hay.indexOf(q.toLowerCase()) >= 0;
  });
  return (
    <>
      <PageHeader title="AU-R4 Screening Queue" desc="Review submitted publication fee and reward applications from researchers in your faculty." />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID, article, journal, researcher, or DOI" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Application ID</th><th>Article Title</th><th>Journal</th><th>Category</th><th>Researcher</th><th style={{ textAlign: "right" }}>Requested</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading queue…</td></tr>}
            {rows && filtered.length === 0 && <tr><td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--ink-3)" }}>No AU-R4 applications waiting right now.</td></tr>}
            {filtered.map(a => {
              const pi = a.pub_info || {};
              return (
                <tr key={a.id}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div><div className="s">{a.department || a.faculty || ""}</div></td>
                  <td><div style={{ fontSize: 12.5, maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pi.journal || "—"}</div></td>
                  <td><span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: "var(--au-crimson)", background: "var(--au-crimson-soft)" }}>{pi.indexLabel || "—"}</span></td>
                  <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
                  <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(a.requested_amount || 0))}</td>
                  <td><Badge status={a.status} /></td>
                  <td className="actions"><button className="btn btn-primary btn-sm" onClick={() => open(a)}>Review</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   DEAN — First Screening Queue
   ----------------------------------------------------------- */
function DeanScreenQueue({ navigate, onDownload, toast, setConfirm, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  // AU-R3 and AU-R4 have their own queues; the R1 queue shows only au_r1.
  const load = () => window.DB.queue("submitted", "au_r1").then(setRows).catch(() => setRows([]));
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
function IRASGrantDashboard({ navigate, setSelectedApplicationId, sys }) {
  const isR4 = sys === "au_r4";
  const [c, setC] = useState(null);
  const [rows, setRows] = useState(null);
  useEffect(() => {
    setC(null); setRows(null);
    window.DB.statusCounts(sys).then(setC).catch(() => setC({}));
    window.DB.queue("iras_review", sys).then(setRows).catch(() => setRows([]));
  }, [sys]);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const detailPage = isR4 ? "i-r4-verify" : "i-r3-verify";
  const open = (row) => { if (setSelectedApplicationId) setSelectedApplicationId(row._uuid); navigate(detailPage); };
  return (
    <>
      <div className="stats">
        <Stat label="Pending Verification"  value={n("iras_review")} icon="ClipboardCheck" tone="gold" />
        <Stat label="Returned for Revision" value={n("returned")} icon="Repeat" tone="navy" />
        <Stat label="Forwarded to Finance"  value={n("approved")} icon="Send" />
        <Stat label="Paid / Completed"      value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
      </div>
      <div className="card card-pad-0">
        <div className="card-head"><h3>{isR4 ? "AU-R4" : "AU-R3"} Verification Queue</h3></div>
        <table className="tbl">
          <thead><tr><th>Application ID</th><th>{isR4 ? "Article" : "Paper"} Title</th><th>{isR4 ? "Journal / Category" : "Conference"}</th><th>Researcher</th><th style={{ textAlign: "right" }}>Requested</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "28px", color: "var(--ink-3)" }}>Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "36px", color: "var(--ink-3)" }}>No Dean-approved {isR4 ? "AU-R4" : "AU-R3"} applications waiting.</td></tr>}
            {(rows || []).map(a => {
              const pi = a.pub_info || {}, ci = a.conference_info || {};
              return (
                <tr key={a.id}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
                  <td style={{ fontSize: 12 }}>{isR4 ? ((pi.journal || "—") + (pi.indexLabel ? " · " + pi.indexLabel : "")) : (ci.confName || "—")}</td>
                  <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
                  <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(a.requested_amount || 0))}</td>
                  <td className="actions"><button className="btn btn-primary btn-sm" onClick={() => open(a)}>Verify</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RASSCDashboardV2({ navigate, setSelectedApplicationId }) {
  const [sys, setSys] = useState("au_r1");
  const isR4 = sys === "au_r4", isR3 = sys === "au_r3";
  const [c, setC] = useState(null);
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.statusCounts().then(setC).catch(() => setC({})); }, []);
  useEffect(() => {
    window.DB.byStatuses(["iras_review", "approved", "active"]).then(setRows).catch(() => setRows([]));
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const openWork = (row) => {
    navigate(row.statusKey === "iras_review" ? "i-screen" : "i-received");
  };
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r1", label: "AU-R1" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => setSys(t.id)} style={{ padding: "7px 15px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
  if (isR3 || isR4) {
    return (
      <>
        <PageHeader
          title={(isR4 ? "AU-R4" : "AU-R3") + " · IRAS Dashboard"}
          desc={isR4
            ? "Verify Dean-approved publication fee and reward applications before forwarding eligible claims to Finance."
            : "Verify Dean-approved paper presentation applications before forwarding them to Finance."}
          actions={sysToggle}
        />
        <IRASGrantDashboard navigate={navigate} setSelectedApplicationId={setSelectedApplicationId} sys={sys} />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="RASSC Research Office"
        desc="Receive committee-recommended proposals, screen them, and approve eligible ones for Finance."
        actions={
          <>
            {sysToggle}
            <button className="btn btn-primary" onClick={() => navigate("i-received")}>
              <Icon name="Inbox" size={14} /> Received Queue
            </button>
          </>
        }
      />

      <div className="stats">
        <Stat label="Received from Committee" value={n("iras_review")} icon="Inbox" tone="gold" />
        <Stat label="At Finance"              value={n("approved")} icon="Coins" tone="navy" />
        <Stat label="Active Grants"           value={n("active")} icon="TrendingUp" tone="green" />
        <Stat label="Completed"               value={n("completed")} icon="CheckCircle" />
      </div>

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

  const approve = () => {
    if (!app) return;
    setConfirm({
      kind: "success",
      title: "Approve and send to Finance?",
      message: app.code + " will be approved, a grant contract issued, and it will move to the Finance Office for disbursement.",
      confirmLabel: "Approve", withReason: true,
      onConfirm: async (reason) => {
        try {
          await window.DB.transition(app.id, "iras_review", "advance", reason);
          toast(app.code + " approved — sent to Finance Office.");
          navigate("i-received");
        } catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
      },
    });
  };
  const returnToResearcher = () => {
    if (!app) return;
    setConfirm({
      kind: "danger",
      title: "Return to researcher for revision?",
      message: app.code + " will be sent back to the researcher for revision.",
      confirmLabel: "Return", withReason: true, reasonRequired: true,
      onConfirm: async (reason) => {
        try { await window.DB.transition(app.id, "iras_review", "return", reason); toast(app.code + " returned for revision."); navigate("i-received"); }
        catch (e) { toast("Error: " + ((e && e.message) || e)); }
      },
    });
  };
  const reject = () => {
    if (!app) return;
    setConfirm({
      kind: "danger",
      title: "Reject this application?",
      message: app.code + " will be rejected. This ends the application.",
      confirmLabel: "Reject", withReason: true, reasonRequired: true,
      onConfirm: async (reason) => {
        try { await window.DB.transition(app.id, "iras_review", "reject", reason); toast(app.code + " rejected."); navigate("i-received"); }
        catch (e) { toast("Error: " + ((e && e.message) || e)); }
      },
    });
  };
  const docs = (app && app.documents) || [];

  if (loading) {
    return (
      <>
        <PageHeader title="Office Screening" desc="Verify proposal completeness before approving the grant." />
        <div className="card" style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Loading application...</div>
      </>
    );
  }
  if (!app) {
    return (
      <>
        <PageHeader title="Office Screening" desc="Verify proposal completeness before approving the grant." />
        <div className="card"><Empty title="No RASSC screening item" desc="Applications appear here after the Faculty Committee recommends them." icon="ClipboardCheck" /></div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={"Office Screening - " + app.code}
        desc="Verify proposal completeness before approving the grant."
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
                { label: "Proposal is complete and ready for approval", checked: docs.length > 0 },
              ].map((item, i, arr) => (
                <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={item.checked} style={{ accentColor: "var(--au-crimson)" }} />
                  <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                </label>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-primary btn-block" disabled={docs.length === 0} onClick={approve}>
                  <Icon name="CheckCircle" size={14} /> Approve &amp; Send to Finance
                </button>
                <button className="btn btn-secondary btn-block" onClick={returnToResearcher}>
                  <Icon name="Repeat" size={14} /> Return for Revision
                </button>
                <button className="btn btn-danger btn-block" onClick={reject}>
                  <Icon name="X" size={14} /> Reject Application
                </button>
              </div>
              {docs.length === 0 && <div className="text-sm text-muted mt-3">Upload at least one PDF before approving this application.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* RASSC — Reviewer Pool */
/* IRAS — AU-R3 Verification Detail */
function IRASr3Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader status="iras_review" applicationId={applicationId}
      title="AU-R3 Verification" desc="Verify the Dean-approved paper presentation request, then forward it to Finance."
      render={(app, load) => {
        const docs = app.documents || [];
        const ci = app.conference_info || {};
        const budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
        const requested = Number(app.requested_amount || 0);
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;
        const forward = () => setConfirm({
          kind: "success", title: "Approve & forward to Finance?",
          message: app.code + " will be marked IRAS-approved and forwarded to the Finance Office for payment.",
          confirmLabel: "Approve & Forward", withReason: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "iras_review", "advance", reason); toast(app.code + " approved — forwarded to Finance."); navigate("i-dashboard"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({ kind: "danger", title: "Return for revision?", message: app.code + " will be returned to the researcher.", confirmLabel: "Return", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "return", reason); toast(app.code + " returned."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        const rej = () => setConfirm({ kind: "danger", title: "Reject application?", message: app.code + " will be rejected. This ends the request.", confirmLabel: "Reject", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "reject", reason); toast(app.code + " rejected."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        return (
          <>
            <PageHeader title={"AU-R3 Verification — " + app.code} desc={(app.researcher ? app.researcher.full_name : "Researcher") + " · " + (app.faculty || "") + " · " + (ci.confName || "")} actions={<Badge status={r3Badge(app.status)} />} />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Conference</h3></div><div className="card-body">
                  {row("Conference", ci.confName)}{row("Organizer", ci.organizer)}{row("Type", ci.confType)}{row("Location", (ci.city || "-") + ", " + (ci.country || "-"))}
                  {row("Dates", (ci.confStart ? window.DB.fmtDate(ci.confStart) : "-") + " – " + (ci.confEnd ? window.DB.fmtDate(ci.confEnd) : "-"))}{row("Presentation", ci.presentation)}
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Paper</h3></div><div className="card-body">
                  {row("Paper title", app.title)}{row("Field", app.field)}{row("Corresponding author", ci.correspondingAuthor)}
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Budget</h3><div className="grow"></div><span className="text-sm text-muted">{fmtBaht(requested)} / 50,000 THB</span></div>
                  <div className="card-body" style={{ padding: 0 }}>{budgetRows.length > 0 && <table className="tbl"><tbody>{budgetRows.map((b, i) => <tr key={i}><td>{b.item}</td><td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(b.amount || 0))}</td></tr>)}</tbody></table>}</div>
                </div>
                <div className="card card-pad-0"><div className="card-head"><h3>Documents</h3></div><div>
                  {docs.length === 0 && <Empty title="No documents" desc="No files forwarded." icon="FileText" />}
                  {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                </div></div>
              </div>
              <div className="card card-pad-0" style={{ alignSelf: "start" }}><div className="card-head"><h3>IRAS Decision</h3></div><div className="card-body">
                <p className="text-sm text-muted mb-4">Confirm the conference, paper, documents, and budget are eligible, then forward to Finance for payment.</p>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to Finance</button>
                  <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                  <button className="btn btn-danger btn-block" onClick={rej}><Icon name="X" size={14} /> Reject Application</button>
                </div>
              </div></div>
            </div>
          </>
        );
      }} />
  );
}

/* IRAS — AU-R4 Verification Detail (enters the Final Approved Amount) */
function IRASr4Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [finalAmt, setFinalAmt] = useState("");
  return (
    <LiveAppLoader status="iras_review" applicationId={applicationId}
      title="AU-R4 Verification" desc="Verify eligibility, confirm the final eligible amount, then forward to Finance."
      render={(app, load) => {
        const pi = app.pub_info || {};
        const authors = Array.isArray(app.co_members) ? app.co_members : [];
        const requested = Number(app.requested_amount || 0);
        const MAX = 80000;
        // Blank input defaults to the requested claim when forwarding.
        const finalNum = finalAmt === "" ? requested : (Number(finalAmt) || 0);
        const overMax = finalNum > MAX;
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;
        const docs = app.documents || [];
        const forward = () => {
          if (finalNum <= 0) { toast("Enter the final eligible amount first."); return; }
          if (overMax) { toast("Final amount cannot exceed 80,000 THB."); return; }
          setConfirm({
            kind: "success", title: "Approve & forward to Finance?",
            message: app.code + " will be approved at " + fmtBaht(finalNum) + " and forwarded to the Finance Office for payment.",
            confirmLabel: "Confirm & Forward to Finance", withReason: true, reasonRequired: true,
            onConfirm: async (reason) => {
              try {
                await window.DB.setApprovedAmount(app.id, finalNum);
                await window.DB.transition(app.id, "iras_review", "advance", "Final eligible amount confirmed at " + fmtBaht(finalNum) + ". " + (reason || ""));
                toast(app.code + " approved at " + fmtBaht(finalNum) + " — forwarded to Finance.");
                navigate("i-dashboard");
              } catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
            },
          });
        };
        const ret = () => setConfirm({ kind: "danger", title: "Return for revision?", message: app.code + " will be returned to the researcher.", confirmLabel: "Return", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "return", reason); toast(app.code + " returned."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        const rej = () => setConfirm({ kind: "danger", title: "Reject application?", message: app.code + " will be rejected. This ends the claim.", confirmLabel: "Reject", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "reject", reason); toast(app.code + " rejected."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        return (
          <>
            <PageHeader title={"AU-R4 Verification — " + app.code} desc={(app.researcher ? app.researcher.full_name : "Researcher") + " · " + (pi.journal || "") + " · " + (pi.indexLabel || "")} actions={<Badge status={r4Badge(app.status)} />} />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Publication &amp; Journal</h3></div><div className="card-body">
                  {row("Article", app.title)}{row("Journal", pi.journal)}{row("Publisher", pi.publisher)}{row("Database / index", pi.journalDb)}{pi.quartile && row("Quartile", pi.quartile)}{pi.wosIndex && row("WoS index", pi.wosIndex)}{row("Open access", pi.openAccess)}{row("Hybrid", pi.hybrid)}{pi.doi && row("DOI", pi.doi)}
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Authors &amp; Eligibility</h3></div><div className="card-body" style={{ padding: 0 }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>{row("Applicant role", pi.applicantRole)}{row("Student-based", pi.studentBased)}</div>
                  <table className="tbl"><thead><tr><th>Author</th><th>Type</th><th style={{ textAlign: "right" }}>%</th></tr></thead><tbody>
                    {authors.map((a, i) => <tr key={i}><td>{a.name}</td><td style={{ fontSize: 12 }}>{a.type}</td><td style={{ textAlign: "right" }}>{a.contribution || 0}%</td></tr>)}
                  </tbody></table>
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Fee &amp; Turnitin</h3></div><div className="card-body">
                  {row("Claim type", pi.claimType)}{row("Fee paid", fmtBaht(Number(pi.feePaid || 0)))}{row("Receipt no.", pi.receiptNo)}{row("Preliminary reward", pi.prelimReward ? fmtBaht(Number(pi.prelimReward)) : "Actual fee")}{row("Requested claim", fmtBaht(requested))}{row("Turnitin", (pi.turnitin != null ? pi.turnitin + "%" : "-"))}
                </div></div>
                <div className="card card-pad-0"><div className="card-head"><h3>Documents</h3></div><div>
                  {docs.length === 0 && <Empty title="No documents" desc="No files forwarded." icon="FileText" />}
                  {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                </div></div>
              </div>
              <div className="card card-pad-0" style={{ alignSelf: "start" }}><div className="card-head"><h3>Final Eligible Amount</h3></div><div className="card-body">
                <p className="text-sm text-muted mb-4">Set the final eligible amount from the verified journal category, then forward to Finance. Maximum 80,000 THB per article.</p>
                <div className="field"><label>Final Approved Amount (THB)</label>
                  <input value={finalAmt === "" ? "" : Number(finalAmt || 0).toLocaleString()} onChange={e => setFinalAmt((e.target.value + "").replace(/[^0-9]/g, ""))}
                    placeholder={Number(requested || 0).toLocaleString()}
                    style={overMax ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)", fontWeight: 600 } : null} />
                  {overMax && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Cannot exceed 80,000 THB.</div>}
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>Leave blank to approve the full requested claim.</div>
                </div>
                <div className="meta-row"><span className="l">Preliminary reward</span><span className="r">{pi.prelimReward ? fmtBaht(Number(pi.prelimReward)) : "—"}</span></div>
                <div className="meta-row"><span className="l">Requested claim</span><span className="r">{fmtBaht(requested)}</span></div>
                <div className="flex flex-col gap-2 mt-4">
                  <button className="btn btn-primary btn-block" disabled={overMax || finalNum <= 0} onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to Finance</button>
                  <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                  <button className="btn btn-danger btn-block" onClick={rej}><Icon name="X" size={14} /> Reject Application</button>
                </div>
              </div></div>
            </div>
          </>
        );
      }} />
  );
}

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
        title="Vice President's Dashboard"
        desc="Review proposals and issue grant contracts."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("p-queue")}>
            <Icon name="FileSignature" size={14} /> Open Contract Queue
          </button>
        }
      />

      <div className="stats">
        <Stat label="Awaiting Contract"        value={n("president_review")} icon="FileSignature" tone="gold" />
        <Stat label="Active Grants"            value={n("active")} icon="FileSignature" tone="navy" />
        <Stat label="Approved (system)"        value={n("_approved")} icon="CheckCircle" tone="green" />
        <Stat label="Completed"                value={n("completed")} icon="Coins" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Contract Queue</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("p-queue")}>
              Open queue <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th style={{textAlign: "right"}}>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {queueRows === null && <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--ink-3)" }}>Loading...</td></tr>}
              {queueRows && queueRows.length === 0 && <tr><td colSpan="4"><Empty title="No applications awaiting a contract" desc="Completed expert reviews will appear here." icon="FileSignature" /></td></tr>}
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
              {approvedRows && approvedRows.length === 0 && <Empty title="No recent contracts" desc="Grants with issued contracts will appear here." icon="FileSignature" />}
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
    title: approved ? "Issue and sign contract?" : "Reject this application?",
    message: approved
      ? app.code + " will have a grant contract issued and move to contract tracking."
      : "Rejection by the Vice President is final.",
    confirmLabel: approved ? "Issue Contract" : "Reject",
    onConfirm: async () => {
      try {
        await window.DB.presidentDecision(app.id, approved, conditions);
        toast(app.code + (approved ? " contract issued. Ready for signing." : " rejected."));
        afterDecision();
      } catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });

  return (
    <>
      <PageHeader
        title={"Issue Contract - " + app.code}
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
          <div className="card-head"><h3>Vice President Decision</h3></div>
          <div className="card-body">
            <div className="field">
              <label>Contract conditions</label>
              <textarea className="comment-input" value={conditions} onChange={e => setConditions(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary btn-block" onClick={() => decide(true)}><Icon name="FileSignature" size={14} /> Issue Contract &amp; Sign</button>
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
      <PageHeader title="Contract Queue" desc="Open a proposal to check the file and expert scores, then issue the grant contract." />
      <div className="card card-pad-0">
        {(rows === null || loadingDetail) && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading…</div>}
        {rows !== null && !loadingDetail && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>}
        {rows !== null && !loadingDetail && rows.length > 0 && <QueueTable rows={rows} openLabel="Review →" onOpen={open} onDownload={onDownload} />}
      </div>
    </>
  );
}

/* -----------------------------------------------------------
   OFM / FINANCE — AU-R3 / AU-R4 single-payment queue
   ----------------------------------------------------------- */
function OFMGrantPayments({ sys, toast, setConfirm }) {
  const isR4 = sys === "au_r4";
  const [rows, setRows] = useState(null);
  const load = () => {
    Promise.all([window.DB.queue("approved", sys), window.DB.queue("active", sys)])
      .then(([a, b]) => setRows((a || []).concat(b || [])))
      .catch(() => setRows([]));
  };
  useEffect(() => { setRows(null); load(); }, [sys]);
  const pay = (a) => setConfirm({
    kind: "success", title: "Record payment as paid?",
    message: a.id + " will be marked as paid (" + fmtBaht(Number(a.approved_amount || a.requested_amount || 0)) + ").",
    confirmLabel: "Mark as Paid", withReason: true,
    onConfirm: async (reason) => {
      try { await window.DB.transition(a._uuid, "approved", "advance", "Payment processed. " + (reason || "")); toast(a.id + " marked as paid."); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });
  const complete = (a) => setConfirm({
    kind: "success", title: "Mark application completed?",
    message: a.id + " will be marked completed.",
    confirmLabel: "Complete", withReason: true,
    onConfirm: async (reason) => {
      try { await window.DB.transition(a._uuid, "active", "advance", reason); toast(a.id + " completed."); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });
  return (
    <div className="card card-pad-0">
      <div className="card-head"><h3>{isR4 ? "AU-R4" : "AU-R3"} Payment Queue</h3></div>
      <table className="tbl">
        <thead><tr><th>Application ID</th><th>{isR4 ? "Article" : "Paper"}</th><th>Researcher</th><th style={{ textAlign: "right" }}>Approved Amount</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
        <tbody>
          {rows === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "28px", color: "var(--ink-3)" }}>Loading…</td></tr>}
          {rows && rows.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "36px", color: "var(--ink-3)" }}>No {isR4 ? "AU-R4" : "AU-R3"} payments waiting.</td></tr>}
          {(rows || []).map(a => (
            <tr key={a.id}>
              <td><span className="id">{a.id}</span></td>
              <td className="title-cell"><div className="t" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
              <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
              <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(a.approved_amount || a.requested_amount || 0))}</td>
              <td><Badge status={a.statusKey === "active" ? { key: "active", cls: "badge-progress", label: "Payment Processing" } : { key: "approved", cls: "badge-contract", label: "Approved for Payment" }} /></td>
              <td className="actions">
                {a.statusKey === "approved" && <button className="btn btn-primary btn-sm" onClick={() => pay(a)}>Mark as Paid</button>}
                {a.statusKey === "active" && <button className="btn btn-secondary btn-sm" onClick={() => complete(a)}>Complete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -----------------------------------------------------------
   OFM / FINANCE — Dashboard
   ----------------------------------------------------------- */
function OFMDashboard({ navigate, toast, setConfirm }) {
  const [sys, setSys] = useState("au_r1");
  const isR3 = sys === "au_r3", isR4 = sys === "au_r4";
  const [gc, setGc] = useState(null);
  useEffect(() => { if (sys !== "au_r1") window.DB.statusCounts(sys).then(setGc).catch(() => setGc({})); }, [sys]);
  const gn = (k) => (gc ? (gc[k] || 0) : "…");
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r1", label: "AU-R1" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => setSys(t.id)} style={{ padding: "7px 15px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
  if (isR3 || isR4) {
    return (
      <>
        <PageHeader title={(isR4 ? "AU-R4" : "AU-R3") + " · Finance Dashboard"}
          desc={"Process payments for IRAS-approved " + (isR4 ? "publication fee and reward" : "paper presentation grant") + " applications."}
          actions={sysToggle} />
        <div className="stats">
          <Stat label="At Finance"      value={gn("approved")} icon="Clock" tone="gold" />
          <Stat label="Processing"      value={gn("active")} icon="TrendingUp" tone="green" />
          <Stat label="Completed"       value={gn("completed")} icon="CheckCircle" tone="navy" />
          <Stat label="Total"           value={(gc ? (gc.approved || 0) + (gc.active || 0) + (gc.completed || 0) : "…")} icon="Coins" />
        </div>
        <OFMGrantPayments sys={sys} toast={toast} setConfirm={setConfirm} />
      </>
    );
  }
  return <OFMDashboardR1 navigate={navigate} sysToggle={sysToggle} />;
}

function OFMDashboardR1({ navigate, sysToggle }) {
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
          <>
            {sysToggle}
            <button className="btn btn-primary" onClick={() => navigate("o-payments")}>
              <Icon name="Coins" size={14} /> Open Payment Queue
            </button>
          </>
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
    confirmLabel: "Mark as Paid", withReason: true, reasonLabel: "Payment note / reference",
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
const ADMIN_R4_ROLES = ["researcher", "dean", "iras", "ofm", "admin"];
function AdminDashboard({ navigate }) {
  const [sys, setSys] = useState("all");
  const isR4 = sys === "au_r4";
  const [c, setC] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [events, setEvents] = useState(null);
  useEffect(() => {
    setC(null);
    window.DB.statusCounts(sys === "all" ? undefined : sys).then(setC).catch(() => setC({}));
  }, [sys]);
  useEffect(() => {
    window.DB.allProfiles().then(setProfiles).catch(() => setProfiles([]));
    window.DB.auditEvents().then(setEvents).catch(() => setEvents([]));
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const totalUsers = profiles ? profiles.length : 0;
  const codePrefix = sys === "au_r4" ? "AU-R4-" : sys === "au_r3" ? "AU-R3-" : sys === "au_r1" ? "RG-" : null;
  const evFiltered = events === null ? null : (codePrefix ? events.filter(e => e.application && (e.application.code || "").indexOf(codePrefix) === 0) : events);
  const roleList = isR4 ? D.ROLES.filter(r => ADMIN_R4_ROLES.indexOf(r.key) >= 0) : D.ROLES;
  const roleRows = profiles === null ? null : roleList.map(r => ({ key: r.key, name: r.key === "iras" && isR4 ? "IRAS" : r.name, count: profiles.filter(p => p.role === r.key).length })).filter(r => r.count > 0);
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "all", label: "All" }, { id: "au_r1", label: "AU-R1" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => setSys(t.id)} style={{ padding: "7px 13px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader
        title={isR4 ? "AU-R4 · Administrator Dashboard" : "Administrator Dashboard"}
        desc={isR4 ? "AU-R4 publication fee and reward statistics, activity, roles, and reference data." : "Users, activity, and reference data for the AU-RGMS portal."}
        actions={
          <>
            {sysToggle}
            <button className="btn btn-primary" onClick={() => navigate("a-users")}>
              <Icon name="UserPlus" size={14} /> Manage Users
            </button>
          </>
        }
      />

      {isR4 ? (
        <div className="stats">
          <Stat label="Total Users"        value={profiles ? totalUsers : "…"} icon="Users" tone="gold" />
          <Stat label="AU-R4 Applications" value={n("_total")} icon="Award" tone="navy" />
          <Stat label="Under Review"       value={(c ? (c.submitted || 0) + (c.iras_review || 0) + (c.approved || 0) : "…")} icon="FileSearch" tone="gold" />
          <Stat label="Paid / Completed"   value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
        </div>
      ) : (
        <div className="stats">
          <Stat label="Total Users"          value={profiles ? totalUsers : "…"} icon="Users" tone="gold" />
          <Stat label="Applications"         value={n("_total")} icon="Folder" tone="navy" />
          <Stat label="Approved Grants"      value={n("_approved")} icon="CheckCircle" tone="green" />
          <Stat label="Active Grants"        value={n("active")} icon="TrendingUp" tone="green" />
        </div>
      )}

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Users by Role</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("a-users")}>Manage <Icon name="ArrowRight" size={12} /></button>
          </div>
          <div className="card-body">
            {roleRows === null && <div className="text-sm text-muted">Loading…</div>}
            {roleRows && roleRows.length === 0 && <Empty title="No users yet" desc="Create accounts in User Management." icon="Users" />}
            {(roleRows || []).map(r => (
              <div key={r.key} style={{ marginBottom: 12 }}>
                <div className="flex justify-between mb-2" style={{ fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span className="text-muted">{r.count} user{r.count !== 1 ? "s" : ""}</span>
                </div>
                <div className="progress" style={{ height: 5 }}><div className="bar" style={{ width: (totalUsers ? Math.round(r.count / totalUsers * 100) : 0) + "%" }}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Recent Activity</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("a-audit")}>See all <Icon name="ArrowRight" size={12} /></button>
          </div>
          <div style={{ padding: "8px 0" }}>
            {evFiltered === null && <div style={{ padding: 20, color: "var(--ink-3)", fontSize: 13 }}>Loading activity…</div>}
            {evFiltered && evFiltered.length === 0 && <Empty title="No activity yet" desc={isR4 ? "AU-R4 workflow actions will appear here." : "Workflow actions will appear here."} icon="Clock" />}
            {(evFiltered || []).slice(0, 6).map((e, i, arr) => (
              <div key={e.id || i} style={{ padding: "10px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none", display: "flex", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--paper-warm)", color: "var(--ink-2)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="Clock" size={12} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--ink-1)" }}>{e.action}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{(e.actor ? e.actor.full_name : (e.actor_role || "System"))}{e.application ? " · " + e.application.code : ""} · {window.DB.fmtDate(e.created_at)}</div>
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
const ADMIN_ROLE_OPTIONS = [
  { key: "researcher", label: "Researcher" }, { key: "dean", label: "Dean" },
  { key: "committee", label: "Faculty Committee" }, { key: "iras", label: "RASSC" },
  { key: "ofm", label: "OFM / Finance" }, { key: "admin", label: "Administrator" },
];

function AdminAddUserForm({ onCreated, onClose, toast }) {
  const blank = { name_title: "", full_name: "", email: "", au_id: "", role: "dean", faculty: "", department: "", password: "AuResearch#2026" };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => Object.assign({}, s, k === "faculty" ? { faculty: v, department: "" } : { [k]: v }));
  const needsFaculty = f.role === "dean" || f.role === "committee";
  const depts = (D.FACULTIES.find(x => x.name === f.faculty) || { departments: [] }).departments;
  const submit = async () => {
    if (!f.full_name.trim()) return toast("Enter the full name.");
    if (!/^[^@\s]+@au\.edu$/i.test(f.email.trim())) return toast("Email must end in @au.edu.");
    if (needsFaculty && !f.faculty) return toast("Pick a faculty for a Dean/Committee account.");
    if ((f.password || "").length < 8) return toast("Temp password must be at least 8 characters.");
    setBusy(true);
    try {
      await window.DB.adminCreateUser(f);
      toast(f.full_name + " created as " + f.role + (f.faculty ? " (" + f.faculty + ")" : "") + ".");
      onCreated();
    } catch (e) { toast("Error: " + ((e && e.message) || e)); }
    finally { setBusy(false); }
  };
  return (
    <div className="card card-pad-0 mb-4" style={{ border: "1px solid var(--au-crimson-soft)" }}>
      <div className="card-head"><h3>Add User</h3><div className="grow"></div><button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="X" size={14} /></button></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field"><label>Title</label>
            <select value={f.name_title} onChange={e => set("name_title", e.target.value)}><option value="">—</option>{D.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <div className="field"><label>Full Name</label><input value={f.full_name} onChange={e => set("full_name", e.target.value)} placeholder="e.g. Tanachai Suksawat" /></div>
          <div className="field"><label>AU ID</label><input value={f.au_id} onChange={e => set("au_id", e.target.value)} placeholder="e.g. 5012345" /></div>
          <div className="field"><label>Email (AU only)</label><input type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="name@au.edu" /></div>
          <div className="field"><label>Role</label>
            <select value={f.role} onChange={e => set("role", e.target.value)}>{ADMIN_ROLE_OPTIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
          </div>
          <div className="field"><label>Faculty {needsFaculty ? "(required)" : "(optional)"}</label>
            <select value={f.faculty} onChange={e => set("faculty", e.target.value)}><option value="">Select faculty…</option>{D.FACULTIES.map(x => <option key={x.code} value={x.name}>{x.name}</option>)}</select>
          </div>
          <div className="field"><label>Department</label>
            <select value={f.department} onChange={e => set("department", e.target.value)} disabled={!f.faculty}><option value="">{f.faculty ? "Select department…" : "Pick a faculty first"}</option>{depts.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div className="field"><label>Temporary password</label><input value={f.password} onChange={e => set("password", e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy} onClick={submit}><Icon name="UserPlus" size={14} /> {busy ? "Creating…" : "Create Account"}</button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ toast }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [adding, setAdding] = useState(false);
  const load = () => window.DB.allProfiles().then(setUsers).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);
  const filtered = (users || []).filter(u => !search || (u.full_name + u.email + u.role + (u.department || "")).toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <PageHeader title="User Management" desc="Create and manage AU-RGMS accounts, roles, faculty scope, and grant-module access." actions={<button className="btn btn-primary" onClick={() => setAdding(a => !a)}><Icon name="Plus" size={14} /> Add User</button>} />
      {adding && <AdminAddUserForm toast={toast} onClose={() => setAdding(false)} onCreated={() => { setAdding(false); load(); }} />}
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search"><Icon name="Search" size={14} className="icon" /><input placeholder="Search by name, email, role..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button className="filter active"><Icon name="Filter" size={12} /> All roles</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Profile export is based on live Supabase profiles.")}><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Faculty / Department</th><th>Grant Access</th><th>Status</th><th>Created</th><th style={{textAlign: "right"}}>Actions</th></tr></thead>
          <tbody>
            {users === null && <tr><td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading users...</td></tr>}
            {users && filtered.length === 0 && <tr><td colSpan="8"><Empty title="No users found" desc="Try another search." icon="Users" /></td></tr>}
            {filtered.map(u => {
              const grantAccess = (u.role === "committee" || u.role === "expert") ? "AU-R1" : "All Grants";
              return (
              <tr key={u.id}>
                <td><div style={{display: "flex", alignItems: "center", gap: 8}}><Avatar initials={(u.full_name || "U").split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()} size={28} color="var(--au-navy)" /><div><div style={{fontSize: 13, fontWeight: 600}}>{u.full_name}</div><div style={{fontSize: 11, color: "var(--ink-3)"}} className="id">{String(u.id).slice(0, 8)}</div></div></div></td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{u.email}</td>
                <td><span className="badge badge-academic" style={{fontSize: 10}}><span className="dot"></span>{u.role}</span></td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{(u.faculty ? u.faculty + (u.department ? " · " + u.department : "") : (u.department || "-"))}</td>
                <td><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: "var(--au-crimson)", background: "var(--au-crimson-soft)" }}>{grantAccess}</span></td>
                <td><span className={"badge " + (u.is_active === false ? "badge-draft" : "badge-check")}><span className="dot"></span>{u.is_active === false ? "Inactive" : "Active"}</span></td>
                <td style={{fontSize: 11, color: "var(--ink-3)"}}>{window.DB.fmtDate(u.created_at)}</td>
                <td className="actions"><button className="btn btn-ghost btn-sm" onClick={() => toast(u.full_name + " is stored in Supabase profiles.")}><Icon name="Info" size={13} /></button></td>
              </tr>
            ); })}
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

// Universal account/profile settings — available to every role via the header gear.
function AccountSettings({ toast }) {
  const SPLIT_DEFAULT = { remuneration: 30, equipment: 40, travel: 18, misc: 12 };
  const SPLIT_FIELDS = [
    { key: "remuneration", label: "Remuneration (research assistant)" },
    { key: "equipment", label: "Research equipment" },
    { key: "travel", label: "Travel / data collection" },
    { key: "misc", label: "Miscellaneous" },
  ];
  const [p, setP] = useState(null);
  const [f, setF] = useState({ name_title: "", full_name: "", au_id: "", phone: "" });
  const [split, setSplit] = useState(SPLIT_DEFAULT);
  const [caps, setCaps] = useState(D.DEFAULT_BUDGET_CAPS || { remuneration: 30, equipment: 50, travel: 40, misc: 20 });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    window.DB.budgetCaps().then(setCaps).catch(() => {});
    window.AUTH.profile().then(pr => {
      setP(pr);
      if (pr) {
        setF({ name_title: pr.name_title || "", full_name: pr.full_name || "", au_id: pr.au_id || "", phone: pr.phone || "" });
        if (pr.budget_split) setSplit(Object.assign({}, SPLIT_DEFAULT, pr.budget_split));
      }
    }).catch(() => {});
  }, []);
  const set = (k, v) => setF(s => Object.assign({}, s, { [k]: v }));
  const setSplitVal = (k, v) => setSplit(s => ({ ...s, [k]: Math.max(0, Math.min(100, parseInt((v + "").replace(/[^0-9]/g, ""), 10) || 0)) }));
  const isResearcher = p && p.role === "researcher";
  const splitSum = split.remuneration + split.equipment + split.travel + split.misc;
  const overCap = SPLIT_FIELDS.find(fd => split[fd.key] > caps[fd.key]);
  const save = async () => {
    if (isResearcher && splitSum !== 100) { toast("Your budget split must total 100% (currently " + splitSum + "%)."); return; }
    if (isResearcher && overCap) { toast(overCap.label + " exceeds the AU cap of " + caps[overCap.key] + "%."); return; }
    setBusy(true);
    try {
      const patch = Object.assign({}, f);
      if (isResearcher) patch.budget_split = split;
      await window.DB.updateMyProfile(patch);
      toast("Your profile has been updated.");
    }
    catch (e) { toast("Error: " + ((e && e.message) || e)); }
    finally { setBusy(false); }
  };
  const roleLabel = (D.ROLES.find(r => r.key === (p && p.role)) || {}).name || (p && p.role) || "—";
  return (
    <>
      <PageHeader title="Account Settings" desc="Update your personal details. Email, role and faculty are managed by the administrator." actions={<button className="btn btn-primary" disabled={busy || !p} onClick={save}>{busy ? "Saving…" : "Save Changes"}</button>} />
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>My Details</h3></div>
          <div className="card-body">
            {!p && <div className="text-sm text-muted">Loading…</div>}
            {p && <>
              <div className="form-grid">
                <div className="field"><label>Title</label><select value={f.name_title} onChange={e => set("name_title", e.target.value)}><option value="">—</option>{D.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="field"><label>Full Name</label><input value={f.full_name} onChange={e => set("full_name", e.target.value)} /></div>
                <div className="field"><label>AU ID</label><input value={f.au_id} onChange={e => set("au_id", e.target.value)} placeholder="e.g. 5012345" /></div>
                <div className="field"><label>Phone</label><input value={f.phone} onChange={e => set("phone", e.target.value)} /></div>
              </div>
            </>}
          </div>
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Account</h3></div>
          <div className="card-body">
            <div className="meta-row"><span className="l">Email</span><span className="r">{p ? p.email : "—"}</span></div>
            <div className="meta-row"><span className="l">Role</span><span className="r">{roleLabel}</span></div>
            <div className="meta-row"><span className="l">Faculty</span><span className="r">{(p && p.faculty) || "—"}</span></div>
            <div className="meta-row"><span className="l">Department</span><span className="r">{(p && p.department) || "—"}</span></div>
            <div className="text-sm text-muted" style={{ marginTop: 12 }}>To change your email, role, or faculty, contact the RASSC administrator.</div>
          </div>
        </div>
      </div>
      {isResearcher && (
        <div className="card card-pad-0 mt-4">
          <div className="card-head"><h3>My Default Budget Split</h3>
            <div className="grow"></div>
            <span className="text-sm" style={{ color: splitSum === 100 ? "var(--ink-3)" : "var(--au-crimson)" }}>Total {splitSum}%{splitSum !== 100 ? " (must be 100%)" : ""}</span>
          </div>
          <div className="card-body" style={{ paddingBottom: 4 }}>
            <p className="text-sm text-muted" style={{ marginTop: 0 }}>These percentages pre-fill the budget breakdown on your submit form when you enter a total. They must add up to 100% and stay within each AU cap.</p>
          </div>
          <div>
            {SPLIT_FIELDS.map((fd, i) => (
              <div key={fd.key} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderTop: "1px solid var(--line-2)" }}>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{fd.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input value={split[fd.key]} onChange={e => setSplitVal(fd.key, e.target.value)} style={{ width: 74, padding: "6px 10px", border: "1px solid " + (split[fd.key] > caps[fd.key] ? "var(--au-crimson)" : "var(--line)"), borderRadius: "var(--r-sm)", textAlign: "right", fontWeight: 600, color: split[fd.key] > caps[fd.key] ? "var(--au-crimson)" : "inherit" }} />
                  <span className="text-sm text-muted">% &nbsp;(cap ≤ {caps[fd.key]}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function AdminSettings({ toast }) {
  const POLICY_FIELDS = [
    { key: "grant_limit", label: "Maximum internal grant amount", unit: "THB" },
    { key: "contract_days", label: "Days to sign contract after approval", unit: "days" },
    { key: "tranche_1", label: "First tranche", unit: "%" },
    { key: "tranche_2", label: "Second tranche", unit: "%" },
    { key: "tranche_3", label: "Final tranche", unit: "%" },
  ];
  const POLICY_DEFAULT = { grant_limit: 100000, contract_days: 45, tranche_1: 30, tranche_2: 40, tranche_3: 30 };
  const CAP_FIELDS = [
    { key: "remuneration", label: "Remuneration (research assistant)" },
    { key: "equipment", label: "Research equipment" },
    { key: "travel", label: "Travel / data collection" },
    { key: "misc", label: "Miscellaneous" },
  ];
  const [caps, setCaps] = useState(D.DEFAULT_BUDGET_CAPS || { remuneration: 30, equipment: 50, travel: 40, misc: 20 });
  const [policy, setPolicy] = useState(POLICY_DEFAULT);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    window.DB.budgetCaps().then(setCaps).catch(() => {});
    window.DB.getSetting("workflow_policy", POLICY_DEFAULT).then(v => setPolicy(Object.assign({}, POLICY_DEFAULT, v && v.values ? v.values : v))).catch(() => {});
  }, []);
  const setCap = (k, v) => setCaps(c => ({ ...c, [k]: Math.max(0, Math.min(100, parseInt((v + "").replace(/[^0-9]/g, ""), 10) || 0)) }));
  const setPol = (k, v) => setPolicy(p => ({ ...p, [k]: parseInt((v + "").replace(/[^0-9]/g, ""), 10) || 0 }));
  const trancheSum = Number(policy.tranche_1) + Number(policy.tranche_2) + Number(policy.tranche_3);
  const save = async () => {
    if (trancheSum !== 100) { toast("The three payment tranches must add up to 100% (currently " + trancheSum + "%)."); return; }
    setBusy(true);
    try {
      await window.DB.saveSetting("budget_caps", caps, "Budget category caps (% of total grant)");
      await window.DB.saveSetting("workflow_policy", { values: policy }, "Workflow policy");
      toast("Settings saved.");
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
        <div className="card-head"><h3>Workflow Policy</h3>{trancheSum !== 100 && <span className="text-sm" style={{ color: "var(--au-crimson)", marginLeft: 10 }}>Tranches = {trancheSum}% (must be 100%)</span>}</div>
        <div>
          {POLICY_FIELDS.map((it, i) => (
            <div key={it.key} style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: i < POLICY_FIELDS.length - 1 ? "1px solid var(--line-2)" : "none" }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{it.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input value={policy[it.key]} onChange={e => setPol(it.key, e.target.value)} style={{ width: 90, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", textAlign: "right", fontWeight: 600 }} />
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
  DeanDashboard, DeanScreenQueue, DeanSignQueue, DeanHistory, DeanR3Queue, DeanR4Queue,
  CommitteeDashboard, CommitteeQueue, CommitteeHistory,
  RASSCDashboardV2, RASSCScreen, RASSCReviewerPool, IRASr3Detail, IRASr4Detail,
  ExpertDashboard, ExpertAssignments, ExpertHistory,
  PresidentDashboard, PresidentQueue,
  OFMDashboard, OFMDetail, OFMHistory,
  AdminDashboard, AdminUsers, AdminJournals, AdminAudit, AdminSettings,
  AnalyticsDashboard, AccountSettings,
});
