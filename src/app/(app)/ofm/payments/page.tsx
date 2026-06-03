import { requireRole } from "@/lib/auth";
import { listPayments } from "@/lib/queries";
import { PageHeader, Card } from "@/components/ui";
import { PaymentQueueTable } from "@/components/PaymentQueueTable";

export default async function OfmPayments() {
  await requireRole("ofm");
  const payments = (await listPayments()).filter((p) => p.status !== "paid");

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Queue" subtitle="Scheduled and pending instalments awaiting disbursement." />
      <Card>
        <PaymentQueueTable payments={payments} />
      </Card>
    </div>
  );
}
