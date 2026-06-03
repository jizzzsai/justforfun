import type { ReactNode } from "react";
import { Card, CardHeader, Badge, StatusBadge, Avatar } from "@/components/ui";
import { formatDate, formatDateTime, thb } from "@/lib/format";
import {
  PIPELINE,
  pipelineIndex,
  statusLabel,
  type Tone,
} from "@/lib/workflow";
import { ROLE_META } from "@/lib/roles";
import { cn } from "@/lib/cn";
import type {
  Application,
  ApplicationEvent,
  Review,
  Recommendation,
} from "@/lib/types";

function Def({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children ?? "—"}</dd>
    </div>
  );
}

export function ApplicationSummary({ application }: { application: Application }) {
  const a = application;
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
        <div className="flex items-center gap-2">
          <Badge tone="gold">{a.code}</Badge>
          <StatusBadge status={a.status} />
        </div>
        <span className="text-xs text-muted">
          Submitted {formatDate(a.submitted_at)}
        </span>
      </div>
      <div className="space-y-5 p-5">
        <h2 className="font-display text-xl text-ink">{a.title}</h2>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Def label="Principal Investigator">
            <span className="flex items-center gap-2">
              <Avatar name={a.researcher?.full_name} className="h-6 w-6 text-[0.6rem]" />
              {a.researcher?.full_name ?? "—"}
            </span>
          </Def>
          <Def label="Faculty">{a.faculty}</Def>
          <Def label="Department">{a.department}</Def>
          <Def label="Research field">{a.field}</Def>
          <Def label="Target tier">
            {a.journal_tier ? (
              <span>
                {a.journal_tier.code} · {a.journal_tier.indexing}
              </span>
            ) : (
              "—"
            )}
          </Def>
          <Def label="Duration">{a.duration_months} months</Def>
          <Def label="Requested">{thb(a.requested_amount)}</Def>
          {a.approved_amount != null && (
            <Def label="Approved">{thb(a.approved_amount)}</Def>
          )}
          <Def label="Target journal">{a.target_journal}</Def>
        </dl>

        {a.abstract && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Abstract</dt>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.abstract}</p>
          </div>
        )}
        {a.keywords && (
          <div className="flex flex-wrap gap-1.5">
            {a.keywords.split(",").map((k) => (
              <span key={k} className="au-tag bg-line-soft text-ink-soft">
                {k.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export function ProgressSteps({ status }: { status: Application["status"] }) {
  if (status === "draft") return null;
  const terminalBad = status === "rejected" || status === "returned";
  const idx = pipelineIndex(status);
  return (
    <Card className="p-5">
      {terminalBad && (
        <div
          className={cn(
            "mb-4 rounded-lg px-3 py-2 text-sm",
            status === "rejected"
              ? "bg-danger-wash text-danger"
              : "bg-warn-wash text-warn"
          )}
        >
          This application is currently <strong>{statusLabel(status)}</strong>.
        </div>
      )}
      <ol className="flex gap-2 overflow-x-auto pb-1">
        {PIPELINE.map((step, i) => {
          const done = idx >= 0 && i < idx;
          const current = idx === i;
          return (
            <li key={step} className="flex min-w-[7.5rem] flex-1 flex-col gap-1.5">
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  done || current ? "bg-gold" : "bg-line"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  current
                    ? "font-semibold text-gold-deep"
                    : done
                    ? "text-ink-soft"
                    : "text-muted"
                )}
              >
                {statusLabel(step)}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export function Timeline({ events }: { events: ApplicationEvent[] }) {
  return (
    <Card>
      <CardHeader title="Activity timeline" />
      {events.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">No activity yet.</p>
      ) : (
        <ol className="space-y-0 px-5 py-4">
          {events.map((e, i) => (
            <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
              {i < events.length - 1 && (
                <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
              )}
              <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gold bg-card" />
              <div className="min-w-0">
                <p className="text-sm text-ink">{e.action}</p>
                <p className="text-xs text-muted">
                  {e.actor?.full_name ?? "System"}
                  {e.actor_role ? ` · ${ROLE_META[e.actor_role].short}` : ""} ·{" "}
                  {formatDateTime(e.created_at)}
                </p>
                {e.note && (
                  <p className="mt-1 rounded-lg bg-parchment px-3 py-1.5 text-xs text-ink-soft">
                    {e.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

const REC_TONE: Record<Recommendation, Tone> = {
  favorable: "ok",
  revise: "warn",
  unfavorable: "danger",
};

export function ReviewsList({
  reviews,
  title = "Reviews",
}: {
  reviews: Review[];
  title?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={`${reviews.length} submitted`} />
      {reviews.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">No reviews submitted yet.</p>
      ) : (
        <ul className="divide-y divide-line-soft">
          {reviews.map((r) => (
            <li key={r.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Avatar name={r.reviewer?.full_name} className="h-6 w-6 text-[0.6rem]" />
                  {r.reviewer?.full_name ?? "Reviewer"}
                </span>
                <div className="flex items-center gap-2">
                  {r.score != null && (
                    <span className="text-xs text-muted">Score {r.score}/100</span>
                  )}
                  {r.recommendation && (
                    <Badge tone={REC_TONE[r.recommendation]}>{r.recommendation}</Badge>
                  )}
                </div>
              </div>
              {(r.strengths || r.weaknesses || r.comments) && (
                <dl className="mt-2 space-y-1.5 text-sm">
                  {r.strengths && (
                    <div>
                      <dt className="text-xs font-medium text-ok">Strengths</dt>
                      <dd className="text-ink-soft">{r.strengths}</dd>
                    </div>
                  )}
                  {r.weaknesses && (
                    <div>
                      <dt className="text-xs font-medium text-danger">Weaknesses</dt>
                      <dd className="text-ink-soft">{r.weaknesses}</dd>
                    </div>
                  )}
                  {r.comments && (
                    <div>
                      <dt className="text-xs font-medium text-muted">Comments</dt>
                      <dd className="text-ink-soft">{r.comments}</dd>
                    </div>
                  )}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
