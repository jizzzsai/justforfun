import Link from "next/link";
import { markPaymentPaid } from "@/lib/workflow-actions";
import { DataTable, Badge, buttonClass, EmptyState, type Column } from "@/components/ui";
import { thb, formatDate } from "@/lib/format";
import type { Payment, PaymentStatus } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const PAY_TONE: Record<PaymentStatus, Tone> = {
  paid: "ok",
  scheduled: "info",
  pending: "neutral",
};

export function PaymentQueueTable({
  payments,
  showAction = true,
}: {
  payments: Payment[];
  showAction?: boolean;
}) {
  const columns: Column<Payment>[] = [
    {
      header: "Grant",
      cell: (p) => (
        <Link href={`/ofm/payments/${p.application_id}`} className="block max-w-[18rem]">
          <span className="block text-xs text-muted">{p.application?.code}</span>
          <span className="line-clamp-1 font-medium text-ink hover:text-gold">
            {p.application?.title}
          </span>
        </Link>
      ),
    },
    { header: "PI", cell: (p) => p.application?.researcher?.full_name ?? "—" },
    {
      header: "Instalment",
      cell: (p) => `${p.instalment} · ${p.pct}%`,
    },
    { header: "Amount", cell: (p) => thb(p.amount), className: "tabular-nums" },
    { header: "Due", cell: (p) => <span className="text-muted">{formatDate(p.due_date)}</span> },
    { header: "Status", cell: (p) => <Badge tone={PAY_TONE[p.status]}>{p.status}</Badge> },
  ];

  if (showAction) {
    columns.push({
      header: "",
      className: "text-right",
      cell: (p) =>
        p.status === "paid" ? (
          <span className="text-xs text-muted">Paid {formatDate(p.paid_at)}</span>
        ) : (
          <form action={markPaymentPaid}>
            <input type="hidden" name="payment_id" value={p.id} />
            <input type="hidden" name="application_id" value={p.application_id} />
            <button type="submit" className={buttonClass("primary", "sm")}>
              Mark paid
            </button>
          </form>
        ),
    });
  }

  return (
    <DataTable
      columns={columns}
      rows={payments}
      empty={<EmptyState title="No payments" message="There are no payments to show." />}
    />
  );
}
