import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getApplicationBundle } from "@/lib/queries";
import { presidentDecide } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { BackLink } from "@/components/BackLink";
import { Card, CardHeader, Field, Input, Textarea, buttonClass } from "@/components/ui";

export default async function PresidentApprove({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("president");
  const bundle = await getApplicationBundle(id);
  if (!bundle) notFound();
  const { application: a, events, reviews } = bundle;
  const open = a.status === "president_review";

  return (
    <div className="space-y-6">
      <BackLink href="/president/queue" label="Back to approval queue" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          <ReviewsList reviews={reviews} title="Committee & expert reviews" />
        </div>
        <div className="space-y-6">
          {open && (
            <Card>
              <CardHeader title="Final decision" />
              <form action={presidentDecide} className="space-y-3 p-5">
                <input type="hidden" name="application_id" value={a.id} />
                <Field label="Approved amount (THB)" hint="Defaults to the requested amount.">
                  <Input
                    name="approved_amount"
                    type="number"
                    min={0}
                    step={1000}
                    defaultValue={a.requested_amount}
                  />
                </Field>
                <Field label="Conditions / notes">
                  <Textarea name="conditions" rows={3} placeholder="Any conditions attached to approval." />
                </Field>
                <div className="flex flex-col gap-2">
                  <button name="decision" value="approve" className={buttonClass("primary") + " w-full"}>
                    Approve & issue contract
                  </button>
                  <button name="decision" value="reject" className={buttonClass("danger") + " w-full"}>
                    Reject
                  </button>
                </div>
              </form>
            </Card>
          )}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
