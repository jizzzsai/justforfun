




const APP = window.AU;
const TEST_PASSWORD = "123456789";
const SELF_SERVICE_RESET_EMAIL = "u6430040@au.edu";
const DEMO_MODE_KEY = "au-rgms-demo-mode";
function isPasswordRecoveryRoute() {
  return new URLSearchParams(window.location.search).get("reset-password") === "1" || /(?:^|[&#])type=recovery(?:&|$)/.test(window.location.hash || "");
}
function readDemoMode() {
  try {
    return sessionStorage.getItem(DEMO_MODE_KEY) === "true" || localStorage.getItem(DEMO_MODE_KEY) === "true";
  } catch (e) { return false; }
}
function writeDemoMode(enabled, persist = false) {
  try {
    sessionStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(DEMO_MODE_KEY);
    if (enabled) window[persist ? "localStorage" : "sessionStorage"].setItem(DEMO_MODE_KEY, "true");
  } catch (e) {}
}
const FACULTY_TEST_ROLES = [
  { key: "researcher", label: "Researcher" },
  { key: "dean", label: "Dean" },
  { key: "committee", label: "Committee" },
];
function facultyTestEmail(code, role) {
  return String(code || "VMES").toLowerCase() + role + "@au.edu";
}
const TEST_EMAIL_FOR = {
  researcher: "vmesresearcher@au.edu",
  dean: "vmesdean@au.edu",
  committee: "vmescommittee@au.edu",
  iras: "rassc@au.edu",
  ofm: "finance@au.edu",
  admin: "admin@au.edu",
};
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => !!(window.AUTH && window.AUTH.remembersSession()));
  const [helpTopic, setHelpTopic] = useState(null);
  const [demoFaculty, setDemoFaculty] = useState("VMES");
  const [resetSent, setResetSent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const loginPending = useRef(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const previous = viewport.getAttribute("content");
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
    return () => viewport.setAttribute("content", previous || "width=1280");
  }, []);

  async function signInWith(em, pw, isDemo = false) {
    if (loginPending.current) return;
    loginPending.current = true;
    setErr(""); setBusy(true);
    try {
      const prof = await window.AUTH.signIn(em, pw, remember);
      if (!prof) throw new Error("No profile found for this account.");
      onLogin(prof, { isDemo, persistDemo: isDemo && remember });
    } catch (ex) {
      setErr((ex && ex.message) || "Sign-in failed. Please try again.");
    } finally {
      loginPending.current = false;
      setBusy(false);
    }
  }
  function doLogin(e) {
    e.preventDefault();
    if (loginPending.current) return;
    const auEmail = email.trim();
    if (!/^[^@\s]+@au\.edu$/i.test(auEmail)) {
      setErr("Use your registered AU email ending in @au.edu.");
      emailInput.current.focus();
      return;
    }
    if (!pass) { setErr("Enter your password."); passwordInput.current.focus(); return; }
    signInWith(auEmail, pass);
  }
  function demoLogin(testEmail) { signInWith(testEmail, TEST_PASSWORD, true); }

  async function requestPasswordReset() {
    const auEmail = email.trim().toLowerCase();
    setErr(""); setResetSent("");
    if (auEmail !== SELF_SERVICE_RESET_EMAIL) {
      setHelpTopic("access");
      return;
    }
    setBusy(true);
    try {
      await window.AUTH.requestPasswordReset(auEmail);
      setResetSent("Password reset email sent to " + auEmail + ". Open the link in that email to choose a new password.");
    } catch (ex) {
      setErr((ex && ex.message) || "Could not send the password reset email.");
    } finally { setBusy(false); }
  }

  async function changeRecoveredPassword(e) {
    e.preventDefault(); setErr("");
    if (newPassword.length < 8) return setErr("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return setErr("The two passwords do not match.");
    setBusy(true);
    try {
      const prof = await window.AUTH.profile();
      if (!prof || String(prof.email || "").toLowerCase() !== SELF_SERVICE_RESET_EMAIL) {
        throw new Error("This password-reset link is not valid for this account.");
      }
      await window.AUTH.updatePassword(newPassword);
      setPasswordChanged(true);
    } catch (ex) {
      setErr((ex && ex.message) || "Could not update the password. Request a new reset email and try again.");
    } finally { setBusy(false); }
  }

  if (isPasswordRecoveryRoute()) {
    return (
      <div className="au-login">
        <main className="au-login-shell" aria-labelledby="au-reset-title">
          <section className="au-login-story" aria-label="Assumption University Research Affairs">
            <header className="au-login-identity">
              <div className="au-login-seal"><img src="assets/au-logo.png" alt="Assumption University crest" width="58" height="58" /></div>
              <div><p className="au-login-university">Assumption University</p><p className="au-login-meta">Research Grant Management System</p></div>
            </header>
            <div className="au-login-story-content"><h1 className="au-login-title">Secure account <em>recovery</em></h1><p className="au-login-story-note">Choose a new password for your AU-RGMS account.</p></div>
          </section>
          <section className="au-login-access">
            <div className="au-login-form-panel">
              <p className="au-login-form-label">AU-RGMS · Password recovery</p>
              <h2 className="au-login-welcome" id="au-reset-title">{passwordChanged ? "Password changed" : "Create a new password"}</h2>
              {passwordChanged ? <>
                <p className="au-login-intro">Your password has been updated. You can now return to the login page.</p>
                <button className="au-login-submit" type="button" onClick={async () => { try { await window.AUTH.signOut(); } catch (e) {} window.location.replace(window.location.origin + window.location.pathname); }}>Return to Login</button>
              </> : <form onSubmit={changeRecoveredPassword}>
                <div className="au-login-field"><label htmlFor="au-new-password">New password</label><input id="au-new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" required disabled={busy} /></div>
                <div className="au-login-field"><label htmlFor="au-confirm-password">Confirm new password</label><input id="au-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required disabled={busy} /></div>
                {err && <p className="au-login-error" role="alert">{err}</p>}
                <button className="au-login-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Update Password"}</button>
              </form>}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="au-login">
      <main className="au-login-shell" aria-labelledby="au-login-system-title">
        <svg className="au-login-surface" viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H540C545 105 651 157 672 272C705 431 553 493 550 616C548 678 580 730 612 760H0Z" />
        </svg>
        <section className="au-login-story" aria-label="Assumption University Research Affairs">
          <header className="au-login-identity">
            <div className="au-login-seal"><img src="assets/au-logo.png" alt="Assumption University crest" width="58" height="58" /></div>
            <div>
              <p className="au-login-university">Assumption University</p>
              <p className="au-login-meta">of Thailand · Est. 1969</p>
            </div>
          </header>
          <div className="au-login-story-content">
            <div className="au-login-story-heading">
              <h1 className="au-login-title" id="au-login-system-title">Research Grant <em>Management</em> System</h1>
            </div>
            <p className="au-login-story-note">Making research grant applications simpler for AU researchers—from submission to approval, reporting, and payment.</p>
          </div>
          <p className="au-login-copyright">© {new Date().getFullYear()} Assumption University of Thailand</p>
        </section>
        <section className="au-login-access" aria-labelledby="au-login-welcome">
          <div className="au-login-form-panel">
            <p className="au-login-form-label"><span aria-hidden="true"></span> AU-RGMS · University portal</p>
            <h2 className="au-login-welcome" id="au-login-welcome">Login</h2>
            <p className="au-login-intro">Welcome. Sign in with your AU account.</p>
            <form onSubmit={doLogin} noValidate aria-busy={busy}>
              <div className="au-login-field">
                <label htmlFor="au-login-email">AU Email</label>
                <input id="au-login-email" ref={emailInput} name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@au.edu" autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={busy} aria-describedby={err ? "au-login-error" : undefined} />
              </div>
              <div className="au-login-field">
                <label htmlFor="au-login-password">Password</label>
                <div className="au-login-password-wrap">
                  <input id="au-login-password" ref={passwordInput} name="password" value={pass} onChange={e => setPass(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required disabled={busy} aria-describedby={err ? "au-login-error" : undefined} />
                  <button className="au-login-password-toggle" type="button" disabled={busy} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="au-login-password" onClick={() => { setShowPassword(v => !v); passwordInput.current.focus(); }}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {showPassword ? <><path d="m3 3 18 18" /><path d="M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.9M6.6 6.7C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.8-.5" /></> : <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></>}
                    </svg>
                  </button>
                </div>
              </div>
              <div className="au-login-options">
                <label className="au-login-remember"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} disabled={busy} aria-describedby="au-login-remember-note" /> Remember me</label>
                <button className="au-login-text-button" type="button" onClick={requestPasswordReset} disabled={busy}>Forgot password?</button>
              </div>
              <span className="au-login-sr-only" id="au-login-remember-note">Remember your login on this device. Leave unchecked on shared computers to keep the session in this tab only.</span>
              {err && <p className="au-login-error" id="au-login-error" role="alert">{err}</p>}
              {resetSent && <p className="au-login-success" role="status">{resetSent}</p>}
              <button className="au-login-submit" type="submit" disabled={busy}>{busy ? "Signing in…" : <>Sign In <Icon name="ArrowRight" size={16} /></>}</button>
            </form>
            <div className="au-login-support">
              <span>Having trouble signing in?</span>
              <button type="button" onClick={() => setHelpTopic("access")}>Contact Research Affairs / IT Support</button>
            </div>
            <details className="au-login-demo">
              <summary>Developer Demo Access <Icon name="ChevronDown" size={12} /></summary>
              <div className="au-login-demo-panel">
                <p>Select a faculty account. Every test account uses password <strong>{TEST_PASSWORD}</strong>.</p>
                <label className="au-login-demo-select">
                  <span>Faculty</span>
                  <select value={demoFaculty} onChange={e => setDemoFaculty(e.target.value)} disabled={busy}>
                    {APP.FACULTIES.map(f => <option key={f.code} value={f.code}>{f.code} · {f.name}</option>)}
                  </select>
                </label>
                <div className="au-login-demo-grid">
                  {FACULTY_TEST_ROLES.map(r => {
                    const username = demoFaculty.toLowerCase() + r.key;
                    return <button key={r.key} type="button" disabled={busy} title={username + "@au.edu"} onClick={() => demoLogin(facultyTestEmail(demoFaculty, r.key))}><strong>{username}</strong><span>{r.label}</span></button>;
                  })}
                </div>
                <div className="au-login-demo-section">University-wide</div>
                <div className="au-login-demo-grid au-login-demo-grid-wide">
                  <button type="button" disabled={busy} title="rassc@au.edu" onClick={() => demoLogin(TEST_EMAIL_FOR.iras)}><strong>rassc</strong><span>RASSC / IRAS</span></button>
                  <button type="button" disabled={busy} title="finance@au.edu" onClick={() => demoLogin(TEST_EMAIL_FOR.ofm)}><strong>finance</strong><span>OFM / Finance</span></button>
                  <button type="button" disabled={busy} title="admin@au.edu" onClick={() => demoLogin(TEST_EMAIL_FOR.admin)}><strong>admin</strong><span>Administrator</span></button>
                </div>
              </div>
            </details>
          </div>
        </section>
      </main>
      <LoginHelpDialog topic={helpTopic} onClose={() => setHelpTopic(null)} />
    </div>
  );
}

function LoginHelpDialog({ topic, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (topic && !element.open) element.showModal();
    else if (!topic && element.open) element.close();
  }, [topic]);
  const titles = { access: "Account help", privacy: "Sign-in privacy", help: "Signing in to AU-RGMS" };
  return (
    <dialog ref={dialog} className="au-login-dialog" aria-labelledby="au-login-help-title" onClose={onClose} onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }}>
      <h2 id="au-login-help-title">{titles[topic] || "Login help"}</h2>
      {topic === "access" && <>
        <p>Contact administrator.</p>
      </>}
      {topic === "help" && <>
        <p>Enter your registered email ending in @au.edu and your password. Your account determines which role and workspace you can access.</p>
        <p>Researchers can select AU-R1, AU-R3, or AU-R4 after signing in. Developer Demo Access opens shared test accounts and is separate from your personal account.</p>
        <p>Select Remember me only on your own device. Leave it unchecked on shared computers and sign out when you finish.</p>
      </>}
      {topic === "privacy" && <>
        <p>AU-RGMS uses your signed-in account to load your profile and the applications available to your role.</p>
        <p>Remember me saves a login session in this browser. Without it, the session is kept in the current tab. Signing out clears the saved session from this browser; the checkbox never saves your password.</p>
        <p>For the university's official privacy policy or questions about your research data, contact Research Affairs.</p>
      </>}
      <button className="au-login-submit" type="button" autoFocus onClick={() => dialog.current.close()}>Close</button>
    </dialog>
  );
}


