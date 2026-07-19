/* ============================================================
   Faculty / Academic Office / Dean Dashboard pages
   ============================================================ */

const FA = window.AU;

/* ---------- A. Dashboard Overview ---------- */
function FacultyDashboard({ navigate }) {
  return (
    <>
      <PageHeader
        title="Faculty Office Dashboard"
        desc="Review faculty submissions and forward eligible applications to RASSC."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="Calendar" size={14} /> AY 2025–2026</button>
            <button className="btn btn-primary" onClick={() => navigate("f-incoming")}>
              <Icon name="Inbox" size={14} /> Open Queue
            </button>
          </>
        }
      />

      <div className="stats">
        <Stat label="New Applications"            value="4" icon="Inbox"           delta="+2 this week" deltaTone="up" />
        <Stat label="Waiting Document Check"      value="3" icon="ClipboardCheck"  tone="gold" />
        <Stat label="Waiting Academic Committee"  value="2" icon="Users"           tone="navy" />
        <Stat label="Waiting Dean Approval"       value="1" icon="ShieldCheck"     tone="green" />
        <Stat label="Forwarded to RASSC"           value="9" icon="Send" />
        <Stat label="Revision Required"           value="2" icon="AlertCircle"     tone="gold" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Faculty Queue (latest)</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("f-incoming")}>
              See all <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Research Title</th><th>Researcher</th><th>Status</th></tr>
            </thead>
            <tbody>
              {FA.FACULTY_QUEUE.slice(0, 5).map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("f-checklist")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell">
                    <div className="t" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div className="s">{a.department}</div>
                  </td>
                  <td style={{fontSize: 12}}>{(a.researcher?.name) || "—"}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Throughput · This Month</h3></div>
          <div className="card-body">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8}}>
              <div>
                <div className="text-sm text-muted">Applications processed</div>
                <div style={{fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 500, lineHeight: 1}}>11</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="text-sm text-muted">Avg. cycle time</div>
                <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>6.4 days</div>
              </div>
            </div>

            {/* mini bar chart */}
            <div style={{display: "flex", alignItems: "flex-end", gap: 6, height: 100, marginTop: 16, padding: "0 4px"}}>
              {[3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 9, 11].map((v, i) => (
                <div key={i} style={{
                  flex: 1, height: `${v * 8}%`,
                  background: i === 11 ? "var(--au-crimson)" : "var(--au-crimson-soft)",
                  borderRadius: 3,
                  position: "relative",
                }}></div>
              ))}
            </div>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-3)", marginTop: 6}}>
              <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>

            <div className="mt-4" style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, paddingTop: 16, borderTop: "1px solid var(--line)"}}>
              <div>
                <div className="text-sm text-muted">Approved</div>
                <div style={{fontWeight: 600, fontSize: 18, color: "var(--status-approved)"}}>9</div>
              </div>
              <div>
                <div className="text-sm text-muted">Revisions</div>
                <div style={{fontWeight: 600, fontSize: 18, color: "var(--au-gold)"}}>2</div>
              </div>
              <div>
                <div className="text-sm text-muted">Rejected</div>
                <div style={{fontWeight: 600, fontSize: 18, color: "var(--status-rejected)"}}>1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- B. Incoming Applications ---------- */
