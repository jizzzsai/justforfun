



const D = window.AU;

function initialsFromName(name, fallback = "U") {
  const text = (name || fallback || "U").trim();
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 2 && /^\d+$/.test(parts[1])) return (parts[0][0] + parts[1]).toUpperCase();
  return (parts.length ? parts : [fallback]).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}




function QueueTable({ rows, openLabel = "Review", onOpen, columns = "full", showGrant = false }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Application ID</th>
          {showGrant && <th>Grant</th>}
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
            {showGrant && <td><span className="badge badge-draft">{a.grant_type === "au_r4" ? "AU-R4" : "AU-R3"}</span></td>}
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




function DeanDashboard({ navigate, setSelectedApplicationId }) {
  const [sys, setSys] = useState("au_r3");
  const isR4 = sys === "au_r4";
  const [c, setC] = useState(null);
  const [screenRows, setScreenRows] = useState(null);
  useEffect(() => {
    setC(null); setScreenRows(null);
    window.DB.statusCounts(sys).then(setC).catch(() => setC({}));
    window.DB.queue("submitted", sys).then(setScreenRows).catch(() => setScreenRows([]));
  }, [sys]);
  const n = (k) => (c ? (c[k] || 0) : "…");
  const openQueue = () => navigate(isR4 ? "d-r4-screen" : "d-r3-screen");
  const rowPage = isR4 ? "d-r4-detail" : "d-r3-detail";
  const openApplication = (application) => {
    if (setSelectedApplicationId) setSelectedApplicationId(application._uuid);
    navigate(rowPage);
  };
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
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
        title={isR4 ? "AU-R4 · Dean Summary" : "AU-R3 · Dean Summary"}
        actions={
          <>
            {sysToggle}
            <button className="btn btn-primary" onClick={openQueue}>
              <Icon name="Inbox" size={14} /> {isR4 ? "Open AU-R4 Review Queue" : "Open AU-R3 Review Queue"}
            </button>
          </>
        }
      />

      {isR4 ? (
        <div className="stats">
          <Stat label="Pending Dean Review"    value={n("submitted")} icon="ClipboardCheck" tone="gold" />
          <Stat label="Awaiting IRAS Verification" value={n("iras_review")} icon="Send" tone="navy" />
          <Stat label="At Finance"              value={n("approved")} icon="Coins" />
          <Stat label="Paid / Completed" value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
        </div>
      ) : (
        <div className="stats">
          <Stat label="Pending Dean Review" value={n("submitted")} icon="ClipboardCheck" tone="gold" />
          <Stat label="Forwarded to IRAS"   value={n("iras_review")} icon="Send" tone="navy" />
          <Stat label="At Finance"          value={n("approved")} icon="Coins" />
          <Stat label="Paid / Completed" value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
        </div>
      )}

      <div className="card card-pad-0">
        <div className="card-head">
          <h3>{isR4 ? "AU-R4 · Dean Review Queue" : "AU-R3 · Dean Review Queue"}</h3>
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
              <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => openApplication(a)}>
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
        title="AU-R3 · Dean Review Queue"
        desc="Paper presentation grant requests from your faculty awaiting Dean review before IRAS."
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




function DeanR4Queue({ navigate, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  useEffect(() => { window.DB.queue("submitted", "au_r4").then(setRows).catch(() => setRows([])); }, []);
  const open = (row) => { if (setSelectedApplicationId) setSelectedApplicationId(row._uuid); navigate("d-r4-detail"); };
  const filtered = (rows || []).filter(a => {
    if (!q.trim()) return true;
    const pi = a.conference_info;
    const hay = [a.id, a.title, a.researcher && a.researcher.name, a.department].join(" ").toLowerCase();
    return hay.indexOf(q.toLowerCase()) >= 0;
  });
  return (
    <>
      <PageHeader title="AU-R4 · Dean Review Queue" desc="Review submitted publication fee and reward applications from your faculty." />
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




function DeanHistory({ navigate, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { window.DB.byStatuses(["submitted", "iras_review", "approved", "active", "completed", "rejected", "returned"]).then(setRows).catch(() => setRows([])); }, []);
  const openTimeline = row => {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-history-detail");
  };
  return (
    <>
      <PageHeader title="Decision History" desc="Read-only Dean decisions for AU-R3 and AU-R4 applications." />
      <div className="card card-pad-0">
        {rows && rows.length === 0
          ? <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>No decisions yet.</div>
          : <QueueTable rows={rows || []} openLabel="View Timeline" onOpen={openTimeline} showGrant />}
      </div>
    </>
  );
}




function DeanDecisionTimeline({ applicationId, navigate }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!applicationId) { setLoading(false); return; }
    window.DB.applicationDetail(applicationId)
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const backButton = (
    <button className="btn btn-secondary" onClick={() => navigate("d-history")}>
      <Icon name="ArrowLeft" size={14} /> Decision History
    </button>
  );

  if (loading) {
    return <><PageHeader title="Dean Decision Timeline" desc="Loading the recorded Dean activity." actions={backButton} /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading timeline...</div></>;
  }
  if (!app) {
    return <><PageHeader title="Dean Decision Timeline" desc="Select an application from Decision History." actions={backButton} /><div className="card"><Empty title="No application selected" desc="Return to Decision History and choose View Timeline." icon="Clock" /></div></>;
  }

  const grantLabel = app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  return (
    <>
      <PageHeader
        title={"Dean Decision Timeline - " + (app.code || "Application")}
        desc="Read-only record of actions completed by the Dean."
        actions={backButton}
      />

      <div className="card card-pad-0 mb-4">
        <div className="card-head">
          <h3>Application</h3>
          <div className="grow"></div>
          <span className="badge badge-draft">{grantLabel}</span>
          <Badge status={app.statusBadge || window.DB.statusBadge(app.status)} />
        </div>
        <div className="card-body">
          <div className="meta-row"><span className="l">Research title</span><span className="r">{app.title || "-"}</span></div>
          <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher?.full_name || "-"}</span></div>
          <div className="meta-row"><span className="l">Faculty / Department</span><span className="r">{[app.faculty, app.department].filter(Boolean).join(" / ") || "-"}</span></div>
          <div className="meta-row"><span className="l">Submitted</span><span className="r">{window.DB.fmtDate(app.submitted_at || app.created_at)}</span></div>
        </div>
      </div>

      <div className="card card-pad-0">
        <div className="card-head">
          <h3>Complete Application Activity</h3>
          <div className="grow"></div>
          <span className="text-sm text-muted"><Icon name="Lock" size={12} /> Read-only</span>
        </div>
        <div className="card-body">
          <ApplicationEventTimeline app={app} />
        </div>
      </div>
    </>
  );
}




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
        <Stat label="Paid / Completed"  value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
      </div>
      <div className="card card-pad-0">
        <div className="card-head"><h3>{isR4 ? "AU-R4" : "AU-R3"} Verification Queue</h3></div>
        <table className="tbl">
          <thead><tr><th>Application ID</th><th>{isR4 ? "Article" : "Paper"} Title</th><th>{isR4 ? "Journal / Category" : "Conference"}</th><th>Researcher</th><th style={{ textAlign: "right" }}>Requested</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "28px", color: "var(--ink-3)" }}>Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "36px", color: "var(--ink-3)" }}>No {isR4 ? "Dean-approved AU-R4" : "Dean-approved AU-R3"} applications waiting.</td></tr>}
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

