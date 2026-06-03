import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, DataTable, Badge, EmptyState, type Column } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { ROLE_META, type Role } from "@/lib/roles";
import type { ApplicationEvent } from "@/lib/types";

type AuditRow = ApplicationEvent & {
  application?: { code: string; title: string } | null;
};

export default async function AdminAudit() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data } = await supabase
    .from("application_events")
    .select("*, actor:profiles(*), application:applications(code, title)")
    .order("created_at", { ascending: false })
    .limit(150);
  const rows = (data ?? []) as AuditRow[];

  const columns: Column<AuditRow>[] = [
    {
      header: "When",
      cell: (e) => <span className="whitespace-nowrap text-muted">{formatDateTime(e.created_at)}</span>,
    },
    {
      header: "Actor",
      cell: (e) => (
        <span>
          <span className="block text-ink">{e.actor?.full_name ?? "System"}</span>
          {e.actor_role && (
            <span className="block text-xs text-muted">{ROLE_META[e.actor_role as Role].short}</span>
          )}
        </span>
      ),
    },
    { header: "Action", cell: (e) => <span className="text-ink-soft">{e.action}</span> },
    {
      header: "Application",
      cell: (e) =>
        e.application ? (
          <span className="text-xs">
            <span className="font-medium text-ink">{e.application.code}</span>
          </span>
        ) : (
          "—"
        ),
    },
    {
      header: "Status",
      cell: (e) => (e.to_status ? <Badge tone="info">{e.to_status}</Badge> : "—"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" subtitle="Workflow activity across all applications." />
      <Card>
        <DataTable
          columns={columns}
          rows={rows}
          empty={<EmptyState title="No activity yet" message="Workflow events will appear here." />}
        />
      </Card>
    </div>
  );
}
