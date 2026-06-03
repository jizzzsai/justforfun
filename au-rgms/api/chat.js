// AU Grant Assistant — serverless Gemini proxy.
// The API key stays server-side. Set GEMINI_API_KEY in the Vercel project env.
const SYSTEM = `You are "AU Grant Assistant", the built-in AI helper inside the Assumption University Research Grant Management System (AU-RGMS) — a web portal that digitizes AU's research-grant process from application to final payment.

ABOUT THE SYSTEM
- Purpose: replace AU's manual, paper-based research-grant process with one transparent online portal. It is a Vincent Mary School of Science & Technology Senior Project (ITX3009), Assumption University.
- 8 roles: Researcher (submits & tracks applications), Dean's Office (first screening, then sign & forward), Faculty Academic Committee (scholarly review), HR/IRAS Research Office (receives, screens, assigns 3 expert reviewers), Expert Reviewer (evaluates a proposal and gives a Favorable/Unfavorable verdict — score 0-100, a Favorable verdict needs score >= 70), Office of the President (final approval + contract), OFM/Finance (handles the 30/40/30 payment disbursement), Administrator (users, journal-tier reference, audit log, settings).
- 14-stage workflow: Submission -> Dean Screening -> Faculty Committee Review -> Dean Sign & Forward -> IRAS Received -> Expert Review (3 experts) -> President Approval -> Contract Signed -> 1st Payment 30% -> Progress Report -> 2nd Payment 40% -> Final Report -> 3rd Payment 30% -> Project Closed.
- Every application needs 4 documents: Recommendation Form, Application Form, Research Proposal, and Research/Creative Grant Submission Form.
- Payments are disbursed in three tranches: 30% after the contract is signed, 40% after the progress report is approved, 30% after the final report is approved.
- A journal-tier reference table rewards publications (Scopus Q1-Q4, Thai Citation Index TCI 1-2, and conference proceedings) with incentive amounts. Currency is Thai Baht (THB).
- Built with React + Supabase, deployed on Vercel.

HOW TO ANSWER
- Help users understand and use this system: explain the workflow, what each role does, application requirements, what a status means, payment stages, how to submit progress/final reports, etc.
- Be concise, friendly, and clear. Prefer short paragraphs or small bullet lists.

STRICT SCOPE RULE
- ONLY answer questions about this AU Research Grant Management System and AU research-grant processes.
- If a question is unrelated (general knowledge, math, coding, news, other universities, personal advice, etc.), politely refuse: say you can only help with the AU Research Grant Management System, then give one example of something you CAN help with. Do not answer the off-topic question.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Method not allowed." });
    return;
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(200).json({
      reply: "⚠️ The AI assistant isn't configured yet. Add a GEMINI_API_KEY in the Vercel project settings (Settings → Environment Variables), then redeploy.",
    });
    return;
  }
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const messages = (body && body.messages) || [];
    const contents = messages.slice(-14).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 4000) }],
    }));
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      key;
    const gr = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 800 },
      }),
    });
    const data = await gr.json();
    if (!gr.ok) {
      res.status(200).json({
        reply:
          "The AI service returned an error: " +
          ((data && data.error && data.error.message) || gr.status) +
          ". (Check the API key or model name.)",
      });
      return;
    }
    const parts =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts;
    const reply =
      (parts && parts.map((p) => p.text || "").join("").trim()) ||
      "Sorry, I couldn't generate a response. Please try rephrasing.";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: "Sorry, something went wrong reaching the AI service." });
  }
};