function IRASDashboard({ navigate, setSelectedApplicationId, grantType = "au_r3", onGrantSwitch }) {
  const sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  const isR4 = sys === "au_r4";
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => onGrantSwitch && onGrantSwitch(t.id, "i-dashboard")} style={{ padding: "7px 15px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader
        title={(isR4 ? "AU-R4" : "AU-R3") + " · IRAS Summary"}
        desc={isR4
          ? "Verify Dean-approved AU-R4 publication-fee applications before forwarding eligible claims to Finance."
          : "Verify Dean-approved paper presentation applications before forwarding them to Finance."}
        actions={sysToggle}
      />
      <IRASGrantDashboard navigate={navigate} setSelectedApplicationId={setSelectedApplicationId} sys={sys} />
    </>
  );
}


function IRASr3Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader status="iras_review" applicationId={applicationId}
      title="AU-R3 Verification" desc="Verify the Dean-approved paper presentation request, then forward it to Finance."
      render={(app, load) => {
        const docs = app.documents || [];
        const ci = app.conference_info || {};
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;
        const forward = () => setConfirm({
          kind: "success", title: "Approve & forward to Finance?",
          message: app.code + " will be marked IRAS-approved and forwarded to the Finance Office for payment.",
          confirmLabel: "Approve & Forward", withReason: true, reasonLabel: "IRAS comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "iras_review", "advance", reason); toast(app.code + " approved — forwarded to Finance."); navigate("i-dashboard"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({ kind: "danger", title: "Return for revision?", message: app.code + " will be returned to the researcher.", confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "IRAS comment", finalConfirm: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "return", reason); toast(app.code + " returned."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        const reject = () => setConfirm({ kind: "danger", title: "Reject application?", message: app.code + " will be rejected. This is a final decision and will close the application.", confirmLabel: "Reject Application", withReason: true, reasonRequired: true, reasonLabel: "IRAS rejection reason", finalConfirm: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "reject", reason); toast(app.code + " rejected."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); load(); } } });
        return (
          <>
            <PageHeader title={"AU-R3 Verification — " + app.code} desc={(ci.researcherName || (app.researcher ? app.researcher.full_name : "Researcher")) + " · " + (app.faculty || "") + " · " + (ci.confName || "")} actions={<Badge status={r3Badge(app.status)} />} />
            <div className="mb-4"><AnnualFundingSummaryCard summary={app.annual_funding} currentAmount={Number(app.requested_amount || 3500)} compact /></div>
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Conference</h3></div><div className="card-body">
                  {row("Conference", ci.confName)}{row("Organizer", ci.organizer)}{row("Type", ci.confType)}
                  {row("Conference location", ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", "))}
                  {row("Presentation date", (ci.presentationDate || ci.confStart) ? window.DB.fmtDate(ci.presentationDate || ci.confStart) : "-")}{row("Presentation", ci.presentation)}
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Paper</h3></div><div className="card-body">
                  {row("Paper title", app.title)}{row("Field", app.field)}
                  {row("Applicant author type", ci.authorType || "Lead Author")}
                  {(app.co_members || []).map((author, index) => <div className="meta-row" key={index}><span className="l">{"Additional author " + (index + 1) + " · " + (author.authorType || "Co-author")}</span><span className="r">{author.name + (author.kind ? " · " + author.kind : "")}</span></div>)}
                  {row("Abstract", ci.paperAbstract)}{row("Keywords", app.keywords)}
                  <ResearcherServiceEligibilityRows app={app} />
                  <ReviewCommentHistory app={app} roles={["dean"]} />
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Conference Qualities</h3></div>
                  <div className="card-body">{row("Conference Database / Index", ci.journalDb)}{row("Qualities", ci.journalClassification)}{row("Fixed AU-R3 grant", fmtBaht(3500))}</div>
                </div>
                <div className="card card-pad-0"><div className="card-head"><h3>Documents</h3></div><div>
                  {docs.length === 0 && <Empty title="No documents" desc="No files forwarded." icon="FileText" />}
                  {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                </div></div>
              </div>
              <div className="card card-pad-0" style={{ alignSelf: "start" }}><div className="card-head"><h3>IRAS Decision</h3></div><div className="card-body">
                <p className="text-sm text-muted mb-4">Confirm the conference, paper, conference qualities, three required documents, and fixed 3,500 THB grant are eligible, then forward to Finance for payment.</p>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to Finance</button>
                  <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                  <button className="btn btn-danger btn-block" onClick={reject}><Icon name="X" size={14} /> Reject Application</button>
                </div>
              </div></div>
            </div>
          </>
        );
      }} />
  );
}


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
            confirmLabel: "Confirm & Forward to Finance", withReason: true, reasonRequired: true, reasonLabel: "IRAS comment",
            onConfirm: async (reason) => {
              try {
                await window.DB.setApprovedAmount(app.id, finalNum);
                await window.DB.transition(app.id, "iras_review", "advance", reason || "");
                toast(app.code + " approved at " + fmtBaht(finalNum) + " — forwarded to Finance.");
                navigate("i-dashboard");
              } catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
            },
          });
        };
        const ret = () => setConfirm({ kind: "danger", title: "Return for revision?", message: app.code + " will be returned to the researcher.", confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "IRAS comment", finalConfirm: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "return", reason); toast(app.code + " returned."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); } } });
        const reject = () => setConfirm({ kind: "danger", title: "Reject application?", message: app.code + " will be rejected. This is a final decision and will close the application.", confirmLabel: "Reject Application", withReason: true, reasonRequired: true, reasonLabel: "IRAS rejection reason", finalConfirm: true,
          onConfirm: async (reason) => { try { await window.DB.transition(app.id, "iras_review", "reject", reason); toast(app.code + " rejected."); navigate("i-dashboard"); } catch (e) { toast("Error: " + ((e && e.message) || e)); load(); } } });
        return (
          <>
            <PageHeader title={"AU-R4 Verification — " + app.code} desc={(app.researcher ? app.researcher.full_name : "Researcher") + " · " + (pi.journal || "") + " · " + (pi.indexLabel || "")} actions={<Badge status={r4Badge(app.status)} />} />
            <div className="mb-4"><AnnualFundingSummaryCard summary={app.annual_funding} currentAmount={finalNum} compact /></div>
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Publication &amp; Journal</h3></div><div className="card-body">
                  {row("Article", app.title)}{row("Publication status", pi.pubStatus)}{row("Journal", pi.journal)}{row("Publisher", pi.publisher)}{pi.pubStatus === "Published" && <>{row("Article URL", pi.articleUrl)}{row("DOI", pi.doi)}{row("ISSN / eISSN", pi.issn)}{row("Page number(s)", pi.pageNumber || [pi.startPage, pi.endPage].filter(Boolean).join("–"))}</>}{row("Database / index", pi.journalDb)}{row("Qualities", pi.journalClassification || pi.openAccess)}{row("Academic year (AD)", pi.academicYear)}{row("Publication fee", fmtBaht(Number(pi.feePaid || 0)))}
                  <ReviewCommentHistory app={app} roles={["dean"]} />
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Authors &amp; Eligibility</h3></div><div className="card-body" style={{ padding: 0 }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>{row("Applicant role", pi.applicantRole)}</div>
                  <div style={{ padding: "0 20px 12px" }}><ResearcherServiceEligibilityRows app={app} /></div>
                  <table className="tbl"><thead><tr><th>Author</th><th>Role</th><th>Email</th><th style={{ textAlign: "right" }}>%</th></tr></thead><tbody>
                    {authors.map((a, i) => <tr key={i}><td>{a.name}</td><td style={{ fontSize: 12 }}>{a.type}</td><td style={{ fontSize: 12 }}>{a.email || "—"}</td><td style={{ textAlign: "right" }}>{a.contribution || 0}%</td></tr>)}
                  </tbody></table>
                </div></div>
                <div className="card card-pad-0 mb-4"><div className="card-head"><h3>Publication Fee &amp; Turnitin</h3></div><div className="card-body">
                  {row("Publication fee", fmtBaht(Number(pi.feePaid || 0)))}{row("Requested amount", fmtBaht(requested))}{row("Turnitin", (pi.turnitin != null ? pi.turnitin + "%" : "-"))}
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
                <div className="meta-row"><span className="l">Publication fee</span><span className="r">{fmtBaht(Number(pi.feePaid || 0))}</span></div>
                <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(requested)}</span></div>
                <div className="flex flex-col gap-2 mt-4">
                  <button className="btn btn-primary btn-block" disabled={overMax || finalNum <= 0} onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to Finance</button>
                  <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                  <button className="btn btn-danger btn-block" onClick={reject}><Icon name="X" size={14} /> Reject Application</button>
                </div>
              </div></div>
            </div>
          </>
        );
      }} />
  );
}

