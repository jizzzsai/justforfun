const { useState, useEffect, useRef, useMemo } = React;
const ICONS = {
  LayoutDashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  FilePlus: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M12 12v6 M9 15h6',
  Folder: 'M4 4h6l2 3h8a0 0 0 0 1 0 0v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M8 13h8 M8 17h5 M8 9h2',
  FileCheck: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M9 15l2 2 4-4',
  FileSearch: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6 M14 2v6h6 M21 21l-2.5-2.5 M11.5 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  FileSignature: 'M14 2H6a2 2 0 0 0-2 2v12 M14 2v6h6 M20 8v6 M16 20l1-3 6-6 a 1.5 1.5 0 0 1 2 2 l-6 6-3 1z',
  Coins: 'M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M5.8 11.3a6 6 0 0 1 4.4-9.1 M14 16h4',
  Inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  ClipboardCheck: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z M9 14l2 2 4-4',
  Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  ShieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  GitCommit: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M1 12h6 M17 12h6',
  UserPlus: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M19 8v6 M22 11h-6',
  Award: 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12 M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  Building2: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18 M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
  GraduationCap: 'M22 10v6 M2 10l10-5 10 5-10 5z M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5',
  Landmark: 'M3 22h18 M6 18V11 M10 18V11 M14 18V11 M18 18V11 M12 2L2 7h20z M2 22V18h20v4',
  Bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  Send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  Search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  Filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  ChevronDown: 'M6 9l6 6 6-6',
  ChevronRight: 'M9 18l6-6-6-6',
  ChevronLeft: 'M15 18l-6-6 6-6',
  X: 'M18 6L6 18 M6 6l12 12',
  Plus: 'M12 5v14 M5 12h14',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  Upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  Eye: 'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  Check: 'M20 6L9 17l-5-5',
  CheckCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  AlertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01',
  Info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01',
  Edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z',
  Calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18',
  Clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  Settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  LogOut: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  HelpCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01',
  Repeat: 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3',
  Trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
  Briefcase: 'M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  Star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  TrendingUp: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  TrendingDown: 'M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6',
  Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  Phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  MoreHorizontal: 'M5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  ArrowRight: 'M5 12h14 M12 5l7 7-7 7',
  ArrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  Globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  KeyRound: 'M15.5 7.5a5 5 0 1 1-1.4 3.5L22 18.9V22h-3.1l-1.5-1.5-1.8 1.8-2.1-2.1 1.8-1.8-4.7-4.7a5 5 0 0 1-3.1 1.1z M7.5 7.5h.01',
  Bot: 'M12 8V4H8 M12 2h.01 M4 8h16v12H4z M2 14h2 M20 14h2 M9 13v2 M15 13v2 M8 18h8',
};

