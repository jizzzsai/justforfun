

const { useState, useRef, useEffect } = React;

const ROLE_INTRO = {
  researcher: "Hi, I'm AU AI. Ask me about your applications, forms, documents, authors, reviews, reports, or payments.",
  dean: "Hi, I'm AU AI for Deans. I can summarize only the AU-R3 and AU-R4 applications in your assigned faculty.",
  iras: "Hi, I'm AU AI for IRAS. Ask me about university-wide R3/R4 verification queues, workflow totals, faculties, and approved funding.",
  ofm: "Hi, I'm AU AI for Finance. Ask me about R3/R4 applications forwarded to Finance, pending payments, disbursements, and completed payments.",
  admin: "Hi, I'm AU AI for Admin Analytics. Ask me to summarize or compare live applications, faculties, budgets, users, workflows, and payments.",
  _default: "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about AU-R3 conference grants, AU-R4 publication rewards, reviews, documents, or payments.",
};
const ROLE_SUGGEST = {
  researcher: ["What needs my action now?", "How much annual funding do I have left?", "Which documents am I missing?"],
  dean: ["What needs my review now?", "Which department has the highest approved spending?", "Summarize my faculty's R3 and R4 applications"],
  iras: ["What needs IRAS verification now?", "Which faculty has the highest approved amount?", "Where are applications getting delayed?"],
  ofm: ["What payments need action now?", "Which faculty has the highest disbursement?", "Compare pending and completed payments"],
  admin: ["Give me a management summary", "Which faculty has the most applications?", "What workflow or access issues need attention?"],
  _default: ["How does the AU-R3 workflow work?", "What documents do I need to apply?", "Reward for a Scopus Q1 paper?"],
};
const ROLE_LABEL = {
  researcher: "Researcher assistant",
  dean: "Dean faculty assistant",
  iras: "IRAS analytics assistant",
  ofm: "Finance analytics assistant",
  admin: "Admin analytics assistant",
};

async function buildAIContext(grantSystem, mode) {
  let prof = null;
  try { prof = await window.AUTH.profile(); } catch (e) {}
  const role = prof ? prof.role : null;
  // Only the requested module is sent by the browser. The API verifies the
  // session and loads fresh, role-scoped records server-side for every answer.
  return {
    role: role,
    name: prof ? prof.full_name : null,
    faculty: prof ? prof.faculty : null,
    grantSystem: grantSystem || null,
    mode: mode || null,
  };
}

function AIInlineText({ text }) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((part, index) => {
    const bold = (part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"));
    return bold ? <strong key={index}>{part.slice(2, -2)}</strong> : <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function AIMessageContent({ content }) {
  const lines = String(content || "").replace(/\r/g, "").split("\n");
  return (
    <div className="ai-rich-text">
      {lines.map((line, index) => {
        const value = line.trim();
        if (!value) return <div className="ai-rich-gap" key={index} aria-hidden="true" />;
        const heading = value.match(/^#{1,3}\s+(.+)$/);
        const bullet = value.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
        if (heading) return <div className="ai-rich-heading" key={index}><AIInlineText text={heading[1]} /></div>;
        if (bullet) return <div className="ai-rich-bullet" key={index}><span aria-hidden="true">•</span><div><AIInlineText text={bullet[1]} /></div></div>;
        return <div className="ai-rich-line" key={index}><AIInlineText text={value} /></div>;
      })}
    </div>
  );
}

function AIChat() {
  const initialRole = window.AU_AI_ROLE || null;
  const [available, setAvailable] = useState(!!window.AU_AI_VISIBLE);
  const [grantSystem, setGrantSystem] = useState(window.AU_AI_GRANT_SYSTEM || null);
  const [mode, setMode] = useState(window.AU_AI_MODE || null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [role, setRole] = useState(initialRole);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: ROLE_INTRO[initialRole] || ROLE_INTRO._default }]);
  const bodyRef = useRef(null);

  useEffect(() => {
    const onVisibility = event => {
      const next = !!(event.detail && event.detail.visible);
      const nextRole = next && event.detail ? event.detail.role || null : null;
      setAvailable(next);
      setGrantSystem(next && event.detail ? event.detail.grantSystem : null);
      setMode(next && event.detail ? event.detail.mode : null);
      setRole(nextRole);
      setCtx(null);
      setMsgs([{ role: "assistant", content: ROLE_INTRO[nextRole] || ROLE_INTRO._default }]);
      if (!next) setOpen(false);
    };
    window.addEventListener("au-ai-visibility", onVisibility);
    return () => window.removeEventListener("au-ai-visibility", onVisibility);
  }, []);

  useEffect(() => {
    const onToggle = () => {
      if (available) setOpen(v => !v);
    };
    const onPrompt = event => {
      if (!available) return;
      setOpen(true);
      setInput(String((event.detail && event.detail.prompt) || ""));
    };
    window.addEventListener("au-ai-toggle", onToggle);
    window.addEventListener("au-ai-prompt", onPrompt);
    return () => {
      window.removeEventListener("au-ai-toggle", onToggle);
      window.removeEventListener("au-ai-prompt", onPrompt);
    };
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

  const embedded = mode === "role";
  const panel = (
    <div className={`ai-panel${embedded ? " ai-page-panel" : ""}`} id="researcher-ai-dialog" role="dialog" aria-label="AU AI assistant">
      <div className="ai-head">
        <div className="ai-bot-ic">
          <Icon name="Bot" size={18} />
        </div>
        <div className="ai-head-t">
          <b>AU AI</b>
          <span>{role ? ROLE_LABEL[role] || "AU research grants" : "AU research grants · IRAS"}</span>
        </div>
        {!embedded && <button className="ai-x" onClick={() => setOpen(false)} aria-label="Close"><Icon name="X" size={16} /></button>}
      </div>

      <div className="ai-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            {m.role === "assistant" ? <AIMessageContent content={m.content} /> : m.content}
          </div>
        ))}
        {busy && <div className="ai-msg assistant ai-typing">Thinking…</div>}
        {msgs.length <= 1 && !busy && (
          <div className="ai-suggest">
            {suggestions.map((s, i) => <button key={i} className="ai-chip" onClick={() => setInput(s)}>{s}</button>)}
          </div>
        )}
      </div>

      <form className="ai-input" onSubmit={send}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask AU AI…" />
        <button type="submit" className="btn btn-primary" disabled={busy} aria-label="Send"><Icon name="Send" size={15} /></button>
      </form>
    </div>
  );

  if (embedded) {
    const host = document.getElementById("role-ai-chat-host");
    return host ? ReactDOM.createPortal(panel, host) : null;
  }

  return (
    <>
      <button type="button" className="ai-launcher" onClick={() => setOpen(v => !v)} title="Ask AU AI" aria-label="Ask AU AI" aria-expanded={open} aria-controls={open ? "researcher-ai-dialog" : undefined}>
        <Icon name="Bot" size={20} />
      </button>
      {open && panel}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("ai-root")).render(<AIChat />);
