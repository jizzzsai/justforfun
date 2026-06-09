/* ============================================================
   RASSC / President / Finance pages
   ============================================================ */

const IR = window.AU;

/* ---------- A. Dashboard Overview ---------- */
/* ---------- B. Received Applications ---------- */
function RASSCReceived({ navigate, onDownload, setSelectedApplicationId }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    window.DB.queue("iras_review").then(setRows).catch(() => setRows([]));
  }, []);
  const openScreening = (row) => {
    setSelectedApplicationId(row._uuid);
    navigate("i-screen");
  };
  return (
    <>
      <PageHeader
        title="Received Applications"
        desc="Applications forwarded by Faculty Deans for university-level review."
      />

      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID, researcher, faculty…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All stages</button>
          <button className="filter"><Icon name="Building2" size={12} /> All faculties</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        {rows === null && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading received applications...</div>}
        {rows && rows.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Nothing in this queue right now.</div>}
        {rows && rows.length > 0 && <QueueTable rows={rows} openLabel="Screen ->" onOpen={openScreening} onDownload={onDownload} />}
      </div>
    </>
  );
}

/* ---------- C. Assign Expert Reviewers ---------- */
function RASSCAssign({ applicationId, setSelectedApplicationId, toast, setConfirm }) {
  const requiredExperts = 3;
  const [apps, setApps] = useState(null);
  const [experts, setExperts] = useState(null);
  const [selectedId, setSelectedId] = useState(applicationId || "");
  const [selectedExpertIds, setSelectedExpertIds] = useState([]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().slice(0, 10);
  });

  const load = () => Promise.all([
    window.DB.queue("iras_review"),
    window.DB.profilesByRole("expert"),
  ]).then(([appRows, expertRows]) => {
    setApps(appRows);
    setExperts(expertRows);
  }).catch(() => {
    setApps([]);
    setExperts([]);
  });

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!apps) return;
    const first = apps[0] && apps[0]._uuid;
    const preferred = apps.some(a => a._uuid === selectedId) ? selectedId : (applicationId || first || "");
    if (preferred && preferred !== selectedId) setSelectedId(preferred);
  }, [apps, applicationId]);
  useEffect(() => {
    if (!experts || selectedExpertIds.length) return;
    setSelectedExpertIds(experts.slice(0, requiredExperts).map(e => e.id));
  }, [experts]);

  const selectedApp = (apps || []).find(a => a._uuid === selectedId);
  const expertName = (e, i) => (e && e.full_name) || ("Expert " + (i + 1));
  const expertInitials = (e, i) => {
    const name = expertName(e, i);
    const parts = name.trim().split(/\s+/);
    if (parts.length === 2 && /^\d+$/.test(parts[1])) return (parts[0][0] + parts[1]).toUpperCase();
    return parts.map(p => p[0]).join("").slice(0, 2).toUpperCase();
  };
  const setSlot = (index, id) => {
    const next = selectedExpertIds.slice();
    next[index] = id;
    setSelectedExpertIds(next);
  };
  const sendAssignments = () => {
    const ids = Array.from(new Set(selectedExpertIds.filter(Boolean)));
    if (!selectedId) { toast("Select an application first."); return; }
    if (ids.length < Math.min(requiredExperts, (experts || []).length)) { toast("Select three expert reviewers."); return; }
    setConfirm({
      kind: "success",
      title: "Send to expert dashboard?",
      message: (selectedApp ? selectedApp.id : "This application") + " will appear in the selected expert account dashboards.",
      confirmLabel: "Send to Experts",
      onConfirm: async () => {
        try {
          await window.DB.assignExperts(selectedId, ids, dueDate);
          if (setSelectedApplicationId) setSelectedApplicationId(selectedId);
          toast((selectedApp ? selectedApp.id : "Application") + " sent to expert dashboards.");
          load();
        } catch (e) {
          toast("Error: " + ((e && e.message) || e));
        }
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Assign Expert Reviewers"
        desc="Choose the three test expert accounts that should receive this application."
      />

      {apps === null && <div className="card" style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Loading assignment form...</div>}
      {apps && apps.length === 0 && <div className="card"><Empty title="No applications waiting for expert assignment" desc="Applications appear here after RASSC office screening." icon="UserPlus" /></div>}
      {apps && apps.length > 0 && (
        <div className="grid-2">
          <div>
            <div className="card card-pad-0">
              <div className="card-head"><h3>Assignment Form</h3></div>
              <div className="card-body">
                <div className="field">
                  <label>Application</label>
                  <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    {apps.map(a => (
                      <option key={a._uuid} value={a._uuid}>{a.id} - {a.title}</option>
                    ))}
                  </select>
                </div>

                {Array.from({ length: requiredExperts }, (_, i) => i).map(i => {
                  const expert = (experts || []).find(e => e.id === selectedExpertIds[i]);
                  return (
                    <div key={i} style={{ padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 12 }}>
                      <div className="eyebrow mb-2">Expert Reviewer #{i + 1}</div>
                      <div className="form-grid">
                        <div className="field" style={{ margin: 0 }}>
                          <label>Reviewer account</label>
                          <select value={selectedExpertIds[i] || ""} onChange={e => setSlot(i, e.target.value)}>
                            <option value="">Select expert</option>
                            {(experts || []).map((e, idx) => (
                              <option key={e.id} value={e.id} disabled={selectedExpertIds.includes(e.id) && selectedExpertIds[i] !== e.id}>
                                {expertName(e, idx)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                          <label>Email</label>
                          <input value={(expert && expert.email) || ""} readOnly />
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                          <label>Type</label>
                          <input value={(expert && expert.department) || "Expert reviewer"} readOnly />
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                          <label>Status</label>
                          <input value={expert ? "Ready" : "Not selected"} readOnly />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="form-grid">
                  <div className="field">
                    <label>Review deadline</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Next step</label>
                    <input value="Expert dashboard, then President after every selected expert submits" readOnly />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted">President review opens only after every selected expert account submits.</span>
                    <button className="btn btn-primary" onClick={sendAssignments}>
                    <Icon name="Send" size={14} /> Send to Expert Dashboards
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card card-pad-0">
              <div className="card-head"><h3>Reviewer Pool</h3></div>
              <div>
                {experts === null && <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-3)" }}>Loading experts...</div>}
                {experts && experts.length === 0 && <Empty title="No expert accounts" desc="Create expert profiles to assign reviews." icon="Users" />}
                {(experts || []).map((e, i) => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: i < experts.length - 1 ? "1px solid var(--line-2)" : "none" }}>
                    <Avatar initials={expertInitials(e, i)} size={32} color="var(--au-navy)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{expertName(e, i)}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{e.email}</div>
                    </div>
                    <span className="badge badge-iras"><span className="dot"></span>Expert</span>
                    <span className="text-sm text-muted" style={{ minWidth: 70, textAlign: "right" }}>Available</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- D. Expert Review ---------- */
/* ---------- D. Expert Review (live) ---------- */
function RASSCExpert({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    score: "86",
    strengths: "Clear research question. Methodology is well-defined and the evaluation plan is convincing. Budget breakdown is realistic and well-justified.",
    weaknesses: "Risk of scope creep. Consider tightening the success metric and mitigation plan.",
    recommendation: "favorable",
    comments: "",
  });

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const score = Math.max(0, Math.min(100, parseInt(form.score, 10) || 0));

  const normalizeApp = (a) => {
    if (!a) return null;
    const expertReviews = (a.reviews || []).filter(r => r.kind === "expert");
    return {
      _uuid: a.id,
      id: a.code,
      title: a.title,
      status: a.statusBadge || window.DB.statusBadge(a.status),
      researcher: a.researcher ? a.researcher.full_name : "—",
      methodology: a.abstract || "No abstract or methodology summary has been entered for this application.",
      outcomes: [
        "Research output aligned with the submitted proposal.",
        "Progress and final reports required before gated disbursements.",
        "Publication or dissemination evidence to be tracked after completion.",
      ],
      budgetTotal: Number(a.requested_amount || 0),
      duration: (a.duration_months || 12) + " months",
      documents: a.documents || [],
      experts: expertReviews.map(r => ({
        name: r.reviewer ? r.reviewer.full_name : "Expert reviewer",
        affiliation: r.reviewer ? (r.reviewer.faculty || r.reviewer.department || "Assumption University") : "—",
        type: "Expert",
        status: "Submitted",
        score: r.score,
        verdict: r.recommendation,
      })),
    };
  };

  const load = () => {
    setLoading(true);
    const req = applicationId
      ? window.DB.applicationDetail(applicationId)
      : window.DB.firstApplicationForStatus("expert_review");
    req.then(a => setApp(normalizeApp(a))).catch(() => setApp(null)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [applicationId]);

  const submitReview = () => {
    if (!app || submitting) return;
    if (form.recommendation === "favorable" && score < 70) {
      toast("Favorable recommendation requires a score of at least 70.");
      return;
    }
    setConfirm({
      kind: "success",
      title: "Submit expert review?",
      message: "This saves your evaluation. The application moves to President after all assigned expert reviews are complete.",
      confirmLabel: "Submit Review",
      onConfirm: async () => {
        setSubmitting(true);
        try {
          await window.DB.submitExpertReview(app._uuid, {
            score: score,
            strengths: form.strengths,
            weaknesses: form.weaknesses,
            comments: form.comments,
            recommendation: form.recommendation,
          });
          toast(app.id + " expert review submitted. The application moves to President only after every assigned expert submits.");
          if (navigate) navigate("e-history");
        } catch (e) {
          toast("Error: " + (e.message || e));
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Expert Review" desc="Loading the assigned proposal." />
        <div className="card card-pad-0">
          <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>Loading expert review…</div>
        </div>
      </>
    );
  }

  if (!app) {
    return (
      <>
        <PageHeader
          title="Expert Review"
          desc="No active expert-review assignment is available."
          actions={<button className="btn btn-secondary" onClick={() => navigate && navigate("e-assignments")}><Icon name="ArrowLeft" size={13} /> Assignments</button>}
        />
        <div className="card card-pad-0">
          <Empty title="No assignment to evaluate" desc="Applications will appear here after RASSC sends them for expert review." icon="FileSearch" />
        </div>
      </>
    );
  }

  const reviewers = app.experts.length ? app.experts : [{
    name: "Current expert reviewer",
    affiliation: "Signed-in AU-RGMS account",
    type: "Expert",
    status: "Pending",
  }];

  return (
    <>
      <PageHeader
        title="Expert Review"
        desc={app.id + " · Submit your scholarly evaluation."}
        actions={<Badge status={app.status} />}
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Proposal Snapshot</h3></div>
            <div className="card-body">
              <div className="eyebrow mb-2">Title</div>
              <div style={{fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 500, marginBottom: 16, lineHeight: 1.3}}>{app.title}</div>

              <div className="eyebrow mb-2">Researcher</div>
              <p style={{margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)", fontSize: 13}}>{app.researcher}</p>

              <div className="eyebrow mb-2">Abstract / Methodology</div>
              <p style={{margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)", fontSize: 13}}>{app.methodology}</p>

              <div className="eyebrow mb-2">Expected Outcomes</div>
              <ul style={{margin: "0 0 16px 20px", padding: 0, color: "var(--ink-2)", lineHeight: 1.6, fontSize: 13}}>
                {app.outcomes.map((o, i) => <li key={i} style={{marginBottom: 4}}>{o}</li>)}
              </ul>

              <div className="eyebrow mb-2">Budget</div>
              <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted">Total requested</span>
                  <b>{fmtBaht(app.budgetTotal)}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Duration</span>
                  <b style={{fontSize: 13}}>{app.duration}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Reviewer Documents</h3></div>
            <div>
              {app.documents.length === 0 && <Empty title="No uploaded documents" desc="The researcher did not upload PDF files for this application." icon="FileText" />}
              {app.documents.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Review Form</h3></div>
            <div className="card-body">
              <div className="text-sm text-muted mb-3">
                Reviewer: <b>Signed-in expert reviewer</b>
              </div>

              <div className="field">
                <label>Score (0-100)</label>
                <input type="number" min="0" max="100" value={form.score} onChange={e => setField("score", e.target.value)} />
                <div className="progress mt-2"><div className="bar" style={{width: score + "%"}}></div></div>
              </div>

              <div className="field">
                <label>Strengths</label>
                <textarea className="comment-input" value={form.strengths} onChange={e => setField("strengths", e.target.value)} />
              </div>

              <div className="field">
                <label>Weaknesses</label>
                <textarea className="comment-input" value={form.weaknesses} onChange={e => setField("weaknesses", e.target.value)} />
              </div>

              <div className="field">
                <label>Additional comments</label>
                <textarea className="comment-input" value={form.comments} onChange={e => setField("comments", e.target.value)} placeholder="Optional conditions or notes for RASSC and the President." />
              </div>

              <div className="field">
                <label>Recommendation</label>
                <select value={form.recommendation} onChange={e => setField("recommendation", e.target.value)}>
                  <option value="favorable">Favorable</option>
                  <option value="revise">Revise</option>
                  <option value="unfavorable">Unfavorable</option>
                </select>
              </div>

              <button className="btn btn-primary btn-block mt-2" disabled={submitting} onClick={submitReview}>
                <Icon name="Send" size={14} /> {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Assigned Reviewers</h3></div>
            <div style={{padding: "8px 0"}}>
              {reviewers.map((e, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px"}}>
                  <Avatar initials={e.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={28} color={e.status === "Submitted" ? "var(--au-navy)" : "var(--au-crimson)"} />
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13, fontWeight: 600}}>{e.name}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.affiliation} · {e.type}</div>
                  </div>
                  <span className={`badge ${e.status === "Submitted" ? "badge-check" : "badge-pending"}`}>
                    <span className="dot"></span>{e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- E. Committee Decision ---------- */
/* ---------- F. President Approval ---------- */
/* ---------- G. Contract Management ---------- */
function RASSCPresident({ onDownload, toast, setConfirm }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState("Approved subject to the standard AU progress and final reporting requirements.");
  const load = () => {
    setLoading(true);
    window.DB.firstApplicationForStatus("president_review").then(setApp).catch(() => setApp(null)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const decide = (approved) => setConfirm({
    kind: approved ? "success" : "danger",
    title: approved ? "Approve and issue contract?" : "Reject this application?",
    message: approved ? "A contract record will be created and the application will move to contract tracking." : "Rejection by the President is final.",
    confirmLabel: approved ? "Approve" : "Reject",
    onConfirm: async () => {
      if (!app) return;
      try {
        await window.DB.presidentDecision(app.id, approved, conditions);
        toast(app.code + (approved ? " approved. Contract is ready." : " rejected."));
        load();
      } catch (e) {
        toast("Error: " + ((e && e.message) || e));
      }
    },
  });

  if (loading) return <><PageHeader title="President Approval" desc="Final university-level decision before contract issuance." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  if (!app) return <><PageHeader title="President Approval" desc="Final university-level decision before contract issuance." /><div className="card"><Empty title="No applications awaiting President approval" desc="Completed expert reviews will appear here." icon="Award" /></div></>;

  const expertReviews = (app.reviews || []).filter(r => r.kind === "expert");
  const avg = expertReviews.length ? Math.round(expertReviews.reduce((s, r) => s + Number(r.score || 0), 0) / expertReviews.length) : 0;
  return (
    <>
      <PageHeader title={"President Approval - " + app.code} desc={app.title} actions={<Badge status={window.DB.statusBadge(app.status)} />} />
      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Application Summary</h3></div>
            <div className="card-body">
              <div className="meta-row"><span className="l">Researcher</span><span className="r">{app.researcher ? app.researcher.full_name : "-"}</span></div>
              <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
              <div className="meta-row"><span className="l">Expert reviews</span><span className="r">{expertReviews.length} submitted</span></div>
              <div className="meta-row"><span className="l">Average score</span><span className="r">{expertReviews.length ? avg + " / 100" : "-"}</span></div>
            </div>
          </div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Expert Reviews</h3></div>
            <div className="card-body">
              {expertReviews.length === 0 && <div className="text-sm text-muted">No expert review records were saved yet.</div>}
              {expertReviews.map(r => (
                <div key={r.id} className="comment">
                  <div className="head"><div className="av">E</div><div><div className="name">{r.reviewer ? r.reviewer.full_name : "Expert reviewer"}</div><div className="role">Score {r.score || "-"} - {r.recommendation}</div></div></div>
                  <div className="body">{r.comments || r.strengths || "No comment entered."}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card card-pad-0">
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

function RASSCContract({ onDownload, toast, setConfirm }) {
  const [apps, setApps] = useState(null);
  const load = () => window.DB.contractQueue().then(setApps).catch(() => setApps([]));
  useEffect(() => { load(); }, []);
  if (apps === null) return <><PageHeader title="Contract Management" desc="Issue and track research grant contracts." /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  if (apps.length === 0) return <><PageHeader title="Contract Management" desc="Issue and track research grant contracts." /><div className="card"><Empty title="No contracts to track" desc="President-approved applications will appear here." icon="FileSignature" /></div></>;

  const app = apps[0];
  const contract = (app.contracts && app.contracts[0]) || null;
  const approvedAt = app.decided_at ? new Date(app.decided_at) : new Date();
  const deadline = new Date(approvedAt.getTime());
  deadline.setDate(deadline.getDate() + 45);
  const sign = () => setConfirm({
    kind: "success",
    title: "Mark contract as signed?",
    message: app.code + " will become an active grant and appear in OFM payment setup.",
    confirmLabel: "Mark Signed",
    onConfirm: async () => {
      try { await window.DB.signContract(app.id); toast(app.code + " contract signed. Grant is active."); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });

  return (
    <>
      <PageHeader title={"Contract Management - " + app.code} desc={app.title} actions={<Badge status={window.DB.statusBadge(app.status)} />} />
      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Contract Status</h3></div>
          <div className="card-body">
            <div className="meta-row"><span className="l">Contract no.</span><span className="r">{contract ? contract.contract_no : "Pending issue"}</span></div>
            <div className="meta-row"><span className="l">President approval date</span><span className="r">{window.DB.fmtDate(app.decided_at)}</span></div>
            <div className="meta-row"><span className="l">Signing deadline</span><span className="r">{deadline.toLocaleDateString()}</span></div>
            <div className="meta-row"><span className="l">Grant amount</span><span className="r">{fmtBaht(Number(app.approved_amount || app.requested_amount || 0))}</span></div>
            <div className="flex gap-2 mt-4">
              <span className="text-sm text-muted">Contract record is issued after President approval; mark it signed when signatures are complete.</span>
              <div style={{flex: 1}}></div>
              <button className="btn btn-primary" disabled={app.status !== "approved"} onClick={sign}><Icon name="FileSignature" size={14} /> Mark Contract Signed</button>
            </div>
          </div>
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Next Steps</h3></div>
          <div className="card-body">
            <Timeline
              steps={[
                { key: "issue", label: "Contract issued" },
                { key: "sign", label: "Signatures collected" },
                { key: "active", label: "Grant activated" },
                { key: "pay", label: "OFM payment setup" },
              ]}
              app={{ timeline: {
                issue: { done: true, date: window.DB.fmtDate(app.decided_at), who: "President" },
                sign: { current: app.status === "approved", done: app.status === "active", date: app.status === "active" ? "Signed" : "Pending" },
                active: { current: app.status === "active", done: app.status === "active", date: app.status === "active" ? "Active" : "Pending" },
                pay: { date: app.status === "active" ? "Ready" : "Pending" },
              }}}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- H. Finance / OFM Payment ---------- */
function RASSCPayment({ onDownload, toast, setConfirm }) {
  const [apps, setApps] = useState(null);
  const load = () => window.DB.ofmPayments().then(setApps).catch(() => setApps([]));
  useEffect(() => { load(); }, []);

  const totalAllocated = (apps || []).reduce((s, a) => s + Number(a.approved_amount || a.requested_amount || 0), 0);
  const disbursed = (apps || []).reduce((s, a) => s + (a.payments || []).filter(p => p.status === "paid").reduce((t, p) => t + Number(p.amount), 0), 0);

  const payCell = (app, p) => {
    if (!p) return "—";
    if (p.status === "paid") return <span className="badge badge-paid"><span className="dot"></span>Paid</span>;
    if (!window.DB.payable(app, p.instalment)) return <span className="badge badge-draft"><span className="dot"></span>Not due</span>;
    return (
      <button className="btn btn-primary btn-sm" onClick={() => setConfirm({
        kind: "success",
        title: "Disburse tranche " + p.instalment + " (" + p.pct + "%)?",
        message: "Pay " + fmtBaht(p.amount) + " for " + app.code + ".",
        confirmLabel: "Pay " + fmtBaht(p.amount),
        onConfirm: async () => {
          try { await window.DB.markPaid(p.id, p.instalment, app.id); toast("Tranche " + p.instalment + " paid for " + app.code); load(); }
          catch (e) { toast("Error: " + (e.message || e)); }
        },
      })}>Pay {p.pct}%</button>
    );
  };

  return (
    <>
      <PageHeader
        title="Finance / OFM Payment"
        desc="Process disbursements after each milestone: contract, progress report, final report."
      />

      <div className="stats" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
        <Stat label="Total Allocated" value={fmtBaht(totalAllocated)} icon="Coins" />
        <Stat label="Disbursed" value={fmtBaht(disbursed)} icon="TrendingUp" tone="green" />
        <Stat label="Active Grants" value={(apps || []).length} icon="Briefcase" tone="navy" />
      </div>

      <div className="card card-pad-0">
        {apps === null && <div style={{ padding: "36px", textAlign: "center", color: "var(--ink-3)" }}>Loading payments…</div>}
        {apps && apps.length === 0 && <div style={{ padding: "44px", textAlign: "center", color: "var(--ink-3)" }}>No approved grants yet. Approve an application (as President) to set up its 30 / 40 / 30 payments.</div>}
        {apps && apps.length > 0 && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Research</th>
                <th>Researcher</th>
                <th style={{ textAlign: "right" }}>Grant</th>
                <th>1st · 30%</th>
                <th>2nd · 40%</th>
                <th>3rd · 30%</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => {
                const p = {};
                (a.payments || []).forEach(x => { p[x.instalment] = x; });
                return (
                  <tr key={a.id}>
                    <td className="title-cell">
                      <div className="t">{a.code}</div>
                      <div className="s" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{a.researcher ? a.researcher.full_name : "—"}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmtBaht(a.approved_amount || a.requested_amount)}</td>
                    <td>{payCell(a, p[1])}</td>
                    <td>{payCell(a, p[2])}</td>
                    <td>{payCell(a, p[3])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ---------- I. Report Review ---------- */
function RASSCReports({ onDownload, onView, toast, setConfirm }) {
  const [reports, setReports] = useState(null);
  const load = () => window.DB.reportQueue().then(setReports).catch(() => setReports([]));
  useEffect(() => { load(); }, []);
  const approve = (r) => setConfirm({
    kind: "success",
    title: "Accept " + r.kind + " report?",
    message: "This opens the " + (r.kind === "progress" ? "40%" : "final 30%") + " payment gate for " + (r.application ? r.application.code : "this grant") + ".",
    confirmLabel: "Accept Report",
    onConfirm: async () => {
      try { await window.DB.acceptReport(r.id); toast((r.application ? r.application.code : "Report") + " accepted."); load(); }
      catch (e) { toast("Error: " + ((e && e.message) || e)); }
    },
  });
  const progress = (reports || []).filter(r => r.kind === "progress");
  const finals = (reports || []).filter(r => r.kind === "final");
  const ReportList = ({ rows, kind }) => (
    <div>
      {reports === null && <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-3)" }}>Loading reports...</div>}
      {reports && rows.length === 0 && <Empty title={"No " + kind + " reports awaiting review"} desc="Researcher submissions will appear here." icon={kind === "progress" ? "FileText" : "FileCheck"} />}
      {rows.map((r, i) => (
        <div key={r.id} style={{ padding: "16px 20px", borderBottom: i < rows.length - 1 ? "1px solid var(--line-2)" : "none" }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: kind === "progress" ? "var(--au-crimson-soft)" : "var(--au-gold-soft)", color: kind === "progress" ? "var(--au-crimson)" : "var(--au-gold)", display: "grid", placeItems: "center" }}>
              <Icon name={kind === "progress" ? "FileText" : "FileCheck"} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{r.application ? r.application.title : "Grant report"}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.application ? r.application.code : "-"} - {r.application && r.application.researcher ? r.application.researcher.full_name : "-"} - Submitted {window.DB.fmtDate(r.submitted_at)}</div>
            </div>
            <span className="badge badge-pending"><span className="dot"></span>Submitted</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted">Report submission record</span>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-success btn-sm" onClick={() => approve(r)}><Icon name="CheckCircle" size={12} /> Accept</button>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader title="Report Review" desc="Review submitted progress and final reports before payment release." />
      <div className="grid-2eq">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Progress Reports - Awaiting Review</h3></div>
          <ReportList rows={progress} kind="progress" />
        </div>
        <div className="card card-pad-0">
          <div className="card-head"><h3>Final Reports - Awaiting Review</h3></div>
          <ReportList rows={finals} kind="final" />
        </div>
      </div>
    </>
  );
}

/* ---------- J. Full Application Timeline ---------- */
Object.assign(window, { RASSCReceived, RASSCAssign, RASSCExpert, RASSCPresident, RASSCContract, RASSCPayment,
  RASSCReports,
});
