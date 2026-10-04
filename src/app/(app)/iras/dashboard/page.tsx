import Link from "next/link";
import { Inbox, ClipboardCheck, Send, BadgeCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications, statusCounts } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function IrasDashboard() {
  await requireRole("iras");
  const [counts, queue] = await Promise.all([
    statusCounts(),
    listApplications({ statuses: ["iras_review"] }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="IRAS Research Office" subtitle="Complete university review and send eligible grants to Academic." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Received" value={counts.iras_review ?? 0} icon={Inbox} tone="info" />
        <StatCard label="Awaiting screening" value={counts.iras_review ?? 0} icon={ClipboardCheck} tone="warn" />
        <StatCard label="Approved for Academic" value={counts.approved ?? 0} icon={Send} tone="gold" />
        <StatCard label="Active grants" value={counts.active ?? 0} icon={BadgeCheck} tone="ok" />
      </div>

      <Card>
        <CardHeader
          title="Received from Dean"
          subtitle="Proposals forwarded for RASSC review"
          action={<Link href="/iras/received" className="text-sm font-medium text-gold">View all</Link>}
        />
        <ApplicationsTable
          applications={queue.slice(0, 6)}
          hrefBase="/iras/screen"
          showPI
          actionLabel="Process"
          empty={<p className="px-1 py-8 text-center text-sm text-muted">Nothing received yet.</p>}
        />
      </Card>
    </div>
  );
}
