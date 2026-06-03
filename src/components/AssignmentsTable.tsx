import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataTable, Badge, EmptyState, type Column } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { ExpertAssignment, AssignmentStatus } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const ASSIGN_TONE: Record<AssignmentStatus, Tone> = {
  pending: "warn",
  accepted: "info",
  completed: "ok",
  declined: "danger",
};

export function AssignmentsTable({ assignments }: { assignments: ExpertAssignment[] }) {
  const columns: Column<ExpertAssignment>[] = [
    {
      header: "Code",
      cell: (a) => <span className="font-medium text-ink">{a.application?.code}</span>,
    },
    {
      header: "Title",
      cell: (a) => (
        <span className="line-clamp-1 max-w-[22rem] text-ink-soft">{a.application?.title}</span>
      ),
    },
    {
      header: "Field",
      cell: (a) => <span className="text-muted">{a.application?.field ?? "—"}</span>,
    },
    { header: "Due", cell: (a) => <span className="text-muted">{formatDate(a.due_date)}</span> },
    { header: "Status", cell: (a) => <Badge tone={ASSIGN_TONE[a.status]}>{a.status}</Badge> },
    {
      header: "",
      className: "text-right",
      cell: (a) => (
        <Link
          href={`/expert/evaluate/${a.application_id}`}
          className="inline-flex items-center gap-1 font-medium text-gold hover:text-gold-deep"
        >
          {a.status === "completed" ? "View" : "Evaluate"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={assignments}
      empty={<EmptyState title="No assignments" message="You have no proposals assigned for review." />}
    />
  );
}
