function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var D = window.AU;
function initialsFromName(name) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "U";
  var text = (name || fallback || "U").trim();
  var parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 2 && /^\d+$/.test(parts[1])) return (parts[0][0] + parts[1]).toUpperCase();
  return (parts.length ? parts : [fallback]).map(function (p) {
    return p[0];
  }).join("").slice(0, 2).toUpperCase();
}
function QueueTable(_ref) {
  var rows = _ref.rows,
    _ref$openLabel = _ref.openLabel,
    openLabel = _ref$openLabel === void 0 ? "Review" : _ref$openLabel,
    onOpen = _ref.onOpen,
    _ref$columns = _ref.columns,
    columns = _ref$columns === void 0 ? "full" : _ref$columns,
    _ref$showGrant = _ref.showGrant,
    showGrant = _ref$showGrant === void 0 ? false : _ref$showGrant;
  return React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), showGrant && React.createElement("th", null, "Grant"), React.createElement("th", null, "Research Title"), React.createElement("th", null, "Researcher"), columns === "full" && React.createElement("th", null, "Department"), React.createElement("th", null, "Submitted"), columns === "full" && React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Budget"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, rows.map(function (a) {
    var _a$researcher, _a$budgetTotal;
    return React.createElement("tr", {
      key: a.id
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), showGrant && React.createElement("td", null, React.createElement("span", {
      className: "badge badge-draft"
    }, a.grant_type === "au_r4" ? "AU-R4" : "AU-R3")), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 260
      }
    }, a.title)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, ((_a$researcher = a.researcher) === null || _a$researcher === void 0 ? void 0 : _a$researcher.name) || "—"), columns === "full" && React.createElement("td", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        maxWidth: 180
      }
    }, a.department), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, a.submittedAt), columns === "full" && React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 600
      }
    }, (_a$budgetTotal = a.budgetTotal) === null || _a$budgetTotal === void 0 ? void 0 : _a$budgetTotal.toLocaleString()), React.createElement("td", null, React.createElement(Badge, {
      status: a.status
    })), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return onOpen && onOpen(a);
      }
    }, openLabel)));
  })));
}
function WiredQueue(_ref2) {
  var status = _ref2.status,
    openLabel = _ref2.openLabel,
    confirmTitle = _ref2.confirmTitle,
    confirmLabel = _ref2.confirmLabel,
    onDownload = _ref2.onDownload,
    setConfirm = _ref2.setConfirm,
    toast = _ref2.toast;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    rows = _useState2[0],
    setRows = _useState2[1];
  var load = function load() {
    return window.DB.queue(status).then(setRows).catch(function () {
      return setRows([]);
    });
  };
  useEffect(function () {
    load();
  }, []);
  var act = function act(row) {
    return setConfirm({
      kind: "success",
      title: confirmTitle || "Forward this application?",
      confirmLabel: confirmLabel || "Confirm",
      message: "Application " + row.id + " · " + row.title + ".",
      onConfirm: function () {
        var _onConfirm = _asyncToGenerator(_regenerator().m(function _callee() {
          var _t;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.p = _context.n) {
              case 0:
                _context.p = 0;
                _context.n = 1;
                return window.DB.transition(row._uuid, status, "advance");
              case 1:
                toast(row.id + " forwarded to the next stage.");
                load();
                _context.n = 3;
                break;
              case 2:
                _context.p = 2;
                _t = _context.v;
                toast("Error: " + (_t.message || _t));
              case 3:
                return _context.a(2);
            }
          }, _callee, null, [[0, 2]]);
        }));
        function onConfirm() {
          return _onConfirm.apply(this, arguments);
        }
        return onConfirm;
      }()
    });
  };
  if (rows === null) return React.createElement("div", {
    style: {
      padding: "36px",
      textAlign: "center",
      color: "var(--ink-3)"
    }
  }, "Loading queue\u2026");
  if (rows.length === 0) return React.createElement("div", {
    style: {
      padding: "44px",
      textAlign: "center",
      color: "var(--ink-3)"
    }
  }, "Nothing in this queue right now.");
  return React.createElement(QueueTable, {
    rows: rows,
    openLabel: openLabel,
    onOpen: act,
    onDownload: onDownload
  });
}
function DeanDashboard(_ref3) {
  var navigate = _ref3.navigate,
    setSelectedApplicationId = _ref3.setSelectedApplicationId;
  var _useState3 = useState("au_r3"),
    _useState4 = _slicedToArray(_useState3, 2),
    sys = _useState4[0],
    setSys = _useState4[1];
  var isR4 = sys === "au_r4";
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    c = _useState6[0],
    setC = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    screenRows = _useState8[0],
    setScreenRows = _useState8[1];
  useEffect(function () {
    setC(null);
    setScreenRows(null);
    window.DB.statusCounts(sys).then(setC).catch(function () {
      return setC({});
    });
    window.DB.queue("submitted", sys).then(setScreenRows).catch(function () {
      return setScreenRows([]);
    });
  }, [sys]);
  var n = function n(k) {
    return c ? c[k] || 0 : "…";
  };
  var openQueue = function openQueue() {
    return navigate(isR4 ? "d-r4-screen" : "d-r3-screen");
  };
  var rowPage = isR4 ? "d-r4-detail" : "d-r3-detail";
  var openApplication = function openApplication(application) {
    if (setSelectedApplicationId) setSelectedApplicationId(application._uuid);
    navigate(rowPage);
  };
  var sysToggle = React.createElement("div", {
    style: {
      display: "inline-flex",
      border: "1px solid var(--line)",
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 8
    }
  }, [{
    id: "au_r3",
    label: "AU-R3"
  }, {
    id: "au_r4",
    label: "AU-R4"
  }].map(function (t) {
    return React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return setSys(t.id);
      },
      style: {
        padding: "7px 15px",
        fontSize: 12,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: sys === t.id ? "var(--au-crimson)" : "transparent",
        color: sys === t.id ? "#fff" : "var(--ink-2)"
      }
    }, t.label);
  }));
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: isR4 ? "AU-R4 · Dean Summary" : "AU-R3 · Dean Summary",
    actions: React.createElement(React.Fragment, null, sysToggle, React.createElement("button", {
      className: "btn btn-primary",
      onClick: openQueue
    }, React.createElement(Icon, {
      name: "Inbox",
      size: 14
    }), " ", isR4 ? "Open AU-R4 Review Queue" : "Open AU-R3 Review Queue"))
  }), isR4 ? React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Pending Dean Review",
    value: n("submitted"),
    icon: "ClipboardCheck",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Awaiting IRAS Verification",
    value: n("iras_review"),
    icon: "Send",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "At Finance",
    value: n("approved"),
    icon: "Coins"
  }), React.createElement(Stat, {
    label: "Paid / Completed",
    value: c ? (c.active || 0) + (c.completed || 0) : "…",
    icon: "CheckCircle",
    tone: "green"
  })) : React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Pending Dean Review",
    value: n("submitted"),
    icon: "ClipboardCheck",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Forwarded to IRAS",
    value: n("iras_review"),
    icon: "Send",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "At Finance",
    value: n("approved"),
    icon: "Coins"
  }), React.createElement(Stat, {
    label: "Paid / Completed",
    value: c ? (c.active || 0) + (c.completed || 0) : "…",
    icon: "CheckCircle",
    tone: "green"
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, isR4 ? "AU-R4 · Dean Review Queue" : "AU-R3 · Dean Review Queue"), React.createElement("div", {
    className: "grow"
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: openQueue
  }, "Open queue ", React.createElement(Icon, {
    name: "ArrowRight",
    size: 12
  }))), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "ID"), React.createElement("th", null, "Title"), React.createElement("th", null, "Researcher"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, screenRows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4",
    style: {
      textAlign: "center",
      padding: "24px",
      color: "var(--ink-3)"
    }
  }, "Loading...")), screenRows && screenRows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4"
  }, React.createElement(Empty, {
    title: "Nothing to screen",
    desc: "New submissions will appear here.",
    icon: "ClipboardCheck"
  }))), (screenRows || []).slice(0, 8).map(function (a) {
    var _a$researcher2;
    return React.createElement("tr", {
      key: a.id,
      style: {
        cursor: "pointer"
      },
      onClick: function onClick() {
        return openApplication(a);
      }
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 300,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, a.title)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, (_a$researcher2 = a.researcher) === null || _a$researcher2 === void 0 ? void 0 : _a$researcher2.name), React.createElement("td", null, React.createElement(Badge, {
      status: a.status
    })));
  })))));
}
function DeanR3Queue(_ref4) {
  var navigate = _ref4.navigate,
    setSelectedApplicationId = _ref4.setSelectedApplicationId;
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    rows = _useState0[0],
    setRows = _useState0[1];
  useEffect(function () {
    window.DB.queue("submitted", "au_r3").then(setRows).catch(function () {
      return setRows([]);
    });
  }, []);
  var open = function open(row) {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-r3-detail");
  };
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "AU-R3 \xB7 Dean Review Queue",
    desc: "Paper presentation grant requests from your faculty awaiting Dean review before IRAS."
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
    placeholder: "Search by ID, paper, conference\u2026"
  })), React.createElement("button", {
    className: "filter active"
  }, React.createElement(Icon, {
    name: "Filter",
    size: 12
  }), " All"), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "Download",
    size: 12
  }), " Export")), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), React.createElement("th", null, "Paper Title"), React.createElement("th", null, "Conference"), React.createElement("th", null, "Researcher"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Requested"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, rows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "7",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading queue\u2026")), rows && rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "7",
    style: {
      textAlign: "center",
      padding: "40px",
      color: "var(--ink-3)"
    }
  }, "No AU-R3 requests waiting right now.")), (rows || []).map(function (a) {
    var _a$researcher3;
    var ci = a.conference_info || {};
    var intl = ci.confType === "International";
    return React.createElement("tr", {
      key: a.id
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 260,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, a.title), React.createElement("div", {
      className: "s"
    }, a.department || a.faculty || "")), React.createElement("td", null, React.createElement("div", {
      style: {
        fontSize: 12.5,
        maxWidth: 200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, ci.confName || "—"), ci.confType && React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 999,
        color: intl ? "var(--au-crimson)" : "var(--au-gold-deep)",
        background: intl ? "var(--au-crimson-soft)" : "var(--au-gold-soft)"
      }
    }, ci.confType)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, (_a$researcher3 = a.researcher) === null || _a$researcher3 === void 0 ? void 0 : _a$researcher3.name), React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace"
      }
    }, fmtBaht(Number(a.requested_amount || 0))), React.createElement("td", null, React.createElement(Badge, {
      status: a.status
    })), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        return open(a);
      }
    }, "Review")));
  })))));
}
function DeanR4Queue(_ref5) {
  var navigate = _ref5.navigate,
    setSelectedApplicationId = _ref5.setSelectedApplicationId;
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    rows = _useState10[0],
    setRows = _useState10[1];
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    q = _useState12[0],
    setQ = _useState12[1];
  useEffect(function () {
    window.DB.queue("submitted", "au_r4").then(setRows).catch(function () {
      return setRows([]);
    });
  }, []);
  var open = function open(row) {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-r4-detail");
  };
  var filtered = (rows || []).filter(function (a) {
    if (!q.trim()) return true;
    var pi = a.conference_info;
    var hay = [a.id, a.title, a.researcher && a.researcher.name, a.department].join(" ").toLowerCase();
    return hay.indexOf(q.toLowerCase()) >= 0;
  });
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "AU-R4 \xB7 Dean Review Queue",
    desc: "Review submitted publication fee and reward applications from your faculty."
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
    placeholder: "Search by ID, article, journal, researcher, or DOI",
    value: q,
    onChange: function onChange(e) {
      return setQ(e.target.value);
    }
  })), React.createElement("button", {
    className: "filter active"
  }, React.createElement(Icon, {
    name: "Filter",
    size: 12
  }), " All"), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "Download",
    size: 12
  }), " Export")), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), React.createElement("th", null, "Article Title"), React.createElement("th", null, "Journal"), React.createElement("th", null, "Category"), React.createElement("th", null, "Researcher"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Requested"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, rows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading queue\u2026")), rows && filtered.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8",
    style: {
      textAlign: "center",
      padding: "40px",
      color: "var(--ink-3)"
    }
  }, "No AU-R4 applications waiting right now.")), filtered.map(function (a) {
    var _a$researcher4;
    var pi = a.pub_info || {};
    return React.createElement("tr", {
      key: a.id
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 240,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, a.title), React.createElement("div", {
      className: "s"
    }, a.department || a.faculty || "")), React.createElement("td", null, React.createElement("div", {
      style: {
        fontSize: 12.5,
        maxWidth: 170,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, pi.journal || "—")), React.createElement("td", null, React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 999,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)"
      }
    }, pi.indexLabel || "—")), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, (_a$researcher4 = a.researcher) === null || _a$researcher4 === void 0 ? void 0 : _a$researcher4.name), React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace"
      }
    }, fmtBaht(Number(a.requested_amount || 0))), React.createElement("td", null, React.createElement(Badge, {
      status: a.status
    })), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        return open(a);
      }
    }, "Review")));
  })))));
}
function DeanHistory(_ref6) {
  var navigate = _ref6.navigate,
    setSelectedApplicationId = _ref6.setSelectedApplicationId;
  var _useState13 = useState(null),
    _useState14 = _slicedToArray(_useState13, 2),
    rows = _useState14[0],
    setRows = _useState14[1];
  useEffect(function () {
    window.DB.byStatuses(["submitted", "iras_review", "approved", "active", "completed", "rejected", "returned"]).then(setRows).catch(function () {
      return setRows([]);
    });
  }, []);
  var openTimeline = function openTimeline(row) {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate("d-history-detail");
  };
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Decision History",
    desc: "Read-only Dean decisions for AU-R3 and AU-R4 applications."
  }), React.createElement("div", {
    className: "card card-pad-0"
  }, rows && rows.length === 0 ? React.createElement("div", {
    style: {
      padding: "44px",
      textAlign: "center",
      color: "var(--ink-3)"
    }
  }, "No decisions yet.") : React.createElement(QueueTable, {
    rows: rows || [],
    openLabel: "View Timeline",
    onOpen: openTimeline,
    showGrant: true
  })));
}
function DeanDecisionTimeline(_ref7) {
  var _app$researcher;
  var applicationId = _ref7.applicationId,
    navigate = _ref7.navigate;
  var _useState15 = useState(null),
    _useState16 = _slicedToArray(_useState15, 2),
    app = _useState16[0],
    setApp = _useState16[1];
  var _useState17 = useState(true),
    _useState18 = _slicedToArray(_useState17, 2),
    loading = _useState18[0],
    setLoading = _useState18[1];
  useEffect(function () {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    window.DB.applicationDetail(applicationId).then(setApp).catch(function () {
      return setApp(null);
    }).finally(function () {
      return setLoading(false);
    });
  }, [applicationId]);
  var backButton = React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return navigate("d-history");
    }
  }, React.createElement(Icon, {
    name: "ArrowLeft",
    size: 14
  }), " Decision History");
  if (loading) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Dean Decision Timeline",
      desc: "Loading the recorded Dean activity.",
      actions: backButton
    }), React.createElement("div", {
      className: "card",
      style: {
        padding: 44,
        textAlign: "center",
        color: "var(--ink-3)"
      }
    }, "Loading timeline..."));
  }
  if (!app) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: "Dean Decision Timeline",
      desc: "Select an application from Decision History.",
      actions: backButton
    }), React.createElement("div", {
      className: "card"
    }, React.createElement(Empty, {
      title: "No application selected",
      desc: "Return to Decision History and choose View Timeline.",
      icon: "Clock"
    })));
  }
  var grantLabel = app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Dean Decision Timeline - " + (app.code || "Application"),
    desc: "Read-only record of actions completed by the Dean.",
    actions: backButton
  }), React.createElement("div", {
    className: "card card-pad-0 mb-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Application"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "badge badge-draft"
  }, grantLabel), React.createElement(Badge, {
    status: app.statusBadge || window.DB.statusBadge(app.status)
  })), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Research title"), React.createElement("span", {
    className: "r"
  }, app.title || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Researcher"), React.createElement("span", {
    className: "r"
  }, ((_app$researcher = app.researcher) === null || _app$researcher === void 0 ? void 0 : _app$researcher.full_name) || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Faculty / Department"), React.createElement("span", {
    className: "r"
  }, [app.faculty, app.department].filter(Boolean).join(" / ") || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Submitted"), React.createElement("span", {
    className: "r"
  }, window.DB.fmtDate(app.submitted_at || app.created_at))))), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Complete Application Activity"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "text-sm text-muted"
  }, React.createElement(Icon, {
    name: "Lock",
    size: 12
  }), " Read-only")), React.createElement("div", {
    className: "card-body"
  }, React.createElement(ApplicationEventTimeline, {
    app: app
  }))));
}
function IRASGrantDashboard(_ref8) {
  var navigate = _ref8.navigate,
    setSelectedApplicationId = _ref8.setSelectedApplicationId,
    sys = _ref8.sys;
  var isR4 = sys === "au_r4";
  var _useState19 = useState(null),
    _useState20 = _slicedToArray(_useState19, 2),
    c = _useState20[0],
    setC = _useState20[1];
  var _useState21 = useState(null),
    _useState22 = _slicedToArray(_useState21, 2),
    rows = _useState22[0],
    setRows = _useState22[1];
  useEffect(function () {
    setC(null);
    setRows(null);
    window.DB.statusCounts(sys).then(setC).catch(function () {
      return setC({});
    });
    window.DB.queue("iras_review", sys).then(setRows).catch(function () {
      return setRows([]);
    });
  }, [sys]);
  var n = function n(k) {
    return c ? c[k] || 0 : "…";
  };
  var detailPage = isR4 ? "i-r4-verify" : "i-r3-verify";
  var open = function open(row) {
    if (setSelectedApplicationId) setSelectedApplicationId(row._uuid);
    navigate(detailPage);
  };
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Pending Verification",
    value: n("iras_review"),
    icon: "ClipboardCheck",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Returned for Revision",
    value: n("returned"),
    icon: "Repeat",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "Forwarded to Finance",
    value: n("approved"),
    icon: "Send"
  }), React.createElement(Stat, {
    label: "Paid / Completed",
    value: c ? (c.active || 0) + (c.completed || 0) : "…",
    icon: "CheckCircle",
    tone: "green"
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, isR4 ? "AU-R4" : "AU-R3", " Verification Queue")), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), React.createElement("th", null, isR4 ? "Article" : "Paper", " Title"), React.createElement("th", null, isR4 ? "Journal / Category" : "Conference"), React.createElement("th", null, "Researcher"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Requested"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, rows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "28px",
      color: "var(--ink-3)"
    }
  }, "Loading\u2026")), rows && rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "36px",
      color: "var(--ink-3)"
    }
  }, "No ", isR4 ? "Dean-approved AU-R4" : "Dean-approved AU-R3", " applications waiting.")), (rows || []).map(function (a) {
    var _a$researcher5;
    var pi = a.pub_info || {},
      ci = a.conference_info || {};
    return React.createElement("tr", {
      key: a.id
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 240,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, a.title)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, isR4 ? (pi.journal || "—") + (pi.indexLabel ? " · " + pi.indexLabel : "") : ci.confName || "—"), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, (_a$researcher5 = a.researcher) === null || _a$researcher5 === void 0 ? void 0 : _a$researcher5.name), React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace"
      }
    }, fmtBaht(Number(a.requested_amount || 0))), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        return open(a);
      }
    }, "Verify")));
  })))));
}
function IRASDashboard(_ref9) {
  var navigate = _ref9.navigate,
    setSelectedApplicationId = _ref9.setSelectedApplicationId,
    _ref9$grantType = _ref9.grantType,
    grantType = _ref9$grantType === void 0 ? "au_r3" : _ref9$grantType,
    onGrantSwitch = _ref9.onGrantSwitch;
  var sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  var isR4 = sys === "au_r4";
  var sysToggle = React.createElement("div", {
    style: {
      display: "inline-flex",
      border: "1px solid var(--line)",
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 8
    }
  }, [{
    id: "au_r3",
    label: "AU-R3"
  }, {
    id: "au_r4",
    label: "AU-R4"
  }].map(function (t) {
    return React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return onGrantSwitch && onGrantSwitch(t.id, "i-dashboard");
      },
      style: {
        padding: "7px 15px",
        fontSize: 12,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: sys === t.id ? "var(--au-crimson)" : "transparent",
        color: sys === t.id ? "#fff" : "var(--ink-2)"
      }
    }, t.label);
  }));
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: (isR4 ? "AU-R4" : "AU-R3") + " · IRAS Summary",
    desc: isR4 ? "Verify Dean-approved AU-R4 publication-fee applications before forwarding eligible claims to Finance." : "Verify Dean-approved paper presentation applications before forwarding them to Finance.",
    actions: sysToggle
  }), React.createElement(IRASGrantDashboard, {
    navigate: navigate,
    setSelectedApplicationId: setSelectedApplicationId,
    sys: sys
  }));
}
function IRASr3Detail(_ref0) {
  var applicationId = _ref0.applicationId,
    navigate = _ref0.navigate,
    onDownload = _ref0.onDownload,
    onView = _ref0.onView,
    toast = _ref0.toast,
    setConfirm = _ref0.setConfirm;
  return React.createElement(LiveAppLoader, {
    status: "iras_review",
    applicationId: applicationId,
    title: "AU-R3 Verification",
    desc: "Verify the Dean-approved paper presentation request, then forward it to Finance.",
    render: function render(app, load) {
      var docs = app.documents || [];
      var ci = app.conference_info || {};
      var row = function row(l, v) {
        return React.createElement("div", {
          className: "meta-row"
        }, React.createElement("span", {
          className: "l"
        }, l), React.createElement("span", {
          className: "r"
        }, v || "-"));
      };
      var forward = function forward() {
        return setConfirm({
          kind: "success",
          title: "Approve & forward to Finance?",
          message: app.code + " will be marked IRAS-approved and forwarded to the Finance Office for payment.",
          confirmLabel: "Approve & Forward",
          withReason: true,
          reasonLabel: "IRAS comment",
          onConfirm: function () {
            var _onConfirm2 = _asyncToGenerator(_regenerator().m(function _callee2(reason) {
              var _t2;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.p = _context2.n) {
                  case 0:
                    _context2.p = 0;
                    _context2.n = 1;
                    return window.DB.transition(app.id, "iras_review", "advance", reason);
                  case 1:
                    toast(app.code + " approved — forwarded to Finance.");
                    navigate("i-dashboard");
                    _context2.n = 3;
                    break;
                  case 2:
                    _context2.p = 2;
                    _t2 = _context2.v;
                    toast("Error: " + (_t2 && _t2.message || _t2));
                    load();
                  case 3:
                    return _context2.a(2);
                }
              }, _callee2, null, [[0, 2]]);
            }));
            function onConfirm(_x) {
              return _onConfirm2.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var ret = function ret() {
        return setConfirm({
          kind: "danger",
          title: "Return for revision?",
          message: app.code + " will be returned to the researcher.",
          confirmLabel: "Return",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "IRAS comment",
          finalConfirm: false,
          onConfirm: function () {
            var _onConfirm3 = _asyncToGenerator(_regenerator().m(function _callee3(reason) {
              var _t3;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.p = _context3.n) {
                  case 0:
                    _context3.p = 0;
                    _context3.n = 1;
                    return window.DB.transition(app.id, "iras_review", "return", reason);
                  case 1:
                    toast(app.code + " returned.");
                    navigate("i-dashboard");
                    _context3.n = 3;
                    break;
                  case 2:
                    _context3.p = 2;
                    _t3 = _context3.v;
                    toast("Error: " + (_t3 && _t3.message || _t3));
                  case 3:
                    return _context3.a(2);
                }
              }, _callee3, null, [[0, 2]]);
            }));
            function onConfirm(_x2) {
              return _onConfirm3.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var reject = function reject() {
        return setConfirm({
          kind: "danger",
          title: "Reject application?",
          message: app.code + " will be rejected. This is a final decision and will close the application.",
          confirmLabel: "Reject Application",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "IRAS rejection reason",
          onConfirm: function () {
            var _onConfirm4 = _asyncToGenerator(_regenerator().m(function _callee4(reason) {
              var _t4;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.p = _context4.n) {
                  case 0:
                    _context4.p = 0;
                    _context4.n = 1;
                    return window.DB.transition(app.id, "iras_review", "reject", reason);
                  case 1:
                    toast(app.code + " rejected.");
                    navigate("i-dashboard");
                    _context4.n = 3;
                    break;
                  case 2:
                    _context4.p = 2;
                    _t4 = _context4.v;
                    toast("Error: " + (_t4 && _t4.message || _t4));
                    load();
                  case 3:
                    return _context4.a(2);
                }
              }, _callee4, null, [[0, 2]]);
            }));
            function onConfirm(_x3) {
              return _onConfirm4.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
        title: "AU-R3 Verification — " + app.code,
        desc: (ci.researcherName || (app.researcher ? app.researcher.full_name : "Researcher")) + " · " + (app.faculty || "") + " · " + (ci.confName || ""),
        actions: React.createElement(Badge, {
          status: r3Badge(app.status)
        })
      }), React.createElement("div", {
        className: "mb-4"
      }, React.createElement(AnnualFundingSummaryCard, {
        summary: app.annual_funding,
        currentAmount: Number(app.requested_amount || 3500),
        compact: true
      })), React.createElement("div", {
        className: "grid-2"
      }, React.createElement("div", null, React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Conference")), React.createElement("div", {
        className: "card-body"
      }, row("Conference", ci.confName), row("Organizer", ci.organizer), row("Type", ci.confType), row("Conference location", ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", ")), row("Presentation date", ci.presentationDate || ci.confStart ? window.DB.fmtDate(ci.presentationDate || ci.confStart) : "-"), row("Presentation", ci.presentation))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Paper")), React.createElement("div", {
        className: "card-body"
      }, row("Paper title", app.title), row("Field", app.field), row("Applicant author type", ci.authorType || "Lead Author"), (app.co_members || []).map(function (author, index) {
        return React.createElement("div", {
          className: "meta-row",
          key: index
        }, React.createElement("span", {
          className: "l"
        }, "Additional author " + (index + 1) + " · " + (author.authorType || "Co-author")), React.createElement("span", {
          className: "r"
        }, author.name + (author.kind ? " · " + author.kind : "")));
      }), row("Abstract", ci.paperAbstract), row("Keywords", app.keywords), React.createElement(ResearcherServiceEligibilityRows, {
        app: app
      }), React.createElement(ReviewCommentHistory, {
        app: app,
        roles: ["dean"]
      }))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Conference Qualities")), React.createElement("div", {
        className: "card-body"
      }, row("Conference Database / Index", ci.journalDb), row("Qualities", ci.journalClassification), row("Fixed AU-R3 grant", fmtBaht(3500)))), React.createElement("div", {
        className: "card card-pad-0"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Documents")), React.createElement("div", null, docs.length === 0 && React.createElement(Empty, {
        title: "No documents",
        desc: "No files forwarded.",
        icon: "FileText"
      }), docs.map(function (d) {
        return React.createElement(FileRow, {
          key: d.id || d.name,
          doc: d,
          onDownload: onDownload,
          onView: onView
        });
      })))), React.createElement("div", {
        className: "card card-pad-0",
        style: {
          alignSelf: "start"
        }
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "IRAS Decision")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("p", {
        className: "text-sm text-muted mb-4"
      }, "Confirm the conference, paper, conference qualities, three required documents, and fixed 3,500 THB grant are eligible, then forward to Finance for payment."), React.createElement("div", {
        className: "flex flex-col gap-2"
      }, React.createElement("button", {
        className: "btn btn-primary btn-block",
        onClick: forward
      }, React.createElement(Icon, {
        name: "Send",
        size: 14
      }), " Approve & Forward to Finance"), React.createElement("button", {
        className: "btn btn-secondary btn-block",
        onClick: ret
      }, React.createElement(Icon, {
        name: "Repeat",
        size: 14
      }), " Return for Revision"), React.createElement("button", {
        className: "btn btn-danger btn-block",
        onClick: reject
      }, React.createElement(Icon, {
        name: "X",
        size: 14
      }), " Reject Application"))))));
    }
  });
}
function IRASr4Detail(_ref1) {
  var applicationId = _ref1.applicationId,
    navigate = _ref1.navigate,
    onDownload = _ref1.onDownload,
    onView = _ref1.onView,
    toast = _ref1.toast,
    setConfirm = _ref1.setConfirm;
  var _useState23 = useState(""),
    _useState24 = _slicedToArray(_useState23, 2),
    finalAmt = _useState24[0],
    setFinalAmt = _useState24[1];
  return React.createElement(LiveAppLoader, {
    status: "iras_review",
    applicationId: applicationId,
    title: "AU-R4 Verification",
    desc: "Verify eligibility, confirm the final eligible amount, then forward to Finance.",
    render: function render(app, load) {
      var pi = app.pub_info || {};
      var authors = Array.isArray(app.co_members) ? app.co_members : [];
      var requested = Number(app.requested_amount || 0);
      var MAX = 80000;
      var finalNum = finalAmt === "" ? requested : Number(finalAmt) || 0;
      var overMax = finalNum > MAX;
      var row = function row(l, v) {
        return React.createElement("div", {
          className: "meta-row"
        }, React.createElement("span", {
          className: "l"
        }, l), React.createElement("span", {
          className: "r"
        }, v || "-"));
      };
      var docs = app.documents || [];
      var forward = function forward() {
        if (finalNum <= 0) {
          toast("Enter the final eligible amount first.");
          return;
        }
        if (overMax) {
          toast("Final amount cannot exceed 80,000 THB.");
          return;
        }
        setConfirm({
          kind: "success",
          title: "Approve & forward to Finance?",
          message: app.code + " will be approved at " + fmtBaht(finalNum) + " and forwarded to the Finance Office for payment.",
          confirmLabel: "Confirm & Forward to Finance",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "IRAS comment",
          onConfirm: function () {
            var _onConfirm5 = _asyncToGenerator(_regenerator().m(function _callee5(reason) {
              var _t5;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.p = _context5.n) {
                  case 0:
                    _context5.p = 0;
                    _context5.n = 1;
                    return window.DB.setApprovedAmount(app.id, finalNum);
                  case 1:
                    _context5.n = 2;
                    return window.DB.transition(app.id, "iras_review", "advance", reason || "");
                  case 2:
                    toast(app.code + " approved at " + fmtBaht(finalNum) + " — forwarded to Finance.");
                    navigate("i-dashboard");
                    _context5.n = 4;
                    break;
                  case 3:
                    _context5.p = 3;
                    _t5 = _context5.v;
                    toast("Error: " + (_t5 && _t5.message || _t5));
                    load();
                  case 4:
                    return _context5.a(2);
                }
              }, _callee5, null, [[0, 3]]);
            }));
            function onConfirm(_x4) {
              return _onConfirm5.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var ret = function ret() {
        return setConfirm({
          kind: "danger",
          title: "Return for revision?",
          message: app.code + " will be returned to the researcher.",
          confirmLabel: "Return",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "IRAS comment",
          finalConfirm: false,
          onConfirm: function () {
            var _onConfirm6 = _asyncToGenerator(_regenerator().m(function _callee6(reason) {
              var _t6;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.p = _context6.n) {
                  case 0:
                    _context6.p = 0;
                    _context6.n = 1;
                    return window.DB.transition(app.id, "iras_review", "return", reason);
                  case 1:
                    toast(app.code + " returned.");
                    navigate("i-dashboard");
                    _context6.n = 3;
                    break;
                  case 2:
                    _context6.p = 2;
                    _t6 = _context6.v;
                    toast("Error: " + (_t6 && _t6.message || _t6));
                  case 3:
                    return _context6.a(2);
                }
              }, _callee6, null, [[0, 2]]);
            }));
            function onConfirm(_x5) {
              return _onConfirm6.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var reject = function reject() {
        return setConfirm({
          kind: "danger",
          title: "Reject application?",
          message: app.code + " will be rejected. This is a final decision and will close the application.",
          confirmLabel: "Reject Application",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "IRAS rejection reason",
          onConfirm: function () {
            var _onConfirm7 = _asyncToGenerator(_regenerator().m(function _callee7(reason) {
              var _t7;
              return _regenerator().w(function (_context7) {
                while (1) switch (_context7.p = _context7.n) {
                  case 0:
                    _context7.p = 0;
                    _context7.n = 1;
                    return window.DB.transition(app.id, "iras_review", "reject", reason);
                  case 1:
                    toast(app.code + " rejected.");
                    navigate("i-dashboard");
                    _context7.n = 3;
                    break;
                  case 2:
                    _context7.p = 2;
                    _t7 = _context7.v;
                    toast("Error: " + (_t7 && _t7.message || _t7));
                    load();
                  case 3:
                    return _context7.a(2);
                }
              }, _callee7, null, [[0, 2]]);
            }));
            function onConfirm(_x6) {
              return _onConfirm7.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
        title: "AU-R4 Verification — " + app.code,
        desc: (app.researcher ? app.researcher.full_name : "Researcher") + " · " + (pi.journal || "") + " · " + (pi.indexLabel || ""),
        actions: React.createElement(Badge, {
          status: r4Badge(app.status)
        })
      }), React.createElement("div", {
        className: "mb-4"
      }, React.createElement(AnnualFundingSummaryCard, {
        summary: app.annual_funding,
        currentAmount: finalNum,
        compact: true
      })), React.createElement("div", {
        className: "grid-2"
      }, React.createElement("div", null, React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Publication & Journal")), React.createElement("div", {
        className: "card-body"
      }, row("Article", app.title), row("Publication status", pi.pubStatus), row("Journal", pi.journal), row("Publisher", pi.publisher), pi.pubStatus === "Published" && React.createElement(React.Fragment, null, row("Article URL", pi.articleUrl), row("DOI", pi.doi), row("ISSN / eISSN", pi.issn), row("Page number(s)", pi.pageNumber || [pi.startPage, pi.endPage].filter(Boolean).join("–"))), row("Database / index", pi.journalDb), row("Classification", pi.journalClassification || pi.openAccess), row("Academic year (AD)", pi.academicYear), row("Publication fee", fmtBaht(Number(pi.feePaid || 0))), React.createElement(ReviewCommentHistory, {
        app: app,
        roles: ["dean"]
      }))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Authors & Eligibility")), React.createElement("div", {
        className: "card-body",
        style: {
          padding: 0
        }
      }, React.createElement("div", {
        style: {
          padding: "12px 20px",
          borderBottom: "1px solid var(--line-2)",
          fontSize: 13
        }
      }, row("Applicant role", pi.applicantRole)), React.createElement("div", {
        style: {
          padding: "0 20px 12px"
        }
      }, React.createElement(ResearcherServiceEligibilityRows, {
        app: app
      })), React.createElement("table", {
        className: "tbl"
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Author"), React.createElement("th", null, "Role"), React.createElement("th", null, "Email"), React.createElement("th", {
        style: {
          textAlign: "right"
        }
      }, "%"))), React.createElement("tbody", null, authors.map(function (a, i) {
        return React.createElement("tr", {
          key: i
        }, React.createElement("td", null, a.name), React.createElement("td", {
          style: {
            fontSize: 12
          }
        }, a.type), React.createElement("td", {
          style: {
            fontSize: 12
          }
        }, a.email || "—"), React.createElement("td", {
          style: {
            textAlign: "right"
          }
        }, a.contribution || 0, "%"));
      }))))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Publication Fee & Turnitin")), React.createElement("div", {
        className: "card-body"
      }, row("Publication fee", fmtBaht(Number(pi.feePaid || 0))), row("Requested amount", fmtBaht(requested)), row("Turnitin", pi.turnitin != null ? pi.turnitin + "%" : "-"))), React.createElement("div", {
        className: "card card-pad-0"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Documents")), React.createElement("div", null, docs.length === 0 && React.createElement(Empty, {
        title: "No documents",
        desc: "No files forwarded.",
        icon: "FileText"
      }), docs.map(function (d) {
        return React.createElement(FileRow, {
          key: d.id || d.name,
          doc: d,
          onDownload: onDownload,
          onView: onView
        });
      })))), React.createElement("div", {
        className: "card card-pad-0",
        style: {
          alignSelf: "start"
        }
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Final Eligible Amount")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("p", {
        className: "text-sm text-muted mb-4"
      }, "Set the final eligible amount from the verified journal category, then forward to Finance. Maximum 80,000 THB per article."), React.createElement("div", {
        className: "field"
      }, React.createElement("label", null, "Final Approved Amount (THB)"), React.createElement("input", {
        value: finalAmt === "" ? "" : Number(finalAmt || 0).toLocaleString(),
        onChange: function onChange(e) {
          return setFinalAmt((e.target.value + "").replace(/[^0-9]/g, ""));
        },
        placeholder: Number(requested || 0).toLocaleString(),
        style: overMax ? {
          borderColor: "var(--au-crimson)",
          color: "var(--au-crimson)",
          fontWeight: 600
        } : null
      }), overMax && React.createElement("div", {
        style: {
          fontSize: 11,
          color: "var(--au-crimson)",
          marginTop: 4
        }
      }, "Cannot exceed 80,000 THB."), React.createElement("div", {
        style: {
          fontSize: 11,
          color: "var(--ink-3)",
          marginTop: 4
        }
      }, "Leave blank to approve the full requested claim.")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Publication fee"), React.createElement("span", {
        className: "r"
      }, fmtBaht(Number(pi.feePaid || 0)))), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Requested amount"), React.createElement("span", {
        className: "r"
      }, fmtBaht(requested))), React.createElement("div", {
        className: "flex flex-col gap-2 mt-4"
      }, React.createElement("button", {
        className: "btn btn-primary btn-block",
        disabled: overMax || finalNum <= 0,
        onClick: forward
      }, React.createElement(Icon, {
        name: "Send",
        size: 14
      }), " Approve & Forward to Finance"), React.createElement("button", {
        className: "btn btn-secondary btn-block",
        onClick: ret
      }, React.createElement(Icon, {
        name: "Repeat",
        size: 14
      }), " Return for Revision"), React.createElement("button", {
        className: "btn btn-danger btn-block",
        onClick: reject
      }, React.createElement(Icon, {
        name: "X",
        size: 14
      }), " Reject Application"))))));
    }
  });
}
function OFMGrantPayments(_ref10) {
  var sys = _ref10.sys,
    toast = _ref10.toast,
    setConfirm = _ref10.setConfirm,
    onDownload = _ref10.onDownload,
    onView = _ref10.onView;
  var isR4 = sys === "au_r4";
  var _useState25 = useState(null),
    _useState26 = _slicedToArray(_useState25, 2),
    rows = _useState26[0],
    setRows = _useState26[1];
  var _useState27 = useState(null),
    _useState28 = _slicedToArray(_useState27, 2),
    selectedId = _useState28[0],
    setSelectedId = _useState28[1];
  var load = function load() {
    window.DB.grantPaymentQueue(sys).then(setRows).catch(function () {
      return setRows([]);
    });
  };
  useEffect(function () {
    setRows(null);
    load();
  }, [sys]);
  var complete = function complete(a) {
    return setConfirm({
      kind: "success",
      title: "Confirm payment completion?",
      message: a.id + " will be recorded as completed (" + fmtBaht(Number(a.approved_amount || a.requested_amount || 0)) + "). This closes the Finance workflow.",
      confirmLabel: "Continue",
      finalConfirm: true,
      reasonLabel: "Payment confirmation",
      onConfirm: function () {
        var _onConfirm8 = _asyncToGenerator(_regenerator().m(function _callee8() {
          var _t8;
          return _regenerator().w(function (_context8) {
            while (1) switch (_context8.p = _context8.n) {
              case 0:
                _context8.p = 0;
                _context8.n = 1;
                return window.DB.completeSingleGrant(a._uuid);
              case 1:
                toast(a.id + " completed.");
                load();
                _context8.n = 3;
                break;
              case 2:
                _context8.p = 2;
                _t8 = _context8.v;
                toast("Error: " + (_t8 && _t8.message || _t8));
              case 3:
                return _context8.a(2);
            }
          }, _callee8, null, [[0, 2]]);
        }));
        function onConfirm() {
          return _onConfirm8.apply(this, arguments);
        }
        return onConfirm;
      }()
    });
  };
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, isR4 ? "AU-R4" : "AU-R3", " Payment Queue"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "text-sm text-muted"
  }, "Select an application to review its information and files.")), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application ID"), React.createElement("th", null, isR4 ? "Article" : "Paper"), React.createElement("th", null, "Researcher"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Approved Amount"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Action"))), React.createElement("tbody", null, rows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "28px",
      color: "var(--ink-3)"
    }
  }, "Loading\u2026")), rows && rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: "center",
      padding: "36px",
      color: "var(--ink-3)"
    }
  }, "No ", isR4 ? "AU-R4" : "AU-R3", " payments waiting.")), (rows || []).map(function (a) {
    var _a$researcher6;
    return React.createElement("tr", {
      key: a.id,
      style: {
        cursor: "pointer"
      },
      onClick: function onClick() {
        return setSelectedId(a._uuid);
      }
    }, React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, a.id)), React.createElement("td", {
      className: "title-cell"
    }, React.createElement("div", {
      className: "t",
      style: {
        maxWidth: 240,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, a.title)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, (_a$researcher6 = a.researcher) === null || _a$researcher6 === void 0 ? void 0 : _a$researcher6.name), React.createElement("td", {
      style: {
        textAlign: "right",
        fontFamily: "ui-monospace, monospace"
      }
    }, fmtBaht(Number(a.approved_amount || a.requested_amount || 0))), React.createElement("td", null, React.createElement(Badge, {
      status: a.statusKey === "completed" ? {
        key: "completed",
        cls: "badge-check",
        label: "Completed"
      } : {
        key: "approved",
        cls: "badge-contract",
        label: "At Finance"
      }
    })), React.createElement("td", {
      className: "actions"
    }, React.createElement("div", {
      className: "flex justify-end gap-2"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick(e) {
        e.stopPropagation();
        setSelectedId(a._uuid);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 12
    }), " View"), (a.statusKey === "approved" || a.statusKey === "active") && React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick(e) {
        e.stopPropagation();
        complete(a);
      }
    }, React.createElement(Icon, {
      name: "CheckCircle",
      size: 12
    }), " Complete"), a.statusKey === "completed" && React.createElement("span", {
      className: "text-sm text-muted",
      style: {
        alignSelf: "center"
      }
    }, "Completed"))));
  })))), React.createElement(FinanceApplicationDetailsModal, {
    applicationId: selectedId,
    onClose: function onClose() {
      return setSelectedId(null);
    },
    onDownload: onDownload,
    onView: onView
  }));
}
function FinanceGrantTabs(_ref11) {
  var sys = _ref11.sys,
    onChange = _ref11.onChange;
  return React.createElement("div", {
    style: {
      display: "inline-flex",
      border: "1px solid var(--line)",
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 8
    }
  }, [{
    id: "au_r3",
    label: "AU-R3"
  }, {
    id: "au_r4",
    label: "AU-R4"
  }].map(function (t) {
    return React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return onChange(t.id);
      },
      style: {
        padding: "7px 15px",
        fontSize: 12,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: sys === t.id ? "var(--au-crimson)" : "transparent",
        color: sys === t.id ? "#fff" : "var(--ink-2)"
      }
    }, t.label);
  }));
}
function FinanceApplicationDetailsModal(_ref12) {
  var _app$researcher2;
  var applicationId = _ref12.applicationId,
    onClose = _ref12.onClose,
    onDownload = _ref12.onDownload,
    onView = _ref12.onView;
  var _useState29 = useState(null),
    _useState30 = _slicedToArray(_useState29, 2),
    app = _useState30[0],
    setApp = _useState30[1];
  var _useState31 = useState(""),
    _useState32 = _slicedToArray(_useState31, 2),
    error = _useState32[0],
    setError = _useState32[1];
  useEffect(function () {
    if (!applicationId) return;
    setApp(null);
    setError("");
    window.DB.financeApplicationDetail(applicationId).then(setApp).catch(function (e) {
      return setError(e && e.message || "Could not load application details.");
    });
  }, [applicationId]);
  var grantLabel = function grantLabel(app) {
    return app && app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  };
  return React.createElement(Modal, {
    open: !!applicationId,
    onClose: onClose,
    title: app ? grantLabel(app) + " · " + app.code : "Application Details",
    className: "finance-detail-modal",
    footer: React.createElement("button", {
      className: "btn btn-secondary",
      onClick: onClose
    }, "Close")
  }, !app && !error && React.createElement("div", {
    style: {
      padding: "16px 0",
      textAlign: "center",
      color: "var(--ink-3)"
    }
  }, "Loading application details\u2026"), error && React.createElement("div", {
    style: {
      color: "var(--au-crimson)",
      lineHeight: 1.55
    }
  }, error), app && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    className: "eyebrow mb-2"
  }, grantLabel(app), " Application"), React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: 21,
      lineHeight: 1.25
    }
  }, app.title || "Untitled application"), React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, React.createElement(Badge, {
    status: app.statusBadge || window.DB.statusBadge(app.status, app.grant_type)
  }))), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Application ID"), React.createElement("span", {
    className: "r"
  }, app.code || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Researcher"), React.createElement("span", {
    className: "r"
  }, ((_app$researcher2 = app.researcher) === null || _app$researcher2 === void 0 ? void 0 : _app$researcher2.full_name) || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Faculty / Department"), React.createElement("span", {
    className: "r"
  }, [app.faculty, app.department].filter(Boolean).join(" / ") || "-")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Submitted"), React.createElement("span", {
    className: "r"
  }, window.DB.fmtDate(app.submitted_at || app.created_at))), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Approved amount"), React.createElement("span", {
    className: "r"
  }, fmtBaht(Number(app.approved_amount || app.requested_amount || 0)))), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Disbursed"), React.createElement("span", {
    className: "r"
  }, fmtBaht(["active", "completed"].includes(app.status) ? Number(app.approved_amount || app.requested_amount || 0) : 0))), React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, React.createElement(AnnualFundingSummaryCard, {
    summary: app.annual_funding,
    currentAmount: Number(app.approved_amount != null ? app.approved_amount : app.requested_amount || 0),
    compact: true
  })), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--line-2)",
      marginTop: 14,
      paddingTop: 12
    }
  }, React.createElement("div", {
    className: "eyebrow mb-2"
  }, "Files"), (app.documents || []).length === 0 && React.createElement("div", {
    className: "text-sm text-muted"
  }, "No files attached to this application."), (app.documents || []).map(function (doc) {
    return React.createElement(FileRow, {
      key: doc.id,
      doc: doc,
      onDownload: onDownload,
      onView: onView
    });
  }))));
}
function OFMTotalSummary(_ref13) {
  var onDownload = _ref13.onDownload,
    onView = _ref13.onView;
  var _useState33 = useState(null),
    _useState34 = _slicedToArray(_useState33, 2),
    apps = _useState34[0],
    setApps = _useState34[1];
  var _useState35 = useState("all"),
    _useState36 = _slicedToArray(_useState35, 2),
    filter = _useState36[0],
    setFilter = _useState36[1];
  var _useState37 = useState(null),
    _useState38 = _slicedToArray(_useState37, 2),
    selectedId = _useState38[0],
    setSelectedId = _useState38[1];
  useEffect(function () {
    window.DB.financeSummaryApplications().then(setApps).catch(function () {
      return setApps([]);
    });
  }, []);
  var rows = (apps || []).filter(function (app) {
    return filter === "all" || app.grant_type === filter;
  });
  var grantLabel = function grantLabel(app) {
    return app.grant_type === "au_r4" ? "AU-R4" : "AU-R3";
  };
  var summaryApps = apps || [];
  var allocated = summaryApps.reduce(function (sum, app) {
    return sum + Number(app.approved_amount || app.requested_amount || 0);
  }, 0);
  var disbursed = summaryApps.filter(function (app) {
    return ["active", "completed"].includes(app.status);
  }).reduce(function (sum, app) {
    return sum + Number(app.approved_amount || app.requested_amount || 0);
  }, 0);
  var summary = [{
    label: "Total Allocated",
    value: apps === null ? "…" : fmtBaht(allocated),
    icon: "Coins"
  }, {
    label: "Disbursed",
    value: apps === null ? "…" : fmtBaht(disbursed),
    icon: "TrendingUp",
    tone: "green"
  }, {
    label: "Active Grants",
    value: apps === null ? "…" : summaryApps.filter(function (app) {
      return ["approved", "active"].includes(app.status);
    }).length,
    icon: "Briefcase",
    tone: "navy"
  }];
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Total Summary",
    desc: "Today\u2019s finance summary for AU-R3 and AU-R4 applications forwarded to Finance."
  }), React.createElement("div", {
    className: "stats",
    style: {
      gridTemplateColumns: "repeat(3, 1fr)"
    }
  }, summary.map(function (item) {
    return React.createElement(Stat, {
      key: item.label,
      label: item.label,
      value: item.value,
      icon: item.icon,
      tone: item.tone
    });
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Applications Forwarded to Finance"), React.createElement("div", {
    className: "grow"
  }), React.createElement("div", {
    style: {
      display: "inline-flex",
      border: "1px solid var(--line)",
      borderRadius: 999,
      overflow: "hidden"
    }
  }, [{
    id: "all",
    label: "All"
  }, {
    id: "au_r3",
    label: "AU-R3"
  }, {
    id: "au_r4",
    label: "AU-R4"
  }].map(function (tab) {
    return React.createElement("button", {
      key: tab.id,
      onClick: function onClick() {
        return setFilter(tab.id);
      },
      style: {
        padding: "7px 12px",
        fontSize: 11,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: filter === tab.id ? "var(--au-crimson)" : "transparent",
        color: filter === tab.id ? "#fff" : "var(--ink-2)"
      }
    }, tab.label);
  }))), React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Application"), React.createElement("th", null, "Researcher"), React.createElement("th", null, "Grant"), React.createElement("th", null, "Submitted"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Amount"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Details"))), React.createElement("tbody", null, apps === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "7",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading applications\u2026")), apps && rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "7",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "No applications have reached Finance in this view.")), rows.map(function (app) {
    var _app$researcher3;
    return React.createElement("tr", {
      key: app.id,
      style: {
        cursor: "pointer"
      },
      onClick: function onClick() {
        return setSelectedId(app.id);
      }
    }, React.createElement("td", null, React.createElement("div", {
      className: "id"
    }, app.code || "-"), React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        marginTop: 3,
        maxWidth: 260,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, app.title || "Untitled application")), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, ((_app$researcher3 = app.researcher) === null || _app$researcher3 === void 0 ? void 0 : _app$researcher3.full_name) || "-"), React.createElement("td", null, React.createElement("span", {
      className: "badge badge-submitted"
    }, React.createElement("span", {
      className: "dot"
    }), grantLabel(app))), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, window.DB.fmtDate(app.submitted_at || app.created_at)), React.createElement("td", {
      style: {
        textAlign: "right",
        fontWeight: 600,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12
      }
    }, fmtBaht(Number(app.approved_amount || app.requested_amount || 0))), React.createElement("td", null, React.createElement(Badge, {
      status: app.statusBadge || window.DB.statusBadge(app.status, app.grant_type)
    })), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick(e) {
        e.stopPropagation();
        setSelectedId(app.id);
      }
    }, React.createElement(Icon, {
      name: "Eye",
      size: 13
    }), " View")));
  }))))), React.createElement(FinanceApplicationDetailsModal, {
    applicationId: selectedId,
    onClose: function onClose() {
      return setSelectedId(null);
    },
    onDownload: onDownload,
    onView: onView
  }));
}
function OFMDashboard(_ref14) {
  var navigate = _ref14.navigate,
    toast = _ref14.toast,
    setConfirm = _ref14.setConfirm,
    grantType = _ref14.grantType,
    onGrantSwitch = _ref14.onGrantSwitch,
    onDownload = _ref14.onDownload,
    onView = _ref14.onView;
  var sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  var isR3 = sys === "au_r3",
    isR4 = sys === "au_r4";
  var _useState39 = useState(null),
    _useState40 = _slicedToArray(_useState39, 2),
    gc = _useState40[0],
    setGc = _useState40[1];
  useEffect(function () {
    setGc(null);
    window.DB.statusCounts(sys).then(setGc).catch(function () {
      return setGc({});
    });
  }, [sys]);
  var gn = function gn(k) {
    return gc ? gc[k] || 0 : "…";
  };
  var sysToggle = React.createElement(FinanceGrantTabs, {
    sys: sys,
    onChange: function onChange(next) {
      return onGrantSwitch(next, "o-dashboard");
    }
  });
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: (isR4 ? "AU-R4" : "AU-R3") + " · Finance Summary",
    desc: "Process payments for IRAS-approved " + (isR4 ? "publication fee and reward" : "paper presentation grant") + " applications.",
    actions: sysToggle
  }), React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "At Finance",
    value: gc ? (gc.approved || 0) + (gc.active || 0) : "…",
    icon: "Clock",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Completed",
    value: gn("completed"),
    icon: "CheckCircle",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "Total",
    value: gc ? (gc.approved || 0) + (gc.active || 0) + (gc.completed || 0) : "…",
    icon: "Coins"
  })), React.createElement(OFMGrantPayments, {
    sys: sys,
    toast: toast,
    setConfirm: setConfirm,
    onDownload: onDownload,
    onView: onView
  }));
}
function OFMHistory(_ref15) {
  var grantType = _ref15.grantType,
    onGrantSwitch = _ref15.onGrantSwitch;
  var sys = ["au_r3", "au_r4"].includes(grantType) ? grantType : "au_r3";
  var _useState41 = useState(null),
    _useState42 = _slicedToArray(_useState41, 2),
    rows = _useState42[0],
    setRows = _useState42[1];
  useEffect(function () {
    setRows(null);
    window.DB.financePaymentHistory(sys).then(setRows).catch(function () {
      return setRows([]);
    });
  }, [sys]);
  var label = sys.replace("au_r", "AU-R").toUpperCase();
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: label + " · Payment History",
    desc: "Only completed " + label + " Finance transactions are shown.",
    actions: React.createElement(FinanceGrantTabs, {
      sys: sys,
      onChange: function onChange(next) {
        return onGrantSwitch(next, "o-history");
      }
    })
  }), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Payment Date"), React.createElement("th", null, "Grant"), React.createElement("th", null, "Application"), React.createElement("th", null, "Researcher"), React.createElement("th", null, "Payment"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Amount"), React.createElement("th", null, "Reference"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Status"))), React.createElement("tbody", null, rows === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading\u2026")), rows && rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "No ", label, " payments processed yet.")), (rows || []).map(function (r) {
    return React.createElement("tr", {
      key: r.key
    }, React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, window.DB.fmtDate(r.paid_at)), React.createElement("td", null, React.createElement("span", {
      className: "badge badge-submitted"
    }, React.createElement("span", {
      className: "dot"
    }), String(r.grant_type || "au_r3").replace("au_r", "AU-R").toUpperCase())), React.createElement("td", null, React.createElement("span", {
      className: "id"
    }, r.code)), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, r.researcher), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, r.payment_label), React.createElement("td", {
      style: {
        textAlign: "right",
        fontWeight: 600
      }
    }, r.amount.toLocaleString(), " THB"), React.createElement("td", null, React.createElement("span", {
      className: "id",
      style: {
        fontSize: 12
      }
    }, r.reference)), React.createElement("td", {
      className: "actions"
    }, React.createElement("span", {
      className: "badge " + (r.status === "completed" ? "badge-check" : "badge-paid")
    }, React.createElement("span", {
      className: "dot"
    }), r.status === "completed" ? "Completed" : "Paid")));
  })))));
}
var ADMIN_ACTIVE_ROLES = ["researcher", "dean", "iras", "ofm", "admin"];
function AdminDashboard(_ref16) {
  var navigate = _ref16.navigate;
  var _useState43 = useState("all"),
    _useState44 = _slicedToArray(_useState43, 2),
    sys = _useState44[0],
    setSys = _useState44[1];
  var isR4 = sys === "au_r4";
  var _useState45 = useState(null),
    _useState46 = _slicedToArray(_useState45, 2),
    c = _useState46[0],
    setC = _useState46[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    profiles = _useState48[0],
    setProfiles = _useState48[1];
  var _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    events = _useState50[0],
    setEvents = _useState50[1];
  useEffect(function () {
    setC(null);
    window.DB.statusCounts(sys === "all" ? undefined : sys).then(setC).catch(function () {
      return setC({});
    });
  }, [sys]);
  useEffect(function () {
    window.DB.allProfiles().then(setProfiles).catch(function () {
      return setProfiles([]);
    });
    window.DB.auditEvents().then(setEvents).catch(function () {
      return setEvents([]);
    });
  }, []);
  var n = function n(k) {
    return c ? c[k] || 0 : "…";
  };
  var totalUsers = profiles ? profiles.length : 0;
  var codePrefix = sys === "au_r4" ? "AU-R4-" : sys === "au_r3" ? "AU-R3-" : null;
  var evFiltered = events === null ? null : codePrefix ? events.filter(function (e) {
    return e.application && (e.application.code || "").indexOf(codePrefix) === 0;
  }) : events;
  var roleList = D.ROLES.filter(function (r) {
    return ADMIN_ACTIVE_ROLES.indexOf(r.key) >= 0;
  });
  var roleRows = profiles === null ? null : roleList.map(function (r) {
    return {
      key: r.key,
      name: r.name,
      count: profiles.filter(function (p) {
        return p.role === r.key;
      }).length
    };
  }).filter(function (r) {
    return r.count > 0;
  });
  var sysToggle = React.createElement("div", {
    style: {
      display: "inline-flex",
      border: "1px solid var(--line)",
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 8
    }
  }, [{
    id: "all",
    label: "All"
  }, {
    id: "au_r3",
    label: "AU-R3"
  }, {
    id: "au_r4",
    label: "AU-R4"
  }].map(function (t) {
    return React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return setSys(t.id);
      },
      style: {
        padding: "7px 13px",
        fontSize: 12,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: sys === t.id ? "var(--au-crimson)" : "transparent",
        color: sys === t.id ? "#fff" : "var(--ink-2)"
      }
    }, t.label);
  }));
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: isR4 ? "AU-R4 · Administrator Dashboard" : "Administrator Dashboard",
    desc: isR4 ? "AU-R4 publication fee and reward statistics, activity, and user roles." : "Users and workflow activity for the AU-RGMS portal.",
    actions: React.createElement(React.Fragment, null, sysToggle, React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        return navigate("a-users");
      }
    }, React.createElement(Icon, {
      name: "UserPlus",
      size: 14
    }), " Manage Users"))
  }), isR4 ? React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Total Users",
    value: profiles ? totalUsers : "…",
    icon: "Users",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "AU-R4 Applications",
    value: n("_total"),
    icon: "Award",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "Under Review",
    value: c ? (c.submitted || 0) + (c.iras_review || 0) + (c.approved || 0) : "…",
    icon: "FileSearch",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Paid / Completed",
    value: c ? (c.active || 0) + (c.completed || 0) : "…",
    icon: "CheckCircle",
    tone: "green"
  })) : React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Total Users",
    value: profiles ? totalUsers : "…",
    icon: "Users",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Applications",
    value: n("_total"),
    icon: "Folder",
    tone: "navy"
  }), React.createElement(Stat, {
    label: "Approved Grants",
    value: n("_approved"),
    icon: "CheckCircle",
    tone: "green"
  }), React.createElement(Stat, {
    label: "Active Grants",
    value: n("active"),
    icon: "TrendingUp",
    tone: "green"
  })), React.createElement("div", {
    className: "grid-2"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Users by Role"), React.createElement("div", {
    className: "grow"
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: function onClick() {
      return navigate("a-users");
    }
  }, "Manage ", React.createElement(Icon, {
    name: "ArrowRight",
    size: 12
  }))), React.createElement("div", {
    className: "card-body"
  }, roleRows === null && React.createElement("div", {
    className: "text-sm text-muted"
  }, "Loading\u2026"), roleRows && roleRows.length === 0 && React.createElement(Empty, {
    title: "No users yet",
    desc: "Create accounts in User Management.",
    icon: "Users"
  }), (roleRows || []).map(function (r) {
    return React.createElement("div", {
      key: r.key,
      style: {
        marginBottom: 12
      }
    }, React.createElement("div", {
      className: "flex justify-between mb-2",
      style: {
        fontSize: 12
      }
    }, React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, r.name), React.createElement("span", {
      className: "text-muted"
    }, r.count, " user", r.count !== 1 ? "s" : "")), React.createElement("div", {
      className: "progress",
      style: {
        height: 5
      }
    }, React.createElement("div", {
      className: "bar",
      style: {
        width: (totalUsers ? Math.round(r.count / totalUsers * 100) : 0) + "%"
      }
    })));
  }))), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Recent Activity"), React.createElement("div", {
    className: "grow"
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: function onClick() {
      return navigate("a-audit");
    }
  }, "See all ", React.createElement(Icon, {
    name: "ArrowRight",
    size: 12
  }))), React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, evFiltered === null && React.createElement("div", {
    style: {
      padding: 20,
      color: "var(--ink-3)",
      fontSize: 13
    }
  }, "Loading activity\u2026"), evFiltered && evFiltered.length === 0 && React.createElement(Empty, {
    title: "No activity yet",
    desc: isR4 ? "AU-R4 workflow actions will appear here." : "Workflow actions will appear here.",
    icon: "Clock"
  }), (evFiltered || []).slice(0, 6).map(function (e, i, arr) {
    return React.createElement("div", {
      key: e.id || i,
      style: {
        padding: "10px 20px",
        borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none",
        display: "flex",
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--paper-warm)",
        color: "var(--ink-2)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0
      }
    }, React.createElement(Icon, {
      name: "Clock",
      size: 12
    })), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--ink-1)"
      }
    }, e.action), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      }
    }, e.actor ? e.actor.full_name : e.actor_role || "System", e.application ? " · " + e.application.code : "", " \xB7 ", window.DB.fmtDate(e.created_at))));
  })))));
}
var ADMIN_ROLE_OPTIONS = [{
  key: "researcher",
  label: "Researcher"
}, {
  key: "dean",
  label: "Dean"
}, {
  key: "iras",
  label: "IRAS (AU-R3 / AU-R4)"
}, {
  key: "ofm",
  label: "OFM / Finance"
}, {
  key: "admin",
  label: "Administrator"
}];
function AdminAddUserForm(_ref17) {
  var onCreated = _ref17.onCreated,
    onClose = _ref17.onClose,
    toast = _ref17.toast;
  var blank = {
    name_title: "",
    full_name: "",
    email: "",
    au_id: "",
    phone: "",
    office_room: "",
    joined_date: "",
    role: "dean",
    faculty: "",
    department: "",
    password: ""
  };
  var _useState51 = useState(blank),
    _useState52 = _slicedToArray(_useState51, 2),
    f = _useState52[0],
    setF = _useState52[1];
  var _useState53 = useState(false),
    _useState54 = _slicedToArray(_useState53, 2),
    busy = _useState54[0],
    setBusy = _useState54[1];
  var set = function set(k, v) {
    return setF(function (s) {
      return Object.assign({}, s, k === "faculty" ? {
        faculty: v,
        department: ""
      } : _defineProperty({}, k, v));
    });
  };
  var needsFaculty = f.role === "dean";
  var depts = (D.FACULTIES.find(function (x) {
    return x.name === f.faculty;
  }) || {
    departments: []
  }).departments;
  var submit = function () {
    var _ref19 = _asyncToGenerator(_regenerator().m(function _callee9() {
      var _t9;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            if (f.full_name.trim()) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2, toast("Enter the full name."));
          case 1:
            if (/^[^@\s]+@au\.edu$/i.test(f.email.trim())) {
              _context9.n = 2;
              break;
            }
            return _context9.a(2, toast("Email must end in @au.edu."));
          case 2:
            if (!(f.phone && !isValidThaiPhone(f.phone))) {
              _context9.n = 3;
              break;
            }
            return _context9.a(2, toast("Phone must be a Thai number with 9–10 digits starting with 0."));
          case 3:
            if (!(needsFaculty && !f.faculty)) {
              _context9.n = 4;
              break;
            }
            return _context9.a(2, toast("Pick a faculty for a Dean account."));
          case 4:
            if (!((f.password || "").length < 8)) {
              _context9.n = 5;
              break;
            }
            return _context9.a(2, toast("Temporary password must be at least 8 characters."));
          case 5:
            setBusy(true);
            _context9.p = 6;
            _context9.n = 7;
            return window.DB.adminCreateUser(f);
          case 7:
            toast(f.full_name + " created as " + f.role + (f.faculty ? " (" + f.faculty + ")" : "") + ".");
            onCreated();
            _context9.n = 9;
            break;
          case 8:
            _context9.p = 8;
            _t9 = _context9.v;
            toast("Error: " + (_t9 && _t9.message || _t9));
          case 9:
            _context9.p = 9;
            setBusy(false);
            return _context9.f(9);
          case 10:
            return _context9.a(2);
        }
      }, _callee9, null, [[6, 8, 9, 10]]);
    }));
    return function submit() {
      return _ref19.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "card card-pad-0 mb-4",
    style: {
      border: "1px solid var(--au-crimson-soft)"
    }
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Add User"), React.createElement("div", {
    className: "grow"
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "X",
    size: 14
  }))), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Title"), React.createElement("select", {
    value: f.name_title,
    onChange: function onChange(e) {
      return set("name_title", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "\u2014"), D.AU_TITLES.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Full Name"), React.createElement("input", {
    value: f.full_name,
    onChange: function onChange(e) {
      return set("full_name", e.target.value);
    },
    placeholder: "e.g. Tanachai Suksawat"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "AU ID"), React.createElement("input", {
    value: f.au_id,
    onChange: function onChange(e) {
      return set("au_id", e.target.value);
    },
    placeholder: "e.g. 5012345"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Email (AU only)"), React.createElement("input", {
    type: "email",
    value: f.email,
    onChange: function onChange(e) {
      return set("email", e.target.value);
    },
    placeholder: "name@au.edu"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Phone"), React.createElement(ThaiPhoneInput, {
    value: f.phone,
    onChange: function onChange(value) {
      return set("phone", value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Office / Room"), React.createElement("input", {
    value: f.office_room,
    onChange: function onChange(e) {
      return set("office_room", e.target.value);
    },
    placeholder: "e.g. Building A, Room 512"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Date Joined Assumption University"), React.createElement(AUDatePicker, {
    value: f.joined_date,
    onChange: function onChange(value) {
      return set("joined_date", value);
    },
    min: "1969-01-01",
    max: new Date().toISOString().slice(0, 10),
    placeholder: "Select joined date\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Role"), React.createElement("select", {
    value: f.role,
    onChange: function onChange(e) {
      return set("role", e.target.value);
    }
  }, ADMIN_ROLE_OPTIONS.map(function (r) {
    return React.createElement("option", {
      key: r.key,
      value: r.key
    }, r.label);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Faculty ", needsFaculty ? "(required)" : "(optional)"), React.createElement("select", {
    value: f.faculty,
    onChange: function onChange(e) {
      return set("faculty", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select faculty\u2026"), D.FACULTIES.map(function (x) {
    return React.createElement("option", {
      key: x.code,
      value: x.name
    }, x.name);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Department"), React.createElement("select", {
    value: f.department,
    onChange: function onChange(e) {
      return set("department", e.target.value);
    },
    disabled: !f.faculty
  }, React.createElement("option", {
    value: ""
  }, f.faculty ? "Select department…" : "Pick a faculty first"), depts.map(function (d) {
    return React.createElement("option", {
      key: d,
      value: d
    }, d);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Temporary password"), React.createElement("input", {
    type: "password",
    autoComplete: "new-password",
    value: f.password,
    onChange: function onChange(e) {
      return set("password", e.target.value);
    },
    placeholder: "At least 8 characters"
  }))), React.createElement("div", {
    className: "flex justify-end gap-2 mt-2"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: busy,
    onClick: submit
  }, React.createElement(Icon, {
    name: "UserPlus",
    size: 14
  }), " ", busy ? "Creating…" : "Create Account"))));
}
function AdminEditUserForm(_ref20) {
  var user = _ref20.user,
    onSaved = _ref20.onSaved,
    onClose = _ref20.onClose,
    toast = _ref20.toast;
  var _useState55 = useState({
      id: user.id,
      name_title: user.name_title || "",
      full_name: user.full_name || "",
      email: user.email || "",
      au_id: user.au_id || "",
      phone: normalizeThaiPhone(user.phone),
      office_room: user.office_room || "",
      joined_date: user.joined_date || "",
      role: user.role || "researcher",
      faculty: user.faculty || "",
      department: user.department || "",
      password: "",
      is_active: user.is_active !== false
    }),
    _useState56 = _slicedToArray(_useState55, 2),
    f = _useState56[0],
    setF = _useState56[1];
  var _useState57 = useState(false),
    _useState58 = _slicedToArray(_useState57, 2),
    busy = _useState58[0],
    setBusy = _useState58[1];
  var set = function set(k, v) {
    return setF(function (s) {
      return Object.assign({}, s, k === "faculty" ? {
        faculty: v,
        department: ""
      } : _defineProperty({}, k, v));
    });
  };
  var needsFaculty = f.role === "dean";
  var depts = (D.FACULTIES.find(function (x) {
    return x.name === f.faculty;
  }) || {
    departments: []
  }).departments;
  var submit = function () {
    var _ref22 = _asyncToGenerator(_regenerator().m(function _callee0() {
      var _t0;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            if (f.full_name.trim()) {
              _context0.n = 1;
              break;
            }
            return _context0.a(2, toast("Enter the full name."));
          case 1:
            if (/^[^@\s]+@au\.edu$/i.test(f.email.trim())) {
              _context0.n = 2;
              break;
            }
            return _context0.a(2, toast("Email must end in @au.edu."));
          case 2:
            if (!(f.phone && !isValidThaiPhone(f.phone))) {
              _context0.n = 3;
              break;
            }
            return _context0.a(2, toast("Phone must be a Thai number with 9–10 digits starting with 0."));
          case 3:
            if (!(needsFaculty && !f.faculty)) {
              _context0.n = 4;
              break;
            }
            return _context0.a(2, toast("Pick a faculty for a Dean account."));
          case 4:
            if (!(f.password && f.password.length < 8)) {
              _context0.n = 5;
              break;
            }
            return _context0.a(2, toast("A new password must be at least 8 characters."));
          case 5:
            setBusy(true);
            _context0.p = 6;
            _context0.n = 7;
            return window.DB.adminUpdateUser(f);
          case 7:
            toast(f.full_name + " updated.");
            onSaved();
            _context0.n = 9;
            break;
          case 8:
            _context0.p = 8;
            _t0 = _context0.v;
            toast("Error: " + (_t0 && _t0.message || _t0));
          case 9:
            _context0.p = 9;
            setBusy(false);
            return _context0.f(9);
          case 10:
            return _context0.a(2);
        }
      }, _callee0, null, [[6, 8, 9, 10]]);
    }));
    return function submit() {
      return _ref22.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "card card-pad-0 mb-4",
    style: {
      border: "1px solid var(--au-crimson-soft)"
    }
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Edit User"), React.createElement("div", {
    className: "grow"
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose,
    "aria-label": "Close edit user"
  }, React.createElement(Icon, {
    name: "X",
    size: 14
  }))), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Title"), React.createElement("select", {
    value: f.name_title,
    onChange: function onChange(e) {
      return set("name_title", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "\u2014"), D.AU_TITLES.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Full Name"), React.createElement("input", {
    value: f.full_name,
    onChange: function onChange(e) {
      return set("full_name", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "AU ID"), React.createElement("input", {
    value: f.au_id,
    onChange: function onChange(e) {
      return set("au_id", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Phone"), React.createElement(ThaiPhoneInput, {
    value: f.phone,
    onChange: function onChange(value) {
      return set("phone", value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Office / Room"), React.createElement("input", {
    value: f.office_room,
    onChange: function onChange(e) {
      return set("office_room", e.target.value);
    },
    placeholder: "e.g. Building A, Room 512"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Email (AU only)"), React.createElement("input", {
    type: "email",
    value: f.email,
    onChange: function onChange(e) {
      return set("email", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Date Joined Assumption University"), React.createElement(AUDatePicker, {
    value: f.joined_date,
    onChange: function onChange(value) {
      return set("joined_date", value);
    },
    min: "1969-01-01",
    max: new Date().toISOString().slice(0, 10),
    placeholder: "Select joined date\u2026"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Role"), React.createElement("select", {
    value: f.role,
    onChange: function onChange(e) {
      return set("role", e.target.value);
    }
  }, ADMIN_ROLE_OPTIONS.map(function (r) {
    return React.createElement("option", {
      key: r.key,
      value: r.key
    }, r.label);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Status"), React.createElement("select", {
    value: f.is_active ? "active" : "inactive",
    onChange: function onChange(e) {
      return set("is_active", e.target.value === "active");
    }
  }, React.createElement("option", {
    value: "active"
  }, "Active"), React.createElement("option", {
    value: "inactive"
  }, "Inactive"))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Faculty ", needsFaculty ? "(required)" : "(optional)"), React.createElement("select", {
    value: f.faculty,
    onChange: function onChange(e) {
      return set("faculty", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "Select faculty\u2026"), D.FACULTIES.map(function (x) {
    return React.createElement("option", {
      key: x.code,
      value: x.name
    }, x.name);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Department"), React.createElement("select", {
    value: f.department,
    onChange: function onChange(e) {
      return set("department", e.target.value);
    },
    disabled: !f.faculty
  }, React.createElement("option", {
    value: ""
  }, f.faculty ? "Select department…" : "Pick a faculty first"), depts.map(function (d) {
    return React.createElement("option", {
      key: d,
      value: d
    }, d);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "New password (optional)"), React.createElement("input", {
    type: "password",
    autoComplete: "new-password",
    value: f.password,
    onChange: function onChange(e) {
      return set("password", e.target.value);
    },
    placeholder: "Leave blank to keep the current password"
  }))), React.createElement("div", {
    className: "flex justify-end gap-2 mt-2"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: busy,
    onClick: submit
  }, React.createElement(Icon, {
    name: "Save",
    size: 14
  }), " ", busy ? "Saving…" : "Save Changes"))));
}
function AdminUsers(_ref23) {
  var toast = _ref23.toast,
    setConfirm = _ref23.setConfirm,
    profile = _ref23.profile;
  var _useState59 = useState(""),
    _useState60 = _slicedToArray(_useState59, 2),
    search = _useState60[0],
    setSearch = _useState60[1];
  var _useState61 = useState(null),
    _useState62 = _slicedToArray(_useState61, 2),
    users = _useState62[0],
    setUsers = _useState62[1];
  var _useState63 = useState(false),
    _useState64 = _slicedToArray(_useState63, 2),
    adding = _useState64[0],
    setAdding = _useState64[1];
  var _useState65 = useState(null),
    _useState66 = _slicedToArray(_useState65, 2),
    editing = _useState66[0],
    setEditing = _useState66[1];
  var load = function load() {
    return window.DB.allProfiles().then(setUsers).catch(function () {
      return setUsers([]);
    });
  };
  useEffect(function () {
    load();
  }, []);
  var filtered = (users || []).filter(function (u) {
    return !search || (u.full_name + u.email + u.role + (u.department || "")).toLowerCase().includes(search.toLowerCase());
  });
  var editUser = function editUser(u) {
    setAdding(false);
    setEditing(u);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  var deleteUser = function deleteUser(u) {
    if (profile && u.id === profile.id) return toast("You cannot delete the account you are currently using.");
    var runDelete = function () {
      var _ref24 = _asyncToGenerator(_regenerator().m(function _callee1() {
        var _t1;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              _context1.n = 1;
              return window.DB.adminDeleteUser(u.id);
            case 1:
              if (editing && editing.id === u.id) setEditing(null);
              toast(u.full_name + " deleted.");
              load();
              _context1.n = 3;
              break;
            case 2:
              _context1.p = 2;
              _t1 = _context1.v;
              toast("Error: " + (_t1 && _t1.message || _t1));
            case 3:
              return _context1.a(2);
          }
        }, _callee1, null, [[0, 2]]);
      }));
      return function runDelete() {
        return _ref24.apply(this, arguments);
      };
    }();
    if (setConfirm) setConfirm({
      kind: "danger",
      title: "Delete user account?",
      message: u.full_name + " (" + u.email + ") will lose access and be removed from User Management. Applications owned by this account will also be permanently removed; historical reviewer/uploader references will be preserved without the user identity. This cannot be undone.",
      confirmLabel: "Delete User",
      onConfirm: runDelete
    });
  };
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "User Management",
    desc: "Create, edit, and delete AU-RGMS accounts, roles, faculty scope, and grant-module access.",
    actions: React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        setEditing(null);
        setAdding(function (a) {
          return !a;
        });
      }
    }, React.createElement(Icon, {
      name: "Plus",
      size: 14
    }), " Add User")
  }), adding && React.createElement(AdminAddUserForm, {
    toast: toast,
    onClose: function onClose() {
      return setAdding(false);
    },
    onCreated: function onCreated() {
      setAdding(false);
      load();
    }
  }), editing && React.createElement(AdminEditUserForm, {
    key: editing.id,
    user: editing,
    toast: toast,
    onClose: function onClose() {
      return setEditing(null);
    },
    onSaved: function onSaved() {
      setEditing(null);
      load();
    }
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
    placeholder: "Search by name, email, role...",
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    }
  })), React.createElement("button", {
    className: "filter active"
  }, React.createElement(Icon, {
    name: "Filter",
    size: 12
  }), " All roles"), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      return toast("Profile export is based on live Supabase profiles.");
    }
  }, React.createElement(Icon, {
    name: "Download",
    size: 12
  }), " Export")), React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "User"), React.createElement("th", null, "Email"), React.createElement("th", null, "Role"), React.createElement("th", null, "Faculty / Department"), React.createElement("th", null, "Grant Access"), React.createElement("th", null, "Status"), React.createElement("th", null, "Created"), React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Actions"))), React.createElement("tbody", null, users === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading users...")), users && filtered.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "8"
  }, React.createElement(Empty, {
    title: "No users found",
    desc: "Try another search.",
    icon: "Users"
  }))), filtered.map(function (u) {
    var grantAccess = u.role === "iras" ? "AU-R3 / AU-R4" : "AU-R3 / AU-R4";
    return React.createElement("tr", {
      key: u.id
    }, React.createElement("td", null, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, React.createElement(Avatar, {
      initials: (u.full_name || "U").split(" ").map(function (p) {
        return p[0];
      }).join("").slice(0, 2).toUpperCase(),
      size: 28,
      color: "var(--au-navy)"
    }), React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, u.full_name), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      },
      className: "id"
    }, String(u.id).slice(0, 8))))), React.createElement("td", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)"
      }
    }, u.email), React.createElement("td", null, React.createElement("span", {
      className: "badge badge-academic",
      style: {
        fontSize: 10
      }
    }, React.createElement("span", {
      className: "dot"
    }), u.role)), React.createElement("td", {
      style: {
        fontSize: 12,
        color: "var(--ink-3)"
      }
    }, u.faculty ? u.faculty + (u.department ? " · " + u.department : "") : u.department || "-"), React.createElement("td", null, React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 999,
        color: "var(--au-crimson)",
        background: "var(--au-crimson-soft)"
      }
    }, grantAccess)), React.createElement("td", null, React.createElement("span", {
      className: "badge " + (u.is_active === false ? "badge-draft" : "badge-check")
    }, React.createElement("span", {
      className: "dot"
    }), u.is_active === false ? "Inactive" : "Active")), React.createElement("td", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      }
    }, window.DB.fmtDate(u.created_at)), React.createElement("td", {
      className: "actions"
    }, React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      "aria-label": "Edit " + u.full_name,
      title: "Edit user",
      onClick: function onClick() {
        return editUser(u);
      }
    }, React.createElement(Icon, {
      name: "Edit",
      size: 13
    })), React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      "aria-label": "Delete " + u.full_name,
      title: profile && u.id === profile.id ? "Current account cannot be deleted" : "Delete user",
      disabled: profile && u.id === profile.id,
      onClick: function onClick() {
        return deleteUser(u);
      }
    }, React.createElement(Icon, {
      name: "Trash",
      size: 13
    }))));
  })))));
}
function AdminAudit() {
  var _useState67 = useState(null),
    _useState68 = _slicedToArray(_useState67, 2),
    events = _useState68[0],
    setEvents = _useState68[1];
  useEffect(function () {
    window.DB.auditEvents().then(setEvents).catch(function () {
      return setEvents([]);
    });
  }, []);
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Audit Log",
    desc: "Live workflow events recorded in Supabase."
  }), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("table", {
    className: "tbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Timestamp"), React.createElement("th", null, "User"), React.createElement("th", null, "Application"), React.createElement("th", null, "Action"))), React.createElement("tbody", null, events === null && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4",
    style: {
      textAlign: "center",
      padding: "32px",
      color: "var(--ink-3)"
    }
  }, "Loading audit events...")), events && events.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4"
  }, React.createElement(Empty, {
    title: "No audit events yet",
    desc: "Workflow actions will appear here.",
    icon: "Clock"
  }))), (events || []).map(function (e) {
    return React.createElement("tr", {
      key: e.id
    }, React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, window.DB.fmtDate(e.created_at)), React.createElement("td", {
      style: {
        fontSize: 12,
        fontWeight: 600
      }
    }, e.actor ? e.actor.full_name : e.actor_role || "-"), React.createElement("td", {
      style: {
        fontSize: 12
      }
    }, e.application ? e.application.code : "-"), React.createElement("td", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)"
      }
    }, e.action));
  })))));
}
function AccountSettings(_ref25) {
  var toast = _ref25.toast;
  var SPLIT_DEFAULT = {
    remuneration: 30,
    equipment: 40,
    travel: 18,
    misc: 12
  };
  var SPLIT_FIELDS = [{
    key: "remuneration",
    label: "Remuneration (research assistant)"
  }, {
    key: "equipment",
    label: "Research equipment"
  }, {
    key: "travel",
    label: "Travel / data collection"
  }, {
    key: "misc",
    label: "Miscellaneous"
  }];
  var _useState69 = useState(null),
    _useState70 = _slicedToArray(_useState69, 2),
    p = _useState70[0],
    setP = _useState70[1];
  var _useState71 = useState({
      name_title: "",
      full_name: "",
      au_id: "",
      phone: ""
    }),
    _useState72 = _slicedToArray(_useState71, 2),
    f = _useState72[0],
    setF = _useState72[1];
  var _useState73 = useState(SPLIT_DEFAULT),
    _useState74 = _slicedToArray(_useState73, 2),
    split = _useState74[0],
    setSplit = _useState74[1];
  var _useState75 = useState(false),
    _useState76 = _slicedToArray(_useState75, 2),
    busy = _useState76[0],
    setBusy = _useState76[1];
  useEffect(function () {
    window.AUTH.profile().then(function (pr) {
      setP(pr);
      if (pr) {
        setF({
          name_title: pr.name_title || "",
          full_name: pr.full_name || "",
          au_id: pr.au_id || "",
          phone: normalizeThaiPhone(pr.phone)
        });
        if (pr.budget_split) setSplit(Object.assign({}, SPLIT_DEFAULT, pr.budget_split));
      }
    }).catch(function () {});
  }, []);
  var set = function set(k, v) {
    return setF(function (s) {
      return Object.assign({}, s, _defineProperty({}, k, v));
    });
  };
  var isResearcher = p && p.role === "researcher";
  var isAdmin = p && p.role === "admin";
  var splitSum = split.remuneration + split.equipment + split.travel + split.misc;
  var save = function () {
    var _ref26 = _asyncToGenerator(_regenerator().m(function _callee10() {
      var _t10;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            if (isAdmin) {
              _context10.n = 1;
              break;
            }
            toast("Account information can only be changed by an administrator.");
            return _context10.a(2);
          case 1:
            if (!(f.phone && !isValidThaiPhone(f.phone))) {
              _context10.n = 2;
              break;
            }
            toast("Phone must be a Thai number with 9–10 digits starting with 0.");
            return _context10.a(2);
          case 2:
            setBusy(true);
            _context10.p = 3;
            _context10.n = 4;
            return window.DB.updateMyProfile(f);
          case 4:
            toast("Your profile has been updated.");
            _context10.n = 6;
            break;
          case 5:
            _context10.p = 5;
            _t10 = _context10.v;
            toast("Error: " + (_t10 && _t10.message || _t10));
          case 6:
            _context10.p = 6;
            setBusy(false);
            return _context10.f(6);
          case 7:
            return _context10.a(2);
        }
      }, _callee10, null, [[3, 5, 6, 7]]);
    }));
    return function save() {
      return _ref26.apply(this, arguments);
    };
  }();
  var roleLabel = (D.ROLES.find(function (r) {
    return r.key === (p && p.role);
  }) || {}).name || p && p.role || "—";
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Account Settings",
    desc: isAdmin ? "Update your administrator profile. Other user accounts are managed in User Management." : "Your account information is managed by the administrator. Contact the administrator to request any change.",
    actions: isAdmin ? React.createElement("button", {
      className: "btn btn-primary",
      disabled: busy || !p,
      onClick: save
    }, busy ? "Saving…" : "Save Changes") : null
  }), React.createElement("div", {
    className: "grid-2"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "My Details")), React.createElement("div", {
    className: "card-body"
  }, !p && React.createElement("div", {
    className: "text-sm text-muted"
  }, "Loading\u2026"), p && isAdmin && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Title"), React.createElement("select", {
    value: f.name_title,
    onChange: function onChange(e) {
      return set("name_title", e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, "\u2014"), D.AU_TITLES.map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Full Name"), React.createElement("input", {
    value: f.full_name,
    onChange: function onChange(e) {
      return set("full_name", e.target.value);
    }
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "AU ID"), React.createElement("input", {
    value: f.au_id,
    onChange: function onChange(e) {
      return set("au_id", e.target.value);
    },
    placeholder: "e.g. 5012345"
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Phone"), React.createElement(ThaiPhoneInput, {
    value: f.phone,
    onChange: function onChange(value) {
      return set("phone", value);
    }
  })))), p && !isAdmin && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Title"), React.createElement("span", {
    className: "r"
  }, p.name_title || "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Full Name"), React.createElement("span", {
    className: "r"
  }, p.full_name || "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "AU ID"), React.createElement("span", {
    className: "r"
  }, p.au_id || "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Phone"), React.createElement("span", {
    className: "r"
  }, p.phone || "—"))))), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Account")), React.createElement("div", {
    className: "card-body"
  }, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Email"), React.createElement("span", {
    className: "r"
  }, p ? p.email : "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Role"), React.createElement("span", {
    className: "r"
  }, roleLabel)), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Faculty"), React.createElement("span", {
    className: "r"
  }, p && p.faculty || "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Department"), React.createElement("span", {
    className: "r"
  }, p && p.department || "—")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Password"), React.createElement("span", {
    className: "r"
  }, "Managed by administrator")), React.createElement("div", {
    className: "text-sm text-muted",
    style: {
      marginTop: 12
    }
  }, isAdmin ? "Use User Management to change account email, role, faculty, status, or password." : "To change your username, password, or any account information, contact the AU-RGMS administrator.")))), isResearcher && React.createElement("div", {
    className: "card card-pad-0 mt-4"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "My Default Budget Split"), React.createElement("div", {
    className: "grow"
  }), React.createElement("span", {
    className: "text-sm text-muted"
  }, "Total ", splitSum, "%")), React.createElement("div", {
    className: "card-body",
    style: {
      paddingBottom: 4
    }
  }, React.createElement("p", {
    className: "text-sm text-muted",
    style: {
      marginTop: 0
    }
  }, "These values are managed by the administrator and pre-fill your application budget. Contact the administrator to request a change.")), React.createElement("div", null, SPLIT_FIELDS.map(function (fd, i) {
    return React.createElement("div", {
      key: fd.key,
      style: {
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        borderTop: "1px solid var(--line-2)"
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 600
      }
    }, fd.label), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, split[fd.key], "%"));
  }))));
}
function compactNumber(n) {
  var v = Number(n || 0);
  if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
  if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1) + "k";
  return String(v);
}
function AnalyticsBars(_ref27) {
  var rows = _ref27.rows,
    _ref27$labelKey = _ref27.labelKey,
    labelKey = _ref27$labelKey === void 0 ? "label" : _ref27$labelKey,
    _ref27$valueKey = _ref27.valueKey,
    valueKey = _ref27$valueKey === void 0 ? "value" : _ref27$valueKey,
    renderValue = _ref27.renderValue,
    emptyTitle = _ref27.emptyTitle,
    emptyDesc = _ref27.emptyDesc;
  var list = (rows || []).filter(function (r) {
    return Number(r[valueKey] || 0) > 0;
  });
  var max = Math.max.apply(Math, [1].concat(_toConsumableArray(list.map(function (r) {
    return Number(r[valueKey] || 0);
  }))));
  if (!list.length) {
    return React.createElement(Empty, {
      title: emptyTitle || "No analytics data yet",
      desc: emptyDesc || "Live records will appear here after users submit data.",
      icon: "BarChart3"
    });
  }
  return React.createElement("div", {
    className: "card-body",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, list.map(function (r, i) {
    var value = Number(r[valueKey] || 0);
    var pct = Math.max(4, Math.round(value / max * 100));
    return React.createElement("div", {
      key: (r[labelKey] || "row") + i
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        fontWeight: 650,
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, r[labelKey]), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--ink-3)",
        fontFamily: "ui-monospace, monospace"
      }
    }, renderValue ? renderValue(r) : compactNumber(value))), React.createElement("div", {
      style: {
        height: 9,
        borderRadius: 999,
        background: "var(--line-2)",
        overflow: "hidden"
      }
    }, React.createElement("div", {
      style: {
        width: pct + "%",
        height: "100%",
        borderRadius: 999,
        background: "var(--au-crimson)"
      }
    })));
  }));
}
function AnalyticsDashboard(_ref28) {
  var role = _ref28.role;
  var _useState77 = useState(null),
    _useState78 = _slicedToArray(_useState77, 2),
    data = _useState78[0],
    setData = _useState78[1];
  useEffect(function () {
    var alive = true;
    Promise.all([window.DB.statusCounts().catch(function () {
      return {};
    }), window.DB.facultyStats().catch(function () {
      return [];
    })]).then(function (_ref29) {
      var _ref30 = _slicedToArray(_ref29, 2),
        counts = _ref30[0],
        faculties = _ref30[1];
      if (!alive) return;
      setData({
        counts: counts,
        faculties: faculties
      });
    });
    return function () {
      alive = false;
    };
  }, [role]);
  var c = data ? data.counts : {};
  var faculties = data ? data.faculties : [];
  var statusRows = Object.keys(c || {}).filter(function (k) {
    return k.charAt(0) !== "_";
  }).map(function (k) {
    return {
      label: window.DB.statusBadge(k).label,
      value: c[k]
    };
  }).sort(function (a, b) {
    return Number(b.value || 0) - Number(a.value || 0);
  });
  var budgetRows = faculties.map(function (f) {
    return {
      faculty: f.faculty,
      requested_sum: Number(f.requested_sum || 0),
      approved_sum: Number(f.approved_sum || 0)
    };
  }).sort(function (a, b) {
    return b.requested_sum - a.requested_sum;
  });
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "AI Analytics",
    desc: "Live Supabase analytics for AU-R3 and AU-R4 applications and payments.",
    actions: React.createElement(React.Fragment, null, React.createElement(Badge, {
      status: {
        label: "Live data",
        cls: "badge-academic"
      }
    }), React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        return window.dispatchEvent(new CustomEvent("au-ai-toggle"));
      }
    }, React.createElement(Icon, {
      name: "Bot",
      size: 14
    }), " Ask AU AI"))
  }), React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Applications",
    value: data ? c._total || 0 : "...",
    icon: "Folder"
  }), React.createElement(Stat, {
    label: "Under Review",
    value: data ? c._underReview || 0 : "...",
    icon: "FileSearch",
    tone: "gold"
  }), React.createElement(Stat, {
    label: "Approved / Active",
    value: data ? c._approved || 0 : "...",
    icon: "CheckCircle",
    tone: "green"
  })), React.createElement("div", {
    className: "grid-2"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Applications by Faculty")), React.createElement(AnalyticsBars, {
    rows: faculties.slice(0, 8),
    labelKey: "faculty",
    valueKey: "total",
    renderValue: function renderValue(r) {
      return r.total + " apps";
    },
    emptyTitle: "No application analytics yet"
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Workflow Status")), React.createElement(AnalyticsBars, {
    rows: statusRows,
    valueKey: "value",
    renderValue: function renderValue(r) {
      return r.value + " apps";
    },
    emptyTitle: "No workflow data yet"
  }))), React.createElement("div", {
    className: "mt-4"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Requested Budget by Faculty")), React.createElement(AnalyticsBars, {
    rows: budgetRows.slice(0, 8),
    labelKey: "faculty",
    valueKey: "requested_sum",
    renderValue: function renderValue(r) {
      return fmtBaht(r.requested_sum);
    },
    emptyTitle: "No budget data yet"
  }))));
}
function RoleAnalyticsDashboard(_ref31) {
  var role = _ref31.role;
  var _useState79 = useState(null),
    _useState80 = _slicedToArray(_useState79, 2),
    data = _useState80[0],
    setData = _useState80[1];
  var _useState81 = useState(""),
    _useState82 = _slicedToArray(_useState81, 2),
    error = _useState82[0],
    setError = _useState82[1];
  useEffect(function () {
    var alive = true;
    setData(null);
    setError("");
    window.DB.roleAnalyticsSnapshot().then(function (result) {
      if (alive) setData(result);
    }).catch(function (err) {
      if (alive) setError(err && err.message || "Analytics could not be loaded.");
    });
    return function () {
      alive = false;
    };
  }, [role]);
  var config = {
    dean: {
      title: "Dean Analytics",
      desc: "Faculty-only analytics for AU-R3 and AU-R4 applications.",
      pending: "Awaiting Dean Review",
      groupTitle: "Top Approved Spending by Department",
      groupKey: "byDepartment"
    },
    iras: {
      title: "IRAS Analytics",
      desc: "University-wide AU-R3 and AU-R4 verification and funding analytics.",
      pending: "Awaiting IRAS Verification",
      groupTitle: "Top Approved Spending by Faculty",
      groupKey: "byFaculty"
    },
    ofm: {
      title: "Finance Analytics",
      desc: "University-wide analytics for applications forwarded to Finance.",
      pending: "Awaiting Payment",
      groupTitle: "Top Disbursement by Faculty",
      groupKey: "byFaculty"
    }
  }[role] || {
    title: "Role Analytics",
    desc: "Role-scoped analytics.",
    pending: "Pending",
    groupTitle: "Top Spending",
    groupKey: "byFaculty"
  };
  if (error) return React.createElement(Empty, {
    title: "Analytics unavailable",
    desc: error,
    icon: "BarChart3"
  });
  var totals = data ? data.totals : {};
  var groups = data ? data[config.groupKey] || [] : [];
  var spendKey = role === "ofm" ? "paid" : "approved";
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: config.title,
    desc: config.desc,
    actions: React.createElement(Badge, {
      status: {
        label: data ? data.scope : "Loading live data",
        cls: "badge-academic"
      }
    })
  }), React.createElement("div", {
    className: "stats"
  }, React.createElement(Stat, {
    label: "Applications",
    value: data ? totals.applications : "…",
    icon: "Folder"
  }), React.createElement(Stat, {
    label: config.pending,
    value: data ? role === "ofm" ? totals.pendingPayment : totals.pendingReview : "…",
    icon: "Clock",
    tone: "gold"
  }), React.createElement(Stat, {
    label: role === "ofm" ? "Disbursed" : "Approved Amount",
    value: data ? fmtBaht(role === "ofm" ? totals.paid : totals.approved) : "…",
    icon: "Coins",
    tone: "green"
  })), React.createElement("div", {
    className: "grid-2"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Workflow Status")), React.createElement(AnalyticsBars, {
    rows: data ? data.byStatus : [],
    valueKey: "value",
    renderValue: function renderValue(r) {
      return r.value + " apps";
    },
    emptyTitle: "No workflow data yet"
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "AU-R3 / AU-R4 Mix")), React.createElement(AnalyticsBars, {
    rows: data ? data.byGrant : [],
    valueKey: "total",
    renderValue: function renderValue(r) {
      return r.total + " apps";
    },
    emptyTitle: "No grant data yet"
  }))), React.createElement("div", {
    className: "mt-4 grid-2"
  }, React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, config.groupTitle)), React.createElement(AnalyticsBars, {
    rows: groups.slice(0, 8),
    valueKey: spendKey,
    renderValue: function renderValue(r) {
      return fmtBaht(r[spendKey]);
    },
    emptyTitle: "No spending data yet"
  })), React.createElement("div", {
    className: "card card-pad-0"
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Recent Role Activity")), React.createElement("div", {
    className: "card-body",
    style: {
      padding: 0
    }
  }, !data ? React.createElement("div", {
    style: {
      padding: 28,
      color: "var(--ink-3)"
    }
  }, "Loading live records\u2026") : !(data.recentApplications || []).length ? React.createElement("div", {
    style: {
      padding: 28,
      color: "var(--ink-3)"
    }
  }, "No applications in this role scope yet.") : (data.recentApplications || []).map(function (app) {
    return React.createElement("div", {
      key: app.code,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "13px 18px",
        borderBottom: "1px solid var(--line-2)"
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700
      }
    }, app.code, " \xB7 ", app.title), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        marginTop: 3
      }
    }, app.grant, " \xB7 ", role === "dean" ? app.department : app.faculty)), React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      }
    }, app.status), React.createElement("span", {
      style: {
        fontSize: 11,
        fontFamily: "ui-monospace, monospace",
        minWidth: 88,
        textAlign: "right"
      }
    }, fmtBaht(app.amount)));
  })))));
}
function RoleAIChatbotPage(_ref32) {
  var role = _ref32.role;
  var config = {
    dean: {
      title: "Dean AI Chatbot",
      desc: "Chat with AU AI about live AU-R3 and AU-R4 data from your assigned faculty."
    },
    iras: {
      title: "IRAS AI Chatbot",
      desc: "Chat with AU AI about university-wide AU-R3 and AU-R4 verification data."
    },
    ofm: {
      title: "Finance AI Chatbot",
      desc: "Chat with AU AI about applications forwarded to Finance, payments, and disbursements."
    }
  }[role];
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: config.title,
    desc: config.desc
  }), React.createElement("div", {
    id: "role-ai-chat-host",
    className: "role-ai-chat-host",
    "aria-live": "polite"
  }));
}
function Toggle(_ref33) {
  var _ref33$defaultOn = _ref33.defaultOn,
    defaultOn = _ref33$defaultOn === void 0 ? false : _ref33$defaultOn;
  var _useState83 = useState(defaultOn),
    _useState84 = _slicedToArray(_useState83, 2),
    on = _useState84[0],
    setOn = _useState84[1];
  return React.createElement("button", {
    onClick: function onClick() {
      return setOn(function (o) {
        return !o;
      });
    },
    style: {
      width: 40,
      height: 22,
      borderRadius: 999,
      background: on ? "var(--au-crimson)" : "var(--line)",
      border: "none",
      padding: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: on ? "flex-end" : "flex-start",
      transition: "background .15s",
      cursor: "pointer"
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,.2)"
    }
  }));
}
Object.assign(window, {
  DeanDashboard: DeanDashboard,
  DeanHistory: DeanHistory,
  DeanR3Queue: DeanR3Queue,
  DeanR4Queue: DeanR4Queue,
  IRASDashboard: IRASDashboard,
  IRASr3Detail: IRASr3Detail,
  IRASr4Detail: IRASr4Detail,
  OFMDashboard: OFMDashboard,
  OFMTotalSummary: OFMTotalSummary,
  OFMHistory: OFMHistory,
  AdminDashboard: AdminDashboard,
  AdminUsers: AdminUsers,
  AdminAudit: AdminAudit,
  AnalyticsDashboard: AnalyticsDashboard,
  RoleAnalyticsDashboard: RoleAnalyticsDashboard,
  RoleAIChatbotPage: RoleAIChatbotPage,
  AccountSettings: AccountSettings
});
