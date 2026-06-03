import { requireRole } from "@/lib/auth";
import { listPayments } from "@/lib/queries";
import { PageHeader, Card, StatCard } from "@/components/ui";
import { PaymentQueueTable } from "@/components/PaymentQueueTable";
import { thbCompact } from "@/lib/format";

export default async function OfmHistory() {
  await requireRole("ofm");
  const paid = (await listPayments()).filter((p) => p.status === "paid");
  const total = paid.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Payment History" subtitle="All disbursed instalments." />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Instalments paid" value={paid.length} tone="ok" />
        <StatCard label="Total disbursed" value={thbCompact(total)} tone="gold" />
      </div>
      <Card>
        <PaymentQueueTable payments={paid} showAction={false} />
      </Card>
    </div>
  );
}
