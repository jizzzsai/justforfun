import type { Role } from "./roles";
import type { AppStatus } from "./workflow";

export type { Role, AppStatus };

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  title: string | null;
  faculty: string | null;
  department: string | null;
  phone: string | null;
  expertise: string | null;
  is_active: boolean;
  created_at: string;
}

export interface JournalTier {
  id: string;
  code: string;
  name: string;
  indexing: string | null;
  description: string | null;
  max_amount: number;
  sort_order: number;
}

export interface Application {
  id: string;
  code: string;
  researcher_id: string;
  title: string;
  abstract: string | null;
  faculty: string | null;
  department: string | null;
  field: string | null;
  keywords: string | null;
  journal_tier_id: string | null;
  target_journal: string | null;
  requested_amount: number;
  approved_amount: number | null;
  duration_months: number;
  status: AppStatus;
  submitted_at: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
  researcher?: Profile | null;
  journal_tier?: JournalTier | null;
}

export interface ApplicationEvent {
  id: string;
  application_id: string;
  actor_id: string | null;
  actor_role: Role | null;
  action: string;
  from_status: AppStatus | null;
  to_status: AppStatus | null;
  note: string | null;
  created_at: string;
  actor?: Profile | null;
}

export type ScreeningKind = "dean_first" | "dean_sign" | "iras_office";
export type ScreeningDecision = "pass" | "fail" | "return";

export interface Screening {
  id: string;
  application_id: string;
  kind: ScreeningKind;
  screener_id: string | null;
  decision: ScreeningDecision;
  notes: string | null;
  created_at: string;
}

export type ReviewKind = "committee" | "expert";
export type Recommendation = "favorable" | "unfavorable" | "revise";

export interface Review {
  id: string;
  application_id: string;
  kind: ReviewKind;
  reviewer_id: string | null;
  recommendation: Recommendation | null;
  score: number | null;
  strengths: string | null;
  weaknesses: string | null;
  comments: string | null;
  submitted_at: string;
  reviewer?: Profile | null;
  application?: Application | null;
}

export type AssignmentStatus = "pending" | "accepted" | "declined" | "completed";

export interface ExpertAssignment {
  id: string;
  application_id: string;
  expert_id: string;
  assigned_by: string | null;
  status: AssignmentStatus;
  due_date: string | null;
  created_at: string;
  application?: Application | null;
  expert?: Profile | null;
}

export interface Approval {
  id: string;
  application_id: string;
  president_id: string | null;
  approved: boolean;
  approved_amount: number | null;
  conditions: string | null;
  created_at: string;
}

export type ContractStatus = "issued" | "active" | "completed" | "terminated";

export interface Contract {
  id: string;
  application_id: string;
  contract_no: string;
  amount: number;
  start_date: string | null;
  end_date: string | null;
  status: ContractStatus;
  issued_by: string | null;
  issued_at: string;
  application?: Application | null;
}

export type PaymentStatus = "pending" | "scheduled" | "paid";

export interface Payment {
  id: string;
  application_id: string;
  contract_id: string | null;
  instalment: number;
  pct: number;
  amount: number;
  trigger: string | null;
  status: PaymentStatus;
  due_date: string | null;
  paid_at: string | null;
  processed_by: string | null;
  created_at: string;
  application?: Application | null;
}

export type ReportKind = "progress" | "final";
export type ReportStatus = "submitted" | "accepted" | "revise";

export interface Report {
  id: string;
  application_id: string;
  kind: ReportKind;
  summary: string | null;
  storage_path: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  application?: Application | null;
}

export interface AuditLog {
  id: number;
  actor_id: string | null;
  actor_role: Role | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  detail: Record<string, unknown> | null;
  created_at: string;
  actor?: Profile | null;
}

export interface AppSetting {
  key: string;
  value: unknown;
  label: string | null;
  updated_at: string;
}
