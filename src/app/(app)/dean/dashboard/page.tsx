import Link from "next/link";
import { ClipboardCheck, PenLine, Users, Layers } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications, statusCounts } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function DeanDashboard() {
  await requireRole("dean");
  const [counts, firstQueue, signQueue] = await Promise.all([
    statusCounts(),
    listApplications({ statuses: ["submitted"] }),
    listApplications({ statuses: ["dean_sign"] }),
  ]);

  const pipeline =
    (counts.submitted ?? 0) +
    (counts.committee_review ?? 0) +
    (counts.dean_sign ?? 0) +
    (counts.iras_review ?? 0) +
    (counts.expert_review ?? 0) +
    (counts.president_review ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Dean's Office" subtitle="First screening and sign-and-forward of faculty proposals." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting first screening" value={counts.submitted ?? 0} icon={ClipboardCheck} tone="info" />
        <StatCard label="Awaiting sign & forward" value={counts.dean_sign ?? 0} icon={PenLine} tone="warn" />
        <StatCard label="With committee" value={counts.committee_review ?? 0} icon={Users} tone="gold" />
        <StatCard label="In pipeline" value={pipeline} icon={Layers} tone="ok" />
      </div>

      <Card>
        <CardHeader
          title="First screening queue"
          subtitle="New proposals awaiting your initial review"
          action={<Link href="/dean/screen" className="text-sm font-medium text-gold">Open queue</Link>}
        />
        <ApplicationsTable
          applications={firstQueue.slice(0, 5)}
          hrefBase="/dean/screen"
          showPI
          actionLabel="Screen"
          dateField="submitted_at"
          empty={<p className="px-1 py-8 text-center text-sm text-muted">Queue is empty.</p>}
        />
      </Card>

      <Card>
        <CardHeader
          title="Sign & forward queue"
          subtitle="Committee-recommended proposals awaiting your signature"
          action={<Link href="/dean/sign" className="text-sm font-medium text-gold">Open queue</Link>}
        />
        <ApplicationsTable
          applications={signQueue.slice(0, 5)}
          hrefBase="/dean/sign"
          showPI
          actionLabel="Sign"
          empty={<p className="px-1 py-8 text-center text-sm text-muted">Nothing to sign.</p>}
        />
      </Card>
    </div>
  );
}
