/* ============================================================
   Shared UI components for the AU Research Grant Portal
   ============================================================ */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Icon: small inline SVG library (Lucide-styled) ---------- */
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

/* ---------- AU Logo: real seal on a white circular plate ----------
   The image preserves the original AU crest detail; the white plate
   makes it readable against the maroon header / login backdrop. */
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

/* ---------- Badge ---------- */
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

/* ---------- Avatar ---------- */
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

/* ---------- Toast ---------- */
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

/* ---------- FileRow: a downloadable document ---------- */
function FileRow({ doc, onDownload, onView, missing = false, compact = false }) {
  return (
    <div className="file-row">
      <div className="ficon" style={missing ? { background: "#FEE2E2", color: "#991B1B" } : {}}>
        <Icon name="FileText" size={18} />
      </div>
      <div className="fmeta">
        <div className="fn">{doc.name}</div>
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

/* ---------- Timeline (vertical) ---------- */
function Timeline({ steps, app }) {
  const tl = app.timeline || {};
  return (
    <div className="timeline">
      {steps.map((s, i) => {
        const data = tl[s.key] || {};
        const cls = data.current ? "current" : data.done ? "done" : "upcoming";
        return (
          <div key={s.key} className={`tl-step ${cls}`}>
            <div className="dot"></div>
            <div className="t">{s.label}</div>
            <div className="s">{data.date || "Pending"}</div>
            {data.who && <div className="who">{data.who}</div>}
            {data.note && <div className="comment">{data.note}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Horizontal timeline ---------- */
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

/* ---------- Stat card ---------- */
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

/* ---------- Modal ---------- */
function Modal({ open, onClose, title, children, footer, size }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${size === "sm" ? "modal-sm" : ""}`} onClick={e => e.stopPropagation()}>
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

/* ---------- File Preview Modal ---------- */
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
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 20 }}>Document preview — demo only</div>
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
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12 }}>Demo preview — page 1 of 4</div>
      </div>
    </Modal>
  );
}

/* ---------- Confirm Modal ---------- */
function ConfirmModal({ open, onClose, onConfirm, title, message, kind = "primary", confirmLabel = "Confirm" }) {
  if (!open) return null;
  const icons = { primary: "Info", success: "CheckCircle", danger: "AlertCircle" };
  const iconCls = { primary: "", success: "green", danger: "red" }[kind];
  const btnCls = { primary: "btn-primary", success: "btn-success", danger: "btn-primary" }[kind];
  return (
    <Modal open={true} onClose={onClose} size="sm">
      <div className={`conf-icon ${iconCls}`}>
        <Icon name={icons[kind] || "Info"} size={26} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className={`btn ${btnCls}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

/* ---------- Notification panel ---------- */
function NotifPanel({ items, onClose }) {
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
          <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
            <div className="ni"><Icon name={n.icon} size={16} /></div>
            <div className="nm">
              <div className="nt" dangerouslySetInnerHTML={{ __html: `<b>${n.who}:</b> ${n.text}` }}></div>
              <div className="nd">{n.when}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="notif-foot">View all notifications</div>
    </div>
  );
}

/* ---------- Page Header ---------- */
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

/* ---------- Empty state ---------- */
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

/* ---------- Currency formatter ---------- */
function fmtBaht(n) {
  return new Intl.NumberFormat("en-US").format(n) + " THB";
}

/* ---------- Expose ---------- */
Object.assign(window, {
  Icon, AULogo, Badge, Avatar, Toast, FileRow,
  Timeline, HTimeline, Stat, Modal, FilePreviewModal,
  ConfirmModal, NotifPanel, PageHeader, Empty, fmtBaht,
});
