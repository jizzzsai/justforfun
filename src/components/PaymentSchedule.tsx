import { Card, CardHeader, Badge } from "@/components/ui";
import { thb, formatDate } from "@/lib/format";
import type { Payment, PaymentStatus } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const PAY_TONE: Record<PaymentStatus, Tone> = {
  paid: "ok",
  scheduled: "info",
  pending: "neutral",
};

export function PaymentSchedule({
  payments,
  title = "Disbursement schedule",
}: {
  payments: Payment[];
  title?: string;
}) {
  if (!payments.length) return null;
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const paid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <Card>
      <CardHeader title={title} subtitle={`${thb(paid)} of ${thb(total)} released`} />
      <ul className="divide-y divide-line-soft">
        {payments.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <div>
              <p className="text-sm font-medium text-ink">
                Instalment {p.instalment} · {p.pct}%
              </p>
              <p className="text-xs text-muted">
                {p.trigger}
                {p.due_date ? ` · due ${formatDate(p.due_date)}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm tabular-nums text-ink">{thb(p.amount)}</p>
              <Badge tone={PAY_TONE[p.status]}>{p.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
