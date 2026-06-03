import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getApplicationBundle } from "@/lib/queries";
import { expertSubmitReview } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { ReviewForm } from "@/components/ReviewForm";
import { BackLink } from "@/components/BackLink";
import { Card } from "@/components/ui";

export default async function ExpertEvaluate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireRole("expert");
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();

  const myAssignment = bundle.assignments.find((a) => a.expert_id === profile.id);
  if (!myAssignment) notFound();

  const { application: a, events } = bundle;
  const myReviews = bundle.reviews.filter((r) => r.reviewer_id === profile.id);
  const canReview = myAssignment.status !== "completed" && a.status === "expert_review";

  return (
    <div className="space-y-6">
      <BackLink href="/expert/assignments" label="Back to assignments" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          {myReviews.length > 0 && <ReviewsList reviews={myReviews} title="Your submitted review" />}
        </div>
        <div className="space-y-6">
          {canReview ? (
            <ReviewForm action={expertSubmitReview} appId={a.id} title="Expert evaluation" />
          ) : (
            <Card className="p-5 text-sm text-muted">
              {myAssignment.status === "completed"
                ? "You have submitted your review for this proposal."
                : "This proposal is not currently open for your review."}
            </Card>
          )}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
