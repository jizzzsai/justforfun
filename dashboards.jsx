








const D = window.AU;




function QueueTable({ rows, openLabel = "Review", onOpen, onDownload, columns = "full" }) {
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
              <button className="btn btn-ghost btn-sm" onClick={() => onDownload && onDownload({ name: `${a.id}_files.zip` })}>
                <Icon name="Download" size={13} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}




function DeanDashboard({ navigate }) {
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
        <Stat label="Pending First Screening"  value={D.Q_DEAN_SCREEN.length} icon="ClipboardCheck"  tone="gold"  delta="+2 this week" deltaTone="up" />
        <Stat label="Awaiting My Signature"    value={D.Q_DEAN_SIGN.length}   icon="FileSignature"   tone="navy" />
        <Stat label="At Faculty Committee"     value={D.Q_COMMITTEE.length}   icon="Users" />
        <Stat label="Approved This Semester"   value="9"                       icon="CheckCircle"    tone="green" />
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
              {D.Q_DEAN_SCREEN.slice(0, 4).map(a => (
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
              {D.Q_DEAN_SIGN.map(a => (
                <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate("d-sign-detail")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div></td>
                  <td><span className="badge badge-approved"><span className="dot"></span>Recommend</span></td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
              {D.Q_DEAN_SIGN.length === 0 && (
                <tr><td colSpan={4}><Empty title="Nothing to sign" desc="Proposals will appear here after committee review." icon="FileSignature" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}




function DeanScreenQueue({ navigate, onDownload }) {
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
            <input placeholder="Search by ID, researcher, department…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All</button>
          <button className="filter"><Icon name="Briefcase" size={12} /> Department</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <QueueTable
          rows={D.Q_DEAN_SCREEN}
          openLabel="Screen"
          onOpen={() => navigate("d-screen-detail")}
          onDownload={onDownload}
        />
      </div>
    </>
  );
}




function DeanSignQueue({ navigate, onDownload }) {
  return (
    <>
      <PageHeader
        title="Sign &amp; Forward Queue"
        desc="Proposals returning from the Faculty Committee. Sign and forward to IRAS, or return to committee."
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
        <QueueTable
          rows={D.Q_DEAN_SIGN}
          openLabel="Open"
          onOpen={() => navigate("d-sign-detail")}
          onDownload={onDownload}
        />
      </div>
    </>
  );
}




function DeanHistory({ onDownload }) {
  const history = D.APPLICATIONS.filter(a =>
    !["draft", "submitted", "deanScreen"].includes(a.status.key)
  );
  return (
    <>
      <PageHeader title="Decision History" desc="All proposals you've previously screened or signed." />
      <div className="card card-pad-0">
        <QueueTable rows={history} openLabel="View" onDownload={onDownload} />
      </div>
    </>
  );
}




function CommitteeDashboard({ navigate }) {
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
        <Stat label="Awaiting Review"        value={D.Q_COMMITTEE.length} icon="Users"        tone="gold" delta="+1 this week" deltaTone="up" />
        <Stat label="Reviewed This Month"    value="11"                    icon="FileSearch"  tone="navy" />
        <Stat label="Recommended"            value="8"                     icon="CheckCircle" tone="green" />
        <Stat label="Revisions Requested"    value="2"                     icon="Repeat" />
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
              {D.Q_COMMITTEE.map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("c-review")}>
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
            <span className="text-sm text-muted">3 active</span>
          </div>
          <div style={{padding: "8px 0"}}>
            {[
              { n: "Assoc. Prof. Dr. Watcharee Suwannarat", r: "Chair · IT",       k: 12, w: 1 },
              { n: "Dr. Anuwat Yongprasong",                 r: "Member · Biotech", k:  9, w: 2 },
              { n: "Dr. Lalita Chinokul",                    r: "Member · Edu Tech",k: 11, w: 0 },
            ].map((m, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "12px 20px"}}>
                <Avatar initials={m.n.split(" ").slice(-1)[0].slice(0,2).toUpperCase()} color="var(--au-navy)" />
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{m.n}</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>{m.r}</div>
                </div>
                <span className="text-sm text-muted">{m.k} reviews · {m.w} pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


function CommitteeQueue({ navigate, onDownload }) {
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
        <QueueTable rows={D.Q_COMMITTEE} openLabel="Review" onOpen={() => navigate("c-review")} onDownload={onDownload} />
      </div>
    </>
  );
}

function CommitteeHistory({ onDownload }) {
  const history = D.APPLICATIONS.filter(a =>
    ["deanSign", "iras", "expertReview", "presidentApproval", "contractSigned", "pay1", "progressSubmitted", "pay2", "finalSubmitted", "pay3", "revision", "rejected"].includes(a.status.key)
  );
  return (
    <>
      <PageHeader title="Past Reviews" desc="Proposals you've reviewed previously." />
      <div className="card card-pad-0">
        <QueueTable rows={history} openLabel="View" onDownload={onDownload} />
      </div>
    </>
  );
}




function IRASDashboardV2({ navigate }) {
  return (
    <>
      <PageHeader
        title="IRAS Research Office"
        desc="Receive forwarded proposals, screen them, and assign three expert reviewers."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("i-assign")}>
            <Icon name="UserPlus" size={14} /> Assign Reviewers
          </button>
        }
      />

      <div className="stats">
        <Stat label="Received from Dean"        value={D.Q_IRAS.length}      icon="Inbox" tone="gold" />
        <Stat label="Awaiting Screening"        value="3"                     icon="ClipboardCheck" />
        <Stat label="Pending Expert Assignment" value="2"                     icon="UserPlus" tone="navy" />
        <Stat label="Under Expert Review"       value={D.Q_EXPERT.length}    icon="FileSearch" tone="green" />
      </div>

      <div className="grid-2">
        <div className="card card-pad-0">
          <div className="card-head"><h3>Active IRAS Workload</h3>
            <div className="grow"></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("i-received")}>
              See all <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Title</th><th>Faculty</th><th>Status</th></tr></thead>
            <tbody>
              {D.Q_IRAS.map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("i-assign")}>
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
            {[
              { n: "Assoc. Prof. Dr. Suthep Lertsiri",   a: "Chulalongkorn University",  t: "External", load: "2 active" },
              { n: "Asst. Prof. Dr. Marisa Anuwong",     a: "Mahidol University",        t: "External", load: "1 active" },
              { n: "Dr. Kittipan Chaiprasart",           a: "Assumption University",     t: "Internal", load: "3 active" },
              { n: "Prof. Dr. Sukit Nimnualrat",         a: "KMUTT",                     t: "External", load: "Available" },
            ].map((e, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: i < 3 ? "1px solid var(--line-2)" : "none"}}>
                <Avatar initials={e.n.split(" ").slice(-1)[0].slice(0,2).toUpperCase()} color={e.t === "Internal" ? "var(--au-crimson)" : "var(--au-navy)"} />
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{e.n}</div>
                  <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.a}</div>
                </div>
                <span className={`badge ${e.t === "Internal" ? "badge-academic" : "badge-iras"}`}><span className="dot"></span>{e.t}</span>
                <span className="text-sm text-muted" style={{minWidth: 70, textAlign: "right"}}>{e.load}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


function IRASScreen({ navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Office Screening · RG-2025-001"
        desc="Verify proposal completeness before assigning expert reviewers."
        actions={<Badge status={D.STATUS.iras} />}
      />
      <div className="grid-2">
        <div>
          <div className="card card-pad-0 mb-4">
            <div className="card-head"><h3>Forwarded Documents</h3></div>
            <div>
              {D.REQUIRED_DOCS.map(d => <FileRow key={d.id} doc={d} onDownload={onDownload} onView={onView} />)}
            </div>
          </div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Faculty &amp; Committee Trail</h3></div>
            <div className="card-body">
              <Timeline steps={D.ALL_STAGES.slice(0, 5)} app={D.PRIMARY_APP} />
            </div>
          </div>
        </div>
        <div>
          <div className="card card-pad-0">
            <div className="card-head"><h3>Screening Checklist</h3></div>
            <div className="card-body">
              {[
                "All 4 required forms present",
                "Budget total within AU policy ceiling",
                "Department head recommendation valid",
                "Ethics clearance (if applicable) attached",
                "Researcher has no overdue reports",
              ].map((t, i) => (
                <label key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--line-2)" : "none", cursor: "pointer"}}>
                  <input type="checkbox" defaultChecked={i < 4} style={{accentColor: "var(--au-crimson)"}} />
                  <span style={{flex: 1, fontSize: 13}}>{t}</span>
                </label>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-primary btn-block" onClick={() =>
                  setConfirm({
                    kind: "success",
                    title: "Approve screening?",
                    message: "The application is moved to the expert assignment queue.",
                    confirmLabel: "Approve",
                    onConfirm: () => { toast("Screening approved (demo)"); navigate("i-assign"); },
                  })
                }>
                  <Icon name="CheckCircle" size={14} /> Approve &amp; Move to Assignment
                </button>
                <button className="btn btn-secondary btn-block" onClick={() => toast("Returned to Dean (demo)")}>
                  <Icon name="ArrowLeft" size={14} /> Return to Dean
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IRASReviewerPool({ toast }) {
  const pool = [
    { n: "Assoc. Prof. Dr. Suthep Lertsiri",   a: "Chulalongkorn University",  t: "External", expertise: "AI · ML · NLP",         status: "Active",   load: 2 },
    { n: "Asst. Prof. Dr. Marisa Anuwong",     a: "Mahidol University",         t: "External", expertise: "HCI · Edu Tech",        status: "Active",   load: 1 },
    { n: "Dr. Kittipan Chaiprasart",           a: "Assumption University",      t: "Internal", expertise: "Software Engineering",  status: "Active",   load: 3 },
    { n: "Prof. Dr. Sukit Nimnualrat",         a: "KMUTT",                       t: "External", expertise: "Networks · Security",    status: "Active",   load: 0 },
    { n: "Dr. Pranee Mongkonsil",              a: "Thammasat University",        t: "External", expertise: "Economics · Policy",     status: "Active",   load: 0 },
    { n: "Assoc. Prof. Dr. Sasitorn Plee",     a: "Kasetsart University",        t: "External", expertise: "Biotechnology",          status: "Active",   load: 1 },
    { n: "Dr. Anchana Roonsoongnern",          a: "Burapha University",          t: "External", expertise: "Public Health",          status: "Inactive", load: 0 },
  ];
  return (
    <>
      <PageHeader
        title="Reviewer Pool"
        desc="Manage internal and external experts used for proposal evaluation."
        actions={<button className="btn btn-primary"><Icon name="Plus" size={14} /> Add Reviewer</button>}
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search reviewers…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All types</button>
          <button className="filter"><Icon name="Briefcase" size={12} /> Expertise</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Demo only: exporting reviewer list")}><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Affiliation</th>
              <th>Type</th>
              <th>Expertise</th>
              <th>Current Load</th>
              <th>Status</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pool.map((r, i) => (
              <tr key={i}>
                <td>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <Avatar initials={r.n.split(" ").slice(-1)[0].slice(0,2).toUpperCase()} size={28} color={r.t === "Internal" ? "var(--au-crimson)" : "var(--au-navy)"} />
                    <span style={{fontSize: 13, fontWeight: 600}}>{r.n}</span>
                  </div>
                </td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{r.a}</td>
                <td><span className={`badge ${r.t === "Internal" ? "badge-academic" : "badge-iras"}`}><span className="dot"></span>{r.t}</span></td>
                <td style={{fontSize: 12}}>{r.expertise}</td>
                <td style={{fontSize: 12, fontWeight: 600}}>{r.load} active</td>
                <td><span className={`badge ${r.status === "Active" ? "badge-check" : "badge-draft"}`}><span className="dot"></span>{r.status}</span></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm"><Icon name="Edit" size={13} /></button>
                  <button className="btn btn-ghost btn-sm"><Icon name="MoreHorizontal" size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}




function ExpertDashboard({ navigate }) {
  return (
    <>
      <PageHeader
        title="Expert Reviewer Dashboard"
        desc="Proposals assigned to you for scholarly evaluation."
        actions={
          <button className="btn btn-primary" onClick={() => navigate("e-assignments")}>
            <Icon name="Folder" size={14} /> Open Assignments
          </button>
        }
      />

      <div className="stats">
        <Stat label="Active Assignments"     value="3"  icon="Folder"     tone="gold" />
        <Stat label="Due Within 7 Days"      value="1"  icon="Clock"      tone="navy" />
        <Stat label="Completed YTD"          value="12" icon="CheckCircle" tone="green" />
        <Stat label="Avg. Turnaround"        value="8.4 d" icon="TrendingDown" />
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
            {[
              { id: "RG-2025-001", title: "AI-Based Research Grant Tracking System for Assumption University", deadline: "Nov 25, 2025", progress: 80, daysLeft: 3 },
              { id: "RG-2025-014", title: "Pedagogical Agents for Bilingual Foundation Programmes",            deadline: "Nov 30, 2025", progress: 25, daysLeft: 8 },
              { id: "RG-2025-013", title: "Microcredentials and Lifelong Learning Adoption in Thai SMEs",       deadline: "Dec 04, 2025", progress: 0,  daysLeft: 12 },
            ].map(a => (
              <div key={a.id} style={{padding: "16px 20px", borderBottom: "1px solid var(--line-2)", cursor: "pointer"}} onClick={() => navigate("e-evaluate")}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="id">{a.id}</span>
                  <div style={{flex: 1, fontWeight: 600, fontSize: 13, maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div>
                  <span className={`badge ${a.daysLeft < 5 ? "badge-pending" : "badge-draft"}`}>
                    <span className="dot"></span>{a.daysLeft} days left
                  </span>
                </div>
                <div className="progress" style={{height: 5}}><div className="bar" style={{width: `${a.progress}%`}}></div></div>
                <div className="flex justify-between mt-2" style={{fontSize: 11, color: "var(--ink-3)"}}>
                  <span>{a.progress}% complete</span>
                  <span>Deadline · {a.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad-0">
          <div className="card-head"><h3>Reviewer Profile</h3></div>
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials="SL" size={48} color="var(--au-crimson)" />
              <div>
                <div style={{fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18}}>Assoc. Prof. Dr. Suthep Lertsiri</div>
                <div className="text-sm text-muted">External · Chulalongkorn University</div>
              </div>
            </div>
            <div style={{padding: 14, background: "var(--paper-warm)", borderRadius: "var(--r-md)"}}>
              <div className="flex justify-between mb-2"><span className="text-sm text-muted">Expertise</span><b style={{fontSize: 13}}>AI · ML · NLP</b></div>
              <div className="flex justify-between mb-2"><span className="text-sm text-muted">Reviews completed</span><b>12</b></div>
              <div className="flex justify-between mb-2"><span className="text-sm text-muted">Avg. score given</span><b>78 / 100</b></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Avg. turnaround</span><b>8.4 days</b></div>
            </div>

            <div className="mt-4">
              <div className="eyebrow mb-2">Recent recommendations</div>
              <div className="flex gap-2">
                <div style={{flex: 1, padding: 12, background: "#DCFCE7", borderRadius: "var(--r-md)", textAlign: "center"}}>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "#166534"}}>9</div>
                  <div style={{fontSize: 11, color: "#166534"}}>Favorable</div>
                </div>
                <div style={{flex: 1, padding: 12, background: "#FEF3C7", borderRadius: "var(--r-md)", textAlign: "center"}}>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "#92400E"}}>2</div>
                  <div style={{fontSize: 11, color: "#92400E"}}>Revise</div>
                </div>
                <div style={{flex: 1, padding: 12, background: "#FEE2E2", borderRadius: "var(--r-md)", textAlign: "center"}}>
                  <div style={{fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "#991B1B"}}>1</div>
                  <div style={{fontSize: 11, color: "#991B1B"}}>Unfavorable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function ExpertAssignments({ navigate, onDownload }) {
  const assignments = [
    { id: "RG-2025-001", title: "AI-Based Research Grant Tracking System for Assumption University", researcher: "Dr. Phyo Min Tun",          deadline: "Nov 25, 2025", status: "In Progress" },
    { id: "RG-2025-014", title: "Pedagogical Agents for Bilingual Foundation Programmes",            researcher: "Dr. Watcharin Krairat",     deadline: "Nov 30, 2025", status: "Not Started" },
    { id: "RG-2025-013", title: "Microcredentials and Lifelong Learning Adoption in Thai SMEs",       researcher: "Dr. Anchalee Tipsuwan",     deadline: "Dec 04, 2025", status: "Not Started" },
  ];
  return (
    <>
      <PageHeader title="My Assignments" desc="Proposals assigned to you by the IRAS office." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Researcher</th><th>Deadline</th><th>Status</th><th style={{textAlign: "right"}}>Actions</th></tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td><span className="id">{a.id}</span></td>
                <td className="title-cell"><div className="t" style={{maxWidth: 320}}>{a.title}</div></td>
                <td style={{fontSize: 12}}>{a.researcher}</td>
                <td style={{fontSize: 12}}>{a.deadline}</td>
                <td><span className={`badge ${a.status === "In Progress" ? "badge-academic" : "badge-draft"}`}><span className="dot"></span>{a.status}</span></td>
                <td className="actions">
                  <button className="btn btn-primary btn-sm" onClick={() => navigate("e-evaluate")}>
                    {a.status === "Not Started" ? "Start" : "Continue"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: `${a.id}_proposal.pdf` })}>
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


function ExpertHistory({ onDownload }) {
  const history = [
    { id: "RG-2024-114", title: "Federated Plagiarism Detection across Thai Universities",     date: "Jul 22, 2024", score: 78, verdict: "Favorable" },
    { id: "RG-2024-089", title: "Quantum-Inspired Optimization for Logistics Routing",         date: "Jun 14, 2024", score: 84, verdict: "Favorable" },
    { id: "RG-2024-076", title: "Voice Authentication Robust to Accent Drift",                  date: "Apr 02, 2024", score: 62, verdict: "Revise" },
    { id: "RG-2024-061", title: "Lightweight Transformer Inference for IoT Devices",            date: "Mar 18, 2024", score: 81, verdict: "Favorable" },
  ];
  return (
    <>
      <PageHeader title="Submitted Reviews" desc="Reviews you have previously submitted." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Submitted</th><th style={{textAlign: "right"}}>Score</th><th>Verdict</th><th style={{textAlign: "right"}}>Actions</th></tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td><span className="id">{h.id}</span></td>
                <td className="title-cell"><div className="t" style={{maxWidth: 360}}>{h.title}</div></td>
                <td style={{fontSize: 12}}>{h.date}</td>
                <td style={{textAlign: "right", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 16}}>{h.score}</td>
                <td><span className={`badge ${h.verdict === "Favorable" ? "badge-approved" : h.verdict === "Revise" ? "badge-revision" : "badge-rejected"}`}>
                  <span className="dot"></span>{h.verdict}
                </span></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: `${h.id}_my_review.pdf` })}>
                    <Icon name="Download" size={13} /> Review
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




function PresidentDashboard({ navigate }) {
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
        <Stat label="Awaiting My Approval"     value={D.Q_PRESIDENT.length} icon="Award" tone="gold" delta="+1 today" deltaTone="up" />
        <Stat label="Contracts Pending"        value="2"                     icon="FileSignature" tone="navy" />
        <Stat label="Approved YTD"             value="34"                    icon="CheckCircle" tone="green" />
        <Stat label="Total Disbursed YTD"      value="5.2M THB"              icon="Coins" />
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
              {D.Q_PRESIDENT.map(a => (
                <tr key={a.id} style={{cursor: "pointer"}} onClick={() => navigate("p-approve")}>
                  <td><span className="id">{a.id}</span></td>
                  <td className="title-cell"><div className="t" style={{maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div></td>
                  <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600}}>{a.budgetTotal.toLocaleString()}</td>
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
              {[
                { id: "RG-2025-005", title: "Cultural Heritage Preservation", when: "Today, 07:30" },
                { id: "RG-2024-114", title: "Federated Plagiarism Detection",  when: "Jul 12, 2024" },
                { id: "RG-2024-089", title: "Quantum-Inspired Optimization",   when: "Jun 03, 2024" },
              ].map((a, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: i < 2 ? "1px solid var(--line-2)" : "none"}}>
                  <div style={{width: 30, height: 30, borderRadius: "50%", background: "var(--au-cream)", color: "var(--au-crimson)", display: "grid", placeItems: "center"}}>
                    <Icon name="Award" size={14} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13}}><b>{a.id}</b> · <span style={{color: "var(--ink-3)"}}>{a.title}</span></div>
                    <div style={{fontSize: 11, color: "var(--ink-3)"}}>{a.when}</div>
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


function PresidentQueue({ navigate, onDownload }) {
  return (
    <>
      <PageHeader title="Final Approval Queue" desc="Proposals awaiting your decision." />
      <div className="card card-pad-0">
        <QueueTable rows={D.Q_PRESIDENT} openLabel="Open" onOpen={() => navigate("p-approve")} onDownload={onDownload} />
      </div>
    </>
  );
}




function OFMDashboard({ navigate }) {
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
        <Stat label="Pending Disbursement"   value="5"           icon="Clock"         tone="gold" />
        <Stat label="Paid This Month"        value="430k THB"    icon="TrendingUp"    tone="green" delta="+18% vs last month" deltaTone="up" />
        <Stat label="Receipts Cleared"       value="9 / 12"      icon="CheckCircle"   tone="navy" />
        <Stat label="Total YTD"              value="5.2M THB"    icon="Coins" />
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
              {[
                { id: "RG-2025-001", who: "Dr. Phyo Min Tun",          stage: "1st 30%", amount: 30000, status: "paymentPending" },
                { id: "RG-2025-004", who: "Dr. Chayanon Inthawong",    stage: "1st 30%", amount: 28500, status: "paymentPending" },
                { id: "RG-2025-005", who: "Dr. Nisachon Charoenwong",  stage: "1st 30%", amount: 22500, status: "paymentPending" },
                { id: "RG-2025-006", who: "Dr. Karunee Sritrakul",     stage: "2nd 40%", amount: 56000, status: "paymentPending" },
                { id: "RG-2025-007", who: "Dr. Apichat Phongphan",     stage: "Final 30%", amount: 63000, status: "paymentPending" },
              ].map(p => (
                <tr key={p.id + p.stage} style={{cursor: "pointer"}} onClick={() => navigate("o-detail")}>
                  <td><span className="id">{p.id}</span></td>
                  <td style={{fontSize: 12}}>{p.who}</td>
                  <td style={{fontSize: 12}}>{p.stage}</td>
                  <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600}}>{p.amount.toLocaleString()} THB</td>
                  <td><Badge status={D.STATUS[p.status]} /></td>
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


function OFMDetail({ onDownload, toast, setConfirm }) {
  return (
    <>
      <PageHeader
        title="Grant Detail · RG-2025-005"
        desc="Cultural Heritage Preservation · Dr. Nisachon Charoenwong · 75,000 THB total"
        actions={<Badge status={D.STATUS.contractSigned} />}
      />

      <div className="grid-3 mb-6">
        {[
          { n: 1, pct: 30, amount: 22500, label: "First Disbursement",  status: "Ready to Process",        badge: "badge-approved", date: "Contract signed Nov 14, 2025",  receipt: null,                action: "Process Payment" },
          { n: 2, pct: 40, amount: 30000, label: "Second Disbursement", status: "Awaiting Progress Report",badge: "badge-draft",    date: "Scheduled after M6 approval",   receipt: null,                action: "Not yet due" },
          { n: 3, pct: 30, amount: 22500, label: "Final Disbursement",  status: "Awaiting Final Report",   badge: "badge-draft",    date: "Scheduled after M12 approval", receipt: null,                action: "Not yet due" },
        ].map(p => (
          <div key={p.n} className="pay-card">
            <div className="pay-num">{p.pct}%</div>
            <div className="pct">{p.label} · Tranche {p.n}</div>
            <div className="amt">{fmtBaht(p.amount)}</div>
            <span className={`badge ${p.badge}`}><span className="dot"></span>{p.status}</span>
            <div className="meta-row mt-4"><span className="l">Schedule</span><span className="r">{p.date}</span></div>
            <div className="meta-row"><span className="l">Receipt</span><span className="r">{p.receipt || "Not issued"}</span></div>
            <button
              className={`btn ${p.n === 1 ? "btn-primary" : "btn-secondary"} mt-3`}
              style={{width: "100%"}}
              disabled={p.n !== 1}
              onClick={() => p.n === 1 && setConfirm({
                kind: "success",
                title: "Mark as paid?",
                message: `Disburse ${fmtBaht(p.amount)} for tranche ${p.n}. The researcher will be notified.`,
                confirmLabel: "Mark as Paid",
                onConfirm: () => toast("Payment marked as paid (demo)"),
              })}
            >
              {p.n === 1 ? "Mark as Paid" : "Not yet due"}
            </button>
          </div>
        ))}
      </div>

      <div className="card card-pad-0">
        <div className="card-head"><h3>Documents</h3></div>
        <div>
          <FileRow doc={{ name: "Signed_Contract_RG-2025-005.pdf", size: "1.2 MB", uploadedAt: "Nov 14, 2025" }} onDownload={onDownload} />
          <FileRow doc={{ name: "Bank_Authorization_Letter.pdf",   size: "84 KB",  uploadedAt: "Nov 14, 2025" }} onDownload={onDownload} />
          <FileRow doc={{ name: "Withholding_Tax_Cert.pdf",         size: "72 KB",  uploadedAt: "Nov 14, 2025" }} onDownload={onDownload} />
        </div>
      </div>
    </>
  );
}


function OFMHistory({ onDownload }) {
  const rows = [
    { id: "RG-2024-114", who: "Dr. Phyo Min Tun",         stage: "Final 30%", amount: 24000, date: "Jul 28, 2024", ref: "OFM-2024-0331" },
    { id: "RG-2025-007", who: "Dr. Apichat Phongphan",    stage: "2nd 40%",   amount: 84000, date: "May 14, 2025", ref: "OFM-2025-0144" },
    { id: "RG-2025-007", who: "Dr. Apichat Phongphan",    stage: "1st 30%",   amount: 63000, date: "Nov 03, 2025", ref: "OFM-2025-0099" },
    { id: "RG-2025-006", who: "Dr. Karunee Sritrakul",    stage: "1st 30%",   amount: 42000, date: "Oct 12, 2025", ref: "OFM-2025-0088" },
    { id: "RG-2025-005", who: "Dr. Nisachon Charoenwong", stage: "1st 30%",   amount: 22500, date: "Today, 09:15", ref: "OFM-2025-0102" },
  ];
  return (
    <>
      <PageHeader title="Payment History" desc="All disbursements processed by OFM." />
      <div className="card card-pad-0">
        <table className="tbl">
          <thead><tr><th>Date</th><th>Application</th><th>Researcher</th><th>Tranche</th><th style={{textAlign: "right"}}>Amount</th><th>Reference</th><th style={{textAlign: "right"}}>Receipt</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{fontSize: 12}}>{r.date}</td>
                <td><span className="id">{r.id}</span></td>
                <td style={{fontSize: 12}}>{r.who}</td>
                <td style={{fontSize: 12}}>{r.stage}</td>
                <td style={{textAlign: "right", fontWeight: 600}}>{r.amount.toLocaleString()} THB</td>
                <td><span className="id" style={{fontSize: 11}}>{r.ref}</span></td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onDownload({ name: `${r.ref}_receipt.pdf` })}>
                    <Icon name="Download" size={13} /> Receipt
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




function AdminDashboard({ navigate }) {
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
        <Stat label="Total Users"          value={D.SYSTEM_USERS.length} icon="Users"  tone="gold" />
        <Stat label="Active Sessions"      value="12"                     icon="Globe" tone="navy" />
        <Stat label="Open Applications"    value={D.APPLICATIONS.length} icon="Folder" tone="green" />
        <Stat label="System Uptime"        value="99.98%"                 icon="TrendingUp" />
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


function AdminUsers({ toast }) {
  const [search, setSearch] = useState("");
  const filtered = D.SYSTEM_USERS.filter(u =>
    !search || (u.name + u.email + u.role + u.dept).toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <PageHeader
        title="User Management"
        desc="Add, edit, and assign roles to users of the AU-RGMS portal."
        actions={<button className="btn btn-primary"><Icon name="Plus" size={14} /> Add User</button>}
      />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Search by name, email, role…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All roles</button>
          <button className="filter"><Icon name="Briefcase" size={12} /> Department</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm" onClick={() => toast("Demo only: exporting users")}><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th style={{textAlign: "right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <Avatar initials={u.name.split(" ").slice(-1)[0].slice(0,2).toUpperCase()} size={28} color="var(--au-navy)" />
                    <div>
                      <div style={{fontSize: 13, fontWeight: 600}}>{u.name}</div>
                      <div style={{fontSize: 11, color: "var(--ink-3)"}} className="id">{u.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{u.email}</td>
                <td>
                  <span className="badge badge-academic" style={{fontSize: 10}}>
                    <span className="dot"></span>{u.role}
                  </span>
                </td>
                <td style={{fontSize: 12, color: "var(--ink-3)"}}>{u.dept}</td>
                <td><span className={`badge ${u.status === "Active" ? "badge-check" : "badge-draft"}`}><span className="dot"></span>{u.status}</span></td>
                <td style={{fontSize: 11, color: "var(--ink-3)"}}>{u.lastLogin}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm"><Icon name="Edit" size={13} /></button>
                  <button className="btn btn-ghost btn-sm"><Icon name="MoreHorizontal" size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


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
          <div className="text-sm text-muted">By K. Tanapong Wisetphan</div>
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
                <td style={{textAlign: "right", fontFamily: "ui-monospace, monospace", fontWeight: 600}}>{t.incentive.toLocaleString()}</td>
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


function AdminAudit() {
  return (
    <>
      <PageHeader title="Audit Log" desc="Immutable record of all sensitive user actions." />
      <div className="card card-pad-0">
        <div className="toolbar">
          <div className="search">
            <Icon name="Search" size={14} className="icon" />
            <input placeholder="Filter audit entries…" />
          </div>
          <button className="filter active"><Icon name="Filter" size={12} /> All events</button>
          <button className="filter"><Icon name="Calendar" size={12} /> Today</button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="Download" size={12} /> Export</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>IP</th></tr></thead>
          <tbody>
            {D.AUDIT_LOG.map((e, i) => (
              <tr key={i}>
                <td style={{fontSize: 12}}>{e.t}</td>
                <td style={{fontSize: 12, fontWeight: 600}}>{e.who}</td>
                <td style={{fontSize: 12, color: "var(--ink-2)"}}>{e.act}</td>
                <td><span className="id" style={{fontSize: 11}}>{e.ip}</span></td>
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
    { section: "Application Workflow", items: [
      { k: "Auto-screen if all forms uploaded",      v: true,  type: "toggle" },
      { k: "Allow Dean to skip first screening",    v: false, type: "toggle" },
      { k: "Require 3 experts (vs minimum 2)",       v: true,  type: "toggle" },
      { k: "Days to sign contract after approval",   v: 15,    type: "number", unit: "days" },
    ]},
    { section: "Payments", items: [
      { k: "First tranche %",  v: 30, type: "number", unit: "%" },
      { k: "Second tranche %", v: 40, type: "number", unit: "%" },
      { k: "Final tranche %",  v: 30, type: "number", unit: "%" },
      { k: "Auto-notify researcher on disbursement", v: true, type: "toggle" },
    ]},
    { section: "Notifications", items: [
      { k: "Email reviewers 5 days before deadline", v: true, type: "toggle" },
      { k: "Send weekly digest to all Deans",        v: true, type: "toggle" },
      { k: "Slack integration",                       v: false, type: "toggle" },
    ]},
  ];
  return (
    <>
      <PageHeader
        title="System Settings"
        desc="Toggle workflow rules, payment splits, and notification preferences."
        actions={<button className="btn btn-primary" onClick={() => toast("Settings saved (demo)")}>Save Changes</button>}
      />
      {settings.map(s => (
        <div key={s.section} className="card card-pad-0 mb-4">
          <div className="card-head"><h3>{s.section}</h3></div>
          <div>
            {s.items.map((it, i) => (
              <div key={it.k} style={{
                display: "flex", alignItems: "center", padding: "16px 20px",
                borderBottom: i < s.items.length - 1 ? "1px solid var(--line-2)" : "none",
              }}>
                <div style={{flex: 1, fontSize: 13, fontWeight: 600}}>{it.k}</div>
                {it.type === "toggle" ? (
                  <Toggle defaultOn={it.v} />
                ) : (
                  <div style={{display: "flex", alignItems: "center", gap: 6}}>
                    <input
                      defaultValue={it.v}
                      style={{width: 70, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", textAlign: "right", fontWeight: 600}}
                    />
                    <span className="text-sm text-muted">{it.unit}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
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
  DeanDashboard, DeanScreenQueue, DeanSignQueue, DeanHistory,
  CommitteeDashboard, CommitteeQueue, CommitteeHistory,
  IRASDashboardV2, IRASScreen, IRASReviewerPool,
  ExpertDashboard, ExpertAssignments, ExpertHistory,
  PresidentDashboard, PresidentQueue,
  OFMDashboard, OFMDetail, OFMHistory,
  AdminDashboard, AdminUsers, AdminJournals, AdminAudit, AdminSettings,
});
