/* AU AI — floating AI assistant for Assumption University research grants.
   Talks to /api/chat (serverless -> Google Gemini). Mounts in its own root
   so the prototype's app.jsx is untouched. Uses the global Icon + React. */
const { useState, useRef, useEffect } = React;

function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about the grant workflow, the RASSC review process, the 4 required documents, payment stages (30 / 40 / 30), or publication rewards.",
    },
  ]);
  const bodyRef = useRef(null);

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
        body: JSON.stringify({ messages: next }),
      });
      const data = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply || "Sorry, no response." }]);
    } catch (err) {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach AU AI right now." }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = [
    "What are the 14 workflow stages?",
    "What documents do I need to apply?",
    "How much is the reward for a Scopus Q1 paper?",
  ];

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
              <span>AU research grants · RASSC</span>
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
              placeholder="Ask AU AI about research grants…"
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