function Icon({ name, size = 16, stroke = 1.75, className = "", style = {} }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {d.split(/(?=M)/).map((seg, i) => <path key={i} d={seg.trim()} />)}
    </svg>
  );
}
function AULogo({ size = 56, ringColor = "var(--au-gold)", ringWidth = 3, plateColor = "#fff", className = "" }) {
  return (
    <div
      className={`au-logo ${className}`}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: plateColor,
        display: "grid", placeItems: "center",
        boxShadow: `0 0 0 ${ringWidth}px ${ringColor}, 0 0 0 ${ringWidth + 1}px ${plateColor}`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src="assets/au-logo.png"
        alt="Assumption University of Thailand"
        style={{ width: "86%", height: "86%", objectFit: "contain" }}
      />
    </div>
  );
}
function Badge({ status, children, dot = true, className = "" }) {
  const cls = status ? status.cls : className;
  const label = status ? status.label : children;
  return (
    <span className={`badge ${cls}`}>
      {dot && <span className="dot"></span>}
      {label}
    </span>
  );
}
function Avatar({ initials, size = 32, color = "var(--au-navy)" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: "#fff",
      display: "grid", placeItems: "center",
      fontWeight: 700, fontSize: size * 0.42,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div className="toast">
      <Icon name="Download" size={16} />
      {message}
    </div>
  );
}
function FileRow({ doc, onDownload, onView, missing = false, compact = false }) {
  const rawName = String((doc && doc.name) || "");
  const displayName = /\bau[-_\s]?r1\b/i.test(rawName)
    ? ((doc && doc.doc_type) || "Uploaded document")
    : (rawName || (doc && doc.doc_type) || "Uploaded document");
  return (
    <div className="file-row">
      <div className="ficon" style={missing ? { background: "#FEE2E2", color: "#991B1B" } : {}}>
        <Icon name="FileText" size={18} />
      </div>
      <div className="fmeta">
        <div className="fn">{displayName}{doc.doc_type && displayName !== doc.doc_type && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", padding: "2px 8px", borderRadius: 999 }}>{doc.doc_type}</span>}</div>
        <div className="fs">
          {missing
            ? <span style={{color: "#991B1B"}}>Missing — researcher to upload</span>
            : `${doc.size || "—"} · Uploaded ${doc.uploadedAt || "—"}`}
        </div>
      </div>
      {!compact && (
        <div className="factions">
          {!missing && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => onView && onView(doc)}>
                <Icon name="Eye" size={13} /> View
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => onDownload && onDownload(doc)}>
                <Icon name="Download" size={13} /> Download
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function Timeline({ steps, app, onStepClick }) {
  const tl = app.timeline || {};
  return (
    <div className="timeline">
      {steps.map((s, i) => {
        const data = tl[s.key] || {};
        const cls = data.current ? "current" : data.done ? "done" : "upcoming";
        const clickable = !!onStepClick && (s.key === "progress" || s.key === "final");
        return (
          <div
            key={s.key}
            className={`tl-step ${cls}${clickable ? " clickable" : ""}`}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={clickable ? "Open " + s.label : undefined}
            onClick={clickable ? () => onStepClick(s.key) : undefined}
            onKeyDown={clickable ? e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStepClick(s.key); } } : undefined}
          >
            <div className="dot"></div>
            <div className="t">{s.label}</div>
            <div className="s">{data.date || (data.done ? "Completed" : data.current ? "In progress" : "Not started")}</div>
            {data.who && <div className="who">{data.who}</div>}
            {data.note && <div className="comment">{data.note}</div>}
          </div>
        );
      })}
    </div>
  );
}
function HTimeline({ steps, app }) {
  const tl = app.timeline || {};
  return (
    <div className="tl-h">
      {steps.map((s, i) => {
        const data = tl[s.key] || {};
        const cls = data.current ? "current" : data.done ? "done" : "upcoming";
        return (
          <div key={s.key} className={`tl-h-step ${cls}`}>
            <div className="dot">{data.done ? "✓" : i + 1}</div>
            <div className="t">{s.label}</div>
            <div className="s">{data.date || "—"}</div>
          </div>
        );
      })}
    </div>
  );
}
function Stat({ label, value, icon, tone = "", delta, deltaTone }) {
  return (
    <div className={`stat ${tone}`}>
      <div className="icon-bg"><Icon name={icon} size={16} /></div>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && (
        <div className={`delta ${deltaTone || ""}`}>
          {deltaTone === "up" && <Icon name="TrendingUp" size={12} />}
          {deltaTone === "dn" && <Icon name="TrendingDown" size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}
function Modal({ open, onClose, title, children, footer, size, className = "" }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${size === "sm" ? "modal-sm" : ""} ${className}`.trim()} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="modal-head">
            <h3>{title}</h3>
            <button className="x" onClick={onClose}><Icon name="X" size={18} /></button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
function FilePreviewModal({ doc, onClose, onDownload }) {
  if (!doc) return null;
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={doc.name}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => onDownload(doc)}>
            <Icon name="Download" size={14} /> Download
          </button>
        </>
      }
    >
      <div className="pdf-preview">
        <div className="page">
          <div className="eyebrow" style={{ color: "var(--au-crimson)", marginBottom: 12 }}>Assumption University</div>
          <h5>{doc.name.replace(/_/g, " ").replace(".pdf", "")}</h5>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 20 }}>No uploaded file is attached to this record.</div>
          <div className="ln med"></div>
          <div className="ln"></div>
          <div className="ln short"></div>
          <div className="ln"></div>
          <div className="ln med"></div>
          <div style={{ height: 12 }}></div>
          <div className="ln short"></div>
          <div className="ln"></div>
          <div className="ln med"></div>
          <div className="ln"></div>
          <div className="ln short"></div>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12 }}>Document preview is unavailable.</div>
      </div>
    </Modal>
  );
}
function ConfirmModal({ open, onClose, onConfirm, title, message, kind = "primary", confirmLabel = "Confirm", withReason = false, reasonLabel = "Reason / note", reasonPlaceholder = "Add a comment for the record — the researcher and next reviewers can see this.", reasonRequired = false, finalConfirm }) {
  const [reason, setReason] = useState("");
  const [step, setStep] = useState(1);
  const [finalReady, setFinalReady] = useState(false);
  useEffect(() => { if (open) { setReason(""); setStep(1); setFinalReady(false); } }, [open]);
  useEffect(() => {
    if (step !== 2) { setFinalReady(false); return; }
    const timer = setTimeout(() => setFinalReady(true), 650);
    return () => clearTimeout(timer);
  }, [step]);
  if (!open) return null;
  const icons = { primary: "Info", success: "CheckCircle", danger: "AlertCircle" };
  const iconCls = { primary: "", success: "gold", danger: "red" }[kind];
  const btnCls = { primary: "btn-primary", success: "btn-success", danger: "btn-primary" }[kind];
  const blocked = withReason && reasonRequired && !reason.trim();
  const twoStep = finalConfirm === undefined ? withReason : finalConfirm;
  if (step === 2) {
    return (
      <Modal open={true} onClose={onClose} size="sm" className="confirm-modal-final">
        <div className={`conf-icon ${iconCls}`}>
          <Icon name="AlertCircle" size={26} />
        </div>
        <h3>Are you sure?</h3>
        <p><b>{title.replace(/\?$/, "")}</b> — {message}</p>
        <div style={{ textAlign: "left", marginTop: 10, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--paper-warm)", padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>{reasonLabel}</div>
          <div style={{ fontSize: 13, color: reason.trim() ? "var(--ink-1)" : "var(--ink-3)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {reason.trim() || "No comment added."}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 10 }}>
          This decision is recorded in the application timeline and cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={() => setStep(1)}><Icon name="ChevronLeft" size={14} /> Back</button>
          <button className={`btn ${btnCls}`} disabled={!finalReady} onClick={() => onConfirm(reason)}>Yes, {confirmLabel}</button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal open={true} onClose={onClose} size="sm">
      <div className={`conf-icon ${iconCls}`}>
        <Icon name={icons[kind] || "Info"} size={26} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {withReason && (
        <div className="field" style={{ textAlign: "left", marginTop: 6 }}>
          <label>{reasonLabel}{reasonRequired ? " (required)" : " (optional)"}</label>
          <textarea className="comment-input" value={reason} onChange={e => setReason(e.target.value)} placeholder={reasonPlaceholder} style={{ minHeight: 70 }} />
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className={`btn ${btnCls}`} disabled={blocked} onClick={() => (twoStep ? setStep(2) : onConfirm(reason))}>
          {confirmLabel}{twoStep ? <Icon name="ChevronRight" size={14} /> : null}
        </button>
      </div>
    </Modal>
  );
}

function ApplicationEventTimeline({ app }) {
  const grantType = app && app.grant_type ? app.grant_type : "au_r3";
  const officeName = "IRAS";
  const roleName = role => ({
    researcher: "Researcher", dean: "Dean", iras: officeName,
    ofm: "Finance Office", admin: "Administrator",
  })[role] || "System";
  const statusName = value => value ? window.DB.statusBadge(value, grantType).label : "";
  const dateTime = value => {
    if (!value) return "Date not recorded";
    try { return new Date(value).toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return value; }
  };
  const eventTitle = event => {
    const actor = roleName(event.actor_role);
    if (event.to_status === "rejected") return actor + " rejected the application";
    if (event.to_status === "returned") return actor + " requested revision";
    if (event.from_status === "returned" || /resubmitted/i.test(event.action || "")) return "Researcher resubmitted the application";
    if (/submitted application/i.test(event.action || "")) return "Researcher submitted the application";
    return event.action || actor + " action recorded";
  };
  let events = (app && app.events ? app.events : [])
    .filter(event => event.action !== "Saved draft")
    .map(event => {
      if (event.actor_role === "dean" && event.to_status === "committee_review") {
        return { ...event, action: "Dean approved — forwarded to IRAS", to_status: "iras_review" };
      }
      return event;
    })
    .filter(event => event.actor_role !== "committee"
      && event.from_status !== "committee_review"
      && !/faculty committee|committee recommended|committee review/i.test(event.action || ""))
    .slice()
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  if (app && app.submitted_at && !events.some(event => event.actor_role === "researcher" && /submit/i.test(event.action || ""))) {
    events.unshift({ id: "initial-submission", actor_role: "researcher", action: "Submitted application", from_status: "draft", to_status: "submitted", created_at: app.submitted_at, note: "Initial submission." });
  }
  const last = events[events.length - 1];
  if (app && app.status && app.status !== "draft" && (!last || last.to_status !== app.status)) {
    events.push({ id: "current-status", action: "Current application status", to_status: app.status, created_at: app.updated_at || app.decided_at || app.submitted_at, synthetic: true });
  }
  if (!events.length) return <Empty title="No timeline activity yet" desc="Actions will appear after the researcher submits this application." icon="Clock" />;
  return (
    <div className="timeline application-event-timeline">
      {events.map((event, index) => {
        const tone = event.to_status === "rejected" ? "rejected" : event.to_status === "returned" ? "returned" : index === events.length - 1 && !["rejected", "completed"].includes(app.status) ? "current" : "done";
        const actor = event.actor && event.actor.full_name ? event.actor.full_name : roleName(event.actor_role);
        return (
          <div className={`tl-step ${tone}`} key={event.id || index}>
            <div className="dot"></div>
            <div className="t">{eventTitle(event)}</div>
            <div className="s">{dateTime(event.created_at)}</div>
            {!event.synthetic && <div className="who">{actor}</div>}
            {(event.from_status || event.to_status) && <div className="event-transition">{event.from_status ? statusName(event.from_status) + " → " : ""}{statusName(event.to_status)}</div>}
            {event.note && <div className="comment" style={{ whiteSpace: "pre-wrap" }}>{event.note}</div>}
          </div>
        );
      })}
    </div>
  );
}


function ReviewCommentHistory({ app, roles = ["dean", "iras"] }) {
  const items = [];
  const seenComments = new Set();
  const eventRoles = {
    dean: { label: "Dean comment", author: "Dean", initials: "DN" },
    iras: { label: "IRAS comment", author: "IRAS", initials: "IR" },
    ofm: { label: "Finance comment", author: "Finance Office", initials: "FN" },
  };

  roles.forEach(role => {
    const meta = eventRoles[role] || { label: role + " comment", author: role, initials: role.slice(0, 2).toUpperCase() };
    (app.events || []).forEach(event => {
      if (event.actor_role !== role || !event.note || !event.note.trim()) return;
      const body = event.note.trim();
      const signature = role + "|" + body.toLowerCase().replace(/\s+/g, " ");
      if (seenComments.has(signature)) return;
      seenComments.add(signature);
      items.push({
        key: role + "-" + event.id,
        role: meta.label,
        author: event.actor && event.actor.full_name ? event.actor.full_name : meta.author,
        body,
        at: event.created_at,
        initials: meta.initials,
      });
    });
  });

  items.sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
  return (
    <div style={{ borderTop: "1px solid var(--line-2)", marginTop: 16, paddingTop: 16 }}>
      <div className="eyebrow mb-2">Review comments</div>
      {items.length === 0 && <div className="text-sm text-muted">No review comments were submitted.</div>}
      {items.map(item => (
        <div key={item.key} className="comment">
          <div className="head">
            <div className="av">{item.initials}</div>
            <div>
              <div className="name">{item.role}</div>
              <div className="role">{item.author}</div>
            </div>
          </div>
          <div className="body" style={{ whiteSpace: "pre-wrap" }}>{item.body}</div>
        </div>
      ))}
    </div>
  );
}


function NotifPanel({ items, onClose, onOpen }) {
  const unread = items.filter(n => n.unread).length;
  return (
    <div className="notif-panel" onClick={e => e.stopPropagation()}>
      <div className="notif-head">
        <h4>Notifications</h4>
        {unread > 0 && <span className="pill">{unread}</span>}
        <span className="clear">Mark all read</span>
      </div>
      <div className="notif-list">
        {items.map(n => (
          <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`} onClick={() => onOpen && onOpen(n)} style={{ cursor: n.page ? "pointer" : "default" }}>
            <div className="ni"><Icon name={n.icon || "Bell"} size={16} /></div>
            <div className="nm">
              <div className="nt"><b>{n.who}:</b> {n.text}</div>
              {n.details && (
                <div style={{ whiteSpace: "pre-wrap", marginTop: 7, padding: "8px 10px", borderRadius: 8, background: "var(--paper-warm)", color: "var(--ink-2)", fontSize: 11.5, lineHeight: 1.55 }}>
                  {n.details}
                </div>
              )}
              <div className="nd">{n.when}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="notif-foot">View all notifications</div>
    </div>
  );
}
function PageHeader({ title, desc, actions }) {
  return (
    <div className="page-header">
      <div className="titles">
        <h1 className="serif">{title}</h1>
        {desc && <p className="desc">{desc}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
function Empty({ title, desc, icon = "Folder" }) {
  return (
    <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--ink-3)" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--paper-warm)", color: "var(--ink-3)",
        display: "grid", placeItems: "center", margin: "0 auto 12px"
      }}>
        <Icon name={icon} size={24} />
      </div>
      <div style={{ fontWeight: 600, color: "var(--ink-1)", marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 12 }}>{desc}</div>}
    </div>
  );
}
function fmtBaht(n) {
  return new Intl.NumberFormat("en-US").format(n) + " THB";
}
const AUDP_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const AUDP_DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function audpPad(n) { return (n < 10 ? "0" : "") + n; }
function audpISO(y, m, d) { return y + "-" + audpPad(m + 1) + "-" + audpPad(d); }
function AUDatePicker({ value, onChange, min, max, placeholder = "Select date…" }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const today = new Date();
  const sel = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState({ y: (sel || today).getFullYear(), m: (sel || today).getMonth() });
  const parsedMin = min ? new Date(min + "T00:00:00") : null;
  const parsedMax = max ? new Date(max + "T00:00:00") : null;
  const minYear = parsedMin && !isNaN(parsedMin) ? parsedMin.getFullYear() : today.getFullYear() - 80;
  const maxYear = parsedMax && !isNaN(parsedMax) ? parsedMax.getFullYear() : today.getFullYear() + 20;
  const yearOptions = [];
  for (let y = maxYear; y >= minYear; y--) yearOptions.push(y);
  const wrapRef = useRef(null);
  const yearPanelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
  }, [open]);
  useEffect(() => {
    if (panel !== "year" || !yearPanelRef.current) return;
    const activeYear = yearPanelRef.current.querySelector(".active");
    if (activeYear) activeYear.scrollIntoView({ block: "center" });
  }, [panel]);
  const toggle = () => {
    if (!open) {
      const base = value ? new Date(value + "T00:00:00") : today;
      if (!isNaN(base)) setView({ y: base.getFullYear(), m: base.getMonth() });
      setPanel(null);
    }
    setOpen(v => !v);
  };
  const shift = (delta) => setView(v => {
    const d = new Date(v.y, v.m + delta, 1);
    const monthStart = audpISO(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = audpISO(d.getFullYear(), d.getMonth(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
    if ((min && monthEnd < min) || (max && monthStart > max)) return v;
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const pick = (iso) => { if (onChange) onChange(iso); setPanel(null); setOpen(false); };
  const inRange = (iso) => (!min || iso >= min) && (!max || iso <= max);
  const monthInRange = (y, m) => {
    const monthStart = audpISO(y, m, 1);
    const monthEnd = audpISO(y, m, new Date(y, m + 1, 0).getDate());
    return (!min || monthEnd >= min) && (!max || monthStart <= max);
  };
  const changeYear = (nextYear) => {
    let nextMonth = view.m;
    if (!monthInRange(nextYear, nextMonth)) {
      const lowerMonth = parsedMin && nextYear === parsedMin.getFullYear() ? parsedMin.getMonth() : 0;
      const upperMonth = parsedMax && nextYear === parsedMax.getFullYear() ? parsedMax.getMonth() : 11;
      nextMonth = Math.max(lowerMonth, Math.min(upperMonth, nextMonth));
    }
    setView({ y: nextYear, m: nextMonth });
    setPanel(null);
  };
  const first = new Date(view.y, view.m, 1);
  const start = new Date(view.y, view.m, 1 - first.getDay());
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push(d);
  }
  const todayISO = audpISO(today.getFullYear(), today.getMonth(), today.getDate());
  const nice = sel && !isNaN(sel)
    ? sel.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    : "";
  return (
    <div className={"audp" + (open ? " open" : "")} ref={wrapRef}>
      <button type="button" className="audp-input" onClick={toggle} aria-haspopup="dialog" aria-expanded={open}>
        <Icon name="Calendar" size={15} className="cal" />
        {nice ? <span className="grow">{nice}</span> : <span className="grow ph">{placeholder}</span>}
        {value && (
          <span className="clear" role="button" aria-label="Clear date"
            onClick={e => { e.stopPropagation(); if (onChange) onChange(""); }}>
            <Icon name="X" size={13} />
          </span>
        )}
      </button>
      {open && (
        <div className="audp-pop" role="dialog" aria-label="Choose date">
          <div className="audp-head">
            <div className="audp-jump">
              <button type="button" className="audp-jump-button audp-month-button" aria-label="Choose month" aria-expanded={panel === "month"} onClick={() => setPanel(p => p === "month" ? null : "month")}>
                {AUDP_MONTHS[view.m]} <Icon name="ChevronDown" size={12} />
              </button>
              <button type="button" className="audp-jump-button audp-year-button" aria-label="Choose year" aria-expanded={panel === "year"} onClick={() => setPanel(p => p === "year" ? null : "year")}>
                {view.y} <Icon name="ChevronDown" size={12} />
              </button>
            </div>
            <button type="button" onClick={() => { setPanel(null); shift(-1); }} aria-label="Previous month"><Icon name="ChevronLeft" size={15} /></button>
            <button type="button" onClick={() => { setPanel(null); shift(1); }} aria-label="Next month"><Icon name="ChevronRight" size={15} /></button>
          </div>
          {panel === "month" ? (
            <div className="audp-month-grid" aria-label="Select month">
              {AUDP_MONTHS.map((month, monthIndex) => {
                const disabled = !monthInRange(view.y, monthIndex);
                return <button key={month} type="button" disabled={disabled} className={view.m === monthIndex ? "active" : ""} onClick={() => { setView(v => ({ ...v, m: monthIndex })); setPanel(null); }}>{month.slice(0, 3)}</button>;
              })}
            </div>
          ) : panel === "year" ? (
            <div className="audp-year-grid" ref={yearPanelRef} aria-label="Select year">
              {yearOptions.map(year => <button key={year} type="button" className={view.y === year ? "active" : ""} onClick={() => changeYear(year)}>{year}</button>)}
            </div>
          ) : (
            <div className="audp-grid">
              {AUDP_DOW.map(d => <div key={d} className="audp-dow">{d}</div>)}
              {cells.map((d, i) => {
                const iso = audpISO(d.getFullYear(), d.getMonth(), d.getDate());
                const out = d.getMonth() !== view.m;
                const dis = !inRange(iso);
                const cls = "audp-day" + (out ? " out" : "") + (dis ? " dis" : "")
                  + (iso === todayISO ? " today" : "") + (value === iso ? " sel" : "");
                return (
                  <div key={i} className={cls} onClick={() => !dis && pick(iso)}>{d.getDate()}</div>
                );
              })}
            </div>
          )}
          <div className="audp-foot">
            <button type="button" onClick={() => pick("")}>Clear</button>
            <button type="button" disabled={!inRange(todayISO)}
              onClick={() => { setView({ y: today.getFullYear(), m: today.getMonth() }); if (inRange(todayISO)) pick(todayISO); }}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function submittedResearcherInfo(app) {
  if (!app) return { fullName: "", email: "", nameTitle: "", academicPosition: "", auId: "", phone: "", officeRoom: "", joinedDate: "", faculty: "", department: "" };
  if (window.DB && window.DB.applicationResearcherInfo) {
    const researcher = window.DB.applicationResearcherInfo(app);
    return {
      fullName: researcher.full_name || researcher.name || "",
      email: researcher.email || "",
      nameTitle: researcher.name_title || researcher.title || "",
      academicPosition: researcher.academic_position || "",
      auId: researcher.au_id || "",
      phone: normalizeThaiPhone(researcher.phone),
      officeRoom: researcher.office_room || "",
      joinedDate: researcher.joined_date || "",
      faculty: researcher.faculty || app.faculty || "",
      department: researcher.department || app.department || "",
    };
  }
  const info = app.grant_type === "au_r3" ? (app.conference_info || {}) : (app.pub_info || {});
  const snapshot = info.researcherSnapshot || {};
  const account = app.researcher || {};
  return {
    fullName: snapshot.fullName || info.researcherName || account.full_name || account.name || "",
    email: snapshot.email || info.researcherEmail || info.contactEmail || account.email || "",
    nameTitle: snapshot.nameTitle || info.researcherTitle || account.name_title || account.title || "",
    academicPosition: snapshot.academicPosition || info.researcherPosition || account.academic_position || "",
    auId: snapshot.auId || info.researcherAuId || account.au_id || "",
    phone: normalizeThaiPhone(snapshot.phone || info.researcherPhone || account.phone),
    officeRoom: snapshot.officeRoom || info.researcherOffice || account.office_room || "",
    joinedDate: snapshot.joinedDate || info.researcherJoinedDate || account.joined_date || "",
    faculty: snapshot.faculty || app.faculty || account.faculty || "",
    department: snapshot.department || app.department || account.department || "",
  };
}

function normalizeThaiPhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function isValidThaiPhone(value) {
  return /^0\d{8,9}$/.test(String(value || ""));
}

function ThaiPhoneInput({ value, onChange, required = false }) {
  const invalid = !!value && !isValidThaiPhone(value);
  return (
    <>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        pattern="0[0-9]{8,9}"
        value={value || ""}
        onChange={e => onChange(normalizeThaiPhone(e.target.value))}
        placeholder="e.g. 0812345678"
        aria-invalid={invalid}
        required={required}
        style={invalid ? { borderColor: "var(--au-crimson)", color: "var(--au-crimson)" } : null}
      />
      {invalid && <div style={{ fontSize: 11, color: "var(--au-crimson)", marginTop: 4 }}>Enter 9–10 digits starting with 0.</div>}
    </>
  );
}

function researcherJoinedDate(app) {
  return submittedResearcherInfo(app).joinedDate;
}

function universityServiceEligibility(joinedDate, asOf) {
  if (!joinedDate) return { eligible: false, missing: true, eligibleOn: "", months: 0 };
  const joined = new Date(joinedDate + "T00:00:00");
  if (isNaN(joined)) return { eligible: false, missing: true, eligibleOn: "", months: 0 };
  const eligibleOn = new Date(joined.getFullYear() + 1, joined.getMonth(), joined.getDate());
  const today = asOf ? new Date(asOf) : new Date();
  today.setHours(0, 0, 0, 0);
  let months = (today.getFullYear() - joined.getFullYear()) * 12 + (today.getMonth() - joined.getMonth());
  if (today.getDate() < joined.getDate()) months -= 1;
  months = Math.max(0, months);
  return {
    eligible: today >= eligibleOn,
    missing: false,
    eligibleOn: audpISO(eligibleOn.getFullYear(), eligibleOn.getMonth(), eligibleOn.getDate()),
    months,
  };
}

function ResearcherServiceEligibilityRows({ app }) {
  const joinedDate = researcherJoinedDate(app);
  const service = universityServiceEligibility(joinedDate);
  return (
    <>
      <div className="meta-row"><span className="l">Joined Assumption University</span><span className="r">{joinedDate ? window.DB.fmtDate(joinedDate) : "Not recorded"}</span></div>
      <div className="meta-row"><span className="l">University service</span><span className="r">{joinedDate ? service.months + " months" : "Not recorded"}</span></div>
      <div className="meta-row"><span className="l">Service eligibility</span><span className="r" style={{ color: joinedDate && service.eligible ? "var(--status-approved)" : "var(--au-crimson)" }}>{joinedDate ? (service.eligible ? "Eligible" : "Not eligible until " + window.DB.fmtDate(service.eligibleOn)) : "Not recorded"}</span></div>
    </>
  );
}

function ResearcherInformationCard({ app, className = "" }) {
  const researcher = submittedResearcherInfo(app);
  const fullName = ((researcher.nameTitle ? researcher.nameTitle + " " : "") + (researcher.fullName || "")).trim() || "—";
  const row = (label, value) => (
    <div className="meta-row"><span className="l">{label}</span><span className="r">{value || "—"}</span></div>
  );
  return (
    <div className={("card card-pad-0 " + className).trim()}>
      <div className="card-head"><h3>Researcher Information</h3></div>
      <div className="card-body">
        {row("Full name", fullName)}
        {row("Academic / administrative position", researcher.academicPosition)}
        {row("AU ID", researcher.auId)}
        {row("Email (AU only)", researcher.email)}
        {row("Phone", researcher.phone)}
        {row("Office / Room", researcher.officeRoom)}
        {row("Faculty", researcher.faculty)}
        {row("Department", researcher.department)}
        <ResearcherServiceEligibilityRows app={app} />
      </div>
    </div>
  );
}


Object.assign(window, {
  Icon, AULogo, Badge, Avatar, Toast, FileRow,
  Timeline, ApplicationEventTimeline, HTimeline, Stat, Modal, FilePreviewModal,
  ConfirmModal, ReviewCommentHistory, NotifPanel, PageHeader, Empty, fmtBaht,
  AUDatePicker, normalizeThaiPhone, isValidThaiPhone, ThaiPhoneInput, researcherJoinedDate, universityServiceEligibility, ResearcherServiceEligibilityRows, ResearcherInformationCard,
});
