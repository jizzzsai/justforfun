function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var APP = window.AU;
var TEST_PASSWORD = "123456789";
var FACULTY_TEST_ROLES = [{
  key: "researcher",
  label: "Researcher"
}, {
  key: "dean",
  label: "Dean"
}];
function facultyTestEmail(code, role) {
  return String(code || "VMES").toLowerCase() + role + "@au.edu";
}
var TEST_EMAIL_FOR = {
  iras: "iras@au.edu",
  ofm: "academic@au.edu",
  admin: "admin@au.edu"
};
function demoRoleForEmail(email) {
  var normalized = String(email || "").trim().toLowerCase();
  var centralRole = Object.keys(TEST_EMAIL_FOR).find(function (role) {
    return TEST_EMAIL_FOR[role] === normalized;
  });
  if (centralRole) return centralRole;
  var _iterator = _createForOfIteratorHelper(APP.FACULTIES || []),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var faculty = _step.value;
      var _iterator2 = _createForOfIteratorHelper(FACULTY_TEST_ROLES),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var role = _step2.value;
          if (facultyTestEmail(faculty.code, role.key) === normalized) return role.key;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function isPasswordRecoveryRoute() {
  return new URLSearchParams(window.location.search).get("reset-password") === "1" || /(?:^|[&#])type=recovery(?:&|$)/.test(window.location.hash || "");
}
function LoginPage(_ref) {
  var onLogin = _ref.onLogin;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    email = _useState2[0],
    setEmail = _useState2[1];
  var _useState3 = useState(""),
    _useState4 = _slicedToArray(_useState3, 2),
    pass = _useState4[0],
    setPass = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    busy = _useState6[0],
    setBusy = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    err = _useState8[0],
    setErr = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    showPassword = _useState0[0],
    setShowPassword = _useState0[1];
  var _useState1 = useState(function () {
      return !!(window.AUTH && window.AUTH.remembersSession());
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    remember = _useState10[0],
    setRemember = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    helpTopic = _useState12[0],
    setHelpTopic = _useState12[1];
  var _useState13 = useState("VMES"),
    _useState14 = _slicedToArray(_useState13, 2),
    demoFaculty = _useState14[0],
    setDemoFaculty = _useState14[1];
  var _useState15 = useState(""),
    _useState16 = _slicedToArray(_useState15, 2),
    resetSent = _useState16[0],
    setResetSent = _useState16[1];
  var _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    newPassword = _useState18[0],
    setNewPassword = _useState18[1];
  var _useState19 = useState(""),
    _useState20 = _slicedToArray(_useState19, 2),
    confirmPassword = _useState20[0],
    setConfirmPassword = _useState20[1];
  var _useState21 = useState(false),
    _useState22 = _slicedToArray(_useState21, 2),
    passwordChanged = _useState22[0],
    setPasswordChanged = _useState22[1];
  var loginPending = useRef(false);
  var emailInput = useRef(null);
  var passwordInput = useRef(null);
  useEffect(function () {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    var previous = viewport.getAttribute("content");
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
    return function () {
      return viewport.setAttribute("content", previous || "width=1280");
    };
  }, []);
  function signInWith(_x, _x2) {
    return _signInWith.apply(this, arguments);
  }
  function _signInWith() {
    _signInWith = _asyncToGenerator(_regenerator().m(function _callee2(em, pw) {
      var isDemo,
        prof,
        message,
        _args2 = arguments,
        _t2,
        _t3;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            isDemo = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
            if (!loginPending.current) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            loginPending.current = true;
            setErr("");
            setBusy(true);
            _context2.p = 2;
            _context2.n = 3;
            return window.AUTH.signIn(em, pw, remember);
          case 3:
            prof = _context2.v;
            if (prof) {
              _context2.n = 4;
              break;
            }
            throw new Error("No profile found for this account.");
          case 4:
            if (!(prof.is_active === false || !["researcher", "dean", "iras", "ofm", "admin"].includes(prof.role))) {
              _context2.n = 9;
              break;
            }
            _context2.p = 5;
            _context2.n = 6;
            return window.AUTH.signOut();
          case 6:
            _context2.n = 8;
            break;
          case 7:
            _context2.p = 7;
            _t2 = _context2.v;
          case 8:
            throw new Error("This account belongs to an inactive role and no longer has portal access.");
          case 9:
            window.AUTH.setDemoLogin(prof, em, isDemo);
            onLogin(prof);
            _context2.n = 11;
            break;
          case 10:
            _context2.p = 10;
            _t3 = _context2.v;
            message = String(_t3 && _t3.message || "");
            setErr(/invalid login credentials/i.test(message) ? "Incorrect password." : message || "Sign-in failed. Please try again.");
          case 11:
            _context2.p = 11;
            loginPending.current = false;
            setBusy(false);
            return _context2.f(11);
          case 12:
            return _context2.a(2);
        }
      }, _callee2, null, [[5, 7], [2, 10, 11, 12]]);
    }));
    return _signInWith.apply(this, arguments);
  }
  function doLogin(e) {
    e.preventDefault();
    if (loginPending.current) return;
    var auEmail = email.trim();
    if (!/^[^@\s]+@au\.edu$/i.test(auEmail)) {
      setErr("Use your registered AU email ending in @au.edu.");
      emailInput.current.focus();
      return;
    }
    if (!pass) {
      setErr("Enter your password.");
      passwordInput.current.focus();
      return;
    }
    signInWith(auEmail, pass, false);
  }
  function demoLogin(testEmail) {
    signInWith(testEmail, TEST_PASSWORD, true);
  }
  function requestPasswordReset() {
    return _requestPasswordReset.apply(this, arguments);
  }
  function _requestPasswordReset() {
    _requestPasswordReset = _asyncToGenerator(_regenerator().m(function _callee3() {
      var auEmail, _t4;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            auEmail = email.trim().toLowerCase();
            setErr("");
            setResetSent("");
            if (/^[^@\s]+@au\.edu$/i.test(auEmail)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, setErr("Enter the AU email address registered for your account."));
          case 1:
            setBusy(true);
            _context3.p = 2;
            _context3.n = 3;
            return window.AUTH.requestPasswordReset(auEmail);
          case 3:
            setResetSent("If an AU-RGMS account exists for " + auEmail + ", a password-reset email has been sent. Open its link to choose a new password.");
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t4 = _context3.v;
            setErr(_t4 && _t4.message || "Could not send the password reset email.");
          case 5:
            _context3.p = 5;
            setBusy(false);
            return _context3.f(5);
          case 6:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 4, 5, 6]]);
    }));
    return _requestPasswordReset.apply(this, arguments);
  }
  function changeRecoveredPassword(_x3) {
    return _changeRecoveredPassword.apply(this, arguments);
  }
  function _changeRecoveredPassword() {
    _changeRecoveredPassword = _asyncToGenerator(_regenerator().m(function _callee4(e) {
      var _t5;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            e.preventDefault();
            setErr("");
            if (!(newPassword.length < 8)) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, setErr("New password must be at least 8 characters."));
          case 1:
            if (!(newPassword !== confirmPassword)) {
              _context4.n = 2;
              break;
            }
            return _context4.a(2, setErr("The two passwords do not match."));
          case 2:
            setBusy(true);
            _context4.p = 3;
            _context4.n = 4;
            return window.AUTH.updatePassword(newPassword);
          case 4:
            setPasswordChanged(true);
            _context4.n = 6;
            break;
          case 5:
            _context4.p = 5;
            _t5 = _context4.v;
            setErr(_t5 && _t5.message || "Could not update the password. Request a new reset email and try again.");
          case 6:
            _context4.p = 6;
            setBusy(false);
            return _context4.f(6);
          case 7:
            return _context4.a(2);
        }
      }, _callee4, null, [[3, 5, 6, 7]]);
    }));
    return _changeRecoveredPassword.apply(this, arguments);
  }
  if (isPasswordRecoveryRoute()) {
    return React.createElement("div", {
      className: "au-login"
    }, React.createElement("main", {
      className: "au-login-shell",
      "aria-labelledby": "au-reset-title"
    }, React.createElement("svg", {
      className: "au-login-surface",
      viewBox: "0 0 1200 760",
      preserveAspectRatio: "none",
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: "M0 0H540C545 105 651 157 672 272C705 431 553 493 550 616C548 678 580 730 612 760H0Z"
    })), React.createElement("section", {
      className: "au-login-story",
      "aria-label": "Assumption University Research Affairs"
    }, React.createElement("header", {
      className: "au-login-identity"
    }, React.createElement("div", {
      className: "au-login-seal"
    }, React.createElement("img", {
      src: "assets/au-logo.png",
      alt: "Assumption University crest",
      width: "58",
      height: "58"
    })), React.createElement("div", null, React.createElement("p", {
      className: "au-login-university"
    }, "Assumption University"), React.createElement("p", {
      className: "au-login-meta"
    }, "Research Grant Management System"))), React.createElement("div", {
      className: "au-login-story-content"
    }, React.createElement("h1", {
      className: "au-login-title"
    }, "Secure account ", React.createElement("em", null, "recovery")), React.createElement("p", {
      className: "au-login-story-note"
    }, "Choose a new password for your AU-RGMS account."))), React.createElement("section", {
      className: "au-login-access"
    }, React.createElement("div", {
      className: "au-login-form-panel"
    }, React.createElement("p", {
      className: "au-login-form-label"
    }, "AU-RGMS \xB7 Password recovery"), React.createElement("h2", {
      className: "au-login-welcome",
      id: "au-reset-title"
    }, passwordChanged ? "Password changed" : "Create a new password"), passwordChanged ? React.createElement(React.Fragment, null, React.createElement("p", {
      className: "au-login-intro"
    }, "Your password has been updated. You can now return to the login page."), React.createElement("button", {
      className: "au-login-submit",
      type: "button",
      onClick: _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return window.AUTH.signOut();
            case 1:
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
            case 3:
              window.location.replace(window.location.origin + window.location.pathname);
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[0, 2]]);
      }))
    }, "Return to Login")) : React.createElement("form", {
      onSubmit: changeRecoveredPassword
    }, React.createElement("div", {
      className: "au-login-field"
    }, React.createElement("label", {
      htmlFor: "au-new-password"
    }, "New password"), React.createElement("input", {
      id: "au-new-password",
      type: "password",
      value: newPassword,
      onChange: function onChange(e) {
        return setNewPassword(e.target.value);
      },
      autoComplete: "new-password",
      required: true,
      disabled: busy
    })), React.createElement("div", {
      className: "au-login-field"
    }, React.createElement("label", {
      htmlFor: "au-confirm-password"
    }, "Confirm new password"), React.createElement("input", {
      id: "au-confirm-password",
      type: "password",
      value: confirmPassword,
      onChange: function onChange(e) {
        return setConfirmPassword(e.target.value);
      },
      autoComplete: "new-password",
      required: true,
      disabled: busy
    })), err && React.createElement("p", {
      className: "au-login-error",
      role: "alert"
    }, err), React.createElement("button", {
      className: "au-login-submit",
      type: "submit",
      disabled: busy
    }, busy ? "Updating…" : "Update Password"))))));
  }
  return React.createElement("div", {
    className: "au-login"
  }, React.createElement("main", {
    className: "au-login-shell",
    "aria-labelledby": "au-login-system-title"
  }, React.createElement("svg", {
    className: "au-login-surface",
    viewBox: "0 0 1200 760",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M0 0H540C545 105 651 157 672 272C705 431 553 493 550 616C548 678 580 730 612 760H0Z"
  })), React.createElement("section", {
    className: "au-login-story",
    "aria-label": "Assumption University Research Affairs"
  }, React.createElement("header", {
    className: "au-login-identity"
  }, React.createElement("div", {
    className: "au-login-seal"
  }, React.createElement("img", {
    src: "assets/au-logo.png",
    alt: "Assumption University crest",
    width: "58",
    height: "58"
  })), React.createElement("div", null, React.createElement("p", {
    className: "au-login-university"
  }, "Assumption University"), React.createElement("p", {
    className: "au-login-meta"
  }, "of Thailand \xB7 Est. 1969"))), React.createElement("div", {
    className: "au-login-story-content"
  }, React.createElement("div", {
    className: "au-login-story-heading"
  }, React.createElement("h1", {
    className: "au-login-title",
    id: "au-login-system-title"
  }, "Research Grant ", React.createElement("em", null, "Management"), " System")), React.createElement("p", {
    className: "au-login-story-note"
  }, "Making research grant applications simpler for AU researchers\u2014from submission to approval, reporting, and payment.")), React.createElement("p", {
    className: "au-login-copyright"
  }, "\xA9 ", new Date().getFullYear(), " Assumption University of Thailand")), React.createElement("section", {
    className: "au-login-access",
    "aria-labelledby": "au-login-welcome"
  }, React.createElement("div", {
    className: "au-login-form-panel"
  }, React.createElement("p", {
    className: "au-login-form-label"
  }, React.createElement("span", {
    "aria-hidden": "true"
  }), " AU-RGMS \xB7 University portal"), React.createElement("h2", {
    className: "au-login-welcome",
    id: "au-login-welcome"
  }, "Login"), React.createElement("p", {
    className: "au-login-intro"
  }, "Welcome. Sign in with your AU account."), React.createElement("form", {
    onSubmit: doLogin,
    noValidate: true,
    "aria-busy": busy
  }, React.createElement("div", {
    className: "au-login-field"
  }, React.createElement("label", {
    htmlFor: "au-login-email"
  }, "AU Email"), React.createElement("input", {
    id: "au-login-email",
    ref: emailInput,
    name: "email",
    value: email,
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    },
    type: "email",
    placeholder: "name@au.edu",
    autoComplete: "username",
    autoCapitalize: "none",
    spellCheck: false,
    required: true,
    disabled: busy,
    "aria-describedby": err ? "au-login-error" : undefined
  })), React.createElement("div", {
    className: "au-login-field"
  }, React.createElement("label", {
    htmlFor: "au-login-password"
  }, "Password"), React.createElement("div", {
    className: "au-login-password-wrap"
  }, React.createElement("input", {
    id: "au-login-password",
    ref: passwordInput,
    name: "password",
    value: pass,
    onChange: function onChange(e) {
      return setPass(e.target.value);
    },
    type: showPassword ? "text" : "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
    required: true,
    disabled: busy,
    "aria-describedby": err ? "au-login-error" : undefined
  }), React.createElement("button", {
    className: "au-login-password-toggle",
    type: "button",
    disabled: busy,
    "aria-label": showPassword ? "Hide password" : "Show password",
    "aria-pressed": showPassword,
    "aria-controls": "au-login-password",
    onClick: function onClick() {
      setShowPassword(function (v) {
        return !v;
      });
      passwordInput.current.focus();
    }
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, showPassword ? React.createElement(React.Fragment, null, React.createElement("path", {
    d: "m3 3 18 18"
  }), React.createElement("path", {
    d: "M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.9M6.6 6.7C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.8-.5"
  })) : React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.6"
  })))))), React.createElement("div", {
    className: "au-login-options"
  }, React.createElement("label", {
    className: "au-login-remember"
  }, React.createElement("input", {
    type: "checkbox",
    checked: remember,
    onChange: function onChange(e) {
      return setRemember(e.target.checked);
    },
    disabled: busy,
    "aria-describedby": "au-login-remember-note"
  }), " Remember me"), React.createElement("button", {
    className: "au-login-text-button",
    type: "button",
    onClick: requestPasswordReset,
    disabled: busy
  }, "Forgot password?")), React.createElement("span", {
    className: "au-login-sr-only",
    id: "au-login-remember-note"
  }, "Remember your login on this device. Leave unchecked on shared computers to keep the session in this tab only."), err && React.createElement("p", {
    className: "au-login-error",
    id: "au-login-error",
    role: "alert"
  }, err), resetSent && React.createElement("p", {
    className: "au-login-success",
    role: "status"
  }, resetSent), React.createElement("button", {
    className: "au-login-submit",
    type: "submit",
    disabled: busy
  }, busy ? "Signing in…" : React.createElement(React.Fragment, null, "Sign In ", React.createElement(Icon, {
    name: "ArrowRight",
    size: 16
  })))), React.createElement("div", {
    className: "au-login-support"
  }, React.createElement("span", null, "Having trouble signing in?"), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setHelpTopic("access");
    }
  }, "Contact Research Affairs / IT Support")), React.createElement("details", {
    className: "au-login-demo"
  }, React.createElement("summary", null, "Developer Demo Access ", React.createElement(Icon, {
    name: "ChevronDown",
    size: 12
  })), React.createElement("div", {
    className: "au-login-demo-panel"
  }, React.createElement("p", null, "Select a test account. Every demo account uses password ", React.createElement("strong", null, TEST_PASSWORD), "."), React.createElement("label", {
    className: "au-login-demo-select"
  }, React.createElement("span", null, "Faculty"), React.createElement("select", {
    value: demoFaculty,
    onChange: function onChange(e) {
      return setDemoFaculty(e.target.value);
    },
    disabled: busy
  }, APP.FACULTIES.map(function (f) {
    return React.createElement("option", {
      key: f.code,
      value: f.code
    }, f.code, " \xB7 ", f.name);
  }))), React.createElement("div", {
    className: "au-login-demo-grid"
  }, FACULTY_TEST_ROLES.map(function (r) {
    var username = demoFaculty.toLowerCase() + r.key;
    return React.createElement("button", {
      key: r.key,
      type: "button",
      disabled: busy,
      title: username + "@au.edu",
      onClick: function onClick() {
        return demoLogin(facultyTestEmail(demoFaculty, r.key));
      }
    }, React.createElement("strong", null, username), React.createElement("span", null, r.label));
  })), React.createElement("div", {
    className: "au-login-demo-section"
  }, "University-wide"), React.createElement("div", {
    className: "au-login-demo-grid au-login-demo-grid-wide"
  }, React.createElement("button", {
    type: "button",
    disabled: busy,
    title: "iras@au.edu",
    onClick: function onClick() {
      return demoLogin(TEST_EMAIL_FOR.iras);
    }
  }, React.createElement("strong", null, "iras"), React.createElement("span", null, "AU-R3 / AU-R4 Office")), React.createElement("button", {
    type: "button",
    disabled: busy,
    title: "academic@au.edu",
    onClick: function onClick() {
      return demoLogin(TEST_EMAIL_FOR.ofm);
    }
  }, React.createElement("strong", null, "academic"), React.createElement("span", null, "Academic")), React.createElement("button", {
    type: "button",
    disabled: busy,
    title: "admin@au.edu",
    onClick: function onClick() {
      return demoLogin(TEST_EMAIL_FOR.admin);
    }
  }, React.createElement("strong", null, "admin"), React.createElement("span", null, "Administrator")))))))), React.createElement(LoginHelpDialog, {
    topic: helpTopic,
    onClose: function onClose() {
      return setHelpTopic(null);
    }
  }));
}
function LoginHelpDialog(_ref3) {
  var topic = _ref3.topic,
    onClose = _ref3.onClose;
  var dialog = useRef(null);
  useEffect(function () {
    var element = dialog.current;
    if (topic && !element.open) element.showModal();else if (!topic && element.open) element.close();
  }, [topic]);
  var titles = {
    access: "Account help",
    privacy: "Sign-in privacy",
    help: "Signing in to AU-RGMS"
  };
  return React.createElement("dialog", {
    ref: dialog,
    className: "au-login-dialog",
    "aria-labelledby": "au-login-help-title",
    onClose: onClose,
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) dialog.current.close();
    }
  }, React.createElement("h2", {
    id: "au-login-help-title"
  }, titles[topic] || "Login help"), topic === "access" && React.createElement(React.Fragment, null, React.createElement("p", null, "Contact administrator.")), topic === "help" && React.createElement(React.Fragment, null, React.createElement("p", null, "Enter your registered email ending in @au.edu and your password. Your account determines which role and workspace you can access."), React.createElement("p", null, "Researchers can select AU-R3 or AU-R4 after signing in. Staff workspaces are selected automatically from the authenticated account role."), React.createElement("p", null, "Select Remember me only on your own device. Leave it unchecked on shared computers and sign out when you finish.")), topic === "privacy" && React.createElement(React.Fragment, null, React.createElement("p", null, "AU-RGMS uses your signed-in account to load your profile and the applications available to your role."), React.createElement("p", null, "Remember me saves a login session in this browser. Without it, the session is kept in the current tab. Signing out clears the saved session from this browser; the checkbox never saves your password."), React.createElement("p", null, "For the university's official privacy policy or questions about your research data, contact Research Affairs.")), React.createElement("button", {
    className: "au-login-submit",
    type: "button",
    autoFocus: true,
    onClick: function onClick() {
      return dialog.current.close();
    }
  }, "Close"));
}
var CHOOSER_INTRO = "Hi, I'm AU AI. Not sure whether AU-R3 or AU-R4 fits you? Ask me about the purpose, amount, or required documents and I'll help you pick.";
var CHOOSER_CHIPS = ["What's the difference between AU-R3 and AU-R4?", "Which grant is for presenting a paper at a conference?", "How do I submit an AU-R4 publication fee application?", "Can students apply together with me?"];
function GrantHelperChat(_ref4) {
  var profile = _ref4.profile;
  var _useState23 = useState([{
      role: "assistant",
      content: CHOOSER_INTRO
    }]),
    _useState24 = _slicedToArray(_useState23, 2),
    msgs = _useState24[0],
    setMsgs = _useState24[1];
  var _useState25 = useState(""),
    _useState26 = _slicedToArray(_useState25, 2),
    input = _useState26[0],
    setInput = _useState26[1];
  var _useState27 = useState(false),
    _useState28 = _slicedToArray(_useState27, 2),
    busy = _useState28[0],
    setBusy = _useState28[1];
  var _useState29 = useState(false),
    _useState30 = _slicedToArray(_useState29, 2),
    open = _useState30[0],
    setOpen = _useState30[1];
  var bodyRef = useRef(null);
  var ctx = {
    role: "researcher",
    name: profile && profile.full_name,
    faculty: profile && profile.faculty
  };
  useEffect(function () {
    var el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);
  function ask(_x4) {
    return _ask.apply(this, arguments);
  }
  function _ask() {
    _ask = _asyncToGenerator(_regenerator().m(function _callee5(text) {
      var q, next, session, r, data, _t6;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            q = (text || input).trim();
            if (!(!q || busy)) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            next = [].concat(_toConsumableArray(msgs), [{
              role: "user",
              content: q
            }]);
            setMsgs(next);
            setInput("");
            setBusy(true);
            _context5.p = 2;
            _context5.n = 3;
            return window.AUTH.session();
          case 3:
            session = _context5.v;
            _context5.n = 4;
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
            r = _context5.v;
            _context5.n = 5;
            return r.json().catch(function () {
              return {};
            });
          case 5:
            data = _context5.v;
            if (r.ok) {
              _context5.n = 6;
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
            _context5.n = 8;
            break;
          case 7:
            _context5.p = 7;
            _t6 = _context5.v;
            setMsgs(function (m) {
              return [].concat(_toConsumableArray(m), [{
                role: "assistant",
                content: "Sorry, I couldn't reach AU AI right now."
              }]);
            });
          case 8:
            _context5.p = 8;
            setBusy(false);
            return _context5.f(8);
          case 9:
            return _context5.a(2);
        }
      }, _callee5, null, [[2, 7, 8, 9]]);
    }));
    return _ask.apply(this, arguments);
  }
  return React.createElement("div", {
    className: "chooser-ai"
  }, React.createElement("button", {
    type: "button",
    className: "chooser-ai-button",
    onClick: function onClick() {
      return setOpen(function (v) {
        return !v;
      });
    },
    title: "Ask AU AI",
    "aria-label": "Ask AU AI",
    "aria-expanded": open,
    "aria-controls": open ? "chooser-ai-dialog" : undefined
  }, React.createElement(Icon, {
    name: "Bot",
    size: 20
  })), open && React.createElement("div", {
    className: "chooser-ai-panel",
    id: "chooser-ai-dialog",
    role: "dialog",
    "aria-label": "Ask AU AI"
  }, React.createElement("div", {
    className: "chooser-ai-head"
  }, React.createElement("div", {
    className: "chooser-ai-mark"
  }, React.createElement(Icon, {
    name: "Bot",
    size: 18
  })), React.createElement("div", null, React.createElement("b", null, "AU AI"), React.createElement("span", null, "Grant selection assistant")), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setOpen(false);
    },
    "aria-label": "Close AI assistant"
  }, React.createElement(Icon, {
    name: "X",
    size: 16
  }))), React.createElement("div", {
    ref: bodyRef,
    className: "chooser-ai-body"
  }, msgs.map(function (m, i) {
    return React.createElement("div", {
      key: i,
      className: "chooser-ai-message ".concat(m.role)
    }, m.content);
  }), busy && React.createElement("div", {
    className: "chooser-ai-thinking"
  }, "AU AI is thinking\u2026"), msgs.length <= 1 && !busy && React.createElement("div", {
    className: "chooser-ai-suggestions"
  }, CHOOSER_CHIPS.map(function (s, i) {
    return React.createElement("button", {
      key: i,
      type: "button",
      onClick: function onClick() {
        return ask(s);
      }
    }, s);
  }))), React.createElement("form", {
    className: "chooser-ai-input",
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      ask();
    }
  }, React.createElement("input", {
    value: input,
    onChange: function onChange(e) {
      return setInput(e.target.value);
    },
    placeholder: "Ask about the grants\u2026"
  }), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: busy || !input.trim(),
    "aria-label": "Send"
  }, React.createElement(Icon, {
    name: "Send",
    size: 15
  })))));
}
function GrantSystemChooser(_ref5) {
  var profile = _ref5.profile,
    onPick = _ref5.onPick,
    onLogout = _ref5.onLogout;
  var systems = (APP.GRANT_SYSTEMS || []).filter(function (sys) {
    return ["au_r3", "au_r4"].includes(sys.id);
  });
  var summaries = {
    au_r3: "Present your paper at a conference.",
    au_r4: "Journal publication fees and rewards."
  };
  useEffect(function () {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    var previous = viewport.getAttribute("content");
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
    return function () {
      return viewport.setAttribute("content", previous || "width=1280");
    };
  }, []);
  return React.createElement("div", {
    className: "chooser-shell"
  }, React.createElement("header", {
    className: "chooser-header"
  }, React.createElement("div", {
    className: "chooser-brand"
  }, React.createElement(AULogo, {
    size: 38
  }), React.createElement("div", null, React.createElement("strong", null, "Assumption University"), React.createElement("span", null, "Research Grant Management System"))), React.createElement("div", {
    className: "chooser-account"
  }, React.createElement("button", {
    type: "button",
    className: "chooser-signout",
    onClick: onLogout
  }, React.createElement(Icon, {
    name: "LogOut",
    size: 14
  }), " Sign out"))), React.createElement("main", {
    className: "chooser-main",
    "aria-labelledby": "grant-chooser-title"
  }, React.createElement("div", {
    className: "chooser-intro"
  }, React.createElement("h1", {
    id: "grant-chooser-title"
  }, "Choose your grant"), React.createElement("p", null, "Research. Present. Publish.")), React.createElement("div", {
    className: "grant-choice-grid",
    "aria-label": "Available research grants"
  }, systems.map(function (sys) {
    var disabled = !sys.enabled;
    return React.createElement("section", {
      key: sys.id,
      className: "grant-choice-card".concat(disabled ? " is-disabled" : ""),
      "aria-labelledby": "grant-title-".concat(sys.id)
    }, React.createElement("div", {
      className: "grant-choice-icon",
      "aria-hidden": "true"
    }, React.createElement(Icon, {
      name: sys.icon,
      size: 48
    })), React.createElement("p", {
      className: "grant-choice-code"
    }, sys.code), React.createElement("h2", {
      className: "grant-choice-title",
      id: "grant-title-".concat(sys.id)
    }, sys.name), React.createElement("p", {
      className: "grant-choice-desc"
    }, summaries[sys.id] || sys.tagline), React.createElement("button", {
      type: "button",
      className: "grant-choice-action",
      disabled: disabled,
      onClick: function onClick() {
        return !disabled && onPick(sys.id);
      },
      "aria-label": "".concat(disabled ? "Coming soon" : "Continue to", " ").concat(sys.code)
    }, disabled ? "Coming soon" : React.createElement(React.Fragment, null, "Continue ", React.createElement(Icon, {
      name: "ArrowRight",
      size: 16
    }))));
  }))), React.createElement(GrantHelperChat, {
    profile: profile
  }));
}
var ROLE_CONFIG = {
  researcher: {
    nav: APP.NAV_RESEARCHER,
    homeKey: "r-dashboard",
    crumbRoot: "Researcher"
  },
  dean: {
    nav: APP.NAV_DEAN,
    homeKey: "d-dashboard",
    crumbRoot: "Dean's Office"
  },
  iras: {
    nav: APP.NAV_IRAS,
    homeKey: "i-dashboard",
    crumbRoot: "IRAS"
  },
  ofm: {
    nav: APP.NAV_OFM,
    homeKey: "o-dashboard",
    crumbRoot: "Academic"
  },
  admin: {
    nav: APP.NAV_ADMIN,
    homeKey: "a-dashboard",
    crumbRoot: "Administration"
  }
};
var SYSTEM_ROLE_KEYS = {
  au_r3: ["researcher", "dean", "iras", "ofm", "admin"],
  au_r4: ["researcher", "dean", "iras", "ofm", "admin"]
};
function rolesForSystem(sys) {
  var all = APP.ROLES || [];
  var keys = SYSTEM_ROLE_KEYS[sys];
  var list = keys ? keys.map(function (k) {
    return all.find(function (r) {
      return r.key === k;
    });
  }).filter(Boolean) : all;
  return list;
}
function AppHeader(_ref6) {
  var role = _ref6.role,
    profile = _ref6.profile,
    onLogout = _ref6.onLogout,
    onNavigate = _ref6.onNavigate,
    onDemoSwitch = _ref6.onDemoSwitch,
    grantSystem = _ref6.grantSystem;
  var _useState31 = useState(false),
    _useState32 = _slicedToArray(_useState31, 2),
    roleOpen = _useState32[0],
    setRoleOpen = _useState32[1];
  var _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    notifOpen = _useState34[0],
    setNotifOpen = _useState34[1];
  var _useState35 = useState(APP.NOTIFS || []),
    _useState36 = _slicedToArray(_useState35, 2),
    notifItems = _useState36[0],
    setNotifItems = _useState36[1];
  var _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    demoVerified = _useState38[0],
    setDemoVerified = _useState38[1];
  var _useState39 = useState(false),
    _useState40 = _slicedToArray(_useState39, 2),
    demoSwitchBusy = _useState40[0],
    setDemoSwitchBusy = _useState40[1];
  var _useState41 = useState(""),
    _useState42 = _slicedToArray(_useState41, 2),
    demoSwitchError = _useState42[0],
    setDemoSwitchError = _useState42[1];
  var _useState43 = useState(function () {
      var _find;
      return ((_find = (APP.FACULTIES || []).find(function (f) {
        return f.name === (profile && profile.faculty);
      })) === null || _find === void 0 ? void 0 : _find.code) || sessionStorage.getItem("au-rgms-demo-faculty") || "VMES";
    }),
    _useState44 = _slicedToArray(_useState43, 2),
    demoFaculty = _useState44[0],
    setDemoFaculty = _useState44[1];
  var current = rolesForSystem(grantSystem).find(function (r) {
    return r.key === role;
  }) || APP.ROLES.find(function (r) {
    return r.key === role;
  });
  var displayName = profile && profile.full_name || current.full;
  var displaySubtitle = current.name;
  var displayInitials = displayName ? displayName.trim().split(/\s+/).slice(-2).map(function (s) {
    return s[0];
  }).join("").toUpperCase() : current.initials;
  var wrapRef = useRef(null);
  useEffect(function () {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setRoleOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return function () {
      return document.removeEventListener("mousedown", handler);
    };
  }, []);
  useEffect(function () {
    var alive = true;
    var refreshNotifications = function refreshNotifications() {
      if (window.DB && window.DB.notifications) {
        window.DB.notifications().then(function (items) {
          if (alive) setNotifItems(items || []);
        }).catch(function () {
          if (alive) setNotifItems([]);
        });
      }
    };
    refreshNotifications();
    var timer = window.setInterval(refreshNotifications, 30000);
    return function () {
      alive = false;
      window.clearInterval(timer);
    };
  }, [role, profile && profile.id]);
  useEffect(function () {
    var _find2;
    var alive = true;
    setDemoVerified(false);
    var facultyCode = (_find2 = (APP.FACULTIES || []).find(function (f) {
      return f.name === (profile && profile.faculty);
    })) === null || _find2 === void 0 ? void 0 : _find2.code;
    if (facultyCode) {
      setDemoFaculty(facultyCode);
      sessionStorage.setItem("au-rgms-demo-faculty", facultyCode);
    }
    if (window.sb && window.sb.auth && profile && profile.id) {
      window.sb.auth.getUser().then(function (result) {
        var user = result && result.data && result.data.user;
        if (alive) setDemoVerified(!!(user && demoRoleForEmail(user.email) === role && window.AUTH.isDemoLogin(profile, user)));
      }).catch(function () {
        if (alive) setDemoVerified(false);
      });
    }
    return function () {
      alive = false;
    };
  }, [role, profile]);
  function selectDemoAccount(_x5) {
    return _selectDemoAccount.apply(this, arguments);
  }
  function _selectDemoAccount() {
    _selectDemoAccount = _asyncToGenerator(_regenerator().m(function _callee6(email) {
      var _t7;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            if (!(demoSwitchBusy || !demoVerified || !onDemoSwitch)) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            setDemoSwitchBusy(true);
            setDemoSwitchError("");
            _context6.p = 2;
            _context6.n = 3;
            return onDemoSwitch(email);
          case 3:
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t7 = _context6.v;
            setDemoSwitchError(_t7 && _t7.message || "Could not switch demo account.");
            setDemoSwitchBusy(false);
          case 5:
            return _context6.a(2);
        }
      }, _callee6, null, [[2, 4]]);
    }));
    return _selectDemoAccount.apply(this, arguments);
  }
  return React.createElement("header", {
    className: "app-header"
  }, React.createElement("div", {
    className: "au-mark"
  }, React.createElement(AULogo, {
    size: 40,
    ringWidth: 2
  }), React.createElement("div", {
    className: "seal-text"
  }, React.createElement("b", null, "Assumption University"), React.createElement("span", null, "RGMS \xB7 Research Affairs"))), React.createElement("div", {
    className: "system-name"
  }, "Research Grant Management System"), React.createElement("div", {
    className: "grow"
  }), React.createElement("div", {
    className: "header-actions",
    ref: wrapRef
  }, React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement("button", {
    className: "header-icon-btn",
    title: "Notifications",
    onClick: function onClick() {
      setNotifOpen(function (v) {
        return !v;
      });
      setRoleOpen(false);
    }
  }, React.createElement(Icon, {
    name: "Bell",
    size: 18
  }), notifItems.some(function (n) {
    return n.unread;
  }) && React.createElement("span", {
    className: "dot"
  })), notifOpen && React.createElement(NotifPanel, {
    items: notifItems,
    onClose: function onClose() {
      return setNotifOpen(false);
    },
    onOpen: function onOpen(n) {
      if (n.page && onNavigate) onNavigate(n.page);
      setNotifOpen(false);
    }
  })), React.createElement("button", {
    className: "header-icon-btn",
    title: "Account settings",
    onClick: function onClick() {
      return onNavigate && onNavigate("account");
    }
  }, React.createElement(Icon, {
    name: "Settings",
    size: 18
  })), React.createElement("div", {
    style: {
      position: "relative",
      marginLeft: 8
    }
  }, React.createElement("button", {
    className: "role-switch",
    onClick: function onClick() {
      setRoleOpen(function (v) {
        return !v;
      });
      setNotifOpen(false);
    }
  }, React.createElement("div", {
    className: "avatar"
  }, displayInitials), React.createElement("div", {
    className: "role-info"
  }, React.createElement("b", null, displayName), React.createElement("span", null, displaySubtitle)), React.createElement(Icon, {
    name: "ChevronDown",
    size: 14
  })), roleOpen && React.createElement("div", {
    className: "dropdown",
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      minWidth: 320
    }
  }, demoVerified && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "dropdown-section"
  }, "Switch test account \xB7 ", grantSystem === "au_r4" ? "AU-R4" : "AU-R3"), rolesForSystem(grantSystem).map(function (item) {
    return React.createElement("button", {
      key: item.key,
      type: "button",
      className: "dropdown-item demo-switch-item ".concat(role === item.key ? "active" : ""),
      disabled: demoSwitchBusy,
      onClick: function onClick() {
        if (role === item.key) return;
        var email = FACULTY_TEST_ROLES.some(function (facultyRole) {
          return facultyRole.key === item.key;
        }) ? facultyTestEmail(demoFaculty, item.key) : TEST_EMAIL_FOR[item.key];
        selectDemoAccount(email);
      }
    }, React.createElement("div", {
      className: "role-icon"
    }, React.createElement(Icon, {
      name: item.iconName,
      size: 14
    })), React.createElement("div", {
      className: "meta"
    }, React.createElement("div", {
      className: "t"
    }, item.name), React.createElement("div", {
      className: "s"
    }, item.subtitle)), role === item.key && React.createElement(Icon, {
      name: "Check",
      size: 14
    }));
  }), demoSwitchError && React.createElement("div", {
    className: "demo-switch-error",
    role: "alert"
  }, demoSwitchError)), React.createElement("div", {
    className: "dropdown-section"
  }, "Account"), React.createElement("div", {
    className: "dropdown-item"
  }, React.createElement("div", {
    className: "role-icon",
    style: {
      background: "var(--paper-warm)",
      color: "var(--ink-2)"
    }
  }, React.createElement(Icon, {
    name: "Settings",
    size: 14
  })), React.createElement("div", {
    className: "meta"
  }, React.createElement("div", {
    className: "t"
  }, "Account settings"), React.createElement("div", {
    className: "s"
  }, "Profile, security, notifications"))), React.createElement("div", {
    className: "dropdown-item",
    onClick: onLogout
  }, React.createElement("div", {
    className: "role-icon",
    style: {
      background: "var(--paper-warm)",
      color: "var(--ink-2)"
    }
  }, React.createElement(Icon, {
    name: "LogOut",
    size: 14
  })), React.createElement("div", {
    className: "meta"
  }, React.createElement("div", {
    className: "t"
  }, "Sign out"), React.createElement("div", {
    className: "s"
  }, "Return to AU sign-in")))))));
}
function Sidebar(_ref7) {
  var nav = _ref7.nav,
    current = _ref7.current,
    onNavigate = _ref7.onNavigate;
  return React.createElement("aside", {
    className: "sidebar"
  }, nav.map(function (item, i) {
    if (item.section) {
      return React.createElement("div", {
        key: "s".concat(i),
        className: "sidebar-section"
      }, item.section);
    }
    var isDisabled = !!item.disabled;
    var isCurrent = current === item.key || (item.activeFor || []).includes(current);
    return React.createElement("div", {
      key: item.key,
      className: "nav-item ".concat(isCurrent ? "active" : "").concat(item.key === "r-ai-assistant" || item.key === "a-analytics" || /-ai$/.test(item.key) ? " ai-assistant-item" : ""),
      "aria-disabled": isDisabled || undefined,
      title: isDisabled ? item.hint : undefined,
      style: isDisabled ? {
        cursor: "not-allowed",
        opacity: 0.58
      } : undefined,
      onClick: function onClick() {
        if (isDisabled) return;
        if (item.key === "r-ai-assistant") {
          window.dispatchEvent(new CustomEvent("au-ai-toggle"));
          return;
        }
        onNavigate(item.key);
      }
    }, React.createElement(Icon, {
      name: item.icon,
      size: 16
    }), React.createElement("span", null, item.label), item.badge && React.createElement("span", {
      className: "badge-num"
    }, item.badge));
  }));
}
function SubBar(_ref8) {
  var crumbs = _ref8.crumbs,
    onHome = _ref8.onHome,
    onCrumb = _ref8.onCrumb;
  return React.createElement("div", {
    className: "subbar"
  }, React.createElement("div", {
    className: "crumb"
  }, React.createElement("a", {
    href: "#",
    onClick: function onClick(e) {
      e.preventDefault();
      onHome();
    }
  }, "AU"), React.createElement(Icon, {
    name: "ChevronRight",
    size: 12,
    className: "sep"
  }), crumbs.slice(0, -1).map(function (c, i) {
    return React.createElement(React.Fragment, {
      key: i
    }, React.createElement("a", {
      href: "#",
      onClick: function onClick(e) {
        e.preventDefault();
        onCrumb && onCrumb(c);
      }
    }, c), React.createElement(Icon, {
      name: "ChevronRight",
      size: 12,
      className: "sep"
    }));
  }), React.createElement("span", {
    className: "current"
  }, crumbs[crumbs.length - 1])), React.createElement("div", {
    className: "right"
  }, React.createElement(Icon, {
    name: "Clock",
    size: 12
  }), React.createElement("span", null, "Last sync: 2 min ago")));
}
function PageRouter(_ref9) {
  var pageKey = _ref9.pageKey,
    navigate = _ref9.navigate,
    ctx = _ref9.ctx;
  var c = ctx;
  switch (pageKey) {
    case "r-dashboard":
      return React.createElement(ResearcherDashboard, {
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        setSelectedApplicationId: c.setSelectedApplicationId,
        grantType: c.grantType
      });
    case "r-submit":
      return c.grantType === "au_r4" ? React.createElement(ResearcherSubmitR4, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm,
        setSelectedApplicationId: c.setSelectedApplicationId
      }) : c.grantType === "au_r3" ? React.createElement(ResearcherSubmitR3, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm,
        setSelectedApplicationId: c.setSelectedApplicationId
      }) : React.createElement(Empty, {
        title: "Choose AU-R3 or AU-R4",
        desc: "Return to the grant selector and choose an active grant.",
        icon: "Folder"
      });
    case "r-applications":
      return React.createElement(ResearcherApplications, {
        navigate: navigate,
        onDownload: c.onDownload,
        setSelectedApplicationId: c.setSelectedApplicationId,
        grantType: c.grantType,
        toast: c.toast,
        setConfirm: c.setConfirm,
        onGrantSwitch: c.onGrantSwitch,
        openDraft: function openDraft(id) {
          c.setSelectedApplicationId(id);
          navigate("r-submit", {
            keepSelection: true
          });
        },
        openDetail: function openDetail(id) {
          c.setSelectedApplicationId(id);
          navigate("r-detail");
        }
      });
    case "r-detail":
      return React.createElement(ResearcherApplicationDetail, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm
      });
    case "d-dashboard":
      return React.createElement(DeanDashboard, {
        navigate: navigate,
        setSelectedApplicationId: c.setSelectedApplicationId
      });
    case "d-analytics":
      return c.profile && c.profile.role === "dean" ? React.createElement(RoleAnalyticsDashboard, {
        role: "dean"
      }) : React.createElement(Empty, {
        title: "Dean access required",
        desc: "Dean Analytics is restricted to the signed-in Dean's faculty.",
        icon: "Lock"
      });
    case "d-ai":
      return c.profile && c.profile.role === "dean" ? React.createElement(RoleAIChatbotPage, {
        role: "dean"
      }) : React.createElement(Empty, {
        title: "Dean access required",
        desc: "This AI workspace is restricted to Dean accounts.",
        icon: "Lock"
      });
    case "d-r3-screen":
      return React.createElement(DeanR3Queue, {
        navigate: navigate,
        setSelectedApplicationId: c.setSelectedApplicationId
      });
    case "d-r3-detail":
      return React.createElement(DeanR3Detail, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm
      });
    case "d-r4-screen":
      return React.createElement(DeanR4Queue, {
        navigate: navigate,
        setSelectedApplicationId: c.setSelectedApplicationId
      });
    case "d-r4-detail":
      return React.createElement(DeanR4Detail, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm
      });
    case "d-history":
      return React.createElement(DeanHistory, {
        navigate: navigate,
        setSelectedApplicationId: c.setSelectedApplicationId
      });
    case "d-history-detail":
      return React.createElement(DeanDecisionTimeline, {
        applicationId: c.selectedApplicationId,
        navigate: navigate
      });
    case "i-dashboard":
      return React.createElement(IRASDashboard, {
        navigate: navigate,
        setSelectedApplicationId: c.setSelectedApplicationId,
        grantType: c.grantType,
        onGrantSwitch: c.onGrantSwitch
      });
    case "i-analytics":
      return c.profile && c.profile.role === "iras" ? React.createElement(RoleAnalyticsDashboard, {
        role: "iras"
      }) : React.createElement(Empty, {
        title: "IRAS access required",
        desc: "IRAS Analytics is restricted to IRAS accounts.",
        icon: "Lock"
      });
    case "i-ai":
      return c.profile && c.profile.role === "iras" ? React.createElement(RoleAIChatbotPage, {
        role: "iras"
      }) : React.createElement(Empty, {
        title: "IRAS access required",
        desc: "This AI workspace is restricted to IRAS accounts.",
        icon: "Lock"
      });
    case "i-r3-verify":
      return c.role === "iras" ? React.createElement(IRASr3Detail, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm
      }) : React.createElement(Empty, {
        title: "IRAS access required",
        desc: "AU-R3 verification is available only to IRAS.",
        icon: "Lock"
      });
    case "i-r4-verify":
      return c.role === "iras" ? React.createElement(IRASr4Detail, {
        applicationId: c.selectedApplicationId,
        navigate: navigate,
        onDownload: c.onDownload,
        onView: c.onView,
        toast: c.toast,
        setConfirm: c.setConfirm
      }) : React.createElement(Empty, {
        title: "IRAS access required",
        desc: "AU-R4 verification is available only to IRAS.",
        icon: "Lock"
      });
    case "o-dashboard":
      return React.createElement(OFMDashboard, {
        navigate: navigate,
        toast: c.toast,
        setConfirm: c.setConfirm,
        grantType: c.grantType,
        onGrantSwitch: c.onGrantSwitch,
        onDownload: c.onDownload,
        onView: c.onView
      });
    case "o-summary":
      return React.createElement(OFMTotalSummary, {
        onDownload: c.onDownload,
        onView: c.onView
      });
    case "o-analytics":
      return c.profile && c.profile.role === "ofm" ? React.createElement(RoleAnalyticsDashboard, {
        role: "ofm"
      }) : React.createElement(Empty, {
        title: "Academic access required",
        desc: "Academic Analytics is restricted to Academic accounts.",
        icon: "Lock"
      });
    case "o-ai":
      return c.profile && c.profile.role === "ofm" ? React.createElement(RoleAIChatbotPage, {
        role: "ofm"
      }) : React.createElement(Empty, {
        title: "Academic access required",
        desc: "This AI workspace is restricted to Academic accounts.",
        icon: "Lock"
      });
    case "o-history":
      return React.createElement(OFMHistory, {
        grantType: c.grantType,
        onGrantSwitch: c.onGrantSwitch
      });
    case "a-dashboard":
      return React.createElement(AdminDashboard, {
        navigate: navigate
      });
    case "a-users":
      return React.createElement(AdminUsers, {
        toast: c.toast,
        setConfirm: c.setConfirm,
        profile: c.profile
      });
    case "a-analytics":
      return c.profile && c.profile.role === "admin" ? React.createElement(AnalyticsDashboard, {
        role: "admin"
      }) : React.createElement(Empty, {
        title: "Administrator access required",
        desc: "AI Analytics is available only to administrators.",
        icon: "Lock"
      });
    case "a-audit":
      return React.createElement(AdminAudit, null);
    case "forms":
      return c.role === "researcher" ? React.createElement(FormsLibrary, null) : React.createElement(Empty, {
        title: "Researcher access required",
        desc: "Official grant forms are available from the researcher workspace.",
        icon: "Lock"
      });
    case "account":
      return React.createElement(AccountSettings, {
        toast: c.toast
      });
    default:
      return React.createElement(Empty, {
        title: "Page not found",
        desc: "Use the sidebar to navigate.",
        icon: "Folder"
      });
  }
}
function readHash() {
  try {
    var h = window.location.hash || "";
    var q = h.startsWith("#") ? h.slice(1) : h;
    var params = new URLSearchParams(q);
    return {
      role: params.get("role"),
      page: params.get("page")
    };
  } catch (e) {
    return {};
  }
}
var ACTIVE_GRANT_TYPES = ["au_r3", "au_r4"];
var RETIRED_PAGES = ["r-publications", "i-publications", "o-publications", "r-progress", "r-final", "r-payments", "d-screen", "d-screen-detail", "d-sign", "d-sign-detail", "c-dashboard", "c-queue", "c-review", "c-history", "i-received", "i-screen", "i-reports", "o-payments", "o-detail"];
var LAST_PAGE_KEY_PREFIX = "au-rgms-last-page-";
function pageBelongsToRole(role, page) {
  if (!page || RETIRED_PAGES.includes(page)) return false;
  var prefix = {
    researcher: "r-",
    dean: "d-",
    iras: "i-",
    ofm: "o-",
    admin: "a-"
  }[role];
  return !!(prefix && page.startsWith(prefix)) || page === "account" || role === "researcher" && page === "forms";
}
function readLastPage(role) {
  try {
    var saved = sessionStorage.getItem(LAST_PAGE_KEY_PREFIX + role) || localStorage.getItem(LAST_PAGE_KEY_PREFIX + role);
    return pageBelongsToRole(role, saved) ? saved : null;
  } catch (e) {
    return null;
  }
}
function rememberLastPage(role, page) {
  if (!pageBelongsToRole(role, page)) return;
  try {
    sessionStorage.setItem(LAST_PAGE_KEY_PREFIX + role, page);
    localStorage.setItem(LAST_PAGE_KEY_PREFIX + role, page);
  } catch (e) {}
}
function writePageRoute(role, page) {
  if (!pageBelongsToRole(role, page)) return;
  try {
    var params = new URLSearchParams();
    params.set("role", role);
    params.set("page", page);
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + params.toString());
  } catch (e) {}
}
function App() {
  var initial = readHash();
  var startingRole = initial.role && ROLE_CONFIG[initial.role] ? initial.role : "researcher";
  var startingPage = initial.page && !RETIRED_PAGES.includes(initial.page) ? initial.page : readLastPage(startingRole) || ROLE_CONFIG[startingRole].homeKey;
  var _useState45 = useState(false),
    _useState46 = _slicedToArray(_useState45, 2),
    loggedIn = _useState46[0],
    setLoggedIn = _useState46[1];
  var _useState47 = useState(startingRole),
    _useState48 = _slicedToArray(_useState47, 2),
    role = _useState48[0],
    setRole = _useState48[1];
  var _useState49 = useState(startingPage),
    _useState50 = _slicedToArray(_useState49, 2),
    page = _useState50[0],
    setPage = _useState50[1];
  var _useState51 = useState(null),
    _useState52 = _slicedToArray(_useState51, 2),
    profile = _useState52[0],
    setProfile = _useState52[1];
  var _useState53 = useState(null),
    _useState54 = _slicedToArray(_useState53, 2),
    selectedApplicationId = _useState54[0],
    setSelectedApplicationId = _useState54[1];
  var hiddenPageRef = useRef(null);
  var _useState55 = useState(function () {
      try {
        var stored = localStorage.getItem("au-rgms-r-system");
        return ACTIVE_GRANT_TYPES.includes(stored) ? stored : null;
      } catch (e) {
        return null;
      }
    }),
    _useState56 = _slicedToArray(_useState55, 2),
    rSystem = _useState56[0],
    setRSystem = _useState56[1];
  var chooseSystem = function chooseSystem(sys, nextPage) {
    if (!ACTIVE_GRANT_TYPES.includes(sys)) return;
    try {
      localStorage.setItem("au-rgms-r-system", sys);
    } catch (e) {}
    var targetPage = nextPage || "r-dashboard";
    rememberLastPage("researcher", targetPage);
    writePageRoute("researcher", targetPage);
    setSelectedApplicationId(null);
    setRSystem(sys);
    setPage(targetPage);
  };
  var switchSystem = function switchSystem() {
    try {
      localStorage.removeItem("au-rgms-r-system");
    } catch (e) {}
    setRSystem(null);
  };
  var navigate = function navigate(key, opts) {
    if (key === "r-switch-system") {
      switchSystem();
      return;
    }
    if (RETIRED_PAGES.includes(key)) {
      var homePage = ROLE_CONFIG[role].homeKey;
      rememberLastPage(role, homePage);
      writePageRoute(role, homePage);
      setPage(homePage);
      return;
    }
    if (key === "r-submit" && !(opts && opts.keepSelection)) setSelectedApplicationId(null);
    rememberLastPage(role, key);
    writePageRoute(role, key);
    setPage(key);
  };
  var _useState57 = useState(null),
    _useState58 = _slicedToArray(_useState57, 2),
    previewDoc = _useState58[0],
    setPreviewDoc = _useState58[1];
  var _useState59 = useState(null),
    _useState60 = _slicedToArray(_useState59, 2),
    toastMsg = _useState60[0],
    setToastMsg = _useState60[1];
  var _useState61 = useState(null),
    _useState62 = _slicedToArray(_useState61, 2),
    confirm = _useState62[0],
    setConfirm = _useState62[1];
  var onDownload = function () {
    var _ref0 = _asyncToGenerator(_regenerator().m(function _callee7(doc) {
      var url, _t8;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            _context7.n = 1;
            return window.DB.documentUrl(doc, true);
          case 1:
            url = _context7.v;
            window.open(url, "_blank", "noopener,noreferrer");
            setToastMsg("Opening download for " + doc.name);
            _context7.n = 3;
            break;
          case 2:
            _context7.p = 2;
            _t8 = _context7.v;
            setToastMsg((doc && doc.name ? doc.name : "Document") + " has no uploaded file attached yet.");
          case 3:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 2]]);
    }));
    return function onDownload(_x6) {
      return _ref0.apply(this, arguments);
    };
  }();
  var onView = function () {
    var _ref1 = _asyncToGenerator(_regenerator().m(function _callee8(doc) {
      var url, _t9;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            if (!(doc && doc.storage_path)) {
              _context8.n = 4;
              break;
            }
            _context8.p = 1;
            _context8.n = 2;
            return window.DB.documentUrl(doc, false);
          case 2:
            url = _context8.v;
            window.open(url, "_blank", "noopener,noreferrer");
            return _context8.a(2);
          case 3:
            _context8.p = 3;
            _t9 = _context8.v;
            setToastMsg("Could not open " + doc.name + ": " + (_t9 && _t9.message || _t9));
          case 4:
            setPreviewDoc(doc);
          case 5:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3]]);
    }));
    return function onView(_x7) {
      return _ref1.apply(this, arguments);
    };
  }();
  var toast = function toast(msg) {
    return setToastMsg(msg);
  };
  var onLogin = function onLogin(prof) {
    if (!prof || prof.is_active === false || !ROLE_CONFIG[prof.role]) {
      window.AUTH.signOut().catch(function () {});
      setProfile(null);
      setLoggedIn(false);
      return;
    }
    var r = prof.role;
    setProfile(prof || null);
    setRole(r);
    setPage(readLastPage(r) || ROLE_CONFIG[r].homeKey);
    setLoggedIn(true);
  };
  var onLogout = function () {
    var _ref10 = _asyncToGenerator(_regenerator().m(function _callee9() {
      var _t0;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            _context9.n = 1;
            return window.AUTH.signOut();
          case 1:
            _context9.n = 3;
            break;
          case 2:
            _context9.p = 2;
            _t0 = _context9.v;
          case 3:
            switchSystem();
            setProfile(null);
            setLoggedIn(false);
          case 4:
            return _context9.a(2);
        }
      }, _callee9, null, [[0, 2]]);
    }));
    return function onLogout() {
      return _ref10.apply(this, arguments);
    };
  }();
  var onDemoSwitch = function () {
    var _ref11 = _asyncToGenerator(_regenerator().m(function _callee0(email) {
      var targetRole, identity, nextProfile, nextPage;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            targetRole = demoRoleForEmail(email);
            if (targetRole) {
              _context0.n = 1;
              break;
            }
            throw new Error("Choose a listed demo account.");
          case 1:
            _context0.n = 2;
            return window.AUTH.identity();
          case 2:
            identity = _context0.v;
            if (!(!identity || !profile || !window.AUTH.isDemoLogin(profile, identity.user) || demoRoleForEmail(identity.user.email) !== profile.role)) {
              _context0.n = 3;
              break;
            }
            throw new Error("Demo switching is available only to signed-in demo accounts.");
          case 3:
            _context0.n = 4;
            return window.AUTH.signIn(email, TEST_PASSWORD, window.AUTH.remembersSession());
          case 4:
            nextProfile = _context0.v;
            if (!(!nextProfile || nextProfile.is_active === false || nextProfile.role !== targetRole)) {
              _context0.n = 6;
              break;
            }
            _context0.n = 5;
            return window.AUTH.signOut();
          case 5:
            throw new Error("The selected test account is unavailable.");
          case 6:
            window.AUTH.setDemoLogin(nextProfile, email, true);
            try {
              localStorage.removeItem("au-rgms-r-system");
            } catch (e) {}
            nextPage = ROLE_CONFIG[targetRole].homeKey;
            rememberLastPage(targetRole, nextPage);
            writePageRoute(targetRole, nextPage);
            window.location.reload();
          case 7:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    return function onDemoSwitch(_x8) {
      return _ref11.apply(this, arguments);
    };
  }();
  useEffect(function () {
    _asyncToGenerator(_regenerator().m(function _callee1() {
      var sess, prof, _t1;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            _context1.p = 0;
            if (!isPasswordRecoveryRoute()) {
              _context1.n = 1;
              break;
            }
            return _context1.a(2);
          case 1:
            _context1.n = 2;
            return window.AUTH.session();
          case 2:
            sess = _context1.v;
            if (sess) {
              _context1.n = 3;
              break;
            }
            return _context1.a(2);
          case 3:
            _context1.n = 4;
            return window.AUTH.profile();
          case 4:
            prof = _context1.v;
            if (prof) {
              _context1.n = 5;
              break;
            }
            return _context1.a(2);
          case 5:
            if (!(prof.is_active === false || !ROLE_CONFIG[prof.role])) {
              _context1.n = 7;
              break;
            }
            _context1.n = 6;
            return window.AUTH.signOut();
          case 6:
            setProfile(null);
            setLoggedIn(false);
            return _context1.a(2);
          case 7:
            onLogin(prof);
            _context1.n = 9;
            break;
          case 8:
            _context1.p = 8;
            _t1 = _context1.v;
          case 9:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 8]]);
    }))();
  }, []);
  useEffect(function () {
    if (!window.sb || !window.sb.auth) return;
    var listener = window.sb.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setLoggedIn(false);
        return;
      }
      if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
        window.setTimeout(function () {
          window.AUTH.profile().then(function (prof) {
            if (!prof) {
              setProfile(null);
              setLoggedIn(false);
              return;
            }
            if (prof.is_active === false || !ROLE_CONFIG[prof.role]) {
              window.AUTH.signOut().catch(function () {});
              setProfile(null);
              setLoggedIn(false);
              return;
            }
            setProfile(prof);
            if (ROLE_CONFIG[prof.role]) setRole(prof.role);
            if (event === "SIGNED_IN" && ROLE_CONFIG[prof.role]) {
              setPage(function (currentPage) {
                return pageBelongsToRole(prof.role, currentPage) ? currentPage : readLastPage(prof.role) || ROLE_CONFIG[prof.role].homeKey;
              });
            }
            setLoggedIn(true);
          }).catch(function () {
            setProfile(null);
            setLoggedIn(false);
          });
        }, 0);
      }
    });
    return function () {
      if (listener && listener.data && listener.data.subscription) listener.data.subscription.unsubscribe();
    };
  }, []);
  useEffect(function () {
    if (loggedIn && profile && profile.role === role && document.visibilityState !== "hidden") {
      rememberLastPage(role, page);
      writePageRoute(role, page);
    }
  }, [loggedIn, profile, role, page]);
  useEffect(function () {
    var onVisibilityChange = function onVisibilityChange() {
      if (!loggedIn || !profile || profile.role !== role) return;
      if (document.visibilityState === "hidden") {
        hiddenPageRef.current = pageBelongsToRole(role, page) ? page : null;
        if (hiddenPageRef.current) rememberLastPage(role, hiddenPageRef.current);
        return;
      }
      var targetPage = hiddenPageRef.current || readLastPage(role);
      hiddenPageRef.current = null;
      if (targetPage && pageBelongsToRole(role, targetPage)) {
        rememberLastPage(role, targetPage);
        writePageRoute(role, targetPage);
        setPage(targetPage);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return function () {
      return document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loggedIn, profile, role, page]);
  useEffect(function () {
    var supportedSystem = ACTIVE_GRANT_TYPES.includes(rSystem);
    var researcherAI = !!(loggedIn && profile && profile.role === "researcher" && role === "researcher" && supportedSystem);
    var adminAnalyticsAI = !!(loggedIn && profile && profile.role === "admin" && role === "admin" && page === "a-analytics");
    var roleAI = !!(loggedIn && profile && profile.role === role && ["dean", "iras", "ofm"].includes(role) && page === {
      dean: "d-ai",
      iras: "i-ai",
      ofm: "o-ai"
    }[role]);
    var visible = researcherAI || adminAnalyticsAI || roleAI;
    window.AU_AI_VISIBLE = visible;
    window.AU_AI_GRANT_SYSTEM = researcherAI ? rSystem : null;
    window.AU_AI_MODE = adminAnalyticsAI ? "analytics" : roleAI ? "role" : researcherAI ? "researcher" : null;
    window.AU_AI_ROLE = visible && profile ? profile.role : null;
    window.dispatchEvent(new CustomEvent("au-ai-visibility", {
      detail: {
        visible: visible,
        grantSystem: researcherAI ? rSystem : null,
        mode: adminAnalyticsAI ? "analytics" : roleAI ? "role" : researcherAI ? "researcher" : null,
        role: visible && profile ? profile.role : null
      }
    }));
  }, [loggedIn, profile, role, page, rSystem]);
  var effectiveGrantSystem = ["iras", "ofm"].includes(role) ? ACTIVE_GRANT_TYPES.includes(rSystem) ? rSystem : "au_r3" : rSystem;
  var cfg = ROLE_CONFIG[role];
  var navForRole = role === "researcher" ? APP.NAV_RESEARCHER_R3 || cfg.nav : cfg.nav;
  var pageLabel = useMemo(function () {
    var navItem = navForRole.find(function (n) {
      return n.key === page;
    });
    if (navItem) return navItem.label;
    var special = {
      "r-detail": "Application Detail",
      "r-progress": "Project Progress Report",
      "r-final": "Project Final Report",
      "d-screen-detail": "Dean Review · Detail",
      "d-sign-detail": "Sign &amp; Forward · Detail",
      "d-r3-detail": "AU-R3 · Dean Review",
      "d-r4-detail": "AU-R4 · Dean Review",
      "d-history-detail": "Decision Timeline",
      "i-r3-verify": "AU-R3 Verification",
      "i-r4-verify": "AU-R4 Verification",
      "forms": "Forms & Templates"
    };
    return special[page] || "Dashboard";
  }, [navForRole, page]);
  var crumbs = useMemo(function () {
    return [cfg.crumbRoot, pageLabel];
  }, [cfg.crumbRoot, pageLabel]);
  if (!loggedIn) {
    return React.createElement(LoginPage, {
      onLogin: onLogin
    });
  }
  if (role === "researcher" && !rSystem) {
    return React.createElement(GrantSystemChooser, {
      profile: profile,
      onPick: chooseSystem,
      onLogout: onLogout
    });
  }
  return React.createElement("div", {
    className: "app"
  }, React.createElement(AppHeader, {
    role: role,
    profile: profile,
    onLogout: onLogout,
    onNavigate: setPage,
    onDemoSwitch: onDemoSwitch,
    grantSystem: effectiveGrantSystem
  }), React.createElement(SubBar, {
    crumbs: crumbs,
    onHome: function onHome() {
      return setPage(cfg.homeKey);
    },
    onCrumb: function onCrumb() {
      return setPage(cfg.homeKey);
    }
  }), React.createElement(Sidebar, {
    nav: navForRole,
    current: page === "d-history-detail" ? "d-history" : page,
    onNavigate: navigate
  }), React.createElement("main", {
    className: "main"
  }, React.createElement(PageRouter, {
    pageKey: page,
    navigate: navigate,
    ctx: {
      role: role,
      onDownload: onDownload,
      onView: onView,
      toast: toast,
      setConfirm: setConfirm,
      profile: profile,
      selectedApplicationId: selectedApplicationId,
      setSelectedApplicationId: setSelectedApplicationId,
      grantType: ["researcher", "ofm", "iras"].includes(role) ? effectiveGrantSystem : null,
      onGrantSwitch: chooseSystem
    }
  })), previewDoc && React.createElement(FilePreviewModal, {
    doc: previewDoc,
    onClose: function onClose() {
      return setPreviewDoc(null);
    },
    onDownload: onDownload
  }), confirm && React.createElement(ConfirmModal, {
    open: true,
    onClose: function onClose() {
      return setConfirm(null);
    },
    onConfirm: function onConfirm(reason) {
      confirm.onConfirm(reason);
      setConfirm(null);
    },
    title: confirm.title,
    message: confirm.message,
    kind: confirm.kind,
    confirmLabel: confirm.confirmLabel,
    withReason: confirm.withReason,
    reasonLabel: confirm.reasonLabel,
    reasonRequired: confirm.reasonRequired,
    finalConfirm: confirm.finalConfirm
  }), toastMsg && React.createElement(Toast, {
    message: toastMsg,
    onClose: function onClose() {
      return setToastMsg(null);
    }
  }));
}
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App, null));
