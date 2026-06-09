/* ============================================================
   Researcher Dashboard pages
   ============================================================ */

const RA = window.AU;

/* ---------- A. Dashboard Overview ---------- */
function ResearcherDashboard({ navigate, onDownload, onView }) {
  const app = RA.PRIMARY_APP;
  const [c, setC] = useState(null);
  const [me, setMe] = useState(null);
  useEffect(() => {
    window.DB.statusCounts().then(setC).catch(() => setC({}));
    window.AUTH.profile().then(setMe).catch(() => {});
  }, []);
  const n = (k) => (c ? (c[k] || 0) : "…");
  return (
    <>
      <PageHeader
        title="Researcher Dashboard"
        desc={"Welcome back" + (me ? ", " + me.full_name : "") + ". Here is the status of your research grant applications."}
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="Calendar" size={14} /> AY 2025–2026</button>
            <button className="btn btn-primary" onClick={() => navigate("r-submit")}>
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
        {/* Left: payment progress for primary app */}
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Payment Progress · {app.id}</h3>
            <div className="grow"></div>
            <Badge status={app.status} />
          </div>
          <div className="card-body">
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 17, marginBottom: 4 }}>
              {app.title}
            </div>
            <div className="text-sm text-muted mb-4">{app.faculty} · {app.department}</div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">Disbursement progress</span>
              <span className="text-sm font-semi">0 of 100,000 THB released</span>
            </div>
            <div className="progress mb-4">
              <div className="bar" style={{ width: "0%" }}></div>
            </div>

            <div className="grid-3">
              {RA.PAYMENTS.map(p => (
                <div key={p.n} style={{
                  padding: 14, border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)", background: "var(--paper-warm)",
                }}>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Tranche {p.n} · {p.pct}%</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, margin: "4px 0" }}>
                    {fmtBaht(p.amount)}
                  </div>
                  <span className={`badge ${p.badge}`}><span className="dot"></span>{p.status}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary mt-4" onClick={() => navigate("r-payments")}>
              View payment status <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>

        {/* Right: recent activity */}
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Recent Activity</h3>
          </div>
          <div style={{ padding: "8px 0" }}>
            {RA.ACTIVITY.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "10px 20px",
                borderBottom: i < RA.ACTIVITY.length - 1 ? "1px solid var(--line-2)" : "none",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--au-gold-soft)", color: "var(--au-gold)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon name={
                    a.kind === "expert" ? "FileSearch" :
                    a.kind === "approval" ? "ShieldCheck" :
                    a.kind === "comment" ? "Edit" :
                    a.kind === "check" ? "ClipboardCheck" : "FilePlus"
                  } size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }}></div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{a.t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick application snapshot */}
      <div className="card card-pad-0 mt-6">
        <div className="card-head">
          <h3>Application Pipeline · {app.id}</h3>
          <div className="grow"></div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("r-applications")}>
            Open detail <Icon name="ArrowRight" size={12} />
          </button>
        </div>
        <div className="card-body">
          <HTimeline steps={RA.ALL_STAGES.slice(0, 9)} app={app} />
        </div>
      </div>
    </>
  );
}

