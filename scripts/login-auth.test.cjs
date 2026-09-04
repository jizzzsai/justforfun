const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../au-rgms/database/login-and-database-connection.js"), "utf8");
const authKey = "au-rgms-auth";
const preferenceKey = "au-rgms-remember";

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key),
  };
}

function boot({ local = storage(), session = storage(), authError, profileError, profileMissing, logoutError } = {}) {
  let options;
  const calls = [];
  const client = {
    auth: {
      async signInWithPassword(credentials) {
        calls.push({ kind: "login", credentials });
        if (authError) return { error: authError };
        options.auth.storage.setItem(authKey, "test-session-token");
        return { data: { session: { user: { id: "test-user" } } } };
      },
      async signOut(config) {
        calls.push({ kind: "logout", config });
        if (logoutError) throw logoutError;
        options.auth.storage.removeItem(authKey);
        return {};
      },
      async getUser() { return { data: { user: { id: "test-user" } } }; },
      async getSession() { return { data: { session: options.auth.storage.getItem(authKey) } }; },
    },
    from() {
      return { select() { return this; }, eq() { return this; }, async single() {
        if (profileError) return { error: profileError };
        return { data: profileMissing ? null : { id: "test-user", role: "researcher" } };
      } };
    },
  };
  const window = { localStorage: local, sessionStorage: session, supabase: {
    createClient(url, key, config) { options = config; return client; },
  } };
  vm.runInNewContext(source, { window, console });
  return { auth: window.AUTH, local, session, calls, adapter: options.auth.storage };
}

test("unchecked Remember me keeps the token in the tab, never the password", async () => {
  const app = boot();
  assert.equal(app.auth.remembersSession(), false);
  assert.equal((await app.auth.signIn("  example@au.edu  ", "not-a-real-password", false)).role, "researcher");
  assert.equal(app.calls[0].credentials.email, "example@au.edu");
  assert.equal(app.local.getItem(authKey), null);
  assert.equal(app.session.getItem(authKey), "test-session-token");
  assert.equal(app.session.getItem("password"), null);
  assert.equal(app.local.getItem(preferenceKey), "false");
});

test("tab sessions survive reload but not a new independent tab", async () => {
  const app = boot();
  await app.auth.signIn("example@au.edu", "test", false);
  assert.equal(await boot({ local: app.local, session: app.session }).auth.session(), "test-session-token");
  assert.equal(await boot({ local: app.local }).auth.session(), null);
});

test("checked Remember me persists across a new client instance", async () => {
  const app = boot();
  await app.auth.signIn("example@au.edu", "test", true);
  assert.equal(app.local.getItem(authKey), "test-session-token");
  assert.equal(app.session.getItem(authKey), null);
  const reopened = boot({ local: app.local });
  assert.equal(reopened.auth.remembersSession(), true);
  assert.equal(await reopened.auth.session(), "test-session-token");
});

test("existing sessions from the previous login are preserved", async () => {
  const app = boot({ local: storage({ [authKey]: "legacy-session" }) });
  assert.equal(app.auth.remembersSession(), true);
  assert.equal(await app.auth.session(), "legacy-session");
});

test("changing persistence moves all owned auth keys and removes stale copies", async () => {
  const app = boot();
  await app.auth.signIn("example@au.edu", "test", true);
  app.adapter.setItem(authKey + "-user", "test-user-data");
  app.adapter.setItem(authKey + "-code-verifier", "test-verifier");
  await app.auth.signIn("example@au.edu", "test", false);
  for (const key of [authKey, authKey + "-user", authKey + "-code-verifier"]) {
    assert.equal(app.local.getItem(key), null);
    assert.notEqual(app.session.getItem(key), null);
  }
  await app.auth.signIn("example@au.edu", "test", true);
  assert.equal(app.session.getItem(authKey), null);
  assert.equal(app.local.getItem(authKey), "test-session-token");
});

test("existing role switching calls preserve the selected persistence", async () => {
  const app = boot();
  await app.auth.signIn("example@au.edu", "test", true);
  await app.auth.signIn("dean@au.edu", "test");
  assert.equal(app.auth.remembersSession(), true);
});

test("invalid credentials propagate without creating a session", async () => {
  const app = boot({ authError: new Error("Invalid login credentials") });
  await assert.rejects(app.auth.signIn("example@au.edu", "test", false), /Invalid login credentials/);
  assert.equal(await app.auth.session(), null);
});

test("removing a stored session does not revive a cached token", async () => {
  const app = boot();
  await app.auth.signIn("example@au.edu", "test", true);
  app.local.removeItem(authKey);
  assert.equal(await app.auth.session(), null);
});

test("missing and failed profiles do not leave an authenticated session behind", async () => {
  for (const config of [{ profileMissing: true }, { profileError: new Error("Profile unavailable") }]) {
    const app = boot(config);
    await assert.rejects(app.auth.signIn("example@au.edu", "test", true));
    assert.equal(await app.auth.session(), null);
    assert.equal(app.calls.find(call => call.kind === "logout").config.scope, "local");
  }
});

test("sign out removes only auth keys from both storage locations", async () => {
  const app = boot({ local: storage({ unrelated: "keep" }), session: storage({ unrelated: "keep" }) });
  await app.auth.signIn("example@au.edu", "test", true);
  app.session.setItem(authKey, "stale-session");
  await app.auth.signOut();
  assert.equal(await app.auth.session(), null);
  assert.equal(app.local.getItem(authKey), null);
  assert.equal(app.session.getItem(authKey), null);
  assert.equal(app.local.getItem("unrelated"), "keep");
  assert.equal(app.session.getItem("unrelated"), "keep");
});

test("local session is cleared even if remote logout throws", async () => {
  const app = boot({ logoutError: new Error("Network unavailable") });
  await app.auth.signIn("example@au.edu", "test", true);
  await assert.rejects(app.auth.signOut(), /Network unavailable/);
  assert.equal(await app.auth.session(), null);
});

test("blocked browser storage falls back to memory without breaking sign-in", async () => {
  const blocked = { getItem() { throw new Error("Blocked"); }, setItem() { throw new Error("Blocked"); }, removeItem() { throw new Error("Blocked"); } };
  const app = boot({ local: blocked, session: blocked });
  await app.auth.signIn("example@au.edu", "test", false);
  assert.equal(await app.auth.session(), "test-session-token");
  await app.auth.signOut();
  assert.equal(await app.auth.session(), null);
});
