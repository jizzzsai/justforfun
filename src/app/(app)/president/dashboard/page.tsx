import Link from "next/link";
import { Gavel, FileSignature, CircleDollarSign, BadgeCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications, statusCounts, listContracts } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { thbCompact } from "@/lib/format";

export default async function PresidentDashboard() {
  await requireRole("president");
  const [counts, queue, contracts] = await Promise.all([
    statusCounts(),
    listApplications({ statuses: ["president_review"] }),
    listContracts(),
  ]);
  const activeContracts = contracts.filter((c) => c.status === "active").length;
  const committed = contracts.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Office of the President" subtitle="Final approval, contract issuance and tracking." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting approval" value={counts.president_review ?? 0} icon={Gavel} tone="info" />
        <StatCard label="Active contracts" value={activeContracts} icon={FileSignature} tone="ok" />
        <StatCard label="Total committed" value={thbCompact(committed)} icon={CircleDollarSign} tone="gold" />
        <StatCard label="Completed grants" value={counts.completed ?? 0} icon={BadgeCheck} tone="gold" />
      </div>

      <Card>
        <CardHeader
          title="Final approval queue"
          subtitle="Proposals with completed expert reviews"
          action={<Link href="/president/queue" className="text-sm font-medium text-gold">Open queue</Link>}
        />
        <ApplicationsTable
          applications={queue.slice(0, 6)}
          hrefBase="/president/approve"
          showPI
          actionLabel="Review"
          empty={<p className="px-1 py-8 text-center text-sm text-muted">No proposals awaiting approval.</p>}
        />
      </Card>
    </div>
  );
}
