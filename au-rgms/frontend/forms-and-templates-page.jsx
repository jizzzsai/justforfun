function FormsLibrary() {
  const officialFormsUrl = "https://iras.au.edu/research-support/all-au-research-grants/";

  return (
    <>
      <PageHeader
        title="Forms & Templates"
        desc="Use the official IRAS page for the latest AU research grant forms, templates, and supporting documents."
      />

      <div className="card" style={{ maxWidth: 760, padding: "34px 38px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--au-crimson-soft)", color: "var(--au-crimson)", flexShrink: 0 }}>
            <Icon name="ExternalLink" size={22} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 7 }}>Official IRAS resource</div>
            <h3 style={{ margin: "0 0 8px" }}>All AU Research Grant Forms</h3>
            <p className="text-sm text-muted" style={{ margin: "0 0 18px", lineHeight: 1.65 }}>
              Open the IRAS website to access the current documents for AU-R1, AU-R3, and AU-R4.
            </p>
            <a className="btn btn-primary" href={officialFormsUrl} target="_blank" rel="noopener noreferrer">
              Open Official Forms <Icon name="ExternalLink" size={14} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

window.FormsLibrary = FormsLibrary;
