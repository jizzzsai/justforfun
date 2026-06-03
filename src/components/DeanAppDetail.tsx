import { notFound } from "next/navigation";
import { getApplicationBundle } from "@/lib/queries";
import { deanFirstScreen, deanSignForward } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { ScreeningPanel, ForwardPanel } from "@/components/panels";
import { BackLink } from "@/components/BackLink";

export async function DeanAppDetail({
  id,
  backHref = "/dean/screen",
  backLabel = "Back to queue",
}: {
  id: string;
  backHref?: string;
  backLabel?: string;
}) {
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();
  const { application: a, events, reviews } = bundle;

  return (
    <div className="space-y-6">
      <BackLink href={backHref} label={backLabel} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          {reviews.length > 0 && (
            <ReviewsList reviews={reviews} title="Committee & expert reviews" />
          )}
        </div>
        <div className="space-y-6">
          {a.status === "submitted" && (
            <ScreeningPanel action={deanFirstScreen} appId={a.id} title="First screening" />
          )}
          {a.status === "dean_sign" && <ForwardPanel action={deanSignForward} appId={a.id} />}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
