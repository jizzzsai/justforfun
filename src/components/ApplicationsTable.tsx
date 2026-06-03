import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataTable, StatusBadge, type Column } from "@/components/ui";
import { thb, formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";

export function ApplicationsTable({
  applications,
  hrefBase,
  showPI = false,
  actionLabel = "Open",
  dateField = "updated_at",
  empty,
}: {
  applications: Application[];
  hrefBase: string;
  showPI?: boolean;
  actionLabel?: string;
  dateField?: "updated_at" | "submitted_at" | "created_at";
  empty?: React.ReactNode;
}) {
  const columns: Column<Application>[] = [
    {
      header: "Code",
      cell: (a) => <span className="font-medium text-ink">{a.code}</span>,
    },
    {
      header: "Title",
      cell: (a) => (
        <span className="line-clamp-1 max-w-[22rem] text-ink-soft">{a.title}</span>
      ),
    },
    { header: "Tier", cell: (a) => a.journal_tier?.code ?? "—" },
    {
      header: "Requested",
      cell: (a) => thb(a.requested_amount),
      className: "tabular-nums",
    },
    { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
    {
      header: "Updated",
      cell: (a) => (
        <span className="text-muted">{formatDate(a[dateField])}</span>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (a) => (
        <Link
          href={`${hrefBase}/${a.id}`}
          className="inline-flex items-center gap-1 font-medium text-gold hover:text-gold-deep"
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  if (showPI) {
    columns.splice(2, 0, {
      header: "PI",
      cell: (a) => a.researcher?.full_name ?? "—",
    });
  }

  return <DataTable columns={columns} rows={applications} empty={empty} />;
}