function OFMGrantPayments({ sys, toast, setConfirm, onDownload, onView }) {
  const isR4 = sys === "au_r4";
  const [rows, setRows] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const load = () => {
    window.DB.grantPaymentQueue(sys).then(setRows).catch(() => setRows([]));
  };
  useEffect(() => { setRows(null); load(); }, [sys]);
  const complete = (a) => setConfirm({
    kind: "success", title: "Confirm payment completion?",
    message: a.id + " will be recorded as completed (" + fmtBaht(Number(a.approved_amount || a.requested_amount || 0)) + "). This closes the Finance workflow.",
    confirmLabel: "Continue", finalConfirm: true, reasonLabel: "Payment confirmation",
    onConfirm: async () => {
      try { await window.DB.completeSingleGrant(a._uuid); toast(a.id + " completed."); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });
  return (
    <>
      <div className="card card-pad-0">
        <div className="card-head"><h3>{isR4 ? "AU-R4" : "AU-R3"} Payment Queue</h3><div className="grow"></div><span className="text-sm text-muted">Select an application to review its information and files.</span></div>
        <table className="tbl">
        <thead><tr><th>Application ID</th><th>{isR4 ? "Article" : "Paper"}</th><th>Researcher</th><th style={{ textAlign: "right" }}>Approved Amount</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
        <tbody>
          {rows === null && <tr><td colSpan="6" style={{ textAlign: "center", padding: "28px", color: "var(--ink-3)" }}>Loading…</td></tr>}
          {rows && rows.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "36px", color: "var(--ink-3)" }}>No {isR4 ? "AU-R4" : "AU-R3"} payments waiting.</td></tr>}
          {(rows || []).map(a => (
            <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => setSelectedId(a._uuid)}>
              <td><span className="id">{a.id}</span></td>
              <td className="title-cell"><div className="t" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
              <td style={{ fontSize: 12 }}>{a.researcher?.name}</td>
              <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(a.approved_amount || a.requested_amount || 0))}</td>
              <td><Badge status={a.statusKey === "completed" ? { key: "completed", cls: "badge-check", label: "Completed" } : { key: "approved", cls: "badge-contract", label: "At Finance" }} /></td>
              <td className="actions">
                <div className="flex justify-end gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setSelectedId(a._uuid); }}><Icon name="Eye" size={12} /> View</button>
                  {(a.statusKey === "approved" || a.statusKey === "active") && <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); complete(a); }}><Icon name="CheckCircle" size={12} /> Complete</button>}
                  {a.statusKey === "completed" && <span className="text-sm text-muted" style={{ alignSelf: "center" }}>Completed</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <FinanceApplicationDetailsModal applicationId={selectedId} onClose={() => setSelectedId(null)} onDownload={onDownload} onView={onView} />
    </>
  );
}




