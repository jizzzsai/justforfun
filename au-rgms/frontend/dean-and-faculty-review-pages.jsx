



const FA = window.AU;


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

            {                    }
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
      title="AU-R1 Dean Screening"
      desc="Review the live application and uploaded PDF documents before forwarding to the Faculty Committee."
      render={(app, load) => {
        const docs = app.documents || [];
        const budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
        const requested = Number(app.requested_amount || 0);
        const isR3 = app.grant_type === "au_r3";
        const grantCap = app.grant_type === "au_r3" ? 3500 : app.grant_type === "au_r4" ? 80000 : 100000;
        const grantCode = app.grant_type === "au_r3" ? "AU-R3" : app.grant_type === "au_r4" ? "AU-R4" : "AU-R1";
        const forward = () => setConfirm({
          kind: "success",
          title: isR3 ? "Forward to RASSC?" : "Forward to Faculty Committee?",
          message: isR3
            ? app.code + " is an AU-R3 paper presentation request — it goes straight to RASSC screening."
            : app.code + " will move to committee review.",
          confirmLabel: "Forward", withReason: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason); toast(app.code + (isR3 ? " forwarded to RASSC." : " forwarded to Faculty Committee.")); navigate("d-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger",
          title: "Return to researcher?",
          message: app.code + " will be marked returned for revision.",
          confirmLabel: "Return", withReason: true, reasonLabel: "Dean comment", reasonRequired: true,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        return (
          <>
            <PageHeader
              title={"AU-R1 Dean Screening - " + app.code}
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
                    <div className="meta-row"><span className="l">Faculty</span><span className="r">{app.faculty || "-"}</span></div>
                    <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
                    <ResearcherServiceEligibilityRows app={app} />
                    <div className="eyebrow mt-4 mb-2">Expected outcomes / summary</div>
                    <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{app.abstract || "No summary entered."}</p>
                  </div>
                </div>

                <ResearcherInformationCard app={app} className="mb-4" />

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>{isR3 ? "Grant Amount" : "Budget Review"}</h3></div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
                      <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(requested)}</span></div>
                      <div className="meta-row"><span className="l">{isR3 ? "AU-R3 fixed grant" : grantCode + " ceiling"}</span><span className="r">{grantCap.toLocaleString()} THB</span></div>
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
              <div className="card card-pad-0" style={{ alignSelf: "start" }}>
                <div className="card-head"><h3>Dean Decision</h3></div>
                <div className="card-body">
                  <div className="flex flex-col gap-2">
                    <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
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


function r3Badge(status) {
  var base = window.DB.statusBadge(status);
  var labels = {
    submitted: "Pending Dean Review",
    iras_review: "Under IRAS Review",
    approved: "Awaiting Finance Approval",
    active: "Paid",
    completed: "Paid / Completed",
    returned: "Returned for Revision",
    rejected: "Rejected",
  };
  return { key: base.key, cls: base.cls, label: labels[status] || base.label };
}

function DeanR3Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader
      status="submitted"
      applicationId={applicationId}
      title="AU-R3 Screening"
      desc="Review the conference, paper, conference classification, and documents before forwarding to IRAS."
      render={(app, load) => {
        const docs = app.documents || [];
        const ci = app.conference_info || {};
        const r = app.researcher || {};

        const hasDoc = (kw) => docs.some(d => ((d.doc_type || "") + " " + (d.name || "")).toLowerCase().includes(kw));
        const docCats = [
          { label: "Full Conference Paper", required: true, ok: hasDoc("conference paper") || hasDoc("full paper") },
          { label: "Turnitin Report", required: true, ok: hasDoc("turnitin") },
          { label: "Conference Acceptance Letter", required: true, ok: hasDoc("acceptance") },
        ];

        const forward = () => setConfirm({
          kind: "success",
          title: "Approve & forward to IRAS?",
          message: app.code + " will be recorded as approved by the Dean and sent to IRAS for eligibility and document verification.",
          confirmLabel: "Approve & Forward", withReason: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason); toast(app.code + " approved — forwarded to IRAS."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger",
          title: "Return for revision?",
          message: app.code + " will be sent back to the researcher. Explain what needs to be fixed (for example, a clearer Turnitin report or corrected conference classification).",
          confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });

        const intl = ci.confType === "International";
        return (
          <>
            <PageHeader
              title={"AU-R3 Screening — " + app.code}
              desc={(ci.researcherName || r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department")}
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
                        <div className="meta-row"><span className="l">Conference location</span><span className="r">{ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", ") || "-"}</span></div>
                        <div className="meta-row"><span className="l">Presentation date</span><span className="r">{(ci.presentationDate || ci.confStart) ? window.DB.fmtDate(ci.presentationDate || ci.confStart) : "-"}</span></div>
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
                    <div className="meta-row"><span className="l">Author(s)</span><span className="r">{[(ci.researcherName || r.full_name) + " (" + (ci.authorType || "Lead Author") + ")"].concat((app.co_members || []).map(m => m.name + " (" + (m.authorType || "Co-author") + ")" + (m.kind === "Student" ? " · Student" : ""))).filter(Boolean).join(", ")}</span></div>
                    <div className="meta-row"><span className="l">Corresponding author</span><span className="r">{ci.correspondingAuthor || "-"}</span></div>
                    {ci.paperAbstract && (
                      <>
                        <div className="eyebrow mt-4 mb-2">Abstract</div>
                        <p style={{ margin: 0, lineHeight: 1.65, color: "var(--ink-2)" }}>{ci.paperAbstract}</p>
                      </>
                    )}
                    <div className="meta-row" style={{ marginTop: 10 }}><span className="l">Keywords</span><span className="r">{app.keywords || "-"}</span></div>
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Researcher Information</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Name</span><span className="r">{((r.name_title || r.title) ? (r.name_title || r.title) + " " : "") + (r.full_name || "-")}</span></div>
                    <div className="meta-row"><span className="l">Academic / administrative position</span><span className="r">{r.academic_position || "-"}</span></div>
                    <div className="meta-row"><span className="l">AU ID</span><span className="r">{r.au_id || "-"}</span></div>
                    <div className="meta-row"><span className="l">Email</span><span className="r">{r.email || "-"}</span></div>
                    <div className="meta-row"><span className="l">Phone</span><span className="r">{r.phone || "-"}</span></div>
                    <div className="meta-row"><span className="l">Office / Room</span><span className="r">{r.office_room || "-"}</span></div>
                    <div className="meta-row"><span className="l">Faculty</span><span className="r">{app.faculty || "-"}</span></div>
                    <div className="meta-row"><span className="l">Department</span><span className="r">{app.department || "-"}</span></div>
                    <ResearcherServiceEligibilityRows app={app} />
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Conference Classification</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Conference Database / Index</span><span className="r">{ci.journalDb || "-"}</span></div>
                    <div className="meta-row"><span className="l">Conference Classification</span><span className="r">{ci.journalClassification || "-"}</span></div>
                    <div className="meta-row"><span className="l">Fixed AU-R3 grant</span><span className="r">{fmtBaht(3500)}</span></div>
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
                <div className="card-head"><h3>Dean Decision</h3></div>
                <div className="card-body">
                  <div className="flex flex-col gap-2">
                    <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to IRAS</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
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


function r4Badge(status) {
  var base = window.DB.statusBadge(status);
  var labels = {
    submitted: "Pending Dean Review", committee_review: "Faculty Committee Review", iras_review: "Under IRAS Verification",
    approved: "Awaiting Finance Payment", active: "Paid", completed: "Paid / Completed",
    returned: "Returned for Revision", rejected: "Rejected",
  };
  return { key: base.key, cls: base.cls, label: labels[status] || base.label };
}

function DeanR4Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader
      status="submitted"
      applicationId={applicationId}
      title="AU-R4 Screening"
      desc="Review the publication, journal, author, claim and documents; digitally approve the memo, then forward to the Faculty Committee."
      render={(app, load) => {
        const docs = app.documents || [];
        const pi = app.pub_info || {};
        const authors = Array.isArray(app.co_members) ? app.co_members : [];
        const requested = Number(app.requested_amount || 0);
        const MAX = 80000;
        const r = app.researcher || {};
        const hasDoc = (kw) => docs.some(d => ((d.doc_type || "") + " " + (d.name || "")).toLowerCase().includes(kw));
        const docCats = [
          { label: "Full Research Article", req: true, ok: hasDoc("article") },
          { label: "Turnitin Report", req: true, ok: hasDoc("turnitin") },
          { label: "Original Publication Fee Receipt", req: true, ok: hasDoc("receipt") },
          { label: "Memo for Dean Approval", req: true, ok: hasDoc("memo") },
          { label: "Author Contribution Statement", req: authors.length > 1, ok: authors.length <= 1 || hasDoc("author contribution") },
          { label: "Acceptance Letter", req: pi.pubStatus !== "Published", ok: pi.pubStatus === "Published" || hasDoc("acceptance") },
        ];
        const turnitin = Number(pi.turnitin || 0);
        const turnitinBad = turnitin > 20;
        const overMax = requested > MAX;
        const totalContrib = Math.round(Number(pi.totalContribution || authors.reduce((s, a) => s + (Number(a.contribution) || 0), 0)));
        const forward = () => setConfirm({
          kind: "success",
          title: "Confirm AU-R4 Approval",
          message: "By approving, you confirm the Dean screening is complete and the memo is digitally approved. The Faculty Committee will review the application next.",
          confirmLabel: "Confirm & Forward to Committee", withReason: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason || ""); toast(app.code + " approved — forwarded to the Faculty Committee."); navigate("d-r4-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger", title: "Return for Revision?",
          message: app.code + " will be returned to the researcher. State what must be corrected (e.g. upload the original receipt, fix the author contribution percentages).",
          confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-r4-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;

        return (
          <>
            <PageHeader title={"AU-R4 Screening — " + app.code}
              desc={(r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department") + " · " + (pi.journal || "")}
              actions={<Badge status={r4Badge(app.status)} />} />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Publication Information</h3></div>
                  <div className="card-body">
                    {row("Article title", app.title)}
                    {row("Article type", pi.articleType)}
                    {row("Publication status", pi.pubStatus)}
                    {row("Journal", pi.journal)}
                    {row("Publisher", pi.publisher)}
                    {pi.pubStatus === "Published"
                      ? <>{row("Article URL", pi.articleUrl)}{row("DOI", pi.doi)}{row("ISSN / eISSN", pi.issn)}{row("Publication date", pi.pubDate ? window.DB.fmtDate(pi.pubDate) : "-")}{row("Volume / Issue", (pi.volume || "-") + " / " + (pi.issue || "-"))}{row("Page number(s)", pi.pageNumber || [pi.startPage, pi.endPage].filter(Boolean).join("–"))}</>
                      : <>{row("Acceptance date", pi.acceptDate ? window.DB.fmtDate(pi.acceptDate) : "-")}</>}
                    {row("Academic year (AD)", pi.academicYear)}
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Journal Classification</h3></div>
                  <div className="card-body">
                    {row("Database / index", pi.journalDb)}
                    {row("Classification", pi.journalClassification || pi.openAccess)}
                    {row("Publication fee", fmtBaht(Number(pi.feePaid || 0)))}
                    {row("Predatory-journal declaration", pi.predatory ? "Confirmed not predatory" : "Not confirmed")}
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Author &amp; Contribution</h3><div className="grow"></div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: totalContrib === 100 ? "var(--status-approved)" : "var(--au-crimson)" }}>{totalContrib === 100 ? "Valid" : "Requires verification"}</span></div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>
                      {row("Applicant role", pi.applicantRole)}
                    </div>
                    <table className="tbl">
                      <thead><tr><th>Author</th><th>Role</th><th>Email Address</th><th style={{ textAlign: "right" }}>Contrib %</th></tr></thead>
                      <tbody>
                        {authors.map((a, i) => <tr key={i}><td>{a.name}</td><td style={{ fontSize: 12 }}>{a.type}</td><td style={{ fontSize: 12 }}>{a.email || "—"}</td><td style={{ textAlign: "right" }}>{a.contribution || 0}%</td></tr>)}
                        <tr style={{ background: "var(--paper-warm)", fontWeight: 600 }}><td colSpan="3">Total</td><td style={{ textAlign: "right", color: totalContrib === 100 ? "inherit" : "var(--au-crimson)" }}>{totalContrib}%</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Researcher Information</h3></div>
                  <div className="card-body">
                    {row("Name", ((r.name_title || r.title) ? (r.name_title || r.title) + " " : "") + (pi.researcherName || r.full_name || "-"))}
                    {row("Academic / administrative position", r.academic_position)}
                    {row("AU ID", pi.researcherAuId || r.au_id)}
                    {row("Email", pi.contactEmail || r.email)}
                    {row("Phone", r.phone)}
                    {row("Faculty", app.faculty)}
                    {row("Department", app.department)}
                    <ResearcherServiceEligibilityRows app={app} />
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Publication Fee</h3></div>
                  <div className="card-body">
                    {row("Publication fee", fmtBaht(Number(pi.feePaid || 0)))}
                    {row("Requested amount", fmtBaht(requested))}
                    {row("Maximum AU-R4 amount", "80,000 THB per article")}
                    <div className="meta-row"><span className="l">Final IRAS-approved amount</span><span className="r" style={{ color: "var(--ink-3)" }}>Pending IRAS verification</span></div>
                    {overMax && <div style={{ fontSize: 12, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "8px 12px", borderRadius: "var(--r-md)", marginTop: 8 }}>The requested claim exceeds the AU-R4 maximum of 80,000 THB. Return the application for correction.</div>}
                  </div>
                </div>

                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>Turnitin</h3></div>
                  <div className="card-body">
                    {row("Researcher-entered similarity", (pi.turnitin != null ? pi.turnitin + "%" : "-"))}
                    {turnitinBad && <div style={{ fontSize: 12, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "8px 12px", borderRadius: "var(--r-md)", marginTop: 8 }}>Turnitin similarity exceeds the 20% limit. Return the application to the researcher.</div>}
                  </div>
                </div>

                <div className="card card-pad-0">
                  <div className="card-head"><h3>Submitted Documents</h3><div className="grow"></div><span className="text-sm text-muted">{docs.length} uploaded</span></div>
                  <table className="tbl">
                    <thead><tr><th>Document</th><th>Requirement</th><th>Status</th></tr></thead>
                    <tbody>
                      {docCats.map(dc => (
                        <tr key={dc.label}><td>{dc.label}</td>
                          <td style={{ fontSize: 12, color: dc.req ? "var(--au-crimson)" : "var(--ink-3)", fontWeight: dc.req ? 600 : 400 }}>{dc.req ? "Required" : "Optional"}</td>
                          <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: dc.ok ? "var(--status-approved, #2c7a4b)" : "var(--ink-3)" }}><Icon name={dc.ok ? "CheckCircle" : "AlertCircle"} size={14} /> {dc.ok ? "Uploaded" : "Not provided"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    {docs.length === 0 && <Empty title="No uploaded documents" desc="The researcher has not uploaded any PDF documents for this claim." icon="FileText" />}
                    {docs.map(d => <FileRow key={d.id || d.name} doc={d} onDownload={onDownload} onView={onView} />)}
                  </div>
                </div>
              </div>

              <div className="card card-pad-0" style={{ alignSelf: "start" }}>
                <div className="card-head"><h3>Dean Decision</h3></div>
                <div className="card-body">
                  <div className="flex flex-col gap-2">
                    <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to Committee</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
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

function FacultyAcademic({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  const [form, setForm] = useState({ score: "", recommendation: "favorable" });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <LiveAppLoader
      status="committee_review"
      applicationId={applicationId}
      title="Academic Committee Review"
      desc="Submit committee evaluation and recommendation."
      render={(app, load) => {
        const isR4 = app.grant_type === "au_r4";
        const pi = app.pub_info || {};
        const authors = Array.isArray(app.co_members) ? app.co_members : [];
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;
        const recLabel = { favorable: "approved and forwarded", revise: "returned to the researcher for revision" };
        const submit = () => setConfirm({
          kind: form.recommendation === "favorable" ? "success" : "danger",
          title: "Submit Committee Decision?",
          message: app.code + " will be " + (recLabel[form.recommendation] || "moved") + ".",
          confirmLabel: "Submit Decision", withReason: true, reasonLabel: "Committee comment", reasonRequired: form.recommendation !== "favorable",
          onConfirm: async (reason) => {
            try {
              await window.DB.submitCommitteeReview(app.id, Object.assign({}, form, { comments: reason.trim() }));
              toast(app.code + " committee decision submitted.");
              if (navigate) navigate("c-queue"); else load();
            }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        return (
          <>
            <PageHeader
              title={(isR4 ? "AU-R4 Faculty Committee Review - " : "Academic Committee Review - ") + app.code}
              desc={app.title}
              actions={<><Badge status={window.DB.statusBadge(app.status)} /><button className="btn btn-secondary" onClick={() => navigate && navigate("c-queue")}><Icon name="ArrowLeft" size={13} /> Queue</button></>}
            />
            <div className="grid-2">
              <div>
                <div className="card card-pad-0 mb-4">
                  <div className="card-head"><h3>{isR4 ? "Publication Summary" : "Proposal Summary"}</h3></div>
                  <div className="card-body">
                    {isR4 ? (
                      <>
                        {row("Researcher", pi.researcherName || (app.researcher && app.researcher.full_name))}
                        <ResearcherServiceEligibilityRows app={app} />
                        {row("Article title", app.title)}
                        {row("Publication status", pi.pubStatus)}
                        {row("Journal", pi.journal)}
                        {row("Journal database", pi.journalDb)}
                        {row("Classification", pi.journalClassification || pi.openAccess)}
                        {row("Academic year (AD)", pi.academicYear)}
                        {row("Publication fee", fmtBaht(Number(pi.feePaid || 0)))}
                        {row("Requested amount", fmtBaht(Number(app.requested_amount || 0)))}
                        {pi.pubStatus === "Published" && <>{row("Article URL", pi.articleUrl)}{row("DOI", pi.doi)}{row("ISSN / eISSN", pi.issn)}{row("Page number(s)", pi.pageNumber)}</>}
                        <div className="eyebrow" style={{ marginTop: 16, marginBottom: 6 }}>Authors and contribution</div>
                        {authors.map((a, i) => <div className="meta-row" key={i}><span className="l">{a.type || "Author"}</span><span className="r">{a.name || "-"}{a.email ? " · " + a.email : ""}{a.contribution ? " · " + a.contribution + "%" : ""}</span></div>)}
                        {row("Department", app.department)}
                      </>
                    ) : (
                      <>
                        <div className="eyebrow mb-2">Researcher</div>
                        <p style={{ margin: "0 0 12px", color: "var(--ink-2)" }}>{app.researcher ? app.researcher.full_name : "-"}</p>
                        <ResearcherServiceEligibilityRows app={app} />
                        <div className="eyebrow mb-2">Abstract</div>
                        <p style={{ margin: "0 0 16px", lineHeight: 1.6, color: "var(--ink-2)" }}>{app.abstract || "No abstract entered."}</p>
                        <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
                        <div className="meta-row"><span className="l">Duration</span><span className="r">{app.duration_months || 12} months</span></div>
                      </>
                    )}
                    <ReviewCommentHistory app={app} roles={["dean"]} />
                  </div>
                </div>
                {!isR4 && <ResearcherInformationCard app={app} className="mb-4" />}
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
                  <div className="field"><label>Decision</label><select value={form.recommendation} onChange={e => setField("recommendation", e.target.value)}><option value="favorable">Approve &amp; Forward</option><option value="revise">Return for Revision</option></select></div>
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
          kind: kind === "return" ? "danger" : "success",
          title: kind === "advance" ? "Approve and forward to RASSC?" : "Return for revision?",
          message: app.code + " will be " + (kind === "advance" ? "sent to RASSC." : "returned for revision."),
          confirmLabel: kind === "advance" ? "Approve & Forward" : "Return",
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
                    <ResearcherServiceEligibilityRows app={app} />
                    <div className="meta-row"><span className="l">Requested amount</span><span className="r">{fmtBaht(Number(app.requested_amount || 0))}</span></div>
                  </div>
                </div>
                <ResearcherInformationCard app={app} className="mb-4" />
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
  FacultyDashboard, FacultyIncoming, FacultyChecklist, DeanR3Detail, DeanR4Detail,
  FacultyAcademic, FacultyDean,
});
