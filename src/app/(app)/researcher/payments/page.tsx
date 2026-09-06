import { Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listPayments } from "@/lib/queries";
import { PageHeader, StatCard, EmptyState, Card } from "@/components/ui";
import { PaymentSchedule } from "@/components/PaymentSchedule";
import { thbCompact } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default async function ResearcherPayments() {
  const profile = await requireRole("researcher");
  const payments = (await listPayments()).filter(
    (p) => p.application?.researcher_id === profile.id
  );

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const received = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);


  const groups = new Map<string, { title: string; items: Payment[] }>();
  for (const p of payments) {
    const key = p.application_id;
    if (!groups.has(key)) {
      groups.set(key, {
        title: `${p.application?.code ?? ""} · ${p.application?.title ?? ""}`,
        items: [],
      });
    }
    groups.get(key)!.items.push(p);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Disbursement status across your funded grants." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total awarded" value={thbCompact(total)} icon={Wallet} tone="gold" />
        <StatCard label="Received" value={thbCompact(received)} tone="ok" />
        <StatCard label="Outstanding" value={thbCompact(total - received)} tone="info" />
      </div>

      {groups.size === 0 ? (
        <Card>
          <EmptyState
            icon={Wallet}
            title="No payments yet"
            message="Disbursements appear here once a grant contract is issued."
          />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {[...groups.values()].map((g, i) => (
            <PaymentSchedule key={i} payments={g.items} title={g.title} />
          ))}
        </div>
      )}
    </div>
  );
}
