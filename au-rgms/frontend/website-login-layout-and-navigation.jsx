




const APP = window.AU;
const TEST_PASSWORD = "123456789";
const FACULTY_TEST_ROLES = [
  { key: "researcher", label: "Researcher" },
  { key: "dean", label: "Dean" },
];
function facultyTestEmail(code, role) {
  return String(code || "VMES").toLowerCase() + role + "@au.edu";
}
const TEST_EMAIL_FOR = {
  iras: "iras@au.edu",
  ofm: "finance@au.edu",
  admin: "admin@au.edu",
};
function demoRoleForEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const centralRole = Object.keys(TEST_EMAIL_FOR).find(role => TEST_EMAIL_FOR[role] === normalized);
  if (centralRole) return centralRole;
  for (const faculty of (APP.FACULTIES || [])) {
    for (const role of FACULTY_TEST_ROLES) {
      if (facultyTestEmail(faculty.code, role.key) === normalized) return role.key;
    }
  }
  return null;
}
function isPasswordRecoveryRoute() {
  return new URLSearchParams(window.location.search).get("reset-password") === "1" || /(?:^|[&#])type=recovery(?:&|$)/.test(window.location.hash || "");
}
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
      if (prof.is_active === false || !["researcher", "dean", "iras", "ofm", "admin"].includes(prof.role)) {
        try { await window.AUTH.signOut(); } catch (e) {}
        throw new Error("This account belongs to an inactive role and no longer has portal access.");
      }
      window.AUTH.setDemoLogin(prof, em, isDemo);
      onLogin(prof);
    } catch (ex) {
      const message = String((ex && ex.message) || "");
      setErr(/invalid login credentials/i.test(message)
        ? "Incorrect password."
        : (message || "Sign-in failed. Please try again."));
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
    signInWith(auEmail, pass, false);
  }
  function demoLogin(testEmail) { signInWith(testEmail, TEST_PASSWORD, true); }
  async function requestPasswordReset() {
    const auEmail = email.trim().toLowerCase();
    setErr(""); setResetSent("");
    if (!/^[^@\s]+@au\.edu$/i.test(auEmail)) return setErr("Enter the AU email address registered for your account.");
    setBusy(true);
    try {
      await window.AUTH.requestPasswordReset(auEmail);
      setResetSent("If an AU-RGMS account exists for " + auEmail + ", a password-reset email has been sent. Open its link to choose a new password.");
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
          <svg className="au-login-surface" viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0H540C545 105 651 157 672 272C705 431 553 493 550 616C548 678 580 730 612 760H0Z" />
          </svg>
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
                <p>Select a test account. Every demo account uses password <strong>{TEST_PASSWORD}</strong>.</p>
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
                  <button type="button" disabled={busy} title="iras@au.edu" onClick={() => demoLogin(TEST_EMAIL_FOR.iras)}><strong>iras</strong><span>AU-R3 / AU-R4 Office</span></button>
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
        <p>Researchers can select AU-R3 or AU-R4 after signing in. Staff workspaces are selected automatically from the authenticated account role.</p>
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


const CHOOSER_INTRO = "Hi, I'm AU AI. Not sure whether AU-R3 or AU-R4 fits you? Ask me about the purpose, amount, or required documents and I'll help you pick.";
const CHOOSER_CHIPS = [
  "What's the difference between AU-R3 and AU-R4?",
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
  const systems = (APP.GRANT_SYSTEMS || []).filter(sys => ["au_r3", "au_r4"].includes(sys.id));
  const summaries = {
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
              <section key={sys.id} className={`grant-choice-card${disabled ? " is-disabled" : ""}`} aria-labelledby={`grant-title-${sys.id}`}>
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
  iras: {
    nav: APP.NAV_IRAS,
    homeKey: "i-dashboard",
    crumbRoot: "IRAS",
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
  au_r3: ["researcher", "dean", "iras", "ofm", "admin"],
  au_r4: ["researcher", "dean", "iras", "ofm", "admin"],
};
function rolesForSystem(sys) {
  const all = APP.ROLES || [];
  const keys = SYSTEM_ROLE_KEYS[sys];
  const list = keys ? keys.map(k => all.find(r => r.key === k)).filter(Boolean) : all;
  return list;
}

function AppHeader({ role, profile, onLogout, onNavigate, onDemoSwitch, grantSystem }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState(APP.NOTIFS || []);
  const [demoVerified, setDemoVerified] = useState(false);
  const [demoSwitchBusy, setDemoSwitchBusy] = useState(false);
  const [demoSwitchError, setDemoSwitchError] = useState("");
  const [demoFaculty, setDemoFaculty] = useState(() => (APP.FACULTIES || []).find(f => f.name === (profile && profile.faculty))?.code || sessionStorage.getItem("au-rgms-demo-faculty") || "VMES");
  const current = rolesForSystem(grantSystem).find(r => r.key === role) || APP.ROLES.find(r => r.key === role);
  const displayName = (profile && profile.full_name) || current.full;
  const displaySubtitle = current.name;
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

  useEffect(() => {
    let alive = true;
    setDemoVerified(false);
    const facultyCode = (APP.FACULTIES || []).find(f => f.name === (profile && profile.faculty))?.code;
    if (facultyCode) {
      setDemoFaculty(facultyCode);
      sessionStorage.setItem("au-rgms-demo-faculty", facultyCode);
    }
    if (window.sb && window.sb.auth && profile && profile.id) {
      window.sb.auth.getUser().then(result => {
        const user = result && result.data && result.data.user;
        if (alive) setDemoVerified(!!(user && demoRoleForEmail(user.email) === role && window.AUTH.isDemoLogin(profile, user)));
      }).catch(() => { if (alive) setDemoVerified(false); });
    }
    return () => { alive = false; };
  }, [role, profile]);

  async function selectDemoAccount(email) {
    if (demoSwitchBusy || !demoVerified || !onDemoSwitch) return;
    setDemoSwitchBusy(true);
    setDemoSwitchError("");
    try {
      await onDemoSwitch(email);
    } catch (error) {
      setDemoSwitchError((error && error.message) || "Could not switch demo account.");
      setDemoSwitchBusy(false);
    }
  }

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
              {demoVerified && <>
                <div className="dropdown-section">Switch test account · {grantSystem === "au_r4" ? "AU-R4" : "AU-R3"}</div>
                {rolesForSystem(grantSystem).map(item => (
                  <button
                    key={item.key}
                    type="button"
                    className={`dropdown-item demo-switch-item ${role === item.key ? "active" : ""}`}
                    disabled={demoSwitchBusy}
                    onClick={() => {
                      if (role === item.key) return;
                      const email = FACULTY_TEST_ROLES.some(facultyRole => facultyRole.key === item.key)
                        ? facultyTestEmail(demoFaculty, item.key)
                        : TEST_EMAIL_FOR[item.key];
                      selectDemoAccount(email);
                    }}
                  >
                    <div className="role-icon"><Icon name={item.iconName} size={14} /></div>
                    <div className="meta"><div className="t">{item.name}</div><div className="s">{item.subtitle}</div></div>
                    {role === item.key && <Icon name="Check" size={14} />}
                  </button>
                ))}
                {demoSwitchError && <div className="demo-switch-error" role="alert">{demoSwitchError}</div>}
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
        const isDisabled = !!item.disabled;
        const isCurrent = current === item.key || (item.activeFor || []).includes(current);
        return (
          <div
            key={item.key}
            className={`nav-item ${isCurrent ? "active" : ""}${item.key === "r-ai-assistant" || item.key === "a-analytics" || /-ai$/.test(item.key) ? " ai-assistant-item" : ""}`}
            aria-disabled={isDisabled || undefined}
            title={isDisabled ? item.hint : undefined}
            style={isDisabled ? { cursor: "not-allowed", opacity: 0.58 } : undefined}
            onClick={() => {
              if (isDisabled) return;
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
                              : <Empty title="Choose AU-R3 or AU-R4" desc="Return to the grant selector and choose an active grant." icon="Folder" />;
    case "r-applications":  return <ResearcherApplications navigate={navigate} onDownload={c.onDownload} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} toast={c.toast} setConfirm={c.setConfirm} onGrantSwitch={c.onGrantSwitch} openDraft={(id) => { c.setSelectedApplicationId(id); navigate("r-submit", { keepSelection: true }); }} openDetail={(id) => { c.setSelectedApplicationId(id); navigate("r-detail"); }} />;
    case "r-detail":        return <ResearcherApplicationDetail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-dashboard":      return <DeanDashboard navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-analytics":      return c.profile && c.profile.role === "dean" ? <RoleAnalyticsDashboard role="dean" /> : <Empty title="Dean access required" desc="Dean Analytics is restricted to the signed-in Dean's faculty." icon="Lock" />;
    case "d-ai":             return c.profile && c.profile.role === "dean" ? <RoleAIChatbotPage role="dean" /> : <Empty title="Dean access required" desc="This AI workspace is restricted to Dean accounts." icon="Lock" />;
    case "d-r3-screen":      return <DeanR3Queue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-r3-detail":      return <DeanR3Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-r4-screen":      return <DeanR4Queue navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-r4-detail":      return <DeanR4Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} />;
    case "d-history":        return <DeanHistory navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} />;
    case "d-history-detail": return <DeanDecisionTimeline applicationId={c.selectedApplicationId} navigate={navigate} />;
    case "i-dashboard":      return <IRASDashboard navigate={navigate} setSelectedApplicationId={c.setSelectedApplicationId} grantType={c.grantType} onGrantSwitch={c.onGrantSwitch} />;
    case "i-analytics":      return c.profile && c.profile.role === "iras" ? <RoleAnalyticsDashboard role="iras" /> : <Empty title="IRAS access required" desc="IRAS Analytics is restricted to IRAS accounts." icon="Lock" />;
    case "i-ai":             return c.profile && c.profile.role === "iras" ? <RoleAIChatbotPage role="iras" /> : <Empty title="IRAS access required" desc="This AI workspace is restricted to IRAS accounts." icon="Lock" />;
    case "i-r3-verify":      return c.role === "iras" ? <IRASr3Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} /> : <Empty title="IRAS access required" desc="AU-R3 verification is available only to IRAS." icon="Lock" />;
    case "i-r4-verify":      return c.role === "iras" ? <IRASr4Detail applicationId={c.selectedApplicationId} navigate={navigate} onDownload={c.onDownload} onView={c.onView} toast={c.toast} setConfirm={c.setConfirm} /> : <Empty title="IRAS access required" desc="AU-R4 verification is available only to IRAS." icon="Lock" />;
    case "o-dashboard":      return <OFMDashboard navigate={navigate} toast={c.toast} setConfirm={c.setConfirm} grantType={c.grantType} onGrantSwitch={c.onGrantSwitch} onDownload={c.onDownload} onView={c.onView} />;
    case "o-summary":        return <OFMTotalSummary onDownload={c.onDownload} onView={c.onView} />;
    case "o-analytics":      return c.profile && c.profile.role === "ofm" ? <RoleAnalyticsDashboard role="ofm" /> : <Empty title="Finance access required" desc="Finance Analytics is restricted to Finance accounts." icon="Lock" />;
    case "o-ai":             return c.profile && c.profile.role === "ofm" ? <RoleAIChatbotPage role="ofm" /> : <Empty title="Finance access required" desc="This AI workspace is restricted to Finance accounts." icon="Lock" />;
    case "o-history":        return <OFMHistory grantType={c.grantType} onGrantSwitch={c.onGrantSwitch} />;


    case "a-dashboard":      return <AdminDashboard navigate={navigate} />;
    case "a-users":          return <AdminUsers toast={c.toast} setConfirm={c.setConfirm} profile={c.profile} />;
    case "a-analytics":      return c.profile && c.profile.role === "admin"
      ? <AnalyticsDashboard role="admin" />
      : <Empty title="Administrator access required" desc="AI Analytics is available only to administrators." icon="Lock" />;
    case "a-audit":          return <AdminAudit />;


    case "forms":            return c.role === "researcher"
      ? <FormsLibrary />
      : <Empty title="Researcher access required" desc="Official grant forms are available from the researcher workspace." icon="Lock" />;
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
    };
  } catch (e) { return {}; }
}

const ACTIVE_GRANT_TYPES = ["au_r3", "au_r4"];
const RETIRED_PAGES = [
  "r-publications", "i-publications", "o-publications",
  "r-progress", "r-final", "r-payments",
  "d-screen", "d-screen-detail", "d-sign", "d-sign-detail",
  "c-dashboard", "c-queue", "c-review", "c-history",
  "i-received", "i-screen", "i-reports",
  "o-payments", "o-detail",
];

const LAST_PAGE_KEY_PREFIX = "au-rgms-last-page-";

function pageBelongsToRole(role, page) {
  if (!page || RETIRED_PAGES.includes(page)) return false;
  const prefix = { researcher: "r-", dean: "d-", iras: "i-", ofm: "o-", admin: "a-" }[role];
  return !!(prefix && page.startsWith(prefix)) || page === "account" || (role === "researcher" && page === "forms");
}

function readLastPage(role) {
  try {
    const saved = sessionStorage.getItem(LAST_PAGE_KEY_PREFIX + role)
      || localStorage.getItem(LAST_PAGE_KEY_PREFIX + role);
    return pageBelongsToRole(role, saved) ? saved : null;
  } catch (e) { return null; }
}

function rememberLastPage(role, page) {
  if (!pageBelongsToRole(role, page)) return;
  try {
    sessionStorage.setItem(LAST_PAGE_KEY_PREFIX + role, page);
    localStorage.setItem(LAST_PAGE_KEY_PREFIX + role, page);
  } catch (e) {}
}

function writePageRoute(role, page) {
  if (!pageBelongsToRole(role, page)) return;
  try {
    const params = new URLSearchParams();
    params.set("role", role);
    params.set("page", page);
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + params.toString());
  } catch (e) {}
}


function App() {
  const initial = readHash();
  const startingRole = initial.role && ROLE_CONFIG[initial.role] ? initial.role : "researcher";
  const startingPage = initial.page && !RETIRED_PAGES.includes(initial.page)
    ? initial.page
    : (readLastPage(startingRole) || ROLE_CONFIG[startingRole].homeKey);

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(startingRole);
  const [page, setPage] = useState(startingPage);
  const [profile, setProfile] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const hiddenPageRef = useRef(null);
  const [rSystem, setRSystem] = useState(() => { try { const stored = localStorage.getItem("au-rgms-r-system"); return ACTIVE_GRANT_TYPES.includes(stored) ? stored : null; } catch (e) { return null; } });
  const chooseSystem = (sys, nextPage) => {
    if (!ACTIVE_GRANT_TYPES.includes(sys)) return;
    try { localStorage.setItem("au-rgms-r-system", sys); } catch (e) {}
    const targetPage = nextPage || "r-dashboard";
    rememberLastPage("researcher", targetPage);
    writePageRoute("researcher", targetPage);
    setSelectedApplicationId(null); setRSystem(sys); setPage(targetPage);
  };
  const switchSystem = () => { try { localStorage.removeItem("au-rgms-r-system"); } catch (e) {} setRSystem(null); };
  const navigate = (key, opts) => {
    if (key === "r-switch-system") { switchSystem(); return; }
    if (RETIRED_PAGES.includes(key)) {
      const homePage = ROLE_CONFIG[role].homeKey;
      rememberLastPage(role, homePage);
      writePageRoute(role, homePage);
      setPage(homePage);
      return;
    }
    if (key === "r-submit" && !(opts && opts.keepSelection)) setSelectedApplicationId(null);
    rememberLastPage(role, key);
    writePageRoute(role, key);
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

  const onLogin = (prof) => {
    if (!prof || prof.is_active === false || !ROLE_CONFIG[prof.role]) {
      window.AUTH.signOut().catch(() => {});
      setProfile(null); setLoggedIn(false);
      return;
    }
    const r = prof.role;
    setProfile(prof || null);
    setRole(r);
    setPage(readLastPage(r) || ROLE_CONFIG[r].homeKey);
    setLoggedIn(true);
  };

  const onLogout = async () => {
    try { await window.AUTH.signOut(); } catch (e) {}
    switchSystem();
    setProfile(null); setLoggedIn(false);
  };

  const onDemoSwitch = async (email) => {
    const targetRole = demoRoleForEmail(email);
    if (!targetRole) throw new Error("Choose a listed demo account.");
    const identity = await window.AUTH.identity();
    if (!identity || !profile || !window.AUTH.isDemoLogin(profile, identity.user) || demoRoleForEmail(identity.user.email) !== profile.role) {
      throw new Error("Demo switching is available only to signed-in demo accounts.");
    }
    const nextProfile = await window.AUTH.signIn(email, TEST_PASSWORD, window.AUTH.remembersSession());
    if (!nextProfile || nextProfile.is_active === false || nextProfile.role !== targetRole) {
      await window.AUTH.signOut();
      throw new Error("The selected test account is unavailable.");
    }
    window.AUTH.setDemoLogin(nextProfile, email, true);
    try { localStorage.removeItem("au-rgms-r-system"); } catch (e) {}
    const nextPage = ROLE_CONFIG[targetRole].homeKey;
    rememberLastPage(targetRole, nextPage);
    writePageRoute(targetRole, nextPage);
    window.location.reload();
  };

  useEffect(() => {
    (async () => {
      try {
        if (isPasswordRecoveryRoute()) return;
        const sess = await window.AUTH.session();
        if (!sess) return;
        const prof = await window.AUTH.profile();
        if (!prof) return;
        if (prof.is_active === false || !ROLE_CONFIG[prof.role]) {
          await window.AUTH.signOut();
          setProfile(null); setLoggedIn(false);
          return;
        }
        onLogin(prof);
      } catch (e) {}
    })();
  }, []);

  // Keep the visible workspace aligned with Supabase if a login is changed in
  // another tab or the saved session is cleared.  This prevents an old Dean
  // screen from remaining visible with a different account's permissions.
  useEffect(() => {
    if (!window.sb || !window.sb.auth) return;
    const listener = window.sb.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setLoggedIn(false);
        return;
      }
      if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
        window.setTimeout(() => {
          window.AUTH.profile().then(prof => {
            if (!prof) { setProfile(null); setLoggedIn(false); return; }
            if (prof.is_active === false || !ROLE_CONFIG[prof.role]) {
              window.AUTH.signOut().catch(() => {});
              setProfile(null); setLoggedIn(false);
              return;
            }
            setProfile(prof);
            if (ROLE_CONFIG[prof.role]) setRole(prof.role);
            if (event === "SIGNED_IN" && ROLE_CONFIG[prof.role]) {
              setPage(currentPage => pageBelongsToRole(prof.role, currentPage)
                ? currentPage
                : (readLastPage(prof.role) || ROLE_CONFIG[prof.role].homeKey));
            }
            setLoggedIn(true);
          }).catch(() => { setProfile(null); setLoggedIn(false); });
        }, 0);
      }
    });
    return () => {
      if (listener && listener.data && listener.data.subscription) listener.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loggedIn && profile && profile.role === role && document.visibilityState !== "hidden") {
      rememberLastPage(role, page);
      writePageRoute(role, page);
    }
  }, [loggedIn, profile, role, page]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!loggedIn || !profile || profile.role !== role) return;
      if (document.visibilityState === "hidden") {
        hiddenPageRef.current = pageBelongsToRole(role, page) ? page : null;
        if (hiddenPageRef.current) rememberLastPage(role, hiddenPageRef.current);
        return;
      }
      const targetPage = hiddenPageRef.current || readLastPage(role);
      hiddenPageRef.current = null;
      if (targetPage && pageBelongsToRole(role, targetPage)) {
        rememberLastPage(role, targetPage);
        writePageRoute(role, targetPage);
        setPage(targetPage);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [loggedIn, profile, role, page]);

  useEffect(() => {
    const supportedSystem = ACTIVE_GRANT_TYPES.includes(rSystem);
    const researcherAI = !!(loggedIn && profile && profile.role === "researcher" && role === "researcher" && supportedSystem);
    const adminAnalyticsAI = !!(loggedIn && profile && profile.role === "admin" && role === "admin" && page === "a-analytics");
    const roleAI = !!(loggedIn && profile && profile.role === role && ["dean", "iras", "ofm"].includes(role) && page === ({ dean: "d-ai", iras: "i-ai", ofm: "o-ai" }[role]));
    const visible = researcherAI || adminAnalyticsAI || roleAI;
    window.AU_AI_VISIBLE = visible;
    window.AU_AI_GRANT_SYSTEM = researcherAI ? rSystem : null;
    window.AU_AI_MODE = adminAnalyticsAI ? "analytics" : (roleAI ? "role" : (researcherAI ? "researcher" : null));
    window.AU_AI_ROLE = visible && profile ? profile.role : null;
    window.dispatchEvent(new CustomEvent("au-ai-visibility", {
      detail: {
        visible,
        grantSystem: researcherAI ? rSystem : null,
        mode: adminAnalyticsAI ? "analytics" : (roleAI ? "role" : (researcherAI ? "researcher" : null)),
        role: visible && profile ? profile.role : null,
      },
    }));
  }, [loggedIn, profile, role, page, rSystem]);

  const effectiveGrantSystem = ["iras", "ofm"].includes(role)
    ? (ACTIVE_GRANT_TYPES.includes(rSystem) ? rSystem : "au_r3")
    : rSystem;
  const cfg = ROLE_CONFIG[role];
  const navForRole = role === "researcher" ? (APP.NAV_RESEARCHER_R3 || cfg.nav) : cfg.nav;

  const pageLabel = useMemo(() => {
    const navItem = navForRole.find(n => n.key === page);
    if (navItem) return navItem.label;
    const special = {
      "r-detail": "Application Detail",
      "r-progress": "Project Progress Report",
      "r-final": "Project Final Report",
      "d-screen-detail": "Dean Review · Detail",
      "d-sign-detail": "Sign &amp; Forward · Detail",
      "d-r3-detail": "AU-R3 · Dean Review",
      "d-r4-detail": "AU-R4 · Dean Review",
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
      <AppHeader role={role} profile={profile} onLogout={onLogout} onNavigate={setPage} onDemoSwitch={onDemoSwitch} grantSystem={effectiveGrantSystem} />
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
          ctx={{ role, onDownload, onView, toast, setConfirm, profile, selectedApplicationId, setSelectedApplicationId, grantType: ["researcher", "ofm", "iras"].includes(role) ? effectiveGrantSystem : null, onGrantSwitch: chooseSystem }}
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
