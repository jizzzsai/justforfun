import { requireRole } from "@/lib/auth";
import { listProfilesByRole } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, DataTable, Avatar, Badge, EmptyState, type Column } from "@/components/ui";
import type { Profile } from "@/lib/types";

export default async function IrasReviewers() {
  await requireRole("iras");
  const experts = await listProfilesByRole("expert");

  const supabase = await createClient();
  const { data: asgn } = await supabase.from("expert_assignments").select("expert_id, status");
  const counts: Record<string, { active: number; done: number }> = {};
  for (const a of (asgn ?? []) as { expert_id: string; status: string }[]) {
    counts[a.expert_id] ??= { active: 0, done: 0 };
    if (a.status === "completed") counts[a.expert_id].done++;
    else counts[a.expert_id].active++;
  }

  const columns: Column<Profile>[] = [
    {
      header: "Expert",
      cell: (e) => (
        <span className="flex items-center gap-2">
          <Avatar name={e.full_name} className="h-7 w-7 text-[0.6rem]" />
          <span>
            <span className="block font-medium text-ink">{e.full_name}</span>
            <span className="block text-xs text-muted">{e.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Expertise", cell: (e) => <span className="text-ink-soft">{e.expertise ?? "—"}</span> },
    {
      header: "Active",
      cell: (e) => <Badge tone="info">{counts[e.id]?.active ?? 0}</Badge>,
    },
    {
      header: "Completed",
      cell: (e) => <Badge tone="ok">{counts[e.id]?.done ?? 0}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviewer Pool" subtitle="Expert reviewers available for assignment." />
      <Card>
        <DataTable
          columns={columns}
          rows={experts}
          empty={<EmptyState title="No experts" message="No expert reviewers registered yet." />}
        />
      </Card>
    </div>
  );
}