const CHOOSER_INTRO = "Hi, I'm AU AI. Not sure which grant fits you? Ask me what each one is for, how they differ, the amounts, or what documents you'll need — I'll help you pick.";
const CHOOSER_CHIPS = [
  "What's the difference between AU-R1, AU-R3 and AU-R4?",
  "Which grant is for presenting a paper at a conference?",
  "How do I submit an AU-R4 publication fee application?",
  "Can students apply together with me?",
];
function GrantHelperChat({ profile }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: CHOOSER_INTRO }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const ctx = { role: "researcher", name: profile && profile.full_name, faculty: profile && profile.faculty };

  useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs, busy, open]);

  async function ask(text) {
    const q = (text || input).trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user", content: q }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const session = await window.AUTH.session();
      const r = await fetch("/api/ai-chat-response", {
        method: "POST", headers: {
          "Content-Type": "application/json",
          "Authorization": session && session.access_token ? "Bearer " + session.access_token : "",
        },
        body: JSON.stringify({ messages: next, context: ctx }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error("AU AI request failed");
      setMsgs(m => [...m, { role: "assistant", content: data.reply || "Sorry, no response." }]);
    } catch (e) {
      setMsgs(m => [...m, { role: "assistant", content: "Sorry, I couldn't reach AU AI right now." }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="chooser-ai">
      <button type="button" className="chooser-ai-button" onClick={() => setOpen(v => !v)} title="Ask AU AI" aria-label="Ask AU AI" aria-expanded={open} aria-controls={open ? "chooser-ai-dialog" : undefined}>
        <Icon name="Bot" size={20} />
      </button>
      {open && (
        <div className="chooser-ai-panel" id="chooser-ai-dialog" role="dialog" aria-label="Ask AU AI">
          <div className="chooser-ai-head">
            <div className="chooser-ai-mark"><Icon name="Bot" size={18} /></div>
            <div><b>AU AI</b><span>Grant selection assistant</span></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant"><Icon name="X" size={16} /></button>
          </div>
          <div ref={bodyRef} className="chooser-ai-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chooser-ai-message ${m.role}`}>{m.content}</div>
            ))}
            {busy && <div className="chooser-ai-thinking">AU AI is thinking…</div>}
            {msgs.length <= 1 && !busy && (
              <div className="chooser-ai-suggestions">
                {CHOOSER_CHIPS.map((s, i) => <button key={i} type="button" onClick={() => ask(s)}>{s}</button>)}
              </div>
            )}
          </div>
          <form className="chooser-ai-input" onSubmit={e => { e.preventDefault(); ask(); }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the grants…" />
            <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()} aria-label="Send"><Icon name="Send" size={15} /></button>
          </form>
        </div>
      )}
    </div>
  );
}


function GrantSystemChooser({ profile, onPick, onLogout }) {
  const systems = APP.GRANT_SYSTEMS || [];
  const summaries = {
    au_r1: "Research and creative work at AU.",
    au_r3: "Present your paper at a conference.",
    au_r4: "Journal publication fees and rewards.",
  };
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const previous = viewport.getAttribute("content");
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
    return () => viewport.setAttribute("content", previous || "width=1280");
  }, []);
  return (
    <div className="chooser-shell">
      <header className="chooser-header">
        <div className="chooser-brand">
          <AULogo size={38} />
          <div>
            <strong>Assumption University</strong>
            <span>Research Grant Management System</span>
          </div>
        </div>
        <div className="chooser-account">
          <button type="button" className="chooser-signout" onClick={onLogout}><Icon name="LogOut" size={14} /> Sign out</button>
        </div>
      </header>

      <main className="chooser-main" aria-labelledby="grant-chooser-title">
        <div className="chooser-intro">
          <h1 id="grant-chooser-title">Choose your grant</h1>
          <p>Research. Present. Publish.</p>
        </div>

        <div className="grant-choice-grid" aria-label="Available research grants">
          {systems.map(sys => {
            const disabled = !sys.enabled;
            return (
              <section key={sys.id} className={`grant-choice-card${sys.id === "au_r3" ? " grant-choice-card-center" : ""}${disabled ? " is-disabled" : ""}`} aria-labelledby={`grant-title-${sys.id}`}>
                <div className="grant-choice-icon" aria-hidden="true">
                  <Icon name={sys.icon} size={48} />
                </div>
                <p className="grant-choice-code">{sys.code}</p>
                <h2 className="grant-choice-title" id={`grant-title-${sys.id}`}>{sys.name}</h2>
                <p className="grant-choice-desc">{summaries[sys.id] || sys.tagline}</p>
                <button type="button" className="grant-choice-action" disabled={disabled} onClick={() => !disabled && onPick(sys.id)} aria-label={`${disabled ? "Coming soon" : "Continue to"} ${sys.code}`}>
                  {disabled ? "Coming soon" : <>Continue <Icon name="ArrowRight" size={16} /></>}
                </button>
              </section>
            );
          })}
        </div>
      </main>
      <GrantHelperChat profile={profile} />
    </div>
  );
}


