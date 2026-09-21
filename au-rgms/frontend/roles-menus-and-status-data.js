








const PAPER_PRESENTATION_DOCS = [
  { id: "r3-paper", name: "Full_Conference_Paper.pdf", role: "AU-R3 requirement: complete conference paper" },
  { id: "r3-turnitin", name: "Turnitin_Report.pdf", role: "AU-R3 requirement: Turnitin similarity report" },
  { id: "r3-acceptance", name: "Conference_Acceptance_Letter.pdf", role: "AU-R3 requirement: official conference acceptance letter" },
];

const NOTIFS = [];

const ROLES = [
  { key: "researcher", name: "Researcher", full: "Researcher Test", subtitle: "Researcher - Test Account", initials: "RT", iconName: "GraduationCap" },
  { key: "dean", name: "Dean", full: "Dean Test", subtitle: "Dean - Test Account", initials: "DT", iconName: "Building2" },
  { key: "iras", name: "IRAS", full: "IRAS Test", subtitle: "IRAS - Test Account", initials: "IR", iconName: "ShieldCheck" },
  { key: "ofm", name: "OFM / Finance", full: "Finance Test", subtitle: "Finance - Test Account", initials: "FT", iconName: "Coins" },
  { key: "admin", name: "Administrator", full: "Admin Test", subtitle: "Admin - Test Account", initials: "AT", iconName: "Settings" },
];

const NAV_RESEARCHER = [
  { section: "WORKSPACE" },
  { key: "r-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "r-submit", label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications", icon: "Folder" },
  { section: "RESOURCES" },
  { key: "r-ai-assistant", label: "AI Assistant", icon: "Bot" },
  { key: "forms", label: "Forms & Templates", icon: "FileText" },
];

const NAV_RESEARCHER_R3 = [
  { section: "WORKSPACE" },
  { key: "r-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "r-submit", label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications", icon: "Folder" },
  { section: "RESOURCES" },
  { key: "r-ai-assistant", label: "AI Assistant", icon: "Bot" },
  { key: "forms", label: "Forms & Templates", icon: "FileText" },
];

const NAV_DEAN = [
  { section: "WORKSPACE" },
  { key: "d-dashboard", label: "Summary", icon: "LayoutDashboard" },
  { section: "TOTAL SUMMARY" },
  { key: "d-analytics", label: "Analytics", icon: "BarChart3" },
  { key: "d-ai", label: "AI Chatbot", icon: "Bot" },
  { section: "QUEUES" },
  { key: "d-r3-screen", label: "AU-R3 Queue", icon: "Users" },
  { key: "d-r4-screen", label: "AU-R4 Queue", icon: "Award" },
  { section: "TRACKING" },
  { key: "d-history", label: "Decision History", icon: "Clock" },
];

const NAV_IRAS = [
  { section: "WORKSPACE" },
  { key: "i-dashboard", label: "Summary", icon: "LayoutDashboard" },
  { section: "TOTAL SUMMARY" },
  { key: "i-analytics", label: "Analytics", icon: "BarChart3" },
  { key: "i-ai", label: "AI Chatbot", icon: "Bot" },
  { section: "REVIEW" },
  { key: "i-screening", label: "IRAS Screening", icon: "ClipboardCheck", disabled: true, activeFor: ["i-r3-verify", "i-r4-verify"], hint: "Choose Verify from the AU-R3 or AU-R4 dashboard first." },
];

const NAV_OFM = [
  { section: "WORKSPACE" },
  { key: "o-dashboard", label: "Summary", icon: "LayoutDashboard" },
  { section: "TOTAL SUMMARY" },
  { key: "o-analytics", label: "Analytics", icon: "TrendingUp" },
  { key: "o-ai", label: "AI Chatbot", icon: "Bot" },
  { section: "TRACKING" },
  { key: "o-history", label: "Payment History", icon: "Clock" },
];

