import Link from "next/link";
import { Inbox, ClipboardCheck, Send, Users } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications, statusCounts, listProfilesByRole } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function IrasDashboard() {
  await requireRole("iras");
  const [counts, queue, experts] = await Promise.all([
    statusCounts(),
    listApplications({ statuses: ["iras_review"] }),
    listProfilesByRole("expert"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="IRAS Research Office" subtitle="Screen forwarded proposals and assign expert reviewers." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Received" value={counts.iras_review ?? 0} icon={Inbox} tone="info" />
        <StatCard label="Awaiting screening" value={counts.iras_review ?? 0} icon={ClipboardCheck} tone="warn" />
        <StatCard label="Out for expert review" value={counts.expert_review ?? 0} icon={Send} tone="gold" />
        <StatCard label="Experts in pool" value={experts.length} icon={Users} tone="ok" />
      </div>

      <Card>
        <CardHeader
          title="Received from Dean"
          subtitle="Proposals forwarded for office screening and expert assignment"
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
