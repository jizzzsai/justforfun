import { requireRole } from "@/lib/auth";
import { listReviewsByReviewer } from "@/lib/queries";
import { PageHeader, Card } from "@/components/ui";
import { ReviewHistoryTable } from "@/components/ReviewHistoryTable";

export default async function ExpertHistory() {
  const profile = await requireRole("expert");
  const reviews = (await listReviewsByReviewer(profile.id)).filter((r) => r.kind === "expert");

  return (
    <div className="space-y-6">
      <PageHeader title="Submitted Reviews" subtitle="Your completed expert evaluations." />
      <Card>
        <ReviewHistoryTable reviews={reviews} hrefBase="/expert/evaluate" />
      </Card>
    </div>
  );
}
