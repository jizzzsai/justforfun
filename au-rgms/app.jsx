/* ============================================================
   AU RGMS · App shell
   8 roles · single login · in-app role switcher
   ============================================================ */

const APP = window.AU;
const TEST_PASSWORD = "AuResearch#2026";
const TEST_EMAIL_FOR = {
  researcher: "somchai.r@au.edu",
  dean: "dean.sci@au.edu",
  committee: "comm.chair@au.edu",
  iras: "iras.office@au.edu",
  expert: "expert.ml@au.edu",
  president: "president@au.edu",
  ofm: "finance@au.edu",
  admin: "admin@au.edu",
};
const TEST_EXPERT_ACCOUNTS = [
  { label: "Expert 1", email: "expert.ml@au.edu" },
  { label: "Expert 2", email: "expert.bio@au.edu" },
  { label: "Expert 3", email: "expert.ds@au.edu" },
];

/* ============= LOGIN PAGE ============= */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function signInWith(em, pw) {
    setErr(""); setBusy(true);
    try {
      const prof = await window.AUTH.signIn(em, pw);
      if (!prof) throw new Error("No profile found for this account.");
      onLogin(prof); // routes by the account's real role
    } catch (ex) { setErr((ex && ex.message) || "Sign-in failed."); setBusy(false); }
  }
  function doLogin(e) { e.preventDefault(); signInWith(email.trim(), pass); }
  function demoLogin(testEmail) { signInWith(testEmail, TEST_PASSWORD); }

  return (
    <div className="login-shell">
      <div className="login-left">
        <div className="au-mark">
          <AULogo size={60} />
          <div className="seal-text">
            <b>Assumption University</b>
            <span>of Thailand · Est. 1969</span>
          </div>
        </div>

        <div className="login-hero">
          <div className="eyebrow" style={{color: "var(--au-gold)", marginBottom: 16}}>Office of Research Affairs</div>
          <h1>
            Research Grant <em>Management</em> System
          </h1>
          <p>
            A unified portal for AU researchers, deans, committees, RASSC,
            the President, and the Office of Financial Management to submit,
            review, and disburse research grants — across the fourteen-stage
            workflow.
          </p>
        </div>

        <div className="login-footnote">
          <span>© 2025 Assumption University</span>
          <span>·</span>
          <a href="#" style={{color: "rgba(255,255,255,0.7)"}}>Privacy</a>
          <a href="#" style={{color: "rgba(255,255,255,0.7)"}}>Terms</a>
          <a href="#" style={{color: "rgba(255,255,255,0.7)"}}>Help</a>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="eyebrow">Sign in to AU-RGMS</div>
          <h2>Welcome back</h2>
          <p className="sub">Sign in with your AU credentials to continue.</p>

          <form onSubmit={doLogin}>
            <div className="field">
              <label>AU Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
            </div>
            <div className="field">
              <label>Password</label>
              <input value={pass} onChange={e => setPass(e.target.value)} type="password" autoComplete="current-password" />
            </div>

            <div style={{ fontSize: 11, color: "var(--ink-3)", margin: "-6px 0 4px", lineHeight: 1.5 }}>
              Your dashboard is decided by your account's role — sign in with your own AU email and password.
            </div>

            {err && <div style={{color: "var(--au-crimson)", fontSize: 12, marginTop: 8}}>{err}</div>}
            <button className="btn btn-primary btn-block mt-4" type="submit" disabled={busy}>
              {busy ? "Signing in…" : <>Sign In <Icon name="ArrowRight" size={14} /></>}
            </button>
          </form>

          <div style={{ borderTop: "1px solid var(--line-2)", margin: "18px 0 12px" }}></div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Quick demo login</div>
          <div className="text-sm text-muted" style={{ fontSize: 11, marginBottom: 10 }}>One click signs you in as a built-in test account for that role.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {APP.ROLES.map(r => (
              <button key={r.key} type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => demoLogin(TEST_EMAIL_FOR[r.key])} style={{ justifyContent: "flex-start", gap: 8 }}>
                <Icon name={r.iconName} size={14} /> {r.name}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4" style={{fontSize: 12}}>
            <a href="#" style={{color: "var(--au-crimson)", fontWeight: 600, textDecoration: "none"}}>Forgot password?</a>
            <span className="text-muted">Need help? <a href="#" style={{color: "var(--ink-1)"}}>Contact RASSC</a></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============= GRANT SYSTEM CHOOSER (researcher landing) ============= */
function GrantSystemChooser({ profile, onPick, onLogout }) {
  const systems = APP.GRANT_SYSTEMS || [];
  const firstName = profile && profile.full_name ? profile.full_name.split(" ")[0] : "";
  return (
    <div className="chooser-shell" style={{ minHeight: "100vh", background: "var(--paper-warm)", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <AULogo size={34} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Assumption University</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>RGMS · Office of Research Affairs</div>
        </div>
        <div style={{ flex: 1 }}></div>
        <span className="text-sm text-muted" style={{ marginRight: 12 }}>{profile ? profile.email : ""}</span>
        <button className="btn btn-secondary btn-sm" onClick={onLogout}><Icon name="LogOut" size={13} /> Sign out</button>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 30, maxWidth: 640 }}>
          <div className="eyebrow" style={{ color: "var(--au-crimson)", marginBottom: 8 }}>Choose a grant to apply for</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500, margin: "0 0 8px" }}>
            Welcome{firstName ? ", " + firstName : ""}
          </h1>
          <p style={{ color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
            Select which AU research grant system you want to work in. You can switch systems at any time.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 300px))", gap: 20, width: "100%", maxWidth: 980, justifyContent: "center" }}>
          {systems.map(sys => {
            const disabled = !sys.enabled;
            return (
              <button
                key={sys.id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onPick(sys.id)}
                style={{
                  textAlign: "left", cursor: disabled ? "not-allowed" : "pointer",
                  background: "var(--paper)", border: "1px solid var(--line)",
                  borderRadius: "var(--r-lg, 14px)", padding: "24px 22px",
                  opacity: disabled ? 0.62 : 1, position: "relative",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)", transition: "border-color .15s, box-shadow .15s, transform .15s",
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = "var(--au-crimson)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(158,27,27,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                {disabled && (
                  <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--ink-3)", background: "var(--paper-warm)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: 999 }}>Coming soon</span>
                )}
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--au-crimson-soft, #f7e9e9)", color: "var(--au-crimson)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={sys.icon} size={24} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--au-crimson)", letterSpacing: 0.4 }}>{sys.code}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 500, margin: "2px 0 8px" }}>{sys.name}</div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 16px", minHeight: 58 }}>{sys.tagline}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--line-2)", paddingTop: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-1)" }}>{sys.maxLabel}</span>
                  {!disabled && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--au-crimson)", display: "inline-flex", alignItems: "center", gap: 4 }}>Apply <Icon name="ArrowRight" size={13} /></span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============= ROLE-SCOPED CONFIG ============= */
const ROLE_CONFIG = {
  researcher: {
    nav: APP.NAV_RESEARCHER,
    homeKey: "r-dashboard",
    crumbRoot: "Researcher",
    sidebarFooter: {
      title: "Quick Help",
      body: "Need to submit a new AU-R1 application? Prepare the proposal format, detailed budget allocation, and AU research submission form as PDFs before you start.",
    },
  },
  dean: {
    nav: APP.NAV_DEAN,
    homeKey: "d-dashboard",
    crumbRoot: "Dean's Office",
    sidebarFooter: {
      title: "Dean's Office",
      body: "Forward eligible applications to the RASSC once the Faculty Academic Committee approves.",
    },
  },
  committee: {
    nav: APP.NAV_COMMITTEE,
    homeKey: "c-dashboard",
    crumbRoot: "Faculty Committee",
    sidebarFooter: {
      title: "Faculty Committee",
      body: "Complete reviews within 10 working days to maintain throughput.",
    },
  },
  iras: {
    nav: APP.NAV_RASSC,
    homeKey: "i-dashboard",
    crumbRoot: "RASSC",
    sidebarFooter: {
      title: "RASSC",
      body: "Assign the available expert reviewers required for the proposal; the President queue opens after all assigned reviews are complete.",
    },
  },
  ofm: {
    nav: APP.NAV_OFM,
    homeKey: "o-dashboard",
    crumbRoot: "OFM / Finance",
    sidebarFooter: {
      title: "OFM Office",
      body: "Process disbursements only after the relevant milestone document is approved.",
    },
  },
  admin: {
    nav: APP.NAV_ADMIN,
    homeKey: "a-dashboard",
    crumbRoot: "Administration",
    sidebarFooter: {
      title: "Administrator",
      body: "Changes to user roles and reference tables are logged in the audit log.",
    },
  },
};

/* ============= APP HEADER ============= */
function AppHeader({ role, profile, onSwitchRole, onLogout, onNavigate }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState(APP.NOTIFS || []);
  const current = APP.ROLES.find(r => r.key === role);
  const displayName = (profile && profile.full_name) || current.full;
  const displayInitials = (profile && profile.full_name)
    ? profile.full_name.trim().split(/\s+/).slice(-2).map(s => s[0]).join("").toUpperCase()
    : current.initials;
  const wrapRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setRoleOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let alive = true;
    if (window.DB && window.DB.notifications) {
      window.DB.notifications().then(items => { if (alive) setNotifItems(items || []); }).catch(() => { if (alive) setNotifItems([]); });
    }
    return () => { alive = false; };
  }, [role, profile && profile.id]);

  return (
    <header className="app-header">
      <div className="au-mark">
        <AULogo size={40} ringWidth={2} />
        <div className="seal-text">
          <b>Assumption University</b>
          <span>RGMS · Research Affairs</span>
        </div>
      </div>
      <div className="system-name">Research Grant Management System</div>

      <div className="grow"></div>

      <div className="app-header-search">
        <Icon name="Search" size={14} className="icon" />
        <input placeholder="Search applications, researchers, IDs…" />
      </div>

      <div className="header-actions" ref={wrapRef}>
        <button className="header-icon-btn" title="Help"><Icon name="HelpCircle" size={18} /></button>
        <div style={{position: "relative"}}>
          <button className="header-icon-btn" title="Notifications" onClick={() => { setNotifOpen(v => !v); setRoleOpen(false); }}>
            <Icon name="Bell" size={18} />
            {notifItems.some(n => n.unread) && <span className="dot"></span>}
          </button>
          {notifOpen && <NotifPanel items={notifItems} onClose={() => setNotifOpen(false)} onOpen={(n) => { if (n.page && onNavigate) onNavigate(n.page); setNotifOpen(false); }} />}
        </div>
        <button className="header-icon-btn" title="Account settings" onClick={() => onNavigate && onNavigate("account")}><Icon name="Settings" size={18} /></button>

        <div style={{position: "relative", marginLeft: 8}}>
          <button className="role-switch" onClick={() => { setRoleOpen(v => !v); setNotifOpen(false); }}>
            <div className="avatar">{displayInitials}</div>
            <div className="role-info">
              <b>{displayName}</b>
              <span>{current.subtitle}</span>
            </div>
            <Icon name="ChevronDown" size={14} />
          </button>
          {roleOpen && (
            <div className="dropdown" onClick={e => e.stopPropagation()} style={{minWidth: 320}}>
              <div className="dropdown-section">Switch test account</div>
              {APP.ROLES.map(r => (
                <div
                  key={r.key}
                  className={`dropdown-item ${role === r.key ? "active" : ""}`}
                  onClick={() => { onSwitchRole(r.key); setRoleOpen(false); }}
                >
                  <div className="role-icon"><Icon name={r.iconName} size={14} /></div>
                  <div className="meta">
                    <div className="t">{r.name}</div>
                    <div className="s">{r.subtitle}</div>
                  </div>
                  {role === r.key && <Icon name="Check" size={14} />}
                </div>
              ))}
              <div className="dropdown-divider"></div>
              <div className="dropdown-section">Account</div>
              <div className="dropdown-item">
                <div className="role-icon" style={{background: "var(--paper-warm)", color: "var(--ink-2)"}}>
                  <Icon name="Settings" size={14} />
                </div>
                <div className="meta">
                  <div className="t">Account settings</div>
                  <div className="s">Profile, security, notifications</div>
                </div>
              </div>
              <div className="dropdown-item" onClick={onLogout}>
                <div className="role-icon" style={{background: "var(--paper-warm)", color: "var(--ink-2)"}}>
                  <Icon name="LogOut" size={14} />
                </div>
                <div className="meta">
                  <div className="t">Sign out</div>
                  <div className="s">Return to AU sign-in</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============= SIDEBAR ============= */
function Sidebar({ nav, current, onNavigate, footer }) {
  return (
    <aside className="sidebar">
      {nav.map((item, i) => {
        if (item.section) {
          return <div key={`s${i}`} className="sidebar-section">{item.section}</div>;
        }
        return (
          <div
            key={item.key}
            className={`nav-item ${current === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
            {item.badge && <span className="badge-num">{item.badge}</span>}
          </div>
        );
      })}
      {footer && (
        <div className="sidebar-bottom">
          <b>{footer.title}</b>
          <p>{footer.body}</p>
          <button className="btn btn-secondary btn-sm" style={{width: "100%", justifyContent: "center"}}>
            <Icon name="HelpCircle" size={12} /> Open Help Centre
          </button>
        </div>
      )}
    </aside>
  );
}

/* ============= SUBBAR / BREADCRUMBS ============= */
function SubBar({ crumbs, onHome, onCrumb }) {
  return (
    <div className="subbar">
      <div className="crumb">
        <a href="#" onClick={e => { e.preventDefault(); onHome(); }}>AU</a>
        <Icon name="ChevronRight" size={12} className="sep" />
        {crumbs.slice(0, -1).map((c, i) => (
          <React.Fragment key={i}>
            <a href="#" onClick={e => { e.preventDefault(); onCrumb && onCrumb(c); }}>{c}</a>
            <Icon name="ChevronRight" size={12} className="sep" />
          </React.Fragment>
        ))}
        <span className="current">{crumbs[crumbs.length - 1]}</span>
      </div>
      <div className="right">
        <Icon name="Clock" size={12} />
        <span>Last sync: 2 min ago</span>
      </div>
    </div>
  );
}

/* ============= ROUTER ============= */
function PageRouter({ pageKey, navigate, ctx }) {
  const c = ctx;
  switch (pageKey) {
    /* ---- Researcher ---- */
    case "r-dashboard":     return <ResearcherDashboard navigate={navigate} onDownload={c.onDownload} onView={c.onView} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} />;
    case "r-submit":        return <ResearcherSubmit applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} />;
    case "r-applications":  return <ResearcherApplications navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} openDraft={(id) => { c.setSelectedApplicationId(id); navigate("r-submit"); }} openDetail={(id) => { c.setSelectedApplicationId(id); navigate("r-detail"); }} />;
    case "r-detail":        return <ResearcherApplicationDetail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "r-progress":      return <ResearcherProgress onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-final":         return <ResearcherFinal onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-payments":      return <ResearcherPayments onDownload={c.onDownload} toast={c.toast} />;
    case "r-publications":  return <ResearcherPublicationGrants toast={c.toast} />;
    case "r-reimburse":     return <ResearcherReimbursements toast={c.toast} />;

    /* ---- Dean ---- */
    case "d-dashboard":      return <DeanDashboard navigate={navigate} />;
    case "d-screen":         return <DeanScreenQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-screen-detail":  return <FacultyChecklist applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-history":        return <DeanHistory onDownload={c.onDownload} />;
    case "d-analytics":      return <AnalyticsDashboard role={c.profile && c.profile.role} />;
    case "d-reimburse":      return <DeanReimbursements toast={c.toast} />;

    /* ---- Committee ---- */
    case "c-dashboard":      return <CommitteeDashboard navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "c-queue":          return <CommitteeQueue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "c-review":         return <FacultyAcademic applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "c-history":        return <CommitteeHistory onDownload={c.onDownload} />;
    case "c-analytics":      return <AnalyticsDashboard role={c.profile && c.profile.role} />;

    /* ---- RASSC ---- */
    case "i-dashboard":      return <RASSCDashboardV2 navigate={navigate} />;
    case "i-received":       return <RASSCReceived navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "i-screen":         return <RASSCScreen applicationId={c.selectedApplicationId} setSelectedApplicationId={c.setSelectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-reports":        return <RASSCReports onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-publications":   return <RASSCPublicationGrants toast={c.toast} />;
    case "i-reimburse":      return <RASSCReimbursements toast={c.toast} />;
    case "i-analytics":      return <AnalyticsDashboard role={c.profile && c.profile.role} />;
    case "i-reviewers":      return <RASSCReviewerPool toast={c.toast} />;

    /* ---- OFM / Finance ---- */
    case "o-dashboard":      return <OFMDashboard navigate={navigate} />;
    case "o-payments":       return <RASSCPayment onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-detail":         return <OFMDetail onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-publications":   return <OFMPublicationPayments toast={c.toast} />;
    case "o-reimburse":      return <OFMReimbursements toast={c.toast} />;
    case "o-history":        return <OFMHistory onDownload={c.onDownload} />;

    /* ---- Administrator ---- */
    case "a-dashboard":      return <AdminDashboard navigate={navigate} />;
    case "a-users":          return <AdminUsers toast={c.toast} />;
    case "a-journals":       return <AdminJournals toast={c.toast} />;
    case "a-analytics":      return <AnalyticsDashboard role={c.profile && c.profile.role} />;
    case "a-audit":          return <AdminAudit />;
    case "a-settings":       return <AdminSettings toast={c.toast} />;

    /* ---- Shared ---- */
    case "forms":            return <FormsLibrary />;
    case "account":          return <AccountSettings toast={c.toast} />;

    default:                 return <Empty title="Page not found" desc="Use the sidebar to navigate." icon="Folder" />;
  }
}

/* ============= HASH ROUTING (for the Figma-view iframes) ============= */
function readHash() {
  try {
    const h = window.location.hash || "";
    const q = h.startsWith("#") ? h.slice(1) : h;
    const params = new URLSearchParams(q);
    return {
      role: params.get("role"),
      page: params.get("page"),
      skipLogin: params.get("skipLogin") === "1",
    };
  } catch (e) { return {}; }
}

/* ============= MAIN APP ============= */
function App() {
  const initial = readHash();
  const startingRole = initial.role && ROLE_CONFIG[initial.role] ? initial.role : "researcher";
  const startingPage = initial.page || ROLE_CONFIG[startingRole].homeKey;

  const [loggedIn, setLoggedIn] = useState(!!initial.skipLogin);
  const [role, setRole] = useState(startingRole);
  const [page, setPage] = useState(startingPage);
  const [profile, setProfile] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  // Which grant system a researcher is working in (au_r1 / au_r3). null → show chooser.
  const [rSystem, setRSystem] = useState(() => { try { return localStorage.getItem("au-rgms-r-system") || null; } catch (e) { return null; } });
  const chooseSystem = (sys) => { try { localStorage.setItem("au-rgms-r-system", sys); } catch (e) {} setSelectedApplicationId(null); setRSystem(sys); setPage("r-dashboard"); };
  const switchSystem = () => { try { localStorage.removeItem("au-rgms-r-system"); } catch (e) {} setRSystem(null); };
  // Central navigation: the "Switch Grant System" pseudo-page returns to the chooser.
  const navigate = (key) => {
    if (key === "r-switch-system") { switchSystem(); return; }
    if (key === "r-submit") setSelectedApplicationId(null);
    setPage(key);
  };

  // shared UI state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const onDownload = async (doc) => {
    try {
      const url = await window.DB.documentUrl(doc, true);
      window.open(url, "_blank", "noopener,noreferrer");
      setToastMsg("Opening download for " + doc.name);
    } catch (e) {
      setToastMsg((doc && doc.name ? doc.name : "Document") + " has no uploaded file attached yet.");
    }
  };
  const onView = async (doc) => {
    if (doc && doc.storage_path) {
      try {
        const url = await window.DB.documentUrl(doc, false);
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      } catch (e) {
        setToastMsg("Could not open " + doc.name + ": " + ((e && e.message) || e));
      }
    }
    setPreviewDoc(doc);
  };
  const toast = (msg) => setToastMsg(msg);

  const switchToTestRole = async (newRole, opts = {}) => {
    if (!ROLE_CONFIG[newRole]) return null;
    const email = opts.email || TEST_EMAIL_FOR[newRole];
    if (!email) return null;
    try {
      const prof = await window.AUTH.signIn(email, TEST_PASSWORD);
      const r = prof && ROLE_CONFIG[prof.role] ? prof.role : newRole;
      setProfile(prof || null);
      setRole(r);
      setSelectedApplicationId(null);
      setLoggedIn(true);
      if (!opts.keepPage) setPage(ROLE_CONFIG[r].homeKey);
      return prof;
    } catch (ex) {
      toast("Could not switch test account: " + ((ex && ex.message) || "sign-in failed."));
      return null;
    }
  };

  const onLogin = (prof) => {
    const r = prof && ROLE_CONFIG[prof.role] ? prof.role : "researcher";
    setProfile(prof || null);
    setRole(r);
    setPage(ROLE_CONFIG[r].homeKey);
    setLoggedIn(true);
  };

  const onSwitchRole = (newRole, email) => {
    if (!ROLE_CONFIG[newRole]) return;
    switchToTestRole(newRole, { email });
  };

  const onLogout = async () => {
    try { await window.AUTH.signOut(); } catch (e) {}
    switchSystem();
    setProfile(null); setLoggedIn(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const sess = await window.AUTH.session();
        if (!sess) {
          if (initial.skipLogin) await switchToTestRole(startingRole, { keepPage: true });
          return;
        }
        const prof = await window.AUTH.profile();
        if (!prof) return;
        if (initial.skipLogin) {
          if (initial.role && ROLE_CONFIG[initial.role] && prof.role !== initial.role) {
            await switchToTestRole(initial.role, { keepPage: true });
          } else {
            setProfile(prof);
            if (ROLE_CONFIG[prof.role]) setRole(prof.role);
          }
        }
        else onLogin(prof);
      } catch (e) {}
    })();
  }, []);

  const cfg = ROLE_CONFIG[role];

  const pageLabel = useMemo(() => {
    const navItem = cfg.nav.find(n => n.key === page);
    if (navItem) return navItem.label;
    // Special pages with no sidebar entry
    const special = {
      "r-detail": "Application Detail",
      "d-screen-detail": "Screening · Detail",
      "d-sign-detail": "Sign &amp; Forward · Detail",
    };
    return special[page] || "Dashboard";
  }, [cfg, page]);

  const crumbs = useMemo(() => [cfg.crumbRoot, pageLabel], [cfg.crumbRoot, pageLabel]);

  if (!loggedIn) {
    return <LoginPage onLogin={onLogin} />;
  }

  // Researchers pick a grant system first; every other role goes straight to its shell.
  if (role === "researcher" && !rSystem) {
    return <GrantSystemChooser profile={profile} onPick={chooseSystem} onLogout={onLogout} />;
  }

  return (
    <div className="app">
      <AppHeader role={role} profile={profile} onSwitchRole={onSwitchRole} onLogout={onLogout} onNavigate={setPage} />
      <SubBar
        crumbs={crumbs}
        onHome={() => setPage(cfg.homeKey)}
        onCrumb={() => setPage(cfg.homeKey)}
      />
      <Sidebar
        nav={cfg.nav}
        current={page}
        onNavigate={navigate}
        footer={cfg.sidebarFooter}
      />
      <main className="main">
        <PageRouter
          pageKey={page}
          navigate={navigate}
          ctx={{ onDownload, onView, toast, setConfirm, profile, selectedApplicationId, setSelectedApplicationId, grantType: role === "researcher" ? rSystem : null }}
        />
      </main>
      <footer className="app-footer">
        <div className="logo-tiny">
          <div className="seal-tiny">
            <img src="assets/au-logo.png" alt="AU" />
          </div>
          <span>AU Research Grant Management System</span>
        </div>
        <span>·</span>
        <span>v1.0.0</span>
        <span>·</span>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">User Guide</a>
        <a href="#">Contact RASSC</a>
        <span className="right">© 2025 Assumption University · Office of Research Affairs</span>
      </footer>

      {previewDoc && (
        <FilePreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={onDownload}
        />
      )}

      {confirm && (
        <ConfirmModal
          open={true}
          onClose={() => setConfirm(null)}
          onConfirm={(reason) => { confirm.onConfirm(reason); setConfirm(null); }}
          title={confirm.title}
          message={confirm.message}
          kind={confirm.kind}
          confirmLabel={confirm.confirmLabel}
          withReason={confirm.withReason}
          reasonLabel={confirm.reasonLabel}
          reasonRequired={confirm.reasonRequired}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
