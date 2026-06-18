/* ============================================================
   AU Research Grant Management System
   Policy-aligned local data and role configuration

   Source rules used here:
   - AU Announcement No.12/2024, Research Grant (AU-R1 process & required documents)
   - AU Announcement No.16/2024, Paper Publication Grant
   ============================================================ */

const ALL_STAGES = [
  { key: "submission",   label: "Researcher Submission" },
  { key: "deanScreen",   label: "Dean Screening" },
  { key: "committee",    label: "Faculty Academic Committee Review" },
  { key: "deanSign",     label: "Dean Sign & Forward" },
  { key: "iras",         label: "RASSC Received" },
  { key: "expert",       label: "Expert Review" },
  { key: "president",    label: "President Approval" },
  { key: "contract",     label: "Contract Signed" },
  { key: "pay1",         label: "First Payment 30%" },
  { key: "progress",     label: "Progress Report" },
  { key: "pay2",         label: "Second Payment 40%" },
  { key: "final",        label: "Final Report" },
  { key: "pay3",         label: "Final Payment 30%" },
  { key: "closed",       label: "Project Closed" },
];

const STATUS = {
  draft:             { key: "draft",            label: "Draft",                            cls: "badge-draft" },
  submitted:         { key: "submitted",        label: "Submitted",                        cls: "badge-submitted" },
  deanScreen:        { key: "submitted",        label: "Dean Screening",                   cls: "badge-faculty" },
  committee:         { key: "committee_review", label: "Faculty Committee Review",         cls: "badge-academic" },
  academic:          { key: "committee_review", label: "Faculty Committee Review",         cls: "badge-academic" },
  dean:              { key: "dean_sign",        label: "Dean Sign & Forward",              cls: "badge-dean" },
  deanSign:          { key: "dean_sign",        label: "Dean Sign & Forward",              cls: "badge-dean" },
  iras:              { key: "iras_review",      label: "RASSC Screening",                  cls: "badge-iras" },
  expert:            { key: "expert_review",    label: "Under Expert Review",              cls: "badge-expert" },
  expertReview:      { key: "expert_review",    label: "Under Expert Review",              cls: "badge-expert" },
  president:         { key: "president_review", label: "President Approval",               cls: "badge-president" },
  presidentApproval: { key: "president_review", label: "President Approval",               cls: "badge-president" },
  approved:          { key: "approved",         label: "Approved",                         cls: "badge-signed" },
  contractP:         { key: "approved",         label: "Contract Pending",                 cls: "badge-contract" },
  contractPending:   { key: "approved",         label: "Contract Pending",                 cls: "badge-contract" },
  active:            { key: "active",           label: "Active",                           cls: "badge-paid" },
  contractSigned:    { key: "active",           label: "Contract Signed",                  cls: "badge-signed" },
  pay1:              { key: "active",           label: "First Payment Released",           cls: "badge-paid" },
  progressSubmitted: { key: "active",           label: "Progress Report Submitted",        cls: "badge-progress" },
  pay2:              { key: "active",           label: "Second Payment Released",          cls: "badge-paid" },
  finalSubmitted:    { key: "active",           label: "Final Report Submitted",           cls: "badge-final" },
  pay3:              { key: "completed",        label: "Final Payment Released",           cls: "badge-paid" },
  final:             { key: "completed",        label: "Final Report Completed",           cls: "badge-final" },
  closed:            { key: "completed",        label: "Closed",                           cls: "badge-check" },
  completed:         { key: "completed",        label: "Completed",                        cls: "badge-check" },
  revision:          { key: "returned",         label: "Revision Required",                cls: "badge-revision" },
  returned:          { key: "returned",         label: "Returned",                         cls: "badge-revision" },
  rejected:          { key: "rejected",         label: "Rejected",                         cls: "badge-rejected" },
  paymentPending:    { key: "active",           label: "Payment Pending",                  cls: "badge-pending" },
};