function FinanceGrantTabs({ sys, onChange }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ padding: "7px 15px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
}

function FinanceApplicationDetailsModal({ applicationId, onClose, onDownload, onView }) {
  const [app, setApp] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!applicationId) return;
    setApp(null); setError("");
    window.DB.financeApplicationDetail(applicationId).then(setApp).catch(e => setError((e && e.message) || "Could not load application details."));
  }, [applicationId]);
  const grantLabel = app => app && app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  return (
    <Modal open={!!applicationId} onClose={onClose} title={app ? grantLabel(app) + " · " + app.code : "Application Details"} className="finance-detail-modal"
      footer={<button className="btn btn-secondary" onClick={onClose}>Close</button>}>
      {!app && !error && <div style={{ padding: "16px 0", textAlign: "center", color: "var(--ink-3)" }}>Loading application details…</div>}
      {error && <div style={{ color: "var(--au-crimson)", lineHeight: 1.55 }}>{error}</div>}
      {app && <>
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow mb-2">{grantLabel(app)} Application</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 21, lineHeight: 1.25 }}>{app.title || "Untitled application"}</div>
          <div style={{ marginTop: 8 }}><Badge status={app.statusBadge || window.DB.statusBadge(app.status, app.grant_type)} /></div>
        </div>
        <div className="meta-row"><span className="l">Application ID</span><span className="r">{app.code || "-"}</span></div>
        <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher?.full_name || "-"}</span></div>
        <div className="meta-row"><span className="l">Faculty / Department</span><span className="r">{[app.faculty, app.department].filter(Boolean).join(" / ") || "-"}</span></div>
        <div className="meta-row"><span className="l">Submitted</span><span className="r">{window.DB.fmtDate(app.submitted_at || app.created_at)}</span></div>
        <div className="meta-row"><span className="l">Approved amount</span><span className="r">{fmtBaht(Number(app.approved_amount || app.requested_amount || 0))}</span></div>
        <div className="meta-row"><span className="l">Disbursed</span><span className="r">{fmtBaht(["active", "completed"].includes(app.status) ? Number(app.approved_amount || app.requested_amount || 0) : 0)}</span></div>
        <div style={{ marginTop: 14 }}><AnnualFundingSummaryCard summary={app.annual_funding} currentAmount={Number(app.approved_amount != null ? app.approved_amount : app.requested_amount || 0)} compact /></div>
        <div style={{ borderTop: "1px solid var(--line-2)", marginTop: 14, paddingTop: 12 }}>
          <div className="eyebrow mb-2">Files</div>
          {(app.documents || []).length === 0 && <div className="text-sm text-muted">No files attached to this application.</div>}
          {(app.documents || []).map(doc => <FileRow key={doc.id} doc={doc} onDownload={onDownload} onView={onView} />)}
        </div>
      </>}
    </Modal>
  );
}

