function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _React = React,
  useState = _React.useState,
  useRef = _React.useRef,
  useEffect = _React.useEffect;
var ROLE_INTRO = {
  researcher: "Hi, I'm AU AI. Ask me about your applications, forms, documents, authors, reviews, reports, or payments.",
  dean: "Hi, I'm AU AI for Deans. I can summarize only the AU-R3 and AU-R4 applications in your assigned faculty.",
  iras: "Hi, I'm AU AI for IRAS. Ask me about university-wide R3/R4 verification queues, workflow totals, faculties, and approved funding.",
  ofm: "Hi, I'm AU AI for Finance. Ask me about R3/R4 applications forwarded to Finance, pending payments, disbursements, and completed payments.",
  admin: "Hi, I'm AU AI for Admin Analytics. Ask me to summarize or compare live applications, faculties, budgets, users, workflows, and payments.",
  _default: "Hi, I'm AU AI — Assumption University's research-grant assistant. Ask me about AU-R3 conference grants, AU-R4 publication rewards, reviews, documents, or payments."
};
var ROLE_SUGGEST = {
  researcher: ["What needs my action now?", "How much annual funding do I have left?", "Which documents am I missing?"],
  dean: ["What needs my review now?", "Which department has the highest approved spending?", "Summarize my faculty's R3 and R4 applications"],
  iras: ["What needs IRAS verification now?", "Which faculty has the highest approved amount?", "Where are applications getting delayed?"],
  ofm: ["What payments need action now?", "Which faculty has the highest disbursement?", "Compare pending and completed payments"],
  admin: ["Give me a management summary", "Which faculty has the most applications?", "What workflow or access issues need attention?"],
  _default: ["How does the AU-R3 workflow work?", "What documents do I need to apply?", "Reward for a Scopus Q1 paper?"]
};
var ROLE_LABEL = {
  researcher: "Researcher assistant",
  dean: "Dean faculty assistant",
  iras: "IRAS analytics assistant",
  ofm: "Finance analytics assistant",
  admin: "Admin analytics assistant"
};
function buildAIContext(_x, _x2) {
  return _buildAIContext.apply(this, arguments);
}
function _buildAIContext() {
  _buildAIContext = _asyncToGenerator(_regenerator().m(function _callee2(grantSystem, mode) {
    var prof, role, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          prof = null;
          _context2.p = 1;
          _context2.n = 2;
          return window.AUTH.profile();
        case 2:
          prof = _context2.v;
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
        case 4:
          role = prof ? prof.role : null;
          return _context2.a(2, {
            role: role,
            name: prof ? prof.full_name : null,
            faculty: prof ? prof.faculty : null,
            grantSystem: grantSystem || null,
            mode: mode || null
          });
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return _buildAIContext.apply(this, arguments);
}
function AIInlineText(_ref) {
  var text = _ref.text;
  var parts = String(text || "").split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map(function (part, index) {
    var bold = part.startsWith("**") && part.endsWith("**") || part.startsWith("__") && part.endsWith("__");
    return bold ? React.createElement("strong", {
      key: index
    }, part.slice(2, -2)) : React.createElement(React.Fragment, {
      key: index
    }, part);
  });
}
function AIMessageContent(_ref2) {
  var content = _ref2.content;
  var lines = String(content || "").replace(/\r/g, "").split("\n");
  return React.createElement("div", {
    className: "ai-rich-text"
  }, lines.map(function (line, index) {
    var value = line.trim();
    if (!value) return React.createElement("div", {
      className: "ai-rich-gap",
      key: index,
      "aria-hidden": "true"
    });
    var heading = value.match(/^#{1,3}\s+(.+)$/);
    var bullet = value.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if (heading) return React.createElement("div", {
      className: "ai-rich-heading",
      key: index
    }, React.createElement(AIInlineText, {
      text: heading[1]
    }));
    if (bullet) return React.createElement("div", {
      className: "ai-rich-bullet",
      key: index
    }, React.createElement("span", {
      "aria-hidden": "true"
    }, "\u2022"), React.createElement("div", null, React.createElement(AIInlineText, {
      text: bullet[1]
    })));
    return React.createElement("div", {
      className: "ai-rich-line",
      key: index
    }, React.createElement(AIInlineText, {
      text: value
    }));
  }));
}
function AIChat() {
  var initialRole = window.AU_AI_ROLE || null;
  var _useState = useState(!!window.AU_AI_VISIBLE),
    _useState2 = _slicedToArray(_useState, 2),
    available = _useState2[0],
    setAvailable = _useState2[1];
  var _useState3 = useState(window.AU_AI_GRANT_SYSTEM || null),
    _useState4 = _slicedToArray(_useState3, 2),
    grantSystem = _useState4[0],
    setGrantSystem = _useState4[1];
  var _useState5 = useState(window.AU_AI_MODE || null),
    _useState6 = _slicedToArray(_useState5, 2),
    mode = _useState6[0],
    setMode = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    open = _useState8[0],
    setOpen = _useState8[1];
  var _useState9 = useState(""),
    _useState0 = _slicedToArray(_useState9, 2),
    input = _useState0[0],
    setInput = _useState0[1];
  var _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    busy = _useState10[0],
    setBusy = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    ctx = _useState12[0],
    setCtx = _useState12[1];
  var _useState13 = useState(initialRole),
    _useState14 = _slicedToArray(_useState13, 2),
    role = _useState14[0],
    setRole = _useState14[1];
  var _useState15 = useState([{
      role: "assistant",
      content: ROLE_INTRO[initialRole] || ROLE_INTRO._default
    }]),
    _useState16 = _slicedToArray(_useState15, 2),
    msgs = _useState16[0],
    setMsgs = _useState16[1];
  var bodyRef = useRef(null);
  useEffect(function () {
    var onVisibility = function onVisibility(event) {
      var next = !!(event.detail && event.detail.visible);
      var nextRole = next && event.detail ? event.detail.role || null : null;
      setAvailable(next);
      setGrantSystem(next && event.detail ? event.detail.grantSystem : null);
      setMode(next && event.detail ? event.detail.mode : null);
      setRole(nextRole);
      setCtx(null);
      setMsgs([{
        role: "assistant",
        content: ROLE_INTRO[nextRole] || ROLE_INTRO._default
      }]);
      if (!next) setOpen(false);
    };
    window.addEventListener("au-ai-visibility", onVisibility);
    return function () {
      return window.removeEventListener("au-ai-visibility", onVisibility);
    };
  }, []);
  useEffect(function () {
    var onToggle = function onToggle() {
      if (available) setOpen(function (v) {
        return !v;
      });
    };
    var onPrompt = function onPrompt(event) {
      if (!available) return;
      setOpen(true);
      setInput(String(event.detail && event.detail.prompt || ""));
    };
    window.addEventListener("au-ai-toggle", onToggle);
    window.addEventListener("au-ai-prompt", onPrompt);
    return function () {
      window.removeEventListener("au-ai-toggle", onToggle);
      window.removeEventListener("au-ai-prompt", onPrompt);
    };
  }, [available]);
  useEffect(function () {
    if (!available) return;
    var alive = true;
    buildAIContext(grantSystem, mode).then(function (c) {
      if (!alive) return;
      setCtx(c);
      setRole(c.role);
      setMsgs([{
        role: "assistant",
        content: ROLE_INTRO[c.role] || ROLE_INTRO._default
      }]);
    });
    return function () {
      alive = false;
    };
  }, [available, grantSystem, mode]);
  useEffect(function () {
    var el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);
  function send(_x3) {
    return _send.apply(this, arguments);
  }
  function _send() {
    _send = _asyncToGenerator(_regenerator().m(function _callee(e) {
      var text, next, session, r, data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (e) e.preventDefault();
            text = input.trim();
            if (!(!text || busy)) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            next = [].concat(_toConsumableArray(msgs), [{
              role: "user",
              content: text
            }]);
            setMsgs(next);
            setInput("");
            setBusy(true);
            _context.p = 2;
            _context.n = 3;
            return window.AUTH.session();
          case 3:
            session = _context.v;
            _context.n = 4;
            return fetch("/api/ai-chat-response", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": session && session.access_token ? "Bearer " + session.access_token : ""
              },
              body: JSON.stringify({
                messages: next,
                context: ctx
              })
            });
          case 4:
            r = _context.v;
            _context.n = 5;
            return r.json().catch(function () {
              return {};
            });
          case 5:
            data = _context.v;
            if (r.ok) {
              _context.n = 6;
              break;
            }
            throw new Error("AU AI request failed");
          case 6:
            setMsgs(function (m) {
              return [].concat(_toConsumableArray(m), [{
                role: "assistant",
                content: data.reply || "Sorry, no response."
              }]);
            });
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
            setMsgs(function (m) {
              return [].concat(_toConsumableArray(m), [{
                role: "assistant",
                content: "Sorry, I couldn't reach AU AI right now."
              }]);
            });
          case 8:
            _context.p = 8;
            setBusy(false);
            return _context.f(8);
          case 9:
            return _context.a(2);
        }
      }, _callee, null, [[2, 7, 8, 9]]);
    }));
    return _send.apply(this, arguments);
  }
  var suggestions = ROLE_SUGGEST[role] || ROLE_SUGGEST._default;
  if (!available) return null;
  var embedded = mode === "role";
  var panel = React.createElement("div", {
    className: "ai-panel".concat(embedded ? " ai-page-panel" : ""),
    id: "researcher-ai-dialog",
    role: "dialog",
    "aria-label": "AU AI assistant"
  }, React.createElement("div", {
    className: "ai-head"
  }, React.createElement("div", {
    className: "ai-bot-ic"
  }, React.createElement(Icon, {
    name: "Bot",
    size: 18
  })), React.createElement("div", {
    className: "ai-head-t"
  }, React.createElement("b", null, "AU AI"), React.createElement("span", null, role ? ROLE_LABEL[role] || "AU research grants" : "AU research grants · IRAS")), !embedded && React.createElement("button", {
    className: "ai-x",
    onClick: function onClick() {
      return setOpen(false);
    },
    "aria-label": "Close"
  }, React.createElement(Icon, {
    name: "X",
    size: 16
  }))), React.createElement("div", {
    className: "ai-body",
    ref: bodyRef
  }, msgs.map(function (m, i) {
    return React.createElement("div", {
      key: i,
      className: "ai-msg ".concat(m.role)
    }, m.role === "assistant" ? React.createElement(AIMessageContent, {
      content: m.content
    }) : m.content);
  }), busy && React.createElement("div", {
    className: "ai-msg assistant ai-typing"
  }, "Thinking\u2026"), msgs.length <= 1 && !busy && React.createElement("div", {
    className: "ai-suggest"
  }, suggestions.map(function (s, i) {
    return React.createElement("button", {
      key: i,
      className: "ai-chip",
      onClick: function onClick() {
        return setInput(s);
      }
    }, s);
  }))), React.createElement("form", {
    className: "ai-input",
    onSubmit: send
  }, React.createElement("input", {
    value: input,
    onChange: function onChange(e) {
      return setInput(e.target.value);
    },
    placeholder: "Ask AU AI\u2026"
  }), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: busy,
    "aria-label": "Send"
  }, React.createElement(Icon, {
    name: "Send",
    size: 15
  }))));
  if (embedded) {
    var host = document.getElementById("role-ai-chat-host");
    return host ? ReactDOM.createPortal(panel, host) : null;
  }
  return React.createElement(React.Fragment, null, React.createElement("button", {
    type: "button",
    className: "ai-launcher",
    onClick: function onClick() {
      return setOpen(function (v) {
        return !v;
      });
    },
    title: "Ask AU AI",
    "aria-label": "Ask AU AI",
    "aria-expanded": open,
    "aria-controls": open ? "researcher-ai-dialog" : undefined
  }, React.createElement(Icon, {
    name: "Bot",
    size: 20
  })), open && panel);
}
ReactDOM.createRoot(document.getElementById("ai-root")).render(React.createElement(AIChat, null));