const REQUIRED_DOCS = [
  { id: "r1-proposal", name: "AU_Research_Proposal_Format.pdf", size: "Required", uploaded: false, uploadedAt: "Upload pending", role: "AU-R1 requirement: full research proposal format" },
  { id: "r1-budget", name: "Project_Budget_Allocation.pdf", size: "Required", uploaded: false, uploadedAt: "Upload pending", role: "AU-R1 requirement: detailed budget breakdown" },
  { id: "r1-submission", name: "AU_Research_Submission_Form.pdf", size: "Required", uploaded: false, uploadedAt: "Upload pending", role: "AU-R1 requirement: signed research submission form" },
  { id: "r1-final", name: "Final_Report.pdf", size: "After completion", uploaded: false, uploadedAt: "Due after research is completed", role: "AU-R1 completion requirement: final report hard copies and soft file" },
];

const PAPER_PRESENTATION_DOCS = [
  { id: "r3-article", name: "Full_Research_Article.pdf", role: "AU-R3 requirement: full article only" },
  { id: "r3-turnitin", name: "Turnitin_Result.pdf", role: "AU-R3 requirement: similarity must not exceed 20%" },
  { id: "r3-peer", name: "Peer_Review_Comments.pdf", role: "AU-R3 requirement when available" },
  { id: "r3-memo", name: "Dean_Signed_Memo_and_Estimated_Budget.pdf", role: "AU-R3 requirement: dean-signed memo and estimated budget" },
];

const PRIMARY_APP = {
  id: "RG-2026-001",
  title: "Test 1",
  abstract: "Test application for validating the AU research grant workflow using live Supabase data.",
  objectives: [
    "Verify the AU-R1 submission, review, approval, contract, report, and payment workflow.",
    "Confirm that every queue uses live records from Supabase.",
    "Validate PDF-based document and grant rules in the role dashboards.",
  ],
  methodology: "Functional system testing across the researcher, dean, committee, RASSC, expert, president, finance, and admin roles.",
  outcomes: [
    "A complete test run through the AU-RGMS workflow.",
    "Verified queue movement and payment gates.",
    "Clean dashboards that show only live test data.",
  ],
  researcher: {
    name: "Researcher Test",
    email: "somchai.r@au.edu",
    phone: "",
    title: "Researcher",
  },
  faculty: "Computer Science",
  department: "Computer Science",
  budgetTotal: 100000,
  budgetCurrency: "THB",
  budgetBreakdown: [
    { item: "Remuneration", amount: 30000 },
    { item: "Research equipment", amount: 40000 },
    { item: "Off-campus travel", amount: 18000 },
    { item: "Miscellaneous", amount: 12000 },
  ],
  duration: "12 months",
  submittedAt: "Jun 08, 2026",
  currentStage: "iras",
  status: STATUS.iras,
  experts: [],
  timeline: {
    submission: { done: true, date: "Jun 08, 2026", who: "Researcher Test", note: "Initial test submission." },
    deanScreen: { done: true, date: "Jun 08, 2026", who: "Dean Test", note: "Forwarded to Faculty Academic Committee." },
    committee: { done: true, date: "Jun 08, 2026", who: "Committee Test", note: "Recommended back to Dean." },
    deanSign: { done: true, date: "Jun 08, 2026", who: "Dean Test", note: "Signed and forwarded to RASSC." },
    iras: { current: true, date: "Pending RASSC screening", who: "RASSC Test" },
    expert: { done: false, date: "Pending" },
    president: { done: false, date: "Pending" },
    contract: { done: false, date: "Pending" },
    pay1: { done: false, date: "Pending" },
    progress: { done: false, date: "Pending" },
    pay2: { done: false, date: "Pending" },
    final: { done: false, date: "Pending" },
    pay3: { done: false, date: "Pending" },
    closed: { done: false, date: "Pending" },
  },
};

const APPLICATIONS = [PRIMARY_APP];

const NOTIFS = [];

const PAYMENTS = [
  { n: 1, pct: 30, amount: 30000, label: "First Disbursement", status: "After contract signing", badge: "badge-pending", date: "Unlocked when the contract is signed", requiredDoc: "Signed Contract", receipt: null },
  { n: 2, pct: 40, amount: 40000, label: "Second Disbursement", status: "After progress report approval", badge: "badge-draft", date: "Unlocked when RASSC accepts the progress report", requiredDoc: "Accepted Progress Report", receipt: null },
  { n: 3, pct: 30, amount: 30000, label: "Final Disbursement", status: "After final report approval", badge: "badge-draft", date: "Unlocked when RASSC accepts the final report", requiredDoc: "Accepted Final Report", receipt: null },
];

