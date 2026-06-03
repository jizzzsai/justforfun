import { notFound } from "next/navigation";
import { getApplicationBundle, listProfilesByRole } from "@/lib/queries";
import { irasScreen, assignExperts } from "@/lib/workflow-actions";
import { ApplicationSummary, ProgressSteps, Timeline, ReviewsList } from "@/components/application";
import { ScreeningPanel } from "@/components/panels";
import { BackLink } from "@/components/BackLink";
import { Card, CardHeader, Field, Input, Avatar, Badge, buttonClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { ExpertAssignment, Profile, AssignmentStatus } from "@/lib/types";
import type { Tone } from "@/lib/workflow";

const ASSIGN_TONE: Record<AssignmentStatus, Tone> = {
  pending: "neutral",
  accepted: "info",
  completed: "ok",
  declined: "danger",
};

function AssignedExperts({ assignments }: { assignments: ExpertAssignment[] }) {
  return (
    <Card>
      <CardHeader title="Assigned experts" subtitle={`${assignments.length} assigned`} />
      <ul className="divide-y divide-line-soft">
        {assignments.map((a) => (
          <li key={a.id} className="flex items-center justify-between px-5 py-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <Avatar name={a.expert?.full_name} className="h-6 w-6 text-[0.6rem]" />
              {a.expert?.full_name ?? "Expert"}
            </span>
            <div className="flex items-center gap-2">
              {a.due_date && <span className="text-xs text-muted">due {formatDate(a.due_date)}</span>}
              <Badge tone={ASSIGN_TONE[a.status]}>{a.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AssignExpertsPanel({
  appId,
  experts,
  assigned,
}: {
  appId: string;
  experts: Profile[];
  assigned: ExpertAssignment[];
}) {
  const assignedIds = new Set(assigned.map((a) => a.expert_id));
  return (
    <Card>
      <CardHeader title="Assign expert reviewers" />
      <form action={assignExperts} className="space-y-4 p-5">
        <input type="hidden" name="application_id" value={appId} />
        <div className="space-y-1.5">
          {experts.map((e) => (
            <label
              key={e.id}
              className="flex items-start gap-2.5 rounded-lg border border-line p-2.5 text-sm has-[:checked]:border-gold has-[:checked]:bg-gold-wash"
            >
              <input
                type="checkbox"
                name="expert_ids"
                value={e.id}
                defaultChecked={assignedIds.has(e.id)}
                className="mt-0.5 accent-[var(--color-gold)]"
              />
              <span>
                <span className="block font-medium text-ink">{e.full_name}</span>
                {e.expertise && <span className="block text-xs text-muted">{e.expertise}</span>}
              </span>
            </label>
          ))}
          {experts.length === 0 && (
            <p className="text-sm text-muted">No experts in the reviewer pool yet.</p>
          )}
        </div>
        <Field label="Review due date">
          <Input type="date" name="due_date" />
        </Field>
        <button type="submit" className={buttonClass("primary") + " w-full"}>
          Assign & send for expert review
        </button>
      </form>
    </Card>
  );
}

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
  const experts = await listProfilesByRole("expert");
  const { application: a, events, reviews, assignments } = bundle;
  const open = a.status === "iras_review";

  return (
    <div className="space-y-6">
      <BackLink href={backHref} label={backLabel} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={a.status} />
          <ApplicationSummary application={a} />
          {assignments.length > 0 && <AssignedExperts assignments={assignments} />}
          {reviews.length > 0 && <ReviewsList reviews={reviews} title="Expert reviews" />}
        </div>
        <div className="space-y-6">
          {open && <ScreeningPanel action={irasScreen} appId={a.id} title="Office screening" />}
          {open && <AssignExpertsPanel appId={a.id} experts={experts} assigned={assignments} />}
          <Timeline events={events} />
        </div>
      </div>
    </div>
  );
}
