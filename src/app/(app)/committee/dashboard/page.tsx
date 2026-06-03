import Link from "next/link";
import { ListChecks, FileCheck2, ThumbsUp, ThumbsDown } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications, listReviewsByReviewer } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function CommitteeDashboard() {
  const profile = await requireRole("committee");
  const [queue, myReviews] = await Promise.all([
    listApplications({ statuses: ["committee_review"] }),
    listReviewsByReviewer(profile.id),
  ]);
  const committeeReviews = myReviews.filter((r) => r.kind === "committee");
  const favorable = committeeReviews.filter((r) => r.recommendation !== "unfavorable").length;
  const unfavorable = committeeReviews.filter((r) => r.recommendation === "unfavorable").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty Academic Committee" subtitle="Scholarly review and recommendation to the Dean." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="In review queue" value={queue.length} icon={ListChecks} tone="info" />
        <StatCard label="Reviews submitted" value={committeeReviews.length} icon={FileCheck2} tone="gold" />
        <StatCard label="Recommended" value={favorable} icon={ThumbsUp} tone="ok" />
        <StatCard label="Not recommended" value={unfavorable} icon={ThumbsDown} tone="danger" />
      </div>

      <Card>
        <CardHeader
          title="Review queue"
          subtitle="Proposals forwarded by the Dean for committee review"
          action={<Link href="/committee/queue" className="text-sm font-medium text-gold">Open queue</Link>}
        />
        <ApplicationsTable
          applications={queue.slice(0, 6)}
          hrefBase="/committee/review"
          showPI
          actionLabel="Review"
          empty={<p className="px-1 py-8 text-center text-sm text-muted">No proposals awaiting review.</p>}
        />
      </Card>
    </div>
  );
}
