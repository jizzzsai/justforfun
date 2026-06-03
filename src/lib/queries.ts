import { createClient } from "@/lib/supabase/server";
import type { AppStatus } from "@/lib/workflow";
import type {
  Application,
  ApplicationEvent,
  Approval,
  Contract,
  ExpertAssignment,
  JournalTier,
  Payment,
  Profile,
  Report,
  Review,
  Screening,
  AuditLog,
} from "@/lib/types";
import type { Role } from "@/lib/roles";

const APP_SELECT = "*, researcher:profiles(*), journal_tier:journal_tiers(*)";

export async function listApplications(opts: {
  statuses?: AppStatus[];
  researcherId?: string;
  limit?: number;
} = {}): Promise<Application[]> {
  const supabase = await createClient();
  let q = supabase
    .from("applications")
    .select(APP_SELECT)
    .order("updated_at", { ascending: false });
  if (opts.statuses?.length) q = q.in("status", opts.statuses);
  if (opts.researcherId) q = q.eq("researcher_id", opts.researcherId);
  if (opts.limit) q = q.limit(opts.limit);
  const { data } = await q;
  return (data ?? []) as Application[];
}

export async function getApplication(id: string): Promise<Application | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select(APP_SELECT)
    .eq("id", id)
    .single();
  return (data as Application) ?? null;
}

export interface AppBundle {
  application: Application;
  events: ApplicationEvent[];
  reviews: Review[];
  screenings: Screening[];
  assignments: ExpertAssignment[];
  approval: Approval | null;
  contract: Contract | null;
  payments: Payment[];
  reports: Report[];
}

export async function getApplicationBundle(id: string): Promise<AppBundle | null> {
  const supabase = await createClient();
  const application = await getApplication(id);
  if (!application) return null;

  const [events, reviews, screenings, assignments, approvals, contracts, payments, reports] =
    await Promise.all([
      supabase.from("application_events").select("*, actor:profiles(*)").eq("application_id", id).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*, reviewer:profiles(*)").eq("application_id", id).order("submitted_at", { ascending: false }),
      supabase.from("screenings").select("*").eq("application_id", id).order("created_at", { ascending: false }),
      supabase.from("expert_assignments").select("*, expert:profiles!expert_id(*)").eq("application_id", id),
      supabase.from("approvals").select("*").eq("application_id", id).order("created_at", { ascending: false }).limit(1),
      supabase.from("contracts").select("*").eq("application_id", id).maybeSingle(),
      supabase.from("payments").select("*").eq("application_id", id).order("instalment"),
      supabase.from("reports").select("*").eq("application_id", id).order("submitted_at", { ascending: false }),
    ]);

  return {
    application,
    events: (events.data ?? []) as ApplicationEvent[],
    reviews: (reviews.data ?? []) as Review[],
    screenings: (screenings.data ?? []) as Screening[],
    assignments: (assignments.data ?? []) as ExpertAssignment[],
    approval: ((approvals.data ?? [])[0] as Approval) ?? null,
    contract: (contracts.data as Contract) ?? null,
    payments: (payments.data ?? []) as Payment[],
    reports: (reports.data ?? []) as Report[],
  };
}

export async function statusCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from("applications").select("status");
  const counts: Record<string, number> = {};
  for (const r of (data ?? []) as { status: string }[]) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  }
  return counts;
}

export async function listProfilesByRole(role: Role): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", role)
    .order("full_name");
  return (data ?? []) as Profile[];
}

export async function listAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("role")
    .order("full_name");
  return (data ?? []) as Profile[];
}

export async function listAssignmentsForExpert(
  expertId: string
): Promise<ExpertAssignment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expert_assignments")
    .select(`*, application:applications(${APP_SELECT})`)
    .eq("expert_id", expertId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ExpertAssignment[];
}

export async function listReviewsByReviewer(reviewerId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(`*, application:applications(${APP_SELECT})`)
    .eq("reviewer_id", reviewerId)
    .order("submitted_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function listPayments(opts: { statuses?: string[] } = {}): Promise<Payment[]> {
  const supabase = await createClient();
  let q = supabase
    .from("payments")
    .select(`*, application:applications(${APP_SELECT})`)
    .order("due_date", { ascending: true });
  if (opts.statuses?.length) q = q.in("status", opts.statuses);
  const { data } = await q;
  return (data ?? []) as Payment[];
}

export async function listContracts(): Promise<Contract[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contracts")
    .select(`*, application:applications(${APP_SELECT})`)
    .order("issued_at", { ascending: false });
  return (data ?? []) as Contract[];
}

export async function listReports(opts: { researcherId?: string; kind?: string } = {}): Promise<Report[]> {
  const supabase = await createClient();
  let q = supabase
    .from("reports")
    .select(`*, application:applications(${APP_SELECT})`)
    .order("submitted_at", { ascending: false });
  if (opts.kind) q = q.eq("kind", opts.kind);
  const { data } = await q;
  let rows = (data ?? []) as Report[];
  if (opts.researcherId) {
    rows = rows.filter((r) => r.application?.researcher_id === opts.researcherId);
  }
  return rows;
}

export async function getJournalTiers(): Promise<JournalTier[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("journal_tiers")
    .select("*")
    .order("sort_order");
  return (data ?? []) as JournalTier[];
}

export async function listAuditLog(limit = 100): Promise<AuditLog[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("*, actor:profiles(*)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AuditLog[];
}
