/* AU-RGMS — Supabase client + auth helpers (real backend).
   Loaded after the supabase-js UMD bundle, before the React app.
   The anon key is public/safe in the browser; Row-Level Security protects data. */
(function () {
  var SUPABASE_URL = "https://kmseaoipvjhgznswbmlt.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttc2Vhb2lwdmpoZ3puc3dibWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjI2NjEsImV4cCI6MjA5NjAzODY2MX0.KgQSB0tVH3Qj2C5pT_l6z6FKLS8S1KYdfDli-eq46xw";

  if (!window.supabase || !window.supabase.createClient) {
    console.error("[AU] supabase-js failed to load");
    return;
  }
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "au-rgms-auth" },
  });
  window.sb = sb;

  // ---- Auth ----
  window.AUTH = {
    async signIn(email, password) {
      var res = await sb.auth.signInWithPassword({ email: (email || "").trim(), password: password });
      if (res.error) throw res.error;
      return await window.AUTH.profile();
    },
    async signOut() {
      try { await sb.auth.signOut(); } catch (e) {}
    },
    async session() {
      var r = await sb.auth.getSession();
      return r.data ? r.data.session : null;
    },
    async profile() {
      var u = await sb.auth.getUser();
      if (!u.data || !u.data.user) return null;
      var r = await sb.from("profiles").select("*").eq("id", u.data.user.id).single();
      if (r.error) throw r.error;
      return r.data; // { id, email, full_name, role, title, faculty, department, ... }
    },
  };
})();
