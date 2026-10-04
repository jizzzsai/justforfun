




const APP = window.AU;


function LoginPage({ onLogin }) {
  const [role, setRole] = useState("researcher");
  const [email, setEmail] = useState("phyomintun@au.edu");
  const [pass, setPass] = useState("•••••••••");

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
            A unified portal for AU researchers, deans, committees, IRAS,
            the President, and the Academic Office to submit,
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

          <form onSubmit={(e) => { e.preventDefault(); onLogin(role); }}>
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
                      onChange={() => setRole(r.key)}
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

            <button className="btn btn-primary btn-block mt-4" type="submit">
              Sign In <Icon name="ArrowRight" size={14} />
            </button>
          </form>

          <div className="flex justify-between items-center mt-4" style={{fontSize: 12}}>
            <a href="#" style={{color: "var(--au-crimson)", fontWeight: 600, textDecoration: "none"}}>Forgot password?</a>
            <span className="text-muted">Need help? <a href="#" style={{color: "var(--ink-1)"}}>Contact IRAS</a></span>
          </div>
        </div>
      </div>
    </div>
  );
}


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
      body: "Forward eligible applications to IRAS within five working days of receipt.",
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
    nav: APP.NAV_IRAS,
    homeKey: "i-dashboard",
    crumbRoot: "IRAS Office",
    sidebarFooter: {
      title: "IRAS Office",
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
      body: "Approvals must be marked within five working days. Contracts must be signed within fifteen.",
    },
  },
  ofm: {
    nav: APP.NAV_OFM,
    homeKey: "o-dashboard",
    crumbRoot: "Academic",
    sidebarFooter: {
      title: "Academic Office",
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


function AppHeader({ role, onSwitchRole, onLogout }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const current = APP.ROLES.find(r => r.key === role);
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
            <div className="avatar">{current.initials}</div>
            <div className="role-info">
              <b>{current.full}</b>
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


function PageRouter({ pageKey, navigate, ctx }) {
  const c = ctx;
  switch (pageKey) {

    case "r-dashboard":     return <ResearcherDashboard navigate={navigate} onDownload={c.onDownload} onView={c.onView} />;
    case "r-submit":        return <ResearcherSubmit navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-applications":  return <ResearcherApplications navigate={navigate} onDownload={c.onDownload} openDetail={() => navigate("r-detail")} />;
    case "r-detail":        return <ResearcherApplicationDetail navigate={navigate} onDownload={c.onDownload} onView={c.onView} />;
    case "r-progress":      return <ResearcherProgress onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-final":         return <ResearcherFinal onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-payments":      return <ResearcherPayments onDownload={c.onDownload} toast={c.toast} />;


    case "d-dashboard":      return <DeanDashboard navigate={navigate} />;
    case "d-screen":         return <DeanScreenQueue navigate={navigate} onDownload={c.onDownload} />;
    case "d-screen-detail":  return <FacultyChecklist navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-sign":           return <DeanSignQueue navigate={navigate} onDownload={c.onDownload} />;
    case "d-sign-detail":    return <FacultyDean onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-history":        return <DeanHistory onDownload={c.onDownload} />;


    case "c-dashboard":      return <CommitteeDashboard navigate={navigate} />;
    case "c-queue":          return <CommitteeQueue navigate={navigate} onDownload={c.onDownload} />;
    case "c-review":         return <FacultyAcademic onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "c-history":        return <CommitteeHistory onDownload={c.onDownload} />;


    case "i-dashboard":      return <IRASDashboardV2 navigate={navigate} />;
    case "i-received":       return <IRASReceived navigate={navigate} onDownload={c.onDownload} />;
    case "i-screen":         return <IRASScreen navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-assign":         return <IRASAssign toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-reviewers":      return <IRASReviewerPool toast={c.toast} />;


    case "e-dashboard":      return <ExpertDashboard navigate={navigate} />;
    case "e-assignments":    return <ExpertAssignments navigate={navigate} onDownload={c.onDownload} />;
    case "e-evaluate":       return <IRASExpert onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "e-history":        return <ExpertHistory onDownload={c.onDownload} />;


    case "p-dashboard":      return <PresidentDashboard navigate={navigate} />;
    case "p-queue":          return <PresidentQueue navigate={navigate} onDownload={c.onDownload} />;
    case "p-approve":        return <IRASPresident onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "p-contracts":      return <IRASContract onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;


    case "o-dashboard":      return <OFMDashboard navigate={navigate} />;
    case "o-payments":       return <IRASPayment onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-detail":         return <OFMDetail onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-history":        return <OFMHistory onDownload={c.onDownload} />;


    case "a-dashboard":      return <AdminDashboard navigate={navigate} />;
    case "a-users":          return <AdminUsers toast={c.toast} />;
    case "a-journals":       return <AdminJournals toast={c.toast} />;
    case "a-audit":          return <AdminAudit />;
    case "a-settings":       return <AdminSettings toast={c.toast} />;

    default:                 return <Empty title="Page not found" desc="Use the sidebar to navigate." icon="Folder" />;
  }
}


function readHash() {
  try {
    const h = window.location.hash || "";
    const q = h.startsWith("#") ? h.slice(1) : h;
    const params = new URLSearchParams(q);
    return {
      role: params.get("role"),
      page: params.get("page"),
    };
  } catch (e) { return {}; }
}


function App() {
  const initial = readHash();
  const startingRole = initial.role && ROLE_CONFIG[initial.role] ? initial.role : "researcher";
  const startingPage = initial.page || ROLE_CONFIG[startingRole].homeKey;

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(startingRole);
  const [page, setPage] = useState(startingPage);


  const [previewDoc, setPreviewDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const onDownload = (doc) => setToastMsg(`Demo only: downloading ${doc.name}`);
  const onView = (doc) => setPreviewDoc(doc);
  const toast = (msg) => setToastMsg(msg);

  const onLogin = (selectedRole) => {
    setRole(selectedRole);
    setPage(ROLE_CONFIG[selectedRole].homeKey);
    setLoggedIn(true);
  };

  const onSwitchRole = (newRole) => {
    if (!ROLE_CONFIG[newRole]) return;
    setRole(newRole);
    setPage(ROLE_CONFIG[newRole].homeKey);
  };

  const onLogout = () => setLoggedIn(false);

  const cfg = ROLE_CONFIG[role];

  const pageLabel = useMemo(() => {
    const navItem = cfg.nav.find(n => n.key === page);
    if (navItem) return navItem.label;

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
      <AppHeader role={role} onSwitchRole={onSwitchRole} onLogout={onLogout} />
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
          ctx={{ onDownload, onView, toast, setConfirm }}
        />
      </main>
      <footer className="app-footer">
        <div className="logo-tiny">
          <div className="seal-tiny">
            <img src="assets/au-logo.jpg" alt="AU" />
          </div>
          <span>AU Research Grant Management System</span>
        </div>
        <span>·</span>
        <span>v1.0.0</span>
        <span>·</span>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">User Guide</a>
        <a href="#">Contact IRAS</a>
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


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
