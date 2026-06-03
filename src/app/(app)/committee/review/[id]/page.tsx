import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getApplicationBundle } from "@/lib/queries";
import { committeeRecommend } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { ReviewForm } from "@/components/ReviewForm";
import { BackLink } from "@/components/BackLink";

export default async function CommitteeReview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("committee");
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();
  const { application: a, events, reviews } = bundle;

  return (
    <div className="space-y-6">
      <BackLink href="/committee/queue" label="Back to review queue" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          {reviews.length > 0 && <ReviewsList reviews={reviews} title="Submitted reviews" />}
        </div>
        <div className="space-y-6">
          {a.status === "committee_review" && (
            <ReviewForm action={committeeRecommend} appId={a.id} title="Committee recommendation" />
          )}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
