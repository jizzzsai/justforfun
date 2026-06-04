/* ============================================================
   Researcher Dashboard pages
   ============================================================ */

const RA = window.AU;

/* ---------- A. Dashboard Overview ---------- */
function ResearcherDashboard({ navigate, onDownload, onView }) {
  const app = RA.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Researcher Dashboard"
        desc="Welcome back, Dr. Phyo Min Tun. Here is the status of your research grant applications."
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
        <Stat label="Total Applications"  value="4" icon="Folder"     delta="+1 this semester" deltaTone="up" />
        <Stat label="Draft Applications"  value="1" icon="FileText"   tone="navy" />
        <Stat label="Under Review"        value="2" icon="FileSearch" tone="gold" />
        <Stat label="Approved Projects"   value="1" icon="CheckCircle" tone="green" />
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
    name: "Dr. Phyo Min Tun",
    title2: "Assistant Professor",
    email: "phyomintun@au.edu",
    phone: "+66 2 300 4543 ext. 3621",
    school: "Vincent Mary School of Engineering, Science and Technology",
    department: "Information Technology",
    budget: 100000,
    outcome: "A production-ready research grant management portal, two peer-reviewed conference papers, an open dataset of anonymised workflow durations, and training materials.",
  });
  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <>
      <PageHeader
        title="Submit Research Grant Application"
        desc="Complete each section and upload the four required forms before submitting."
        actions={
          <>
            <button className="btn btn-secondary">Save as Draft</button>
            <button className="btn btn-primary" onClick={() => toast("Submitted RG-2025-001 (demo)")}>
              <Icon name="Send" size={13} /> Submit Application
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
          <p className="section-sub">Total request not to exceed 250,000 THB without committee waiver.</p>
          <div className="section-body">
            <div className="form-grid">
              <div className="field">
                <label>Total Grant Requested (THB)</label>
                <input value={draft.budget} onChange={e => upd("budget", e.target.value)} />
              </div>
              <div className="field">
                <label>Currency</label>
                <select><option>Thai Baht (THB)</option></select>
              </div>
              <div className="field full">
                <label>Budget Breakdown</label>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Budget Item</th><th style={{ width: 160, textAlign: "right" }}>Amount (THB)</th></tr>
                    </thead>
                    <tbody>
                      {RA.PRIMARY_APP.budgetBreakdown.map((b, i) => (
                        <tr key={i}>
                          <td>{b.item}</td>
                          <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>{b.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}>
                        <td>Total</td>
                        <td style={{ textAlign: "right" }}>{fmtBaht(RA.PRIMARY_APP.budgetTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
            <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
              {RA.MOCK_DOCS.map(doc => (
                <FileRow key={doc.id} doc={doc} onDownload={onDownload} onView={onView} />
              ))}
            </div>
            <div className="upload-box mt-4">
              <Icon name="Upload" size={26} className="icon" />
              <div className="t">Drag files here or click to upload</div>
              <div className="s">PDF · max 10 MB per file</div>
            </div>
          </div>
        </div>

        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--line)",
          background: "var(--paper-warm)",
          display: "flex", gap: 8, justifyContent: "flex-end",
        }}>
          <button className="btn btn-secondary">Save as Draft</button>
          <button className="btn btn-primary" onClick={() => toast("Submitted RG-2025-001 (demo)")}>
            <Icon name="Send" size={13} /> Submit Application
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- C. My Applications ---------- */
function ResearcherApplications({ navigate, onDownload, openDetail }) {
  const myApps = [
    { ...RA.PRIMARY_APP, stage: "Expert Review" },
    { id: "RG-2025-012", title: "Lightweight On-Device Speech Models for Thai Lecturers", submittedAt: "Oct 22, 2025", stage: "Faculty Office Check", status: RA.STATUS.faculty },
    { id: "RG-2024-114", title: "Federated Plagiarism Detection across Thai Universities", submittedAt: "Jul 09, 2024", stage: "Final Payment", status: RA.STATUS.paid },
    { id: "RG-2025-018", title: "Reinforcement Learning for Adaptive Curriculum Sequencing", submittedAt: "—", stage: "Draft", status: RA.STATUS.draft },
  ];

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
            {myApps.map(a => (
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
              <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: "RG-2025-001_all.zip" })}>
                <Icon name="Download" size={13} /> Download All
              </button>
            </div>
            <div>
              {RA.MOCK_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>

          {/* Comments */}
          <div className="card card-pad-0">
            <div className="card-head"><h3>Reviewer Comments</h3></div>
            <div className="card-body">
              <div className="comment">
                <div className="head">
                  <div className="av">WS</div>
                  <div>
                    <div className="name">Assoc. Prof. Dr. Watcharee Suwannarat</div>
                    <div className="role">Academic Committee Chair · Oct 24, 2025</div>
                  </div>
                  <div className="when">3 weeks ago</div>
                </div>
                <div className="body">
                  The proposed methodology is rigorous and well-aligned with current literature. We recommend tightening the evaluation plan to include a second-semester replication and committing to publishing the anonymised dataset.
                </div>
              </div>
              <div className="comment">
                <div className="head">
                  <div className="av" style={{background: "var(--au-gold)"}}>SK</div>
                  <div>
                    <div className="name">Prof. Dr. Sirilak Khempila</div>
                    <div className="role">RASSC Director · Oct 30, 2025</div>
                  </div>
                  <div className="when">2 weeks ago</div>
                </div>
                <div className="body">
                  Three reviewers have been assigned (two external, one internal). Please address any clarification requests within five working days of receipt.
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
                <textarea className="comment-input" style={{minHeight: 120}}
                  defaultValue="During the first six months, we completed the needs assessment with twenty-four AU faculty members and delivered three iterative prototype releases. Pilot deployment with VMS-EST is scheduled for Month 7."></textarea>
              </div>
              <div className="field">
                <label>Budget utilisation</label>
                <div className="progress" style={{height: 10}}><div className="bar" style={{width: "52%"}}></div></div>
                <div className="flex justify-between mt-2" style={{fontSize: 12, color: "var(--ink-3)"}}>
                  <span>52% spent — 51,800 THB</span>
                  <span>48% remaining — 48,200 THB</span>
                </div>
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
                <button className="btn btn-primary" onClick={() => toast("Progress report submitted (demo)")}>
                  <Icon name="Send" size={13} /> Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Previously Submitted Files</h3></div>
            <div>
              <FileRow doc={{ name: "Progress_Report_M3_Draft.pdf", size: "612 KB", uploadedAt: "Feb 12, 2026" }} onDownload={onDownload} onView={onView} />
              <FileRow doc={{ name: "Budget_Utilisation_M3.pdf",    size: "184 KB", uploadedAt: "Feb 12, 2026" }} onDownload={onDownload} onView={onView} />
              <FileRow doc={{ name: "Pilot_Photos_M3.zip",          size: "4.2 MB", uploadedAt: "Feb 12, 2026" }} onDownload={onDownload} onView={onView} />
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
                  k1: { done: true, date: "Nov 04, 2025" },
                  p1: { current: true, date: "Due: Apr 15, 2026" },
                  p2: { date: "After M6 approval" },
                  f1: { date: "Due: Oct 15, 2026" },
                  f2: { date: "After Final approval" },
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
                  <input defaultValue="99,420" />
                </div>
                <div className="field">
                  <label>Project completion (%)</label>
                  <input defaultValue="100" />
                </div>
                <div className="field full">
                  <label>Outcomes delivered</label>
                  <textarea className="comment-input" defaultValue="Production portal deployed to staging; two conference papers accepted; anonymised dataset published to AU Open Data."></textarea>
                </div>
                <div className="field full">
                  <label>Lessons learned</label>
                  <textarea className="comment-input" defaultValue="Document completeness checks reduced rework by 31%. Reviewer onboarding time was the largest bottleneck."></textarea>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted">Once submitted, the file will be routed to the Research Support Committee.</span>
                <button className="btn btn-primary" onClick={() => toast("Final report submitted (demo)")}>
                  <Icon name="Send" size={13} /> Submit Final Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Previously Submitted Files</h3></div>
            <div>
              <FileRow doc={{ name: "Progress_Report_M6_Final.pdf", size: "1.1 MB", uploadedAt: "Apr 14, 2026" }} onDownload={onDownload} onView={onView} />
              <FileRow doc={{ name: "Conference_Paper_HCI.pdf",     size: "820 KB", uploadedAt: "Aug 02, 2026" }} onDownload={onDownload} onView={onView} />
              <FileRow doc={{ name: "Dataset_Description.pdf",      size: "240 KB", uploadedAt: "Sep 18, 2026" }} onDownload={onDownload} onView={onView} />
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
                    background: i < 1 ? "#DCFCE7" : "var(--line-2)",
                    color: i < 1 ? "#166534" : "var(--ink-4)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name={i < 1 ? "Check" : "Clock"} size={11} />
                  </span>
                  <span style={{fontSize: 13}}>{t}</span>
                  <span className={`badge ${i < 1 ? "badge-check" : "badge-pending"}`} style={{marginLeft: "auto"}}>
                    <span className="dot"></span>{i < 1 ? "Ready" : "Pending"}
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

/* ---------- G. Payment Status ---------- */
function ResearcherPayments({ onDownload, toast }) {
  return (
    <>
      <PageHeader
        title="Payment Status"
        desc="Disbursement tranches for RG-2025-001 · Total grant 100,000 THB"
        actions={<Badge status={RA.STATUS.expert} />}
      />

      <div className="grid-3 mb-6">
        {RA.PAYMENTS.map(p => (
          <div key={p.n} className="pay-card">
            <div className="pay-num">{p.pct}%</div>
            <div className="pct">{p.label} · Tranche {p.n}</div>
            <div className="amt">{fmtBaht(p.amount)}</div>
            <span className={`badge ${p.badge}`}><span className="dot"></span>{p.status}</span>
            <div className="meta-row mt-4"><span className="l">Schedule</span><span className="r">{p.date}</span></div>
            <div className="meta-row"><span className="l">Required document</span><span className="r">{p.requiredDoc}</span></div>
            <div className="meta-row"><span className="l">Receipt</span><span className="r">{p.receipt || "Not issued"}</span></div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-secondary btn-sm" style={{flex: 1}}
                onClick={() => onDownload({ name: `Receipt_Tranche_${p.n}.pdf` })}>
                <Icon name="Download" size={12} /> Receipt
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Demo only: contact OFM")}>
                <Icon name="Mail" size={12} /> Contact OFM
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-pad-0">
        <div className="card-head">
          <h3>Disbursement Log</h3>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Date</th><th>Tranche</th><th>Amount</th><th>Reference</th><th>Status</th><th style={{textAlign:"right"}}>Receipt</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Pending</td>
              <td>1st · 30%</td>
              <td>{fmtBaht(30000)}</td>
              <td><span className="id">—</span></td>
              <td><span className="badge badge-pending"><span className="dot"></span>Pending contract</span></td>
              <td className="actions"><button className="btn btn-ghost btn-sm" disabled>Receipt</button></td>
            </tr>
            <tr>
              <td>Scheduled</td>
              <td>2nd · 40%</td>
              <td>{fmtBaht(40000)}</td>
              <td><span className="id">—</span></td>
              <td><span className="badge badge-draft"><span className="dot"></span>Awaiting progress report</span></td>
              <td className="actions"><button className="btn btn-ghost btn-sm" disabled>Receipt</button></td>
            </tr>
            <tr>
              <td>Scheduled</td>
              <td>3rd · 30%</td>
              <td>{fmtBaht(30000)}</td>
              <td><span className="id">—</span></td>
              <td><span className="badge badge-draft"><span className="dot"></span>Awaiting final report</span></td>
              <td className="actions"><button className="btn btn-ghost btn-sm" disabled>Receipt</button></td>
            </tr>
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
