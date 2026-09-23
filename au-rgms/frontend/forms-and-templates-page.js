function FormsLibrary() {
  var officialFormsUrl = "https://iras.au.edu/research-support/all-au-research-grants/";
  return React.createElement(React.Fragment, null, React.createElement(PageHeader, {
    title: "Forms & Templates",
    desc: "Use the official IRAS page for the latest AU research grant forms, templates, and supporting documents."
  }), React.createElement("div", {
    className: "card",
    style: {
      maxWidth: 760,
      padding: "34px 38px"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 18
    }
  }, React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      display: "grid",
      placeItems: "center",
      background: "var(--au-crimson-soft)",
      color: "var(--au-crimson)",
      flexShrink: 0
    }
  }, React.createElement(Icon, {
    name: "ExternalLink",
    size: 22
  })), React.createElement("div", null, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 7
    }
  }, "Official IRAS resource"), React.createElement("h3", {
    style: {
      margin: "0 0 8px"
    }
  }, "All AU Research Grant Forms"), React.createElement("p", {
    className: "text-sm text-muted",
    style: {
      margin: "0 0 18px",
      lineHeight: 1.65
    }
  }, "Open the IRAS website to access the current documents for AU-R3 and AU-R4."), React.createElement("a", {
    className: "btn btn-primary",
    href: officialFormsUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Open Official Forms ", React.createElement(Icon, {
    name: "ExternalLink",
    size: 14
  }))))));
}
window.FormsLibrary = FormsLibrary;
