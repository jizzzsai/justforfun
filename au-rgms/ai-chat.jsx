/* AU Grant Assistant — floating AI chat widget.
   Talks to /api/chat (serverless → Google Gemini). Mounts in its own root
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
        "Hi! I'm the AU Grant Assistant. Ask me about the Research Grant Management System — the 14-stage workflow, what each role does, the 4 required documents, application status, or the 30 / 40 / 30 payments.",
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
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach the assistant right now." }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = [
    "What are the 14 workflow stages?",
    "What documents do I need to apply?",
    "How do the 30 / 40 / 30 payments work?",
  ];

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        title="AU Grant Assistant"
        aria-label="AU Grant Assistant"
      >
        <Icon name={open ? "ChevronDown" : "HelpCircle"} size={22} />
      </button>

      {open && (
        <div className="ai-panel" role="dialog" aria-label="AU Grant Assistant">
          <div className="ai-head">
            <div className="ai-bot-ic">
              <Icon name="GraduationCap" size={16} />
            </div>
            <div className="ai-head-t">
              <b>AU Grant Assistant</b>
              <span>Answers about this system only</span>
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
              placeholder="Ask about the grant system…"
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
