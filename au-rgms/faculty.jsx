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
        desc="Review submissions from VMS-EST researchers and forward eligible applications to IRAS."
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
        <Stat label="Forwarded to IRAS"           value="9" icon="Send" />
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
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: a.id + "_files.zip" })}>
                    <Icon name="Download" size={13} />
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
function FacultyChecklist({ navigate, onDownload, onView, toast, setConfirm }) {
  const [checks, setChecks] = useState({ doc1: true, doc2: true, doc3: true, doc4: true });
  return (
    <>
      <PageHeader
        title="Document Checklist"
        desc="RG-2025-001 · Dr. Phyo Min Tun · VMS-EST · IT Department"
        actions={
          <>
            <Badge status={FA.STATUS.faculty} />
            <button className="btn btn-secondary" onClick={() => navigate("f-incoming")}>
              <Icon name="ArrowLeft" size={13} /> Back to queue
            </button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Required Forms</h3>
              <div className="grow"></div>
              <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: "RG-2025-001_all.zip" })}>
                <Icon name="Download" size={12} /> Download All
              </button>
            </div>
            <div>
              {FA.MOCK_DOCS.map(d => (
                <div key={d.id} className="file-row">
                  <div className="ficon"><Icon name="FileText" size={18} /></div>
                  <div className="fmeta">
                    <div className="fn">{d.name}</div>
                    <div className="fs">{d.size} · Uploaded {d.uploadedAt}</div>
                  </div>
                  <span className={`badge ${checks[d.id] ? "badge-check" : "badge-missing"}`}>
                    <span className="dot"></span>{checks[d.id] ? "Checked" : "Missing"}
                  </span>
                  <div className="factions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onView(d)}>
                      <Icon name="Eye" size={13} /> View
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => onDownload(d)}>
                      <Icon name="Download" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Office Notes</h3></div>
            <div className="card-body">
              <textarea className="comment-input" placeholder="Add notes for Academic Committee handoff…"
                defaultValue="All required forms received. Budget summary on page 12 matches breakdown table. No discrepancies."></textarea>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Checklist Decision</h3></div>
            <div className="card-body">
              <div className="text-sm text-muted mb-4">
                Confirm the completeness of all required documents before forwarding to the Academic Committee.
              </div>
              {FA.MOCK_DOCS.map(d => (
                <label key={d.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: "1px solid var(--line-2)",
                  cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={!!checks[d.id]}
                    onChange={() => setChecks(c => ({ ...c, [d.id]: !c[d.id] }))}
                    style={{accentColor: "var(--au-crimson)"}}
                  />
                  <div style={{fontSize: 13, flex: 1}}>{d.name.replace(/_/g, " ").replace(".pdf", "")}</div>
                  {checks[d.id]
                    ? <Icon name="CheckCircle" size={16} style={{color: "var(--status-approved)"}} />
                    : <Icon name="AlertCircle" size={16} style={{color: "var(--status-rejected)"}} />}
                </label>
              ))}

              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-primary btn-block" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Forward to Academic Committee?",
                    message: "The application will be moved to the Academic Committee queue for evaluation.",
                    confirmLabel: "Forward",
                    onConfirm: () => toast("Forwarded to Academic Committee (demo)"),
                  })
                }>
                  <Icon name="Send" size={14} /> Forward to Academic Committee
                </button>
                <button className="btn btn-secondary btn-block" onClick={() =>
                  setConfirm({
                    kind: "primary",
                    title: "Mark as complete?",
                    message: "Mark the document review as complete without forwarding yet.",
                    confirmLabel: "Mark Complete",
                    onConfirm: () => toast("Marked complete (demo)"),
                  })
                }>
                  <Icon name="CheckCircle" size={14} /> Mark Complete
                </button>
                <button className="btn btn-danger btn-block" onClick={() =>
                  setConfirm({
                    kind: "danger",
                    title: "Request revision?",
                    message: "The researcher will be notified and the application will return to draft state.",
                    confirmLabel: "Request Revision",
                    onConfirm: () => toast("Revision requested (demo)"),
                  })
                }>
                  <Icon name="Repeat" size={14} /> Request Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- D. Academic Committee Review ---------- */