const NAV_ADMIN = [
  { section: "ADMIN" },
  { key: "a-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "a-users", label: "User Management", icon: "Users" },
  { key: "a-analytics", label: "AI Analytics", icon: "TrendingUp" },
  { section: "SYSTEM" },
  { key: "a-audit", label: "Audit Log", icon: "Clock" },
];

const SYSTEM_USERS = [
  { id: "U001", name: "Researcher Test", email: "researcher.test@au.edu", role: "Researcher", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
  { id: "U002", name: "Dean Test", email: "dean.sci@au.edu", role: "Dean", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
  { id: "U005", name: "IRAS Test", email: "iras@au.edu", role: "IRAS", dept: "IRAS", status: "Active", lastLogin: "Test account" },
  { id: "U009", name: "Finance Test", email: "finance@au.edu", role: "OFM / Finance", dept: "Office of Financial Management", status: "Active", lastLogin: "Test account" },
  { id: "U010", name: "Admin Test", email: "admin@au.edu", role: "Administrator", dept: "IT Services", status: "Active", lastLogin: "Test account" },
];

const FACULTIES = [
  { code: "VMES", name: "Vincent Mary School of Engineering, Science and Technology", departments: ["Computer Science", "Information Technology", "Computer Engineering", "Electrical Engineering", "Mechatronics Engineering", "Aircraft Maintenance Engineering"] },
  { code: "MSME", name: "Martin de Tours School of Management and Economics", departments: ["Business Administration", "Marketing", "Finance and Banking", "Accounting", "Business Economics", "Hospitality and Tourism Management"] },
  { code: "ARTS", name: "Theodore Maria School of Arts", departments: ["English", "Business English", "French", "Chinese"] },
  { code: "COMM", name: "Albert Laurence School of Communication Arts", departments: ["Advertising", "Public Relations", "New Media Communication"] },
  { code: "ARCH", name: "Montfort del Rosario School of Architecture and Design", departments: ["Architecture", "Interior Architecture", "Design"] },
  { code: "NURSE", name: "Bernadette de Lourdes School of Nursing Science", departments: ["Nursing Science"] },
  { code: "LAW", name: "School of Law", departments: ["Business Law"] },
  { code: "BIOTECH", name: "School of Biotechnology", departments: ["Food Technology", "Agro-Industry"] },
  { code: "MUSIC", name: "School of Music", departments: ["Music Performance", "Music Business"] },
];

const AU_TITLES = [
  "Mr.", "Mrs.", "Ms.",
  "Dr.",
  "Lecturer",
  "Asst. Prof.", "Asst. Prof. Dr.",
  "Assoc. Prof.", "Assoc. Prof. Dr.",
  "Prof.", "Prof. Dr.",
  "Rev. Bro.", "Rev. Bro. Dr.",
];

// Administrative and teaching positions shown on the AU VMES faculty directory.
// These are distinct from an academic title such as "Asst. Prof. Dr.".
const AU_ACADEMIC_POSITIONS = [
  "Dean",
  "Associate Dean",
  "Assistant Dean for Academic Affairs",
  "Assistant Dean for Administrative and Student Affairs",
  "Assistant Dean for Special Affairs",
  "Chairperson / Head of Department",
  "Deputy Chairperson",
  "Graduate Director",
  "Full-Time Lecturer",
];

const WORK_TYPES = ["Individual Research", "Collaborative Research", "Creative Work"];

const DEFAULT_BUDGET_CAPS = { remuneration: 30, equipment: 50, travel: 40, misc: 20 };

const NECESSARY_DOCS = [];

const REIMBURSE_CATEGORIES = [
  "Travel & transport", "Materials & supplies", "Equipment", "Software & subscriptions",
  "Publication / page fees", "Participant / data-collection costs", "Other",
];

const DOC_TYPES = ["Full Conference Paper", "Turnitin Report", "Conference Acceptance Letter"];

const R3_CONFERENCE_TYPES = ["Domestic", "International"];
const R3_CONFERENCE_DBS = ["SCOPUS", "Web of Science (WoS)", "IEEE", "TCI", "ERIC", "MathSciNet", "PubMed", "JSTOR", "Project MUSE", "Other"];

const R3_DOC_TYPES = [
  "Full Conference Paper",
  "Turnitin Report",
  "Conference Acceptance Letter",
];

const GRANT_SYSTEMS = [
  {
    id: "au_r3", code: "AU-R3", enabled: true, collaborative: true,
    name: "Paper Presentation Grant",
    tagline: "Present a paper at a domestic or international conference.",
    maxAmount: 3500, maxLabel: "฿3,500 fixed grant",
    icon: "Users", accent: "#9E1B1B", accentSoft: "#F8E8E8",
  },
  {
    id: "au_r4", code: "AU-R4", enabled: true, collaborative: false,
    name: "Publication Fees & Reward",
    tagline: "Submit a published or accepted journal article for publication-fee review.",
    maxAmount: 80000, maxLabel: "฿80,000 / article",
    icon: "Award", accent: "#9E1B1B", accentSoft: "#F8E8E8",
  },
];

const R4_INDEX_TYPES = [
  { key: "scopus", label: "Scopus (SJR quartile)", quartiles: true },
  { key: "wos", label: "Web of Science (SCIE / SSCI / AHCI)", reward: 80000 },
  { key: "intl_db", label: "Intl. database (ERIC, MathSciNet, PubMed, JSTOR, Project Muse)", reward: 25000 },
  { key: "tci1", label: "Thai Citation Index — Tier 1 (publication fee)", actual: true },
  { key: "tci2", label: "Thai Citation Index — Tier 2 (publication fee)", actual: true },
  { key: "creative", label: "Creative work (ASEAN / international)", reward: 25000 },
  { key: "patent", label: "Patent / registered new plant or animal", reward: 10000 },
  { key: "petty", label: "Petty patent", reward: 3000 },
];
const R4_SCOPUS_QUARTILE_REWARD = { Q1: 80000, Q2: 60000, Q3: 50000, Q4: 40000 };

function r4EstimateReward(indexKey, quartile, feeAmount) {
  const t = R4_INDEX_TYPES.find(x => x.key === indexKey);
  if (!t) return 0;
  if (t.quartiles) return R4_SCOPUS_QUARTILE_REWARD[quartile] || 0;
  if (t.actual) return Math.max(0, Number(feeAmount) || 0);
  return t.reward || 0;
}

const R4_ARTICLE_TYPES = ["Research Article", "Academic Article"];
const R4_PUB_STATUS = ["Published", "Accepted for Publication"];
const R4_JOURNAL_DBS = ["SCOPUS", "Web of Science (WoS)", "TCI", "ERIC", "MathSciNet", "PubMed", "JSTOR", "Project MUSE", "Other"];
const R4_JOURNAL_CLASSIFICATIONS = {
  SCOPUS: ["Q1", "Q2", "Q3", "Q4"],
  "Web of Science (WoS)": ["SCIE", "SSCI", "AHCI"],
  TCI: ["Tier 1", "Tier 2"],
};
const R4_WOS_INDEXES = ["SCIE", "SSCI", "AHCI"];
const R4_OPEN_ACCESS = ["Open Access", "Subscription", "Hybrid"];
const R4_AUTHOR_TYPES = ["First Author", "Co-author"];
const R4_APPLICANT_ROLES = ["First Author", "Co-author"];
const R4_CLAIM_TYPES = ["Publication Fee Reimbursement", "Publication Reward", "Publication Fee and Reward"];
const R4_DECLARATIONS = [
  "I confirmed that this article was not part of a senior project, thesis, dissertation, or independent study for which I claimed an ineligible advisor reward.",
  "I agreed that Assumption University would be identified as the grantor or institutional affiliation wherever required.",
  "I confirmed that this journal was not a predatory journal and was not listed in Beall's List.",
  "I confirmed that the author names and contribution declarations were accurate.",
  "I confirmed that the original publication-fee receipt had not been used for another claim.",
  "I confirmed that this application met the eligible academic-year requirement.",
  "I confirmed that all submitted information and documents were true, accurate, and complete.",
];

function r4RewardForJournal(db, quartile, feeAmount) {
  var fee = Math.max(0, Number(feeAmount) || 0);
  if (db === "SCOPUS") return ({ Q1: 80000, Q2: 60000, Q3: 50000, Q4: 40000 })[quartile] || 0;
  if (db === "Web of Science") return 80000;
  if (["ERIC", "MathSciNet", "PubMed", "JSTOR", "Project Muse"].indexOf(db) >= 0) return 25000;
  if (db === "TCI Tier 1" || db === "TCI Tier 2") return fee;
  return 0;
}
function r4CategoryLabel(db, quartile, wos) {
  if (db === "SCOPUS") return "SCOPUS " + (quartile || "");
  if (db === "Web of Science") return "Web of Science" + (wos ? " (" + wos + ")" : "");
  return db || "";
}

const R4_DOC_TYPES = [
  "Full Research Article",
  "Acceptance Letter",
  "Author Contribution Statement",
  "Turnitin Result (≤ 20%)",
  "Receipt of Publication Fee",
  "Other supporting document",
];

const R4_REQUIRED_DOCS = [
  { id: "r4-article", name: "Full Research Article", role: "the full published article (not just the abstract)" },
  { id: "r4-contribution", name: "Author Contribution Statement", role: "the signed author-contribution information" },
  { id: "r4-turnitin", name: "Turnitin Result", role: "similarity must not exceed 20%" },
  { id: "r4-receipt", name: "Receipt of Publication Fee", role: "the original receipt of the fee you paid" },
];

window.AU = {
  FACULTIES, PAPER_PRESENTATION_DOCS,
  AU_TITLES, AU_ACADEMIC_POSITIONS, WORK_TYPES, DEFAULT_BUDGET_CAPS, NECESSARY_DOCS, DOC_TYPES, R3_DOC_TYPES, R3_CONFERENCE_TYPES, R3_CONFERENCE_DBS, GRANT_SYSTEMS, REIMBURSE_CATEGORIES,
  R4_INDEX_TYPES, R4_SCOPUS_QUARTILE_REWARD, r4EstimateReward, R4_DOC_TYPES, R4_REQUIRED_DOCS,
  R4_ARTICLE_TYPES, R4_PUB_STATUS, R4_JOURNAL_DBS, R4_JOURNAL_CLASSIFICATIONS, R4_WOS_INDEXES, R4_OPEN_ACCESS, R4_AUTHOR_TYPES,
  R4_APPLICANT_ROLES, R4_CLAIM_TYPES, R4_DECLARATIONS, r4RewardForJournal, r4CategoryLabel,
  NOTIFS,
  ROLES,
  NAV_RESEARCHER, NAV_RESEARCHER_R3, NAV_DEAN, NAV_IRAS,
  NAV_OFM, NAV_ADMIN,
  SYSTEM_USERS,
};
