


(function () {
  var SUPABASE_URL = "https://kmseaoipvjhgznswbmlt.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttc2Vhb2lwdmpoZ3puc3dibWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjI2NjEsImV4cCI6MjA5NjAzODY2MX0.KgQSB0tVH3Qj2C5pT_l6z6FKLS8S1KYdfDli-eq46xw";

  if (!window.supabase || !window.supabase.createClient) {
    console.error("[AU] supabase-js failed to load");
    return;
  }
  var authKey = "au-rgms-auth";
  var preferenceKey = "au-rgms-remember";
  var memoryStorage = {};
  function readStorage(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function removeStorage(store, key) {
    try { window[store].removeItem(key); } catch (e) {}
  }
  var preference = readStorage("localStorage", preferenceKey);
  var rememberSession = preference === "true" || (preference === null && !!readStorage("localStorage", authKey));
  var authStorage = {
    getItem: function (key) {
      return readStorage(rememberSession ? "localStorage" : "sessionStorage", key) || memoryStorage[key] || null;
    },
    setItem: function (key, value) {
      try {
        window[rememberSession ? "localStorage" : "sessionStorage"].setItem(key, value);
        delete memoryStorage[key];
      } catch (e) { memoryStorage[key] = value; }
    },
    removeItem: function (key) {
      delete memoryStorage[key];
      removeStorage("localStorage", key);
      removeStorage("sessionStorage", key);
    },
  };
  function setRememberSession(remember) {
    var keys = [authKey, authKey + "-user", authKey + "-code-verifier"];
    var values = keys.map(function (key) { return authStorage.getItem(key); });
    rememberSession = !!remember;
    try { window.localStorage.setItem(preferenceKey, String(rememberSession)); } catch (e) {}
    keys.forEach(function (key, index) {
      authStorage.removeItem(key);
      if (values[index] !== null) authStorage.setItem(key, values[index]);
    });
  }
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: authKey, storage: authStorage },
  });
  window.sb = sb;

  function clearStoredSession() {
    [authKey, authKey + "-user", authKey + "-code-verifier"].forEach(function (key) { authStorage.removeItem(key); });
  }

  window.AUTH = {
    remembersSession: function () { return rememberSession; },
    async signIn(email, password, remember) {
      if (typeof remember === "boolean") setRememberSession(remember);
      var res = await sb.auth.signInWithPassword({ email: (email || "").trim(), password: password });
      if (res.error) throw res.error;
      try {
        var profile = await window.AUTH.profile();
        if (!profile) throw new Error("No profile found for this account. Contact your administrator.");
        return profile;
      } catch (error) {
        try { await sb.auth.signOut({ scope: "local" }); } catch (e) {}
        [authKey, authKey + "-user", authKey + "-code-verifier"].forEach(function (key) { authStorage.removeItem(key); });
        throw error;
      }
    },
    async signOut() {
      try { await sb.auth.signOut(); }
      finally {
        clearStoredSession();
      }
    },
    async session() {
      var r = await sb.auth.getSession();
      return r.data ? r.data.session : null;
    },
    // Read the active Supabase user first, then load that user's profile.  This
    // deliberately avoids trusting a role that was rendered before an account
    // switch (for example, a Dean screen left open after a test-account switch).
    async identity() {
      var sessionResult = await sb.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data || !sessionResult.data.session) return null;
      var u = await sb.auth.getUser();
      if (u.error) throw u.error;
      if (!u.data || !u.data.user) return null;
      var r = await sb.from("profiles").select("*").eq("id", u.data.user.id).single();
      if (r.error) throw r.error;
      return { user: u.data.user, profile: r.data };
    },
    async profile() {
      var identity = await window.AUTH.identity();
      return identity ? identity.profile : null;
    },
    async requestPasswordReset(email) {
      var normalized = String(email || "").trim().toLowerCase();
      if (normalized !== "u6430040@au.edu") throw new Error("Contact the system administrator to reset this account.");
      // Password recovery must always return to the production portal. Using the
      // current origin can accidentally generate localhost links when a reset is
      // requested from a development or preview build.
      var redirectTo = "https://au-rgms-blush.vercel.app/?reset-password=1";
      var r = await sb.auth.resetPasswordForEmail(normalized, { redirectTo: redirectTo });
      if (r.error) throw r.error;
      return true;
    },
    async updatePassword(password) {
      var profile = await window.AUTH.profile();
      if (!profile || String(profile.email || "").toLowerCase() !== "u6430040@au.edu") {
        throw new Error("Self-service password reset is not enabled for this account.");
      }
      var r = await sb.auth.updateUser({ password: password });
      if (r.error) throw r.error;
      return true;
    },
  };
})();