function FacultyAcademic({ onDownload, onView, toast, setConfirm }) {
  const app = FA.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Academic Committee Review"
        desc="RG-2025-001 · Provide evaluation and recommendation to the Dean."
        actions={
          <>
            <Badge status={FA.STATUS.academic} />
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_proposal.pdf" })}>
              <Icon name="Download" size={13} /> Proposal
            </button>
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_all.zip" })}>
              <Icon name="Download" size={13} /> All Documents
            </button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Proposal Summary</h3></div>
            <div className="card-body">
              <div className="eyebrow mb-2">Research Title</div>
              <div style={{fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 500, marginBottom: 12}}>{app.title}</div>

              <div className="grid-2eq mb-4" style={{padding: "12px 16px", background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
                <div>
                  <div className="text-sm text-muted">Principal Researcher</div>
                  <div style={{fontWeight: 600, marginTop: 2}}>{app.researcher.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Total Grant</div>
                  <div style={{fontWeight: 600, marginTop: 2}}>{fmtBaht(app.budgetTotal)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Faculty</div>
                  <div style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>{app.faculty}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Duration</div>
                  <div style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>{app.duration}</div>
                </div>
              </div>

              <div className="eyebrow mb-2">Objectives</div>
              <ol style={{margin: "0 0 16px 20px", padding: 0, color: "var(--ink-2)", lineHeight: 1.6}}>
                {app.objectives.map((o, i) => <li key={i} style={{marginBottom: 4}}>{o}</li>)}
              </ol>

              <div className="eyebrow mb-2">Methodology</div>
              <p style={{margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)"}}>{app.methodology}</p>

              <div className="eyebrow mb-2">Expected Outcomes</div>
              <ul style={{margin: "0 0 16px 20px", padding: 0, color: "var(--ink-2)", lineHeight: 1.6}}>
                {app.outcomes.map((o, i) => <li key={i} style={{marginBottom: 4}}>{o}</li>)}
              </ul>

              <div className="eyebrow mb-2">Budget</div>
              <table className="tbl" style={{border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                <thead><tr><th>Item</th><th style={{textAlign: "right"}}>Amount</th></tr></thead>
                <tbody>
                  {app.budgetBreakdown.map((b, i) => (
                    <tr key={i}>
                      <td style={{fontSize: 12}}>{b.item}</td>
                      <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12}}>{b.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{background: "var(--paper-warm)", fontWeight: 600}}>
                    <td>Total</td>
                    <td style={{textAlign: "right"}}>{fmtBaht(app.budgetTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Documents</h3></div>
            <div>
              {FA.MOCK_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Committee Decision</h3></div>
            <div className="card-body">
              <div className="text-sm text-muted mb-3">Submit on behalf of: <b>Assoc. Prof. Dr. Watcharee Suwannarat</b></div>

              <div className="field">
                <label>Score (0–100)</label>
                <input defaultValue="84" />
              </div>
              <div className="field">
                <label>Committee comment</label>
                <textarea className="comment-input" defaultValue="The proposed methodology is rigorous and well-aligned with current literature. We recommend tightening the evaluation plan to include a second-semester replication and committing to publishing the anonymised dataset." />
              </div>
              <div className="field">
                <label>Decision</label>
                <select defaultValue="recommend">
                  <option value="recommend">Recommend</option>
                  <option value="revise">Request Revision</option>
                  <option value="reject">Reject</option>
                </select>
              </div>

              <button className="btn btn-primary btn-block mt-2" onClick={() =>
                setConfirm({
                  kind: "success",
                  title: "Submit Committee Decision?",
                  message: "Your recommendation will be forwarded to the Dean for final approval.",
                  confirmLabel: "Submit Decision",
                  onConfirm: () => toast("Decision submitted (demo)"),
                })
              }>
                <Icon name="Send" size={14} /> Submit Decision
              </button>
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Committee Members</h3></div>
            <div style={{padding: "8px 0"}}>
              {[
                { n: "Assoc. Prof. Dr. Watcharee Suwannarat", r: "Chair · IT", status: "Submitted" },
                { n: "Dr. Anuwat Yongprasong",                r: "Member · Biotech", status: "Submitted" },
                { n: "Dr. Lalita Chinokul",                   r: "Member · Edu Tech", status: "Pending" },
              ].map((m, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px"}}>
                  <Avatar initials={m.n.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={28} color="var(--au-navy)" />
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13, fontWeight: 600}}>{m.n}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{m.r}</div>
                  </div>
                  <span className={`badge ${m.status === "Submitted" ? "badge-check" : "badge-pending"}`}>
                    <span className="dot"></span>{m.status}
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

/* ---------- E. Dean Approval ---------- */
function FacultyDean({ onDownload, onView, toast, setConfirm }) {
  const app = FA.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Dean Approval"
        desc="Final faculty-level decision before forwarding to IRAS."
        actions={
          <>
            <Badge status={FA.STATUS.dean} />
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_package.zip" })}>
              <Icon name="Download" size={13} /> Full Package
            </button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Application Summary</h3></div>
            <div className="card-body">
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: "var(--paper-warm)", borderRadius: "var(--r-md)", marginBottom: 16}}>
                <div>
                  <div className="text-sm text-muted">Application ID</div>
                  <div style={{fontWeight: 600, marginTop: 2}} className="id">{app.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Status</div>
                  <div style={{marginTop: 2}}><Badge status={app.status} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted">Researcher</div>
                  <div style={{fontWeight: 600, marginTop: 2}}>{app.researcher.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Department</div>
                  <div style={{fontWeight: 500, marginTop: 2, fontSize: 13}}>{app.department}</div>
                </div>
                <div style={{gridColumn: "1 / -1"}}>
                  <div className="text-sm text-muted">Research Title</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500, marginTop: 2, lineHeight: 1.3}}>{app.title}</div>
                </div>
              </div>

              <div className="eyebrow mb-2">Academic Committee Recommendation</div>
              <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)", marginBottom: 16}}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-approved"><span className="dot"></span>Recommend</span>
                    <span className="text-sm text-muted">Score: <b style={{color: "var(--ink-1)"}}>84 / 100</b></span>
                  </div>
                  <span className="text-sm text-muted">Oct 24, 2025</span>
                </div>
                <p style={{margin: 0, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55}}>
                  Methodology is rigorous and well-aligned with current literature. Committee recommends tightening
                  the evaluation plan to include a second-semester replication and committing to publishing the
                  anonymised dataset.
                </p>
              </div>

              <div className="eyebrow mb-2">Budget</div>
              <div style={{display: "flex", justifyContent: "space-between", padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                <div>
                  <div className="text-sm text-muted">Total Grant Requested</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 500, marginTop: 2}}>
                    {fmtBaht(app.budgetTotal)}
                  </div>
                  <div className="text-sm text-muted">Across 6 categories · {app.duration}</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => onDownload({name: "Budget_Breakdown.pdf"})}>
                  <Icon name="Download" size={12} /> Breakdown
                </button>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Uploaded Documents</h3></div>
            <div>
              {FA.MOCK_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Dean Decision</h3></div>
            <div className="card-body">
              <div style={{
                padding: 14, background: "var(--au-gold-soft)",
                borderRadius: "var(--r-md)", marginBottom: 16,
                display: "flex", gap: 10,
              }}>
                <Icon name="Info" size={18} style={{color: "var(--au-gold)", flexShrink: 0, marginTop: 2}} />
                <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5}}>
                  Approval forwards the application to <b>IRAS</b> for expert review and Research Support
                  Committee evaluation. This action cannot be undone from the Faculty Office.
                </div>
              </div>

              <div className="field">
                <label>Decision note</label>
                <textarea className="comment-input" placeholder="Optional note to attach with the decision…" defaultValue="Approved with the conditions noted by the Academic Committee. Forwarding to IRAS for expert review." />
              </div>

              <div className="flex flex-col gap-2">
                <button className="btn btn-primary btn-block" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Approve and forward to IRAS?",
                    message: "The application will be transferred to the IRAS office for expert review.",
                    confirmLabel: "Approve & Forward",
                    onConfirm: () => toast("Approved and forwarded to IRAS (demo)"),
                  })
                }>
                  <Icon name="ShieldCheck" size={14} /> Approve and Forward to IRAS
                </button>
                <button className="btn btn-secondary btn-block" onClick={() =>
                  setConfirm({
                    kind: "primary",
                    title: "Request revision?",
                    message: "The application will be returned to the researcher with revision notes.",
                    confirmLabel: "Request Revision",
                    onConfirm: () => toast("Revision requested (demo)"),
                  })
                }>
                  <Icon name="Repeat" size={14} /> Request Revision
                </button>
                <button className="btn btn-danger btn-block" onClick={() =>
                  setConfirm({
                    kind: "danger",
                    title: "Reject this application?",
                    message: "Rejection is final at the faculty level. The researcher will be notified.",
                    confirmLabel: "Reject",
                    onConfirm: () => toast("Application rejected (demo)"),
                  })
                }>
                  <Icon name="X" size={14} /> Reject
                </button>
              </div>
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Approval Chain</h3></div>
            <div className="card-body">
              <Timeline steps={FA.ALL_STAGES.slice(0, 5)} app={app} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- F. Faculty Timeline ---------- */
function FacultyTimeline() {
  const app = FA.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Faculty Timeline"
        desc="Faculty-level progress for RG-2025-001 — Researcher → Faculty Office → Academic Committee → Dean → IRAS."
        actions={<Badge status={FA.STATUS.iras} />}
      />

      <div className="card mb-4">
        <HTimeline steps={FA.ALL_STAGES.slice(0, 5)} app={app} />
      </div>

      <div className="card card-pad-0">
        <div className="card-head"><h3>Full Stage Log</h3></div>
        <div className="card-body">
          <Timeline steps={FA.ALL_STAGES.slice(0, 5)} app={app} />
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  FacultyDashboard, FacultyIncoming, FacultyChecklist,
  FacultyAcademic, FacultyDean, FacultyTimeline,
});
