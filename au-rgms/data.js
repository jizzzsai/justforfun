/* ============================================================
   AU Research Grant Management System
   Mock data + role configuration

   8 roles · 14-step workflow:
   Submitted → Dean Screening → Faculty Committee Review →
   Dean Sign & Forward → RASSC → Expert Review → President →
   Contract Signed → Payment 30% → Progress Report →
   Payment 40% → Final Report → Payment 30% → Closed
   ============================================================ */

/* --- Canonical workflow stages (for timelines) ---------------- */
const ALL_STAGES = [
  { key: "submission",   label: "Researcher Submission" },
  { key: "deanScreen",   label: "Dean Screening" },
  { key: "committee",    label: "Faculty Committee Review" },
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

/* --- Status badge dictionary --------------------------------- */
const STATUS = {
  draft:            { key: "draft",            label: "Draft",                       cls: "badge-draft" },
  submitted:        { key: "submitted",        label: "Submitted",                   cls: "badge-submitted" },
  deanScreen:       { key: "deanScreen",       label: "Dean Screening",              cls: "badge-faculty" },
  committee:        { key: "committee",        label: "Faculty Committee Review",    cls: "badge-academic" },
  deanSign:         { key: "deanSign",         label: "Dean Sign & Forward",         cls: "badge-dean" },
  iras:             { key: "iras",             label: "RASSC Screening",              cls: "badge-iras" },
  expertReview:     { key: "expertReview",     label: "Under Expert Review",         cls: "badge-expert" },
  presidentApproval:{ key: "presidentApproval",label: "President Approval",          cls: "badge-president" },
  contractPending:  { key: "contractPending",  label: "Contract Pending",            cls: "badge-contract" },
  contractSigned:   { key: "contractSigned",   label: "Contract Signed",             cls: "badge-signed" },
  pay1:             { key: "pay1",             label: "1st Payment Released",        cls: "badge-paid" },
  progressSubmitted:{ key: "progressSubmitted",label: "Progress Report Submitted",   cls: "badge-progress" },
  pay2:             { key: "pay2",             label: "2nd Payment Released",        cls: "badge-paid" },
  finalSubmitted:   { key: "finalSubmitted",   label: "Final Report Submitted",      cls: "badge-final" },
  pay3:             { key: "pay3",             label: "Final Payment Released",      cls: "badge-paid" },
  closed:           { key: "closed",           label: "Closed",                      cls: "badge-check" },
  revision:         { key: "revision",         label: "Revision Required",           cls: "badge-revision" },
  rejected:         { key: "rejected",         label: "Rejected",                    cls: "badge-rejected" },
  paymentPending:   { key: "paymentPending",   label: "Payment Pending",             cls: "badge-pending" },
};

/* --- Required documents --------------------------------------- */
const REQUIRED_DOCS = [
  { id: "doc1", name: "Recommendation_Form.pdf",                     size: "248 KB", uploaded: true, uploadedAt: "Oct 18, 2025", role: "Form 1 · Recommendation by Dept Head" },
  { id: "doc2", name: "Application_Form.pdf",                        size: "512 KB", uploaded: true, uploadedAt: "Oct 18, 2025", role: "Form 2 · Application for Research Grant" },
  { id: "doc3", name: "Research_Proposal.pdf",                       size: "1.4 MB", uploaded: true, uploadedAt: "Oct 18, 2025", role: "Form 3 · Full Research Proposal" },
  { id: "doc4", name: "Research_Creative_Grant_Submission_Form.pdf", size: "320 KB", uploaded: true, uploadedAt: "Oct 18, 2025", role: "Form 4 · Research / Creative Grant Submission" },
];

/* --- Primary application (RG-2025-001) ------------------------ */
const PRIMARY_APP = {
  id: "RG-2025-001",
  title: "AI-Based Research Grant Tracking System for Assumption University",
  abstract: "This study proposes a web-based grant lifecycle platform that consolidates the fourteen-stage AU research grant workflow into a single transparent dashboard. The system applies machine-learning techniques to flag missing documents, predict review duration, and surface anomalous budget items at submission time. A pilot will be conducted with three faculties over two academic semesters.",
  objectives: [
    "Reduce average submission-to-disbursement cycle time by 35%.",
    "Provide unified visibility across Faculty Office, RASSC, and Finance.",
    "Automate document completeness checks at submission.",
    "Enable expert-review scoring with explainable recommendations.",
  ],
  methodology: "Design-science research, comprising a needs assessment with twenty-four faculty members, an iterative prototype across four releases, and a controlled evaluation against the current paper-driven process. Quantitative metrics will be supported by semi-structured interviews with researchers, committee members, and finance staff.",
  outcomes: [
    "A production-ready research grant management web portal.",
    "Two peer-reviewed conference papers in HCI / EdTech venues.",
    "An open dataset of anonymised workflow durations.",
    "Training materials for faculty offices and committee chairs.",
  ],
  researcher: {
    name: "Dr. Phyo Min Tun",
    email: "phyomintun@au.edu",
    phone: "+66 2 300 4543 ext. 3621",
    title: "Assistant Professor",
  },
  faculty: "Vincent Mary School of Engineering, Science and Technology",
  department: "Information Technology",
  budgetTotal: 100000,
  budgetCurrency: "THB",
  budgetBreakdown: [
    { item: "Remuneration (research assistant, 6 months)", amount: 30000 },
    { item: "Research equipment", amount: 40000 },
    { item: "Travel for off-campus data collection", amount: 18000 },
    { item: "Miscellaneous (postage, photocopying, binding)", amount: 12000 },
  ],
  duration: "12 months (Nov 2025 – Oct 2026)",
  submittedAt: "Oct 18, 2025",
  currentStage: "expert",
  status: STATUS.expertReview,
  experts: [
    { name: "Assoc. Prof. Dr. Suthep Lertsiri",   type: "External", affiliation: "Chulalongkorn University", deadline: "Nov 25, 2025", status: "Submitted",   score: 86, verdict: "Favorable" },
    { name: "Asst. Prof. Dr. Marisa Anuwong",     type: "External", affiliation: "Mahidol University",       deadline: "Nov 27, 2025", status: "Submitted",   score: 81, verdict: "Favorable" },
    { name: "Dr. Kittipan Chaiprasart",           type: "Internal", affiliation: "Assumption University",    deadline: "Nov 30, 2025", status: "In Progress", score: null, verdict: null },
  ],
  timeline: {
    submission:  { done: true,  date: "Oct 18, 2025", who: "Dr. Phyo Min Tun",                        note: "Initial submission with all four required forms." },
    deanScreen:  { done: true,  date: "Oct 20, 2025", who: "Dean, VMS-EST",                            note: "Approved at first screening. Forwarded to Faculty Committee." },
    committee:   { done: true,  date: "Oct 24, 2025", who: "Assoc. Prof. Dr. Watcharee (Chair)",       note: "Strong methodology. Recommended back to Dean for forwarding." },
    deanSign:    { done: true,  date: "Oct 28, 2025", who: "Dean, VMS-EST",                            note: "Signed and forwarded to RASSC." },
    iras:        { done: true,  date: "Oct 30, 2025", who: "RASSC",                              note: "Logged. Three reviewers assigned." },
    expert:      { done: false, current: true, date: "In review",  who: "3 experts assigned, 2 completed" },
    president:   { done: false, date: "Pending" },
    contract:    { done: false, date: "Pending" },
    pay1:        { done: false, date: "Pending" },
    progress:    { done: false, date: "Pending" },
    pay2:        { done: false, date: "Pending" },
    final:       { done: false, date: "Pending" },
    pay3:        { done: false, date: "Pending" },
    closed:      { done: false, date: "Pending" },
  },
};

/* --- Application pool for all role tables -------------------- */
const APPLICATIONS = [
  PRIMARY_APP,
  {
    id: "RG-2025-002",
    title: "Adaptive Learning Pathways for Foundation Mathematics Using Bayesian Tutoring",
    researcher: { name: "Asst. Prof. Dr. Naphat Wongsakulchai" },
    faculty: "Albert Laurence School of Communication Arts",
    department: "Educational Technology",
    submittedAt: "Oct 15, 2025",
    budgetTotal: 95000,
    status: STATUS.committee,
    currentStage: "committee",
  },
  {
    id: "RG-2025-003",
    title: "Solar-Driven Aquaponics: Yield and Energy Modelling for Tropical Climates",
    researcher: { name: "Dr. Rattana Boonchareon" },
    faculty: "Vincent Mary School of Engineering, Science and Technology",
    department: "Biotechnology",
    submittedAt: "Oct 11, 2025",
    budgetTotal: 98000,
    status: STATUS.deanSign,
    currentStage: "deanSign",
  },
  {
    id: "RG-2025-004",
    title: "Privacy-Preserving Recommender Systems for Thai E-Commerce Platforms",
    researcher: { name: "Asst. Prof. Dr. Chayanon Inthawong" },
    faculty: "Martin de Tours School of Management and Economics",
    department: "Business Information Systems",
    submittedAt: "Oct 09, 2025",
    budgetTotal: 95000,
    status: STATUS.presidentApproval,
    currentStage: "president",
  },
  {
    id: "RG-2025-005",
    title: "Cultural Heritage Preservation via Photogrammetry and Volumetric Capture",
    researcher: { name: "Dr. Nisachon Charoenwong" },
    faculty: "Albert Laurence School of Communication Arts",
    department: "Visual Communication Design",
    submittedAt: "Oct 03, 2025",
    budgetTotal: 75000,
    status: STATUS.contractSigned,
    currentStage: "pay1",
  },
  {
    id: "RG-2025-006",
    title: "Wearable EEG Monitoring for Detecting Early-Onset Workplace Fatigue",
    researcher: { name: "Asst. Prof. Dr. Karunee Sritrakul" },
    faculty: "Bernadette de Lourdes School of Nursing Science",
    department: "Adult Nursing",
    submittedAt: "Sep 28, 2025",
    budgetTotal: 90000,
    status: STATUS.progressSubmitted,
    currentStage: "pay2",
  },
  {
    id: "RG-2025-007",
    title: "Resilience of Coastal Mangrove Ecosystems to Salinity Intrusion",
    researcher: { name: "Dr. Apichat Phongphan" },
    faculty: "Vincent Mary School of Engineering, Science and Technology",
    department: "Environmental Science",
    submittedAt: "Sep 14, 2025",
    budgetTotal: 100000,
    status: STATUS.finalSubmitted,
    currentStage: "pay3",
  },
  {
    id: "RG-2025-008",
    title: "Pricing Asymmetry in Thai Specialty Coffee Supply Chains",
    researcher: { name: "Asst. Prof. Dr. Pornchai Limanon" },
    faculty: "Martin de Tours School of Management and Economics",
    department: "Economics",
    submittedAt: "Sep 02, 2025",
    budgetTotal: 60000,
    status: STATUS.revision,
    currentStage: "committee",
  },
  {
    id: "RG-2025-009",
    title: "Liturgical Music Archive Digitisation for the Christian Communications Programme",
    researcher: { name: "Dr. Jiraporn Ratanachai" },
    faculty: "Theodore Maria School of Arts",
    department: "Music Performance",
    submittedAt: "Aug 22, 2025",
    budgetTotal: 88000,
    status: STATUS.rejected,
    currentStage: "committee",
  },
  {
    id: "RG-2025-010",
    title: "Generative Architectural Sketching for Sustainable Tropical Housing",
    researcher: { name: "Dr. Pichet Methabhibhat" },
    faculty: "Montfort del Rosario School of Architecture and Design",
    department: "Architecture",
    submittedAt: "Oct 21, 2025",
    budgetTotal: 96000,
    status: STATUS.deanScreen,
    currentStage: "deanScreen",
  },
  {
    id: "RG-2025-011",
    title: "Edge Computing for Smart Campus Energy Management",
    researcher: { name: "Asst. Prof. Dr. Wichai Tantipidok" },
    faculty: "Vincent Mary School of Engineering, Science and Technology",
    department: "Computer Engineering",
    submittedAt: "Oct 22, 2025",
    budgetTotal: 92000,
    status: STATUS.submitted,
    currentStage: "deanScreen",
  },
  {
    id: "RG-2025-012",
    title: "Lightweight On-Device Speech Models for Thai Lecturers",
    researcher: { name: "Dr. Phyo Min Tun" },
    faculty: "Vincent Mary School of Engineering, Science and Technology",
    department: "Information Technology",
    submittedAt: "Oct 22, 2025",
    budgetTotal: 88000,
    status: STATUS.deanScreen,
    currentStage: "deanScreen",
  },
  {
    id: "RG-2025-013",
    title: "Microcredentials and Lifelong Learning Adoption in Thai SMEs",
    researcher: { name: "Asst. Prof. Dr. Anchalee Tipsuwan" },
    faculty: "Martin de Tours School of Management and Economics",
    department: "Management",
    submittedAt: "Oct 17, 2025",
    budgetTotal: 92000,
    status: STATUS.iras,
    currentStage: "iras",
  },
  {
    id: "RG-2025-014",
    title: "Pedagogical Agents for Bilingual Foundation Programmes",
    researcher: { name: "Dr. Watcharin Krairat" },
    faculty: "Albert Laurence School of Communication Arts",
    department: "Educational Technology",
    submittedAt: "Oct 12, 2025",
    budgetTotal: 76000,
    status: STATUS.expertReview,
    currentStage: "expert",
  },
];

/* --- Notifications ------------------------------------------- */
const NOTIFS = [
  { id: 1, unread: true,  icon: "Bell",      who: "RASSC",    text: "Your application <b>RG-2025-001</b> has been assigned to three expert reviewers.", when: "2 hours ago" },
  { id: 2, unread: true,  icon: "FileCheck", who: "Faculty Committee", text: "Comments added to <b>RG-2025-001</b> by Assoc. Prof. Dr. Watcharee.", when: "Yesterday, 4:12 PM" },
  { id: 3, unread: true,  icon: "Coins",     who: "Finance / OFM",  text: "First disbursement of <b>30,000 THB</b> is scheduled after contract signing.", when: "2 days ago" },
  { id: 4, unread: false, icon: "Send",      who: "Dean's Office",  text: "Application <b>RG-2025-001</b> was forwarded to RASSC on Oct 28.", when: "Oct 28, 2025" },
  { id: 5, unread: false, icon: "FileText",  who: "Faculty Office", text: "Document check completed for <b>RG-2025-001</b>.", when: "Oct 20, 2025" },
];

/* --- Payments for primary app -------------------------------- */
const PAYMENTS = [
  { n: 1, pct: 30, amount: 30000, label: "First Disbursement",  status: "Pending Contract",         badge: "badge-pending", date: "Scheduled after contract signing",       requiredDoc: "Signed Contract",            receipt: null },
  { n: 2, pct: 40, amount: 40000, label: "Second Disbursement", status: "Awaiting Progress Report", badge: "badge-draft",   date: "Scheduled after progress report approval", requiredDoc: "Approved Progress Report", receipt: null },
  { n: 3, pct: 30, amount: 30000, label: "Final Disbursement",  status: "Awaiting Final Report",    badge: "badge-draft",   date: "Scheduled after final report approval",    requiredDoc: "Approved Final Report",   receipt: null },
];

/* --- Activity feed ------------------------------------------- */
const ACTIVITY = [
  { t: "2h ago",       text: "Expert review submitted by <b>Assoc. Prof. Dr. Suthep Lertsiri</b>",          kind: "expert" },
  { t: "Yesterday",    text: "Dean forwarded <b>RG-2025-001</b> to RASSC",                                   kind: "approval" },
  { t: "3 days ago",   text: "Faculty Committee added comments to <b>RG-2025-001</b>",                      kind: "comment" },
  { t: "5 days ago",   text: "Dean screening completed for <b>RG-2025-001</b>",                             kind: "check" },
  { t: "Oct 18, 2025", text: "Initial submission of <b>RG-2025-001</b>",                                    kind: "submit" },
];

/* --- 8 roles in the system ------------------------------------ */
const ROLES = [
  { key: "researcher", name: "Researcher",            full: "Dr. Phyo Min Tun",                 subtitle: "Asst. Professor · IT",                initials: "PT", iconName: "GraduationCap" },
  { key: "dean",       name: "Dean",                  full: "Assoc. Prof. Dr. Surasak Chamnongpol", subtitle: "Dean · VMS-EST",                  initials: "SC", iconName: "Building2" },
  { key: "committee",  name: "Faculty Committee",     full: "Assoc. Prof. Dr. Watcharee S.",    subtitle: "Committee Chair · VMS-EST",           initials: "WS", iconName: "Users" },
  { key: "iras",       name: "RASSC",             full: "Prof. Dr. Sirilak Khempila",       subtitle: "Director · RASSC",              initials: "SK", iconName: "Landmark" },
  { key: "expert",     name: "Expert Reviewer",       full: "Assoc. Prof. Dr. Suthep Lertsiri", subtitle: "External · Chulalongkorn",            initials: "SL", iconName: "FileSearch" },
  { key: "president",  name: "President",             full: "Rev. Bro. Dr. Srichai Fonseka",  subtitle: "President · Assumption University",   initials: "SF", iconName: "Award" },
  { key: "ofm",        name: "OFM / Finance",         full: "K. Wanida Charoenphon",            subtitle: "Director · OFM",                      initials: "WC", iconName: "Coins" },
  { key: "admin",      name: "Administrator",         full: "K. Tanapong Wisetphan",            subtitle: "System Administrator",                initials: "TW", iconName: "Settings" },
];

/* --- Per-role sidebar navigation ----------------------------- */
const NAV_RESEARCHER = [
  { section: "WORKSPACE" },
  { key: "r-dashboard",   label: "Dashboard",          icon: "LayoutDashboard" },
  { key: "r-submit",      label: "Submit Application", icon: "FilePlus" },
  { key: "r-applications", label: "My Applications",   icon: "Folder", badge: 4 },
  { section: "REPORTING" },
  { key: "r-progress",    label: "Progress Report",    icon: "FileText" },
  { key: "r-final",       label: "Final Report",       icon: "FileCheck" },
  { section: "FINANCE" },
  { key: "r-payments",    label: "Payment Status",     icon: "Coins" },
];

const NAV_DEAN = [
  { section: "WORKSPACE" },
  { key: "d-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { section: "QUEUES" },
  { key: "d-screen",      label: "First Screening Queue",      icon: "ClipboardCheck", badge: 3 },
  { key: "d-sign",        label: "Sign & Forward Queue",       icon: "FileSignature",  badge: 2 },
  { section: "TRACKING" },
  { key: "d-history",     label: "Decision History",           icon: "Clock" },
];

const NAV_COMMITTEE = [
  { section: "WORKSPACE" },
  { key: "c-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { section: "REVIEW" },
  { key: "c-queue",       label: "Review Queue",               icon: "Users", badge: 4 },
  { key: "c-review",      label: "Active Review",              icon: "FileSearch" },
  { section: "TRACKING" },
  { key: "c-history",     label: "Past Reviews",               icon: "Clock" },
];

const NAV_RASSC = [
  { section: "WORKSPACE" },
  { key: "i-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { key: "i-received",    label: "Received from Dean",         icon: "Inbox", badge: 3 },
  { section: "REVIEW" },
  { key: "i-screen",      label: "Office Screening",           icon: "ClipboardCheck" },
  { key: "i-assign",      label: "Assign Experts",             icon: "UserPlus" },
  { section: "TRACKING" },
  { key: "i-reviewers",   label: "Reviewer Pool",              icon: "Users" },
];

const NAV_EXPERT = [
  { section: "WORKSPACE" },
  { key: "e-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { key: "e-assignments", label: "My Assignments",             icon: "Folder", badge: 3 },
  { section: "REVIEW" },
  { key: "e-evaluate",    label: "Evaluation Form",            icon: "FileSearch" },
  { key: "e-history",     label: "Submitted Reviews",          icon: "Clock" },
];

const NAV_PRESIDENT = [
  { section: "WORKSPACE" },
  { key: "p-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { key: "p-queue",       label: "Final Approval Queue",       icon: "Award", badge: 2 },
  { section: "DECISION" },
  { key: "p-approve",     label: "Active Approval",            icon: "ShieldCheck" },
  { key: "p-contracts",   label: "Contract Tracking",          icon: "FileSignature" },
];

const NAV_OFM = [
  { section: "WORKSPACE" },
  { key: "o-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { section: "DISBURSEMENT" },
  { key: "o-payments",    label: "Payment Queue",              icon: "Coins", badge: 5 },
  { key: "o-detail",      label: "Grant Detail",               icon: "FileText" },
  { section: "TRACKING" },
  { key: "o-history",     label: "Payment History",            icon: "Clock" },
];

const NAV_ADMIN = [
  { section: "ADMIN" },
  { key: "a-dashboard",   label: "Dashboard",                  icon: "LayoutDashboard" },
  { key: "a-users",       label: "User Management",            icon: "Users" },
  { key: "a-journals",    label: "Journal Tier Reference",     icon: "FileText" },
  { section: "SYSTEM" },
  { key: "a-audit",       label: "Audit Log",                  icon: "Clock" },
  { key: "a-settings",    label: "System Settings",            icon: "Settings" },
];

/* --- System users (for Admin dashboard) ---------------------- */
const SYSTEM_USERS = [
  { id: "U001", name: "Dr. Phyo Min Tun",                       email: "phyomintun@au.edu",      role: "Researcher",         dept: "Information Technology",     status: "Active",   lastLogin: "Today, 09:42" },
  { id: "U002", name: "Assoc. Prof. Dr. Surasak Chamnongpol",   email: "surasak.c@au.edu",       role: "Dean",               dept: "VMS-EST",                    status: "Active",   lastLogin: "Today, 08:11" },
  { id: "U003", name: "Assoc. Prof. Dr. Watcharee Suwannarat",  email: "watcharee.s@au.edu",     role: "Faculty Committee",  dept: "VMS-EST",                    status: "Active",   lastLogin: "Yesterday" },
  { id: "U004", name: "Prof. Dr. Sirilak Khempila",             email: "sirilak.k@au.edu",       role: "RASSC",          dept: "RASSC",                status: "Active",   lastLogin: "Today, 10:02" },
  { id: "U005", name: "Assoc. Prof. Dr. Suthep Lertsiri",       email: "suthep.l@chula.ac.th",   role: "Expert Reviewer",    dept: "Chulalongkorn University",   status: "Active",   lastLogin: "2 days ago" },
  { id: "U006", name: "Asst. Prof. Dr. Marisa Anuwong",         email: "marisa.a@mahidol.ac.th", role: "Expert Reviewer",    dept: "Mahidol University",         status: "Active",   lastLogin: "Yesterday" },
  { id: "U007", name: "Dr. Kittipan Chaiprasart",               email: "kittipan.c@au.edu",      role: "Expert Reviewer",    dept: "VMS-EST",                    status: "Active",   lastLogin: "3 days ago" },
  { id: "U008", name: "Rev. Bro. Dr. Srichai Fonseka",        email: "president@au.edu",       role: "President",          dept: "Office of the President",    status: "Active",   lastLogin: "Today, 07:30" },
  { id: "U009", name: "K. Wanida Charoenphon",                  email: "wanida.c@au.edu",        role: "OFM / Finance",      dept: "Office of Financial Mgmt.",  status: "Active",   lastLogin: "Today, 09:15" },
  { id: "U010", name: "K. Tanapong Wisetphan",                  email: "admin@au.edu",           role: "Administrator",      dept: "IT Services",                status: "Active",   lastLogin: "Today, 06:55" },
  { id: "U011", name: "Asst. Prof. Dr. Naphat Wongsakulchai",   email: "naphat.w@au.edu",        role: "Researcher",         dept: "Educational Technology",     status: "Active",   lastLogin: "Yesterday" },
  { id: "U012", name: "Dr. Rattana Boonchareon",                email: "rattana.b@au.edu",       role: "Researcher",         dept: "Biotechnology",              status: "Active",   lastLogin: "2 days ago" },
  { id: "U013", name: "Asst. Prof. Dr. Chayanon Inthawong",     email: "chayanon.i@au.edu",      role: "Researcher",         dept: "Business Information Sys.",  status: "Inactive", lastLogin: "Sep 30, 2025" },
  { id: "U014", name: "Dr. Nisachon Charoenwong",               email: "nisachon.c@au.edu",      role: "Researcher",         dept: "Visual Communication",       status: "Active",   lastLogin: "Today, 10:48" },
];

/* --- Journal tier reference (Admin) -------------------------- */
const JOURNAL_TIERS = [
  { code: "SJR-Q1", name: "Scopus · SJR Quartile 1",                    incentive: 80000,         count: 142 },
  { code: "SJR-Q2", name: "Scopus · SJR Quartile 2",                    incentive: 60000,         count: 188 },
  { code: "SJR-Q3", name: "Scopus · SJR Quartile 3",                    incentive: 50000,         count: 191 },
  { code: "SJR-Q4", name: "Scopus · SJR Quartile 4",                    incentive: 40000,         count: 88  },
  { code: "WoS",    name: "Web of Science · SCIE / SSCI / AHCI",        incentive: 80000,         count: 96  },
  { code: "TCI1",   name: "Thai Citation Index · Tier 1",              incentive: "Actual fees", count: 64  },
  { code: "TCI2",   name: "Thai Citation Index · Tier 2",              incentive: "Actual fees", count: 32  },
  { code: "CREATE", name: "Creative work · ASEAN / international",      incentive: 25000,         count: 18  },
  { code: "PATENT", name: "Patent / new plant or animal registration", incentive: 10000,         count: 7   },
  { code: "PETTY",  name: "Petty patent",                               incentive: 3000,          count: 11  },
];

/* --- Audit log (Admin) --------------------------------------- */
const AUDIT_LOG = [
  { t: "Today, 10:48", who: "Dr. Nisachon Charoenwong",     act: "Logged in",                                ip: "192.168.4.21" },
  { t: "Today, 10:42", who: "Prof. Dr. Sirilak Khempila",   act: "Assigned experts to RG-2025-001",          ip: "10.0.12.4"  },
  { t: "Today, 09:42", who: "Dr. Phyo Min Tun",             act: "Viewed Application RG-2025-001 details",   ip: "192.168.4.18" },
  { t: "Today, 09:15", who: "K. Wanida Charoenphon",        act: "Marked RG-2025-005 first payment as paid", ip: "10.0.7.9"  },
  { t: "Today, 08:11", who: "Dr. Surasak Chamnongpol",      act: "Approved RG-2025-010 at first screening",  ip: "10.0.3.2"  },
  { t: "Today, 07:30", who: "Rev. Bro. Dr. Srichai F.",      act: "Approved RG-2025-004 final approval",      ip: "10.0.1.1"  },
  { t: "Today, 06:55", who: "K. Tanapong Wisetphan",        act: "Updated journal tier reference table",      ip: "10.0.0.4"  },
  { t: "Yesterday",    who: "Assoc. Prof. Dr. Watcharee",   act: "Submitted committee review for RG-2025-002", ip: "10.0.9.3" },
];

/* --- Helper queues for each role ----------------------------- */
const Q_DEAN_SCREEN  = APPLICATIONS.filter(a => ["submitted", "deanScreen"].includes(a.status.key));
const Q_DEAN_SIGN    = APPLICATIONS.filter(a => a.status.key === "deanSign");
const Q_COMMITTEE    = APPLICATIONS.filter(a => a.status.key === "committee");
const Q_RASSC         = APPLICATIONS.filter(a => ["iras", "expertReview"].includes(a.status.key));
const Q_EXPERT       = APPLICATIONS.filter(a => a.status.key === "expertReview");
const Q_PRESIDENT    = APPLICATIONS.filter(a => a.status.key === "presidentApproval");
const Q_OFM          = APPLICATIONS.filter(a => ["contractSigned", "pay1", "progressSubmitted", "pay2", "finalSubmitted", "pay3"].includes(a.status.key));

/* --- Expose all ---------------------------------------------- */
window.AU = {
  ALL_STAGES, STATUS, REQUIRED_DOCS,
  PRIMARY_APP, APPLICATIONS,
  NOTIFS, PAYMENTS, ACTIVITY,
  ROLES,
  NAV_RESEARCHER, NAV_DEAN, NAV_COMMITTEE, NAV_RASSC,
  NAV_EXPERT, NAV_PRESIDENT, NAV_OFM, NAV_ADMIN,
  SYSTEM_USERS, JOURNAL_TIERS, AUDIT_LOG,
  Q_DEAN_SCREEN, Q_DEAN_SIGN, Q_COMMITTEE, Q_RASSC, Q_EXPERT, Q_PRESIDENT, Q_OFM,
  // Legacy aliases used by existing pages
  MOCK_DOCS: REQUIRED_DOCS,
  FACULTY_QUEUE: APPLICATIONS.filter(a => ["submitted", "deanScreen", "committee", "deanSign", "revision"].includes(a.status.key)),
  RASSC_QUEUE: APPLICATIONS.filter(a => ["iras", "expertReview", "presidentApproval", "contractSigned", "pay1", "progressSubmitted", "pay2", "finalSubmitted", "pay3"].includes(a.status.key)),
};
