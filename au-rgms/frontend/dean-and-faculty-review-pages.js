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
var FA = window.AU;
function LiveAppLoader(_ref) {
  var status = _ref.status,
    grantType = _ref.grantType,
    applicationId = _ref.applicationId,
    strictStatus = _ref.strictStatus,
    title = _ref.title,
    desc = _ref.desc,
    render = _ref.render;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    app = _useState2[0],
    setApp = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var load = function load() {
    setLoading(true);
    var req = applicationId ? window.DB.applicationDetail(applicationId) : window.DB.firstApplicationForStatus(status, grantType);
    req.then(function (result) {
      var wrongGrant = !!(result && grantType && result.grant_type !== grantType);
      var wrongStatus = !!(result && strictStatus && status && result.status !== status);
      setApp(wrongGrant || wrongStatus ? null : result);
    }).catch(function () {
      return setApp(null);
    }).finally(function () {
      return setLoading(false);
    });
  };
  useEffect(function () {
    load();
  }, [status, grantType, applicationId, strictStatus]);
  if (loading) {
    return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
      title: title,
      desc: desc
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
      title: title,
      desc: desc
    }), React.createElement("div", {
      className: "card"
    }, React.createElement(Empty, {
      title: "Nothing in this queue",
      desc: "Applications will appear here when they reach this stage.",
      icon: "Folder"
    })));
  }
  return render(app, load);
}
function r3Badge(status) {
  var base = window.DB.statusBadge(status);
  var labels = {
    submitted: "Pending Dean Review",
    iras_review: "Under IRAS Review",
    approved: "Awaiting Academic Approval",
    active: "Paid",
    completed: "Paid / Completed",
    returned: "Returned for Revision",
    rejected: "Rejected"
  };
  return {
    key: base.key,
    cls: base.cls,
    label: labels[status] || base.label
  };
}
function DeanR3Detail(_ref2) {
  var applicationId = _ref2.applicationId,
    navigate = _ref2.navigate,
    onDownload = _ref2.onDownload,
    onView = _ref2.onView,
    toast = _ref2.toast,
    setConfirm = _ref2.setConfirm;
  return React.createElement(LiveAppLoader, {
    status: "submitted",
    grantType: "au_r3",
    strictStatus: true,
    applicationId: applicationId,
    title: "AU-R3 \xB7 Dean Review",
    desc: "Review the conference, paper, conference qualities, and documents before forwarding to IRAS.",
    render: function render(app, load) {
      var docs = app.documents || [];
      var ci = app.conference_info || {};
      var r = app.researcher || {};
      var hasDoc = function hasDoc(kw) {
        return docs.some(function (d) {
          return ((d.doc_type || "") + " " + (d.name || "")).toLowerCase().includes(kw);
        });
      };
      var docCats = [{
        label: "Full Conference Paper",
        required: true,
        ok: hasDoc("conference paper") || hasDoc("full paper")
      }, {
        label: "Turnitin Report",
        required: true,
        ok: hasDoc("turnitin")
      }, {
        label: "Conference Acceptance Letter",
        required: true,
        ok: hasDoc("acceptance")
      }];
      var forward = function forward() {
        return setConfirm({
          kind: "success",
          title: "Approve & forward to IRAS?",
          message: app.code + " will be recorded as approved by the Dean and sent to IRAS for eligibility and document verification.",
          confirmLabel: "Approve & Forward",
          withReason: true,
          reasonLabel: "Dean comment",
          onConfirm: function () {
            var _onConfirm = _asyncToGenerator(_regenerator().m(function _callee(reason) {
              var _t;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.p = _context.n) {
                  case 0:
                    _context.p = 0;
                    _context.n = 1;
                    return window.DB.transition(app.id, "submitted", "advance", reason);
                  case 1:
                    toast(app.code + " approved — forwarded to IRAS.");
                    navigate("d-r3-screen");
                    _context.n = 3;
                    break;
                  case 2:
                    _context.p = 2;
                    _t = _context.v;
                    toast("Error: " + (_t && _t.message || _t));
                    load();
                  case 3:
                    return _context.a(2);
                }
              }, _callee, null, [[0, 2]]);
            }));
            function onConfirm(_x) {
              return _onConfirm.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var ret = function ret() {
        return setConfirm({
          kind: "danger",
          title: "Return for revision?",
          message: app.code + " will be sent back to the researcher. Explain what needs to be fixed (for example, a clearer Turnitin report or corrected conference qualities).",
          confirmLabel: "Return",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "Dean comment",
          finalConfirm: true,
          onConfirm: function () {
            var _onConfirm2 = _asyncToGenerator(_regenerator().m(function _callee2(reason) {
              var _t2;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.p = _context2.n) {
                  case 0:
                    _context2.p = 0;
                    _context2.n = 1;
                    return window.DB.transition(app.id, "submitted", "return", reason);
                  case 1:
                    toast(app.code + " returned for revision.");
                    navigate("d-r3-screen");
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
            function onConfirm(_x2) {
              return _onConfirm2.apply(this, arguments);
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
          reasonLabel: "Dean rejection reason",
          finalConfirm: true,
          onConfirm: function () {
            var _onConfirm3 = _asyncToGenerator(_regenerator().m(function _callee3(reason) {
              var _t3;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.p = _context3.n) {
                  case 0:
                    _context3.p = 0;
                    _context3.n = 1;
                    return window.DB.transition(app.id, "submitted", "reject", reason);
                  case 1:
                    toast(app.code + " rejected.");
                    navigate("d-r3-screen");
                    _context3.n = 3;
                    break;
                  case 2:
                    _context3.p = 2;
                    _t3 = _context3.v;
                    toast("Error: " + (_t3 && _t3.message || _t3));
                    load();
                  case 3:
                    return _context3.a(2);
                }
              }, _callee3, null, [[0, 2]]);
            }));
            function onConfirm(_x3) {
              return _onConfirm3.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var intl = ci.confType === "International";
      return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
        title: "AU-R3 · Dean Review — " + app.code,
        desc: (ci.researcherName || r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department"),
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
      }, React.createElement("h3", null, "Conference Information"), React.createElement("div", {
        className: "grow"
      }), ci.confType && React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: 999,
          color: intl ? "var(--au-crimson)" : "var(--au-gold-deep)",
          background: intl ? "var(--au-crimson-soft)" : "var(--au-gold-soft)"
        }
      }, ci.confType)), React.createElement("div", {
        className: "card-body"
      }, !app.conference_info && React.createElement("div", {
        style: {
          color: "var(--ink-3)",
          fontSize: 13
        }
      }, "No conference details were entered (older submission)."), app.conference_info && React.createElement(React.Fragment, null, React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Conference name"), React.createElement("span", {
        className: "r"
      }, ci.confName || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Organizer"), React.createElement("span", {
        className: "r"
      }, ci.organizer || "-")), ci.website && React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Website"), React.createElement("span", {
        className: "r"
      }, ci.website)), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Conference location"), React.createElement("span", {
        className: "r"
      }, ci.conferenceLocation || [ci.city, ci.country].filter(Boolean).join(", ") || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Presentation date"), React.createElement("span", {
        className: "r"
      }, ci.presentationDate || ci.confStart ? window.DB.fmtDate(ci.presentationDate || ci.confStart) : "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Presentation type"), React.createElement("span", {
        className: "r"
      }, ci.presentation || "Oral Presentation"))))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Research Paper Information")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Paper title"), React.createElement("span", {
        className: "r"
      }, app.title)), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Research field"), React.createElement("span", {
        className: "r"
      }, app.field || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Author(s)"), React.createElement("span", {
        className: "r"
      }, [(ci.researcherName || r.full_name) + " (" + (ci.authorType || "Lead Author") + ")"].concat((app.co_members || []).map(function (m) {
        return m.name + " (" + (m.authorType || "Co-author") + ")" + (m.kind === "Student" ? " · Student" : "");
      })).filter(Boolean).join(", "))), ci.paperAbstract && React.createElement(React.Fragment, null, React.createElement("div", {
        className: "eyebrow mt-4 mb-2"
      }, "Abstract"), React.createElement("p", {
        style: {
          margin: 0,
          lineHeight: 1.65,
          color: "var(--ink-2)"
        }
      }, ci.paperAbstract)), React.createElement("div", {
        className: "meta-row",
        style: {
          marginTop: 10
        }
      }, React.createElement("span", {
        className: "l"
      }, "Keywords"), React.createElement("span", {
        className: "r"
      }, app.keywords || "-")))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Researcher Information")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Name"), React.createElement("span", {
        className: "r"
      }, (r.name_title || r.title ? (r.name_title || r.title) + " " : "") + (r.full_name || "-"))), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Academic / administrative position"), React.createElement("span", {
        className: "r"
      }, r.academic_position || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "AU ID"), React.createElement("span", {
        className: "r"
      }, r.au_id || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Email"), React.createElement("span", {
        className: "r"
      }, r.email || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Phone"), React.createElement("span", {
        className: "r"
      }, r.phone || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Office / Room"), React.createElement("span", {
        className: "r"
      }, r.office_room || "-")), React.createElement("div", {
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
      }, app.department || "-")), React.createElement(ResearcherServiceEligibilityRows, {
        app: app
      }))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Conference Qualities")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Conference Database / Index"), React.createElement("span", {
        className: "r"
      }, ci.journalDb || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Qualities"), React.createElement("span", {
        className: "r"
      }, ci.journalClassification || "-")), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Fixed AU-R3 grant"), React.createElement("span", {
        className: "r"
      }, fmtBaht(3500))))), React.createElement("div", {
        className: "card card-pad-0"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Submitted Documents"), React.createElement("div", {
        className: "grow"
      }), React.createElement("span", {
        className: "text-sm text-muted"
      }, docs.length, " uploaded")), React.createElement("table", {
        className: "tbl"
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Document"), React.createElement("th", null, "Requirement"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, docCats.map(function (dc) {
        return React.createElement("tr", {
          key: dc.label
        }, React.createElement("td", null, dc.label), React.createElement("td", {
          style: {
            fontSize: 12,
            color: dc.required ? "var(--au-crimson)" : "var(--ink-3)",
            fontWeight: dc.required ? 600 : 400
          }
        }, dc.required ? "Required" : "Optional"), React.createElement("td", null, React.createElement("span", {
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: dc.ok ? "var(--status-approved, #2c7a4b)" : "var(--ink-3)"
          }
        }, React.createElement(Icon, {
          name: dc.ok ? "CheckCircle" : "AlertCircle",
          size: 14
        }), " ", dc.ok ? "Uploaded" : "Not provided")));
      }))), React.createElement("div", null, docs.length === 0 && React.createElement(Empty, {
        title: "No uploaded documents",
        desc: "The researcher has not uploaded any PDF documents for this request.",
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
      }, React.createElement("h3", null, "Dean Decision")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("div", {
        className: "flex flex-col gap-2"
      }, React.createElement("button", {
        className: "btn btn-primary btn-block",
        onClick: forward
      }, React.createElement(Icon, {
        name: "Send",
        size: 14
      }), " Approve & Forward to IRAS"), React.createElement("button", {
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
function r4Badge(status) {
  var base = window.DB.statusBadge(status);
  var labels = {
    submitted: "Pending Dean Review",
    iras_review: "Under IRAS Verification",
    approved: "Awaiting Academic Payment",
    active: "Paid",
    completed: "Paid / Completed",
    returned: "Returned for Revision",
    rejected: "Rejected"
  };
  return {
    key: base.key,
    cls: base.cls,
    label: labels[status] || base.label
  };
}
function DeanR4Detail(_ref3) {
  var applicationId = _ref3.applicationId,
    navigate = _ref3.navigate,
    onDownload = _ref3.onDownload,
    onView = _ref3.onView,
    toast = _ref3.toast,
    setConfirm = _ref3.setConfirm;
  return React.createElement(LiveAppLoader, {
    status: "submitted",
    grantType: "au_r4",
    strictStatus: true,
    applicationId: applicationId,
    title: "AU-R4 \xB7 Dean Review",
    desc: "Review the publication, journal, author, claim and supporting documents, then forward the application to IRAS.",
    render: function render(app, load) {
      var docs = app.documents || [];
      var pi = app.pub_info || {};
      var authors = Array.isArray(app.co_members) ? app.co_members : [];
      var requested = Number(app.requested_amount || 0);
      var MAX = 80000;
      var r = app.researcher || {};
      var hasDoc = function hasDoc(kw) {
        return docs.some(function (d) {
          return ((d.doc_type || "") + " " + (d.name || "")).toLowerCase().includes(kw);
        });
      };
      var docCats = [{
        label: "Full Research Article",
        req: true,
        ok: hasDoc("article")
      }, {
        label: "Turnitin Report",
        req: true,
        ok: hasDoc("turnitin")
      }, {
        label: "Original Publication Fee Receipt",
        req: true,
        ok: hasDoc("receipt")
      }, {
        label: "Author Contribution Statement",
        req: authors.length > 1,
        ok: authors.length <= 1 || hasDoc("author contribution")
      }, {
        label: "Acceptance Letter",
        req: pi.pubStatus !== "Published",
        ok: pi.pubStatus === "Published" || hasDoc("acceptance")
      }];
      var turnitin = Number(pi.turnitin || 0);
      var turnitinBad = turnitin > 20;
      var overMax = requested > MAX;
      var totalContrib = Math.round(Number(pi.totalContribution || authors.reduce(function (s, a) {
        return s + (Number(a.contribution) || 0);
      }, 0)));
      var forward = function forward() {
        return setConfirm({
          kind: "success",
          title: "Confirm AU-R4 Approval",
          message: "By approving, you confirm the Dean Review is complete. IRAS will verify the application next.",
          confirmLabel: "Confirm & Forward to IRAS",
          withReason: true,
          reasonLabel: "Dean comment",
          onConfirm: function () {
            var _onConfirm4 = _asyncToGenerator(_regenerator().m(function _callee4(reason) {
              var _t4;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.p = _context4.n) {
                  case 0:
                    _context4.p = 0;
                    _context4.n = 1;
                    return window.DB.transition(app.id, "submitted", "advance", reason || "");
                  case 1:
                    toast(app.code + " approved — forwarded to IRAS.");
                    navigate("d-r4-screen");
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
            function onConfirm(_x4) {
              return _onConfirm4.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var ret = function ret() {
        return setConfirm({
          kind: "danger",
          title: "Return for Revision?",
          message: app.code + " will be returned to the researcher. State what must be corrected (e.g. upload the original receipt, fix the author contribution percentages).",
          confirmLabel: "Return",
          withReason: true,
          reasonRequired: true,
          reasonLabel: "Dean comment",
          finalConfirm: true,
          onConfirm: function () {
            var _onConfirm5 = _asyncToGenerator(_regenerator().m(function _callee5(reason) {
              var _t5;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.p = _context5.n) {
                  case 0:
                    _context5.p = 0;
                    _context5.n = 1;
                    return window.DB.transition(app.id, "submitted", "return", reason);
                  case 1:
                    toast(app.code + " returned for revision.");
                    navigate("d-r4-screen");
                    _context5.n = 3;
                    break;
                  case 2:
                    _context5.p = 2;
                    _t5 = _context5.v;
                    toast("Error: " + (_t5 && _t5.message || _t5));
                    load();
                  case 3:
                    return _context5.a(2);
                }
              }, _callee5, null, [[0, 2]]);
            }));
            function onConfirm(_x5) {
              return _onConfirm5.apply(this, arguments);
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
          reasonLabel: "Dean rejection reason",
          finalConfirm: true,
          onConfirm: function () {
            var _onConfirm6 = _asyncToGenerator(_regenerator().m(function _callee6(reason) {
              var _t6;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.p = _context6.n) {
                  case 0:
                    _context6.p = 0;
                    _context6.n = 1;
                    return window.DB.transition(app.id, "submitted", "reject", reason);
                  case 1:
                    toast(app.code + " rejected.");
                    navigate("d-r4-screen");
                    _context6.n = 3;
                    break;
                  case 2:
                    _context6.p = 2;
                    _t6 = _context6.v;
                    toast("Error: " + (_t6 && _t6.message || _t6));
                    load();
                  case 3:
                    return _context6.a(2);
                }
              }, _callee6, null, [[0, 2]]);
            }));
            function onConfirm(_x6) {
              return _onConfirm6.apply(this, arguments);
            }
            return onConfirm;
          }()
        });
      };
      var row = function row(l, v) {
        return React.createElement("div", {
          className: "meta-row"
        }, React.createElement("span", {
          className: "l"
        }, l), React.createElement("span", {
          className: "r"
        }, v || "-"));
      };
      return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
        title: "AU-R4 · Dean Review — " + app.code,
        desc: (r.full_name || "Researcher") + " · " + (app.faculty || "Faculty") + " · " + (app.department || "Department") + " · " + (pi.journal || ""),
        actions: React.createElement(Badge, {
          status: r4Badge(app.status)
        })
      }), React.createElement("div", {
        className: "mb-4"
      }, React.createElement(AnnualFundingSummaryCard, {
        summary: app.annual_funding,
        currentAmount: Number(app.requested_amount || 0),
        compact: true
      })), React.createElement("div", {
        className: "grid-2"
      }, React.createElement("div", null, React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Publication Information")), React.createElement("div", {
        className: "card-body"
      }, row("Article title", app.title), row("Article type", pi.articleType), row("Publication status", pi.pubStatus), row("Journal", pi.journal), row("Publisher", pi.publisher), pi.pubStatus === "Published" ? React.createElement(React.Fragment, null, row("Article URL", pi.articleUrl), row("DOI", pi.doi), row("ISSN / eISSN", pi.issn), row("Publication date", pi.pubDate ? window.DB.fmtDate(pi.pubDate) : "-"), row("Volume / Issue", (pi.volume || "-") + " / " + (pi.issue || "-")), row("Page number(s)", pi.pageNumber || [pi.startPage, pi.endPage].filter(Boolean).join("–"))) : React.createElement(React.Fragment, null, row("Acceptance date", pi.acceptDate ? window.DB.fmtDate(pi.acceptDate) : "-")), row("Academic year (AD)", pi.academicYear))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Journal Classification")), React.createElement("div", {
        className: "card-body"
      }, row("Database / index", pi.journalDb), row("Qualities", pi.journalClassification || pi.openAccess), row("Publication fee", fmtBaht(Number(pi.feePaid || 0))), row("Predatory-journal declaration", pi.predatory ? "Confirmed not predatory" : "Not confirmed"))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Author & Contribution"), React.createElement("div", {
        className: "grow"
      }), React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: totalContrib === 100 ? "var(--status-approved)" : "var(--au-crimson)"
        }
      }, totalContrib === 100 ? "Valid" : "Requires verification")), React.createElement("div", {
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
      }, row("Applicant role", pi.applicantRole)), React.createElement("table", {
        className: "tbl"
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Author"), React.createElement("th", null, "Role"), React.createElement("th", null, "Email Address"), React.createElement("th", {
        style: {
          textAlign: "right"
        }
      }, "Contrib %"))), React.createElement("tbody", null, authors.map(function (a, i) {
        return React.createElement("tr", {
          key: i
        }, React.createElement("td", null, a.name), React.createElement("td", {
          style: {
            fontSize: 12
          }
        }, /corresponding/i.test(a.type || "") ? "Co-author" : a.type), React.createElement("td", {
          style: {
            fontSize: 12
          }
        }, a.email || "—"), React.createElement("td", {
          style: {
            textAlign: "right"
          }
        }, a.contribution || 0, "%"));
      }), React.createElement("tr", {
        style: {
          background: "var(--paper-warm)",
          fontWeight: 600
        }
      }, React.createElement("td", {
        colSpan: "3"
      }, "Total"), React.createElement("td", {
        style: {
          textAlign: "right",
          color: totalContrib === 100 ? "inherit" : "var(--au-crimson)"
        }
      }, totalContrib, "%")))))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Researcher Information")), React.createElement("div", {
        className: "card-body"
      }, row("Name", (r.name_title || r.title ? (r.name_title || r.title) + " " : "") + (pi.researcherName || r.full_name || "-")), row("Academic / administrative position", r.academic_position), row("AU ID", pi.researcherAuId || r.au_id), row("Email", pi.contactEmail || r.email), row("Phone", r.phone), row("Faculty", app.faculty), row("Department", app.department), React.createElement(ResearcherServiceEligibilityRows, {
        app: app
      }))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Publication Fee")), React.createElement("div", {
        className: "card-body"
      }, row("Publication fee", fmtBaht(Number(pi.feePaid || 0))), row("Requested amount", fmtBaht(requested)), row("Maximum AU-R4 amount", "80,000 THB per article"), React.createElement("div", {
        className: "meta-row"
      }, React.createElement("span", {
        className: "l"
      }, "Final IRAS-approved amount"), React.createElement("span", {
        className: "r",
        style: {
          color: "var(--ink-3)"
        }
      }, "Pending IRAS verification")), overMax && React.createElement("div", {
        style: {
          fontSize: 12,
          color: "var(--au-crimson)",
          background: "var(--au-crimson-soft)",
          padding: "8px 12px",
          borderRadius: "var(--r-md)",
          marginTop: 8
        }
      }, "The requested claim exceeds the AU-R4 maximum of 80,000 THB. Return the application for correction."))), React.createElement("div", {
        className: "card card-pad-0 mb-4"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Turnitin")), React.createElement("div", {
        className: "card-body"
      }, row("Researcher-entered similarity", pi.turnitin != null ? pi.turnitin + "%" : "-"), turnitinBad && React.createElement("div", {
        style: {
          fontSize: 12,
          color: "var(--au-crimson)",
          background: "var(--au-crimson-soft)",
          padding: "8px 12px",
          borderRadius: "var(--r-md)",
          marginTop: 8
        }
      }, "Turnitin similarity exceeds the 20% limit. Return the application to the researcher."))), React.createElement("div", {
        className: "card card-pad-0"
      }, React.createElement("div", {
        className: "card-head"
      }, React.createElement("h3", null, "Submitted Documents"), React.createElement("div", {
        className: "grow"
      }), React.createElement("span", {
        className: "text-sm text-muted"
      }, docs.length, " uploaded")), React.createElement("table", {
        className: "tbl"
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Document"), React.createElement("th", null, "Requirement"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, docCats.map(function (dc) {
        return React.createElement("tr", {
          key: dc.label
        }, React.createElement("td", null, dc.label), React.createElement("td", {
          style: {
            fontSize: 12,
            color: dc.req ? "var(--au-crimson)" : "var(--ink-3)",
            fontWeight: dc.req ? 600 : 400
          }
        }, dc.req ? "Required" : "Optional"), React.createElement("td", null, React.createElement("span", {
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: dc.ok ? "var(--status-approved, #2c7a4b)" : "var(--ink-3)"
          }
        }, React.createElement(Icon, {
          name: dc.ok ? "CheckCircle" : "AlertCircle",
          size: 14
        }), " ", dc.ok ? "Uploaded" : "Not provided")));
      }))), React.createElement("div", null, docs.length === 0 && React.createElement(Empty, {
        title: "No uploaded documents",
        desc: "The researcher has not uploaded any PDF documents for this claim.",
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
      }, React.createElement("h3", null, "Dean Decision")), React.createElement("div", {
        className: "card-body"
      }, React.createElement("div", {
        className: "flex flex-col gap-2"
      }, React.createElement("button", {
        className: "btn btn-primary btn-block",
        onClick: forward
      }, React.createElement(Icon, {
        name: "Send",
        size: 14
      }), " Approve & Forward to IRAS"), React.createElement("button", {
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
Object.assign(window, {
  DeanR3Detail: DeanR3Detail,
  DeanR4Detail: DeanR4Detail
});
