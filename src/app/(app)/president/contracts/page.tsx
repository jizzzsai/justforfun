import { FileSignature } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listContracts } from "@/lib/queries";
import { PageHeader, Card, DataTable, Badge, EmptyState, type Column } from "@/components/ui";
import { thb, formatDate } from "@/lib/format";
import type { Contract, ContractStatus } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const C_TONE: Record<ContractStatus, Tone> = {
  issued: "info",
  active: "ok",
  completed: "gold",
  terminated: "danger",
};

export default async function PresidentContracts() {
  await requireRole("president");
  const contracts = await listContracts();

  const columns: Column<Contract>[] = [
    {
      header: "Contract No.",
      cell: (c) => <span className="font-medium text-ink">{c.contract_no}</span>,
    },
    {
      header: "Project",
      cell: (c) => (
        <span className="block max-w-[20rem]">
          <span className="block text-xs text-muted">{c.application?.code}</span>
          <span className="line-clamp-1 text-ink-soft">{c.application?.title}</span>
        </span>
      ),
    },
    { header: "PI", cell: (c) => c.application?.researcher?.full_name ?? "—" },
    { header: "Amount", cell: (c) => thb(c.amount), className: "tabular-nums" },
    {
      header: "Period",
      cell: (c) => (
        <span className="text-muted">
          {formatDate(c.start_date)} – {formatDate(c.end_date)}
        </span>
      ),
    },
    { header: "Status", cell: (c) => <Badge tone={C_TONE[c.status]}>{c.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Contract Tracking" subtitle="Issued research grant contracts and their status." />
      <Card>
        <DataTable
          columns={columns}
          rows={contracts}
          empty={<EmptyState icon={FileSignature} title="No contracts" message="Approved grants will appear here once contracts are issued." />}
        />
      </Card>
    </div>
  );
}
