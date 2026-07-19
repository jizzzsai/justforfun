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

/* ============= EMBEDDED AU AI HELPER (grant chooser) ============= */
const CHOOSER_INTRO = "Hi, I'm AU AI. Not sure which grant fits you? Ask me what each one is for, how they differ, the amounts, or what documents you'll need — I'll help you pick.";
const CHOOSER_CHIPS = [
  "What's the difference between AU-R1, AU-R3 and AU-R4?",
  "Which grant is for presenting a paper at a conference?",
  "How is my AU-R4 publication reward calculated?",
  "Can students apply together with me?",
];
function GrantHelperChat({ profile }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: CHOOSER_INTRO }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const ctx = { role: "researcher", name: profile && profile.full_name, faculty: profile && profile.faculty };

  useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs, busy]);

  async function ask(text) {
    const q = (text || input).trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user", content: q }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: ctx }),
      });
      const data = await r.json();
      setMsgs(m => [...m, { role: "assistant", content: data.reply || "Sorry, no response." }]);
    } catch (e) {
      setMsgs(m => [...m, { role: "assistant", content: "Sorry, I couldn't reach AU AI right now." }]);
    } finally { setBusy(false); }
  }

  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--r-xl, 16px)", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line-2)", background: "linear-gradient(90deg, var(--au-crimson) 0%, var(--au-crimson-deep, #7a1414) 100%)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.18)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="GraduationCap" size={18} />
        </div>
        <div style={{ lineHeight: 1.25, color: "#fff" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Ask AU AI</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Not sure which grant to choose? I can help.</div>
        </div>
      </div>

      <div ref={bodyRef} style={{ maxHeight: 260, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, background: "var(--paper-warm)" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
            background: m.role === "user" ? "var(--au-crimson)" : "var(--paper)",
            color: m.role === "user" ? "#fff" : "var(--ink-1)",
            border: m.role === "user" ? "none" : "1px solid var(--line)",
            borderRadius: 12, padding: "9px 13px", fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {m.content}
          </div>
        ))}
        {busy && <div style={{ alignSelf: "flex-start", fontSize: 13, color: "var(--ink-3)", fontStyle: "italic" }}>AU AI is thinking…</div>}
        {msgs.length <= 1 && !busy && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {CHOOSER_CHIPS.map((s, i) => (
              <button key={i} type="button" onClick={() => ask(s)}
                style={{ fontSize: 12, color: "var(--au-crimson)", background: "var(--au-crimson-soft)", border: "1px solid transparent", borderRadius: 999, padding: "6px 12px", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={e => { e.preventDefault(); ask(); }} style={{ display: "flex", gap: 8, padding: "12px 14px", borderTop: "1px solid var(--line-2)", background: "var(--paper)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the grants…"
          style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", fontSize: 13 }} />
        <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()} aria-label="Send"><Icon name="Send" size={15} /></button>
      </form>
    </div>
  );
}

/* ============= GRANT SYSTEM CHOOSER (researcher landing) ============= */
function GrantSystemChooser({ profile, onPick, onLogout }) {
  const systems = APP.GRANT_SYSTEMS || [];
  const firstName = profile && profile.full_name ? profile.full_name.split(" ")[0] : "";
  return (
    <div className="chooser-shell" style={{ minHeight: "100vh", background: "radial-gradient(1200px 480px at 50% -8%, var(--au-crimson-soft) 0%, rgba(0,0,0,0) 60%), var(--paper-warm)", display: "flex", flexDirection: "column" }}>
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 20px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 34, maxWidth: 660 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ height: 1, width: 30, background: "var(--au-gold)" }}></span>
            <span className="eyebrow" style={{ color: "var(--au-crimson)" }}>Choose a grant to apply for</span>
            <span style={{ height: 1, width: 30, background: "var(--au-gold)" }}></span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 500, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
            Welcome{firstName ? ", " + firstName : ""}
          </h1>
          <p style={{ color: "var(--ink-2)", margin: 0, lineHeight: 1.65, fontSize: 15 }}>
            Pick the AU research grant you want to work in. Each has its own form and documents —
            the review workflow and payments are handled the same way. You can switch anytime.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(272px, 300px))", gap: 22, width: "100%", maxWidth: 980, justifyContent: "center" }}>
          {systems.map(sys => {
            const disabled = !sys.enabled;
            const accent = sys.accent || "#9E1B1B";
            const accentSoft = sys.accentSoft || "var(--au-crimson-soft)";
            return (
              <button
                key={sys.id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onPick(sys.id)}
                style={{
                  textAlign: "left", cursor: disabled ? "not-allowed" : "pointer",
                  background: "var(--paper)", border: "1px solid var(--line)",
                  borderRadius: "var(--r-xl, 16px)", padding: 0, position: "relative", overflow: "hidden",
                  opacity: disabled ? 0.66 : 1,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)", transition: "border-color .15s, box-shadow .15s, transform .15s",
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = "0 10px 30px " + accentSoft; e.currentTarget.style.transform = "translateY(-3px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ height: 5, background: accent }}></div>
                <div style={{ padding: "22px 22px 20px" }}>
                  {disabled && (
                    <span style={{ position: "absolute", top: 18, right: 16, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--ink-3)", background: "var(--paper-warm)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: 999 }}>Coming soon</span>
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: accentSoft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon name={sys.icon} size={24} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: 0.6 }}>{sys.code}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, margin: "2px 0 8px", lineHeight: 1.2 }}>{sys.name}</div>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 14px" }}>{sys.tagline}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
                    {(sys.highlights || []).map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "var(--ink-2)" }}>
                        <span style={{ color: accent, marginTop: 1, flexShrink: 0, display: "inline-flex" }}><Icon name="Check" size={14} /></span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--line-2)", paddingTop: 13 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-1)" }}>{sys.maxLabel}</span>
                    {!disabled && <span style={{ fontSize: 13, fontWeight: 600, color: accent, display: "inline-flex", alignItems: "center", gap: 4 }}>Apply <Icon name="ArrowRight" size={13} /></span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ width: "100%", maxWidth: 720, marginTop: 40 }}>
          <GrantHelperChat profile={profile} />
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
    case "r-submit":        return c.grantType === "au_r4"
                              ? <ResearcherSubmitR4 applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />
                              : c.grantType === "au_r3"
                              ? <ResearcherSubmitR3 applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />
                              : <ResearcherSubmit applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} />;
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
    case "d-r3-screen":      return <DeanR3Queue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-r3-detail":      return <DeanR3Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
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
  // A researcher working in AU-R3 gets a trimmed sidebar + AU-R3 Quick Help.
  const researcherR3 = role === "researcher" && rSystem === "au_r3";
  const navForRole = researcherR3 ? (APP.NAV_RESEARCHER_R3 || cfg.nav) : cfg.nav;
  const footerForRole = researcherR3
    ? { title: "Quick Help", body: "Need to submit a new AU-R3 application? Prepare your full research article, Turnitin result, peer-review comments if available, and a memo with an estimated budget before you start." }
    : cfg.sidebarFooter;

  const pageLabel = useMemo(() => {
    const navItem = navForRole.find(n => n.key === page);
    if (navItem) return navItem.label;
    // Special pages with no sidebar entry
    const special = {
      "r-detail": "Application Detail",
      "d-screen-detail": "Screening · Detail",
      "d-sign-detail": "Sign &amp; Forward · Detail",
      "d-r3-detail": "AU-R3 Screening · Detail",
      "forms": "Forms & Templates",
    };
    return special[page] || "Dashboard";
  }, [navForRole, page]);

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
        nav={navForRole}
        current={page}
        onNavigate={navigate}
        footer={footerForRole}
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