function OFMTotalSummary({ onDownload, onView }) {
  const [apps, setApps] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => { window.DB.financeSummaryApplications().then(setApps).catch(() => setApps([])); }, []);
  const rows = (apps || []).filter(app => filter === "all" || app.grant_type === filter);
  const grantLabel = app => app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  const summaryApps = apps || [];
  const allocated = summaryApps.reduce((sum, app) => sum + Number(app.approved_amount || app.requested_amount || 0), 0);
  const disbursed = summaryApps.filter(app => ["active", "completed"].includes(app.status)).reduce((sum, app) => sum + Number(app.approved_amount || app.requested_amount || 0), 0);
  const summary = [
    { label: "Total Allocated", value: apps === null ? "…" : fmtBaht(allocated), icon: "Coins" },
    { label: "Disbursed", value: apps === null ? "…" : fmtBaht(disbursed), icon: "TrendingUp", tone: "green" },
    { label: "Active Grants", value: apps === null ? "…" : summaryApps.filter(app => ["approved", "active"].includes(app.status)).length, icon: "Briefcase", tone: "navy" },
  ];
  return (
    <>
      <PageHeader title="Total Summary" desc="Today’s finance summary for AU-R3 and AU-R4 applications forwarded to Finance." />
      <div className="stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {summary.map(item => <Stat key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.tone} />)}
      </div>
      <div className="card card-pad-0">
        <div className="card-head">
          <h3>Applications Forwarded to Finance</h3><div className="grow"></div>
          <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
            {[{ id: "all", label: "All" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{ padding: "7px 12px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: filter === tab.id ? "var(--au-crimson)" : "transparent", color: filter === tab.id ? "#fff" : "var(--ink-2)" }}>{tab.label}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr><th>Application</th><th>Researcher</th><th>Grant</th><th>Submitted</th><th style={{ textAlign: "right" }}>Amount</th><th>Status</th><th style={{ textAlign: "right" }}>Details</th></tr></thead>
            <tbody>
              {apps === null && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading applications…</td></tr>}
              {apps && rows.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>No applications have reached Finance in this view.</td></tr>}
              {rows.map(app => (
                <tr key={app.id} style={{ cursor: "pointer" }} onClick={() => setSelectedId(app.id)}>
                  <td><div className="id">{app.code || "-"}</div><div style={{ fontSize: 12, fontWeight: 600, marginTop: 3, maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.title || "Untitled application"}</div></td>
                  <td style={{ fontSize: 12 }}>{app.researcher?.full_name || "-"}</td>
                  <td><span className="badge badge-submitted"><span className="dot"></span>{grantLabel(app)}</span></td>
                  <td style={{ fontSize: 12 }}>{window.DB.fmtDate(app.submitted_at || app.created_at)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{fmtBaht(Number(app.approved_amount || app.requested_amount || 0))}</td>
                  <td><Badge status={app.statusBadge || window.DB.statusBadge(app.status, app.grant_type)} /></td>
                  <td className="actions"><button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setSelectedId(app.id); }}><Icon name="Eye" size={13} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FinanceApplicationDetailsModal applicationId={selectedId} onClose={() => setSelectedId(null)} onDownload={onDownload} onView={onView} />
    </>
  );
}

function OFMDashboard({ navigate, toast, setConfirm, grantType, onGrantSwitch, onDownload, onView }) {
  const sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  const isR3 = sys === "au_r3", isR4 = sys === "au_r4";
  const [gc, setGc] = useState(null);
  useEffect(() => {
    setGc(null);
    window.DB.statusCounts(sys).then(setGc).catch(() => setGc({}));
  }, [sys]);
  const gn = (k) => (gc ? (gc[k] || 0) : "…");
  const sysToggle = <FinanceGrantTabs sys={sys} onChange={next => onGrantSwitch(next, "o-dashboard")} />;
  return (
    <>
      <PageHeader title={(isR4 ? "AU-R4" : "AU-R3") + " · Finance Summary"}
        desc={"Process payments for IRAS-approved " + (isR4 ? "publication fee and reward" : "paper presentation grant") + " applications."}
        actions={sysToggle} />
      <div className="stats">
        <Stat label="At Finance" value={gc ? (gc.approved || 0) + (gc.active || 0) : "…"} icon="Clock" tone="gold" />
        <Stat label="Completed" value={gn("completed")} icon="CheckCircle" tone="navy" />
        <Stat label="Total" value={(gc ? (gc.approved || 0) + (gc.active || 0) + (gc.completed || 0) : "…")} icon="Coins" />
      </div>
      <OFMGrantPayments sys={sys} toast={toast} setConfirm={setConfirm} onDownload={onDownload} onView={onView} />
    </>
  );
}

function OFMHistory({ grantType, onGrantSwitch }) {
  const sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  const [rows, setRows] = useState(null);
  useEffect(() => {
    setRows(null);
    window.DB.financePaymentHistory(sys).then(setRows).catch(() => setRows([]));
  }, [sys]);
  const label = sys.replace("au_r", "AU-R").toUpperCase();
  return (
    <>
      <PageHeader title={label + " · Payment History"} desc={"Only completed " + label + " Finance transactions are shown."} actions={
        <FinanceGrantTabs sys={sys} onChange={next => onGrantSwitch(next, "o-history")} />
      } />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead><tr><th>Payment Date</th><th>Grant</th><th>Application</th><th>Researcher</th><th>Payment</th><th style={{textAlign: "right"}}>Amount</th><th>Reference</th><th style={{textAlign: "right"}}>Status</th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "var(--ink-3)" }}>No {label} payments processed yet.</td></tr>}
            {(rows || []).map(r => (
              <tr key={r.key}>
                <td style={{fontSize: 12}}>{window.DB.fmtDate(r.paid_at)}</td>
                <td><span className="badge badge-submitted"><span className="dot"></span>{String(r.grant_type || "au_r3").replace("au_r", "AU-R").toUpperCase()}</span></td>
                <td><span className="id">{r.code}</span></td>
                <td style={{fontSize: 12}}>{r.researcher}</td>
                <td style={{fontSize: 12}}>{r.payment_label}</td>
                <td style={{textAlign: "right", fontWeight: 600}}>{r.amount.toLocaleString()} THB</td>
                <td><span className="id" style={{fontSize: 12}}>{r.reference}</span></td>
                <td className="actions"><span className={"badge " + (r.status === "completed" ? "badge-check" : "badge-paid")}><span className="dot"></span>{r.status === "completed" ? "Completed" : "Paid"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}




const ADMIN_ACTIVE_ROLES = ["researcher", "dean", "iras", "ofm", "admin"];
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
  const codePrefix = sys === "au_r4" ? "AU-R4-" : sys === "au_r3" ? "AU-R3-" : null;
  const evFiltered = events === null ? null : (codePrefix ? events.filter(e => e.application && (e.application.code || "").indexOf(codePrefix) === 0) : events);
  const roleList = D.ROLES.filter(r => ADMIN_ACTIVE_ROLES.indexOf(r.key) >= 0);
  const roleRows = profiles === null ? null : roleList.map(r => ({ key: r.key, name: r.name, count: profiles.filter(p => p.role === r.key).length })).filter(r => r.count > 0);
  const sysToggle = (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", marginRight: 8 }}>
      {[{ id: "all", label: "All" }, { id: "au_r3", label: "AU-R3" }, { id: "au_r4", label: "AU-R4" }].map(t => (
        <button key={t.id} onClick={() => setSys(t.id)} style={{ padding: "7px 13px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: sys === t.id ? "var(--au-crimson)" : "transparent", color: sys === t.id ? "#fff" : "var(--ink-2)" }}>{t.label}</button>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader
        title={isR4 ? "AU-R4 · Administrator Dashboard" : "Administrator Dashboard"}
        desc={isR4 ? "AU-R4 publication fee and reward statistics, activity, and user roles." : "Users and workflow activity for the AU-RGMS portal."}
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
          <Stat label="Paid / Completed" value={(c ? (c.active || 0) + (c.completed || 0) : "…")} icon="CheckCircle" tone="green" />
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



const ADMIN_ROLE_OPTIONS = [
  { key: "researcher", label: "Researcher" }, { key: "dean", label: "Dean" },
  { key: "iras", label: "IRAS (AU-R3 / AU-R4)" },
  { key: "ofm", label: "OFM / Finance" }, { key: "admin", label: "Administrator" },
];

function AdminAddUserForm({ onCreated, onClose, toast }) {
  const blank = { name_title: "", full_name: "", email: "", au_id: "", phone: "", office_room: "", joined_date: "", role: "dean", faculty: "", department: "", password: "" };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => Object.assign({}, s, k === "faculty" ? { faculty: v, department: "" } : { [k]: v }));
  const needsFaculty = f.role === "dean";
  const depts = (D.FACULTIES.find(x => x.name === f.faculty) || { departments: [] }).departments;
  const submit = async () => {
    if (!f.full_name.trim()) return toast("Enter the full name.");
    if (!/^[^@\s]+@au\.edu$/i.test(f.email.trim())) return toast("Email must end in @au.edu.");
    if (f.phone && !isValidThaiPhone(f.phone)) return toast("Phone must be a Thai number with 9–10 digits starting with 0.");
    if (needsFaculty && !f.faculty) return toast("Pick a faculty for a Dean account.");
    if ((f.password || "").length < 8) return toast("Temporary password must be at least 8 characters.");
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
          <div className="field"><label>Phone</label><ThaiPhoneInput value={f.phone} onChange={value => set("phone", value)} /></div>
          <div className="field"><label>Office / Room</label><input value={f.office_room} onChange={e => set("office_room", e.target.value)} placeholder="e.g. Building A, Room 512" /></div>
          <div className="field"><label>Date Joined Assumption University</label><AUDatePicker value={f.joined_date} onChange={value => set("joined_date", value)} min="1969-01-01" max={new Date().toISOString().slice(0, 10)} placeholder="Select joined date…" /></div>
          <div className="field"><label>Role</label>
            <select value={f.role} onChange={e => set("role", e.target.value)}>{ADMIN_ROLE_OPTIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
          </div>
          <div className="field"><label>Faculty {needsFaculty ? "(required)" : "(optional)"}</label>
            <select value={f.faculty} onChange={e => set("faculty", e.target.value)}><option value="">Select faculty…</option>{D.FACULTIES.map(x => <option key={x.code} value={x.name}>{x.name}</option>)}</select>
          </div>
          <div className="field"><label>Department</label>
            <select value={f.department} onChange={e => set("department", e.target.value)} disabled={!f.faculty}><option value="">{f.faculty ? "Select department…" : "Pick a faculty first"}</option>{depts.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div className="field"><label>Temporary password</label><input type="password" autoComplete="new-password" value={f.password} onChange={e => set("password", e.target.value)} placeholder="At least 8 characters" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy} onClick={submit}><Icon name="UserPlus" size={14} /> {busy ? "Creating…" : "Create Account"}</button>
        </div>
      </div>
    </div>
  );
}

function AdminEditUserForm({ user, onSaved, onClose, toast }) {
  const [f, setF] = useState({
    id: user.id,
    name_title: user.name_title || "",
    full_name: user.full_name || "",
    email: user.email || "",
    au_id: user.au_id || "",
    phone: normalizeThaiPhone(user.phone),
    office_room: user.office_room || "",
    joined_date: user.joined_date || "",
    role: user.role || "researcher",
    faculty: user.faculty || "",
    department: user.department || "",
    password: "",
    is_active: user.is_active !== false,
  });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => Object.assign({}, s, k === "faculty" ? { faculty: v, department: "" } : { [k]: v }));
  const needsFaculty = f.role === "dean";
  const depts = (D.FACULTIES.find(x => x.name === f.faculty) || { departments: [] }).departments;
  const submit = async () => {
    if (!f.full_name.trim()) return toast("Enter the full name.");
    if (!/^[^@\s]+@au\.edu$/i.test(f.email.trim())) return toast("Email must end in @au.edu.");
    if (f.phone && !isValidThaiPhone(f.phone)) return toast("Phone must be a Thai number with 9–10 digits starting with 0.");
    if (needsFaculty && !f.faculty) return toast("Pick a faculty for a Dean account.");
    if (f.password && f.password.length < 8) return toast("A new password must be at least 8 characters.");
    setBusy(true);
    try {
      await window.DB.adminUpdateUser(f);
      toast(f.full_name + " updated.");
      onSaved();
    } catch (e) { toast("Error: " + ((e && e.message) || e)); }
    finally { setBusy(false); }
  };
  return (
    <div className="card card-pad-0 mb-4" style={{ border: "1px solid var(--au-crimson-soft)" }}>
      <div className="card-head"><h3>Edit User</h3><div className="grow"></div><button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close edit user"><Icon name="X" size={14} /></button></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field"><label>Title</label>
            <select value={f.name_title} onChange={e => set("name_title", e.target.value)}><option value="">—</option>{D.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <div className="field"><label>Full Name</label><input value={f.full_name} onChange={e => set("full_name", e.target.value)} /></div>
          <div className="field"><label>AU ID</label><input value={f.au_id} onChange={e => set("au_id", e.target.value)} /></div>
          <div className="field"><label>Phone</label><ThaiPhoneInput value={f.phone} onChange={value => set("phone", value)} /></div>
          <div className="field"><label>Office / Room</label><input value={f.office_room} onChange={e => set("office_room", e.target.value)} placeholder="e.g. Building A, Room 512" /></div>
          <div className="field"><label>Email (AU only)</label><input type="email" value={f.email} onChange={e => set("email", e.target.value)} /></div>
          <div className="field"><label>Date Joined Assumption University</label><AUDatePicker value={f.joined_date} onChange={value => set("joined_date", value)} min="1969-01-01" max={new Date().toISOString().slice(0, 10)} placeholder="Select joined date…" /></div>
          <div className="field"><label>Role</label>
            <select value={f.role} onChange={e => set("role", e.target.value)}>{ADMIN_ROLE_OPTIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
          </div>
          <div className="field"><label>Status</label>
            <select value={f.is_active ? "active" : "inactive"} onChange={e => set("is_active", e.target.value === "active")}><option value="active">Active</option><option value="inactive">Inactive</option></select>
          </div>
          <div className="field"><label>Faculty {needsFaculty ? "(required)" : "(optional)"}</label>
            <select value={f.faculty} onChange={e => set("faculty", e.target.value)}><option value="">Select faculty…</option>{D.FACULTIES.map(x => <option key={x.code} value={x.name}>{x.name}</option>)}</select>
          </div>
          <div className="field"><label>Department</label>
            <select value={f.department} onChange={e => set("department", e.target.value)} disabled={!f.faculty}><option value="">{f.faculty ? "Select department…" : "Pick a faculty first"}</option>{depts.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <div className="field"><label>New password (optional)</label><input type="password" autoComplete="new-password" value={f.password} onChange={e => set("password", e.target.value)} placeholder="Leave blank to keep the current password" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy} onClick={submit}><Icon name="Save" size={14} /> {busy ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ toast, setConfirm, profile }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const load = () => window.DB.allProfiles().then(setUsers).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);
  const filtered = (users || []).filter(u => !search || (u.full_name + u.email + u.role + (u.department || "")).toLowerCase().includes(search.toLowerCase()));
  const editUser = (u) => { setAdding(false); setEditing(u); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const deleteUser = (u) => {
    if (profile && u.id === profile.id) return toast("You cannot delete the account you are currently using.");
    const runDelete = async () => {
      try {
        await window.DB.adminDeleteUser(u.id);
        if (editing && editing.id === u.id) setEditing(null);
        toast(u.full_name + " deleted.");
        load();
      } catch (e) { toast("Error: " + ((e && e.message) || e)); }
    };
    if (setConfirm) setConfirm({
      kind: "danger",
      title: "Delete user account?",
      message: u.full_name + " (" + u.email + ") will lose access and be removed from User Management. Applications owned by this account will also be permanently removed; historical reviewer/uploader references will be preserved without the user identity. This cannot be undone.",
      confirmLabel: "Delete User",
      onConfirm: runDelete,
    });
  };
  return (
    <>
      <PageHeader title="User Management" desc="Create, edit, and delete AU-RGMS accounts, roles, faculty scope, and grant-module access." actions={<button className="btn btn-primary" onClick={() => { setEditing(null); setAdding(a => !a); }}><Icon name="Plus" size={14} /> Add User</button>} />
      {adding && <AdminAddUserForm toast={toast} onClose={() => setAdding(false)} onCreated={() => { setAdding(false); load(); }} />}
      {editing && <AdminEditUserForm key={editing.id} user={editing} toast={toast} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
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
              const grantAccess = u.role === "iras" ? "AU-R3 / AU-R4" : "AU-R3 / AU-R4";
              return (
              <tr key={u.id}>
                <td><div style={{display: "flex", alignItems: "center", gap: 8}}><Avatar initials={(u.full_name || "U").split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()} size={28} color="var(--au-navy)" /><div><div style={{fontSize: 13, fontWeight: 600}}>{u.full_name}</div><div style={{fontSize: 11, color: "var(--ink-3)"}} className="id">{String(u.id).slice(0, 8)}</div></div></div></td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{u.email}</td>
                <td><span className="badge badge-academic" style={{fontSize: 10}}><span className="dot"></span>{u.role}</span></td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{(u.faculty ? u.faculty + (u.department ? " · " + u.department : "") : (u.department || "-"))}</td>
                <td><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: "var(--au-crimson)", background: "var(--au-crimson-soft)" }}>{grantAccess}</span></td>
                <td><span className={"badge " + (u.is_active === false ? "badge-draft" : "badge-check")}><span className="dot"></span>{u.is_active === false ? "Inactive" : "Active"}</span></td>
                <td style={{fontSize: 11, color: "var(--ink-3)"}}>{window.DB.fmtDate(u.created_at)}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" aria-label={"Edit " + u.full_name} title="Edit user" onClick={() => editUser(u)}><Icon name="Edit" size={13} /></button>
                  <button className="btn btn-ghost btn-sm" aria-label={"Delete " + u.full_name} title={profile && u.id === profile.id ? "Current account cannot be deleted" : "Delete user"} disabled={profile && u.id === profile.id} onClick={() => deleteUser(u)}><Icon name="Trash" size={13} /></button>
                </td>
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
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    window.AUTH.profile().then(pr => {
      setP(pr);
      if (pr) {
        setF({ name_title: pr.name_title || "", full_name: pr.full_name || "", au_id: pr.au_id || "", phone: normalizeThaiPhone(pr.phone) });
        if (pr.budget_split) setSplit(Object.assign({}, SPLIT_DEFAULT, pr.budget_split));
      }
    }).catch(() => {});
  }, []);
  const set = (k, v) => setF(s => Object.assign({}, s, { [k]: v }));
  const isResearcher = p && p.role === "researcher";
  const isAdmin = p && p.role === "admin";
  const splitSum = split.remuneration + split.equipment + split.travel + split.misc;
  const save = async () => {
    if (!isAdmin) { toast("Account information can only be changed by an administrator."); return; }
    if (f.phone && !isValidThaiPhone(f.phone)) { toast("Phone must be a Thai number with 9–10 digits starting with 0."); return; }
    setBusy(true);
    try {
      await window.DB.updateMyProfile(f);
      toast("Your profile has been updated.");
    }
    catch (e) { toast("Error: " + ((e && e.message) || e)); }
    finally { setBusy(false); }
  };
  const roleLabel = (D.ROLES.find(r => r.key === (p && p.role)) || {}).name || (p && p.role) || "—";
  return (
    <>
      <PageHeader title="Account Settings" desc={isAdmin ? "Update your administrator profile. Other user accounts are managed in User Management." : "Your account information is managed by the administrator. Contact the administrator to request any change."} actions={isAdmin ? <button className="btn btn-primary" disabled={busy || !p} onClick={save}>{busy ? "Saving…" : "Save Changes"}</button> : null} />
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>My Details</h3></div>
          <div className="card-body">
            {!p && <div className="text-sm text-muted">Loading…</div>}
            {p && isAdmin && <>
              <div className="form-grid">
                <div className="field"><label>Title</label><select value={f.name_title} onChange={e => set("name_title", e.target.value)}><option value="">—</option>{D.AU_TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="field"><label>Full Name</label><input value={f.full_name} onChange={e => set("full_name", e.target.value)} /></div>
                <div className="field"><label>AU ID</label><input value={f.au_id} onChange={e => set("au_id", e.target.value)} placeholder="e.g. 5012345" /></div>
                <div className="field"><label>Phone</label><ThaiPhoneInput value={f.phone} onChange={value => set("phone", value)} /></div>
              </div>
            </>}
            {p && !isAdmin && <>
              <div className="meta-row"><span className="l">Title</span><span className="r">{p.name_title || "—"}</span></div>
              <div className="meta-row"><span className="l">Full Name</span><span className="r">{p.full_name || "—"}</span></div>
              <div className="meta-row"><span className="l">AU ID</span><span className="r">{p.au_id || "—"}</span></div>
              <div className="meta-row"><span className="l">Phone</span><span className="r">{p.phone || "—"}</span></div>
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
            <div className="meta-row"><span className="l">Password</span><span className="r">Managed by administrator</span></div>
            <div className="text-sm text-muted" style={{ marginTop: 12 }}>{isAdmin ? "Use User Management to change account email, role, faculty, status, or password." : "To change your username, password, or any account information, contact the AU-RGMS administrator."}</div>
          </div>
        </div>
      </div>
      {isResearcher && (
        <div className="card card-pad-0 mt-4">
          <div className="card-head"><h3>My Default Budget Split</h3>
            <div className="grow"></div>
            <span className="text-sm text-muted">Total {splitSum}%</span>
          </div>
          <div className="card-body" style={{ paddingBottom: 4 }}>
            <p className="text-sm text-muted" style={{ marginTop: 0 }}>These values are managed by the administrator and pre-fill your application budget. Contact the administrator to request a change.</p>
          </div>
          <div>
            {SPLIT_FIELDS.map((fd, i) => (
              <div key={fd.key} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderTop: "1px solid var(--line-2)" }}>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{fd.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{split[fd.key]}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    ]).then(([counts, faculties]) => {
      if (!alive) return;
      setData({ counts, faculties });
    });
    return () => { alive = false; };
  }, [role]);
  const c = data ? data.counts : {};
  const faculties = data ? data.faculties : [];
  const statusRows = Object.keys(c || {})
    .filter(k => k.charAt(0) !== "_")
    .map(k => ({ label: window.DB.statusBadge(k).label, value: c[k] }))
    .sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
  const budgetRows = faculties.map(f => ({
    faculty: f.faculty,
    requested_sum: Number(f.requested_sum || 0),
    approved_sum: Number(f.approved_sum || 0),
  })).sort((a, b) => b.requested_sum - a.requested_sum);
  return (
    <>
      <PageHeader
        title="AI Analytics"
        desc="Live Supabase analytics for AU-R3 and AU-R4 applications and payments."
        actions={<>
          <Badge status={{ label: "Live data", cls: "badge-academic" }} />
          <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("au-ai-toggle"))}><Icon name="Bot" size={14} /> Ask AU AI</button>
        </>}
      />
      <div className="stats">
        <Stat label="Applications" value={data ? c._total || 0 : "..."} icon="Folder" />
        <Stat label="Under Review" value={data ? c._underReview || 0 : "..."} icon="FileSearch" tone="gold" />
        <Stat label="Approved / Active" value={data ? c._approved || 0 : "..."} icon="CheckCircle" tone="green" />
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

      <div className="mt-4">
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
      </div>
    </>
  );
}

function RoleAnalyticsDashboard({ role }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setData(null); setError("");
    window.DB.roleAnalyticsSnapshot().then(result => { if (alive) setData(result); }).catch(err => {
      if (alive) setError((err && err.message) || "Analytics could not be loaded.");
    });
    return () => { alive = false; };
  }, [role]);
  const config = {
    dean: {
      title: "Dean Analytics", desc: "Faculty-only analytics for AU-R3 and AU-R4 applications.",
      pending: "Awaiting Dean Review", groupTitle: "Top Approved Spending by Department", groupKey: "byDepartment",
    },
    iras: {
      title: "IRAS Analytics", desc: "University-wide AU-R3 and AU-R4 verification and funding analytics.",
      pending: "Awaiting IRAS Verification", groupTitle: "Top Approved Spending by Faculty", groupKey: "byFaculty",
    },
    ofm: {
      title: "Finance Analytics", desc: "University-wide analytics for applications forwarded to Finance.",
      pending: "Awaiting Payment", groupTitle: "Top Disbursement by Faculty", groupKey: "byFaculty",
    },
  }[role] || { title: "Role Analytics", desc: "Role-scoped analytics.", pending: "Pending", groupTitle: "Top Spending", groupKey: "byFaculty" };
  if (error) return <Empty title="Analytics unavailable" desc={error} icon="BarChart3" />;
  const totals = data ? data.totals : {};
  const groups = data ? (data[config.groupKey] || []) : [];
  const spendKey = role === "ofm" ? "paid" : "approved";
  return (
    <>
      <PageHeader title={config.title} desc={config.desc} actions={<Badge status={{ label: data ? data.scope : "Loading live data", cls: "badge-academic" }} />} />
      <div className="stats">
        <Stat label="Applications" value={data ? totals.applications : "…"} icon="Folder" />
        <Stat label={config.pending} value={data ? (role === "ofm" ? totals.pendingPayment : totals.pendingReview) : "…"} icon="Clock" tone="gold" />
        <Stat label={role === "ofm" ? "Disbursed" : "Approved Amount"} value={data ? fmtBaht(role === "ofm" ? totals.paid : totals.approved) : "…"} icon="Coins" tone="green" />
      </div>
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Workflow Status</h3></div>
          <AnalyticsBars rows={data ? data.byStatus : []} valueKey="value" renderValue={r => r.value + " apps"} emptyTitle="No workflow data yet" />
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>AU-R3 / AU-R4 Mix</h3></div>
          <AnalyticsBars rows={data ? data.byGrant : []} valueKey="total" renderValue={r => r.total + " apps"} emptyTitle="No grant data yet" />
        </div>
      </div>
      <div className="mt-4 grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>{config.groupTitle}</h3></div>
          <AnalyticsBars rows={groups.slice(0, 8)} valueKey={spendKey} renderValue={r => fmtBaht(r[spendKey])} emptyTitle="No spending data yet" />
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Recent Role Activity</h3></div>
          <div className="card-body" style={{ padding: 0 }}>
            {!data ? <div style={{ padding: 28, color: "var(--ink-3)" }}>Loading live records…</div> : !(data.recentApplications || []).length
              ? <div style={{ padding: 28, color: "var(--ink-3)" }}>No applications in this role scope yet.</div>
              : (data.recentApplications || []).map(app => (
                <div key={app.code} style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px 18px", borderBottom: "1px solid var(--line-2)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{app.code} · {app.title}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>{app.grant} · {role === "dean" ? app.department : app.faculty}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{app.status}</span>
                  <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", minWidth: 88, textAlign: "right" }}>{fmtBaht(app.amount)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RoleAIChatbotPage({ role }) {
  const config = {
    dean: { title: "Dean AI Chatbot", desc: "Chat with AU AI about live AU-R3 and AU-R4 data from your assigned faculty." },
    iras: { title: "IRAS AI Chatbot", desc: "Chat with AU AI about university-wide AU-R3 and AU-R4 verification data." },
    ofm: { title: "Finance AI Chatbot", desc: "Chat with AU AI about applications forwarded to Finance, payments, and disbursements." },
  }[role];
  return (
    <>
      <PageHeader title={config.title} desc={config.desc} />
      <div id="role-ai-chat-host" className="role-ai-chat-host" aria-live="polite"></div>
    </>
  );
}


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
  DeanDashboard, DeanHistory, DeanR3Queue, DeanR4Queue,
  IRASDashboard, IRASr3Detail, IRASr4Detail,
  OFMDashboard, OFMTotalSummary, OFMHistory,
  AdminDashboard, AdminUsers, AdminAudit,
  AnalyticsDashboard, RoleAnalyticsDashboard, RoleAIChatbotPage, AccountSettings,
});
