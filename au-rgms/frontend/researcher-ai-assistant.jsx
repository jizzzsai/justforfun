/* AU research-grant assistant. Application data remains limited by the
   signed-in researcher's normal database access. */
const { useState, useRef, useEffect } = React;

const ROLE_INTRO = {
  researcher: "Hi, I'm AU AI. I can help with YOUR applications, publication grant rewards, the AU-R1 documents you need, your 30/40/30 payment stages, and the grant workflow.",
  _default: "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about the workflow, AU-R1 documents, payment stages (30/40/30), or publication rewards.",
};
const ROLE_SUGGEST = {
  researcher: ["What's the status of my application?", "What publication reward can I request?", "When do I get my next payment?"],
  _default: ["What are the 14 workflow stages?", "What documents do I need to apply?", "Reward for a Scopus Q1 paper?"],
};
const ROLE_LABEL = {
  researcher: "Researcher assistant",
};

async function buildAIContext(grantSystem) {
  let prof = null;
  try { prof = await window.AUTH.profile(); } catch (e) {}
  const role = prof ? prof.role : null;
  const ctx = { role: role, name: prof ? prof.full_name : null, faculty: prof ? prof.faculty : null, grantSystem: grantSystem || null };
  try {
    if (role === "researcher") {
      const apps = await window.DB.myApplications(grantSystem || undefined);
      ctx.myApplications = (apps || []).map(a => ({ code: a.code, title: a.title, status: a.status, faculty: a.faculty, requested: a.requested_amount, grant_system: (a.grant_type || "au_r1").replace("au_r", "AU-R").toUpperCase() }));
      try {
        const pgs = await window.DB.myPublicationGrants();
        ctx.myPublicationGrants = (pgs || []).map(g => ({ code: g.id, title: g.title, status: g.status.label, statusKey: g.statusKey, amount: g.budgetTotal, indexing: g.indexing, quartile: g.quartile }));
      } catch (e) {}
      try {
        const g = await window.DB.myGrant(grantSystem || "au_r1");
        if (g) ctx.myGrant = { code: g.code, approved_amount: g.approved_amount, payments: (g.payments || []).map(p => ({ instalment: p.instalment, pct: p.pct, status: p.status })) };
      } catch (e) {}
    }
  } catch (e) {}
  return ctx;
}

function AIChat() {
  const [available, setAvailable] = useState(!!window.AU_AI_VISIBLE);
  const [grantSystem, setGrantSystem] = useState(window.AU_AI_GRANT_SYSTEM || null);
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
    buildAIContext(grantSystem).then(c => {
      if (!alive) return;
      setCtx(c);
      setRole(c.role);
      setMsgs([{ role: "assistant", content: ROLE_INTRO[c.role] || ROLE_INTRO._default }]);
    });
    return () => { alive = false; };
  }, [available, grantSystem]);

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
      const r = await fetch("/api/ai-chat-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
