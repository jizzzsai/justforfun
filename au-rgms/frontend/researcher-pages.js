function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var RA = window.AU;
var R3_PIPELINE = [{
  key: "submission",
  label: "Submitted"
}, {
  key: "dean",
  label: "Dean Review"
}, {
  key: "iras",
  label: "IRAS Verification"
}, {
  key: "approved",
  label: "Approved"
}, {
  key: "payment",
  label: "Payment"
}, {
  key: "completed",
  label: "Completed"
}];
function buildR3Timeline(statusKey) {
  var order = ["submission", "dean", "iras", "approved", "payment", "completed"];
  var idxMap = {
    draft: 0,
    submitted: 1,
    iras_review: 2,
    approved: 4,
    active: 5,
    completed: 6,
    returned: 0,
    rejected: 0
  };
  var idx = idxMap[statusKey];
  if (idx === undefined) idx = 0;
  var tl = {};
  var currentLabel = statusKey === "draft" ? "Draft" : statusKey === "returned" ? "Returned for revision" : statusKey === "rejected" ? "Not approved" : "In progress";
  order.forEach(function (k, i) {
    tl[k] = i < idx ? {
      done: true,
      date: "Completed"
    } : i === idx ? {
      current: true,
      date: currentLabel
    } : {
      date: "Not started"
    };
  });
  return tl;
}
var R4_PIPELINE = [{
  key: "submission",
  label: "Submitted"
}, {
  key: "dean",
  label: "Dean Review"
}, {
  key: "iras",
  label: "IRAS Verification"
}, {
  key: "approved",
  label: "Approved by Research Office"
}, {
  key: "payment",
  label: "Finance Payment"
}, {
  key: "completed",
  label: "Completed"
}];
function buildR4Timeline(statusKey) {
  var order = ["submission", "dean", "iras", "approved", "payment", "completed"];
  var idxMap = {
    draft: 0,
    submitted: 1,
    iras_review: 2,
    approved: 4,
    active: 4,
    completed: 6,
    returned: 0,
    rejected: 0
  };
  var idx = idxMap[statusKey];
  if (idx === undefined) idx = 0;
  var tl = {};
  var currentLabel = statusKey === "draft" ? "Draft" : statusKey === "returned" ? "Returned for revision" : statusKey === "rejected" ? "Not approved" : "In progress";
  order.forEach(function (k, i) {
    tl[k] = i < idx ? {
      done: true,
      date: "Completed"
    } : i === idx ? {
      current: true,
      date: currentLabel
    } : {
      date: "Not started"
    };
  });
  return tl;
}
function ResearcherDashboard(_ref) {
  var navigate = _ref.navigate,
    onDownload = _ref.onDownload,
    onView = _ref.onView,
    setSelectedApplicationId = _ref.setSelectedApplicationId,
    grantType = _ref.grantType;
  var sys = grantSystemFor(grantType || "au_r3");
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    me = _useState2[0],
    setMe = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    grant = _useState4[0],
    setGrant = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    apps = _useState6[0],
    setApps = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    appsError = _useState8[0],
    setAppsError = _useState8[1];
  useEffect(function () {
    var active = true;
    setApps(null);
    setAppsError(false);
    window.AUTH.profile().then(setMe).catch(function () {});
    window.DB.myGrant(grantType || "au_r3").then(function (g) {
      return setGrant(g || false);
    }).catch(function () {
      return setGrant(false);
    });
    window.DB.myApplications(grantType || undefined).then(function (items) {
      if (active) setApps(items || []);
    }).catch(function () {
      if (active) setAppsError(true);
    });
    return function () {
      active = false;
    };
  }, [grantType]);
  var isR3 = grantType === "au_r3";
  var isR4 = grantType === "au_r4";
  var isSingle = isR3 || isR4;
  var exampleSteps = isR4 ? R4_PIPELINE : R3_PIPELINE;
  var singleGrant = isSingle && grant && grant.grant_type === grantType ? grant : null;
  var r3PayLabel = {
    approved: "Awaiting Finance Completion",
    active: "At Finance",
    completed: "Completed"
  };
  var pays = grant && grant.payments && grant.payments.length ? grant.payments.slice().sort(function (a, b) {
    return a.instalment - b.instalment;
  }) : [];
  var grantTotal = grant ? Number(grant.approved_amount || grant.requested_amount || 0) : 0;
  var paidTotal = pays.filter(function (p) {
    return p.status === "paid";
  }).reduce(function (s, p) {
    return s + Number(p.amount || 0);
  }, 0);
  var progressPct = grantTotal > 0 ? Math.round(paidTotal / grantTotal * 100) : 0;
  var displayPays = pays.length ? pays : grant ? [{
    id: "t1",
    instalment: 1,
    pct: 30,
    amount: Math.round(grantTotal * 0.30),
    status: "pending"
  }, {
    id: "t2",
    instalment: 2,
    pct: 40,
    amount: grantTotal - 2 * Math.round(grantTotal * 0.30),
    status: "pending"
  }, {
    id: "t3",
    instalment: 3,
    pct: 30,
    amount: Math.round(grantTotal * 0.30),
    status: "pending"
  }] : [];
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: sys.code + " · Researcher Dashboard",
    desc: "Welcome back" + (me ? ", " + me.full_name : "") + ". Here is the status of your " + sys.name + " applications.",
    actions: React.createElement(React.Fragment, null, React.createElement("button", {
      className: "btn btn-secondary",
      onClick: function onClick() {
        return navigate("r-switch-system");
      },
      title: "Switch grant system"
    }, React.createElement(Icon, {
      name: "Repeat",
      size: 14
    }), " ", sys.code), React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        if (setSelectedApplicationId) setSelectedApplicationId(null);
        navigate("r-submit");
      }
    }, React.createElement(Icon, {
      name: "Plus",
      size: 14
    }), " New Application"))
  }), React.createElement("div", {
    className: "card card-pad-0 mb-6"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, sys.code, " Application Pipeline"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "badge badge-draft"
  }, "Example workflow")), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "researcher-pipeline-example"
  }, React.createElement("p", {
    className: "text-sm text-muted"
  }, sys.code, " application steps."), React.createElement(HTimeline, {
    steps: exampleSteps,
    app: {
      timeline: {}
    }
  })))), React.createElement("div", {
    className: isSingle ? "grid-2" : ""
  }, isSingle ? React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, isR4 ? "Latest Claim Status" : "Grant Payment Status", singleGrant ? " · " + singleGrant.code : ""), React.createElement("div", {
    className: "grow"
  }), singleGrant && React.createElement(Badge, {
    status: window.DB.statusBadge(singleGrant.status, singleGrant.grant_type)
  })), React.createElement("div", {
    className: "card-body"
  }, apps === null && !appsError && React.createElement("div", {
    className: "text-sm text-muted"
  }, "Loading\u2026"), apps && !singleGrant && React.createElement(Empty, {
    title: isR4 ? "No approved claim yet" : "No approved conference grant yet",
    desc: isR4 ? "Once IRAS approves your publication claim, its payment status appears here." : "Once your paper presentation grant is approved, its payment status appears here.",
    icon: "Coins"
  }), singleGrant && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 500,
      fontSize: 17,
      marginBottom: 4
    }
  }, singleGrant.title), React.createElement("div", {
    className: "text-sm text-muted mb-4"
  }, singleGrant.pub_info && singleGrant.pub_info.journal || singleGrant.conference_info && singleGrant.conference_info.confName || singleGrant.faculty || "—"), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Application ID"), React.createElement("span", {
    className: "r"
  }, singleGrant.code)), isR4 && singleGrant.pub_info && React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Journal"), React.createElement("span", {
    className: "r"
  }, singleGrant.pub_info.journal, singleGrant.pub_info.indexLabel ? " · " + singleGrant.pub_info.indexLabel : "")), isR3 && singleGrant.conference_info && React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Conference"), React.createElement("span", {
    className: "r"
  }, singleGrant.conference_info.confName)), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, isR4 ? "Requested claim" : "Requested amount"), React.createElement("span", {
    className: "r"
  }, fmtBaht(Number(singleGrant.requested_amount || 0)))), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, isR4 ? "IRAS-approved amount" : "Approved amount"), React.createElement("span", {
    className: "r"
  }, singleGrant.approved_amount ? fmtBaht(Number(singleGrant.approved_amount)) : "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Payment status"), React.createElement("span", {
    className: "r"
  }, r3PayLabel[singleGrant.status] || "Pending")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Payment date"), React.createElement("span", {
    className: "r"
  }, ["active", "completed"].includes(singleGrant.status) ? window.DB.fmtDate(singleGrant.updated_at || singleGrant.decided_at) : "—"))))) : React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Payment Progress", grant ? " · " + grant.code : ""), React.createElement("div", {
    className: "grow"
  }), grant && React.createElement(Badge, {
    status: window.DB.statusBadge(grant.status)
  })), React.createElement("div", {
    className: "card-body"
  }, grant === null && React.createElement("div", {
    className: "text-sm text-muted"
  }, "Loading\u2026"), grant === false && React.createElement(Empty, {
    title: "No approved grant yet",
    desc: "Once your application is approved, your 30 / 40 / 30 Finance approvals appear here.",
    icon: "Coins"
  }), grant && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 500,
      fontSize: 17,
      marginBottom: 4
    }
  }, grant.title), React.createElement("div", {
    className: "text-sm text-muted mb-4"
  }, grant.faculty || "—", grant.department ? " · " + grant.department : ""), React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, React.createElement("span", {
    className: "text-sm text-muted"
  }, "Finance approval progress"), React.createElement("span", {
    className: "text-sm font-semi"
  }, fmtBaht(paidTotal), " of ", fmtBaht(grantTotal), " paid")), React.createElement("div", {
    className: "progress mb-4"
  }, React.createElement("div", {
    className: "bar",
    style: {
      width: progressPct + "%"
    }
  })), React.createElement("div", {
    className: "grid-3"
  }, displayPays.map(function (p) {
    return React.createElement("div", {
      key: p.id,
      style: {
        padding: 14,
        border: "1px solid var(--line)",
        borderRadius: "var(--r-md)",
        background: "var(--paper-warm)"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      }
    }, "Phase ", p.instalment, " \xB7 ", p.pct, "%"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 20,
        fontWeight: 500,
        margin: "4px 0"
      }
    }, fmtBaht(p.amount)), React.createElement("span", {
      className: "badge " + (p.status === "paid" ? "badge-paid" : "badge-pending")
    }, React.createElement("span", {
      className: "dot"
    }), p.status === "paid" ? "Paid" : "Pending Payment"));
  }))))), isSingle && React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "My Applications")), React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, appsError && React.createElement("div", {
    className: "text-sm text-muted",
    role: "status",
    style: {
      padding: "12px 20px"
    }
  }, "Could not load applications. Please refresh to try again."), apps === null && !appsError && React.createElement("div", {
    style: {
      padding: "12px 20px",
      color: "var(--ink-3)",
      fontSize: 12
    }
  }, "Loading\u2026"), apps && apps.length === 0 && React.createElement("div", {
    style: {
      padding: "16px 20px"
    }
  }, React.createElement(Empty, {
    title: "No applications yet",
    desc: isR4 ? "Submit your first publication reward application to get started." : isR3 ? "Submit your first paper presentation grant application to get started." : "Submit your first research grant application to get started.",
    icon: "FilePlus"
  })), (apps || []).slice(0, 6).map(function (a, i) {
    return React.createElement("div", {
      key: a.id,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "10px 20px",
        cursor: "pointer",
        borderBottom: i < Math.min(apps.length, 6) - 1 ? "1px solid var(--line-2)" : "none"
      },
      onClick: function onClick() {
        if (setSelectedApplicationId) setSelectedApplicationId(a.id);
        navigate("r-detail");
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, a.title || "Untitled application"), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        marginTop: 2
      }
    }, a.code, " \xB7 ", window.DB.fmtDate(a.submitted_at || a.created_at))), React.createElement(Badge, {
      status: a.statusBadge || window.DB.statusBadge(a.status, a.grant_type)
    }));
  })))));
}
function researcherSnapshotFromDraft(draft) {
  return {
    nameTitle: String(draft.title2 || "").trim(),
    academicPosition: String(draft.academicPosition || "").trim(),
    fullName: String(draft.name || "").trim(),
    auId: String(draft.auId || "").trim(),
    email: String(draft.email || "").trim().toLowerCase(),
    phone: normalizeThaiPhone(draft.phone),
    officeRoom: String(draft.office || "").trim(),
    joinedDate: draft.joinedDate || null,
    faculty: draft.school || "",
    department: draft.department || ""
  };
}
var roStyle = {
  background: "var(--paper-warm)",
  color: "var(--ink-2)",
  cursor: "not-allowed"
};
function uploadAllDocuments(_x, _x2) {
  return _uploadAllDocuments.apply(this, arguments);
}
function _uploadAllDocuments() {
  _uploadAllDocuments = _asyncToGenerator(_regenerator().m(function _callee11(appId, files) {
    var results;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          _context11.n = 1;
          return Promise.all((files || []).map(function (it) {
            return window.DB.uploadDocument(appId, it.file, it.docType || null).then(function () {
              return null;
            }).catch(function () {
              return it.file && it.file.name || "a file";
            });
          }));
        case 1:
          results = _context11.v;
          return _context11.a(2, results.filter(Boolean));
      }
    }, _callee11);
  }));
  return _uploadAllDocuments.apply(this, arguments);
}
function ReturnNotice(_ref2) {
  var info = _ref2.info;
  if (!info) return null;
  var who = info.actor && info.actor.full_name || {
    dean: "The Dean",
    iras: "IRAS"
  }[info.actor_role] || "A reviewer";
  return React.createElement("div", {
    style: {
      border: "1px solid var(--au-gold)",
      background: "var(--au-gold-soft)",
      borderRadius: "var(--r-md)",
      padding: "14px 16px",
      marginBottom: 18,
      display: "flex",
      gap: 12
    }
  }, React.createElement(Icon, {
    name: "AlertCircle",
    size: 20,
    style: {
      color: "var(--au-gold-deep)",
      flexShrink: 0,
      marginTop: 2
    }
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 4
    }
  }, "Returned for revision \u2014 ", who, info.created_at ? " · " + window.DB.fmtDate(info.created_at) : ""), React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, info.note || "No reason was recorded."), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 8
    }
  }, "Your previous answers are already filled in below \u2014 update only what is asked for (add the missing file or fix the details), then submit again.")));
}
function ApplicationDecisionNotice(_ref3) {
  var app = _ref3.app;
  if (!app || !["returned", "rejected"].includes(app.status)) return null;
  var events = (app.events || []).filter(function (event) {
    return event.to_status === app.status;
  });
  events.sort(function (a, b) {
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  var decision = events[0] || null;
  var actorName = decision && decision.actor && decision.actor.full_name ? decision.actor.full_name : {
    dean: "Dean",
    iras: "IRAS",
    ofm: "Finance Office"
  }[decision && decision.actor_role || ""] || "Reviewer";
  var rejected = app.status === "rejected";
  var reason = decision && String(decision.note || "").trim();
  return React.createElement("div", {
    style: {
      border: "1px solid " + (rejected ? "var(--au-crimson)" : "var(--au-gold)"),
      borderLeft: "4px solid " + (rejected ? "var(--au-crimson)" : "var(--au-gold)"),
      background: rejected ? "var(--au-crimson-soft)" : "var(--au-gold-soft)",
      borderRadius: "var(--r-md)",
      padding: "15px 18px",
      marginBottom: 20,
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, React.createElement(Icon, {
    name: rejected ? "X" : "AlertCircle",
    size: 21,
    style: {
      color: rejected ? "var(--au-crimson)" : "var(--au-gold-deep)",
      flexShrink: 0,
      marginTop: 1
    }
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 700,
      color: rejected ? "var(--au-crimson)" : "var(--ink-1)",
      marginBottom: 4
    }
  }, rejected ? "Application rejected" : "Returned for revision", " \xB7 ", actorName, decision && decision.created_at ? " · " + window.DB.fmtDate(decision.created_at) : ""), React.createElement("div", {
    style: {
      color: "var(--ink-2)",
      fontSize: 13,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, React.createElement("strong", null, "Reason:"), " ", reason || "No reason was recorded.")));
}
function grantSystemFor(id) {
  var list = RA && RA.GRANT_SYSTEMS || [];
  return list.find(function (s) {
    return s.id === id;
  }) || list[0] || {
    id: "au_r3",
    code: "AU-R3",
    name: "Paper Presentation Grant",
    maxAmount: 3500,
    collaborative: true
  };
}
function fmtNiceDate(iso) {
  if (!iso) return "";
  var d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function safeDocumentDisplayName(doc) {
  var name = String(doc && doc.name || "");
  if (/\bau[-_\s]?r1\b/i.test(name)) return doc && doc.doc_type || "Uploaded document";
  return name || doc && doc.doc_type || "Uploaded document";
}
function monthsBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  var s = new Date(startISO),
    e = new Date(endISO);
  if (isNaN(s) || isNaN(e) || e < s) return 0;
  var m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() >= s.getDate()) m += 1;
  return Math.max(1, m);
}
function todayISO() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function UniversityJoinedDateField(_ref4) {
  var value = _ref4.value,
    onChange = _ref4.onChange,
    _ref4$readOnly = _ref4.readOnly,
    readOnly = _ref4$readOnly === void 0 ? false : _ref4$readOnly;
  var service = universityServiceEligibility(value);
  return React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Date Joined Assumption University *"), readOnly ? React.createElement("input", {
    value: value ? fmtNiceDate(value) : "Not set — contact the administrator",
    readOnly: true,
    style: roStyle
  }) : React.createElement(AUDatePicker, {
    value: value,
    onChange: onChange,
    min: "1969-01-01",
    max: todayISO(),
    placeholder: "Select joined date\u2026"
  }), value && React.createElement("div", {
    style: {
      fontSize: 11,
      marginTop: 5,
      color: service.eligible ? "var(--status-approved)" : "var(--au-crimson)",
      fontWeight: 650
    }
  }, service.eligible ? "University service: " + service.months + " months · Eligible." : "University service: " + service.months + " months · Not eligible until " + fmtNiceDate(service.eligibleOn) + "."));
}
var R3_DEFAULT_DRAFT = {
  confName: "",
  organizer: "",
  website: "",
  confType: "International",
  conferenceLocation: "",
  presentationDate: "",
  presentation: "Oral Presentation",
  journalDb: "",
  journalClassification: "",
  paperTitle: "",
  field: "",
  keywords: "",
  paperAbstract: "",
  authorType: "Lead Author",
  name: "",
  title2: "",
  academicPosition: "",
  auId: "",
  email: "",
  phone: "",
  office: "",
  joinedDate: "",
  school: "",
  department: ""
};
function ResearcherSubmitR3(_ref5) {
  var applicationId = _ref5.applicationId,
    navigate = _ref5.navigate,
    onDownload = _ref5.onDownload,
    onView = _ref5.onView,
    toast = _ref5.toast,
    setConfirm = _ref5.setConfirm,
    setSelectedApplicationId = _ref5.setSelectedApplicationId;
  var fixedGrantAmount = 3500;
  var _useState9 = useState(_objectSpread({}, R3_DEFAULT_DRAFT)),
    _useState0 = _slicedToArray(_useState9, 2),
    draft = _useState0[0],
    setDraft = _useState0[1];
  var upd = function upd(k, v) {
    return setDraft(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, _defineProperty({}, k, v));
    });
  };
  var classificationOptions = (RA.R4_JOURNAL_CLASSIFICATIONS || {})[draft.journalDb] || null;
  var _useState1 = useState([]),
    _useState10 = _slicedToArray(_useState1, 2),
    authors = _useState10[0],
    setAuthors = _useState10[1];
  var addAuthor = function addAuthor() {
    return setAuthors(function (m) {
      return m.concat([{
        name: "",
        authorType: "Co-author",
        kind: "Researcher",
        auId: "",
        email: ""
      }]);
    });
  };
  var setAuthor = function setAuthor(i, k, v) {
    return setAuthors(function (m) {
      return m.map(function (r, j) {
        return j === i ? _objectSpread(_objectSpread({}, r), {}, _defineProperty({}, k, v)) : r;
      });
    });
  };
  var removeAuthor = function removeAuthor(i) {
    return setAuthors(function (m) {
      return m.filter(function (_, j) {
        return j !== i;
      });
    });
  };
  var _useState11 = useState([]),
    _useState12 = _slicedToArray(_useState11, 2),
    files = _useState12[0],
    setFiles = _useState12[1];
  var _useState13 = useState("Full Conference Paper"),
    _useState14 = _slicedToArray(_useState13, 2),
    docType = _useState14[0],
    setDocType = _useState14[1];
  var onFiles = function onFiles(e) {
    var fs = Array.from(e.target.files || []);
    setFiles(function (prev) {
      return prev.concat(fs.map(function (f) {
        return {
          file: f,
          docType: docType
        };
      }));
    });
    e.target.value = "";
  };
  var _useState15 = useState(applicationId || null),
    _useState16 = _slicedToArray(_useState15, 2),
    editingId = _useState16[0],
    setEditingId = _useState16[1];
  var _useState17 = useState([]),
    _useState18 = _slicedToArray(_useState17, 2),
    existingDocs = _useState18[0],
    setExistingDocs = _useState18[1];
  var _useState19 = useState(!!applicationId),
    _useState20 = _slicedToArray(_useState19, 2),
    loadingDraft = _useState20[0],
    setLoadingDraft = _useState20[1];
  var _useState21 = useState(null),
    _useState22 = _slicedToArray(_useState21, 2),
    returnInfo = _useState22[0],
    setReturnInfo = _useState22[1];
  var _useState23 = useState(false),
    _useState24 = _slicedToArray(_useState23, 2),
    busy = _useState24[0],
    setBusy = _useState24[1];
  var _useState25 = useState(null),
    _useState26 = _slicedToArray(_useState25, 2),
    busyKind = _useState26[0],
    setBusyKind = _useState26[1];
  var _useState27 = useState(""),
    _useState28 = _slicedToArray(_useState27, 2),
    err = _useState28[0],
    setErr = _useState28[1];
  var _useState29 = useState(null),
    _useState30 = _slicedToArray(_useState29, 2),
    annualFunding = _useState30[0],
    setAnnualFunding = _useState30[1];
  var academicYear = window.DB.academicYearLabel("", draft.presentationDate || new Date());
  var annualLimitExceeded = !!annualFunding && fixedGrantAmount > annualFunding.remaining;
  useEffect(function () {
    var cancelled = false;
    setAnnualFunding(null);
    window.DB.annualFundingSummary(academicYear, null, editingId).then(function (summary) {
      if (!cancelled) setAnnualFunding(summary);
    }).catch(function () {
      if (!cancelled) setAnnualFunding({
        academicYear: academicYear,
        limit: 100000,
        used: 0,
        remaining: 100000
      });
    });
    return function () {
      cancelled = true;
    };
  }, [academicYear, editingId]);
  useEffect(function () {
    _asyncToGenerator(_regenerator().m(function _callee() {
      var p, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return window.AUTH.profile();
          case 1:
            p = _context.v;
            if (p && p.office_room) setDraft(function (d) {
              return _objectSpread(_objectSpread({}, d), {}, {
                office: d.office || p.office_room
              });
            });
            if (p && !applicationId) setDraft(function (d) {
              return _objectSpread(_objectSpread({}, d), {}, {
                name: p.full_name || d.name,
                title2: p.name_title || p.title || d.title2,
                auId: p.au_id || d.auId,
                email: p.email || d.email,
                joinedDate: p.joined_date || d.joinedDate,
                school: RA.FACULTIES.some(function (f) {
                  return f.name === p.faculty;
                }) ? p.faculty : d.school,
                department: RA.FACULTIES.some(function (f) {
                  return f.name === p.faculty;
                }) ? p.department || d.department : d.department,
                phone: normalizeThaiPhone(p.phone || d.phone),
                office: p.office_room || d.office
              });
            });
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }))();
  }, [applicationId]);
  useEffect(function () {
    var cancelled = false;
    function load() {
      return _load.apply(this, arguments);
    }
    function _load() {
      _load = _asyncToGenerator(_regenerator().m(function _callee2() {
        var app, ci, researcherInfo, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (applicationId) {
                _context2.n = 1;
                break;
              }
              setEditingId(null);
              setExistingDocs([]);
              setFiles([]);
              setLoadingDraft(false);
              return _context2.a(2);
            case 1:
              setLoadingDraft(true);
              setErr("");
              _context2.p = 2;
              _context2.n = 3;
              return window.DB.applicationDetail(applicationId);
            case 3:
              app = _context2.v;
              if (!(!app || ["draft", "returned"].indexOf(app.status) === -1)) {
                _context2.n = 4;
                break;
              }
              if (!cancelled) {
                setEditingId(null);
                setExistingDocs([]);
                setErr("Only draft or returned applications can be edited here.");
              }
              return _context2.a(2);
            case 4:
              if (!cancelled) {
                _context2.n = 5;
                break;
              }
              return _context2.a(2);
            case 5:
              ci = app.conference_info || {};
              researcherInfo = submittedResearcherInfo(app);
              setEditingId(app.id);
              if (app.status === "returned") {
                window.DB.lastReturnReason(app.id).then(function (r) {
                  if (!cancelled) setReturnInfo(r);
                }).catch(function () {});
              } else setReturnInfo(null);
              setExistingDocs(app.documents || []);
              setDraft(function (d) {
                return _objectSpread(_objectSpread({}, d), {}, {
                  confName: ci.confName || "",
                  organizer: ci.organizer || "",
                  website: ci.website || "",
                  confType: ci.confType || "International",
                  conferenceLocation: ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", "),
                  presentationDate: ci.presentationDate || ci.confStart || app.start_date || "",
                  presentation: ci.presentation || "Oral Presentation",
                  journalDb: ci.journalDb || "",
                  journalClassification: ci.journalClassification || "",
                  paperTitle: app.title || "",
                  field: app.field || "",
                  keywords: app.keywords || "",
                  paperAbstract: ci.paperAbstract || "",
                  authorType: ci.authorType || "Lead Author",
                  joinedDate: researcherInfo.joinedDate || "",
                  school: researcherInfo.faculty || app.faculty || d.school,
                  department: researcherInfo.department || app.department || d.department,
                  name: researcherInfo.fullName || d.name,
                  title2: researcherInfo.nameTitle || d.title2,
                  academicPosition: researcherInfo.academicPosition || d.academicPosition,
                  auId: researcherInfo.auId || d.auId,
                  email: researcherInfo.email || d.email,
                  phone: researcherInfo.phone || d.phone,
                  office: researcherInfo.officeRoom || d.office
                });
              });
              setAuthors(Array.isArray(app.co_members) ? app.co_members.map(function (m) {
                return _objectSpread(_objectSpread({}, m), {}, {
                  authorType: m.authorType || "Co-author"
                });
              }) : []);
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              if (!cancelled) setErr(_t2 && _t2.message || "Could not load this draft.");
            case 7:
              _context2.p = 7;
              if (!cancelled) setLoadingDraft(false);
              return _context2.f(7);
            case 8:
              return _context2.a(2);
          }
        }, _callee2, null, [[2, 6, 7, 8]]);
      }));
      return _load.apply(this, arguments);
    }
    load();
    return function () {
      cancelled = true;
    };
  }, [applicationId]);
  var deleteExistingDoc = function deleteExistingDoc(doc) {
    var runDelete = function () {
      var _ref7 = _asyncToGenerator(_regenerator().m(function _callee3() {
        var _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return window.DB.deleteDocument(doc);
            case 1:
              setExistingDocs(function (ds) {
                return ds.filter(function (d) {
                  return d.id !== doc.id;
                });
              });
              toast(doc.name + " deleted.");
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _t3 = _context3.v;
              toast("Delete error: " + (_t3 && _t3.message || _t3));
            case 3:
              return _context3.a(2);
          }
        }, _callee3, null, [[0, 2]]);
      }));
      return function runDelete() {
        return _ref7.apply(this, arguments);
      };
    }();
    if (setConfirm) setConfirm({
      kind: "danger",
      title: "Delete uploaded file?",
      message: doc.name + " will be removed from this draft and from storage.",
      confirmLabel: "Delete File",
      onConfirm: runDelete
    });else runDelete();
  };
  function save(_x3) {
    return _save.apply(this, arguments);
  }
  function _save() {
    _save = _asyncToGenerator(_regenerator().m(function _callee4(submit) {
      var selectedTypes, missingDocs, researcherSnapshot, confInfo, app, failedUploads, _t4, _t5;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            setErr("");
            if (!(submit && !draft.confName.trim())) {
              _context4.n = 1;
              break;
            }
            setErr("Enter the conference name.");
            return _context4.a(2);
          case 1:
            if (!(submit && !draft.organizer.trim())) {
              _context4.n = 2;
              break;
            }
            setErr("Enter the conference organizer.");
            return _context4.a(2);
          case 2:
            if (!(submit && !draft.conferenceLocation.trim())) {
              _context4.n = 3;
              break;
            }
            setErr("Enter the conference location.");
            return _context4.a(2);
          case 3:
            if (!(submit && !draft.presentationDate)) {
              _context4.n = 4;
              break;
            }
            setErr("Select the presentation date.");
            return _context4.a(2);
          case 4:
            if (!(submit && !draft.paperTitle.trim())) {
              _context4.n = 5;
              break;
            }
            setErr("Enter the paper title.");
            return _context4.a(2);
          case 5:
            if (!(submit && !draft.field.trim())) {
              _context4.n = 6;
              break;
            }
            setErr("Enter the research field.");
            return _context4.a(2);
          case 6:
            if (!(submit && !draft.paperAbstract.trim())) {
              _context4.n = 7;
              break;
            }
            setErr("Enter the paper abstract.");
            return _context4.a(2);
          case 7:
            if (!(submit && !draft.journalDb)) {
              _context4.n = 8;
              break;
            }
            setErr("Select the Conference Database / Index.");
            return _context4.a(2);
          case 8:
            if (!(submit && !draft.journalClassification.trim())) {
              _context4.n = 9;
              break;
            }
            setErr("Select or enter the conference qualities.");
            return _context4.a(2);
          case 9:
            if (!(submit && !draft.school)) {
              _context4.n = 10;
              break;
            }
            setErr("Select your faculty so the application routes to the right reviewers.");
            return _context4.a(2);
          case 10:
            if (!(submit && !draft.name.trim())) {
              _context4.n = 11;
              break;
            }
            setErr("Enter your full name.");
            return _context4.a(2);
          case 11:
            if (!(submit && !draft.email.trim())) {
              _context4.n = 12;
              break;
            }
            setErr("Enter your AU email address.");
            return _context4.a(2);
          case 12:
            if (!(submit && !draft.joinedDate)) {
              _context4.n = 13;
              break;
            }
            setErr("Your account has no Date Joined AU. Ask the administrator to add it in User Management.");
            return _context4.a(2);
          case 13:
            if (!(submit && !universityServiceEligibility(draft.joinedDate).eligible)) {
              _context4.n = 14;
              break;
            }
            setErr("You are not eligible yet. AU-R3 applicants must have at least one year of service at Assumption University.");
            return _context4.a(2);
          case 14:
            if (!(submit && draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim()))) {
              _context4.n = 15;
              break;
            }
            setErr("Email must be an Assumption University address ending in @au.edu.");
            return _context4.a(2);
          case 15:
            if (!(submit && draft.phone && !isValidThaiPhone(draft.phone))) {
              _context4.n = 16;
              break;
            }
            setErr("Phone must be a Thai number with 9–10 digits starting with 0.");
            return _context4.a(2);
          case 16:
            if (!(submit && annualLimitExceeded)) {
              _context4.n = 17;
              break;
            }
            setErr("This AU-R3 grant exceeds your remaining " + academicYear + " academic-year balance. The combined AU-R3/AU-R4 limit is 100,000 THB.");
            return _context4.a(2);
          case 17:
            if (!submit) {
              _context4.n = 18;
              break;
            }
            selectedTypes = existingDocs.map(function (d) {
              return d.doc_type;
            }).concat(files.map(function (f) {
              return f.docType;
            }));
            missingDocs = (RA.R3_DOC_TYPES || []).filter(function (t) {
              return selectedTypes.indexOf(t) === -1;
            });
            if (!missingDocs.length) {
              _context4.n = 18;
              break;
            }
            setErr("Upload all three required documents. Missing: " + missingDocs.join(", ") + ".");
            return _context4.a(2);
          case 18:
            setBusy(true);
            setBusyKind(submit ? "submit" : "draft");
            _context4.p = 19;
            _context4.p = 20;
            _context4.n = 21;
            return window.DB.updateMyProfile({
              full_name: draft.name,
              name_title: draft.title2,
              au_id: draft.auId,
              phone: draft.phone,
              department: draft.department,
              office_room: draft.office
            });
          case 21:
            _context4.n = 23;
            break;
          case 22:
            _context4.p = 22;
            _t4 = _context4.v;
          case 23:
            researcherSnapshot = researcherSnapshotFromDraft(draft);
            confInfo = {
              confName: draft.confName,
              organizer: draft.organizer,
              website: draft.website,
              confType: draft.confType,
              conferenceLocation: draft.conferenceLocation,
              presentationDate: draft.presentationDate || null,
              academicYear: academicYear,
              presentation: draft.presentation || "Oral Presentation",
              journalDb: draft.journalDb,
              journalClassification: draft.journalClassification,
              paperAbstract: draft.paperAbstract,
              authorType: draft.authorType,
              researcherSnapshot: researcherSnapshot,
              researcherName: researcherSnapshot.fullName,
              researcherEmail: researcherSnapshot.email,
              researcherTitle: researcherSnapshot.nameTitle,
              researcherAuId: researcherSnapshot.auId,
              researcherPhone: researcherSnapshot.phone,
              researcherOffice: researcherSnapshot.officeRoom,
              researcherJoinedDate: researcherSnapshot.joinedDate
            };
            _context4.n = 24;
            return window.DB.createApplication({
              title: draft.paperTitle,
              abstract: draft.paperAbstract,
              field: draft.field,
              faculty: draft.school,
              department: draft.department,
              keywords: draft.keywords,
              requested_amount: fixedGrantAmount,
              duration_months: 1,
              start_date: draft.presentationDate || null,
              end_date: draft.presentationDate || null,
              budget_breakdown: [{
                item: "Fixed AU-R3 Grant",
                amount: fixedGrantAmount
              }],
              grant_type: "au_r3",
              academic_year: academicYear,
              co_members: authors.filter(function (m) {
                return (m.name || "").trim();
              }),
              conference_info: confInfo
            }, submit, editingId);
          case 24:
            app = _context4.v;
            _context4.n = 25;
            return uploadAllDocuments(app.id, files);
          case 25:
            failedUploads = _context4.v;
            if (!submit) {
              setEditingId(app.id);
              if (setSelectedApplicationId) setSelectedApplicationId(app.id);
            } else if (setSelectedApplicationId) setSelectedApplicationId(null);
            if (failedUploads.length) {
              toast(failedUploads.length + " file(s) could not be uploaded: " + failedUploads.join(", ") + ". Open the application and add them again.");
            } else {
              toast(submit ? "Application " + app.code + " submitted" : "Draft " + app.code + " saved");
            }
            navigate("r-applications");
            _context4.n = 27;
            break;
          case 26:
            _context4.p = 26;
            _t5 = _context4.v;
            setErr(_t5 && _t5.message || "Could not save the application.");
            setBusy(false);
          case 27:
            return _context4.a(2);
        }
      }, _callee4, null, [[20, 22], [19, 26]]);
    }));
    return _save.apply(this, arguments);
  }
  if (loadingDraft) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Edit AU-R3 Application",
      desc: "Loading saved draft."
    }), React.createElement("div", {
      className: "card",
      style: {
        padding: 44,
        textAlign: "center",
        color: "var(--ink-3)"
      }
    }, "Loading draft..."));
  }
  var emailBad = draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim());
  var facultyValid = RA.FACULTIES.some(function (f) {
    return f.name === draft.school;
  });
  var deptOptions = (RA.FACULTIES.find(function (f) {
    return f.name === draft.school;
  }) || {
    departments: []
  }).departments;
  var deptValid = facultyValid && deptOptions.indexOf(draft.department) >= 0;
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: (editingId ? "Edit " : "Submit ") + "AU-R3 Application",
    desc: "Paper Presentation Grant \u2014 fixed support of 3,500 THB for an accepted conference paper.",
    actions: React.createElement(React.Fragment, null, React.createElement("button", {
      className: "btn btn-secondary",
      disabled: busy,
      onClick: function onClick() {
        return save(false);
      }
    }, busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"), React.createElement("button", {
      className: "btn btn-primary",
      disabled: busy || annualLimitExceeded,
      onClick: function onClick() {
        return save(true);
      }
    }, React.createElement(Icon, {
      name: "Send",
      size: 13
    }), " ", busy ? busyKind === "submit" ? files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…" : "Saving draft…" : "Submit Application"))
  }), React.createElement(ReturnNotice, {
    info: returnInfo
  }), React.createElement("div", {
    className: "mb-4"
  }, React.createElement(AnnualFundingSummaryCard, {
    summary: annualFunding,
    currentAmount: fixedGrantAmount
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "1"), " Conference Information"), React.createElement("p", {
    className: "section-sub"
  }, "The conference where your paper has been accepted for presentation."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Conference Name"), React.createElement("input", {
    value: draft.confName,
    onChange: function onChange(e) {
      return upd("confName", e.target.value);
    },
    placeholder: "e.g. International Conference on Machine Learning 2027"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Conference Organizer"), React.createElement("input", {
    value: draft.organizer,
    onChange: function onChange(e) {
      return upd("organizer", e.target.value);
    },
    placeholder: "e.g. IIIE, ACM, professional association"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Conference Website"), React.createElement("input", {
    value: draft.website,
    onChange: function onChange(e) {
      return upd("website", e.target.value);
    },
    placeholder: "https://\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Conference Type"), React.createElement("select", {
    value: draft.confType,
    onChange: function onChange(e) {
      return upd("confType", e.target.value);
    }
  }, (RA.R3_CONFERENCE_TYPES || ["Domestic", "International"]).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Presentation Type"), React.createElement("select", {
    value: draft.presentation,
    onChange: function onChange(e) {
      return upd("presentation", e.target.value);
    }
  }, React.createElement("option", {
    value: "Oral Presentation"
  }, "Oral Presentation"), React.createElement("option", {
    value: "Poster Presentation"
  }, "Poster Presentation"))), React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Conference Location *"), React.createElement("input", {
    value: draft.conferenceLocation,
    onChange: function onChange(e) {
      return upd("conferenceLocation", e.target.value);
    },
    placeholder: "Type the venue, city, and country"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Presentation Date *"), React.createElement(AUDatePicker, {
    value: draft.presentationDate,
    onChange: function onChange(v) {
      return upd("presentationDate", v);
    },
    placeholder: "Select presentation date\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic Year (AD)"), React.createElement("input", {
    value: academicYear,
    readOnly: true,
    style: roStyle
  }))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "2"), " Research Paper Information"), React.createElement("p", {
    className: "section-sub"
  }, "The accepted paper you will present."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Paper Title"), React.createElement("input", {
    value: draft.paperTitle,
    onChange: function onChange(e) {
      return upd("paperTitle", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Research Field"), React.createElement("input", {
    value: draft.field,
    onChange: function onChange(e) {
      return upd("field", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Your Author Type"), React.createElement("select", {
    value: draft.authorType,
    onChange: function onChange(e) {
      return upd("authorType", e.target.value);
    }
  }, React.createElement("option", {
    value: "Lead Author"
  }, "Lead Author"), React.createElement("option", {
    value: "Co-author"
  }, "Co-author"))), React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Abstract *"), React.createElement("textarea", {
    className: "comment-input",
    style: {
      minHeight: 90
    },
    value: draft.paperAbstract,
    onChange: function onChange(e) {
      return upd("paperAbstract", e.target.value);
    },
    placeholder: "Paste the paper abstract here."
  })), React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Keywords"), React.createElement("input", {
    value: draft.keywords,
    onChange: function onChange(e) {
      return upd("keywords", e.target.value);
    },
    placeholder: "Enter keywords after the abstract"
  }))), React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Author(s)"), React.createElement("p", {
    className: "section-sub",
    style: {
      marginTop: 0
    }
  }, "You are the main applicant. Add the other researchers and students who co-authored this paper."), React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)"
    }
  }, React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", {
    style: {
      width: 140
    }
  }, "Author Type"), React.createElement("th", {
    style: {
      width: 120
    }
  }, "Person Type"), React.createElement("th", {
    style: {
      width: 110
    }
  }, "AU ID"), React.createElement("th", null, "Email"), React.createElement("th", {
    style: {
      width: 48
    }
  }))), React.createElement("tbody", null, authors.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      color: "var(--ink-3)",
      textAlign: "center",
      padding: "14px"
    }
  }, "No additional authors added \u2014 you are the sole author.")), authors.map(function (m, i) {
    return React.createElement("tr", {
      key: i
    }, React.createElement("td", null, React.createElement("input", {
      value: m.name,
      onChange: function onChange(e) {
        return setAuthor(i, "name", e.target.value);
      },
      placeholder: "Full name",
      style: {
        width: "100%",
        minWidth: 140
      }
    })), React.createElement("td", null, React.createElement("select", {
      value: m.authorType || "Co-author",
      onChange: function onChange(e) {
        return setAuthor(i, "authorType", e.target.value);
      }
    }, React.createElement("option", {
      value: "Lead Author"
    }, "Lead Author"), React.createElement("option", {
      value: "Co-author"
    }, "Co-author"))), React.createElement("td", null, React.createElement("select", {
      value: m.kind,
      onChange: function onChange(e) {
        return setAuthor(i, "kind", e.target.value);
      }
    }, React.createElement("option", {
      value: "Researcher"
    }, "Researcher"), React.createElement("option", {
      value: "Student"
    }, "Student"))), React.createElement("td", null, React.createElement("input", {
      value: m.auId,
      onChange: function onChange(e) {
        return setAuthor(i, "auId", e.target.value);
      },
      placeholder: "ID",
      style: {
        width: "100%",
        minWidth: 90
      }
    })), React.createElement("td", null, React.createElement("input", {
      type: "email",
      value: m.email,
      onChange: function onChange(e) {
        return setAuthor(i, "email", e.target.value);
      },
      placeholder: "name@au.edu",
      style: {
        width: "100%",
        minWidth: 150
      }
    })), React.createElement("td", {
      style: {
        textAlign: "center"
      }
    }, React.createElement("button", {
      type: "button",
      className: "btn btn-ghost btn-sm",
      onClick: function onClick() {
        return removeAuthor(i);
      },
      title: "Remove author"
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }))));
  })))), React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm mt-1",
    onClick: addAuthor
  }, React.createElement(Icon, {
    name: "Plus",
    size: 13
  }), " Add author")))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "3"), " Researcher Information"), React.createElement("p", {
    className: "section-sub"
  }, "Identity details come from your account. You may update your academic title, position, phone, and office / room here."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic Title"), React.createElement("select", {
    value: draft.title2,
    onChange: function onChange(e) {
      return upd("title2", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select title\u2026"), RA.AU_TITLES.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic / Administrative Position"), React.createElement("select", {
    value: draft.academicPosition,
    onChange: function onChange(e) {
      return upd("academicPosition", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select position\u2026"), (RA.AU_ACADEMIC_POSITIONS || []).map(function (position) {
    return React.createElement("option", {
      key: position,
      value: position
    }, position);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Full Name"), React.createElement("input", {
    value: draft.name,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "AU ID"), React.createElement("input", {
    value: draft.auId,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Email (AU only)"), React.createElement("input", {
    type: "email",
    value: draft.email,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Phone"), React.createElement(ThaiPhoneInput, {
    value: draft.phone,
    onChange: function onChange(value) {
      return upd("phone", value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Office / Room"), React.createElement("input", {
    value: draft.office,
    onChange: function onChange(e) {
      return upd("office", e.target.value);
    },
    placeholder: "e.g. Building A, Room 512"
  })), React.createElement(UniversityJoinedDateField, {
    value: draft.joinedDate,
    onChange: function onChange(v) {
      return upd("joinedDate", v);
    },
    readOnly: true
  }), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Faculty"), React.createElement("select", {
    value: facultyValid ? draft.school : "",
    disabled: true,
    style: roStyle
  }, React.createElement("option", {
    value: ""
  }, "Select your faculty\u2026"), RA.FACULTIES.map(function (f) {
    return React.createElement("option", {
      key: f.code,
      value: f.name
    }, f.name);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Department"), React.createElement("select", {
    value: deptValid ? draft.department : "",
    disabled: true,
    style: roStyle
  }, React.createElement("option", {
    value: ""
  }, draft.school ? "Select department…" : "Select a faculty first"), (RA.FACULTIES.find(function (f) {
    return f.name === draft.school;
  }) || {
    departments: []
  }).departments.map(function (d) {
    return React.createElement("option", {
      key: d,
      value: d
    }, d);
  })))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "4"), " Conference Qualities"), React.createElement("p", {
    className: "section-sub"
  }, "Select the conference proceedings database and enter its qualities. The AU-R3 grant amount is fixed at 3,500 THB."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Conference Database / Index *"), React.createElement("select", {
    value: draft.journalDb,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          journalDb: e.target.value,
          journalClassification: ""
        });
      });
    }
  }, React.createElement("option", {
    value: ""
  }, "Select database / index\u2026"), (RA.R3_CONFERENCE_DBS || RA.R4_JOURNAL_DBS || []).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Qualities *"), classificationOptions ? React.createElement("select", {
    value: draft.journalClassification,
    onChange: function onChange(e) {
      return upd("journalClassification", e.target.value);
    },
    disabled: !draft.journalDb
  }, React.createElement("option", {
    value: ""
  }, "Select qualities\u2026"), classificationOptions.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  })) : React.createElement("input", {
    value: draft.journalClassification,
    onChange: function onChange(e) {
      return upd("journalClassification", e.target.value);
    },
    disabled: !draft.journalDb,
    placeholder: draft.journalDb === "Other" ? "Enter qualities manually" : draft.journalDb ? "Enter conference qualities" : "Select a database / index first"
  }))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "5"), " Required Documents"), React.createElement("p", {
    className: "section-sub"
  }, "Upload the AU-R3 PDF documents. You can add or delete files while the application is still waiting for Dean Review."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    style: {
      background: "var(--paper-warm)",
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      padding: "12px 14px",
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 8,
      color: "var(--ink-2)"
    }
  }, "Documents required for an AU-R3 Paper Presentation Grant:"), React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.7
    }
  }, (RA.PAPER_PRESENTATION_DOCS || []).map(function (d) {
    return React.createElement("li", {
      key: d.id
    }, React.createElement("b", null, d.name.replace(/_/g, " ").replace(/\.pdf$/i, "")), " \u2014 ", d.role.replace(/^AU-R3 requirement:?\s*/i, ""));
  }))), existingDocs.length > 0 && React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      marginBottom: 12
    }
  }, existingDocs.map(function (d) {
    return React.createElement("div", {
      className: "file-row",
      key: d.id || d.name
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, safeDocumentDisplayName(d), d.doc_type && safeDocumentDisplayName(d) !== d.doc_type && React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 10,
        fontWeight: 700,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)",
        padding: "2px 8px",
        borderRadius: 999
      }
    }, d.doc_type)), React.createElement("div", {
      className: "fs"
    }, d.size || "PDF", " - Uploaded ", d.uploadedAt || "-")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onView(d);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 13
    }), " View"), React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onDownload(d);
      }
    }, React.createElement(Icon, {
      name: "Download",
      size: 13
    }), " Download"), React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteExistingDoc(d);
      }
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }), " Delete")));
  })), files.length > 0 && React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      marginBottom: 12
    }
  }, files.map(function (it, i) {
    return React.createElement("div", {
      className: "file-row",
      key: i
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, it.file.name, it.docType && React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 10,
        fontWeight: 700,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)",
        padding: "2px 8px",
        borderRadius: 999
      }
    }, it.docType)), React.createElement("div", {
      className: "fs"
    }, (it.file.size / 1024).toFixed(0), " KB \xB7 ready to upload")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return setFiles(function (fs) {
          return fs.filter(function (_, j) {
            return j !== i;
          });
        });
      }
    }, React.createElement(Icon, {
      name: "X",
      size: 13
    }), " Remove")));
  })), React.createElement("div", {
    className: "field",
    style: {
      maxWidth: 360,
      marginBottom: 10
    }
  }, React.createElement("label", null, "Document type for the next upload"), React.createElement("select", {
    value: docType,
    onChange: function onChange(e) {
      return setDocType(e.target.value);
    }
  }, (RA.R3_DOC_TYPES || RA.DOC_TYPES).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("label", {
    className: "upload-box mt-1",
    style: {
      cursor: "pointer",
      display: "block"
    }
  }, React.createElement("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    multiple: true,
    style: {
      display: "none"
    },
    onChange: onFiles
  }), React.createElement(Icon, {
    name: "Upload",
    size: 26,
    className: "icon"
  }), React.createElement("div", {
    className: "t"
  }, "Click to upload your ", React.createElement("b", null, docType)), React.createElement("div", {
    className: "s"
  }, "PDF \xB7 max 10 MB per file")))), React.createElement("div", {
    style: {
      padding: "16px 24px",
      borderTop: "1px solid var(--line)",
      background: "var(--paper-warm)",
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, err && React.createElement("div", {
    style: {
      color: "var(--au-crimson)",
      fontSize: 12,
      alignSelf: "center",
      marginRight: "auto"
    }
  }, err), React.createElement("button", {
    className: "btn btn-secondary",
    disabled: busy,
    onClick: function onClick() {
      return save(false);
    }
  }, busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: busy || annualLimitExceeded,
    onClick: function onClick() {
      return save(true);
    }
  }, React.createElement(Icon, {
    name: "Send",
    size: 13
  }), " ", busy ? busyKind === "submit" ? files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…" : "Saving draft…" : "Submit Application"))));
}
var R4_DEFAULT_DRAFT = {
  title: "",
  articleType: "Research Article",
  pubStatus: "Published",
  journal: "",
  publisher: "",
  website: "",
  articleUrl: "",
  doi: "",
  issn: "",
  acceptDate: "",
  pubDate: "",
  volume: "",
  issue: "",
  pageNumber: "",
  academicYear: "",
  journalDb: "",
  journalClassification: "",
  predatory: false,
  applicantRole: "First Author",
  name: "",
  title2: "",
  academicPosition: "",
  auId: "",
  email: "",
  phone: "",
  office: "",
  joinedDate: "",
  school: "",
  department: "",
  feePaid: "",
  feeDate: "",
  turnitin: ""
};
function ResearcherSubmitR4(_ref8) {
  var applicationId = _ref8.applicationId,
    navigate = _ref8.navigate,
    onDownload = _ref8.onDownload,
    onView = _ref8.onView,
    toast = _ref8.toast,
    setConfirm = _ref8.setConfirm,
    setSelectedApplicationId = _ref8.setSelectedApplicationId;
  var sys = grantSystemFor("au_r4");
  var MAX = 80000;
  var _useState31 = useState(_objectSpread(_objectSpread({}, R4_DEFAULT_DRAFT), {}, {
      academicYear: window.DB.academicYearLabel()
    })),
    _useState32 = _slicedToArray(_useState31, 2),
    draft = _useState32[0],
    setDraft = _useState32[1];
  var upd = function upd(k, v) {
    return setDraft(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, _defineProperty({}, k, v));
    });
  };
  var _useState33 = useState([{
      name: "",
      type: "First Author",
      email: "",
      contribution: "100"
    }]),
    _useState34 = _slicedToArray(_useState33, 2),
    authors = _useState34[0],
    setAuthors = _useState34[1];
  var addAuthor = function addAuthor() {
    return setAuthors(function (a) {
      return a.concat([{
        name: "",
        type: "Co-author",
        email: "",
        contribution: ""
      }]);
    });
  };
  var setAuthor = function setAuthor(i, k, v) {
    return setAuthors(function (list) {
      if (k !== "contribution") return list.map(function (r, j) {
        return j === i ? _objectSpread(_objectSpread({}, r), {}, _defineProperty({}, k, v)) : r;
      });
      var cleaned = (v + "").replace(/[^0-9.]/g, "");
      if (list.length !== 2 || cleaned === "" || !Number.isFinite(Number(cleaned))) {
        return list.map(function (r, j) {
          return j === i ? _objectSpread(_objectSpread({}, r), {}, {
            contribution: cleaned
          }) : r;
        });
      }
      var entered = Math.max(0, Math.min(100, Number(cleaned)));
      var normalized = String(Math.round(entered * 100) / 100);
      var complement = String(Math.round((100 - entered) * 100) / 100);
      return list.map(function (r, j) {
        return j === i ? _objectSpread(_objectSpread({}, r), {}, {
          contribution: normalized
        }) : _objectSpread(_objectSpread({}, r), {}, {
          contribution: complement
        });
      });
    });
  };
  var removeAuthor = function removeAuthor(i) {
    return setAuthors(function (a) {
      return a.length > 1 ? a.filter(function (_, j) {
        return j !== i;
      }) : a;
    });
  };
  var _useState35 = useState((RA.R4_DECLARATIONS || []).map(function () {
      return false;
    })),
    _useState36 = _slicedToArray(_useState35, 2),
    decls = _useState36[0],
    setDecls = _useState36[1];
  var allDecl = decls.length > 0 && decls.every(Boolean);
  var _useState37 = useState([]),
    _useState38 = _slicedToArray(_useState37, 2),
    files = _useState38[0],
    setFiles = _useState38[1];
  var _useState39 = useState("Full Research Article"),
    _useState40 = _slicedToArray(_useState39, 2),
    docType = _useState40[0],
    setDocType = _useState40[1];
  var onFiles = function onFiles(e) {
    var fs = Array.from(e.target.files || []);
    setFiles(function (prev) {
      return prev.concat(fs.map(function (f) {
        return {
          file: f,
          docType: docType
        };
      }));
    });
    e.target.value = "";
  };
  var onTypedFiles = function onTypedFiles(e, type) {
    var fs = Array.from(e.target.files || []);
    setFiles(function (prev) {
      return prev.concat(fs.map(function (f) {
        return {
          file: f,
          docType: type
        };
      }));
    });
    e.target.value = "";
  };
  var _useState41 = useState(applicationId || null),
    _useState42 = _slicedToArray(_useState41, 2),
    editingId = _useState42[0],
    setEditingId = _useState42[1];
  var _useState43 = useState([]),
    _useState44 = _slicedToArray(_useState43, 2),
    existingDocs = _useState44[0],
    setExistingDocs = _useState44[1];
  var _useState45 = useState(!!applicationId),
    _useState46 = _slicedToArray(_useState45, 2),
    loadingDraft = _useState46[0],
    setLoadingDraft = _useState46[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    returnInfo = _useState48[0],
    setReturnInfo = _useState48[1];
  var _useState49 = useState(false),
    _useState50 = _slicedToArray(_useState49, 2),
    busy = _useState50[0],
    setBusy = _useState50[1];
  var _useState51 = useState(null),
    _useState52 = _slicedToArray(_useState51, 2),
    busyKind = _useState52[0],
    setBusyKind = _useState52[1];
  var _useState53 = useState(""),
    _useState54 = _slicedToArray(_useState53, 2),
    err = _useState54[0],
    setErr = _useState54[1];
  var _useState55 = useState(null),
    _useState56 = _slicedToArray(_useState55, 2),
    annualFunding = _useState56[0],
    setAnnualFunding = _useState56[1];
  var published = draft.pubStatus === "Published";
  var classificationOptions = (RA.R4_JOURNAL_CLASSIFICATIONS || {})[draft.journalDb] || null;
  var tierSelected = draft.journalDb === "TCI" && ["Tier 1", "Tier 2"].includes(draft.journalClassification);
  var automaticReward = draft.journalDb === "SCOPUS" ? {
    Q1: 80000,
    Q2: 60000,
    Q3: 50000,
    Q4: 40000
  }[draft.journalClassification] || 0 : draft.journalDb === "Web of Science (WoS)" ? 80000 : ["ERIC", "MathSciNet", "PubMed", "JSTOR", "Project MUSE"].includes(draft.journalDb) ? 25000 : 0;
  var requested = tierSelected ? Math.min(MAX, Number(draft.feePaid) || 0) : automaticReward;
  var normalizedAcademicYear = window.DB.academicYearLabel(draft.academicYear, draft.pubDate || draft.acceptDate || new Date());
  var annualLimitExceeded = !!annualFunding && requested > annualFunding.remaining;
  var catLabel = [draft.journalDb, draft.journalClassification].filter(Boolean).join(" — ");
  var showPreliminaryReward = !!draft.journalDb && !!draft.journalClassification.trim() && !tierSelected;
  var totalContrib = authors.reduce(function (s, a) {
    return s + (Number(a.contribution) || 0);
  }, 0);
  var hasSecondAuthor = authors.length > 1;
  var firstContrib = Number((authors.find(function (a) {
    return a.type === "First Author";
  }) || {}).contribution) || 0;
  var turnitinNum = Number(draft.turnitin);
  var turnitinBad = draft.turnitin !== "" && turnitinNum > 20;
  var emailBad = draft.email && !/^[^@\s]+@au\.edu$/i.test(draft.email.trim());
  var facultyValid = RA.FACULTIES.some(function (f) {
    return f.name === draft.school;
  });
  var deptOptions = (RA.FACULTIES.find(function (f) {
    return f.name === draft.school;
  }) || {
    departments: []
  }).departments;
  var deptValid = facultyValid && deptOptions.indexOf(draft.department) >= 0;
  var isAuthorContributionDocument = function isAuthorContributionDocument(doc) {
    return ((doc && (doc.doc_type || doc.docType) || "") + " " + (doc && (doc.name || doc.file && doc.file.name) || "")).toLowerCase().includes("author contribution");
  };
  var contributionExistingDocs = existingDocs.filter(isAuthorContributionDocument);
  var contributionFiles = files.filter(isAuthorContributionDocument);
  var otherExistingDocs = existingDocs.filter(function (doc) {
    return !hasSecondAuthor || !isAuthorContributionDocument(doc);
  });
  var otherFiles = files.filter(function (file) {
    return !hasSecondAuthor || !isAuthorContributionDocument(file);
  });
  var hasDocument = function hasDocument(keyword) {
    return existingDocs.concat(files.map(function (it) {
      return {
        name: it.file.name,
        doc_type: it.docType
      };
    })).some(function (d) {
      return ((d && d.doc_type || "") + " " + (d && d.name || "")).toLowerCase().includes(keyword);
    });
  };
  useEffect(function () {
    if (!hasSecondAuthor && /author contribution/i.test(docType)) setDocType("Full Research Article");
  }, [hasSecondAuthor, docType]);
  useEffect(function () {
    var cancelled = false;
    setAnnualFunding(null);
    window.DB.annualFundingSummary(normalizedAcademicYear, null, editingId).then(function (summary) {
      if (!cancelled) setAnnualFunding(summary);
    }).catch(function () {
      if (!cancelled) setAnnualFunding({
        academicYear: normalizedAcademicYear,
        limit: 100000,
        used: 0,
        remaining: 100000
      });
    });
    return function () {
      cancelled = true;
    };
  }, [normalizedAcademicYear, editingId]);
  useEffect(function () {
    _asyncToGenerator(_regenerator().m(function _callee5() {
      var p, _t6;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return window.AUTH.profile();
          case 1:
            p = _context5.v;
            if (p && p.office_room) setDraft(function (d) {
              return _objectSpread(_objectSpread({}, d), {}, {
                office: d.office || p.office_room
              });
            });
            if (p && !applicationId) {
              setDraft(function (d) {
                return _objectSpread(_objectSpread({}, d), {}, {
                  name: p.full_name || d.name,
                  title2: p.name_title || p.title || d.title2,
                  auId: p.au_id || d.auId,
                  email: p.email || d.email,
                  joinedDate: p.joined_date || d.joinedDate,
                  school: RA.FACULTIES.some(function (f) {
                    return f.name === p.faculty;
                  }) ? p.faculty : d.school,
                  department: RA.FACULTIES.some(function (f) {
                    return f.name === p.faculty;
                  }) ? p.department || d.department : d.department,
                  phone: normalizeThaiPhone(p.phone || d.phone),
                  office: p.office_room || d.office
                });
              });
              setAuthors(function (a) {
                return a.map(function (r, i) {
                  return i === 0 ? _objectSpread(_objectSpread({}, r), {}, {
                    name: p.full_name || r.name,
                    email: p.email || r.email
                  }) : r;
                });
              });
            }
            _context5.n = 3;
            break;
          case 2:
            _context5.p = 2;
            _t6 = _context5.v;
          case 3:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 2]]);
    }))();
  }, [applicationId]);
  useEffect(function () {
    var cancelled = false;
    function load() {
      return _load2.apply(this, arguments);
    }
    function _load2() {
      _load2 = _asyncToGenerator(_regenerator().m(function _callee6() {
        var app, pi, researcherInfo, loadedDb, loadedClassification, accepted, _t7;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              if (applicationId) {
                _context6.n = 1;
                break;
              }
              setEditingId(null);
              setExistingDocs([]);
              setFiles([]);
              setLoadingDraft(false);
              return _context6.a(2);
            case 1:
              setLoadingDraft(true);
              setErr("");
              _context6.p = 2;
              _context6.n = 3;
              return window.DB.applicationDetail(applicationId);
            case 3:
              app = _context6.v;
              if (!(!app || ["draft", "returned"].indexOf(app.status) === -1)) {
                _context6.n = 4;
                break;
              }
              if (!cancelled) {
                setEditingId(null);
                setExistingDocs([]);
                setErr("Only draft or returned applications can be edited here.");
              }
              return _context6.a(2);
            case 4:
              if (!cancelled) {
                _context6.n = 5;
                break;
              }
              return _context6.a(2);
            case 5:
              pi = app.pub_info || {};
              researcherInfo = submittedResearcherInfo(app);
              setEditingId(app.id);
              if (app.status === "returned") {
                window.DB.lastReturnReason(app.id).then(function (r) {
                  if (!cancelled) setReturnInfo(r);
                }).catch(function () {});
              } else setReturnInfo(null);
              setExistingDocs(app.documents || []);
              loadedDb = pi.journalDb || "";
              loadedClassification = pi.journalClassification || "";
              if (loadedDb === "TCI Tier 1" || loadedDb === "TCI Tier 2") {
                loadedClassification = loadedDb.replace("TCI ", "");
                loadedDb = "TCI";
              } else if (loadedDb === "Web of Science") {
                loadedDb = "Web of Science (WoS)";
                loadedClassification = loadedClassification || pi.wosIndex || "SCIE";
              } else if (loadedDb === "Project Muse") {
                loadedDb = "Project MUSE";
              } else if (loadedDb === "SCOPUS") {
                loadedClassification = loadedClassification || pi.quartile || "Q1";
              }
              setDraft(function (d) {
                return _objectSpread(_objectSpread(_objectSpread({}, d), pi), {}, {
                  journalDb: loadedDb,
                  journalClassification: loadedClassification,
                  applicantRole: /corresponding|co-?author/i.test(pi.applicantRole || "") ? "Co-author" : "First Author",
                  pubStatus: /^accepted for publication$/i.test(pi.pubStatus || "") ? "Accepted for Publication" : pi.pubStatus || d.pubStatus,
                  academicYear: window.DB.academicYearLabel(app.academic_year || pi.academicYear || d.academicYear, pi.pubDate || pi.acceptDate),
                  joinedDate: researcherInfo.joinedDate || "",
                  pageNumber: pi.pageNumber || [pi.startPage, pi.endPage].filter(Boolean).join("–"),
                  title: app.title || "",
                  school: researcherInfo.faculty || app.faculty || d.school,
                  department: researcherInfo.department || app.department || d.department,
                  name: researcherInfo.fullName || d.name,
                  title2: researcherInfo.nameTitle || d.title2,
                  academicPosition: researcherInfo.academicPosition || d.academicPosition,
                  auId: researcherInfo.auId || d.auId,
                  email: researcherInfo.email || d.email,
                  phone: researcherInfo.phone || d.phone,
                  office: researcherInfo.officeRoom || d.office
                });
              });
              if (Array.isArray(app.co_members) && app.co_members.length) {
                setAuthors(app.co_members.map(function (a, i) {
                  return {
                    name: a.name || "",
                    type: /corresponding|co-?author/i.test(a.type || "") ? "Co-author" : "First Author",
                    email: a.email || "",
                    contribution: a.contribution === undefined || a.contribution === null ? i === 0 ? "100" : "" : String(a.contribution)
                  };
                }));
              }
              if (pi.declarations && Array.isArray(pi.declarations)) {
                accepted = !!pi.predatory && pi.declarations.every(Boolean);
                setDecls((RA.R4_DECLARATIONS || []).map(function () {
                  return accepted;
                }));
              }
              _context6.n = 7;
              break;
            case 6:
              _context6.p = 6;
              _t7 = _context6.v;
              if (!cancelled) setErr(_t7 && _t7.message || "Could not load this draft.");
            case 7:
              _context6.p = 7;
              if (!cancelled) setLoadingDraft(false);
              return _context6.f(7);
            case 8:
              return _context6.a(2);
          }
        }, _callee6, null, [[2, 6, 7, 8]]);
      }));
      return _load2.apply(this, arguments);
    }
    load();
    return function () {
      cancelled = true;
    };
  }, [applicationId]);
  var deleteExistingDoc = function deleteExistingDoc(doc) {
    var runDelete = function () {
      var _ref0 = _asyncToGenerator(_regenerator().m(function _callee7() {
        var _t8;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return window.DB.deleteDocument(doc);
            case 1:
              setExistingDocs(function (ds) {
                return ds.filter(function (d) {
                  return d.id !== doc.id;
                });
              });
              toast(doc.name + " deleted.");
              _context7.n = 3;
              break;
            case 2:
              _context7.p = 2;
              _t8 = _context7.v;
              toast("Delete error: " + (_t8 && _t8.message || _t8));
            case 3:
              return _context7.a(2);
          }
        }, _callee7, null, [[0, 2]]);
      }));
      return function runDelete() {
        return _ref0.apply(this, arguments);
      };
    }();
    if (setConfirm) setConfirm({
      kind: "danger",
      title: "Delete uploaded file?",
      message: doc.name + " will be removed from this draft and from storage.",
      confirmLabel: "Delete File",
      onConfirm: runDelete
    });else runDelete();
  };
  function save(_x4) {
    return _save2.apply(this, arguments);
  }
  function _save2() {
    _save2 = _asyncToGenerator(_regenerator().m(function _callee8(submit) {
      var lowCo, researcherSnapshot, pubInfo, app, failedUploads, _t9, _t0;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            setErr("");
            if (!submit) {
              _context8.n = 28;
              break;
            }
            if (draft.title.trim()) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2, setErr("Enter the article title."));
          case 1:
            if (draft.journal.trim()) {
              _context8.n = 2;
              break;
            }
            return _context8.a(2, setErr("Enter the journal name."));
          case 2:
            if (draft.website.trim()) {
              _context8.n = 3;
              break;
            }
            return _context8.a(2, setErr("Enter the journal website."));
          case 3:
            if (draft.issn.trim()) {
              _context8.n = 4;
              break;
            }
            return _context8.a(2, setErr("Enter the ISSN or eISSN."));
          case 4:
            if (draft.journalDb) {
              _context8.n = 5;
              break;
            }
            return _context8.a(2, setErr("Select the Journal Database / Index."));
          case 5:
            if (draft.journalClassification.trim()) {
              _context8.n = 6;
              break;
            }
            return _context8.a(2, setErr("Select or enter the journal classification."));
          case 6:
            if (!(published && !draft.articleUrl.trim())) {
              _context8.n = 7;
              break;
            }
            return _context8.a(2, setErr("Enter the Article URL for the published article."));
          case 7:
            if (!(published && !draft.pageNumber.trim())) {
              _context8.n = 8;
              break;
            }
            return _context8.a(2, setErr("Enter the Page Number(s) for the published article."));
          case 8:
            if (!(!published && !draft.acceptDate)) {
              _context8.n = 9;
              break;
            }
            return _context8.a(2, setErr("Select the Acceptance Date."));
          case 9:
            if (draft.school) {
              _context8.n = 10;
              break;
            }
            return _context8.a(2, setErr("Your faculty is required so the application routes to your Dean."));
          case 10:
            if (draft.joinedDate) {
              _context8.n = 11;
              break;
            }
            return _context8.a(2, setErr("Your account has no Date Joined AU. Ask the administrator to add it in User Management."));
          case 11:
            if (universityServiceEligibility(draft.joinedDate).eligible) {
              _context8.n = 12;
              break;
            }
            return _context8.a(2, setErr("You are not eligible yet. AU-R4 applicants must have at least one year of service at Assumption University."));
          case 12:
            if (!emailBad) {
              _context8.n = 13;
              break;
            }
            return _context8.a(2, setErr("Email must be an Assumption University address ending in @au.edu."));
          case 13:
            if (!(draft.phone && !isValidThaiPhone(draft.phone))) {
              _context8.n = 14;
              break;
            }
            return _context8.a(2, setErr("Phone must be a Thai number with 9–10 digits starting with 0."));
          case 14:
            if (draft.predatory) {
              _context8.n = 15;
              break;
            }
            return _context8.a(2, setErr("You must confirm the journal is not a predatory / Beall's List journal."));
          case 15:
            if (!turnitinBad) {
              _context8.n = 16;
              break;
            }
            return _context8.a(2, setErr("Turnitin similarity exceeds the 20% limit — it must be 20% or lower."));
          case 16:
            if (!(draft.turnitin === "")) {
              _context8.n = 17;
              break;
            }
            return _context8.a(2, setErr("Enter the Turnitin similarity percentage."));
          case 17:
            if (!(Math.round(totalContrib) !== 100)) {
              _context8.n = 18;
              break;
            }
            return _context8.a(2, setErr("Author contribution percentages must total 100% (currently " + totalContrib + "%)."));
          case 18:
            if (!(authors.filter(function (a) {
              return a.type === "First Author";
            }).length !== 1)) {
              _context8.n = 19;
              break;
            }
            return _context8.a(2, setErr("List exactly one First Author; every additional author must be a Co-author."));
          case 19:
            if (!(firstContrib < 50)) {
              _context8.n = 20;
              break;
            }
            return _context8.a(2, setErr("The first author must have at least 50% contribution."));
          case 20:
            lowCo = authors.some(function (a) {
              return Number(a.contribution) > 0 && Number(a.contribution) < 5;
            });
            if (!lowCo) {
              _context8.n = 21;
              break;
            }
            return _context8.a(2, setErr("Each listed author must have at least 5% contribution."));
          case 21:
            if (!authors.some(function (a) {
              return !a.name.trim() || !a.email.trim();
            })) {
              _context8.n = 22;
              break;
            }
            return _context8.a(2, setErr("Enter the name and email address for every listed author."));
          case 22:
            if (!(hasSecondAuthor && !hasDocument("author contribution"))) {
              _context8.n = 23;
              break;
            }
            return _context8.a(2, setErr("Attach the Author Contribution Statement for the second author."));
          case 23:
            if (!(!published && !hasDocument("acceptance"))) {
              _context8.n = 24;
              break;
            }
            return _context8.a(2, setErr("Attach the Acceptance Letter."));
          case 24:
            if (!(requested > MAX)) {
              _context8.n = 25;
              break;
            }
            return _context8.a(2, setErr("The requested claim exceeds the AU-R4 maximum of 80,000 THB per article."));
          case 25:
            if (!(tierSelected && requested <= 0)) {
              _context8.n = 26;
              break;
            }
            return _context8.a(2, setErr("Enter the publication fee for the selected journal tier."));
          case 26:
            if (!annualLimitExceeded) {
              _context8.n = 27;
              break;
            }
            return _context8.a(2, setErr("This claim exceeds your remaining " + normalizedAcademicYear + " academic-year balance. The combined AU-R3/AU-R4 limit is 100,000 THB."));
          case 27:
            if (allDecl) {
              _context8.n = 28;
              break;
            }
            return _context8.a(2, setErr("Read and accept the eligibility declaration before submitting."));
          case 28:
            setBusy(true);
            setBusyKind(submit ? "submit" : "draft");
            _context8.p = 29;
            _context8.p = 30;
            _context8.n = 31;
            return window.DB.updateMyProfile({
              full_name: draft.name,
              name_title: draft.title2,
              au_id: draft.auId,
              phone: draft.phone,
              department: draft.department,
              office_room: draft.office
            });
          case 31:
            _context8.n = 33;
            break;
          case 32:
            _context8.p = 32;
            _t9 = _context8.v;
          case 33:
            researcherSnapshot = researcherSnapshotFromDraft(draft);
            pubInfo = {
              articleType: draft.articleType,
              pubStatus: draft.pubStatus,
              journal: draft.journal,
              publisher: draft.publisher,
              website: draft.website,
              articleUrl: published ? draft.articleUrl : null,
              doi: published ? draft.doi : null,
              issn: draft.issn || null,
              acceptDate: draft.acceptDate || null,
              pubDate: draft.pubDate || null,
              volume: draft.volume,
              issue: draft.issue,
              pageNumber: draft.pageNumber,
              academicYear: normalizedAcademicYear,
              journalDb: draft.journalDb,
              journalClassification: draft.journalClassification,
              indexLabel: catLabel,
              predatory: draft.predatory,
              applicantRole: draft.applicantRole,
              researcherSnapshot: researcherSnapshot,
              researcherName: researcherSnapshot.fullName,
              researcherEmail: researcherSnapshot.email,
              researcherTitle: researcherSnapshot.nameTitle,
              researcherAuId: researcherSnapshot.auId,
              researcherPhone: researcherSnapshot.phone,
              researcherOffice: researcherSnapshot.officeRoom,
              contactEmail: researcherSnapshot.email,
              researcherJoinedDate: researcherSnapshot.joinedDate,
              feePaid: Number(draft.feePaid) || 0,
              feeDate: draft.feeDate || null,
              turnitin: Number(draft.turnitin) || 0,
              reward: requested,
              requestedClaim: requested,
              maxAmount: MAX,
              totalContribution: totalContrib,
              declarations: decls
            };
            _context8.n = 34;
            return window.DB.createApplication({
              title: draft.title,
              abstract: "AU-R4 publication reward — " + draft.journal + " (" + catLabel + ")",
              faculty: draft.school,
              department: draft.department,
              requested_amount: requested,
              duration_months: 12,
              academic_year: normalizedAcademicYear,
              grant_type: "au_r4",
              pub_info: pubInfo,
              co_members: authors.filter(function (a) {
                return (a.name || "").trim();
              })
            }, submit, editingId);
          case 34:
            app = _context8.v;
            _context8.n = 35;
            return uploadAllDocuments(app.id, files);
          case 35:
            failedUploads = _context8.v;
            if (!submit) {
              setEditingId(app.id);
              if (setSelectedApplicationId) setSelectedApplicationId(app.id);
            } else if (setSelectedApplicationId) setSelectedApplicationId(null);
            if (failedUploads.length) {
              toast(failedUploads.length + " file(s) could not be uploaded: " + failedUploads.join(", ") + ". Open the application and add them again.");
            } else {
              toast(submit ? "Application " + app.code + " submitted" : "Draft " + app.code + " saved");
            }
            navigate("r-applications");
            _context8.n = 37;
            break;
          case 36:
            _context8.p = 36;
            _t0 = _context8.v;
            setErr(_t0 && _t0.message || "Could not save the application.");
            setBusy(false);
          case 37:
            return _context8.a(2);
        }
      }, _callee8, null, [[30, 32], [29, 36]]);
    }));
    return _save2.apply(this, arguments);
  }
  if (loadingDraft) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Edit AU-R4 Application",
      desc: "Loading saved draft."
    }), React.createElement("div", {
      className: "card",
      style: {
        padding: 44,
        textAlign: "center",
        color: "var(--ink-3)"
      }
    }, "Loading draft..."));
  }
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: (editingId ? "Edit " : "Submit ") + "AU-R4 Application",
    desc: "Publication Fees and Reward Application \u2014 submit publication information, author contributions, and required documents.",
    actions: React.createElement(React.Fragment, null, React.createElement("button", {
      className: "btn btn-secondary",
      disabled: busy,
      onClick: function onClick() {
        return save(false);
      }
    }, busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"), React.createElement("button", {
      className: "btn btn-primary",
      disabled: busy || annualLimitExceeded,
      onClick: function onClick() {
        return save(true);
      }
    }, React.createElement(Icon, {
      name: "Send",
      size: 13
    }), " ", busy ? busyKind === "submit" ? files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…" : "Saving draft…" : "Submit Application"))
  }), React.createElement(ReturnNotice, {
    info: returnInfo
  }), React.createElement("div", {
    className: "mb-4"
  }, React.createElement(AnnualFundingSummaryCard, {
    summary: annualFunding,
    currentAmount: requested
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "1"), " Publication Information"), React.createElement("p", {
    className: "section-sub"
  }, "The published (or accepted) article you are claiming for."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Article Title *"), React.createElement("input", {
    value: draft.title,
    onChange: function onChange(e) {
      return upd("title", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Article Type *"), React.createElement("select", {
    value: draft.articleType,
    onChange: function onChange(e) {
      return upd("articleType", e.target.value);
    }
  }, (RA.R4_ARTICLE_TYPES || []).map(function (t) {
    return React.createElement("option", {
      key: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Publication Status *"), React.createElement("select", {
    value: draft.pubStatus,
    onChange: function onChange(e) {
      return upd("pubStatus", e.target.value);
    }
  }, (RA.R4_PUB_STATUS || []).map(function (t) {
    return React.createElement("option", {
      key: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Journal Name *"), React.createElement("input", {
    value: draft.journal,
    onChange: function onChange(e) {
      return upd("journal", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Publisher *"), React.createElement("input", {
    value: draft.publisher,
    onChange: function onChange(e) {
      return upd("publisher", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Journal Website *"), React.createElement("input", {
    value: draft.website,
    onChange: function onChange(e) {
      return upd("website", e.target.value);
    },
    placeholder: "https://\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "ISSN / eISSN *"), React.createElement("input", {
    value: draft.issn,
    onChange: function onChange(e) {
      return upd("issn", e.target.value);
    },
    placeholder: "e.g. 1234-5678"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic Year ", React.createElement("span", {
    style: {
      color: "var(--ink-3)",
      fontWeight: 700
    }
  }, "(AD)"), " *"), React.createElement("input", {
    value: draft.academicYear,
    onChange: function onChange(e) {
      return upd("academicYear", (e.target.value + "").replace(/[^0-9/]/g, "").slice(0, 9));
    },
    onBlur: function onBlur() {
      return upd("academicYear", normalizedAcademicYear);
    },
    placeholder: "2025/2026",
    inputMode: "numeric"
  })), published ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Article URL *"), React.createElement("input", {
    value: draft.articleUrl,
    onChange: function onChange(e) {
      return upd("articleUrl", e.target.value);
    },
    placeholder: "https://\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "DOI"), React.createElement("input", {
    value: draft.doi,
    onChange: function onChange(e) {
      return upd("doi", e.target.value);
    },
    placeholder: "10.xxxx/\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Publication Date *"), React.createElement(AUDatePicker, {
    value: draft.pubDate,
    onChange: function onChange(v) {
      return upd("pubDate", v);
    },
    placeholder: "Select date\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Volume *"), React.createElement("input", {
    value: draft.volume,
    onChange: function onChange(e) {
      return upd("volume", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Issue *"), React.createElement("input", {
    value: draft.issue,
    onChange: function onChange(e) {
      return upd("issue", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Page Number(s) *"), React.createElement("input", {
    value: draft.pageNumber,
    onChange: function onChange(e) {
      return upd("pageNumber", e.target.value);
    },
    placeholder: "e.g. 25\u201338"
  }))) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Acceptance Date *"), React.createElement(AUDatePicker, {
    value: draft.acceptDate,
    onChange: function onChange(v) {
      return upd("acceptDate", v);
    },
    placeholder: "Select date\u2026"
  })), React.createElement("div", {
    className: "field full"
  }, React.createElement("label", null, "Acceptance Letter *"), React.createElement("label", {
    className: "upload-box",
    style: {
      cursor: "pointer",
      display: "block"
    }
  }, React.createElement("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    style: {
      display: "none"
    },
    onChange: function onChange(e) {
      return onTypedFiles(e, "Acceptance Letter");
    }
  }), React.createElement(Icon, {
    name: "Upload",
    size: 24,
    className: "icon"
  }), React.createElement("div", {
    className: "t"
  }, "Attach acceptance letter"), React.createElement("div", {
    className: "s"
  }, "PDF \xB7 max 10 MB"))))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "2"), " Journal Classification"), React.createElement("p", {
    className: "section-sub"
  }, "Select the journal database / index and its matching classification. The research office makes the final verification."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Journal Database / Index *"), React.createElement("select", {
    value: draft.journalDb,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          journalDb: e.target.value,
          journalClassification: ""
        });
      });
    }
  }, React.createElement("option", {
    value: ""
  }, "Select database / index\u2026"), (RA.R4_JOURNAL_DBS || []).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Classification *"), classificationOptions ? React.createElement("select", {
    value: draft.journalClassification,
    onChange: function onChange(e) {
      return upd("journalClassification", e.target.value);
    },
    disabled: !draft.journalDb
  }, React.createElement("option", {
    value: ""
  }, "Select classification\u2026"), classificationOptions.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  })) : React.createElement("input", {
    value: draft.journalClassification,
    onChange: function onChange(e) {
      return upd("journalClassification", e.target.value);
    },
    disabled: !draft.journalDb,
    placeholder: draft.journalDb === "Other" ? "Enter database / index name manually" : draft.journalDb ? "Enter additional tier" : "Select a database / index first"
  }))), showPreliminaryReward && React.createElement("div", {
    className: "r4-reward-estimate"
  }, React.createElement("div", {
    className: "r4-reward-estimate-head"
  }, React.createElement("div", {
    className: "r4-reward-estimate-label"
  }, React.createElement(Icon, {
    name: "Award",
    size: 20
  }), " Preliminary reward estimate (", catLabel, ")"), React.createElement("div", {
    className: "r4-reward-estimate-amount"
  }, automaticReward > 0 ? fmtBaht(automaticReward) : "Pending IRAS verification")), React.createElement("p", null, "This is a preliminary estimate only. The final eligible amount will be determined by IRAS after verifying the journal, documents, publication fee, author contribution, and previous claims. Maximum 80,000 THB per article.")))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "3"), " Author and Contribution Information"), React.createElement("p", {
    className: "section-sub"
  }, "Provide the First Author and any Co-author. Contributions must total 100%; the First Author needs \u2265 50%. With two authors, changing one percentage automatically balances the other."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Your Author Role *"), React.createElement("select", {
    value: draft.applicantRole,
    onChange: function onChange(e) {
      return upd("applicantRole", e.target.value);
    }
  }, (RA.R4_APPLICANT_ROLES || []).map(function (t) {
    return React.createElement("option", {
      key: t
    }, t);
  })))), React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)"
    }
  }, React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Author Name"), React.createElement("th", {
    style: {
      width: 190
    }
  }, "Role"), React.createElement("th", null, "Author Email Address"), React.createElement("th", {
    style: {
      width: 100,
      textAlign: "right"
    }
  }, "Contrib %"), React.createElement("th", {
    style: {
      width: 100
    }
  }, "Action"))), React.createElement("tbody", null, authors.map(function (a, i) {
    return React.createElement("tr", {
      key: i
    }, React.createElement("td", null, React.createElement("input", {
      value: a.name,
      onChange: function onChange(e) {
        return setAuthor(i, "name", e.target.value);
      },
      placeholder: "Full name",
      style: {
        width: "100%",
        minWidth: 130
      }
    })), React.createElement("td", null, React.createElement("select", {
      value: a.type,
      onChange: function onChange(e) {
        return setAuthor(i, "type", e.target.value);
      },
      style: {
        width: "100%"
      }
    }, (RA.R4_AUTHOR_TYPES || []).map(function (t) {
      return React.createElement("option", {
        key: t,
        value: t
      }, t);
    }))), React.createElement("td", null, React.createElement("input", {
      type: "email",
      value: a.email,
      onChange: function onChange(e) {
        return setAuthor(i, "email", e.target.value);
      },
      placeholder: "author@example.com",
      style: {
        width: "100%",
        minWidth: 170
      }
    })), React.createElement("td", {
      style: {
        textAlign: "right"
      }
    }, React.createElement("input", {
      value: a.contribution,
      onChange: function onChange(e) {
        return setAuthor(i, "contribution", e.target.value);
      },
      style: {
        width: 64,
        textAlign: "right"
      }
    })), React.createElement("td", {
      style: {
        textAlign: "center"
      }
    }, React.createElement("button", {
      type: "button",
      className: "btn btn-ghost btn-sm",
      onClick: function onClick() {
        return removeAuthor(i);
      },
      disabled: authors.length === 1,
      "aria-label": "Remove author " + (i + 1)
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }), " Remove")));
  }), React.createElement("tr", {
    style: {
      background: "var(--paper-warm)",
      fontWeight: 600
    }
  }, React.createElement("td", {
    colSpan: "3"
  }, "Total contribution"), React.createElement("td", {
    style: {
      textAlign: "right",
      color: Math.round(totalContrib) === 100 ? "var(--status-approved)" : "var(--au-crimson)"
    }
  }, totalContrib, "%"), React.createElement("td", null))))), React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm mt-1",
    onClick: addAuthor
  }, React.createElement(Icon, {
    name: "Plus",
    size: 13
  }), " Add author"), hasSecondAuthor && React.createElement("div", {
    className: "field full",
    style: {
      marginTop: 14
    }
  }, React.createElement("label", null, "Author Contribution File *"), React.createElement("label", {
    className: "upload-box",
    style: {
      cursor: "pointer",
      display: "block"
    }
  }, React.createElement("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    style: {
      display: "none"
    },
    onChange: function onChange(e) {
      return onTypedFiles(e, "Author Contribution Statement");
    }
  }), React.createElement(Icon, {
    name: contributionExistingDocs.length || contributionFiles.length ? "FileCheck" : "Upload",
    size: 24,
    className: "icon"
  }), React.createElement("div", {
    className: "t"
  }, contributionExistingDocs.length || contributionFiles.length ? "Attach updated author contribution statement" : "Attach author contribution statement"), React.createElement("div", {
    className: "s"
  }, "PDF \xB7 max 10 MB")), (contributionExistingDocs.length > 0 || contributionFiles.length > 0) && React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      marginTop: 10,
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      padding: "9px 13px",
      background: "var(--paper-warm)",
      borderBottom: "1px solid var(--line-2)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Author Contribution Statement"), contributionExistingDocs.map(function (d) {
    return React.createElement("div", {
      className: "file-row",
      key: d.id || d.name
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, d.name), React.createElement("div", {
      className: "fs"
    }, d.size || "PDF", " \xB7 Uploaded ", d.uploadedAt || "-")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onView(d);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 13
    }), " View"), React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onDownload(d);
      }
    }, React.createElement(Icon, {
      name: "Download",
      size: 13
    }), " Download"), React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteExistingDoc(d);
      }
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }), " Delete")));
  }), contributionFiles.map(function (it) {
    var fileIndex = files.indexOf(it);
    return React.createElement("div", {
      className: "file-row",
      key: fileIndex
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, it.file.name), React.createElement("div", {
      className: "fs"
    }, (it.file.size / 1024).toFixed(0), " KB \xB7 ready to upload")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return setFiles(function (fs) {
          return fs.filter(function (_, index) {
            return index !== fileIndex;
          });
        });
      }
    }, React.createElement(Icon, {
      name: "X",
      size: 13
    }), " Remove")));
  }))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "4"), " Researcher Information"), React.createElement("p", {
    className: "section-sub"
  }, "Identity details come from your account. You may update your academic title, position, phone, and office / room here."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic Title"), React.createElement("select", {
    value: draft.title2,
    onChange: function onChange(e) {
      return upd("title2", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select title\u2026"), RA.AU_TITLES.map(function (t) {
    return React.createElement("option", {
      key: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Academic / Administrative Position"), React.createElement("select", {
    value: draft.academicPosition,
    onChange: function onChange(e) {
      return upd("academicPosition", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select position\u2026"), (RA.AU_ACADEMIC_POSITIONS || []).map(function (position) {
    return React.createElement("option", {
      key: position,
      value: position
    }, position);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Full Name"), React.createElement("input", {
    value: draft.name,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "AU ID"), React.createElement("input", {
    value: draft.auId,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Email (AU only)"), React.createElement("input", {
    type: "email",
    value: draft.email,
    readOnly: true,
    style: roStyle
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Phone"), React.createElement(ThaiPhoneInput, {
    value: draft.phone,
    onChange: function onChange(value) {
      return upd("phone", value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Office / Room"), React.createElement("input", {
    value: draft.office,
    onChange: function onChange(e) {
      return upd("office", e.target.value);
    }
  })), React.createElement(UniversityJoinedDateField, {
    value: draft.joinedDate,
    onChange: function onChange(v) {
      return upd("joinedDate", v);
    },
    readOnly: true
  }), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Faculty"), React.createElement("select", {
    value: facultyValid ? draft.school : "",
    disabled: true,
    style: roStyle
  }, React.createElement("option", {
    value: ""
  }, "Select your faculty\u2026"), RA.FACULTIES.map(function (f) {
    return React.createElement("option", {
      key: f.code,
      value: f.name
    }, f.name);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Department"), React.createElement("select", {
    value: deptValid ? draft.department : "",
    disabled: true,
    style: roStyle
  }, React.createElement("option", {
    value: ""
  }, draft.school ? "Select department…" : "Select a faculty first"), (RA.FACULTIES.find(function (f) {
    return f.name === draft.school;
  }) || {
    departments: []
  }).departments.map(function (d) {
    return React.createElement("option", {
      key: d
    }, d);
  })))))), tierSelected && React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "5"), " Publication Fee and Claim Information"), React.createElement("p", {
    className: "section-sub"
  }, "The final eligible amount is decided by the research office after verification."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Publication Fee (THB) *"), React.createElement("input", {
    value: draft.feePaid === "" ? "" : Number(draft.feePaid || 0).toLocaleString(),
    onChange: function onChange(e) {
      return upd("feePaid", (e.target.value + "").replace(/[^0-9]/g, ""));
    },
    placeholder: "Enter publication fee manually",
    inputMode: "numeric"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Payment Date"), React.createElement(AUDatePicker, {
    value: draft.feeDate,
    onChange: function onChange(v) {
      return upd("feeDate", v);
    },
    placeholder: "Select date\u2026"
  }))))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, React.createElement("span", {
    className: "num"
  }, "6"), " Required Documents"), React.createElement("p", {
    className: "section-sub"
  }, "Upload the supporting documents required for Dean and IRAS review."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    className: "form-grid",
    style: {
      marginBottom: 10
    }
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Turnitin Similarity % *"), React.createElement("input", {
    value: draft.turnitin,
    onChange: function onChange(e) {
      return upd("turnitin", (e.target.value + "").replace(/[^0-9.]/g, ""));
    },
    placeholder: "e.g. 12",
    style: turnitinBad ? {
      borderColor: "var(--au-crimson)",
      color: "var(--au-crimson)"
    } : null
  }), turnitinBad && React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--au-crimson)",
      marginTop: 4
    }
  }, "Exceeds the 20% limit \u2014 submission is blocked."))), React.createElement("div", {
    style: {
      background: "var(--paper-warm)",
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      padding: "12px 14px",
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 8,
      color: "var(--ink-2)"
    }
  }, "Required for an AU-R4 claim:"), React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.7
    }
  }, React.createElement("li", null, React.createElement("b", null, "Full Research Article"), " \u2014 the full published article"), !published && React.createElement("li", null, React.createElement("b", null, "Acceptance Letter"), " \u2014 required for an accepted article"), hasSecondAuthor && React.createElement("li", null, React.createElement("b", null, "Author Contribution Statement"), " \u2014 required when a second author is listed"), React.createElement("li", null, React.createElement("b", null, "Turnitin Report"), " \u2014 similarity \u2264 20%"), React.createElement("li", null, React.createElement("b", null, "Original Publication Fee Receipt")))), otherExistingDocs.length > 0 && React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      marginBottom: 12
    }
  }, otherExistingDocs.map(function (d) {
    return React.createElement("div", {
      className: "file-row",
      key: d.id || d.name
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, safeDocumentDisplayName(d), d.doc_type && safeDocumentDisplayName(d) !== d.doc_type && React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 10,
        fontWeight: 700,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)",
        padding: "2px 8px",
        borderRadius: 999
      }
    }, d.doc_type)), React.createElement("div", {
      className: "fs"
    }, d.size || "PDF", " - Uploaded ", d.uploadedAt || "-")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onView(d);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 13
    }), " View"), React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onDownload(d);
      }
    }, React.createElement(Icon, {
      name: "Download",
      size: 13
    }), " Download"), React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteExistingDoc(d);
      }
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }), " Delete")));
  })), otherFiles.length > 0 && React.createElement("div", {
    style: {
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      marginBottom: 12
    }
  }, otherFiles.map(function (it) {
    var fileIndex = files.indexOf(it);
    return React.createElement("div", {
      className: "file-row",
      key: fileIndex
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, it.file.name, it.docType && React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 10,
        fontWeight: 700,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)",
        padding: "2px 8px",
        borderRadius: 999
      }
    }, it.docType)), React.createElement("div", {
      className: "fs"
    }, (it.file.size / 1024).toFixed(0), " KB \xB7 ready to upload")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return setFiles(function (fs) {
          return fs.filter(function (_, index) {
            return index !== fileIndex;
          });
        });
      }
    }, React.createElement(Icon, {
      name: "X",
      size: 13
    }), " Remove")));
  })), React.createElement("div", {
    className: "field",
    style: {
      maxWidth: 360,
      marginBottom: 10
    }
  }, React.createElement("label", null, "Document type for the next upload"), React.createElement("select", {
    value: docType,
    onChange: function onChange(e) {
      return setDocType(e.target.value);
    }
  }, (RA.R4_DOC_TYPES || RA.DOC_TYPES).filter(function (t) {
    return hasSecondAuthor || !/author contribution/i.test(t);
  }).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("label", {
    className: "upload-box mt-1",
    style: {
      cursor: "pointer",
      display: "block"
    }
  }, React.createElement("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    multiple: true,
    style: {
      display: "none"
    },
    onChange: onFiles
  }), React.createElement(Icon, {
    name: "Upload",
    size: 26,
    className: "icon"
  }), React.createElement("div", {
    className: "t"
  }, "Click to upload your ", React.createElement("b", null, docType)), React.createElement("div", {
    className: "s"
  }, "PDF \xB7 max 10 MB per file")))), React.createElement("div", {
    className: "form-section"
  }, React.createElement("h4", null, "Eligibility Declaration"), React.createElement("p", {
    className: "section-sub"
  }, "Please read these AU-R4 eligibility rules before submitting your claim."), React.createElement("div", {
    className: "section-body"
  }, React.createElement("div", {
    style: {
      background: "var(--paper-warm)",
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      padding: "14px 16px",
      color: "var(--ink-2)",
      fontSize: 13,
      lineHeight: 1.7
    }
  }, (RA.R4_DECLARATIONS || []).map(function (d, i) {
    return React.createElement("div", {
      key: i,
      style: {
        padding: i ? "8px 0 0" : 0
      }
    }, i === 2 ? React.createElement(React.Fragment, null, "The journal is not predatory and is not listed in ", React.createElement("a", {
      href: "https://beallslist.net/",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Beall's List"), ".") : d);
  })), React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginTop: 16,
      padding: "13px 14px",
      border: "1px solid var(--au-gold)",
      borderRadius: "var(--r-md)",
      background: "var(--au-gold-soft)",
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1.55,
      cursor: "pointer"
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked: allDecl,
    onChange: function onChange(e) {
      var accepted = e.target.checked;
      upd("predatory", accepted);
      setDecls(function (s) {
        return s.map(function () {
          return accepted;
        });
      });
    },
    style: {
      accentColor: "var(--au-crimson)",
      marginTop: 3
    }
  }), React.createElement("span", null, "I have read and understand these AU-R4 rules. I confirm that the information and documents in this application are true, accurate, complete, and eligible for this claim. *")))), React.createElement("div", {
    style: {
      padding: "16px 24px",
      borderTop: "1px solid var(--line)",
      background: "var(--paper-warm)",
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, err && React.createElement("div", {
    style: {
      color: "var(--au-crimson)",
      fontSize: 12,
      alignSelf: "center",
      marginRight: "auto"
    }
  }, err), React.createElement("button", {
    className: "btn btn-secondary",
    disabled: busy,
    onClick: function onClick() {
      return save(false);
    }
  }, busy && busyKind === "draft" ? "Saving draft…" : "Save as Draft"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: busy || !allDecl || turnitinBad || annualLimitExceeded,
    onClick: function onClick() {
      return save(true);
    }
  }, React.createElement(Icon, {
    name: "Send",
    size: 13
  }), " ", busy ? busyKind === "submit" ? files.length ? "Uploading " + files.length + " file(s)…" : "Submitting…" : "Saving draft…" : "Submit Application"))));
}
function ResearcherApplications(_ref1) {
  var navigate = _ref1.navigate,
    onDownload = _ref1.onDownload,
    openDetail = _ref1.openDetail,
    openDraft = _ref1.openDraft,
    setSelectedApplicationId = _ref1.setSelectedApplicationId,
    grantType = _ref1.grantType,
    toast = _ref1.toast,
    setConfirm = _ref1.setConfirm,
    onGrantSwitch = _ref1.onGrantSwitch;
  var sys = grantSystemFor(grantType || "au_r3");
  var _useState57 = useState(null),
    _useState58 = _slicedToArray(_useState57, 2),
    myApps = _useState58[0],
    setMyApps = _useState58[1];
  var _useState59 = useState(""),
    _useState60 = _slicedToArray(_useState59, 2),
    searchTerm = _useState60[0],
    setSearchTerm = _useState60[1];
  var _useState61 = useState("all"),
    _useState62 = _slicedToArray(_useState61, 2),
    statusFilter = _useState62[0],
    setStatusFilter = _useState62[1];
  var loadApplications = function () {
    var _ref10 = _asyncToGenerator(_regenerator().m(function _callee9() {
      var apps, _t1;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            _context9.n = 1;
            return window.DB.myApplications(grantType || undefined);
          case 1:
            apps = _context9.v;
            setMyApps(apps.map(function (a) {
              var decisionEvents = (a.events || []).filter(function (event) {
                return event.to_status === a.status && ["returned", "rejected"].includes(a.status);
              });
              decisionEvents.sort(function (x, y) {
                return new Date(y.created_at || 0) - new Date(x.created_at || 0);
              });
              var decision = decisionEvents[0] || null;
              return {
                id: a.code,
                _uuid: a.id,
                title: a.title,
                faculty: a.faculty,
                department: a.department,
                submittedAt: a.submitted_at ? window.DB.fmtDate(a.submitted_at) : "—",
                stage: (a.statusBadge || window.DB.statusBadge(a.status, a.grant_type)).label,
                status: a.statusBadge || window.DB.statusBadge(a.status, a.grant_type),
                statusKey: a.status,
                grantType: a.grant_type,
                grantCode: grantSystemFor(a.grant_type || "au_r3").code,
                decisionReason: decision && String(decision.note || "").trim(),
                decisionRole: decision && decision.actor_role
              };
            }));
            _context9.n = 3;
            break;
          case 2:
            _context9.p = 2;
            _t1 = _context9.v;
            setMyApps([]);
          case 3:
            return _context9.a(2);
        }
      }, _callee9, null, [[0, 2]]);
    }));
    return function loadApplications() {
      return _ref10.apply(this, arguments);
    };
  }();
  useEffect(function () {
    setMyApps(null);
    loadApplications();
  }, [grantType]);
  var listedApplications = myApps || [];
  var visibleApplications = listedApplications.filter(function (application) {
    var query = searchTerm.trim().toLowerCase();
    var matchesSearch = !query || [application.id, application.title, application.stage, application.faculty].some(function (value) {
      return String(value || "").toLowerCase().includes(query);
    });
    var matchesStatus = statusFilter === "all" || statusFilter === "open" && !["completed", "rejected"].includes(application.statusKey) || application.statusKey === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "My Applications",
    desc: sys.code + " · " + sys.name + " — your submissions across academic years.",
    actions: React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        if (setSelectedApplicationId) setSelectedApplicationId(null);
        navigate("r-submit");
      }
    }, React.createElement(Icon, {
      name: "Plus",
      size: 14
    }), " New Application")
  }), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "toolbar"
  }, React.createElement("div", {
    className: "search"
  }, React.createElement(Icon, {
    name: "Search",
    size: 14,
    className: "icon"
  }), React.createElement("input", {
    value: searchTerm,
    onChange: function onChange(event) {
      return setSearchTerm(event.target.value);
    },
    placeholder: "Search by title, ID, or stage\u2026"
  })), React.createElement("label", {
    className: "filter"
  }, React.createElement(Icon, {
    name: "Filter",
    size: 12
  }), React.createElement("select", {
    value: statusFilter,
    onChange: function onChange(event) {
      return setStatusFilter(event.target.value);
    },
    "aria-label": "Filter applications by status",
    style: {
      border: 0,
      background: "transparent",
      color: "inherit",
      font: "inherit",
      cursor: "pointer",
      outline: "none"
    }
  }, React.createElement("option", {
    value: "all"
  }, "Status: All"), React.createElement("option", {
    value: "open"
  }, "In progress"), React.createElement("option", {
    value: "completed"
  }, "Completed"), React.createElement("option", {
    value: "rejected"
  }, "Rejected"), React.createElement("option", {
    value: "returned"
  }, "Returned"), React.createElement("option", {
    value: "draft"
  }, "Draft"))), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "Download",
    size: 12
  }), " Export CSV")), React.createElement("table", {
    className: "tbl my-applications-table"
  }, React.createElement("colgroup", null, React.createElement("col", {
    className: "app-col-id"
  }), React.createElement("col", {
    className: "app-col-title"
  }), React.createElement("col", {
    className: "app-col-submitted"
  }), React.createElement("col", {
    className: "app-col-stage"
  }), React.createElement("col", {
    className: "app-col-status"
  }), React.createElement("col", {
    className: "app-col-actions"
  })), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), React.createElement("th", null, "Research Title"), React.createElement("th", null, "Submitted"), React.createElement("th", null, "Current Stage"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, myApps === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading your applications\u2026")), myApps && visibleApplications.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, listedApplications.length ? "No applications match this search or status." : "No applications yet — click \"New Application\" to submit your first.")), visibleApplications.map(function (a) {
    return React.createElement("tr", {
      key: a.id
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t"
    }, a.title), React.createElement("div", {
      className: "s"
    }, (a.faculty || "—") + (a.department ? " · " + a.department : "")), a.decisionReason && React.createElement("div", {
      style: {
        color: "var(--au-crimson)",
        fontSize: 11.5,
        marginTop: 4,
        maxWidth: 520
      }
    }, React.createElement("strong", null, a.statusKey === "rejected" ? "Rejection reason" : "Revision reason", ":"), " ", a.decisionReason)), React.createElement("td", null, a.submittedAt), React.createElement("td", null, a.stage), React.createElement("td", null, React.createElement(Badge, {
      status: a.status
    })), React.createElement("td", {
      className: "app-actions-cell"
    }, React.createElement(React.Fragment, null, React.createElement("div", {
      className: "app-actions"
    }, React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: function onClick() {
        return a.statusKey === "draft" || a.statusKey === "returned" ? openDraft && openDraft(a._uuid) : openDetail && openDetail(a._uuid);
      }
    }, React.createElement(Icon, {
      name: a.statusKey === "draft" || a.statusKey === "returned" ? "Edit3" : "Eye",
      size: 13
    }), " ", a.statusKey === "draft" || a.statusKey === "returned" ? "Edit" : a.statusKey === "completed" ? "View & Timeline" : "View"), React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: function onClick() {
        return openDetail && openDetail(a._uuid);
      }
    }, React.createElement(Icon, {
      name: "FolderOpen",
      size: 13
    }), " Files")))));
  })))));
}
function ResearcherApplicationDetail(_ref11) {
  var applicationId = _ref11.applicationId,
    navigate = _ref11.navigate,
    onDownload = _ref11.onDownload,
    onView = _ref11.onView,
    toast = _ref11.toast,
    setConfirm = _ref11.setConfirm;
  var _useState63 = useState(null),
    _useState64 = _slicedToArray(_useState63, 2),
    app = _useState64[0],
    setApp = _useState64[1];
  var _useState65 = useState(true),
    _useState66 = _slicedToArray(_useState65, 2),
    loading = _useState66[0],
    setLoading = _useState66[1];
  var _useState67 = useState(false),
    _useState68 = _slicedToArray(_useState67, 2),
    busy = _useState68[0],
    setBusy = _useState68[1];
  var canEditDocs = app && app.is_owner !== false && ["draft", "submitted", "returned"].includes(app.status);
  var load = function () {
    var _ref12 = _asyncToGenerator(_regenerator().m(function _callee0() {
      var id, apps, _t10, _t11;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            setLoading(true);
            _context0.p = 1;
            id = applicationId;
            if (id) {
              _context0.n = 3;
              break;
            }
            _context0.n = 2;
            return window.DB.myApplications();
          case 2:
            apps = _context0.v;
            id = apps && apps[0] && apps[0].id;
          case 3:
            if (id) {
              _context0.n = 4;
              break;
            }
            setApp(null);
            return _context0.a(2);
          case 4:
            _t10 = setApp;
            _context0.n = 5;
            return window.DB.applicationDetail(id);
          case 5:
            _t10(_context0.v);
            _context0.n = 7;
            break;
          case 6:
            _context0.p = 6;
            _t11 = _context0.v;
            setApp(null);
          case 7:
            _context0.p = 7;
            setLoading(false);
            return _context0.f(7);
          case 8:
            return _context0.a(2);
        }
      }, _callee0, null, [[1, 6, 7, 8]]);
    }));
    return function load() {
      return _ref12.apply(this, arguments);
    };
  }();
  useEffect(function () {
    load();
  }, [applicationId]);
  var uploadMore = function () {
    var _ref13 = _asyncToGenerator(_regenerator().m(function _callee1(event) {
      var files, _i, _files, file, _t12;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            files = Array.from(event.target.files || []);
            event.target.value = "";
            if (!(!files.length || !app || busy)) {
              _context1.n = 1;
              break;
            }
            return _context1.a(2);
          case 1:
            setBusy(true);
            _context1.p = 2;
            _i = 0, _files = files;
          case 3:
            if (!(_i < _files.length)) {
              _context1.n = 5;
              break;
            }
            file = _files[_i];
            _context1.n = 4;
            return window.DB.uploadDocument(app.id, file, null);
          case 4:
            _i++;
            _context1.n = 3;
            break;
          case 5:
            toast(files.length + " file(s) uploaded.");
            _context1.n = 6;
            return load();
          case 6:
            _context1.n = 8;
            break;
          case 7:
            _context1.p = 7;
            _t12 = _context1.v;
            toast("Upload error: " + (_t12 && _t12.message || _t12));
          case 8:
            _context1.p = 8;
            setBusy(false);
            return _context1.f(8);
          case 9:
            return _context1.a(2);
        }
      }, _callee1, null, [[2, 7, 8, 9]]);
    }));
    return function uploadMore(_x5) {
      return _ref13.apply(this, arguments);
    };
  }();
  var deleteDoc = function deleteDoc(doc) {
    if (!canEditDocs) return;
    setConfirm({
      kind: "danger",
      title: "Delete uploaded file?",
      message: doc.name + " will be removed from this application and from storage.",
      confirmLabel: "Delete File",
      onConfirm: function () {
        var _onConfirm = _asyncToGenerator(_regenerator().m(function _callee10() {
          var _t13;
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.p = _context10.n) {
              case 0:
                _context10.p = 0;
                _context10.n = 1;
                return window.DB.deleteDocument(doc);
              case 1:
                toast(doc.name + " deleted.");
                _context10.n = 2;
                return load();
              case 2:
                _context10.n = 4;
                break;
              case 3:
                _context10.p = 3;
                _t13 = _context10.v;
                toast("Delete error: " + (_t13 && _t13.message || _t13));
              case 4:
                return _context10.a(2);
            }
          }, _callee10, null, [[0, 3]]);
        }));
        function onConfirm() {
          return _onConfirm.apply(this, arguments);
        }
        return onConfirm;
      }()
    });
  };
  if (loading) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Application Detail",
      desc: "Loading submitted application."
    }), React.createElement("div", {
      className: "card",
      style: {
        padding: 44,
        textAlign: "center",
        color: "var(--ink-3)"
      }
    }, "Loading..."));
  }
  if (!app) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Application Detail",
      desc: "No application selected."
    }), React.createElement("div", {
      className: "card"
    }, React.createElement(Empty, {
      title: "No application selected",
      desc: "Open an application from My Applications.",
      icon: "Folder"
    })));
  }
  var docs = app.documents || [];
  var budgetRows = Array.isArray(app.budget_breakdown) ? app.budget_breakdown : [];
  var applicationContact = app.grant_type === "au_r3" ? app.conference_info || {} : app.pub_info || {};
  var researcherName = app.researcher && app.researcher.full_name || applicationContact.researcherName || "Researcher";
  var researcherEmail = app.researcher && app.researcher.email || applicationContact.researcherEmail || applicationContact.contactEmail || "-";
  var applicantAuthorRole = app.grant_type === "au_r4" && app.pub_info && app.pub_info.applicantRole ? app.pub_info.applicantRole : app.grant_type === "au_r3" && app.conference_info && app.conference_info.authorType ? app.conference_info.authorType : "Lead Author";
  var ownerParticipant = {
    id: "owner",
    name: researcherName,
    email: researcherEmail,
    authorRole: applicantAuthorRole
  };
  var listedAuthorParticipants = (app.co_members || []).map(function (member, index) {
    return {
      id: "author-" + index,
      name: member.name || member.email || "Researcher",
      email: member.email || "",
      authorRole: member.authorType || member.type || member.kind || "Co-author"
    };
  });
  var authorParticipants = app.grant_type === "au_r4" && listedAuthorParticipants.length ? listedAuthorParticipants : [ownerParticipant].concat(listedAuthorParticipants);
  var status = app.statusBadge || window.DB.statusBadge(app.status, app.grant_type);
  var joinedDate = researcherJoinedDate(app);
  var service = universityServiceEligibility(joinedDate);
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: app.title,
    desc: (app.code || "Application") + " - Submitted " + window.DB.fmtDate(app.submitted_at || app.created_at),
    actions: React.createElement(React.Fragment, null, React.createElement(Badge, {
      status: status
    }), ["draft", "returned"].includes(app.status) && React.createElement("button", {
      className: "btn btn-secondary",
      onClick: function onClick() {
        return navigate("r-submit", {
          keepSelection: true
        });
      }
    }, React.createElement(Icon, {
      name: "Edit3",
      size: 13
    }), " ", app.status === "returned" ? "Edit & Resubmit" : "Edit Draft"))
  }), React.createElement(ApplicationDecisionNotice, {
    app: app
  }), React.createElement("div", {
    className: "grid-2"
  }, React.createElement("div", null, React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, app.grant_type === "au_r3" ? "Research Paper Information" : "Research Information")), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, app.grant_type === "au_r3" ? "Paper title" : "Research title"), React.createElement("span", {
    className: "r"
  }, app.title)), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Field / discipline"), React.createElement("span", {
    className: "r"
  }, app.field || "-")), app.grant_type === "au_r3" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "eyebrow mt-4 mb-2"
  }, "Abstract"), React.createElement("p", {
    style: {
      margin: 0,
      lineHeight: 1.65,
      color: "var(--ink-2)"
    }
  }, app.conference_info && app.conference_info.paperAbstract || "No abstract entered.")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Keywords"), React.createElement("span", {
    className: "r"
  }, app.keywords || "-")), app.grant_type !== "au_r3" && React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Duration"), React.createElement("span", {
    className: "r"
  }, app.duration_months || 12, " months")), React.createElement("div", {
    className: "eyebrow mt-4 mb-2"
  }, "Expected outcomes / summary"), React.createElement("p", {
    style: {
      margin: 0,
      lineHeight: 1.65,
      color: "var(--ink-2)"
    }
  }, app.abstract || "No summary entered."))), React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Researcher & Routing")), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Principal researcher"), React.createElement("span", {
    className: "r"
  }, researcherName)), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Email"), React.createElement("span", {
    className: "r"
  }, researcherEmail)), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Faculty"), React.createElement("span", {
    className: "r"
  }, app.faculty || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Department"), React.createElement("span", {
    className: "r"
  }, app.department || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Joined Assumption University"), React.createElement("span", {
    className: "r"
  }, joinedDate ? window.DB.fmtDate(joinedDate) + " · " + service.months + " months" : "Not recorded")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Service eligibility"), React.createElement("span", {
    className: "r",
    style: {
      color: joinedDate && service.eligible ? "var(--status-approved)" : "var(--au-crimson)"
    }
  }, joinedDate ? service.eligible ? "Eligible" : "Not eligible until " + fmtNiceDate(service.eligibleOn) : "Not recorded")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Requested amount"), React.createElement("span", {
    className: "r"
  }, fmtBaht(Number(app.requested_amount || 0)))), (app.grant_type === "au_r3" || app.grant_type === "au_r4") && React.createElement("div", {
    style: {
      marginTop: 8,
      borderTop: "1px solid var(--line-2)",
      paddingTop: 8
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Authors"), authorParticipants.map(function (member, i) {
    return React.createElement("div", {
      className: "meta-row",
      key: member.id || i
    }, React.createElement("span", {
      className: "l"
    }, member.authorRole || "Author"), React.createElement("span", {
      className: "r"
    }, member.name, member.email && member.email !== "-" ? " · " + member.email : ""));
  })), app.conference_info && React.createElement("div", {
    style: {
      marginTop: 8,
      borderTop: "1px solid var(--line-2)",
      paddingTop: 8
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Conference (AU-R3)"), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Conference"), React.createElement("span", {
    className: "r"
  }, app.conference_info.confName || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Organizer"), React.createElement("span", {
    className: "r"
  }, app.conference_info.organizer || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Conference type"), React.createElement("span", {
    className: "r"
  }, app.conference_info.confType || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Conference location"), React.createElement("span", {
    className: "r"
  }, app.conference_info.conferenceLocation || [app.conference_info.city, app.conference_info.country].filter(Boolean).join(", ") || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Presentation date"), React.createElement("span", {
    className: "r"
  }, app.conference_info.presentationDate || app.conference_info.confStart ? fmtNiceDate(app.conference_info.presentationDate || app.conference_info.confStart) : "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Presentation"), React.createElement("span", {
    className: "r"
  }, app.conference_info.presentation || "Oral Presentation")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Conference Database / Index"), React.createElement("span", {
    className: "r"
  }, app.conference_info.journalDb || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Qualities"), React.createElement("span", {
    className: "r"
  }, app.conference_info.journalClassification || "-"))), app.pub_info && React.createElement("div", {
    style: {
      marginTop: 8,
      borderTop: "1px solid var(--line-2)",
      paddingTop: 8
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Publication (AU-R4)"), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Journal"), React.createElement("span", {
    className: "r"
  }, app.pub_info.journal || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Indexing"), React.createElement("span", {
    className: "r"
  }, app.pub_info.indexLabel || app.pub_info.indexType || "-", app.pub_info.quartile ? " · " + app.pub_info.quartile : "")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Classification"), React.createElement("span", {
    className: "r"
  }, app.pub_info.journalClassification || app.pub_info.openAccess || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Status"), React.createElement("span", {
    className: "r"
  }, app.pub_info.pubStatus || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Publication fee"), React.createElement("span", {
    className: "r"
  }, fmtBaht(Number(app.pub_info.feePaid || app.pub_info.feeAmount || 0)))), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Requested amount"), React.createElement("span", {
    className: "r"
  }, fmtBaht(Number(app.pub_info.reward || app.requested_amount || 0))))))), React.createElement("div", {
    className: "card mb-4"
  }, React.createElement(ReviewCommentHistory, {
    app: app,
    roles: ["dean", "iras"]
  })), React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, app.grant_type === "au_r3" ? "Grant Amount" : "Budget Breakdown")), React.createElement("div", {
    className: "card-body",
    style: {
      padding: 0
    }
  }, budgetRows.length === 0 && React.createElement("div", {
    style: {
      padding: 20,
      color: "var(--ink-3)"
    }
  }, app.grant_type === "au_r3" ? "Fixed AU-R3 grant: 3,500 THB." : "No budget breakdown entered."), budgetRows.length > 0 && React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Item"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Amount"))), React.createElement("tbody", null, budgetRows.map(function (b, i) {
    return React.createElement("tr", {
      key: i
    }, React.createElement("td", null, b.item), React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace"
      }
    }, fmtBaht(Number(b.amount || 0))));
  }))))), React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Submitted Documents"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "text-sm text-muted"
  }, docs.length, " uploaded")), React.createElement("div", null, docs.length === 0 && React.createElement(Empty, {
    title: "No uploaded documents",
    desc: "Uploaded researcher files will appear here.",
    icon: "FileText"
  }), docs.map(function (d) {
    return React.createElement("div", {
      className: "file-row",
      key: d.id || d.name
    }, React.createElement("div", {
      className: "ficon"
    }, React.createElement(Icon, {
      name: "FileText",
      size: 18
    })), React.createElement("div", {
      className: "fmeta"
    }, React.createElement("div", {
      className: "fn"
    }, safeDocumentDisplayName(d)), React.createElement("div", {
      className: "fs"
    }, d.size || "PDF", " - Uploaded ", d.uploadedAt || "-")), React.createElement("div", {
      className: "factions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onView(d);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 13
    }), " View"), React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onDownload(d);
      }
    }, React.createElement(Icon, {
      name: "Download",
      size: 13
    }), " Download"), canEditDocs && React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteDoc(d);
      }
    }, React.createElement(Icon, {
      name: "Trash2",
      size: 13
    }), " Delete")));
  })), canEditDocs && React.createElement("div", {
    className: "card-body",
    style: {
      borderTop: "1px solid var(--line-2)"
    }
  }, React.createElement("label", {
    className: "btn btn-secondary",
    style: {
      display: "inline-flex",
      cursor: "pointer"
    }
  }, React.createElement("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    multiple: true,
    style: {
      display: "none"
    },
    onChange: uploadMore,
    disabled: busy
  }), React.createElement(Icon, {
    name: "Upload",
    size: 13
  }), " ", busy ? "Uploading..." : "Add / Replace Files"), React.createElement("span", {
    className: "text-sm text-muted",
    style: {
      marginLeft: 12
    }
  }, "You can add or delete files while this is waiting for Dean Review.")))), React.createElement("div", {
    style: {
      alignSelf: "start"
    }
  }, React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Application Timeline"), React.createElement("div", {
    className: "grow"
  }), React.createElement(Badge, {
    status: status
  })), React.createElement("div", {
    className: "card-body"
  }, React.createElement(ApplicationEventTimeline, {
    app: app
  }))))));
}
Object.assign(window, {
  ResearcherDashboard: ResearcherDashboard,
  ResearcherSubmitR3: ResearcherSubmitR3,
  ResearcherSubmitR4: ResearcherSubmitR4,
  ResearcherApplications: ResearcherApplications,
  ResearcherApplicationDetail: ResearcherApplicationDetail
});
