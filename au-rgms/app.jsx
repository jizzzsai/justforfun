/* ============================================================
   AU RGMS · App shell
   8 roles · single login · in-app role switcher
   ============================================================ */

const APP = window.AU;
const DEMO_PASSWORD = "AuResearch#2026";
const DEMO_EMAIL_FOR = {
  researcher: "somchai.r@au.edu",
  dean: "dean.sci@au.edu",
  committee: "comm.chair@au.edu",
  iras: "iras.office@au.edu",
  expert: "expert.ml@au.edu",
  president: "president@au.edu",
  ofm: "finance@au.edu",
  admin: "admin@au.edu",
};

/* ============= LOGIN PAGE ============= */
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("researcher");
  const [email, setEmail] = useState(DEMO_EMAIL_FOR.researcher);
  const [pass, setPass] = useState(DEMO_PASSWORD);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function doLogin(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const prof = await window.AUTH.signIn(email, pass);
      if (!prof) throw new Error("No profile found for this account.");
      onLogin(prof);
    } catch (ex) { setErr((ex && ex.message) || "Sign-in failed."); setBusy(false); }
  }

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

            <div className="field">
              <label>Sign in as</label>
              <div className="role-radio" style={{gridTemplateColumns: "1fr 1fr", display: "grid", gap: 8}}>
                {APP.ROLES.map(r => (
                  <label key={r.key} className={role === r.key ? "active" : ""} style={{padding: "10px 12px"}}>
                    <input
                      type="radio"
                      name="role"
                      value={r.key}
                      checked={role === r.key}
                      onChange={() => { setRole(r.key); setEmail(DEMO_EMAIL_FOR[r.key] || email); }}
                      style={{display: "none"}}
                    />
                    <Icon name={r.iconName} size={16} style={{color: role === r.key ? "var(--au-crimson)" : "var(--ink-3)"}} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div className="role-title" style={{fontSize: 12}}>{r.name}</div>
                      <div className="role-desc" style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{r.subtitle}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {err && <div style={{color: "var(--au-crimson)", fontSize: 12, marginTop: 8}}>{err}</div>}
            <button className="btn btn-primary btn-block mt-4" type="submit" disabled={busy}>
              {busy ? "Signing in…" : <>Sign In <Icon name="ArrowRight" size={14} /></>}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4" style={{fontSize: 12}}>
            <a href="#" style={{color: "var(--au-crimson)", fontWeight: 600, textDecoration: "none"}}>Forgot password?</a>
            <span className="text-muted">Need help? <a href="#" style={{color: "var(--ink-1)"}}>Contact RASSC</a></span>
          </div>
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
      body: "Need to submit a new application? Make sure all four required forms are ready as PDF before you start.",
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
      body: "Assign three experts per proposal — at least two external where possible.",
    },
  },
  expert: {
    nav: APP.NAV_EXPERT,
    homeKey: "e-dashboard",
    crumbRoot: "Expert Reviewer",
    sidebarFooter: {
      title: "Reviewer Tips",
      body: "Score 0–100. Provide strengths and weaknesses. A favorable verdict requires score ≥ 70.",
    },
  },
  president: {
    nav: APP.NAV_PRESIDENT,
    homeKey: "p-dashboard",
    crumbRoot: "Office of the President",
    sidebarFooter: {
      title: "President's Office",
      body: "Final approval rests with the President. The grant contract must be signed within 45 days.",
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
function AppHeader({ role, profile, onSwitchRole, onLogout }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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
            <span className="dot"></span>
          </button>
          {notifOpen && <NotifPanel items={APP.NOTIFS} onClose={() => setNotifOpen(false)} />}
        </div>
        <button className="header-icon-btn" title="Settings"><Icon name="Settings" size={18} /></button>

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
              <div className="dropdown-section">Switch role · demo</div>
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
    case "r-dashboard":     return <ResearcherDashboard navigate={navigate} onDownload={c.onDownload} onView={c.onView} />;
    case "r-submit":        return <ResearcherSubmit navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-applications":  return <ResearcherApplications navigate={navigate} onDownload={c.onDownload} openDetail={() => navigate("r-detail")} />;
    case "r-detail":        return <ResearcherApplicationDetail navigate={navigate} onDownload={c.onDownload} onView={c.onView} />;
    case "r-progress":      return <ResearcherProgress onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-final":         return <ResearcherFinal onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-payments":      return <ResearcherPayments onDownload={c.onDownload} toast={c.toast} />;

    /* ---- Dean ---- */
    case "d-dashboard":      return <DeanDashboard navigate={navigate} />;
    case "d-screen":         return <DeanScreenQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-screen-detail":  return <FacultyChecklist navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-sign":           return <DeanSignQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-sign-detail":    return <FacultyDean onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-history":        return <DeanHistory onDownload={c.onDownload} />;

    /* ---- Committee ---- */
    case "c-dashboard":      return <CommitteeDashboard navigate={navigate} />;
    case "c-queue":          return <CommitteeQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "c-review":         return <FacultyAcademic onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "c-history":        return <CommitteeHistory onDownload={c.onDownload} />;

    /* ---- RASSC ---- */
    case "i-dashboard":      return <RASSCDashboardV2 navigate={navigate} />;
    case "i-received":       return <RASSCReceived navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-screen":         return <RASSCScreen navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-assign":         return <RASSCAssign toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-reviewers":      return <RASSCReviewerPool toast={c.toast} />;

    /* ---- Expert Reviewer ---- */
    case "e-dashboard":      return <ExpertDashboard navigate={navigate} />;
    case "e-assignments":    return <ExpertAssignments navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "e-evaluate":       return <RASSCExpert applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "e-history":        return <ExpertHistory onDownload={c.onDownload} />;

    /* ---- President ---- */
    case "p-dashboard":      return <PresidentDashboard navigate={navigate} />;
    case "p-queue":          return <PresidentQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "p-approve":        return <RASSCPresident onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "p-contracts":      return <RASSCContract onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;

    /* ---- OFM / Finance ---- */
    case "o-dashboard":      return <OFMDashboard navigate={navigate} />;
    case "o-payments":       return <RASSCPayment onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-detail":         return <OFMDetail onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-history":        return <OFMHistory onDownload={c.onDownload} />;

    /* ---- Administrator ---- */
    case "a-dashboard":      return <AdminDashboard navigate={navigate} />;
    case "a-users":          return <AdminUsers toast={c.toast} />;
    case "a-journals":       return <AdminJournals toast={c.toast} />;
    case "a-audit":          return <AdminAudit />;
    case "a-settings":       return <AdminSettings toast={c.toast} />;

    /* ---- Shared ---- */
    case "forms":            return <FormsLibrary />;

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

  // shared UI state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const onDownload = (doc) => setToastMsg(`Demo only: downloading ${doc.name}`);
  const onView = (doc) => setPreviewDoc(doc);
  const toast = (msg) => setToastMsg(msg);

  const switchToDemoRole = async (newRole, opts = {}) => {
    if (!ROLE_CONFIG[newRole]) return null;
    const email = DEMO_EMAIL_FOR[newRole];
    if (!email) return null;
    try {
      const prof = await window.AUTH.signIn(email, DEMO_PASSWORD);
      const r = prof && ROLE_CONFIG[prof.role] ? prof.role : newRole;
      setProfile(prof || null);
      setRole(r);
      setSelectedApplicationId(null);
      setLoggedIn(true);
      if (!opts.keepPage) setPage(ROLE_CONFIG[r].homeKey);
      return prof;
    } catch (ex) {
      toast("Could not switch demo account: " + ((ex && ex.message) || "sign-in failed."));
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

  const onSwitchRole = (newRole) => {
    if (!ROLE_CONFIG[newRole]) return;
    switchToDemoRole(newRole);
  };

  const onLogout = async () => {
    try { await window.AUTH.signOut(); } catch (e) {}
    setProfile(null); setLoggedIn(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const sess = await window.AUTH.session();
        if (!sess) {
          if (initial.skipLogin) await switchToDemoRole(startingRole, { keepPage: true });
          return;
        }
        const prof = await window.AUTH.profile();
        if (!prof) return;
        if (initial.skipLogin) {
          if (initial.role && ROLE_CONFIG[initial.role] && prof.role !== initial.role) {
            await switchToDemoRole(initial.role, { keepPage: true });
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

  return (
    <div className="app">
      <AppHeader role={role} profile={profile} onSwitchRole={onSwitchRole} onLogout={onLogout} />
      <SubBar
        crumbs={crumbs}
        onHome={() => setPage(cfg.homeKey)}
        onCrumb={() => setPage(cfg.homeKey)}
      />
      <Sidebar
        nav={cfg.nav}
        current={page}
        onNavigate={setPage}
        footer={cfg.sidebarFooter}
      />
      <main className="main">
        <PageRouter
          pageKey={page}
          navigate={setPage}
          ctx={{ onDownload, onView, toast, setConfirm, selectedApplicationId, setSelectedApplicationId }}
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
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          title={confirm.title}
          message={confirm.message}
          kind={confirm.kind}
          confirmLabel={confirm.confirmLabel}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
