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

const AI_POSITION_KEY = "au-rgms-ai-position-v1";
const AI_FAB_SIZE = 56;
const AI_PANEL_WIDTH = 384;
const AI_PANEL_HEIGHT = 540;
const AI_VIEWPORT_MARGIN = 16;
const AI_PANEL_GAP = 12;

function clampAIPosition(position, viewport) {
  const maxX = Math.max(AI_VIEWPORT_MARGIN, viewport.width - AI_FAB_SIZE - AI_VIEWPORT_MARGIN);
  const maxY = Math.max(AI_VIEWPORT_MARGIN, viewport.height - AI_FAB_SIZE - AI_VIEWPORT_MARGIN);
  return {
    x: Math.min(Math.max(Number(position.x) || 0, AI_VIEWPORT_MARGIN), maxX),
    y: Math.min(Math.max(Number(position.y) || 0, AI_VIEWPORT_MARGIN), maxY),
  };
}

function initialAIPosition(viewport) {
  try {
    const saved = JSON.parse(localStorage.getItem(AI_POSITION_KEY));
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      return clampAIPosition(saved, viewport);
    }
  } catch (e) {}
  return clampAIPosition({
    x: viewport.width - AI_FAB_SIZE - 24,
    y: viewport.height - AI_FAB_SIZE - 24,
  }, viewport);
}

function getAIPanelPosition(position, viewport) {
  const width = Math.min(AI_PANEL_WIDTH, viewport.width - (AI_VIEWPORT_MARGIN * 2));
  const height = Math.min(AI_PANEL_HEIGHT, Math.max(240, viewport.height - 140));
  const maxLeft = Math.max(AI_VIEWPORT_MARGIN, viewport.width - width - AI_VIEWPORT_MARGIN);
  const maxTop = Math.max(AI_VIEWPORT_MARGIN, viewport.height - height - AI_VIEWPORT_MARGIN);
  const alignedLeft = Math.min(
    Math.max(position.x + AI_FAB_SIZE - width, AI_VIEWPORT_MARGIN),
    maxLeft
  );
  const above = position.y - AI_PANEL_GAP - height;
  const below = position.y + AI_FAB_SIZE + AI_PANEL_GAP;
  if (above >= AI_VIEWPORT_MARGIN) return { left: alignedLeft, top: above };
  if (below <= maxTop) return { left: alignedLeft, top: below };

  const centeredTop = Math.min(
    Math.max(position.y + (AI_FAB_SIZE / 2) - (height / 2), AI_VIEWPORT_MARGIN),
    maxTop
  );
  const leftOfButton = position.x - AI_PANEL_GAP - width;
  if (leftOfButton >= AI_VIEWPORT_MARGIN) return { left: leftOfButton, top: centeredTop };
  const rightOfButton = position.x + AI_FAB_SIZE + AI_PANEL_GAP;
  if (rightOfButton <= maxLeft) return { left: rightOfButton, top: centeredTop };

  return { left: alignedLeft, top: centeredTop };
}

async function buildAIContext() {
  let prof = null;
  try { prof = await window.AUTH.profile(); } catch (e) {}
  const role = prof ? prof.role : null;
  const ctx = { role: role, name: prof ? prof.full_name : null, faculty: prof ? prof.faculty : null };
  try {
    if (role === "researcher") {
      const apps = await window.DB.myApplications();
      ctx.myApplications = (apps || []).map(a => ({ code: a.code, title: a.title, status: a.status, faculty: a.faculty, requested: a.requested_amount, grant_system: (a.grant_type || "au_r1").replace("au_r", "AU-R").toUpperCase() }));
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
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [position, setPosition] = useState(() => initialAIPosition({ width: window.innerWidth, height: window.innerHeight }));
  const [dragging, setDragging] = useState(false);
  const bodyRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

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

  useEffect(() => {
    function onResize() {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight };
      setViewport(nextViewport);
      setPosition(current => clampAIPosition(current, nextViewport));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(AI_POSITION_KEY, JSON.stringify(position)); } catch (e) {}
  }, [position]);

  function startDrag(e, source) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (source === "panel" && e.target.closest("button, input, textarea, select, a")) return;
    dragRef.current = {
      pointerId: e.pointerId,
      source,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  }

  function moveDrag(e) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    setDragging(true);
    e.preventDefault();
    setPosition(clampAIPosition({ x: drag.originX + dx, y: drag.originY + dy }, viewport));
  }

  function endDrag(e) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.releasePointerCapture && e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (drag.moved && drag.source === "fab") suppressClickRef.current = true;
    dragRef.current = null;
    setDragging(false);
  }

  function toggleOpen() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setOpen(v => !v);
  }

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
  const panelPosition = getAIPanelPosition(position, viewport);

  return (
    <>
      <button
        className={`ai-fab${dragging ? " ai-dragging" : ""}`}
        style={{ left: position.x, top: position.y }}
        onPointerDown={(e) => startDrag(e, "fab")}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={toggleOpen}
        title="Drag to move · Click to open AU AI"
        aria-label="AU AI assistant"
      >
        <Icon name={open ? "ChevronDown" : "HelpCircle"} size={22} />
      </button>

      {open && (
        <div
          className={`ai-panel${dragging ? " ai-dragging" : ""}`}
          style={{ left: panelPosition.left, top: panelPosition.top }}
          role="dialog"
          aria-label="AU AI assistant"
        >
          <div
            className="ai-head"
            onPointerDown={(e) => startDrag(e, "panel")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            title="Drag to move"
          >
            <div className="ai-bot-ic">
              <Icon name="GraduationCap" size={16} />
            </div>
            <div className="ai-head-t">
              <b>AU AI</b>
              <span>{role ? ROLE_LABEL[role] || "AU research grants" : "AU research grants · RASSC"} · Drag to move</span>
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
