/* AU AI — role-aware floating assistant for Assumption University research grants.
   Talks to /api/chat (serverless -> Google Gemini). Gathers a role-scoped data
   snapshot (RLS-limited, so it can only ever use data the signed-in user may see)
   and sends it with each message. Mounts in its own root so app.jsx is untouched. */
const { useState, useRef, useEffect } = React;

const ROLE_INTRO = {
  researcher: "Hi, I'm AU AI. I can help with YOUR applications, publication grant rewards, the AU-R1 documents you need, your 30/40/30 payment stages, and the grant workflow.",
  dean: "Hi, I'm AU AI. I can help with your faculty's screening queue, the review workflow, and AU grant rules.",
  committee: "Hi, I'm AU AI. I can help with your faculty's committee reviews, scoring, and AU grant rules.",
  iras: "Hi, I'm AU AI for RASSC. Ask me about any faculty's activity, publication grants, approval rates, what's under review, or grant rules.",
  president: "Hi, I'm AU AI. Ask me university-wide questions, publication grant totals, what's awaiting a contract, approved budget so far, or grant rules.",
  ofm: "Hi, I'm AU AI. I can help with disbursements, publication reward payments, the 30/40/30 payment gates, and totals.",
  expert: "Hi, I'm AU AI. I can help with your assigned reviews and AU evaluation criteria.",
  admin: "Hi, I'm AU AI. Ask me about users, the system, any faculty's activity, or grant rules.",
  _default: "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about the workflow, AU-R1 documents, payment stages (30/40/30), or publication rewards.",
};
const ROLE_SUGGEST = {
  researcher: ["What's the status of my application?", "What publication reward can I request?", "When do I get my next payment?"],
  dean: ["What's in my screening queue?", "What are the 14 workflow stages?", "What's the budget cap per category?"],
  committee: ["What's awaiting my committee review?", "How is a proposal scored?", "What are the AU grant rules?"],
  iras: ["Which faculty applies the most?", "How many publication grants are pending?", "What's the approval rate?"],
  president: ["Which faculty applies the most?", "What publication rewards were approved?", "How much budget is approved so far?"],
  ofm: ["Which payments are due?", "Which publication rewards are ready to pay?", "How much is disbursed so far?"],
  expert: ["What are my assigned reviews?", "How do I score a proposal?", "What makes a favorable recommendation?"],
  admin: ["How many users are in the system?", "Which faculty applies the most?", "What are the 14 workflow stages?"],
  _default: ["What are the 14 workflow stages?", "What documents do I need to apply?", "Reward for a Scopus Q1 paper?"],
};
const ROLE_LABEL = {
  researcher: "Researcher assistant", dean: "Dean assistant", committee: "Committee assistant",
  iras: "RASSC assistant", president: "Vice President assistant", ofm: "Finance assistant",
  expert: "Expert reviewer assistant", admin: "Admin assistant",
};

async function buildAIContext() {
  let prof = null;
  try { prof = await window.AUTH.profile(); } catch (e) {}
  const role = prof ? prof.role : null;
  const ctx = { role: role, name: prof ? prof.full_name : null, faculty: prof ? prof.faculty : null };
  try {
    if (role === "researcher") {
      const apps = await window.DB.myApplications();
      ctx.myApplications = (apps || []).map(a => ({ code: a.code, title: a.title, status: a.status, faculty: a.faculty, requested: a.requested_amount }));
      try {
        const pgs = await window.DB.myPublicationGrants();
        ctx.myPublicationGrants = (pgs || []).map(g => ({ code: g.id, title: g.title, status: g.status.label, statusKey: g.statusKey, amount: g.budgetTotal, indexing: g.indexing, quartile: g.quartile }));
      } catch (e) {}
      try {
        const g = await window.DB.myGrant();
        if (g) ctx.myGrant = { code: g.code, approved_amount: g.approved_amount, payments: (g.payments || []).map(p => ({ instalment: p.instalment, pct: p.pct, status: p.status })) };
      } catch (e) {}
    } else if (role === "expert") {
      const a = await window.DB.myExpertAssignments();
      ctx.myAssignments = (a || []).map(x => ({ code: x.id, title: x.title, status: x.assignmentStatus }));
    } else if (role === "ofm") {
      ctx.statusCounts = await window.DB.statusCounts();
      try { const paid = await window.DB.paidPayments(); ctx.totalPaid = paid.reduce((s, p) => s + Number(p.amount || 0), 0); ctx.paidCount = paid.length; } catch (e) {}
      try { ctx.publicationGrantStats = await window.DB.publicationGrantStats(); } catch (e) {}
    } else if (role) {
      // dean / committee (RLS-scoped to their own faculty) or iras / president / admin (all faculties)
      ctx.facultyStats = await window.DB.facultyStats();
      ctx.statusCounts = await window.DB.statusCounts();
      if (["iras", "president", "admin"].includes(role)) {
        try { ctx.publicationGrantStats = await window.DB.publicationGrantStats(); } catch (e) {}
      }
    }
  } catch (e) {}
  return ctx;
}

function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [role, setRole] = useState(null);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: ROLE_INTRO._default }]);
  const bodyRef = useRef(null);

  useEffect(() => {
    let alive = true;
    buildAIContext().then(c => {
      if (!alive) return;
      setCtx(c);
      setRole(c.role);
      setMsgs(m => (m.length <= 1 ? [{ role: "assistant", content: ROLE_INTRO[c.role] || ROLE_INTRO._default }] : m));
    });
    return () => { alive = false; };
  }, []);

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
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: ctx }),
      });
      const data = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply || "Sorry, no response." }]);
    } catch (err) {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach AU AI right now." }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = ROLE_SUGGEST[role] || ROLE_SUGGEST._default;

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        title="AU AI"
        aria-label="AU AI assistant"
      >
        <Icon name={open ? "ChevronDown" : "HelpCircle"} size={22} />
      </button>

      {open && (
        <div className="ai-panel" role="dialog" aria-label="AU AI assistant">
          <div className="ai-head">
            <div className="ai-bot-ic">
              <Icon name="GraduationCap" size={16} />
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
