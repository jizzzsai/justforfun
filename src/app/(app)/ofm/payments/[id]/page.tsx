import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getApplicationBundle } from "@/lib/queries";
import { markPaymentPaid } from "@/lib/workflow-actions";
import { ApplicationSummary, Timeline } from "@/components/application";
import { BackLink } from "@/components/BackLink";
import { Card, CardHeader, Badge, buttonClass } from "@/components/ui";
import { thb, formatDate } from "@/lib/format";

export default async function OfmGrantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("ofm");
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();
  const { application: a, contract, payments, events } = bundle;

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <BackLink href="/ofm/payments" label="Back to payment queue" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ApplicationSummary application={a} />

          <Card>
            <CardHeader title="Disbursement (30 / 40 / 30)" subtitle={`${thb(paid)} of ${thb(total)} released`} />
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
                  <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums text-ink">{thb(p.amount)}</span>
                    {p.status === "paid" ? (
                      <Badge tone="ok">paid</Badge>
                    ) : (
                      <form action={markPaymentPaid}>
                        <input type="hidden" name="payment_id" value={p.id} />
                        <input type="hidden" name="application_id" value={p.application_id} />
                        <button type="submit" className={buttonClass("primary", "sm")}>
                          Mark paid
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
              {payments.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted">No payment schedule yet.</li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          {contract && (
            <Card>
              <CardHeader title="Contract" />
              <dl className="space-y-2.5 p-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Contract No.</dt>
                  <dd className="font-medium text-ink">{contract.contract_no}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Amount</dt>
                  <dd className="tabular-nums text-ink">{thb(contract.amount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Period</dt>
                  <dd className="text-ink">
                    {formatDate(contract.start_date)} – {formatDate(contract.end_date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Status</dt>
                  <dd>
                    <Badge tone={contract.status === "active" ? "ok" : "info"}>{contract.status}</Badge>
                  </dd>
                </div>
              </dl>
            </Card>
          )}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
