



const FA = window.AU;


function LiveAppLoader({ status, grantType, applicationId, strictStatus, title, desc, render }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    const req = applicationId ? window.DB.applicationDetail(applicationId) : window.DB.firstApplicationForStatus(status, grantType);
    req.then(result => {
      // A stale selection must never let a reviewer act on an application from
      // another grant queue (or one which has already left this workflow step).
      const wrongGrant = !!(result && grantType && result.grant_type !== grantType);
      const wrongStatus = !!(result && strictStatus && status && result.status !== status);
      setApp(wrongGrant || wrongStatus ? null : result);
    }).catch(() => setApp(null)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [status, grantType, applicationId, strictStatus]);
  if (loading) {
    return <><PageHeader title={title} desc={desc} /><div className="card" style={{ padding: 44, textAlign: "center", color: "var(--ink-3)" }}>Loading...</div></>;
  }
  if (!app) {
    return <><PageHeader title={title} desc={desc} /><div className="card"><Empty title="Nothing in this queue" desc="Applications will appear here when they reach this stage." icon="Folder" /></div></>;
  }
  return render(app, load);
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
      grantType="au_r3"
      strictStatus={true}
      applicationId={applicationId}
      title="AU-R3 Screening"
      desc="Review the conference, paper, conference qualities, and documents before forwarding to IRAS."
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
          message: app.code + " will be sent back to the researcher. Explain what needs to be fixed (for example, a clearer Turnitin report or corrected conference qualities).",
          confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "Dean comment", finalConfirm: false,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-r3-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const reject = () => setConfirm({
          kind: "danger", title: "Reject application?",
          message: app.code + " will be rejected. This is a final decision and will close the application.",
          confirmLabel: "Reject Application", withReason: true, reasonRequired: true, reasonLabel: "Dean rejection reason",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "reject", reason); toast(app.code + " rejected."); navigate("d-r3-screen"); }
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
            <div className="mb-4"><AnnualFundingSummaryCard summary={app.annual_funding} currentAmount={Number(app.requested_amount || 3500)} compact /></div>
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
                  <div className="card-head"><h3>Conference Qualities</h3></div>
                  <div className="card-body">
                    <div className="meta-row"><span className="l">Conference Database / Index</span><span className="r">{ci.journalDb || "-"}</span></div>
                    <div className="meta-row"><span className="l">Qualities</span><span className="r">{ci.journalClassification || "-"}</span></div>
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
                    <button className="btn btn-danger btn-block" onClick={reject}><Icon name="X" size={14} /> Reject Application</button>
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
    submitted: "Pending Dean Review", iras_review: "Under IRAS Verification",
    approved: "Awaiting Finance Payment", active: "Paid", completed: "Paid / Completed",
    returned: "Returned for Revision", rejected: "Rejected",
  };
  return { key: base.key, cls: base.cls, label: labels[status] || base.label };
}

function DeanR4Detail({ applicationId, navigate, onDownload, onView, toast, setConfirm }) {
  return (
    <LiveAppLoader
      status="submitted"
      grantType="au_r4"
      strictStatus={true}
      applicationId={applicationId}
      title="AU-R4 Screening"
      desc="Review the publication, journal, author, claim and supporting documents, then forward the application to IRAS."
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
          message: "By approving, you confirm the Dean screening is complete. IRAS will verify the application next.",
          confirmLabel: "Confirm & Forward to IRAS", withReason: true, reasonLabel: "Dean comment",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "advance", reason || ""); toast(app.code + " approved — forwarded to IRAS."); navigate("d-r4-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const ret = () => setConfirm({
          kind: "danger", title: "Return for Revision?",
          message: app.code + " will be returned to the researcher. State what must be corrected (e.g. upload the original receipt, fix the author contribution percentages).",
          confirmLabel: "Return", withReason: true, reasonRequired: true, reasonLabel: "Dean comment", finalConfirm: false,
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "return", reason); toast(app.code + " returned for revision."); navigate("d-r4-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const reject = () => setConfirm({
          kind: "danger", title: "Reject application?",
          message: app.code + " will be rejected. This is a final decision and will close the application.",
          confirmLabel: "Reject Application", withReason: true, reasonRequired: true, reasonLabel: "Dean rejection reason",
          onConfirm: async (reason) => {
            try { await window.DB.transition(app.id, "submitted", "reject", reason); toast(app.code + " rejected."); navigate("d-r4-screen"); }
            catch (e) { toast("Error: " + ((e && e.message) || e)); load(); }
          },
        });
        const row = (l, v) => <div className="meta-row"><span className="l">{l}</span><span className="r">{v || "-"}</span></div>;

        return (
          <>
            <PageHeader title={"AU-R4 Screening — " + app.code}
              desc={(r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department") + " · " + (pi.journal || "")}
              actions={<Badge status={r4Badge(app.status)} />} />
            <div className="mb-4"><AnnualFundingSummaryCard summary={app.annual_funding} currentAmount={Number(app.requested_amount || 0)} compact /></div>
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
                        {authors.map((a, i) => <tr key={i}><td>{a.name}</td><td style={{ fontSize: 12 }}>{/corresponding/i.test(a.type || "") ? "Co-author" : a.type}</td><td style={{ fontSize: 12 }}>{a.email || "—"}</td><td style={{ textAlign: "right" }}>{a.contribution || 0}%</td></tr>)}
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
                    <button className="btn btn-primary btn-block" onClick={forward}><Icon name="Send" size={14} /> Approve &amp; Forward to IRAS</button>
                    <button className="btn btn-secondary btn-block" onClick={ret}><Icon name="Repeat" size={14} /> Return for Revision</button>
                    <button className="btn btn-danger btn-block" onClick={reject}><Icon name="X" size={14} /> Reject Application</button>
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
  DeanR3Detail, DeanR4Detail,
});