const ROLE_CONFIG = {
  researcher: {
    nav: APP.NAV_RESEARCHER,
    homeKey: "r-dashboard",
    crumbRoot: "Researcher",
  },
  dean: {
    nav: APP.NAV_DEAN,
    homeKey: "d-dashboard",
    crumbRoot: "Dean's Office",
  },
  committee: {
    nav: APP.NAV_COMMITTEE,
    homeKey: "c-dashboard",
    crumbRoot: "Faculty Committee",
  },
  iras: {
    nav: APP.NAV_RASSC,
    homeKey: "i-dashboard",
    crumbRoot: "RASSC",
  },
  ofm: {
    nav: APP.NAV_OFM,
    homeKey: "o-dashboard",
    crumbRoot: "OFM / Finance",
  },
  admin: {
    nav: APP.NAV_ADMIN,
    homeKey: "a-dashboard",
    crumbRoot: "Administration",
  },
};


const SYSTEM_ROLE_KEYS = {
  au_r1: ["researcher", "dean", "committee", "iras", "ofm", "admin"],
  au_r3: ["researcher", "dean", "iras", "ofm", "admin"],
  au_r4: ["researcher", "dean", "committee", "iras", "ofm", "admin"],
};
function rolesForSystem(sys) {
  const all = APP.ROLES || [];
  const keys = SYSTEM_ROLE_KEYS[sys];
  const list = keys ? keys.map(k => all.find(r => r.key === k)).filter(Boolean) : all;
  if (sys === "au_r3" || sys === "au_r4") {
    return list.map(r => r.key === "iras"
      ? { ...r, name: "IRAS", full: "IRAS Test", subtitle: "IRAS - Test Account", initials: "IR" }
      : r);
  }
  return list;
}

