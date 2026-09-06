import type { Role } from "./roles";

export type AppStatus =
  | "draft"
  | "submitted"
  | "committee_review"
  | "dean_sign"
  | "iras_review"
  | "expert_review"
  | "president_review"
  | "approved"
  | "active"
  | "completed"
  | "rejected"
  | "returned";

export type Tone = "neutral" | "info" | "ok" | "warn" | "danger" | "gold";

export interface StatusMeta {
  label: string;
  tone: Tone;

  owner: Role | null;

  stage: string;
}

export const STATUS: Record<AppStatus, StatusMeta> = {
  draft: { label: "Draft", tone: "neutral", owner: "researcher", stage: "Not yet submitted" },
  submitted: { label: "Submitted", tone: "info", owner: "dean", stage: "Dean first screening" },
  committee_review: { label: "Committee Review", tone: "info", owner: "committee", stage: "Faculty academic committee" },
  dean_sign: { label: "Sign & Forward", tone: "info", owner: "dean", stage: "Dean sign & forward" },
  iras_review: { label: "IRAS Screening", tone: "info", owner: "iras", stage: "Research office screening" },
  expert_review: { label: "Expert Review", tone: "info", owner: "expert", stage: "Expert evaluation" },
  president_review: { label: "President Review", tone: "info", owner: "president", stage: "Final approval" },
  approved: { label: "Approved", tone: "ok", owner: "president", stage: "Approved — contract pending" },
  active: { label: "Active Grant", tone: "ok", owner: "ofm", stage: "Funded & running" },
  completed: { label: "Completed", tone: "gold", owner: null, stage: "Closed out" },
  rejected: { label: "Rejected", tone: "danger", owner: null, stage: "Not funded" },
  returned: { label: "Returned", tone: "warn", owner: "researcher", stage: "Returned for revision" },
};


export const PIPELINE: AppStatus[] = [
  "submitted",
  "committee_review",
  "dean_sign",
  "iras_review",
  "expert_review",
  "president_review",
  "approved",
  "active",
  "completed",
];

export function pipelineIndex(status: AppStatus): number {
  return PIPELINE.indexOf(status);
}

export function statusLabel(status: AppStatus): string {
  return STATUS[status]?.label ?? status;
}


export const QUEUE_STATUS: Partial<Record<Role, AppStatus[]>> = {
  dean: ["submitted", "dean_sign"],
  committee: ["committee_review"],
  iras: ["iras_review"],
  expert: ["expert_review"],
  president: ["president_review"],
  ofm: ["approved", "active"],
};


export const PAYMENT_PLAN = [
  { n: 1, pct: 30, trigger: "On contract signing" },
  { n: 2, pct: 40, trigger: "On approved progress report" },
  { n: 3, pct: 30, trigger: "On approved final report" },
] as const;