const ACTIVITY = [
  { t: "Live", text: "Use the role queues to move Test 1 through the AU workflow.", kind: "check" },
];

const ROLES = [
  { key: "researcher", name: "Researcher", full: "Researcher Test", subtitle: "Researcher - Test Account", initials: "RT", iconName: "GraduationCap" },
  { key: "dean", name: "Dean", full: "Dean Test", subtitle: "Dean - Test Account", initials: "DT", iconName: "Building2" },
  { key: "committee", name: "Faculty Committee", full: "Committee Test", subtitle: "Committee - Test Account", initials: "CT", iconName: "Users" },
  { key: "iras", name: "RASSC", full: "RASSC Test", subtitle: "RASSC - Test Account", initials: "RS", iconName: "Landmark" },
  { key: "expert", name: "Expert Reviewer", full: "Expert 1", subtitle: "Expert 1/2/3 - Test Accounts", initials: "E1", iconName: "FileSearch" },
  { key: "president", name: "Vice President", full: "Vice President Test", subtitle: "Vice President - Test Account", initials: "VP", iconName: "Award" },
  { key: "ofm", name: "OFM / Finance", full: "Finance Test", subtitle: "Finance - Test Account", initials: "FT", iconName: "Coins" },
  { key: "admin", name: "Administrator", full: "Admin Test", subtitle: "Admin - Test Account", initials: "AT", iconName: "Settings" },
];

const NAV_RESEARCHER = [
  { section: "WORKSPACE" },
  { key: "r-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "r-submit", label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications", icon: "Folder" },
  { key: "r-publications", label: "Publication Grant", icon: "FileText" },
  { section: "REPORTING" },
  { key: "r-progress", label: "Progress Report", icon: "FileText" },
  { key: "r-final", label: "Final Report", icon: "FileCheck" },
  { section: "FINANCE" },
  { key: "r-payments", label: "Payment Status", icon: "Coins" },
];

