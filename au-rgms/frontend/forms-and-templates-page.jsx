

function FormsLibrary() {
  const FORMS = [
    {
      code: "AU-R1-4",
      file: "AU-R1-4-Research-Creative-Grant-Submission-Form-1.pdf",
      name: "Research / Creative Grant Submission Form",
      stage: "Application",
      badge: "badge-academic",
      who: "Researcher — complete and upload with the application",
      icon: "FilePlus",
    },
    {
      code: "AU-R1-3",
      file: "AU-R1-3-Contract-for-Research-Grant.pdf",
      name: "Contract for Research Grant",
      stage: "Contract",
      badge: "badge-president",
      who: "Researcher & President — signed within 45 days of approval",
      icon: "FileSignature",
    },
    {
      code: "AU-R1-5",
      file: "AU-R1-5-Progress-Report-Format.pdf",
      name: "Progress Report Format",
      stage: "Reporting",
      badge: "badge-progress",
      who: "Researcher — approval unlocks the 40% payment",
      icon: "FileText",
    },
    {
      code: "AU-R1-6",
      file: "AU-R1-6-Final-Report-Format.pdf",
      name: "Final Report Format",
      stage: "Reporting",
      badge: "badge-final",
      who: "Researcher — approval unlocks the final 30% payment (2 hard copies + 1 soft copy)",
      icon: "FileCheck",
    },
    {
      code: "AU-R3",
      name: "Application Form for Paper Presentation Grant",
      stage: "Application",
      badge: "badge-academic",
      who: "Researcher - complete before submitting an AU-R3 application",
      icon: "FileText",
      downloads: [
        { file: "AU-R3-Paper-Presentation-Grant-Application-Form.pdf", label: "PDF", icon: "Download" },
        { file: "AU-R3-Paper-Presentation-Grant-Application-Form.docx", label: "Word", icon: "FileText" },
      ],
    },
    {
      code: "AU-R4",
      name: "Application Form for Reimbursement of Publication Fee and Publication Remuneration",
      stage: "Application",
      badge: "badge-final",
      who: "Researcher - use one form for each publication",
      icon: "Award",
      downloads: [
        { file: "AU-R4-Publication-Fee-and-Remuneration-Application-Form.pdf", label: "PDF", icon: "Download" },
        { file: "AU-R4-Publication-Fee-and-Remuneration-Application-Form.docx", label: "Word", icon: "FileText" },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title="Forms & Templates"
        desc="Official Assumption University research-grant documents. Download, complete, and upload them at the relevant stage of the workflow."
      />

      <div className="card card-pad-0">
        <table className="tbl">
          <thead>
            <tr>
              <th>Code</th>
              <th>Document</th>
              <th>Stage</th>
              <th>Who needs it</th>
              <th style={{ textAlign: "right" }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {FORMS.map((f) => (
              <tr key={f.code}>
                <td><span className="id" style={{ fontSize: 12, fontWeight: 700 }}>{f.code}</span></td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name={f.icon} size={16} style={{ color: "var(--au-crimson)" }} />
                    {f.name}
                  </div>
                </td>
                <td><span className={`badge ${f.badge}`}><span className="dot"></span>{f.stage}</span></td>
                <td style={{ fontSize: 12, color: "var(--ink-3)" }}>{f.who}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {(f.downloads || [{ file: f.file, label: "PDF", icon: "Download" }]).map((download) => (
                      <a key={download.file} className="btn btn-secondary btn-sm" href={`forms/${download.file}`} download target="_blank" rel="noopener noreferrer">
                        <Icon name={download.icon} size={13} /> {download.label}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card mt-6" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="Info" size={18} style={{ color: "var(--au-crimson)", flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <b>The four required application documents</b> are: Recommendation Form, Application Form,
          Research Proposal, and the Research / Creative Grant Submission Form (above). The Recommendation
          and Application Forms are issued per faculty — contact the RASSC office if you need them.
        </div>
      </div>
    </>
  );
}

window.FormsLibrary = FormsLibrary;
