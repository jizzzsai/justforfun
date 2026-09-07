"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import type { AppStatus } from "@/lib/workflow";
import type { Profile } from "@/lib/types";

async function ctx() {
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return { supabase, profile };
}

type DB = Awaited<ReturnType<typeof createClient>>;

async function logEvent(
  supabase: DB,
  appId: string,
  actor: Profile,
  action: string,
  to?: AppStatus,
  note?: string | null
) {
  await supabase.from("application_events").insert({
    application_id: appId,
    actor_id: actor.id,
    actor_role: actor.role,
    action,
    to_status: to ?? null,
    note: note ?? null,
  });
}

function num(v: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}


export async function submitApplication(formData: FormData) {
  const { supabase, profile } = await ctx();
  const intent = String(formData.get("intent") ?? "submit");
  const isSubmit = intent === "submit";

  const { count } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true });
  const code = `AU-2026-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const { data, error } = await supabase
    .from("applications")
    .insert({
      code,
      researcher_id: profile.id,
      title: String(formData.get("title") ?? "").trim(),
      abstract: String(formData.get("abstract") ?? ""),
      faculty: profile.faculty,
      department: profile.department,
      field: String(formData.get("field") ?? ""),
      keywords: String(formData.get("keywords") ?? ""),
      journal_tier_id: (formData.get("journal_tier_id") as string) || null,
      target_journal: String(formData.get("target_journal") ?? ""),
      requested_amount: num(formData.get("requested_amount")),
      duration_months: num(formData.get("duration_months"), 12),
      status: isSubmit ? "submitted" : "draft",
      submitted_at: isSubmit ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not save application");
  await logEvent(
    supabase,
    data.id,
    profile,
    isSubmit ? "Submitted application" : "Saved draft",
    isSubmit ? "submitted" : "draft"
  );
  revalidatePath("/researcher/applications");
  redirect(`/researcher/applications/${data.id}`);
}

export async function submitReport(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const kind = String(formData.get("kind") ?? "progress") as "progress" | "final";
  await supabase.from("reports").insert({
    application_id: appId,
    kind,
    summary: String(formData.get("summary") ?? ""),
    status: "submitted",
  });
  await logEvent(supabase, appId, profile, `Submitted ${kind} report`);
  revalidatePath(kind === "final" ? "/researcher/final" : "/researcher/progress");
  redirect(kind === "final" ? "/researcher/final" : "/researcher/progress");
}


export async function deanFirstScreen(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const decision = String(formData.get("decision")) as "pass" | "return" | "fail";
  const notes = String(formData.get("notes") ?? "");

  await supabase.from("screenings").insert({
    application_id: appId,
    kind: "dean_first",
    screener_id: profile.id,
    decision: decision === "fail" ? "fail" : decision === "return" ? "return" : "pass",
    notes,
  });

  const to: AppStatus =
    decision === "pass" ? "committee_review" : decision === "return" ? "returned" : "rejected";
  await supabase
    .from("applications")
    .update({ status: to, decided_at: decision === "fail" ? new Date().toISOString() : null })
    .eq("id", appId);
  await logEvent(supabase, appId, profile, `First screening: ${decision}`, to, notes);
  revalidatePath("/dean/screen");
  redirect("/dean/screen");
}

export async function deanSignForward(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const notes = String(formData.get("notes") ?? "");
  await supabase.from("screenings").insert({
    application_id: appId,
    kind: "dean_sign",
    screener_id: profile.id,
    decision: "pass",
    notes,
  });
  await supabase.from("applications").update({ status: "iras_review" }).eq("id", appId);
  await logEvent(supabase, appId, profile, "Signed & forwarded to IRAS", "iras_review", notes);
  revalidatePath("/dean/sign");
  redirect("/dean/sign");
}


export async function committeeRecommend(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const recommendation = String(formData.get("recommendation")) as
    | "favorable"
    | "unfavorable"
    | "revise";

  await supabase.from("reviews").insert({
    application_id: appId,
    kind: "committee",
    reviewer_id: profile.id,
    recommendation,
    score: num(formData.get("score"), 0) || null,
    strengths: String(formData.get("strengths") ?? ""),
    weaknesses: String(formData.get("weaknesses") ?? ""),
    comments: String(formData.get("comments") ?? ""),
  });

  const to: AppStatus = recommendation === "unfavorable" ? "rejected" : "dean_sign";
  await supabase
    .from("applications")
    .update({ status: to, decided_at: to === "rejected" ? new Date().toISOString() : null })
    .eq("id", appId);
  await logEvent(supabase, appId, profile, `Committee: ${recommendation}`, to);
  revalidatePath("/committee/queue");
  redirect("/committee/queue");
}


export async function irasScreen(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const decision = String(formData.get("decision")) as "pass" | "return" | "fail";
  const notes = String(formData.get("notes") ?? "");
  await supabase.from("screenings").insert({
    application_id: appId,
    kind: "iras_office",
    screener_id: profile.id,
    decision: decision === "fail" ? "fail" : decision === "return" ? "return" : "pass",
    notes,
  });
  if (decision !== "pass") {
    const to: AppStatus = decision === "return" ? "returned" : "rejected";
    await supabase.from("applications").update({ status: to }).eq("id", appId);
    await logEvent(supabase, appId, profile, `Office screening: ${decision}`, to, notes);
  } else {
    const { data: app } = await supabase
      .from("applications")
      .select("code, requested_amount, duration_months")
      .eq("id", appId)
      .single();
    const amount = Number(app?.requested_amount ?? 0);
    await supabase
      .from("applications")
      .update({ status: "approved", approved_amount: amount, decided_at: new Date().toISOString() })
      .eq("id", appId);

    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + (app?.duration_months ?? 12));
    const { data: contract } = await supabase
      .from("contracts")
      .insert({
        application_id: appId,
        contract_no: `AU-CT-${(app?.code ?? "AU-2026-000").replace("AU-", "")}`,
        amount,
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        status: "issued",
        issued_by: profile.id,
      })
      .select("id")
      .single();

    const phase1 = Math.round(amount * 0.3);
    const phase2 = Math.round(amount * 0.4);
    await supabase.from("payments").insert([
      { application_id: appId, contract_id: contract?.id, instalment: 1, pct: 30, amount: phase1, trigger: "On contract signing", status: "scheduled", due_date: start.toISOString().slice(0, 10) },
      { application_id: appId, contract_id: contract?.id, instalment: 2, pct: 40, amount: phase2, trigger: "On approved progress report", status: "pending" },
      { application_id: appId, contract_id: contract?.id, instalment: 3, pct: 30, amount: amount - phase1 - phase2, trigger: "On approved final report", status: "pending" },
    ]);
    await logEvent(supabase, appId, profile, "Approved by RASSC and sent to Finance", "approved", notes);
  }
  revalidatePath("/iras/screen");
  redirect("/iras/screen");
}

export async function assignExperts(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const expertIds = formData.getAll("expert_ids").map(String).filter(Boolean);
  const dueDate = (formData.get("due_date") as string) || null;
  if (expertIds.length) {
    await supabase.from("expert_assignments").upsert(
      expertIds.map((expert_id) => ({
        application_id: appId,
        expert_id,
        assigned_by: profile.id,
        status: "pending" as const,
        due_date: dueDate,
      })),
      { onConflict: "application_id,expert_id" }
    );
  }
  await supabase.from("applications").update({ status: "expert_review" }).eq("id", appId);
  await logEvent(
    supabase,
    appId,
    profile,
    `Assigned ${expertIds.length} expert reviewer(s)`,
    "expert_review"
  );
  revalidatePath("/iras/assign");
  redirect("/iras/assign");
}


export async function expertSubmitReview(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const recommendation = String(formData.get("recommendation")) as
    | "favorable"
    | "unfavorable"
    | "revise";

  await supabase.from("reviews").insert({
    application_id: appId,
    kind: "expert",
    reviewer_id: profile.id,
    recommendation,
    score: num(formData.get("score"), 0) || null,
    strengths: String(formData.get("strengths") ?? ""),
    weaknesses: String(formData.get("weaknesses") ?? ""),
    comments: String(formData.get("comments") ?? ""),
  });

  await supabase
    .from("expert_assignments")
    .update({ status: "completed" })
    .eq("application_id", appId)
    .eq("expert_id", profile.id);

  const { data: remaining } = await supabase
    .from("expert_assignments")
    .select("id")
    .eq("application_id", appId)
    .neq("status", "completed");

  if (!remaining || remaining.length === 0) {
    await supabase.from("applications").update({ status: "president_review" }).eq("id", appId);
    await logEvent(supabase, appId, profile, "All expert reviews complete", "president_review");
  } else {
    await logEvent(supabase, appId, profile, `Expert review submitted: ${recommendation}`);
  }
  revalidatePath("/expert/assignments");
  redirect("/expert/assignments");
}


export async function presidentDecide(formData: FormData) {
  const { supabase, profile } = await ctx();
  const appId = String(formData.get("application_id"));
  const decision = String(formData.get("decision")) as "approve" | "reject";
  const conditions = String(formData.get("conditions") ?? "");

  const { data: app } = await supabase
    .from("applications")
    .select("code, requested_amount, duration_months")
    .eq("id", appId)
    .single();
  const amount = num(formData.get("approved_amount"), app?.requested_amount ?? 0);

  await supabase.from("approvals").insert({
    application_id: appId,
    president_id: profile.id,
    approved: decision === "approve",
    approved_amount: decision === "approve" ? amount : null,
    conditions,
  });

  if (decision === "reject") {
    await supabase
      .from("applications")
      .update({ status: "rejected", decided_at: new Date().toISOString() })
      .eq("id", appId);
    await logEvent(supabase, appId, profile, "Rejected by President", "rejected", conditions);
  } else {
    await supabase
      .from("applications")
      .update({ status: "active", approved_amount: amount, decided_at: new Date().toISOString() })
      .eq("id", appId);

    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + (app?.duration_months ?? 12));
    const contractNo = `AU-CT-${(app?.code ?? "AU-2026-000").replace("AU-", "")}`;
    const { data: contract } = await supabase
      .from("contracts")
      .insert({
        application_id: appId,
        contract_no: contractNo,
        amount,
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        status: "active",
        issued_by: profile.id,
      })
      .select("id")
      .single();

    const a1 = Math.round(amount * 0.3);
    const a2 = Math.round(amount * 0.4);
    const a3 = amount - a1 - a2;
    await supabase.from("payments").insert([
      { application_id: appId, contract_id: contract?.id, instalment: 1, pct: 30, amount: a1, trigger: "On contract signing", status: "scheduled", due_date: start.toISOString().slice(0, 10) },
      { application_id: appId, contract_id: contract?.id, instalment: 2, pct: 40, amount: a2, trigger: "On approved progress report", status: "pending" },
      { application_id: appId, contract_id: contract?.id, instalment: 3, pct: 30, amount: a3, trigger: "On approved final report", status: "pending" },
    ]);
    await logEvent(supabase, appId, profile, "Approved — contract issued", "active", conditions);
  }
  revalidatePath("/president/queue");
  redirect("/president/queue");
}


export async function markPaymentPaid(formData: FormData) {
  const { supabase, profile } = await ctx();
  const paymentId = String(formData.get("payment_id"));
  const appId = String(formData.get("application_id"));

  await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString(), processed_by: profile.id })
    .eq("id", paymentId);

  const { data: remaining } = await supabase
    .from("payments")
    .select("id")
    .eq("application_id", appId)
    .neq("status", "paid");
  if (!remaining || remaining.length === 0) {
    await supabase.from("applications").update({ status: "completed" }).eq("id", appId);
    await logEvent(supabase, appId, profile, "Final instalment paid — grant completed", "completed");
  } else {
    await logEvent(supabase, appId, profile, "Instalment disbursed");
  }
  revalidatePath("/ofm/payments");
  redirect("/ofm/payments");
}
