import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getApplicationBundle } from "@/lib/queries";
import { ApplicationSummary, ProgressSteps, Timeline } from "@/components/application";
import { PaymentSchedule } from "@/components/PaymentSchedule";
import { Card, CardHeader, Badge } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireRole("researcher");
  const bundle = await getApplicationBundle(id);
  if (!bundle || bundle.application.researcher_id !== profile.id) notFound();

  const { application, events, reports, payments } = bundle;

  return (
    <div className="space-y-6">
      <Link
        href="/researcher/applications"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressSteps status={application.status} />
          <ApplicationSummary application={application} />

          {reports.length > 0 && (
            <Card>
              <CardHeader title="Submitted reports" />
              <ul className="divide-y divide-line-soft">
                {reports.map((r) => (
                  <li key={r.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium capitalize text-ink">{r.kind} report</p>
                      <p className="text-xs text-muted">
                        Submitted {formatDate(r.submitted_at)}
                      </p>
                    </div>
                    <Badge tone={r.status === "accepted" ? "ok" : r.status === "revise" ? "warn" : "info"}>
                      {r.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Timeline events={events} />
          <PaymentSchedule payments={payments} />
        </div>
      </div>
    </div>
  );
}
