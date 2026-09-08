

const { useState, useRef, useEffect } = React;

const ROLE_INTRO = {
  researcher: "Hi, I'm AU AI. Ask me about your applications, forms, documents, co-authors, reviews, reports, or payments.",
  admin: "Hi, I'm AU AI for Admin Analytics. Ask me to summarize or compare live applications, faculties, budgets, users, workflows, and payments.",
  _default: "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about the workflow, AU-R1 documents, payment stages (30/40/30), or publication rewards.",
};
const ROLE_SUGGEST = {
  researcher: ["What should I do next?", "Which documents do I still need?", "Explain my payment status"],
  admin: ["Give me a management summary", "Which faculty has the most applications?", "What needs attention now?"],
  _default: ["What are the 14 workflow stages?", "What documents do I need to apply?", "Reward for a Scopus Q1 paper?"],
};
const ROLE_LABEL = {
  researcher: "Researcher assistant",
  admin: "Admin analytics assistant",
};

async function buildAIContext(grantSystem, mode) {
  let prof = null;
  try { prof = await window.AUTH.profile(); } catch (e) {}
  const role = prof ? prof.role : null;
  const ctx = { role: role, name: prof ? prof.full_name : null, faculty: prof ? prof.faculty : null, grantSystem: grantSystem || null };
  try {
    if (role === "researcher") {
      const apps = await window.DB.myApplications(grantSystem || undefined);
      const details = await Promise.all((apps || []).slice(0, 20).map(async a => {
        try { return await window.DB.applicationDetail(a.id); }
        catch (e) { return a; }
      }));
      ctx.myApplications = details.map(a => ({
        code: a.code,
        title: a.title,
        grantSystem: (a.grant_type || "au_r1").replace("au_r", "AU-R").toUpperCase(),
        status: a.status,
        statusLabel: window.DB.statusBadge(a.status).label,
        ownership: a.is_owner === false ? "co-author" : "owner",
        invitationStatus: a.collaboration ? a.collaboration.status : null,
        faculty: a.faculty,
        department: a.department,
        requestedAmount: Number(a.requested_amount || 0),
        approvedAmount: a.approved_amount == null ? null : Number(a.approved_amount),
        submittedAt: a.submitted_at || null,
        updatedAt: a.updated_at || null,
        documents: (a.documents || []).map(d => ({ name: d.name, type: d.doc_type || null })),
        coAuthors: (a.collaborators || []).map(member => ({ name: member.full_name, email: member.email, role: member.author_role, status: member.status })),
        reviews: (a.reviews || []).map(review => ({ type: review.kind, recommendation: review.recommendation, comments: review.comments, submittedAt: review.submitted_at })),
        recentEvents: (a.events || []).slice(-12).map(event => ({ action: event.action, note: event.note, date: event.created_at })),
        payments: (a.payments || []).map(payment => ({ phase: payment.instalment, percent: payment.pct, amount: Number(payment.amount || 0), status: payment.status, paidAt: payment.paid_at })),
        reports: (a.reports || []).map(report => ({ type: report.kind, status: report.status, submittedAt: report.submitted_at })),
      }));
      try {
        const pgs = await window.DB.myPublicationGrants();
        ctx.myPublicationGrants = (pgs || []).map(g => ({ code: g.id, title: g.title, status: g.status.label, statusKey: g.statusKey, amount: g.budgetTotal, indexing: g.indexing, quartile: g.quartile }));
      } catch (e) {}
      try {
        const g = await window.DB.myGrant(grantSystem || "au_r1");
        if (g) ctx.myGrant = { code: g.code, approvedAmount: g.approved_amount, requestedAmount: g.requested_amount, status: g.status, payments: (g.payments || []).map(p => ({ phase: p.instalment, percent: p.pct, amount: p.amount, status: p.status, paidAt: p.paid_at })), reports: g.reports || [] };
      } catch (e) {}
      try {
        const reimbursements = await window.DB.myReimbursements();
        ctx.myReimbursements = (reimbursements || []).map(item => ({ code: item.id, title: item.title, category: item.category, status: item.status.label, requestedAmount: item.requested_amount, approvedAmount: item.approved_amount }));
      } catch (e) {}
    } else if (role === "admin" && mode === "analytics") {
      ctx.analytics = await window.DB.adminAnalyticsSnapshot();
    }
  } catch (e) {}
  return ctx;
}

function AIChat() {
  const [available, setAvailable] = useState(!!window.AU_AI_VISIBLE);
  const [grantSystem, setGrantSystem] = useState(window.AU_AI_GRANT_SYSTEM || null);
  const [mode, setMode] = useState(window.AU_AI_MODE || null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [role, setRole] = useState(null);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: ROLE_INTRO._default }]);
  const bodyRef = useRef(null);

  useEffect(() => {
    const onVisibility = event => {
      const next = !!(event.detail && event.detail.visible);
      setAvailable(next);
      setGrantSystem(next && event.detail ? event.detail.grantSystem : null);
      setMode(next && event.detail ? event.detail.mode : null);
      if (!next) setOpen(false);
    };
    window.addEventListener("au-ai-visibility", onVisibility);
    return () => window.removeEventListener("au-ai-visibility", onVisibility);
  }, []);

  useEffect(() => {
    const onToggle = () => {
      if (available) setOpen(v => !v);
    };
    window.addEventListener("au-ai-toggle", onToggle);
    return () => window.removeEventListener("au-ai-toggle", onToggle);
  }, [available]);

  useEffect(() => {
    if (!available) return;
    let alive = true;
    buildAIContext(grantSystem, mode).then(c => {
      if (!alive) return;
      setCtx(c);
      setRole(c.role);
      setMsgs([{ role: "assistant", content: ROLE_INTRO[c.role] || ROLE_INTRO._default }]);
    });
    return () => { alive = false; };
  }, [available, grantSystem, mode]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);

  async function send(e) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const session = await window.AUTH.session();
      const r = await fetch("/api/ai-chat-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": session && session.access_token ? "Bearer " + session.access_token : "",
        },
        body: JSON.stringify({ messages: next, context: ctx }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error("AU AI request failed");
      setMsgs((m) => [...m, { role: "assistant", content: data.reply || "Sorry, no response." }]);
    } catch (err) {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach AU AI right now." }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = ROLE_SUGGEST[role] || ROLE_SUGGEST._default;

  if (!available) return null;

  return (
    <>
      <button type="button" className="ai-launcher" onClick={() => setOpen(v => !v)} title="Ask AU AI" aria-label="Ask AU AI" aria-expanded={open} aria-controls={open ? "researcher-ai-dialog" : undefined}>
        <Icon name="Bot" size={20} />
      </button>
      {open && (
        <div className="ai-panel" id="researcher-ai-dialog" role="dialog" aria-label="AU AI assistant">
          <div className="ai-head">
            <div className="ai-bot-ic">
              <Icon name="Bot" size={18} />
            </div>
            <div className="ai-head-t">
              <b>AU AI</b>
              <span>{role ? ROLE_LABEL[role] || "AU research grants" : "AU research grants · RASSC"}</span>
            </div>
            <button className="ai-x" onClick={() => setOpen(false)} aria-label="Close">
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="ai-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
            {busy && <div className="ai-msg assistant ai-typing">Thinking…</div>}
            {msgs.length <= 1 && !busy && (
              <div className="ai-suggest">
                {suggestions.map((s, i) => (
                  <button key={i} className="ai-chip" onClick={() => setInput(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="ai-input" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AU AI…"
            />
            <button type="submit" className="btn btn-primary" disabled={busy} aria-label="Send">
              <Icon name="Send" size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("ai-root")).render(<AIChat />);
