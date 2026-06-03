import Link from "next/link";
import { Banknote, CalendarClock, CircleDollarSign, BadgeCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listPayments, statusCounts } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { PaymentQueueTable } from "@/components/PaymentQueueTable";
import { thbCompact } from "@/lib/format";

export default async function OfmDashboard() {
  await requireRole("ofm");
  const [payments, counts] = await Promise.all([listPayments(), statusCounts()]);

  const due = payments.filter((p) => p.status !== "paid");
  const awaiting = due.reduce((s, p) => s + p.amount, 0);
  const scheduled = payments.filter((p) => p.status === "scheduled").length;
  const disbursed = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="OFM / Finance" subtitle="Track and release the 30 / 40 / 30 grant disbursement." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting disbursement" value={thbCompact(awaiting)} icon={CircleDollarSign} tone="warn" />
        <StatCard label="Scheduled now" value={scheduled} icon={CalendarClock} tone="info" />
        <StatCard label="Total disbursed" value={thbCompact(disbursed)} icon={Banknote} tone="ok" />
        <StatCard label="Active grants" value={counts.active ?? 0} icon={BadgeCheck} tone="gold" />
      </div>

      <Card>
        <CardHeader
          title="Payment queue"
          subtitle="Instalments due for release"
          action={<Link href="/ofm/payments" className="text-sm font-medium text-gold">Open queue</Link>}
        />
        <PaymentQueueTable payments={due.slice(0, 6)} />
      </Card>
    </div>
  );
}
