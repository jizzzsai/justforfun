import { notFound } from "next/navigation";
import { getApplicationBundle } from "@/lib/queries";
import { irasScreen } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { ScreeningPanel } from "@/components/panels";
import { BackLink } from "@/components/BackLink";

export async function IrasAppDetail({
  id,
  backHref = "/iras/received",
  backLabel = "Back",
}: {
  id: string;
  backHref?: string;
  backLabel?: string;
}) {
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();
  const { application: a, events, reviews } = bundle;
  const open = a.status === "iras_review";

  return (
    <div className="space-y-6">
      <BackLink href={backHref} label={backLabel} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          {reviews.length > 0 && <ReviewsList reviews={reviews} title="Faculty Committee review" />}
        </div>
        <div className="space-y-6">
          {open && <ScreeningPanel action={irasScreen} appId={a.id} title="RASSC final decision" passLabel="Approve" />}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
