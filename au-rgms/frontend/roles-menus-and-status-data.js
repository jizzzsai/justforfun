








const ALL_STAGES = [
  { key: "submission",   label: "Researcher Submission" },
  { key: "deanScreen",   label: "Dean Screening" },
  { key: "committee",    label: "Faculty Committee Review" },
  { key: "iras",         label: "RASSC Approval" },
  { key: "contract",     label: "Contract Signed" },
  { key: "pay1",         label: "Phase 1 Approved 30%" },
  { key: "progress",     label: "Progress Report" },
  { key: "pay2",         label: "Phase 2 Approved 40%" },
  { key: "final",        label: "Final Report" },
  { key: "pay3",         label: "Phase 3 Approved 30%" },
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
  pay1:              { key: "active",           label: "Phase 1 Paid",                    cls: "badge-paid" },
  progressSubmitted: { key: "active",           label: "Progress Report Submitted",        cls: "badge-progress" },
  pay2:              { key: "active",           label: "Phase 2 Paid",                    cls: "badge-paid" },
  finalSubmitted:    { key: "active",           label: "Final Report Submitted",           cls: "badge-final" },
  pay3:              { key: "completed",        label: "Phase 3 Paid",                    cls: "badge-paid" },
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
  { id: "r3-memo", name: "Dean_Signed_Memo.pdf", role: "AU-R3 requirement: memo signed by the Dean" },
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
    email: "researcher.test@au.edu",
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
  { n: 1, pct: 30, amount: 30000, label: "Phase 1 Payment", status: "After grant approval", badge: "badge-pending", date: "Finance pays Phase 1", requiredDoc: "Approved Grant", receipt: null },
  { n: 2, pct: 40, amount: 40000, label: "Phase 2 Payment", status: "After progress report approval", badge: "badge-draft", date: "Finance pays Phase 2 after RASSC accepts the progress report", requiredDoc: "Accepted Progress Report", receipt: null },
  { n: 3, pct: 30, amount: 30000, label: "Phase 3 Payment", status: "After final report approval", badge: "badge-draft", date: "Finance pays Phase 3 after RASSC accepts the final report", requiredDoc: "Accepted Final Report", receipt: null },
];

const ACTIVITY = [
  { t: "Live", text: "Use the role queues to move Test 1 through the AU workflow.", kind: "check" },
];

const ROLES = [
  { key: "researcher", name: "Researcher", full: "Researcher Test", subtitle: "Researcher - Test Account", initials: "RT", iconName: "GraduationCap" },
  { key: "dean", name: "Dean", full: "Dean Test", subtitle: "Dean - Test Account", initials: "DT", iconName: "Building2" },
  { key: "committee", name: "Faculty Committee", full: "Committee Test", subtitle: "Committee - Test Account", initials: "CT", iconName: "Users" },
  { key: "iras", name: "RASSC", full: "RASSC Test", subtitle: "RASSC - Test Account", initials: "RS", iconName: "Landmark" },
  { key: "ofm", name: "OFM / Finance", full: "Finance Test", subtitle: "Finance - Test Account", initials: "FT", iconName: "Coins" },
  { key: "admin", name: "Administrator", full: "Admin Test", subtitle: "Admin - Test Account", initials: "AT", iconName: "Settings" },
];

const NAV_RESEARCHER = [
  { section: "WORKSPACE" },
  { key: "r-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "r-submit", label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications", icon: "Folder" },
  { section: "GRANT SYSTEM" },
  { key: "r-switch-system", label: "Switch Grant System", icon: "Repeat" },
  { section: "RESOURCES" },
  { key: "r-ai-assistant", label: "AI Assistant", icon: "Bot" },
  { key: "forms", label: "Forms & Templates", icon: "FileText" },
];

