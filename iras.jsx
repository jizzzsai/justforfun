



const IR = window.AU;


function IRASDashboard({ navigate }) {
  return (
    <>
      <PageHeader
        title="IRAS Dashboard"
        desc="University-level review, expert evaluation, contracts, and disbursement oversight."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="Calendar" size={14} /> AY 2025–2026</button>
            <button className="btn btn-primary" onClick={() => navigate("i-received")}>
              <Icon name="Inbox" size={14} /> Open Queue
            </button>
          </>
        }
      />

      <div className="stats">
        <Stat label="Applications Received"          value="14" icon="Inbox" delta="+3 this month" deltaTone="up" />
        <Stat label="Waiting Expert Review"          value="5"  icon="FileSearch" tone="gold" />
        <Stat label="Waiting Committee Decision"     value="3"  icon="Users" tone="navy" />
        <Stat label="Waiting President Approval"     value="2"  icon="Award" tone="" />
        <Stat label="Contract Pending"               value="2"  icon="FileSignature" tone="gold" />
        <Stat label="Payment Pending"                value="4"  icon="Coins" tone="green" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head">
            <h3>Active Applications</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("i-received")}>
              See all <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Researcher</th><th>Status</th></tr>
            </thead>
            <tbody>
              {IR.IRAS_QUEUE.slice(0, 6).map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("i-expert")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell">
                    <div className="t" style={{maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div>
                  </td>
                  <td style={{fontSize: 12}}>{(a.researcher?.name) || "—"}</td>
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
              <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6}}>
                <div>
                  <div className="text-sm text-muted">Total budget</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500, lineHeight: 1.05}}>
                    8.4M <span style={{fontSize: 14, color: "var(--ink-3)"}}>THB</span>
                  </div>
                </div>
                <div style={{textAlign: "right"}}>
                  <div className="text-sm text-muted">Disbursed</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500, color: "var(--au-crimson)"}}>5.2M</div>
                  <div className="text-sm text-muted">61.9%</div>
                </div>
              </div>
              <div className="progress" style={{height: 10}}>
                <div className="bar" style={{width: "61.9%"}}></div>
              </div>
              <div className="grid-3 mt-4" style={{paddingTop: 16, borderTop: "1px solid var(--line)"}}>
                <div><div className="text-sm text-muted">Committed</div><div style={{fontWeight: 600, fontSize: 16}}>1.8M</div></div>
                <div><div className="text-sm text-muted">Disbursed</div><div style={{fontWeight: 600, fontSize: 16, color: "var(--status-paid)"}}>5.2M</div></div>
                <div><div className="text-sm text-muted">Remaining</div><div style={{fontWeight: 600, fontSize: 16, color: "var(--au-gold)"}}>1.4M</div></div>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Workflow Bottlenecks</h3></div>
            <div className="card-body">
              {[
                { s: "Expert Review",      v: "5 apps", d: "Avg. 9.2 days", w: 80 },
                { s: "Committee Decision", v: "3 apps", d: "Avg. 5.4 days", w: 50 },
                { s: "President Approval", v: "2 apps", d: "Avg. 3.1 days", w: 35 },
                { s: "Contract Signing",   v: "2 apps", d: "Avg. 8.0 days", w: 65 },
              ].map((b, i) => (
                <div key={i} style={{marginBottom: 12}}>
                  <div className="flex justify-between mb-2" style={{fontSize: 12}}>
                    <span style={{fontWeight: 600}}>{b.s}</span>
                    <span className="text-muted">{b.v} · {b.d}</span>
                  </div>
                  <div className="progress"><div className="bar" style={{width: `${b.w}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASReceived({ navigate, onDownload }) {
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
        <table className="tbl">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Research Title</th>
              <th>Researcher</th>
              <th>Faculty</th>
              <th>Date Received</th>
              <th>Status</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {IR.IRAS_QUEUE.map(a => (
              <tr key={a.id}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell"><div className="t" style={{maxWidth: 260}}>{a.title}</div></td>
                <td style={{fontSize: 12}}>{(a.researcher?.name) || "—"}</td>
                <td style={{fontSize: 11, color: "var(--ink-3)", maxWidth: 180}}>{a.faculty}</td>
                <td style={{fontSize: 12}}>{a.submittedAt}</td>
                <td><Badge status={a.status} /></td>
                <td className="actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate("i-expert")}>Open</button>
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


function IRASAssign({ toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Assign Expert Reviewers"
        desc="Three reviewers per application — at least two external where possible."
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Assignment Form</h3></div>
            <div className="card-body">
              <div className="field">
                <label>Application</label>
                <select defaultValue="RG-2025-001">
                  <option value="RG-2025-001">RG-2025-001 · AI-Based Research Grant Tracking System for AU</option>
                  <option value="RG-2025-003">RG-2025-003 · Solar-Driven Aquaponics: Yield and Energy Modelling</option>
                  <option value="RG-2025-012">RG-2025-012 · Lightweight On-Device Speech Models</option>
                </select>
              </div>

              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  padding: 14, border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)", marginBottom: 12,
                }}>
                  <div className="eyebrow mb-2">Expert Reviewer #{n}</div>
                  <div className="form-grid">
                    <div className="field" style={{margin: 0}}>
                      <label>Reviewer name</label>
                      <input defaultValue={
                        n === 1 ? "Assoc. Prof. Dr. Expert One" :
                        n === 2 ? "Asst. Prof. Dr. Expert Two" : "Dr. Expert Three"
                      } />
                    </div>
                    <div className="field" style={{margin: 0}}>
                      <label>Affiliation</label>
                      <input defaultValue={
                        n === 1 ? "Chulalongkorn University" :
                        n === 2 ? "Mahidol University" : "Assumption University"
                      } />
                    </div>
                    <div className="field" style={{margin: 0}}>
                      <label>Reviewer type</label>
                      <select defaultValue={n === 3 ? "Internal" : "External"}>
                        <option>External</option>
                        <option>Internal</option>
                      </select>
                    </div>
                    <div className="field" style={{margin: 0}}>
                      <label>Email</label>
                      <input defaultValue={`expert${n}@university.ac.th`} />
                    </div>
                  </div>
                </div>
              ))}

              <div className="form-grid">
                <div className="field">
                  <label>Review deadline</label>
                  <input type="date" defaultValue="2025-11-30" />
                </div>
                <div className="field">
                  <label>Priority</label>
                  <select><option>Standard</option><option>Expedited (5 days)</option></select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted">Reviewers will be emailed a secure link to the proposal.</span>
                <button className="btn btn-primary" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Send review requests?",
                    message: "Three reviewers will receive secure invitation emails with the proposal package.",
                    confirmLabel: "Send Requests",
                    onConfirm: () => toast("Review requests sent (demo)"),
                  })
                }>
                  <Icon name="Send" size={14} /> Send Review Request
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Reviewer Pool</h3>
              <div className="grow"></div>
              <button className="btn btn-ghost btn-sm"><Icon name="Plus" size={12} /> Add</button>
            </div>
            <div>
              {[
                { n: "Assoc. Prof. Dr. Expert One",  a: "Chulalongkorn University", t: "External", load: "2 active" },
                { n: "Asst. Prof. Dr. Expert Two",   a: "Mahidol University",       t: "External", load: "1 active" },
                { n: "Dr. Expert Three",             a: "Assumption University",    t: "Internal", load: "3 active" },
                { n: "Prof. Dr. Sukit Nimnualrat",   a: "KMUTT",                    t: "External", load: "Available" },
                { n: "Dr. Pranee Mongkonsil",        a: "Thammasat University",     t: "External", load: "Available" },
              ].map((e, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderBottom: i < 4 ? "1px solid var(--line-2)" : "none",
                }}>
                  <Avatar initials={e.n.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={32} color={e.t === "Internal" ? "var(--au-crimson)" : "var(--au-navy)"} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 13}}>{e.n}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.a}</div>
                  </div>
                  <span className={`badge ${e.t === "Internal" ? "badge-academic" : "badge-iras"}`}>
                    <span className="dot"></span>{e.t}
                  </span>
                  <span className="text-sm text-muted" style={{minWidth: 70, textAlign: "right"}}>{e.load}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASExpert({ onDownload, onView, toast, setConfirm }) {
  const app = IR.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Expert Review"
        desc="Submit evaluation on behalf of an expert reviewer."
        actions={
          <>
            <Badge status={IR.STATUS.expert} />
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
            <div className="card-head"><h3>Proposal Snapshot</h3></div>
            <div className="card-body">
              <div className="eyebrow mb-2">Title</div>
              <div style={{fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 500, marginBottom: 16, lineHeight: 1.3}}>{app.title}</div>

              <div className="eyebrow mb-2">Methodology</div>
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted">Duration</span>
                  <b style={{fontSize: 13}}>{app.duration}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Categories</span>
                  <b style={{fontSize: 13}}>6 budget items</b>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Reviewer Documents</h3></div>
            <div>
              {IR.MOCK_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Review Form</h3></div>
            <div className="card-body">
              <div className="text-sm text-muted mb-3">
                Reviewer: <b>Assoc. Prof. Dr. Expert One</b> · Chulalongkorn University
              </div>

              <div className="field">
                <label>Score (0–100)</label>
                <input defaultValue="86" />
                <div className="progress mt-2"><div className="bar" style={{width: "86%"}}></div></div>
              </div>

              <div className="field">
                <label>Strengths</label>
                <textarea className="comment-input"
                  defaultValue="Clear research question. Methodology is well-defined and the evaluation plan is convincing. Budget breakdown is realistic and well-justified. Team has the technical depth to deliver." />
              </div>

              <div className="field">
                <label>Weaknesses</label>
                <textarea className="comment-input"
                  defaultValue="Risk of scope creep across three faculties. Consider tightening the success metric for cycle time and committing to a fall-back if pilot adoption is below target." />
              </div>

              <div className="field">
                <label>Recommendation</label>
                <select defaultValue="approve">
                  <option value="approve">Approve</option>
                  <option value="revise">Revise</option>
                  <option value="reject">Reject</option>
                </select>
              </div>

              <button className="btn btn-primary btn-block mt-2" onClick={() =>
                setConfirm({
                  kind: "success",
                  title: "Submit expert review?",
                  message: "Your review will be visible to the Research Support Committee.",
                  confirmLabel: "Submit Review",
                  onConfirm: () => toast("Expert review submitted (demo)"),
                })
              }>
                <Icon name="Send" size={14} /> Submit Review
              </button>
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Assigned Reviewers</h3></div>
            <div style={{padding: "8px 0"}}>
              {app.experts.map((e, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px"}}>
                  <Avatar initials={e.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={28} color={e.type === "Internal" ? "var(--au-crimson)" : "var(--au-navy)"} />
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


function IRASCommittee({ onDownload, toast, setConfirm }) {
  const app = IR.PRIMARY_APP;
  const submitted = app.experts.filter(e => e.score !== null);
  const avg = submitted.length ? (submitted.reduce((s, e) => s + e.score, 0) / submitted.length).toFixed(1) : "—";
  return (
    <>
      <PageHeader
        title="Research Support Committee Decision"
        desc="Consolidated expert reviews and committee recommendation."
        actions={
          <>
            <Badge status={IR.STATUS.committee} />
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_expert_reviews.pdf" })}>
              <Icon name="Download" size={13} /> Reviews
            </button>
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_all.zip" })}>
              <Icon name="Download" size={13} /> All Documents
            </button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Expert Reviews</h3>
              <div className="grow"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Average score</span>
                <span style={{fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20, color: "var(--au-crimson)"}}>{avg}</span>
                <span className="text-sm text-muted">/ 100</span>
              </div>
            </div>
            <div>
              {app.experts.map((e, i) => (
                <div key={i} style={{padding: "16px 20px", borderBottom: i < 2 ? "1px solid var(--line-2)" : "none"}}>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar initials={e.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={32} color={e.type === "Internal" ? "var(--au-crimson)" : "var(--au-navy)"} />
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 600, fontSize: 13}}>{e.name}</div>
                      <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.affiliation} · {e.type} · Deadline {e.deadline}</div>
                    </div>
                    {e.score !== null ? (
                      <>
                        <span className="badge badge-approved"><span className="dot"></span>Approve</span>
                        <span style={{fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--ink-1)"}}>{e.score}</span>
                      </>
                    ) : (
                      <span className="badge badge-pending"><span className="dot"></span>In progress</span>
                    )}
                  </div>
                  {e.score !== null ? (
                    <>
                      <div style={{paddingLeft: 44}}>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8}}>
                          <div>
                            <div className="eyebrow mb-2">Strengths</div>
                            <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5}}>
                              {i === 0 ? "Clear question, well-defined methodology, realistic budget breakdown." : "Strong theoretical grounding; team has the technical depth."}
                            </div>
                          </div>
                          <div>
                            <div className="eyebrow mb-2">Weaknesses</div>
                            <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5}}>
                              {i === 0 ? "Scope creep risk across three faculties; tighten cycle-time metric." : "Pilot adoption fallback should be quantified."}
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-ghost btn-sm mt-3"
                          onClick={() => onDownload({ name: `Expert_${i+1}_Review.pdf` })}>
                          <Icon name="Download" size={12} /> Download review
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{paddingLeft: 44, fontSize: 12, color: "var(--ink-3)"}}>
                      Review not yet submitted. Reminder will be sent on Nov 28.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Committee Decision</h3></div>
            <div className="card-body">
              <div style={{padding: 16, background: "var(--paper-warm)", borderRadius: "var(--r-md)", marginBottom: 16}}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted">Reviews completed</span>
                  <b>2 of 3</b>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted">Average score</span>
                  <b style={{color: "var(--au-crimson)"}}>{avg} / 100</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Recommendation rate</span>
                  <b>100% approve</b>
                </div>
              </div>

              <div className="field">
                <label>Committee comment</label>
                <textarea className="comment-input"
                  defaultValue="Two of three expert reviews indicate Approve with an average score of 83.5. Pending third review, the committee is inclined to recommend the application to the President with the conditions raised by the experts." />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-primary btn-block" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Recommend to President?",
                    message: "The application will move to the President's queue for final approval.",
                    confirmLabel: "Recommend",
                    onConfirm: () => toast("Recommended to President (demo)"),
                  })
                }>
                  <Icon name="Award" size={14} /> Recommend to President
                </button>
                <button className="btn btn-secondary btn-block" onClick={() =>
                  setConfirm({
                    kind: "primary",
                    title: "Request revision?",
                    message: "The application will be returned to the researcher with committee notes.",
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
                    message: "Rejection by the committee is final at the IRAS level.",
                    confirmLabel: "Reject",
                    onConfirm: () => toast("Application rejected (demo)"),
                  })
                }>
                  <Icon name="X" size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASPresident({ onDownload, toast, setConfirm }) {
  const app = IR.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="President Approval"
        desc="Final university-level decision before contract issuance."
        actions={
          <>
            <Badge status={IR.STATUS.president} />
            <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_full_package.zip" })}>
              <Icon name="Download" size={13} /> Full Package
            </button>
          </>
        }
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Executive Summary</h3></div>
            <div className="card-body">
              <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 16, background: "var(--paper-warm)", borderRadius: "var(--r-md)", marginBottom: 16}}>
                <div>
                  <div className="text-sm text-muted">Application ID</div>
                  <div className="id" style={{fontWeight: 600, marginTop: 2}}>{app.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Avg. expert score</div>
                  <div style={{fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--au-crimson)"}}>83.5</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Budget</div>
                  <div style={{fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22}}>{fmtBaht(app.budgetTotal)}</div>
                </div>
              </div>

              <div className="eyebrow mb-2">Research Title</div>
              <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500, lineHeight: 1.25, marginBottom: 16}}>
                {app.title}
              </div>

              <div className="eyebrow mb-2">Abstract</div>
              <p style={{margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)"}}>{app.abstract}</p>

              <div className="grid-2eq">
                <div>
                  <div className="eyebrow mb-2">Researcher</div>
                  <div style={{fontWeight: 600}}>{app.researcher.name}</div>
                  <div style={{fontSize: 12, color: "var(--ink-3)"}}>{app.researcher.title} · {app.department}</div>
                </div>
                <div>
                  <div className="eyebrow mb-2">Duration</div>
                  <div style={{fontWeight: 500}}>{app.duration}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Research Support Committee Recommendation</h3></div>
            <div className="card-body">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-approved"><span className="dot"></span>Recommend to President</span>
                <span className="text-sm text-muted">· Nov 12, 2025</span>
              </div>
              <p style={{margin: 0, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55}}>
                Two of three expert reviews indicate Approve with an average score of 83.5. The committee
                recommends approval with the conditions raised by the experts — tightening the cycle-time metric
                and quantifying the pilot adoption fallback.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Presidential Decision</h3></div>
            <div className="card-body">
              <div style={{
                padding: 14, background: "var(--au-crimson-soft)",
                borderRadius: "var(--r-md)", marginBottom: 16,
                display: "flex", gap: 10,
              }}>
                <Icon name="ShieldCheck" size={18} style={{color: "var(--au-crimson)", flexShrink: 0, marginTop: 2}} />
                <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5}}>
                  Approval issues a research grant contract for the researcher. The contract must be signed
                  within <b>15 days</b> of issuance.
                </div>
              </div>

              <div className="field">
                <label>Presidential note</label>
                <textarea className="comment-input" placeholder="Optional note attached to approval…" />
              </div>

              <div className="flex flex-col gap-2">
                <button className="btn btn-primary btn-block" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Approve and issue contract?",
                    message: "A contract template will be generated for the researcher to sign within 15 days.",
                    confirmLabel: "Approve",
                    onConfirm: () => toast("Approved by President (demo)"),
                  })
                }>
                  <Icon name="Award" size={14} /> Approve
                </button>
                <button className="btn btn-secondary btn-block" onClick={() => toast("Clarification requested (demo)")}>
                  <Icon name="HelpCircle" size={14} /> Request Clarification
                </button>
                <button className="btn btn-danger btn-block" onClick={() =>
                  setConfirm({
                    kind: "danger",
                    title: "Reject this application?",
                    message: "Rejection by the President is final.",
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
              <Timeline steps={IR.ALL_STAGES.slice(0, 8)} app={app} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASContract({ onDownload, toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Contract Management"
        desc="RG-2025-001 · Issue, track, and finalise the research grant contract."
        actions={<Badge status={IR.STATUS.contractP} />}
      />

      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Contract Status</h3></div>
            <div className="card-body">
              <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16}}>
                <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">President approval date</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginTop: 4}}>Nov 14, 2025</div>
                </div>
                <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Signing deadline</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginTop: 4, color: "var(--au-crimson)"}}>Nov 29, 2025</div>
                  <div className="text-sm text-muted" style={{marginTop: 2}}>Within 15 days of approval</div>
                </div>
                <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Contract status</div>
                  <div style={{marginTop: 8}}><Badge status={IR.STATUS.contractP} /></div>
                </div>
                <div style={{padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Total grant</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginTop: 4}}>{fmtBaht(100000)}</div>
                </div>
              </div>

              <div className="upload-box mt-4">
                <Icon name="Upload" size={26} className="icon" />
                <div className="t">Upload signed contract</div>
                <div className="s">PDF · max 10 MB · signed by Researcher, Dean and President</div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_Contract_Template.pdf" })}>
                  <Icon name="Download" size={13} /> Contract Template
                </button>
                <button className="btn btn-secondary" onClick={() => onDownload({ name: "RG-2025-001_Signed_Contract.pdf" })}>
                  <Icon name="Download" size={13} /> Signed Contract
                </button>
                <div style={{flex: 1}}></div>
                <button className="btn btn-primary" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Mark contract as signed?",
                    message: "First payment (30%) will be released to OFM for processing.",
                    confirmLabel: "Mark Signed",
                    onConfirm: () => toast("Contract marked as signed (demo)"),
                  })
                }>
                  <Icon name="FileSignature" size={14} /> Mark Contract Signed
                </button>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Contract History</h3></div>
            <div className="card-body">
              <Timeline
                steps={[
                  { key: "issue",  label: "Contract template issued" },
                  { key: "review", label: "Researcher review" },
                  { key: "sign",   label: "Signatures collected (Researcher, Dean, President)" },
                  { key: "file",   label: "Contract filed and archived" },
                  { key: "pay",    label: "First payment 30% released" },
                ]}
                app={{ timeline: {
                  issue:  { done: true,    date: "Nov 14, 2025", who: "IRAS Office" },
                  review: { current: true, date: "In progress",  who: "Dr. Phyo Min Tun" },
                  sign:   { date: "Pending" },
                  file:   { date: "Pending" },
                  pay:    { date: "Pending" },
                }}}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Contract Documents</h3></div>
            <div>
              <FileRow
                doc={{ name: "Research_Grant_Contract_Template.pdf", size: "84 KB", uploadedAt: "Nov 14, 2025" }}
                onDownload={onDownload}
                onView={d => toast("Demo only: preview not available")}
              />
              <FileRow
                doc={{ name: "Annex_A_Budget_Schedule.pdf", size: "62 KB", uploadedAt: "Nov 14, 2025" }}
                onDownload={onDownload}
                onView={d => toast("Demo only: preview not available")}
              />
              <FileRow
                doc={{ name: "Annex_B_Reporting_Schedule.pdf", size: "48 KB", uploadedAt: "Nov 14, 2025" }}
                onDownload={onDownload}
                onView={d => toast("Demo only: preview not available")}
              />
            </div>
          </div>

          <div className="card card-pad-0 mt-4">
            <div className="card-head"><h3>Reminders</h3></div>
            <div className="card-body">
              <div className="flex items-start gap-3 mb-3">
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--au-crimson-soft)", color: "var(--au-crimson)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon name="Clock" size={14} />
                </div>
                <div>
                  <div style={{fontSize: 13, fontWeight: 600}}>11 days until signing deadline</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>Reminder will be sent Nov 22, 2025</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--au-gold-soft)", color: "var(--au-gold)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon name="Mail" size={14} />
                </div>
                <div>
                  <div style={{fontSize: 13, fontWeight: 600}}>Notification sent to Dean</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>Awaiting Dean's signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASPayment({ onDownload, toast, setConfirm }) {
  const rows = [
    { id: "RG-2025-001", title: "AI-Based Research Grant Tracking System", who: "Dr. Phyo Min Tun",         total: 100000, p1: "pending", p2: "draft", p3: "draft", clearance: "Awaiting contract" },
    { id: "RG-2025-004", title: "Privacy-Preserving Recommender Systems",  who: "Dr. Chayanon Inthawong",   total:  95000, p1: "pending", p2: "draft", p3: "draft", clearance: "Awaiting contract" },
    { id: "RG-2025-005", title: "Cultural Heritage Preservation",          who: "Dr. Nisachon Charoenwong", total:  75000, p1: "ready",   p2: "draft", p3: "draft", clearance: "Contract signed" },
    { id: "RG-2025-006", title: "Wearable EEG Monitoring",                 who: "Dr. Karunee Sritrakul",    total: 140000, p1: "paid",    p2: "pending", p3: "draft", clearance: "Progress report under review" },
    { id: "RG-2025-007", title: "Mangrove Resilience to Salinity",         who: "Dr. Apichat Phongphan",    total: 210000, p1: "paid",    p2: "paid",   p3: "pending", clearance: "Final report under review" },
  ];

  const cell = (v) => {
    const map = {
      paid:    { cls: "badge-paid",     label: "Paid" },
      ready:   { cls: "badge-approved", label: "Ready" },
      pending: { cls: "badge-pending",  label: "Pending" },
      draft:   { cls: "badge-draft",    label: "Not due" },
    };
    const x = map[v];
    return <span className={`badge ${x.cls}`}><span className="dot"></span>{x.label}</span>;
  };

  return (
    <>
      <PageHeader
        title="Finance / OFM Payment"
        desc="Process disbursements after each milestone: contract, progress report, final report."
      />

      <div className="stats" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <Stat label="Total Allocated"   value="620k THB" icon="Coins" />
        <Stat label="Disbursed YTD"     value="430k THB" icon="TrendingUp" tone="green" />
        <Stat label="Pending Approval"  value="3"        icon="Clock"      tone="gold" />
        <Stat label="Receipts Cleared"  value="9 / 12"   icon="CheckCircle" tone="navy" />
      </div>

      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by ID or researcher…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All payments</button>
          <button className="filter"><Icon name="Calendar" size={12} /> This semester</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: "Disbursement_Log.csv" })}>
            <Icon name="Download" size={12} /> Export
          </button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Research</th>
              <th>Researcher</th>
              <th style={{textAlign: "right"}}>Total</th>
              <th>1st 30%</th>
              <th>2nd 40%</th>
              <th>3rd 30%</th>
              <th>Receipt clearance</th>
              <th style={{textAlign: "right"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="title-cell">
                  <div className="t">{r.id}</div>
                  <div className="s" style={{maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{r.title}</div>
                </td>
                <td style={{fontSize: 12}}>{r.who}</td>
                <td style={{textAlign: "right", fontWeight: 600}}>{fmtBaht(r.total)}</td>
                <td>{cell(r.p1)}</td>
                <td>{cell(r.p2)}</td>
                <td>{cell(r.p3)}</td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{r.clearance}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: `${r.id}_receipt.pdf` })}>
                    <Icon name="Download" size={13} /> Receipt
                  </button>
                  <button className="btn btn-primary btn-sm" disabled={r.p1 !== "ready" && r.p2 !== "pending" && r.p3 !== "pending"}
                    onClick={() => setConfirm({
                      kind: "success",
                      title: "Process payment?",
                      message: `Disburse next tranche for ${r.id}. The researcher will be notified.`,
                      confirmLabel: "Process Payment",
                      onConfirm: () => toast("Payment processed (demo)"),
                    })}>
                    Process
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


function IRASReports({ onDownload, onView, toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Report Review"
        desc="Review and approve progress and final reports submitted by researchers."
      />

      <div className="grid-2eq">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Progress Reports · Awaiting Review</h3></div>
          <div>
            {[
              { id: "RG-2025-006", title: "Wearable EEG Monitoring", who: "Dr. Karunee Sritrakul", submitted: "Apr 12, 2026" },
              { id: "RG-2025-004", title: "Privacy-Preserving Recommender Systems", who: "Dr. Chayanon Inthawong", submitted: "Apr 18, 2026" },
            ].map((r, i) => (
              <div key={r.id} style={{padding: "16px 20px", borderBottom: i < 1 ? "1px solid var(--line-2)" : "none"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--r-sm)",
                    background: "var(--au-crimson-soft)", color: "var(--au-crimson)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name="FileText" size={18} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 13}}>{r.title}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{r.id} · {r.who} · Submitted {r.submitted}</div>
                  </div>
                  <Badge status={IR.STATUS.progress} />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => onView({ name: `${r.id}_Progress_Report.pdf` })}>
                    <Icon name="Eye" size={12} /> View
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: `${r.id}_Progress_Report.pdf` })}>
                    <Icon name="Download" size={12} /> Download
                  </button>
                  <div style={{flex: 1}}></div>
                  <button className="btn btn-danger btn-sm">
                    <Icon name="Repeat" size={12} /> Request Revision
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() =>
                    setConfirm({
                      kind: "success",
                      title: "Approve progress report?",
                      message: `Approval will trigger the second disbursement (40%) for ${r.id}.`,
                      confirmLabel: "Approve",
                      onConfirm: () => toast("Progress report approved (demo)"),
                    })
                  }>
                    <Icon name="CheckCircle" size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Final Reports · Awaiting Review</h3></div>
          <div>
            {[
              { id: "RG-2025-007", title: "Mangrove Resilience to Salinity", who: "Dr. Apichat Phongphan", submitted: "Oct 02, 2026" },
              { id: "RG-2024-114", title: "Federated Plagiarism Detection",  who: "Dr. Phyo Min Tun",      submitted: "Sep 25, 2025" },
            ].map((r, i) => (
              <div key={r.id} style={{padding: "16px 20px", borderBottom: i < 1 ? "1px solid var(--line-2)" : "none"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--r-sm)",
                    background: "var(--au-gold-soft)", color: "var(--au-gold)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name="FileCheck" size={18} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 13}}>{r.title}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{r.id} · {r.who} · Submitted {r.submitted}</div>
                  </div>
                  <Badge status={IR.STATUS.final} />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => onView({ name: `${r.id}_Final_Report.pdf` })}>
                    <Icon name="Eye" size={12} /> View
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => onDownload({ name: `${r.id}_Final_Report.pdf` })}>
                    <Icon name="Download" size={12} /> Download
                  </button>
                  <div style={{flex: 1}}></div>
                  <button className="btn btn-danger btn-sm">
                    <Icon name="Repeat" size={12} /> Request Revision
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() =>
                    setConfirm({
                      kind: "success",
                      title: "Approve final report?",
                      message: `Approval will trigger the final disbursement (30%) for ${r.id}.`,
                      confirmLabel: "Approve",
                      onConfirm: () => toast("Final report approved (demo)"),
                    })
                  }>
                    <Icon name="CheckCircle" size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


function IRASFullTimeline() {
  const app = IR.PRIMARY_APP;
  return (
    <>
      <PageHeader
        title="Full Application Timeline"
        desc={`Complete fourteen-stage workflow for ${app.id} — ${app.title}`}
        actions={<Badge status={app.status} />}
      />

      <div className="card mb-6" style={{overflowX: "auto"}}>
        <div style={{minWidth: 1100}}>
          <HTimeline steps={IR.ALL_STAGES} app={app} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Stage Log</h3></div>
          <div className="card-body">
            <Timeline steps={IR.ALL_STAGES} app={app} />
          </div>
        </div>
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Summary</h3></div>
            <div className="card-body">
              <div className="grid-2eq" style={{gap: 12}}>
                <div style={{padding: 12, background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Stages complete</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>5 / 14</div>
                </div>
                <div style={{padding: 12, background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Days elapsed</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>27</div>
                </div>
                <div style={{padding: 12, background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">Avg. stage time</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500}}>3.4 days</div>
                </div>
                <div style={{padding: 12, background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
                  <div className="text-sm text-muted">ETA to contract</div>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500, color: "var(--au-crimson)"}}>~18 days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head"><h3>Stakeholders</h3></div>
            <div style={{padding: "8px 0"}}>
              {[
                { n: "Dr. Phyo Min Tun",                    r: "Principal Researcher",       c: "var(--au-crimson)" },
                { n: "K. Suthida (Faculty Office)",         r: "Document Check",             c: "var(--au-navy)" },
                { n: "Assoc. Prof. Dr. Watcharee S.",       r: "Academic Committee Chair",   c: "var(--au-gold)" },
                { n: "Dean, VMS-EST",                       r: "Faculty Approval",           c: "var(--au-navy)" },
                { n: "Prof. Dr. Sirilak Khempila",          r: "IRAS Director",              c: "var(--au-crimson)" },
                { n: "Office of Financial Management",      r: "Disbursement",               c: "var(--au-gold)" },
              ].map((p, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px"}}>
                  <Avatar initials={p.n.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()} size={28} color={p.c} />
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13, fontWeight: 600}}>{p.n}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{p.r}</div>
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

Object.assign(window, {
  IRASDashboard, IRASReceived, IRASAssign, IRASExpert,
  IRASCommittee, IRASPresident, IRASContract, IRASPayment,
  IRASReports, IRASFullTimeline,
});
