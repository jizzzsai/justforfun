import { submitReport } from "@/lib/workflow-actions";
import {
  PageHeader,
  Card,
  CardHeader,
  Field,
  Select,
  Textarea,
  buttonClass,
  EmptyState,
  Badge,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Application, Report } from "@/lib/types";

export function ReportPage({
  kind,
  apps,
  reports,
}: {
  kind: "progress" | "final";
  apps: Application[];
  reports: Report[];
}) {
  const label = kind === "final" ? "Final" : "Progress";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${label} Reports`}
        subtitle={`Submit and track the ${label.toLowerCase()} reports for your active grants.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={`Submit a ${label.toLowerCase()} report`} />
          {apps.length === 0 ? (
            <EmptyState
              title="No active grants"
              message="You can submit reports once a grant has been approved and is active."
            />
          ) : (
            <form action={submitReport} className="space-y-4 p-5">
              <input type="hidden" name="kind" value={kind} />
              <Field label="Grant" required>
                <Select name="application_id" required defaultValue="">
                  <option value="" disabled>
                    Select grant…
                  </option>
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={`${label} summary`} required>
                <Textarea
                  name="summary"
                  rows={5}
                  required
                  placeholder="Summarise progress, milestones reached and any deviations."
                />
              </Field>
              <button type="submit" className={buttonClass("primary")}>
                Submit {label.toLowerCase()} report
              </button>
            </form>
          )}
        </Card>

        <Card>
          <CardHeader title="Submitted reports" subtitle={`${reports.length} total`} />
          {reports.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">Nothing submitted yet.</p>
          ) : (
            <ul className="divide-y divide-line-soft">
              {reports.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">
                      {r.application?.code} — {r.application?.title}
                    </p>
                    <Badge
                      tone={r.status === "accepted" ? "ok" : r.status === "revise" ? "warn" : "info"}
                    >
                      {r.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Submitted {formatDate(r.submitted_at)}
                  </p>
                  {r.summary && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{r.summary}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