function AppHeader({ role, profile, onSwitchRole, onLogout, onNavigate, grantSystem, demoMode }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState(APP.NOTIFS || []);
  const current = rolesForSystem(grantSystem).find(r => r.key === role) || APP.ROLES.find(r => r.key === role);
  const isIrasTestHeader = role === "iras" && (grantSystem === "au_r3" || grantSystem === "au_r4") && profile && String(profile.email || "").toLowerCase() === TEST_EMAIL_FOR.iras;
  const displayName = isIrasTestHeader ? "IRAS Test" : ((profile && profile.full_name) || current.full);
  const displaySubtitle = demoMode ? current.subtitle : current.name;
  const displayInitials = displayName
    ? displayName.trim().split(/\s+/).slice(-2).map(s => s[0]).join("").toUpperCase()
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
    const refreshNotifications = () => {
      if (window.DB && window.DB.notifications) {
        window.DB.notifications().then(items => { if (alive) setNotifItems(items || []); }).catch(() => { if (alive) setNotifItems([]); });
      }
    };
    refreshNotifications();
    const timer = window.setInterval(refreshNotifications, 30000);
    return () => { alive = false; window.clearInterval(timer); };
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

      <div className="header-actions" ref={wrapRef}>
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
              <span>{displaySubtitle}</span>
            </div>
            <Icon name="ChevronDown" size={14} />
          </button>
          {roleOpen && (
            <div className="dropdown" onClick={e => e.stopPropagation()} style={{minWidth: 320}}>
              {demoMode && <>
                <div className="dropdown-section">
                  Switch test account{grantSystem ? " · " + (grantSystem === "au_r1" ? "AU-R1" : grantSystem === "au_r3" ? "AU-R3" : "AU-R4") : ""}
                </div>
                {rolesForSystem(grantSystem).map(r => (
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
              </>}
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


function Sidebar({ nav, current, onNavigate }) {
  return (
    <aside className="sidebar">
      {nav.map((item, i) => {
        if (item.section) {
          return <div key={`s${i}`} className="sidebar-section">{item.section}</div>;
        }
        return (
          <div
            key={item.key}
            className={`nav-item ${current === item.key ? "active" : ""}${item.key === "r-ai-assistant" ? " ai-assistant-item" : ""}`}
            onClick={() => {
              if (item.key === "r-ai-assistant") {
                window.dispatchEvent(new CustomEvent("au-ai-toggle"));
                return;
              }
              onNavigate(item.key);
            }}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
            {item.badge && <span className="badge-num">{item.badge}</span>}
          </div>
        );
      })}
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

    case "r-dashboard":     return <ResearcherDashboard navigate={navigate} onDownload={c.onDownload} onView={c.onView} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} />;
    case "r-submit":        return c.grantType === "au_r4"
                              ? <ResearcherSubmitR4 applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />
                              : c.grantType === "au_r3"
                              ? <ResearcherSubmitR3 applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />
                              : <ResearcherSubmit applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} />;
    case "r-applications":  return <ResearcherApplications navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} toast={c.toast} setConfirm={c.setConfirm} onGrantSwitch={c.onGrantSwitch} openDraft={(id) => { c.setSelectedApplicationId(id); navigate("r-submit", { keepSelection: true }); }} openDetail={(id) => { c.setSelectedApplicationId(id); navigate("r-detail"); }} />;
    case "r-detail":        return <ResearcherApplicationDetail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "r-progress":      return <ResearcherProgress applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-final":         return <ResearcherFinal applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} />;
    case "r-payments":      return <ResearcherPayments onDownload={c.onDownload} toast={c.toast} grantType={c.grantType} />;
    case "r-publications":  return <ResearcherPublicationGrants toast={c.toast} />;


    case "d-dashboard":      return <DeanDashboard navigate={navigate} />;
    case "d-screen":         return <DeanScreenQueue navigate={navigate} onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-screen-detail":  return <FacultyChecklist applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-r3-screen":      return <DeanR3Queue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-r3-detail":      return <DeanR3Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-r4-screen":      return <DeanR4Queue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-r4-detail":      return <DeanR4Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-history":        return <DeanHistory navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-history-detail": return <DeanDecisionTimeline applicationId={c.selectedApplicationId} navigate={navigate} />;


    case "c-dashboard":      return <CommitteeDashboard navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "c-queue":          return <CommitteeQueue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "c-review":         return <FacultyAcademic applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "c-history":        return <CommitteeHistory onDownload={c.onDownload} />;


    case "i-dashboard":      return <RASSCDashboardV2 navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "i-r3-verify":      return <IRASr3Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-r4-verify":      return <IRASr4Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-received":       return <RASSCReceived navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "i-screen":         return <RASSCScreen applicationId={c.selectedApplicationId} setSelectedApplicationId={c.setSelectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-reports":        return <RASSCReports onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "i-publications":   return <RASSCPublicationGrants toast={c.toast} />;


    case "o-dashboard":      return <OFMDashboard navigate={navigate} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-payments":       return <RASSCPayment onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-detail":         return <OFMDetail onDownload={c.onDownload} toast={c.toast} setConfirm={c.setConfirm} />;
    case "o-publications":   return <OFMPublicationPayments toast={c.toast} />;
    case "o-history":        return <OFMHistory onDownload={c.onDownload} />;


    case "a-dashboard":      return <AdminDashboard navigate={navigate} />;
    case "a-users":          return <AdminUsers toast={c.toast} setConfirm={c.setConfirm} profile={c.profile} />;
    case "a-analytics":      return c.profile && c.profile.role === "admin"
      ? <AnalyticsDashboard role="admin" />
      : <Empty title="Administrator access required" desc="AI Analytics is available only to administrators." icon="Lock" />;
    case "a-audit":          return <AdminAudit />;


    case "forms":            return <FormsLibrary />;
    case "account":          return <AccountSettings toast={c.toast} />;

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
      skipLogin: params.get("skipLogin") === "1",
    };
  } catch (e) { return {}; }
}


function App() {
  const initial = readHash();
  const startingRole = initial.role && ROLE_CONFIG[initial.role] ? initial.role : "researcher";
  const startingPage = initial.page || ROLE_CONFIG[startingRole].homeKey;

  const [loggedIn, setLoggedIn] = useState(!!initial.skipLogin);
  const [role, setRole] = useState(startingRole);
  const [page, setPage] = useState(startingPage);
  const [profile, setProfile] = useState(null);
  const [demoMode, setDemoMode] = useState(() => !!initial.skipLogin || readDemoMode());
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [rSystem, setRSystem] = useState(() => { try { return localStorage.getItem("au-rgms-r-system") || null; } catch (e) { return null; } });
  const chooseSystem = (sys, nextPage) => { try { localStorage.setItem("au-rgms-r-system", sys); } catch (e) {} setSelectedApplicationId(null); setRSystem(sys); setPage(nextPage || "r-dashboard"); };
  const switchSystem = () => { try { localStorage.removeItem("au-rgms-r-system"); } catch (e) {} setRSystem(null); };
  const navigate = (key, opts) => {
    if (key === "r-switch-system") { switchSystem(); return; }
    if (key === "r-submit" && !(opts && opts.keepSelection)) setSelectedApplicationId(null);
    setPage(key);
  };

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
      writeDemoMode(true, !!(window.AUTH && window.AUTH.remembersSession()));
      setDemoMode(true);
      if (!opts.keepPage) setPage(ROLE_CONFIG[r].homeKey);
      return prof;
    } catch (ex) {
      toast("Could not switch test account: " + ((ex && ex.message) || "sign-in failed."));
      return null;
    }
  };

  const onLogin = (prof, opts = {}) => {
    const r = prof && ROLE_CONFIG[prof.role] ? prof.role : "researcher";
    const nextDemoMode = opts.isDemo === true;
    const persistDemo = opts.persistDemo === true || (nextDemoMode && !!(window.AUTH && window.AUTH.remembersSession()));
    writeDemoMode(nextDemoMode, persistDemo);
    setDemoMode(nextDemoMode);
    setProfile(prof || null);
    setRole(r);
    setPage(ROLE_CONFIG[r].homeKey);
    setLoggedIn(true);
  };

  const onSwitchRole = (newRole, email) => {
    if (!demoMode) return;
    if (!ROLE_CONFIG[newRole]) return;
    const faculty = profile && (APP.FACULTIES || []).find(f => f.name === profile.faculty);
    const facultyEmail = faculty && FACULTY_TEST_ROLES.some(r => r.key === newRole)
      ? facultyTestEmail(faculty.code, newRole)
      : null;
    switchToTestRole(newRole, { email: email || facultyEmail || TEST_EMAIL_FOR[newRole] });
  };

  const onLogout = async () => {
    try { await window.AUTH.signOut(); } catch (e) {}
    switchSystem();
    writeDemoMode(false);
    setDemoMode(false);
    setProfile(null); setLoggedIn(false);
  };

  useEffect(() => {
    (async () => {
      try {
        if (isPasswordRecoveryRoute()) return;
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
        else onLogin(prof, { isDemo: readDemoMode() });
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    const supportedSystem = ["au_r1", "au_r3", "au_r4"].includes(rSystem);
    const researcherAI = !!(loggedIn && profile && profile.role === "researcher" && role === "researcher" && supportedSystem);
    const adminAnalyticsAI = !!(loggedIn && profile && profile.role === "admin" && role === "admin" && page === "a-analytics");
    const visible = researcherAI || adminAnalyticsAI;
    window.AU_AI_VISIBLE = visible;
    window.AU_AI_GRANT_SYSTEM = researcherAI ? rSystem : null;
    window.AU_AI_MODE = adminAnalyticsAI ? "analytics" : (researcherAI ? "researcher" : null);
    window.dispatchEvent(new CustomEvent("au-ai-visibility", {
      detail: { visible, grantSystem: researcherAI ? rSystem : null, mode: adminAnalyticsAI ? "analytics" : (researcherAI ? "researcher" : null) },
    }));
  }, [loggedIn, profile, role, page, rSystem]);

  const cfg = ROLE_CONFIG[role];
  const researcherTrimmed = role === "researcher" && (rSystem === "au_r3" || rSystem === "au_r4");
  const navForRole = researcherTrimmed ? (APP.NAV_RESEARCHER_R3 || cfg.nav) : cfg.nav;

  const pageLabel = useMemo(() => {
    const navItem = navForRole.find(n => n.key === page);
    if (navItem) return navItem.label;
    const special = {
      "r-detail": "Application Detail",
      "r-progress": "Project Progress Report",
      "r-final": "Project Final Report",
      "d-screen-detail": "Screening · Detail",
      "d-sign-detail": "Sign &amp; Forward · Detail",
      "d-r3-detail": "AU-R3 Screening · Detail",
      "d-r4-detail": "AU-R4 Screening · Detail",
      "d-history-detail": "Decision Timeline",
      "i-r3-verify": "AU-R3 Verification",
      "i-r4-verify": "AU-R4 Verification",
      "forms": "Forms & Templates",
    };
    return special[page] || "Dashboard";
  }, [navForRole, page]);

  const crumbs = useMemo(() => [cfg.crumbRoot, pageLabel], [cfg.crumbRoot, pageLabel]);

  if (!loggedIn) {
    return <LoginPage onLogin={onLogin} />;
  }

  if (role === "researcher" && !rSystem) {
    return <GrantSystemChooser profile={profile} onPick={chooseSystem} onLogout={onLogout} />;
  }

  return (
    <div className="app">
      <AppHeader role={role} profile={profile} onSwitchRole={onSwitchRole} onLogout={onLogout} onNavigate={setPage} grantSystem={rSystem} demoMode={demoMode} />
      <SubBar
        crumbs={crumbs}
        onHome={() => setPage(cfg.homeKey)}
        onCrumb={() => setPage(cfg.homeKey)}
      />
      <Sidebar
        nav={navForRole}
        current={page === "d-history-detail" ? "d-history" : page}
        onNavigate={navigate}
      />
      <main className="main">
        <PageRouter
          pageKey={page}
          navigate={navigate}
          ctx={{ onDownload, onView, toast, setConfirm, profile, selectedApplicationId, setSelectedApplicationId, grantType: role === "researcher" ? rSystem : null, onGrantSwitch: chooseSystem }}
        />
      </main>
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
          finalConfirm={confirm.finalConfirm}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
