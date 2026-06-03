import Link from "next/link";
import { DataTable, Badge, EmptyState, type Column } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Review, Recommendation } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const REC_TONE: Record<Recommendation, Tone> = {
  favorable: "ok",
  revise: "warn",
  unfavorable: "danger",
};

export function ReviewHistoryTable({
  reviews,
  hrefBase,
}: {
  reviews: Review[];
  hrefBase: string;
}) {
  const columns: Column<Review>[] = [
    {
      header: "Code",
      cell: (r) => <span className="font-medium text-ink">{r.application?.code}</span>,
    },
    {
      header: "Title",
      cell: (r) => (
        <span className="line-clamp-1 max-w-[20rem] text-ink-soft">{r.application?.title}</span>
      ),
    },
    {
      header: "Score",
      cell: (r) => (r.score != null ? `${r.score}/100` : "—"),
      className: "tabular-nums",
    },
    {
      header: "Recommendation",
      cell: (r) =>
        r.recommendation ? <Badge tone={REC_TONE[r.recommendation]}>{r.recommendation}</Badge> : "—",
    },
    {
      header: "Date",
      cell: (r) => <span className="text-muted">{formatDate(r.submitted_at)}</span>,
    },
    {
      header: "",
      className: "text-right",
      cell: (r) =>
        r.application ? (
          <Link href={`${hrefBase}/${r.application.id}`} className="font-medium text-gold">
            View
          </Link>
        ) : null,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={reviews}
      empty={<EmptyState title="No reviews yet" message="Reviews you submit will appear here." />}
    />
  );
}