const NAV_RESEARCHER_R3 = [
  { section: "WORKSPACE" },
  { key: "r-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "r-submit", label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications", icon: "Folder" },
  { section: "FINANCE" },
  { key: "r-payments", label: "Payment Status", icon: "Coins" },
  { section: "RESOURCES" },
  { key: "r-ai-assistant", label: "AI Assistant", icon: "Bot" },
  { key: "forms", label: "Forms & Templates", icon: "FileText" },
  { section: "GRANT SYSTEM" },
  { key: "r-switch-system", label: "Switch Grant System", icon: "Repeat" },
];

const NAV_DEAN = [
  { section: "WORKSPACE" },
  { key: "d-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "QUEUES" },
  { key: "d-screen", label: "AU-R1 Queue", icon: "ClipboardCheck" },
  { key: "d-r3-screen", label: "AU-R3 Queue", icon: "Users" },
  { key: "d-r4-screen", label: "AU-R4 Queue", icon: "Award" },
  { section: "TRACKING" },
  { key: "d-history", label: "Decision History", icon: "Clock" },
];

const NAV_COMMITTEE = [
  { section: "WORKSPACE" },
  { key: "c-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "REVIEW" },
  { key: "c-queue", label: "Review Queue", icon: "Users" },
  { key: "c-review", label: "Active Review", icon: "FileSearch" },
  { section: "TRACKING" },
  { key: "c-history", label: "Past Reviews", icon: "Clock" },
];

const NAV_RASSC = [
  { section: "WORKSPACE" },
  { key: "i-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "i-received", label: "Received from Committee", icon: "Inbox" },
  { section: "REVIEW" },
  { key: "i-screen", label: "Office Screening", icon: "ClipboardCheck" },
  { key: "i-reports", label: "Report Review", icon: "FileCheck" },
  { key: "i-publications", label: "Publication Grants", icon: "FileText" },
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
];

const NAV_OFM = [
  { section: "WORKSPACE" },
  { key: "o-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { section: "PAYMENTS" },
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
  { key: "a-analytics", label: "AI Analytics", icon: "TrendingUp" },
  { section: "SYSTEM" },
  { key: "a-audit", label: "Audit Log", icon: "Clock" },
];

const SYSTEM_USERS = [
  { id: "U001", name: "Researcher Test", email: "researcher.test@au.edu", role: "Researcher", dept: "Computer Science", status: "Active", lastLogin: "Test account" },
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
  { code: "TCI1", name: "Thai Citation Index Tier 1", incentive: "Publication fee", count: 0 },
  { code: "TCI2", name: "Thai Citation Index Tier 2", incentive: "Publication fee", count: 0 },
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

const AU_TITLES = [
  "Mr.", "Mrs.", "Ms.",
  "Dr.",
  "Lecturer",
  "Asst. Prof.", "Asst. Prof. Dr.",
  "Assoc. Prof.", "Assoc. Prof. Dr.",
  "Prof.", "Prof. Dr.",
  "Rev. Bro.", "Rev. Bro. Dr.",
];

const WORK_TYPES = ["Individual Research", "Collaborative Research", "Creative Work"];

const DEFAULT_BUDGET_CAPS = { remuneration: 30, equipment: 50, travel: 40, misc: 20 };

const NECESSARY_DOCS = [
  { name: "AU-R1-4 Research/Creative Grant Submission Form", file: "forms/AU-R1-4-Research-Creative-Grant-Submission-Form-1.pdf" },
  { name: "AU-R1-3 Contract for Research Grant", file: "forms/AU-R1-3-Contract-for-Research-Grant.pdf" },
  { name: "AU-R1-5 Progress Report Format", file: "forms/AU-R1-5-Progress-Report-Format.pdf" },
  { name: "AU-R1-6 Final Report Format", file: "forms/AU-R1-6-Final-Report-Format.pdf" },
];

const REIMBURSE_CATEGORIES = [
  "Travel & transport", "Materials & supplies", "Equipment", "Software & subscriptions",
  "Publication / page fees", "Participant / data-collection costs", "Other",
];

const DOC_TYPES = [
  "Research Proposal",
  "Project Budget Allocation",
  "AU Research Submission Form (AU-R1-4)",
  "Ethics / Consent document",
  "Other supporting document",
];

const R3_CONFERENCE_TYPES = ["Domestic", "International"];

const R3_DOC_TYPES = [
  "Full Research Article",
  "Turnitin Result (≤ 20%)",
  "Peer Review Comments",
  "Dean-signed Memo",
  "Other supporting document",
];

const GRANT_SYSTEMS = [
  {
    id: "au_r1", code: "AU-R1", enabled: true, collaborative: false,
    name: "Internal Research / Creative Grant",
    tagline: "Research, creative or academic works produced within AU.",
    maxAmount: 100000, maxLabel: "฿100,000 / academic year",
    icon: "FileText", accent: "#9E1B1B", accentSoft: "#F8E8E8",
  },
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
const R4_AUTHOR_TYPES = ["First Author", "Corresponding Author"];
const R4_APPLICANT_ROLES = ["First Author", "Corresponding Author"];
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
  "Dean-signed Memo",
  "Other supporting document",
];

const R4_REQUIRED_DOCS = [
  { id: "r4-article", name: "Full Research Article", role: "the full published article (not just the abstract)" },
  { id: "r4-contribution", name: "Author Contribution Statement", role: "the signed author-contribution information" },
  { id: "r4-turnitin", name: "Turnitin Result", role: "similarity must not exceed 20%" },
  { id: "r4-receipt", name: "Receipt of Publication Fee", role: "the original receipt of the fee you paid" },
  { id: "r4-memo", name: "Dean-signed Memo", role: "a memo signed by your Dean" },
];

window.AU = {
  ALL_STAGES, STATUS, FACULTIES, REQUIRED_DOCS, PAPER_PRESENTATION_DOCS,
  AU_TITLES, WORK_TYPES, DEFAULT_BUDGET_CAPS, NECESSARY_DOCS, DOC_TYPES, R3_DOC_TYPES, R3_CONFERENCE_TYPES, GRANT_SYSTEMS, REIMBURSE_CATEGORIES,
  R4_INDEX_TYPES, R4_SCOPUS_QUARTILE_REWARD, r4EstimateReward, R4_DOC_TYPES, R4_REQUIRED_DOCS,
  R4_ARTICLE_TYPES, R4_PUB_STATUS, R4_JOURNAL_DBS, R4_JOURNAL_CLASSIFICATIONS, R4_WOS_INDEXES, R4_OPEN_ACCESS, R4_AUTHOR_TYPES,
  R4_APPLICANT_ROLES, R4_CLAIM_TYPES, R4_DECLARATIONS, r4RewardForJournal, r4CategoryLabel,
  PRIMARY_APP, APPLICATIONS,
  NOTIFS, PAYMENTS, ACTIVITY,
  ROLES,
  NAV_RESEARCHER, NAV_RESEARCHER_R3, NAV_DEAN, NAV_COMMITTEE, NAV_RASSC,
  NAV_EXPERT, NAV_PRESIDENT, NAV_OFM, NAV_ADMIN,
  SYSTEM_USERS, JOURNAL_TIERS, AUDIT_LOG,
  Q_DEAN_SCREEN, Q_DEAN_SIGN, Q_COMMITTEE, Q_RASSC, Q_EXPERT, Q_PRESIDENT, Q_OFM,
  REQUIRED_UPLOAD_DOCS: REQUIRED_DOCS,
  FACULTY_QUEUE: APPLICATIONS.filter(a => ["submitted", "committee_review", "dean_sign", "returned"].includes(a.status.key)),
  RASSC_QUEUE: APPLICATIONS.filter(a => ["iras_review", "expert_review", "president_review", "approved", "active", "completed"].includes(a.status.key)),
};

[NAV_DEAN, NAV_COMMITTEE, NAV_RASSC, NAV_EXPERT, NAV_PRESIDENT, NAV_OFM, NAV_ADMIN].forEach(function (nav) {
  nav.push({ section: "RESOURCES" });
  nav.push({ key: "forms", label: "Forms & Templates", icon: "FileText" });
});