/* ---------- B. Submit Application ---------- */
function ResearcherSubmit({ navigate, onDownload, onView, toast }) {
  const [draft, setDraft] = useState({
    title: "AI-Based Research Grant Tracking System for Assumption University",
    field: "Information Technology / Educational Technology",
    type: "Individual Research",
    duration: "12",
    keywords: "research management, workflow, machine learning, higher education",
    name: "", title2: "", email: "", phone: "",
    school: "Vincent Mary School of Engineering, Science and Technology",
    department: "Information Technology",
    outcome: "A clean live test run through submission, review, approval, contract, report, and payment gates.",
  });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const [budgetRows, setBudgetRows] = useState([
    { item: "Remuneration (research assistant)", amount: 30000 },
    { item: "Research equipment", amount: 40000 },
    { item: "Travel for off-campus data collection", amount: 18000 },
    { item: "Miscellaneous (postage, photocopying, binding)", amount: 12000 },
  ]);
  const total = budgetRows.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const [reqTotal, setReqTotal] = useState("100000");
  const setAmt = (i, v) => setBudgetRows(rows => rows.map((r, j) => j === i ? { ...r, amount: (v + "").replace(/[^0-9]/g, "") } : r));

  const [files, setFiles] = useState([]);
  const onFiles = (e) => { const fs = Array.from(e.target.files || []); setFiles(prev => prev.concat(fs)); e.target.value = ""; };
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await window.AUTH.profile();
        if (p) setDraft(d => ({ ...d, name: p.full_name || d.name, title2: p.title || d.title2, email: p.email || d.email, school: p.faculty || d.school, department: p.department || d.department, phone: p.phone || d.phone }));
      } catch (e) {}
    })();
  }, []);

  async function save(submit) {
    setErr("");
    if (submit && !draft.title.trim()) { setErr("Research title is required."); return; }
    if (submit && Number(reqTotal) > 100000) { setErr("Requested amount (" + Number(reqTotal).toLocaleString() + " THB) exceeds the 100,000 THB maximum for AU-R1 research grants."); return; }
    if (submit && Number(reqTotal) <= 0) { setErr("Enter the grant amount you are requesting."); return; }
    setBusy(true);
    try {
      const app = await window.DB.createApplication({
        title: draft.title, abstract: draft.outcome, field: draft.field,
        faculty: draft.school, department: draft.department, keywords: draft.keywords,
        requested_amount: Number(reqTotal), duration_months: draft.duration, budget_breakdown: budgetRows,
      }, submit);
      for (const f of files) { try { await window.DB.uploadDocument(app.id, f, null); } catch (e) {} }
      toast(submit ? ("Application " + app.code + " submitted") : ("Draft " + app.code + " saved"));
      navigate("r-applications");
    } catch (ex) { setErr((ex && ex.message) || "Could not save the application."); setBusy(false); }
  }

  return (
    <>
      <PageHeader
        title="Submit Research Grant Application"
        desc="Complete each section and upload the four required forms before submitting."
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
                <label>Research Type</label>
                <select value={draft.type} onChange={e => upd("type", e.target.value)}>
                  <option>Individual Research</option>
                  <option>Collaborative Research</option>
                  <option>Creative Work</option>
                </select>
              </div>
              <div className="field">
                <label>Duration (months)</label>
                <input value={draft.duration} onChange={e => upd("duration", e.target.value)} />
              </div>
              <div className="field">
                <label>Keywords</label>
                <input value={draft.keywords} onChange={e => upd("keywords", e.target.value)} />
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
                <label>Full Name</label>
                <input value={draft.name} onChange={e => upd("name", e.target.value)} />
              </div>
              <div className="field">
                <label>Academic Title</label>
                <input value={draft.title2} onChange={e => upd("title2", e.target.value)} />
              </div>
              <div className="field">
                <label>Email</label>
                <input value={draft.email} onChange={e => upd("email", e.target.value)} />
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
                <input value={draft.school} onChange={e => upd("school", e.target.value)} />
              </div>
              <div className="field">
                <label>Department</label>
                <input value={draft.department} onChange={e => upd("department", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4><span className="num">4</span> Budget Information</h4>
          <p className="section-sub">Enter any amount up to the 100,000 THB AU-R1 maximum, then itemise it below. Caps: remuneration ≤30%, travel ≤40%, equipment ≤50%, misc ≤20%.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Total Grant Requested (THB)</label>
                <input value={Number(reqTotal || 0).toLocaleString()}
                  onChange={e => {
                    const v = (e.target.value + "").replace(/[^0-9]/g, ""); setReqTotal(v);
                    const t = Number(v) || 0, a = Math.round(t * 0.30), b = Math.round(t * 0.40), c = Math.round(t * 0.18);
                    setBudgetRows([
                      { item: "Remuneration (research assistant)", amount: a },
                      { item: "Research equipment", amount: b },
                      { item: "Travel for off-campus data collection", amount: c },
                      { item: "Miscellaneous (postage, photocopying, binding)", amount: t - a - b - c },
                    ]);
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
                        const caps = [30, 50, 40, 20];
                        const pct = total > 0 ? Math.round((Number(b.amount) || 0) / total * 100) : 0;
                        const over = pct > caps[i];
                        return (
                          <tr key={i}>
                            <td>{b.item}</td>
                            <td style={{ textAlign: "center", color: over ? "var(--au-crimson)" : "var(--ink-3)", fontWeight: over ? 600 : 400 }}>{pct}%</td>
                            <td style={{ textAlign: "center", fontSize: 12, color: "var(--ink-3)" }}>≤ {caps[i]}%</td>
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
          <p className="section-sub">Upload all four forms. PDF only, maximum 10 MB each.</p>
          <div className="section-body">
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
            <label className="upload-box mt-1" style={{ cursor: "pointer", display: "block" }}>
              <input type="file" accept="application/pdf,.pdf" multiple style={{ display: "none" }} onChange={onFiles} />
              <Icon name="Upload" size={26} className="icon" />
              <div className="t">Click to upload the required forms</div>
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
function ResearcherApplications({ navigate, onDownload, openDetail }) {
  const [myApps, setMyApps] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const apps = await window.DB.myApplications();
        setMyApps(apps.map(a => ({
          id: a.code, _uuid: a.id, title: a.title, faculty: a.faculty, department: a.department,
          submittedAt: a.submitted_at ? window.DB.fmtDate(a.submitted_at) : "—",
          stage: window.DB.statusBadge(a.status).label, status: window.DB.statusBadge(a.status),
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
          <button className="btn btn-primary" onClick={() => navigate("r-submit")}>
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
                  <div className="s">{a.faculty || RA.PRIMARY_APP.faculty} · {a.department || RA.PRIMARY_APP.department}</div>
                </td>
                <td>{a.submittedAt}</td>
                <td>{a.stage}</td>
                <td><Badge status={a.status} /></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => openDetail(a.id)}>
                    <Icon name="Eye" size={13} /> View
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: a.id + "_files.zip" })}>
                    <Icon name="Download" size={13} /> Files
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
function ResearcherApplicationDetail({ navigate, onDownload, onView }) {
  const app = RA.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title={app.title}
        desc={`${app.id} · Submitted ${app.submittedAt}`}
        actions={
          <>
            <Badge status={app.status} />
            <button className="btn btn-secondary"><Icon name="Download" size={13} /> Download All</button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          {/* Summary */}
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Research Summary</h3></div>
            <div className="card-body">
              <div className="eyebrow mb-2">Abstract</div>
              <p style={{ margin: "0 0 16px", lineHeight: 1.65, color: "var(--ink-2)" }}>{app.abstract}</p>

              <div className="eyebrow mb-2">Objectives</div>
              <ol style={{ margin: "0 0 16px 20px", padding: 0, color: "var(--ink-2)", lineHeight: 1.6 }}>
                {app.objectives.map((o, i) => <li key={i} style={{marginBottom: 4}}>{o}</li>)}
              </ol>

              <div className="grid-2eq">
                <div>
                  <div className="eyebrow mb-2">Principal Researcher</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar initials="PT" />
                    <div>
                      <div style={{ fontWeight: 600 }}>{app.researcher.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{app.researcher.title} · {app.department}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="eyebrow mb-2">Total Grant</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500 }}>
                    {fmtBaht(app.budgetTotal)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{app.duration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Submitted Documents</h3>
              <div className="grow"></div>
              <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: app.id + "_all.zip" })}>
                <Icon name="Download" size={13} /> Download All
              </button>
            </div>
            <div>
              {RA.REQUIRED_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>

          {/* Comments */}
          <div className="card card-pad-0">
            <div className="card-head"><h3>Reviewer Comments</h3></div>
            <div className="card-body">
              <div className="comment">
                <div className="head">
                  <div className="av">CT</div>
                  <div>
                    <div className="name">Committee Test</div>
                    <div className="role">Faculty Academic Committee</div>
                  </div>
                  <div className="when">Test note</div>
                </div>
                <div className="body">
                  Committee comments will appear here after a live committee reviewer submits a decision.
                </div>
              </div>
              <div className="comment">
                <div className="head">
                  <div className="av" style={{background: "var(--au-gold)"}}>RS</div>
                  <div>
                    <div className="name">RASSC Test</div>
                    <div className="role">RASSC Office</div>
                  </div>
                  <div className="when">Test note</div>
                </div>
                <div className="body">
                  RASSC notes and expert assignment updates will appear here after live actions are recorded.
                </div>
              </div>
              <textarea className="comment-input mt-3" placeholder="Reply to reviewers…"></textarea>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted">Comments are visible to Faculty, RASSC, and the President.</span>
                <button className="btn btn-primary btn-sm"><Icon name="Send" size={12} /> Post Reply</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: timeline */}
        <div className="card card-pad-0" style={{ alignSelf: "start", position: "sticky", top: 116 }}>
          <div className="card-head">
            <h3>Approval Timeline</h3>
            <div className="grow"></div>
            <Badge status={app.status} />
          </div>
          <div className="card-body">
            <Timeline steps={RA.ALL_STAGES} app={app} />
          </div>
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

Object.assign(window, {
  ResearcherDashboard, ResearcherSubmit, ResearcherApplications,
  ResearcherApplicationDetail, ResearcherProgress, ResearcherFinal,
  ResearcherPayments,
});
