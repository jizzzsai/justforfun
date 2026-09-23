function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useMemo = _React.useMemo;
var ICONS = {
  LayoutDashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  FilePlus: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M12 12v6 M9 15h6',
  Folder: 'M4 4h6l2 3h8a0 0 0 0 1 0 0v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M8 13h8 M8 17h5 M8 9h2',
  FileCheck: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6 M9 15l2 2 4-4',
  FileSearch: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6 M14 2v6h6 M21 21l-2.5-2.5 M11.5 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  FileSignature: 'M14 2H6a2 2 0 0 0-2 2v12 M14 2v6h6 M20 8v6 M16 20l1-3 6-6 a 1.5 1.5 0 0 1 2 2 l-6 6-3 1z',
  Coins: 'M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M5.8 11.3a6 6 0 0 1 4.4-9.1 M14 16h4',
  Inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  ClipboardCheck: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z M9 14l2 2 4-4',
  Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  ShieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  GitCommit: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M1 12h6 M17 12h6',
  UserPlus: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M19 8v6 M22 11h-6',
  Award: 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12 M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  Building2: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18 M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
  GraduationCap: 'M22 10v6 M2 10l10-5 10 5-10 5z M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5',
  Landmark: 'M3 22h18 M6 18V11 M10 18V11 M14 18V11 M18 18V11 M12 2L2 7h20z M2 22V18h20v4',
  Bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  Send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  Search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  Filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  ChevronDown: 'M6 9l6 6 6-6',
  ChevronRight: 'M9 18l6-6-6-6',
  ChevronLeft: 'M15 18l-6-6 6-6',
  X: 'M18 6L6 18 M6 6l12 12',
  Plus: 'M12 5v14 M5 12h14',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  Upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  Eye: 'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  Check: 'M20 6L9 17l-5-5',
  CheckCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  AlertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01',
  Info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01',
  Edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z',
  Calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18',
  Clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  Settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  LogOut: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  HelpCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01',
  Repeat: 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3',
  Trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
  Briefcase: 'M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  Star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  BarChart3: 'M3 3v18h18 M7 16v2 M12 11v7 M17 6v12',
  TrendingUp: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  TrendingDown: 'M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6',
  Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  Phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  MoreHorizontal: 'M5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  ArrowRight: 'M5 12h14 M12 5l7 7-7 7',
  ArrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  Globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  KeyRound: 'M15.5 7.5a5 5 0 1 1-1.4 3.5L22 18.9V22h-3.1l-1.5-1.5-1.8 1.8-2.1-2.1 1.8-1.8-4.7-4.7a5 5 0 0 1-3.1 1.1z M7.5 7.5h.01',
  Bot: 'M12 8V4H8 M12 2h.01 M4 8h16v12H4z M2 14h2 M20 14h2 M9 13v2 M15 13v2 M8 18h8'
};
function Icon(_ref) {
  var name = _ref.name,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 16 : _ref$size,
    _ref$stroke = _ref.stroke,
    stroke = _ref$stroke === void 0 ? 1.75 : _ref$stroke,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  var d = ICONS[name];
  if (!d) return null;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: _objectSpread({
      flexShrink: 0
    }, style)
  }, d.split(/(?=M)/).map(function (seg, i) {
    return React.createElement("path", {
      key: i,
      d: seg.trim()
    });
  }));
}
function AULogo(_ref2) {
  var _ref2$size = _ref2.size,
    size = _ref2$size === void 0 ? 56 : _ref2$size,
    _ref2$ringColor = _ref2.ringColor,
    ringColor = _ref2$ringColor === void 0 ? "var(--au-gold)" : _ref2$ringColor,
    _ref2$ringWidth = _ref2.ringWidth,
    ringWidth = _ref2$ringWidth === void 0 ? 3 : _ref2$ringWidth,
    _ref2$plateColor = _ref2.plateColor,
    plateColor = _ref2$plateColor === void 0 ? "#fff" : _ref2$plateColor,
    _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? "" : _ref2$className;
  return React.createElement("div", {
    className: "au-logo ".concat(className),
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: plateColor,
      display: "grid",
      placeItems: "center",
      boxShadow: "0 0 0 ".concat(ringWidth, "px ").concat(ringColor, ", 0 0 0 ").concat(ringWidth + 1, "px ").concat(plateColor),
      overflow: "hidden",
      flexShrink: 0
    }
  }, React.createElement("img", {
    src: "assets/au-logo.png",
    alt: "Assumption University of Thailand",
    style: {
      width: "86%",
      height: "86%",
      objectFit: "contain"
    }
  }));
}
function Badge(_ref3) {
  var status = _ref3.status,
    children = _ref3.children,
    _ref3$dot = _ref3.dot,
    dot = _ref3$dot === void 0 ? true : _ref3$dot,
    _ref3$className = _ref3.className,
    className = _ref3$className === void 0 ? "" : _ref3$className;
  var cls = status ? status.cls : className;
  var label = status ? status.label : children;
  return React.createElement("span", {
    className: "badge ".concat(cls)
  }, dot && React.createElement("span", {
    className: "dot"
  }), label);
}
function Avatar(_ref4) {
  var initials = _ref4.initials,
    _ref4$size = _ref4.size,
    size = _ref4$size === void 0 ? 32 : _ref4$size,
    _ref4$color = _ref4.color,
    color = _ref4$color === void 0 ? "var(--au-navy)" : _ref4$color;
  return React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 700,
      fontSize: size * 0.42,
      flexShrink: 0
    }
  }, initials);
}
function Toast(_ref5) {
  var message = _ref5.message,
    onClose = _ref5.onClose;
  useEffect(function () {
    var t = setTimeout(onClose, 2400);
    return function () {
      return clearTimeout(t);
    };
  }, [message, onClose]);
  return React.createElement("div", {
    className: "toast"
  }, React.createElement(Icon, {
    name: "Download",
    size: 16
  }), message);
}
function FileRow(_ref6) {
  var doc = _ref6.doc,
    onDownload = _ref6.onDownload,
    onView = _ref6.onView,
    _ref6$missing = _ref6.missing,
    missing = _ref6$missing === void 0 ? false : _ref6$missing,
    _ref6$compact = _ref6.compact,
    compact = _ref6$compact === void 0 ? false : _ref6$compact;
  var rawName = String(doc && doc.name || "");
  var displayName = /\bau[-_\s]?r1\b/i.test(rawName) ? doc && doc.doc_type || "Uploaded document" : rawName || doc && doc.doc_type || "Uploaded document";
  return React.createElement("div", {
    className: "file-row"
  }, React.createElement("div", {
    className: "ficon",
    style: missing ? {
      background: "#FEE2E2",
      color: "#991B1B"
    } : {}
  }, React.createElement(Icon, {
    name: "FileText",
    size: 18
  })), React.createElement("div", {
    className: "fmeta"
  }, React.createElement("div", {
    className: "fn"
  }, displayName, doc.doc_type && displayName !== doc.doc_type && React.createElement("span", {
    style: {
      marginLeft: 8,
      fontSize: 10,
      fontWeight: 700,
      color: "var(--au-crimson)",
      background: "var(--au-crimson-soft)",
      padding: "2px 8px",
      borderRadius: 999
    }
  }, doc.doc_type)), React.createElement("div", {
    className: "fs"
  }, missing ? React.createElement("span", {
    style: {
      color: "#991B1B"
    }
  }, "Missing \u2014 researcher to upload") : "".concat(doc.size || "—", " \xB7 Uploaded ").concat(doc.uploadedAt || "—"))), !compact && React.createElement("div", {
    className: "factions"
  }, !missing && React.createElement(React.Fragment, null, React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      return onView && onView(doc);
    }
  }, React.createElement(Icon, {
    name: "Eye",
    size: 13
  }), " View"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      return onDownload && onDownload(doc);
    }
  }, React.createElement(Icon, {
    name: "Download",
    size: 13
  }), " Download"))));
}
function Timeline(_ref7) {
  var steps = _ref7.steps,
    app = _ref7.app,
    onStepClick = _ref7.onStepClick;
  var tl = app.timeline || {};
  return React.createElement("div", {
    className: "timeline"
  }, steps.map(function (s, i) {
    var data = tl[s.key] || {};
    var cls = data.current ? "current" : data.done ? "done" : "upcoming";
    var clickable = !!onStepClick && (s.key === "progress" || s.key === "final");
    return React.createElement("div", {
      key: s.key,
      className: "tl-step ".concat(cls).concat(clickable ? " clickable" : ""),
      role: clickable ? "button" : undefined,
      tabIndex: clickable ? 0 : undefined,
      "aria-label": clickable ? "Open " + s.label : undefined,
      onClick: clickable ? function () {
        return onStepClick(s.key);
      } : undefined,
      onKeyDown: clickable ? function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onStepClick(s.key);
        }
      } : undefined
    }, React.createElement("div", {
      className: "dot"
    }), React.createElement("div", {
      className: "t"
    }, s.label), React.createElement("div", {
      className: "s"
    }, data.date || (data.done ? "Completed" : data.current ? "In progress" : "Not started")), data.who && React.createElement("div", {
      className: "who"
    }, data.who), data.note && React.createElement("div", {
      className: "comment"
    }, data.note));
  }));
}
function HTimeline(_ref8) {
  var steps = _ref8.steps,
    app = _ref8.app;
  var tl = app.timeline || {};
  return React.createElement("div", {
    className: "tl-h"
  }, steps.map(function (s, i) {
    var data = tl[s.key] || {};
    var cls = data.current ? "current" : data.done ? "done" : "upcoming";
    return React.createElement("div", {
      key: s.key,
      className: "tl-h-step ".concat(cls)
    }, React.createElement("div", {
      className: "dot"
    }, data.done ? "✓" : i + 1), React.createElement("div", {
      className: "t"
    }, s.label), React.createElement("div", {
      className: "s"
    }, data.date || "—"));
  }));
}
function Stat(_ref9) {
  var label = _ref9.label,
    value = _ref9.value,
    icon = _ref9.icon,
    _ref9$tone = _ref9.tone,
    tone = _ref9$tone === void 0 ? "" : _ref9$tone,
    delta = _ref9.delta,
    deltaTone = _ref9.deltaTone;
  return React.createElement("div", {
    className: "stat ".concat(tone)
  }, React.createElement("div", {
    className: "icon-bg"
  }, React.createElement(Icon, {
    name: icon,
    size: 16
  })), React.createElement("div", {
    className: "label"
  }, label), React.createElement("div", {
    className: "value"
  }, value), delta && React.createElement("div", {
    className: "delta ".concat(deltaTone || "")
  }, deltaTone === "up" && React.createElement(Icon, {
    name: "TrendingUp",
    size: 12
  }), deltaTone === "dn" && React.createElement(Icon, {
    name: "TrendingDown",
    size: 12
  }), delta));
}
function AnnualFundingSummaryCard(_ref0) {
  var summary = _ref0.summary,
    _ref0$currentAmount = _ref0.currentAmount,
    currentAmount = _ref0$currentAmount === void 0 ? 0 : _ref0$currentAmount,
    _ref0$title = _ref0.title,
    title = _ref0$title === void 0 ? "Academic-Year Funding Limit" : _ref0$title,
    _ref0$compact = _ref0.compact,
    compact = _ref0$compact === void 0 ? false : _ref0$compact;
  if (!summary) {
    return React.createElement("div", {
      className: "card",
      style: {
        padding: compact ? 14 : 18,
        color: "var(--ink-3)",
        fontSize: 13
      }
    }, "Loading academic-year funding balance\u2026");
  }
  var limit = Number(summary.limit || 100000);
  var previous = Number(summary.previousCommitted != null ? summary.previousCommitted : summary.used || 0);
  var current = Math.max(0, Number(currentAmount != null ? currentAmount : summary.currentApplicationAmount || 0));
  var total = previous + current;
  var remaining = Math.max(0, limit - total);
  var availableBeforeRequest = Math.max(0, limit - previous);
  var requestOver = current > availableBeforeRequest;
  var exhausted = previous >= limit;
  var cells = [{
    label: "Annual limit",
    value: fmtBaht(limit)
  }, {
    label: "Already committed",
    value: fmtBaht(previous)
  }, {
    label: "This application",
    value: fmtBaht(current)
  }, {
    label: requestOver ? "Above remaining balance" : "Remaining after this application",
    value: fmtBaht(requestOver ? current - availableBeforeRequest : remaining),
    danger: requestOver
  }];
  return React.createElement("div", {
    className: "card card-pad-0",
    style: {
      overflow: "hidden",
      borderColor: requestOver || exhausted ? "var(--au-crimson)" : undefined
    }
  }, React.createElement("div", {
    className: "card-head",
    style: {
      minHeight: 0,
      padding: compact ? "11px 14px" : undefined
    }
  }, React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      background: requestOver || exhausted ? "var(--au-crimson-soft)" : "var(--au-gold-soft)",
      color: requestOver || exhausted ? "var(--au-crimson)" : "var(--au-gold-deep)",
      display: "grid",
      placeItems: "center"
    }
  }, React.createElement(Icon, {
    name: "Coins",
    size: 16
  })), React.createElement("div", null, React.createElement("h3", {
    style: {
      margin: 0
    }
  }, title), React.createElement("div", {
    className: "text-sm text-muted"
  }, "Academic year ", summary.academicYear || "—", " \xB7 AU-R3 and AU-R4 combined"))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: compact ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
      borderTop: "1px solid var(--line-2)"
    }
  }, cells.map(function (cell, index) {
    return React.createElement("div", {
      key: cell.label,
      style: {
        padding: compact ? "10px 14px" : "14px 16px",
        borderRight: index === cells.length - 1 ? "none" : "1px solid var(--line-2)"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: ".05em",
        color: "var(--ink-3)",
        fontWeight: 700
      }
    }, cell.label), React.createElement("div", {
      style: {
        marginTop: 4,
        fontWeight: 700,
        color: cell.danger ? "var(--au-crimson)" : "var(--ink-1)"
      }
    }, cell.value));
  })), requestOver && React.createElement("div", {
    style: {
      padding: "9px 14px",
      background: "var(--au-crimson-soft)",
      color: "var(--au-crimson)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "Reduce this request. A researcher cannot receive more than 100,000 THB in one academic year."), !requestOver && exhausted && React.createElement("div", {
    style: {
      padding: "9px 14px",
      background: "var(--au-crimson-soft)",
      color: "var(--au-crimson)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "This researcher has already used the full 100,000 THB academic-year allowance. Any new positive claim will be blocked."));
}
function Modal(_ref1) {
  var open = _ref1.open,
    onClose = _ref1.onClose,
    title = _ref1.title,
    children = _ref1.children,
    footer = _ref1.footer,
    size = _ref1.size,
    _ref1$className = _ref1.className,
    className = _ref1$className === void 0 ? "" : _ref1$className;
  if (!open) return null;
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal ".concat(size === "sm" ? "modal-sm" : "", " ").concat(className).trim(),
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, title && React.createElement("div", {
    className: "modal-head"
  }, React.createElement("h3", null, title), React.createElement("button", {
    className: "x",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "X",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body"
  }, children), footer && React.createElement("div", {
    className: "modal-foot"
  }, footer)));
}
function FilePreviewModal(_ref10) {
  var doc = _ref10.doc,
    onClose = _ref10.onClose,
    onDownload = _ref10.onDownload;
  if (!doc) return null;
  return React.createElement(Modal, {
    open: true,
    onClose: onClose,
    title: doc.name,
    footer: React.createElement(React.Fragment, null, React.createElement("button", {
      className: "btn btn-secondary",
      onClick: onClose
    }, "Close"), React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        return onDownload(doc);
      }
    }, React.createElement(Icon, {
      name: "Download",
      size: 14
    }), " Download"))
  }, React.createElement("div", {
    className: "pdf-preview"
  }, React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--au-crimson)",
      marginBottom: 12
    }
  }, "Assumption University"), React.createElement("h5", null, doc.name.replace(/_/g, " ").replace(".pdf", "")), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      marginBottom: 20
    }
  }, "No uploaded file is attached to this record."), React.createElement("div", {
    className: "ln med"
  }), React.createElement("div", {
    className: "ln"
  }), React.createElement("div", {
    className: "ln short"
  }), React.createElement("div", {
    className: "ln"
  }), React.createElement("div", {
    className: "ln med"
  }), React.createElement("div", {
    style: {
      height: 12
    }
  }), React.createElement("div", {
    className: "ln short"
  }), React.createElement("div", {
    className: "ln"
  }), React.createElement("div", {
    className: "ln med"
  }), React.createElement("div", {
    className: "ln"
  }), React.createElement("div", {
    className: "ln short"
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      marginTop: 12
    }
  }, "Document preview is unavailable.")));
}
function ConfirmModal(_ref11) {
  var open = _ref11.open,
    onClose = _ref11.onClose,
    onConfirm = _ref11.onConfirm,
    title = _ref11.title,
    message = _ref11.message,
    _ref11$kind = _ref11.kind,
    kind = _ref11$kind === void 0 ? "primary" : _ref11$kind,
    _ref11$confirmLabel = _ref11.confirmLabel,
    confirmLabel = _ref11$confirmLabel === void 0 ? "Confirm" : _ref11$confirmLabel,
    _ref11$withReason = _ref11.withReason,
    withReason = _ref11$withReason === void 0 ? false : _ref11$withReason,
    _ref11$reasonLabel = _ref11.reasonLabel,
    reasonLabel = _ref11$reasonLabel === void 0 ? "Reason / note" : _ref11$reasonLabel,
    _ref11$reasonPlacehol = _ref11.reasonPlaceholder,
    reasonPlaceholder = _ref11$reasonPlacehol === void 0 ? "Add a comment for the record — the researcher and next reviewers can see this." : _ref11$reasonPlacehol,
    _ref11$reasonRequired = _ref11.reasonRequired,
    reasonRequired = _ref11$reasonRequired === void 0 ? false : _ref11$reasonRequired,
    finalConfirm = _ref11.finalConfirm;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    reason = _useState2[0],
    setReason = _useState2[1];
  var _useState3 = useState(1),
    _useState4 = _slicedToArray(_useState3, 2),
    step = _useState4[0],
    setStep = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    finalReady = _useState6[0],
    setFinalReady = _useState6[1];
  useEffect(function () {
    if (open) {
      setReason("");
      setStep(1);
      setFinalReady(false);
    }
  }, [open]);
  useEffect(function () {
    if (step !== 2) {
      setFinalReady(false);
      return;
    }
    var timer = setTimeout(function () {
      return setFinalReady(true);
    }, 650);
    return function () {
      return clearTimeout(timer);
    };
  }, [step]);
  if (!open) return null;
  var icons = {
    primary: "Info",
    success: "CheckCircle",
    danger: "AlertCircle"
  };
  var iconCls = {
    primary: "",
    success: "gold",
    danger: "red"
  }[kind];
  var btnCls = {
    primary: "btn-primary",
    success: "btn-success",
    danger: "btn-primary"
  }[kind];
  var blocked = withReason && reasonRequired && !reason.trim();
  var twoStep = finalConfirm === undefined ? withReason : finalConfirm;
  if (step === 2) {
    return React.createElement(Modal, {
      open: true,
      onClose: onClose,
      size: "sm",
      className: "confirm-modal-final"
    }, React.createElement("div", {
      className: "conf-icon ".concat(iconCls)
    }, React.createElement(Icon, {
      name: "AlertCircle",
      size: 26
    })), React.createElement("h3", null, "Are you sure?"), React.createElement("p", null, React.createElement("b", null, title.replace(/\?$/, "")), " \u2014 ", message), React.createElement("div", {
      style: {
        textAlign: "left",
        marginTop: 10,
        border: "1px solid var(--line)",
        borderRadius: "var(--r-md)",
        background: "var(--paper-warm)",
        padding: "10px 12px"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: "var(--ink-3)",
        marginBottom: 4
      }
    }, reasonLabel), React.createElement("div", {
      style: {
        fontSize: 13,
        color: reason.trim() ? "var(--ink-1)" : "var(--ink-3)",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap"
      }
    }, reason.trim() || "No comment added.")), React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--ink-3)",
        marginTop: 10
      }
    }, "This decision is recorded in the application timeline and cannot be undone."), React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        justifyContent: "center",
        marginTop: 8
      }
    }, React.createElement("button", {
      className: "btn btn-secondary",
      onClick: function onClick() {
        return setStep(1);
      }
    }, React.createElement(Icon, {
      name: "ChevronLeft",
      size: 14
    }), " Back"), React.createElement("button", {
      className: "btn ".concat(btnCls),
      disabled: !finalReady,
      onClick: function onClick() {
        return onConfirm(reason);
      }
    }, "Yes, ", confirmLabel)));
  }
  return React.createElement(Modal, {
    open: true,
    onClose: onClose,
    size: "sm"
  }, React.createElement("div", {
    className: "conf-icon ".concat(iconCls)
  }, React.createElement(Icon, {
    name: icons[kind] || "Info",
    size: 26
  })), React.createElement("h3", null, title), React.createElement("p", null, message), withReason && React.createElement("div", {
    className: "field",
    style: {
      textAlign: "left",
      marginTop: 6
    }
  }, React.createElement("label", null, reasonLabel, reasonRequired ? " (required)" : " (optional)"), React.createElement("textarea", {
    className: "comment-input",
    value: reason,
    onChange: function onChange(e) {
      return setReason(e.target.value);
    },
    placeholder: reasonPlaceholder,
    style: {
      minHeight: 70
    }
  })), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "center",
      marginTop: 8
    }
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn ".concat(btnCls),
    disabled: blocked,
    onClick: function onClick() {
      return twoStep ? setStep(2) : onConfirm(reason);
    }
  }, confirmLabel, twoStep ? React.createElement(Icon, {
    name: "ChevronRight",
    size: 14
  }) : null)));
}
function ApplicationEventTimeline(_ref12) {
  var app = _ref12.app;
  var grantType = app && app.grant_type ? app.grant_type : "au_r3";
  var officeName = "IRAS";
  var roleName = function roleName(role) {
    return {
      researcher: "Researcher",
      dean: "Dean",
      iras: officeName,
      ofm: "Finance Office",
      admin: "Administrator"
    }[role] || "System";
  };
  var statusName = function statusName(value) {
    return value ? window.DB.statusBadge(value, grantType).label : "";
  };
  var dateTime = function dateTime(value) {
    if (!value) return "Date not recorded";
    try {
      return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return value;
    }
  };
  var eventTitle = function eventTitle(event) {
    var actor = roleName(event.actor_role);
    if (event.to_status === "rejected") return actor + " rejected the application";
    if (event.to_status === "returned") return actor + " requested revision";
    if (event.from_status === "returned" || /resubmitted/i.test(event.action || "")) return "Researcher resubmitted the application";
    if (/submitted application/i.test(event.action || "")) return "Researcher submitted the application";
    return event.action || actor + " action recorded";
  };
  var events = (app && app.events ? app.events : []).filter(function (event) {
    return event.action !== "Saved draft";
  }).map(function (event) {
    if (event.actor_role === "dean" && event.to_status === "committee_review") {
      return _objectSpread(_objectSpread({}, event), {}, {
        action: "Dean approved — forwarded to IRAS",
        to_status: "iras_review"
      });
    }
    return event;
  }).filter(function (event) {
    return event.actor_role !== "committee" && event.from_status !== "committee_review" && !/faculty committee|committee recommended|committee review/i.test(event.action || "");
  }).slice().sort(function (a, b) {
    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
  });
  if (app && app.submitted_at && !events.some(function (event) {
    return event.actor_role === "researcher" && /submit/i.test(event.action || "");
  })) {
    events.unshift({
      id: "initial-submission",
      actor_role: "researcher",
      action: "Submitted application",
      from_status: "draft",
      to_status: "submitted",
      created_at: app.submitted_at,
      note: "Initial submission."
    });
  }
  var last = events[events.length - 1];
  if (app && app.status && app.status !== "draft" && (!last || last.to_status !== app.status)) {
    events.push({
      id: "current-status",
      action: "Current application status",
      to_status: app.status,
      created_at: app.updated_at || app.decided_at || app.submitted_at,
      synthetic: true
    });
  }
  if (!events.length) return React.createElement(Empty, {
    title: "No timeline activity yet",
    desc: "Actions will appear after the researcher submits this application.",
    icon: "Clock"
  });
  return React.createElement("div", {
    className: "timeline application-event-timeline"
  }, events.map(function (event, index) {
    var tone = event.to_status === "rejected" ? "rejected" : event.to_status === "returned" ? "returned" : index === events.length - 1 && !["rejected", "completed"].includes(app.status) ? "current" : "done";
    var actor = event.actor && event.actor.full_name ? event.actor.full_name : roleName(event.actor_role);
    return React.createElement("div", {
      className: "tl-step ".concat(tone),
      key: event.id || index
    }, React.createElement("div", {
      className: "dot"
    }), React.createElement("div", {
      className: "t"
    }, eventTitle(event)), React.createElement("div", {
      className: "s"
    }, dateTime(event.created_at)), !event.synthetic && React.createElement("div", {
      className: "who"
    }, actor), (event.from_status || event.to_status) && React.createElement("div", {
      className: "event-transition"
    }, event.from_status ? statusName(event.from_status) + " → " : "", statusName(event.to_status)), event.note && React.createElement("div", {
      className: "comment",
      style: {
        whiteSpace: "pre-wrap"
      }
    }, event.note));
  }));
}
function ReviewCommentHistory(_ref13) {
  var app = _ref13.app,
    _ref13$roles = _ref13.roles,
    roles = _ref13$roles === void 0 ? ["dean", "iras"] : _ref13$roles;
  var items = [];
  var seenComments = new Set();
  var eventRoles = {
    dean: {
      label: "Dean comment",
      author: "Dean",
      initials: "DN"
    },
    iras: {
      label: "IRAS comment",
      author: "IRAS",
      initials: "IR"
    },
    ofm: {
      label: "Finance comment",
      author: "Finance Office",
      initials: "FN"
    }
  };
  roles.forEach(function (role) {
    var meta = eventRoles[role] || {
      label: role + " comment",
      author: role,
      initials: role.slice(0, 2).toUpperCase()
    };
    (app.events || []).forEach(function (event) {
      if (event.actor_role !== role || !event.note || !event.note.trim()) return;
      var body = event.note.trim();
      var signature = role + "|" + body.toLowerCase().replace(/\s+/g, " ");
      if (seenComments.has(signature)) return;
      seenComments.add(signature);
      items.push({
        key: role + "-" + event.id,
        role: meta.label,
        author: event.actor && event.actor.full_name ? event.actor.full_name : meta.author,
        body: body,
        at: event.created_at,
        initials: meta.initials
      });
    });
  });
  items.sort(function (a, b) {
    return new Date(a.at || 0) - new Date(b.at || 0);
  });
  return React.createElement("div", {
    style: {
      borderTop: "1px solid var(--line-2)",
      marginTop: 16,
      paddingTop: 16
    }
  }, React.createElement("div", {
    className: "eyebrow mb-2"
  }, "Review comments"), items.length === 0 && React.createElement("div", {
    className: "text-sm text-muted"
  }, "No review comments were submitted."), items.map(function (item) {
    return React.createElement("div", {
      key: item.key,
      className: "comment"
    }, React.createElement("div", {
      className: "head"
    }, React.createElement("div", {
      className: "av"
    }, item.initials), React.createElement("div", null, React.createElement("div", {
      className: "name"
    }, item.role), React.createElement("div", {
      className: "role"
    }, item.author))), React.createElement("div", {
      className: "body",
      style: {
        whiteSpace: "pre-wrap"
      }
    }, item.body));
  }));
}
function NotifPanel(_ref14) {
  var items = _ref14.items,
    onClose = _ref14.onClose,
    onOpen = _ref14.onOpen;
  var unread = items.filter(function (n) {
    return n.unread;
  }).length;
  return React.createElement("div", {
    className: "notif-panel",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "notif-head"
  }, React.createElement("h4", null, "Notifications"), unread > 0 && React.createElement("span", {
    className: "pill"
  }, unread), React.createElement("span", {
    className: "clear"
  }, "Mark all read")), React.createElement("div", {
    className: "notif-list"
  }, items.map(function (n) {
    return React.createElement("div", {
      key: n.id,
      className: "notif-item ".concat(n.unread ? "unread" : ""),
      onClick: function onClick() {
        return onOpen && onOpen(n);
      },
      style: {
        cursor: n.page ? "pointer" : "default"
      }
    }, React.createElement("div", {
      className: "ni"
    }, React.createElement(Icon, {
      name: n.icon || "Bell",
      size: 16
    })), React.createElement("div", {
      className: "nm"
    }, React.createElement("div", {
      className: "nt"
    }, React.createElement("b", null, n.who, ":"), " ", n.text), n.details && React.createElement("div", {
      style: {
        whiteSpace: "pre-wrap",
        marginTop: 7,
        padding: "8px 10px",
        borderRadius: 8,
        background: "var(--paper-warm)",
        color: "var(--ink-2)",
        fontSize: 11.5,
        lineHeight: 1.55
      }
    }, n.details), React.createElement("div", {
      className: "nd"
    }, n.when)));
  })), React.createElement("div", {
    className: "notif-foot"
  }, "View all notifications"));
}
function PageHeader(_ref15) {
  var title = _ref15.title,
    desc = _ref15.desc,
    actions = _ref15.actions;
  return React.createElement("div", {
    className: "page-header"
  }, React.createElement("div", {
    className: "titles"
  }, React.createElement("h1", {
    className: "serif"
  }, title), desc && React.createElement("p", {
    className: "desc"
  }, desc)), actions && React.createElement("div", {
    className: "page-actions"
  }, actions));
}
function Empty(_ref16) {
  var title = _ref16.title,
    desc = _ref16.desc,
    _ref16$icon = _ref16.icon,
    icon = _ref16$icon === void 0 ? "Folder" : _ref16$icon;
  return React.createElement("div", {
    style: {
      padding: "48px 20px",
      textAlign: "center",
      color: "var(--ink-3)"
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "var(--paper-warm)",
      color: "var(--ink-3)",
      display: "grid",
      placeItems: "center",
      margin: "0 auto 12px"
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 24
  })), React.createElement("div", {
    style: {
      fontWeight: 600,
      color: "var(--ink-1)",
      marginBottom: 4
    }
  }, title), desc && React.createElement("div", {
    style: {
      fontSize: 12
    }
  }, desc));
}
function fmtBaht(n) {
  return new Intl.NumberFormat("en-US").format(n) + " THB";
}
var AUDP_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var AUDP_DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function audpPad(n) {
  return (n < 10 ? "0" : "") + n;
}
function audpISO(y, m, d) {
  return y + "-" + audpPad(m + 1) + "-" + audpPad(d);
}
function AUDatePicker(_ref17) {
  var value = _ref17.value,
    onChange = _ref17.onChange,
    min = _ref17.min,
    max = _ref17.max,
    _ref17$placeholder = _ref17.placeholder,
    placeholder = _ref17$placeholder === void 0 ? "Select date…" : _ref17$placeholder;
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    open = _useState8[0],
    setOpen = _useState8[1];
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    panel = _useState0[0],
    setPanel = _useState0[1];
  var today = new Date();
  var sel = value ? new Date(value + "T00:00:00") : null;
  var _useState1 = useState({
      y: (sel || today).getFullYear(),
      m: (sel || today).getMonth()
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    view = _useState10[0],
    setView = _useState10[1];
  var parsedMin = min ? new Date(min + "T00:00:00") : null;
  var parsedMax = max ? new Date(max + "T00:00:00") : null;
  var minYear = parsedMin && !isNaN(parsedMin) ? parsedMin.getFullYear() : today.getFullYear() - 80;
  var maxYear = parsedMax && !isNaN(parsedMax) ? parsedMax.getFullYear() : today.getFullYear() + 20;
  var yearOptions = [];
  for (var y = maxYear; y >= minYear; y--) yearOptions.push(y);
  var wrapRef = useRef(null);
  var yearPanelRef = useRef(null);
  useEffect(function () {
    if (!open) return;
    var onDoc = function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    var onEsc = function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return function () {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);
  useEffect(function () {
    if (panel !== "year" || !yearPanelRef.current) return;
    var activeYear = yearPanelRef.current.querySelector(".active");
    if (activeYear) activeYear.scrollIntoView({
      block: "center"
    });
  }, [panel]);
  var toggle = function toggle() {
    if (!open) {
      var base = value ? new Date(value + "T00:00:00") : today;
      if (!isNaN(base)) setView({
        y: base.getFullYear(),
        m: base.getMonth()
      });
      setPanel(null);
    }
    setOpen(function (v) {
      return !v;
    });
  };
  var shift = function shift(delta) {
    return setView(function (v) {
      var d = new Date(v.y, v.m + delta, 1);
      var monthStart = audpISO(d.getFullYear(), d.getMonth(), 1);
      var monthEnd = audpISO(d.getFullYear(), d.getMonth(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
      if (min && monthEnd < min || max && monthStart > max) return v;
      return {
        y: d.getFullYear(),
        m: d.getMonth()
      };
    });
  };
  var pick = function pick(iso) {
    if (onChange) onChange(iso);
    setPanel(null);
    setOpen(false);
  };
  var inRange = function inRange(iso) {
    return (!min || iso >= min) && (!max || iso <= max);
  };
  var monthInRange = function monthInRange(y, m) {
    var monthStart = audpISO(y, m, 1);
    var monthEnd = audpISO(y, m, new Date(y, m + 1, 0).getDate());
    return (!min || monthEnd >= min) && (!max || monthStart <= max);
  };
  var changeYear = function changeYear(nextYear) {
    var nextMonth = view.m;
    if (!monthInRange(nextYear, nextMonth)) {
      var lowerMonth = parsedMin && nextYear === parsedMin.getFullYear() ? parsedMin.getMonth() : 0;
      var upperMonth = parsedMax && nextYear === parsedMax.getFullYear() ? parsedMax.getMonth() : 11;
      nextMonth = Math.max(lowerMonth, Math.min(upperMonth, nextMonth));
    }
    setView({
      y: nextYear,
      m: nextMonth
    });
    setPanel(null);
  };
  var first = new Date(view.y, view.m, 1);
  var start = new Date(view.y, view.m, 1 - first.getDay());
  var cells = [];
  for (var i = 0; i < 42; i++) {
    var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push(d);
  }
  var todayISO = audpISO(today.getFullYear(), today.getMonth(), today.getDate());
  var nice = sel && !isNaN(sel) ? sel.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
  return React.createElement("div", {
    className: "audp" + (open ? " open" : ""),
    ref: wrapRef
  }, React.createElement("button", {
    type: "button",
    className: "audp-input",
    onClick: toggle,
    "aria-haspopup": "dialog",
    "aria-expanded": open
  }, React.createElement(Icon, {
    name: "Calendar",
    size: 15,
    className: "cal"
  }), nice ? React.createElement("span", {
    className: "grow"
  }, nice) : React.createElement("span", {
    className: "grow ph"
  }, placeholder), value && React.createElement("span", {
    className: "clear",
    role: "button",
    "aria-label": "Clear date",
    onClick: function onClick(e) {
      e.stopPropagation();
      if (onChange) onChange("");
    }
  }, React.createElement(Icon, {
    name: "X",
    size: 13
  }))), open && React.createElement("div", {
    className: "audp-pop",
    role: "dialog",
    "aria-label": "Choose date"
  }, React.createElement("div", {
    className: "audp-head"
  }, React.createElement("div", {
    className: "audp-jump"
  }, React.createElement("button", {
    type: "button",
    className: "audp-jump-button audp-month-button",
    "aria-label": "Choose month",
    "aria-expanded": panel === "month",
    onClick: function onClick() {
      return setPanel(function (p) {
        return p === "month" ? null : "month";
      });
    }
  }, AUDP_MONTHS[view.m], " ", React.createElement(Icon, {
    name: "ChevronDown",
    size: 12
  })), React.createElement("button", {
    type: "button",
    className: "audp-jump-button audp-year-button",
    "aria-label": "Choose year",
    "aria-expanded": panel === "year",
    onClick: function onClick() {
      return setPanel(function (p) {
        return p === "year" ? null : "year";
      });
    }
  }, view.y, " ", React.createElement(Icon, {
    name: "ChevronDown",
    size: 12
  }))), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setPanel(null);
      shift(-1);
    },
    "aria-label": "Previous month"
  }, React.createElement(Icon, {
    name: "ChevronLeft",
    size: 15
  })), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setPanel(null);
      shift(1);
    },
    "aria-label": "Next month"
  }, React.createElement(Icon, {
    name: "ChevronRight",
    size: 15
  }))), panel === "month" ? React.createElement("div", {
    className: "audp-month-grid",
    "aria-label": "Select month"
  }, AUDP_MONTHS.map(function (month, monthIndex) {
    var disabled = !monthInRange(view.y, monthIndex);
    return React.createElement("button", {
      key: month,
      type: "button",
      disabled: disabled,
      className: view.m === monthIndex ? "active" : "",
      onClick: function onClick() {
        setView(function (v) {
          return _objectSpread(_objectSpread({}, v), {}, {
            m: monthIndex
          });
        });
        setPanel(null);
      }
    }, month.slice(0, 3));
  })) : panel === "year" ? React.createElement("div", {
    className: "audp-year-grid",
    ref: yearPanelRef,
    "aria-label": "Select year"
  }, yearOptions.map(function (year) {
    return React.createElement("button", {
      key: year,
      type: "button",
      className: view.y === year ? "active" : "",
      onClick: function onClick() {
        return changeYear(year);
      }
    }, year);
  })) : React.createElement("div", {
    className: "audp-grid"
  }, AUDP_DOW.map(function (d) {
    return React.createElement("div", {
      key: d,
      className: "audp-dow"
    }, d);
  }), cells.map(function (d, i) {
    var iso = audpISO(d.getFullYear(), d.getMonth(), d.getDate());
    var out = d.getMonth() !== view.m;
    var dis = !inRange(iso);
    var cls = "audp-day" + (out ? " out" : "") + (dis ? " dis" : "") + (iso === todayISO ? " today" : "") + (value === iso ? " sel" : "");
    return React.createElement("div", {
      key: i,
      className: cls,
      onClick: function onClick() {
        return !dis && pick(iso);
      }
    }, d.getDate());
  })), React.createElement("div", {
    className: "audp-foot"
  }, React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return pick("");
    }
  }, "Clear"), React.createElement("button", {
    type: "button",
    disabled: !inRange(todayISO),
    onClick: function onClick() {
      setView({
        y: today.getFullYear(),
        m: today.getMonth()
      });
      if (inRange(todayISO)) pick(todayISO);
    }
  }, "Today"))));
}
function submittedResearcherInfo(app) {
  if (!app) return {
    fullName: "",
    email: "",
    nameTitle: "",
    academicPosition: "",
    auId: "",
    phone: "",
    officeRoom: "",
    joinedDate: "",
    faculty: "",
    department: ""
  };
  if (window.DB && window.DB.applicationResearcherInfo) {
    var researcher = window.DB.applicationResearcherInfo(app);
    return {
      fullName: researcher.full_name || researcher.name || "",
      email: researcher.email || "",
      nameTitle: researcher.name_title || researcher.title || "",
      academicPosition: researcher.academic_position || "",
      auId: researcher.au_id || "",
      phone: normalizeThaiPhone(researcher.phone),
      officeRoom: researcher.office_room || "",
      joinedDate: researcher.joined_date || "",
      faculty: researcher.faculty || app.faculty || "",
      department: researcher.department || app.department || ""
    };
  }
  var info = app.grant_type === "au_r3" ? app.conference_info || {} : app.pub_info || {};
  var snapshot = info.researcherSnapshot || {};
  var account = app.researcher || {};
  return {
    fullName: snapshot.fullName || info.researcherName || account.full_name || account.name || "",
    email: snapshot.email || info.researcherEmail || info.contactEmail || account.email || "",
    nameTitle: snapshot.nameTitle || info.researcherTitle || account.name_title || account.title || "",
    academicPosition: snapshot.academicPosition || info.researcherPosition || account.academic_position || "",
    auId: snapshot.auId || info.researcherAuId || account.au_id || "",
    phone: normalizeThaiPhone(snapshot.phone || info.researcherPhone || account.phone),
    officeRoom: snapshot.officeRoom || info.researcherOffice || account.office_room || "",
    joinedDate: snapshot.joinedDate || info.researcherJoinedDate || account.joined_date || "",
    faculty: snapshot.faculty || app.faculty || account.faculty || "",
    department: snapshot.department || app.department || account.department || ""
  };
}
function normalizeThaiPhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}
function isValidThaiPhone(value) {
  return /^0\d{8,9}$/.test(String(value || ""));
}
function ThaiPhoneInput(_ref18) {
  var value = _ref18.value,
    _onChange = _ref18.onChange,
    _ref18$required = _ref18.required,
    required = _ref18$required === void 0 ? false : _ref18$required;
  var invalid = !!value && !isValidThaiPhone(value);
  return React.createElement(React.Fragment, null, React.createElement("input", {
    type: "tel",
    inputMode: "numeric",
    autoComplete: "tel-national",
    maxLength: 10,
    pattern: "0[0-9]{8,9}",
    value: value || "",
    onChange: function onChange(e) {
      return _onChange(normalizeThaiPhone(e.target.value));
    },
    placeholder: "e.g. 0812345678",
    "aria-invalid": invalid,
    required: required,
    style: invalid ? {
      borderColor: "var(--au-crimson)",
      color: "var(--au-crimson)"
    } : null
  }), invalid && React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--au-crimson)",
      marginTop: 4
    }
  }, "Enter 9\u201310 digits starting with 0."));
}
function researcherJoinedDate(app) {
  return submittedResearcherInfo(app).joinedDate;
}
function universityServiceEligibility(joinedDate, asOf) {
  if (!joinedDate) return {
    eligible: false,
    missing: true,
    eligibleOn: "",
    months: 0
  };
  var joined = new Date(joinedDate + "T00:00:00");
  if (isNaN(joined)) return {
    eligible: false,
    missing: true,
    eligibleOn: "",
    months: 0
  };
  var eligibleOn = new Date(joined.getFullYear() + 1, joined.getMonth(), joined.getDate());
  var today = asOf ? new Date(asOf) : new Date();
  today.setHours(0, 0, 0, 0);
  var months = (today.getFullYear() - joined.getFullYear()) * 12 + (today.getMonth() - joined.getMonth());
  if (today.getDate() < joined.getDate()) months -= 1;
  months = Math.max(0, months);
  return {
    eligible: today >= eligibleOn,
    missing: false,
    eligibleOn: audpISO(eligibleOn.getFullYear(), eligibleOn.getMonth(), eligibleOn.getDate()),
    months: months
  };
}
function ResearcherServiceEligibilityRows(_ref19) {
  var app = _ref19.app;
  var joinedDate = researcherJoinedDate(app);
  var service = universityServiceEligibility(joinedDate);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Joined Assumption University"), React.createElement("span", {
    className: "r"
  }, joinedDate ? window.DB.fmtDate(joinedDate) : "Not recorded")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "University service"), React.createElement("span", {
    className: "r"
  }, joinedDate ? service.months + " months" : "Not recorded")), React.createElement("div", {
    className: "meta-row"
  }, React.createElement("span", {
    className: "l"
  }, "Service eligibility"), React.createElement("span", {
    className: "r",
    style: {
      color: joinedDate && service.eligible ? "var(--status-approved)" : "var(--au-crimson)"
    }
  }, joinedDate ? service.eligible ? "Eligible" : "Not eligible until " + window.DB.fmtDate(service.eligibleOn) : "Not recorded")));
}
function ResearcherInformationCard(_ref20) {
  var app = _ref20.app,
    _ref20$className = _ref20.className,
    className = _ref20$className === void 0 ? "" : _ref20$className;
  var researcher = submittedResearcherInfo(app);
  var fullName = ((researcher.nameTitle ? researcher.nameTitle + " " : "") + (researcher.fullName || "")).trim() || "—";
  var row = function row(label, value) {
    return React.createElement("div", {
      className: "meta-row"
    }, React.createElement("span", {
      className: "l"
    }, label), React.createElement("span", {
      className: "r"
    }, value || "—"));
  };
  return React.createElement("div", {
    className: ("card card-pad-0 " + className).trim()
  }, React.createElement("div", {
    className: "card-head"
  }, React.createElement("h3", null, "Researcher Information")), React.createElement("div", {
    className: "card-body"
  }, row("Full name", fullName), row("Academic / administrative position", researcher.academicPosition), row("AU ID", researcher.auId), row("Email (AU only)", researcher.email), row("Phone", researcher.phone), row("Office / Room", researcher.officeRoom), row("Faculty", researcher.faculty), row("Department", researcher.department), React.createElement(ResearcherServiceEligibilityRows, {
    app: app
  })));
}
Object.assign(window, {
  Icon: Icon,
  AULogo: AULogo,
  Badge: Badge,
  Avatar: Avatar,
  Toast: Toast,
  FileRow: FileRow,
  Timeline: Timeline,
  ApplicationEventTimeline: ApplicationEventTimeline,
  HTimeline: HTimeline,
  Stat: Stat,
  Modal: Modal,
  FilePreviewModal: FilePreviewModal,
  ConfirmModal: ConfirmModal,
  ReviewCommentHistory: ReviewCommentHistory,
  NotifPanel: NotifPanel,
  PageHeader: PageHeader,
  Empty: Empty,
  fmtBaht: fmtBaht,
  AUDatePicker: AUDatePicker,
  normalizeThaiPhone: normalizeThaiPhone,
  isValidThaiPhone: isValidThaiPhone,
  ThaiPhoneInput: ThaiPhoneInput,
  researcherJoinedDate: researcherJoinedDate,
  universityServiceEligibility: universityServiceEligibility,
  ResearcherServiceEligibilityRows: ResearcherServiceEligibilityRows,
  ResearcherInformationCard: ResearcherInformationCard
});
