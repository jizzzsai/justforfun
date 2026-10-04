const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const base = path.join(__dirname, "../au-rgms");
const read = file => fs.readFileSync(path.join(base, file), "utf8");

function portal() {
  const context = vm.createContext({
    window: {}, console, URLSearchParams,
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
    ReactDOM: { createRoot: () => ({ render() {} }) },
    document: { getElementById() {} },
  });
  for (const file of ["roles-menus-and-status-data.js", "shared-website-parts.js", "website-login-layout-and-navigation.js"]) {
    vm.runInContext(read("frontend/" + file), context);
  }
  return context;
}

test("Academic labels keep the compatible role and both active grants", () => {
  const ctx = portal();
  const role = ctx.window.AU.ROLES.find(r => r.key === "ofm");
  assert.equal(role.name, "Academic");
  assert.equal(role.full, "Academic Test");
  assert.equal(role.subtitle, "Academic - Test Account");
  assert.equal(vm.runInContext('ROLE_CONFIG.ofm.crumbRoot', ctx), "Academic");
  assert.ok(vm.runInContext('SYSTEM_ROLE_KEYS.au_r3.includes("ofm") && SYSTEM_ROLE_KEYS.au_r4.includes("ofm")', ctx));
  assert.ok(ctx.window.AU.FACULTIES.some(f => f.departments.includes("Finance and Banking")), "Do not rename the real academic department");
});

test("Demo switching targets Academic, not the retired email", () => {
  const ctx = portal();
  assert.equal(vm.runInContext('TEST_EMAIL_FOR.ofm', ctx), "academic@au.edu");
  assert.equal(vm.runInContext('demoRoleForEmail(" ACADEMIC@AU.EDU ")', ctx), "ofm");
  assert.equal(vm.runInContext('demoRoleForEmail("finance@au.edu")', ctx), null);
});

test("Older timeline actions display Academic without rewriting saved comments", () => {
  const ctx = portal();
  ctx.window.DB = { statusBadge: value => ({ label: value }) };
  ctx.app = { grant_type: "au_r4", status: "completed", events: [{
    id: "event", actor_role: "ofm", action: "Finance completed payment and closed application",
    from_status: "approved", to_status: "completed", created_at: "2026-09-24T00:00:00Z",
    note: "Original Finance comment must be preserved.",
  }] };
  const tree = vm.runInContext('ApplicationEventTimeline({app})', ctx);
  const json = JSON.stringify(tree);
  assert.ok(json.includes("Academic completed payment and closed application"));
  assert.ok(json.includes("Academic Office"));
  assert.ok(json.includes("Original Finance comment must be preserved."));
  assert.equal(ctx.app.events[0].action, "Finance completed payment and closed application");
});

test("Academic API and database naming retain scope enforcement and history compatibility", () => {
  const ai = read("api/ai-chat-response.js");
  const db = read("database/website-database-actions.js");
  assert.ok(ai.includes('appParams.status = "in.(approved,active,completed)"'));
  assert.ok(ai.includes('approved: "Forwarded to Academic"'));
  assert.ok(db.includes('"At Academic"'));
  assert.ok(db.includes('["Academic marked payment as paid", "Finance marked payment as paid"]'));
  assert.ok(db.includes('"Only Academic or an administrator can complete this payment."'));
});