const NAV_DEAN = [
  { section: "WORKSPACE" },
  { key: "d-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "QUEUES" },
  { key: "d-screen", label: "First Screening Queue", icon: "ClipboardCheck" },
  { key: "d-sign", label: "Sign & Forward Queue", icon: "FileSignature" },
  { section: "TRACKING" },
  { key: "d-history", label: "Decision History", icon: "Clock" },
  { key: "d-analytics", label: "AI Analytics", icon: "TrendingUp" },
];

const NAV_COMMITTEE = [
  { section: "WORKSPACE" },
  { key: "c-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "REVIEW" },
  { key: "c-queue", label: "Review Queue", icon: "Users" },
  { key: "c-review", label: "Active Review", icon: "FileSearch" },
  { section: "TRACKING" },
  { key: "c-history", label: "Past Reviews", icon: "Clock" },
  { key: "c-analytics", label: "AI Analytics", icon: "TrendingUp" },
];

const NAV_RASSC = [
  { section: "WORKSPACE" },
  { key: "i-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "i-received", label: "Received from Dean", icon: "Inbox" },
  { section: "REVIEW" },
  { key: "i-screen", label: "Office Screening", icon: "ClipboardCheck" },
  { key: "i-assign", label: "Assign Experts", icon: "UserPlus" },
  { key: "i-reports", label: "Report Review", icon: "FileCheck" },
  { key: "i-publications", label: "Publication Grants", icon: "FileText" },
  { key: "i-analytics", label: "AI Analytics", icon: "TrendingUp" },
  { section: "TRACKING" },
  { key: "i-reviewers", label: "Reviewer Pool", icon: "Users" },
];

const NAV_EXPERT = [
  { section: "WORKSPACE" },
  { key: "e-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "e-assignments", label: "My Assignments", icon: "Folder" },
  { section: "REVIEW" },
  { key: "e-evaluate", label: "Evaluation Form", icon: "FileSearch" },
  { key: "e-history", label: "Submitted Reviews", icon: "Clock" },
];

const NAV_PRESIDENT = [
  { section: "WORKSPACE" },
  { key: "p-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "p-queue", label: "Contract Queue", icon: "FileSignature" },
  { section: "CONTRACTS" },
  { key: "p-approve", label: "Issue Contract", icon: "ShieldCheck" },
  { key: "p-contracts", label: "Contract Tracking", icon: "FileSignature" },
  { key: "p-analytics", label: "AI Analytics", icon: "TrendingUp" },
];

const NAV_OFM = [
  { section: "WORKSPACE" },
  { key: "o-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "DISBURSEMENT" },
  { key: "o-payments", label: "Payment Queue", icon: "Coins" },
  { key: "o-detail", label: "Grant Detail", icon: "FileText" },
  { key: "o-publications", label: "Publication Payments", icon: "Award" },
  { section: "TRACKING" },
  { key: "o-history", label: "Payment History", icon: "Clock" },
];

const NAV_ADMIN = [
  { section: "ADMIN" },
  { key: "a-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "a-users", label: "User Management", icon: "Users" },
  { key: "a-journals", label: "Journal Tier Reference", icon: "FileText" },
  { key: "a-analytics", label: "AI Analytics", icon: "TrendingUp" },
  { section: "SYSTEM" },
  { key: "a-audit", label: "Audit Log", icon: "Clock" },
  { key: "a-settings", label: "System Settings", icon: "Settings" },
];

const SYSTEM_USERS = [
  { id: "U001", name: "Researcher Test", email: "somchai.r@au.edu", role: "Researcher", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
  { id: "U002", name: "Dean Test", email: "dean.sci@au.edu", role: "Dean", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
  { id: "U003", name: "Committee Test", email: "comm.chair@au.edu", role: "Faculty Committee", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
  { id: "U004", name: "RASSC Test", email: "iras.office@au.edu", role: "RASSC", dept: "RASSC", status: "Active", lastLogin: "Test account" },
  { id: "U005", name: "Expert 1", email: "expert.ml@au.edu", role: "Expert Reviewer", dept: "External reviewer", status: "Active", lastLogin: "Test account" },
  { id: "U006", name: "Expert 2", email: "expert.bio@au.edu", role: "Expert Reviewer", dept: "External reviewer", status: "Active", lastLogin: "Test account" },
  { id: "U007", name: "Expert 3", email: "expert.ds@au.edu", role: "Expert Reviewer", dept: "External reviewer", status: "Active", lastLogin: "Test account" },
  { id: "U008", name: "President Test", email: "president@au.edu", role: "President", dept: "Office of the President", status: "Active", lastLogin: "Test account" },
  { id: "U009", name: "Finance Test", email: "finance@au.edu", role: "OFM / Finance", dept: "Office of Financial Management", status: "Active", lastLogin: "Test account" },
  { id: "U010", name: "Admin Test", email: "admin@au.edu", role: "Administrator", dept: "IT Services", status: "Active", lastLogin: "Test account" },
];

const JOURNAL_TIERS = [
  { code: "SJR-Q1", name: "Scopus SJR Quartile 1", incentive: 80000, count: 0 },
  { code: "SJR-Q2", name: "Scopus SJR Quartile 2", incentive: 60000, count: 0 },
  { code: "SJR-Q3", name: "Scopus SJR Quartile 3", incentive: 50000, count: 0 },
  { code: "SJR-Q4", name: "Scopus SJR Quartile 4", incentive: 40000, count: 0 },
  { code: "WoS", name: "Web of Science SCIE / SSCI / AHCI", incentive: 80000, count: 0 },
  { code: "TCI1", name: "Thai Citation Index Tier 1", incentive: "Actual fees", count: 0 },
  { code: "TCI2", name: "Thai Citation Index Tier 2", incentive: "Actual fees", count: 0 },
  { code: "CREATE", name: "Creative work at ASEAN / international level", incentive: 25000, count: 0 },
  { code: "PATENT", name: "Patent or new plant/animal registration", incentive: 10000, count: 0 },
  { code: "PETTY", name: "Petty patent", incentive: 3000, count: 0 },
];

const AUDIT_LOG = [];

const Q_DEAN_SCREEN = APPLICATIONS.filter(a => a.status.key === "submitted");
const Q_DEAN_SIGN = APPLICATIONS.filter(a => a.status.key === "dean_sign");
const Q_COMMITTEE = APPLICATIONS.filter(a => a.status.key === "committee_review");
const Q_RASSC = APPLICATIONS.filter(a => ["iras_review", "expert_review", "president_review", "approved", "active"].includes(a.status.key));
const Q_EXPERT = APPLICATIONS.filter(a => a.status.key === "expert_review");
const Q_PRESIDENT = APPLICATIONS.filter(a => a.status.key === "president_review");
const Q_OFM = APPLICATIONS.filter(a => ["approved", "active", "completed"].includes(a.status.key));

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

// Academic / personal title prefixes used at Assumption University (Brothers of
// St. Gabriel + Thai academic ranks). Used by the applicant title dropdown.
const AU_TITLES = [
  "Mr.", "Mrs.", "Ms.",
  "Dr.",
  "Lecturer",
  "Asst. Prof.", "Asst. Prof. Dr.",
  "Assoc. Prof.", "Assoc. Prof. Dr.",
  "Prof.", "Prof. Dr.",
  "Rev. Bro.", "Rev. Bro. Dr.",
];

// Work type of the proposed grant (was "Research Type").
const WORK_TYPES = ["Individual Research", "Collaborative Research", "Creative Work"];

// Default budget category caps (% of total). Admin can override these in
// Settings (stored in app_settings.budget_caps); the form falls back to these.
const DEFAULT_BUDGET_CAPS = { remuneration: 30, equipment: 50, travel: 40, misc: 20 };

// Blank AU-R1 forms a researcher may need to download (open in a new tab).
const NECESSARY_DOCS = [
  { name: "AU-R1-4 Research/Creative Grant Submission Form", file: "forms/AU-R1-4-Research-Creative-Grant-Submission-Form-1.pdf" },
  { name: "AU-R1-3 Contract for Research Grant", file: "forms/AU-R1-3-Contract-for-Research-Grant.pdf" },
  { name: "AU-R1-5 Progress Report Format", file: "forms/AU-R1-5-Progress-Report-Format.pdf" },
  { name: "AU-R1-6 Final Report Format", file: "forms/AU-R1-6-Final-Report-Format.pdf" },
];

// Document types selectable when uploading a file.
const DOC_TYPES = [
  "Research Proposal",
  "Project Budget Allocation",
  "AU Research Submission Form (AU-R1-4)",
  "Ethics / Consent document",
  "Other supporting document",
];

window.AU = {
  ALL_STAGES, STATUS, FACULTIES, REQUIRED_DOCS, PAPER_PRESENTATION_DOCS,
  AU_TITLES, WORK_TYPES, DEFAULT_BUDGET_CAPS, NECESSARY_DOCS, DOC_TYPES,
  PRIMARY_APP, APPLICATIONS,
  NOTIFS, PAYMENTS, ACTIVITY,
  ROLES,
  NAV_RESEARCHER, NAV_DEAN, NAV_COMMITTEE, NAV_RASSC,
  NAV_EXPERT, NAV_PRESIDENT, NAV_OFM, NAV_ADMIN,
  SYSTEM_USERS, JOURNAL_TIERS, AUDIT_LOG,
  Q_DEAN_SCREEN, Q_DEAN_SIGN, Q_COMMITTEE, Q_RASSC, Q_EXPERT, Q_PRESIDENT, Q_OFM,
  REQUIRED_UPLOAD_DOCS: REQUIRED_DOCS,
  FACULTY_QUEUE: APPLICATIONS.filter(a => ["submitted", "committee_review", "dean_sign", "returned"].includes(a.status.key)),
  RASSC_QUEUE: APPLICATIONS.filter(a => ["iras_review", "expert_review", "president_review", "approved", "active", "completed"].includes(a.status.key)),
};

[NAV_RESEARCHER, NAV_DEAN, NAV_COMMITTEE, NAV_RASSC, NAV_EXPERT, NAV_PRESIDENT, NAV_OFM, NAV_ADMIN].forEach(function (nav) {
  nav.push({ section: "RESOURCES" });
  nav.push({ key: "forms", label: "Forms & Templates", icon: "FileText" });
});
