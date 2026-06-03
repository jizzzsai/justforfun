import { requireRole } from "@/lib/auth";
import { listReviewsByReviewer } from "@/lib/queries";
import { PageHeader, Card } from "@/components/ui";
import { ReviewHistoryTable } from "@/components/ReviewHistoryTable";

export default async function CommitteeHistory() {
  const profile = await requireRole("committee");
  const reviews = (await listReviewsByReviewer(profile.id)).filter((r) => r.kind === "committee");

  return (
    <div className="space-y-6">
      <PageHeader title="Past Reviews" subtitle="Your submitted committee recommendations." />
      <Card>
        <ReviewHistoryTable reviews={reviews} hrefBase="/committee/review" />
      </Card>
    </div>
  );
}