function FacultyIncoming({ navigate, onDownload }) {
  return (
    <>
      <PageHeader
        title="Incoming Applications"
        desc="Submissions awaiting Faculty Office review, Academic Committee evaluation, or Dean approval."
      />

      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID, researcher, department…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> Status: All</button>
          <button className="filter"><Icon name="Briefcase" size={12} /> Department</button>
          <button className="filter"><Icon name="Calendar" size={12} /> This semester</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Research Title</th>
              <th>Researcher</th>
              <th>Department</th>
              <th>Submitted</th>
              <th>Status</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {FA.FACULTY_QUEUE.map(a => (
              <tr key={a.id}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell">
                  <div className="t" style={{maxWidth: 280}}>{a.title}</div>
                </td>
                <td style={{fontSize: 12}}>{(a.researcher?.name) || "—"}</td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{a.department}</td>
                <td style={{fontSize: 12}}>{a.submittedAt}</td>
                <td><Badge status={a.status} /></td>
                <td className="actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate("f-checklist")}>
                    Review
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

/* ---------- C. Document Checklist ---------- */
/* ---------- D. Academic Committee Review ---------- */
/* ---------- E. Dean Approval ---------- */
function LiveAppLoader({ status, applicationId, title, desc, render }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    const req = applicationId ? window.DB.applicationDetail(applicationId) : window.DB.firstApplicationForStatus(status);
    req.then(setApp).catch(() => setApp(null)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [status, applicationId]);
  if (loading) {
    return <><PageHeader title={title} desc={desc} /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  }
  if (!app) {
    return <><PageHeader title={title} desc={desc} /><div className="card"><Empty title="Nothing in this queue" desc="Applications will appear here when they reach this stage." icon="Folder" /></div></>;
  }
  return render(app, load);
}

function FacultyChecklist({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader
      status="submitted"
      applicationId={applicationId}
      title="First Screening"
      desc="Review the live application and uploaded PDF documents before forwarding to the Faculty Committee."
      render={(app, load) => {
        const docs = app.documents || [];
        const budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
        const requested = Number(app.requested_amount || 0);
        const grantCap = app.grant_type === "au_r3" ? 50000 : app.grant_type === "au_r4" ? 80000 : 100000;
        const grantCode = app.grant_type === "au_r3" ? "AU-R3" : app.grant_type === "au_r4" ? "AU-R4" : "AU-R1";
        const withinCap = requested > 0 && requested <= grantCap;
        const isR3 = app.grant_type === "au_r3";
        const forward = () => setConfirm({
          kind: "success",
          title: isR3 ? "Forward to RASSC?" : "Forward to Faculty Committee?",
          message: isR3
            ? app.code + " is an AU-R3 paper presentation request — it goes straight to RASSC screening."
            : app.code + " will move to committee review.",
          confirmLabel: "Forward", withReason: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason); toast(app.code + (isR3 ? " forwarded to RASSC." : " forwarded to Faculty Committee.")); navigate("d-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger",
          title: "Return to researcher?",
          message: app.code + " will be marked returned for revision.",
          confirmLabel: "Return", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const rej = () => setConfirm({
          kind: "danger",
          title: "Reject this application?",
          message: app.code + " will be rejected at Dean screening. This ends the application.",
          confirmLabel: "Reject", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "reject", reason); toast(app.code + " rejected."); navigate("d-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        return (
          <>
            <PageHeader
              title={"First Screening - " + app.code}
              desc={(app.researcher ? app.researcher.full_name : "Researcher") + " - " + (app.department || "Department")}
              actions={<Badge status={window.DB.statusBadge(app.status)} />}
            />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Application Summary</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Research title</span><span className="r">{app.title}</span></div>
                    <div className="meta-row"><span className="l">Field / discipline</span><span className="r">{app.field || "-"}</span></div>
                    <div className="meta-row"><span className="l">Keywords</span><span className="r">{app.keywords || "-"}</span></div>
                    <div className="meta-row"><span className="l">Duration</span><span className="r">{app.duration_months || 12} months</span></div>
                    <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher ? app.researcher.full_name : "-"}</span></div>
                    <div className="meta-row"><span className="l">School / Faculty</span><span className="r">{app.faculty || "-"}</span></div>
                    <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
                    <div className="eyebrow mt-4 mb-2">Expected outcomes / summary</div>
                    <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{app.abstract || "No summary entered."}</p>
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Budget Review</h3></div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
                      <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(requested)}</span></div>
                      <div className="meta-row"><span className="l">AU-R1 ceiling</span><span className="r">100,000 THB</span></div>
                    </div>
                    {budgetRows.length === 0 && <div style={{ padding: 20, color: "var(--ink-3)" }}>No budget breakdown entered.</div>}
                    {budgetRows.length > 0 && (
                      <table className="tbl">
                        <thead><tr><th>Budget Item</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                        <tbody>
                          {budgetRows.map((b, i) => (
                            <tr key={i}>
                              <td>{b.item}</td>
                              <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(b.amount || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="card card-pad-0">
                  <div className="card-head">
                    <h3>Submitted Documents</h3>
                    <div className="grow"></div>
                    <span className="text-sm text-muted">{docs.length} uploaded</span>
                  </div>
                  <div>
                    {docs.length === 0 && <Empty title="No uploaded documents" desc="The researcher has not uploaded any PDF documents for this application." icon="FileText" />}
                    {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                  </div>
                </div>
              </div>
              <div className="card card-pad-0">
                <div className="card-head"><h3>Checklist Decision</h3></div>
                <div className="card-body">
                  {[
                    { label: docs.length + " uploaded PDF document(s)", checked: docs.length > 0 },
                    { label: "Budget total within " + grantCap.toLocaleString() + " THB " + grantCode + " ceiling", checked: withinCap },
                    { label: "Research title, researcher, faculty and department entered", checked: !!(app.title && app.researcher && app.faculty && app.department) },
                    { label: "Expected outcomes / proposal summary entered", checked: !!app.abstract },
                  ].map((item, i, arr) => (
                    <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none" }}>
                      <input type="checkbox" defaultChecked={item.checked} style={{ accentColor: "var(--au-crimson)" }} />
                      <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                      <Icon name={item.checked ? "CheckCircle" : "AlertCircle"} size={16} style={{ color: item.checked ? "var(--status-approved)" : "var(--au-gold)" }} />
                    </label>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <button className="btn btn-primary btn-block" disabled={docs.length === 0} onClick={forward}><Icon name="Send" size={14} /> {isR3 ? "Forward to RASSC" : "Forward to Faculty Committee"}</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                    <button className="btn btn-danger btn-block" onClick={rej}><Icon name="X" size={14} /> Reject Application</button>
                  </div>
                  {docs.length === 0 && <div className="text-sm text-muted mt-3">Upload at least one PDF before forwarding.</div>}
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

/* ---------- C2. AU-R3 Dean Screening (paper presentation) ---------- */
// AU-R3 status labels shown on the Dean side.
function r3Badge(status) {
  var base = window.DB.statusBadge(status);
  var labels = {
    submitted: "Pending Dean Review",
    iras_review: "Under IRAS Review",
    approved: "Approved for Payment",
    active: "Finance Processing",
    completed: "Paid / Completed",
    returned: "Returned for Revision",
    rejected: "Rejected",
  };
  return { key: base.key, cls: base.cls, label: labels[status] || base.label };
}

function DeanR3Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [similarityOk, setSimilarityOk] = useState(false);
  return (
    <LiveAppLoader
      status="submitted"
      applicationId={applicationId}
      title="AU-R3 Screening"
      desc="Review the conference, paper, documents and estimated budget before forwarding to IRAS."
      render={(app, load) => {
        const docs = app.documents || [];
        const ci = app.conference_info || {};
        const budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
        const requested = Number(app.requested_amount || 0);
        const CEILING = 50000;
        const remaining = Math.max(0, CEILING - requested);
        const r = app.researcher || {};

        // Match uploads to the four official AU-R3 document categories.
        const hasDoc = (kw) => docs.some(d => ((d.doc_type || "") + " " + (d.name || "")).toLowerCase().includes(kw));
        const docCats = [
          { label: "Full Research Article", required: true, ok: hasDoc("article") },
          { label: "Turnitin Report", required: true, ok: hasDoc("turnitin") },
          { label: "Memo & Estimated Budget", required: true, ok: hasDoc("memo") },
          { label: "Peer Review Comments", required: false, ok: hasDoc("peer") },
        ];

        const confComplete = !!(ci.confName && ci.organizer && ci.confType && ci.country && ci.city && ci.confStart && ci.confEnd);
        const infoComplete = !!(app.title && ci.correspondingAuthor && app.field && app.faculty && app.department);

        const forward = () => setConfirm({
          kind: "success",
          title: "Approve & forward to IRAS?",
          message: app.code + " will be recorded as approved by the Dean and sent to IRAS for eligibility and document verification.",
          confirmLabel: "Approve & Forward", withReason: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason); toast(app.code + " approved — forwarded to IRAS."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger",
          title: "Return for revision?",
          message: app.code + " will be sent back to the researcher. Explain what needs to be fixed (e.g. a clearer Turnitin report, a revised accommodation budget).",
          confirmLabel: "Return", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const rej = () => setConfirm({
          kind: "danger",
          title: "Reject this application?",
          message: app.code + " will be rejected at Dean screening. This ends the request.",
          confirmLabel: "Reject", withReason: true, reasonRequired: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "reject", reason); toast(app.code + " rejected."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });

        const checklist = [
          { label: "Full research article uploaded", checked: docCats[0].ok },
          { label: "Turnitin report uploaded", checked: docCats[1].ok },
          { label: "Turnitin similarity does not exceed 20%", checked: similarityOk, manual: true },
          { label: "Conference information is complete", checked: confComplete },
          { label: "Paper and researcher information is complete", checked: infoComplete },
          { label: "Estimated budget is attached", checked: budgetRows.length > 0 || docCats[2].ok },
          { label: "Requested amount within the 50,000 THB AU-R3 limit", checked: requested > 0 && requested <= CEILING },
          { label: "Memo is ready for Dean approval", checked: docCats[2].ok },
          { label: "Peer review comments uploaded (optional)", checked: docCats[3].ok, optional: true },
        ];

        const intl = ci.confType === "International";
        return (
          <>
            <PageHeader
              title={"AU-R3 Screening — " + app.code}
              desc={(r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department")}
              actions={<Badge status={r3Badge(app.status)} />}
            />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head">
                    <h3>Conference Information</h3>
                    <div className="grow"></div>
                    {ci.confType && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                        color: intl ? "var(--au-crimson)" : "var(--au-gold-deep)",
                        background: intl ? "var(--au-crimson-soft)" : "var(--au-gold-soft)" }}>
                        {ci.confType}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    {!app.conference_info && <div style={{ color: "var(--ink-3)", fontSize: 13 }}>No conference details were entered (older submission).</div>}
                    {app.conference_info && (
                      <>
                        <div className="meta-row"><span className="l">Conference name</span><span className="r">{ci.confName || "-"}</span></div>
                        <div className="meta-row"><span className="l">Organizer</span><span className="r">{ci.organizer || "-"}</span></div>
                        {ci.website && <div className="meta-row"><span className="l">Website</span><span className="r">{ci.website}</span></div>}
                        <div className="meta-row"><span className="l">Location</span><span className="r">{(ci.city || "-") + ", " + (ci.country || "-")}</span></div>
                        <div className="meta-row"><span className="l">Conference dates</span><span className="r">{(ci.confStart ? window.DB.fmtDate(ci.confStart) : "-") + " – " + (ci.confEnd ? window.DB.fmtDate(ci.confEnd) : "-")}</span></div>
                        <div className="meta-row"><span className="l">Presentation type</span><span className="r">{ci.presentation || "Oral Presentation"}</span></div>
                      </>
                    )}
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Research Paper Information</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Paper title</span><span className="r">{app.title}</span></div>
                    <div className="meta-row"><span className="l">Research field</span><span className="r">{app.field || "-"}</span></div>
                    <div className="meta-row"><span className="l">Keywords</span><span className="r">{app.keywords || "-"}</span></div>
                    <div className="meta-row"><span className="l">Author(s)</span><span className="r">{[r.full_name].concat((app.co_members || []).map(m => m.name + (m.kind === "Student" ? " (Student)" : ""))).filter(Boolean).join(", ")}</span></div>
                    <div className="meta-row"><span className="l">Corresponding author</span><span className="r">{ci.correspondingAuthor || "-"}</span></div>
                    {ci.paperAbstract && (
                      <>
                        <div className="eyebrow mt-4 mb-2">Abstract</div>
                        <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{ci.paperAbstract}</p>
                      </>
                    )}
                    {app.abstract && (
                      <>
                        <div className="eyebrow mt-4 mb-2">Expected outcomes</div>
                        <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{app.abstract}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Researcher Information</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Name</span><span className="r">{((r.name_title || r.title) ? (r.name_title || r.title) + " " : "") + (r.full_name || "-")}</span></div>
                    <div className="meta-row"><span className="l">AU ID</span><span className="r">{r.au_id || "-"}</span></div>
                    <div className="meta-row"><span className="l">Email</span><span className="r">{r.email || "-"}</span></div>
                    <div className="meta-row"><span className="l">Phone</span><span className="r">{r.phone || "-"}</span></div>
                    <div className="meta-row"><span className="l">Office / Room</span><span className="r">{r.office_room || "-"}</span></div>
                    <div className="meta-row"><span className="l">School / Faculty</span><span className="r">{app.faculty || "-"}</span></div>
                    <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Conference Budget Review</h3></div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
                      <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(requested)}</span></div>
                      <div className="meta-row"><span className="l">AU-R3 ceiling</span><span className="r">50,000 THB / academic year</span></div>
                      <div className="meta-row"><span className="l">Remaining eligible</span><span className="r" style={{ color: requested > CEILING ? "var(--au-crimson)" : "inherit" }}>{requested > CEILING ? "Over ceiling by " + fmtBaht(requested - CEILING) : fmtBaht(remaining)}</span></div>
                    </div>
                    {budgetRows.length === 0 && <div style={{ padding: 20, color: "var(--ink-3)" }}>No budget breakdown entered.</div>}
                    {budgetRows.length > 0 && (
                      <table className="tbl">
                        <thead><tr><th>Budget Item</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                        <tbody>
                          {budgetRows.map((b, i) => (
                            <tr key={i}>
                              <td>{b.item}</td>
                              <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{fmtBaht(Number(b.amount || 0))}</td>
                            </tr>
                          ))}
                          <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}>
                            <td>Total</td>
                            <td style={{ textAlign: "right" }}>{fmtBaht(budgetRows.reduce((s, b) => s + Number(b.amount || 0), 0))}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="card card-pad-0">
                  <div className="card-head">
                    <h3>Submitted Documents</h3>
                    <div className="grow"></div>
                    <span className="text-sm text-muted">{docs.length} uploaded</span>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>Document</th><th>Requirement</th><th>Status</th></tr></thead>
                    <tbody>
                      {docCats.map(dc => (
                        <tr key={dc.label}>
                          <td>{dc.label}</td>
                          <td style={{ fontSize: 12, color: dc.required ? "var(--au-crimson)" : "var(--ink-3)", fontWeight: dc.required ? 600 : 400 }}>{dc.required ? "Required" : "Optional"}</td>
                          <td>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: dc.ok ? "var(--status-approved, #2c7a4b)" : "var(--ink-3)" }}>
                              <Icon name={dc.ok ? "CheckCircle" : "AlertCircle"} size={14} /> {dc.ok ? "Uploaded" : "Not provided"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    {docs.length === 0 && <Empty title="No uploaded documents" desc="The researcher has not uploaded any PDF documents for this request." icon="FileText" />}
                    {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                  </div>
                </div>
              </div>

              <div className="card card-pad-0" style={{ alignSelf: "start" }}>
                <div className="card-head"><h3>AU-R3 Checklist Decision</h3></div>
                <div className="card-body">
                  {checklist.map((item, i, arr) => (
                    <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none", opacity: item.optional && !item.checked ? 0.75 : 1 }}>
                      <input type="checkbox"
                        checked={item.checked}
                        onChange={item.manual ? (e => setSimilarityOk(e.target.checked)) : (() => {})}
                        style={{ accentColor: "var(--au-crimson)" }} />
                      <span style={{ flex: 1, fontSize: 13 }}>{item.label}{item.manual && <span style={{ display: "block", fontSize: 11, color: "var(--ink-3)" }}>Tick after checking the Turnitin report yourself.</span>}</span>
                      <Icon name={item.checked ? "CheckCircle" : "AlertCircle"} size={16} style={{ color: item.checked ? "var(--status-approved)" : (item.optional ? "var(--ink-4)" : "var(--au-gold)") }} />
                    </label>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <button className="btn btn-primary btn-block" disabled={docs.length === 0} onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to IRAS</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                    <button className="btn btn-danger btn-block" onClick={rej}><Icon name="X" size={14} /> Reject Application</button>
                  </div>
                  {docs.length === 0 && <div className="text-sm text-muted mt-3">The researcher must upload at least one PDF before this can be forwarded.</div>}
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

function FacultyAcademic({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [form, setForm] = useState({ score: "", recommendation: "favorable", comments: "" });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <LiveAppLoader
      status="committee_review"
      applicationId={applicationId}
      title="Academic Committee Review"
      desc="Submit committee evaluation and recommendation."
      render={(app, load) => {
        const recLabel = { favorable: "forwarded to RASSC", revise: "returned to the researcher for revision", unfavorable: "rejected" };
        const submit = () => setConfirm({
          kind: form.recommendation === "favorable" ? "success" : "danger",
          title: "Submit Committee Decision?",
          message: app.code + " will be " + (recLabel[form.recommendation] || "moved") + ".",
          confirmLabel: "Submit Decision", withReason: true, reasonRequired: form.recommendation !== "favorable",
          onConfirm: async (reason) => {
            try {
              const merged = Object.assign({}, form, { comments: [form.comments, reason].filter(function (x) { return x && x.trim(); }).join(" — ") });
              await window.DB.submitCommitteeReview(app.id, merged);
              toast(app.code + " committee decision submitted.");
              if (navigate) navigate("c-queue"); else load();
            }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        return (
          <>
            <PageHeader
              title={"Academic Committee Review - " + app.code}
              desc={app.title}
              actions={<><Badge status={window.DB.statusBadge(app.status)} /><button className="btn btn-secondary" onClick={() => navigate && navigate("c-queue")}><Icon name="ArrowLeft" size={13} /> Queue</button></>}
            />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Proposal Summary</h3></div>
                  <div className="card-body">
                    <div className="eyebrow mb-2">Researcher</div>
                    <p style={{ margin: "0 0 12px", color: "var(--ink-2)" }}>{app.researcher ? app.researcher.full_name : "-"}</p>
                    <div className="eyebrow mb-2">Abstract</div>
                    <p style={{ margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)" }}>{app.abstract || "No abstract entered."}</p>
                    <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
                    <div className="meta-row"><span className="l">Duration</span><span className="r">{app.duration_months || 12} months</span></div>
                  </div>
                </div>
                <div className="card card-pad-0">
                  <div className="card-head"><h3>Documents</h3></div>
                  <div>{(app.documents || []).map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}</div>
                  {(!app.documents || app.documents.length === 0) && <Empty title="No uploaded documents" desc="Documents will appear after researcher upload." icon="FileText" />}
                </div>
              </div>
              <div className="card card-pad-0">
                <div className="card-head"><h3>Committee Decision</h3></div>
                <div className="card-body">
                  <div className="field"><label>Score (0-100)</label><input type="number" min="0" max="100" value={form.score} onChange={e => setField("score", e.target.value)} /></div>
                  <div className="field"><label>Recommendation</label><select value={form.recommendation} onChange={e => setField("recommendation", e.target.value)}><option value="favorable">Recommend</option><option value="revise">Request revision</option><option value="unfavorable">Reject</option></select></div>
                  <div className="field"><label>Committee comment</label><textarea className="comment-input" value={form.comments} onChange={e => setField("comments", e.target.value)} /></div>
                  <button className="btn btn-primary btn-block" onClick={submit}><Icon name="Send" size={14} /> Submit Decision</button>
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

function FacultyDean({ onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader
      status="dean_sign"
      title="Dean Approval"
      desc="Final faculty-level decision before forwarding to RASSC."
      render={(app, load) => {
        const decide = (kind) => setConfirm({
          kind: kind === "reject" ? "danger" : "success",
          title: kind === "advance" ? "Approve and forward to RASSC?" : kind === "return" ? "Return for revision?" : "Reject this application?",
          message: app.code + " will be " + (kind === "advance" ? "sent to RASSC." : kind === "return" ? "returned for revision." : "rejected."),
          confirmLabel: kind === "advance" ? "Approve & Forward" : kind === "return" ? "Return" : "Reject",
          onConfirm: async () => {
            try { await window.DB.transition(app.id, "dean_sign", kind); toast(app.code + " updated."); load(); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const reviews = (app.reviews || []).filter(r => r.kind === "committee");
        return (
          <>
            <PageHeader title={"Dean Approval - " + app.code} desc={app.title} actions={<Badge status={window.DB.statusBadge(app.status)} />} />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Application Summary</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher ? app.researcher.full_name : "-"}</span></div>
                    <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
                    <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
                  </div>
                </div>
                <div className="card card-pad-0">
                  <div className="card-head"><h3>Committee Reviews</h3></div>
                  <div className="card-body">
                    {reviews.length === 0 && <div className="text-sm text-muted">No committee review text saved yet.</div>}
                    {reviews.map(r => (
                      <div key={r.id} className="comment">
                        <div className="head"><div className="av">CT</div><div><div className="name">{r.reviewer ? r.reviewer.full_name : "Committee"}</div><div className="role">Score {r.score || "-"} - {r.recommendation}</div></div></div>
                        <div className="body">{r.comments || "No comment entered."}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card card-pad-0">
                <div className="card-head"><h3>Dean Decision</h3></div>
                <div className="card-body">
                  <div className="flex flex-col gap-2">
                    <button className="btn btn-primary btn-block" onClick={() => decide("advance")}><Icon name="ShieldCheck" size={14} /> Approve and Forward to RASSC</button>
                    <button className="btn btn-secondary btn-block" onClick={() => decide("return")}><Icon name="Repeat" size={14} /> Return for Revision</button>
                    <button className="btn btn-danger btn-block" onClick={() => decide("reject")}><Icon name="X" size={14} /> Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

Object.assign(window, {
  FacultyDashboard, FacultyIncoming, FacultyChecklist, DeanR3Detail,
  FacultyAcademic, FacultyDean,
});
