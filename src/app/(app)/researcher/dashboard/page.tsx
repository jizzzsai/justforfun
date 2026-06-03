import Link from "next/link";
import { FilePlus2, FileText, Hourglass, BadgeCheck, Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader, buttonClass, Badge } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { thbCompact } from "@/lib/format";

export default async function ResearcherDashboard() {
  const profile = await requireRole("researcher");
  const apps = await listApplications({ researcherId: profile.id });

  const inReview = apps.filter(
    (a) => !["draft", "rejected", "completed", "active", "returned"].includes(a.status)
  ).length;
  const active = apps.filter((a) => a.status === "active").length;
  const funded = apps
    .filter((a) => ["active", "completed"].includes(a.status))
    .reduce((s, a) => s + (a.approved_amount ?? 0), 0);
  const returned = apps.filter((a) => a.status === "returned");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile.full_name.split(" ").slice(-1)[0]}`}
        subtitle="Your research grant applications at a glance."
      >
        <Link href="/researcher/submit" className={buttonClass("primary")}>
          <FilePlus2 className="h-4 w-4" />
          New application
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total applications" value={apps.length} icon={FileText} tone="gold" />
        <StatCard label="Under review" value={inReview} icon={Hourglass} tone="info" />
        <StatCard label="Active grants" value={active} icon={BadgeCheck} tone="ok" />
        <StatCard label="Funding secured" value={thbCompact(funded)} icon={Wallet} tone="gold" />
      </div>

      {returned.length > 0 && (
        <Card className="border-warn/40 bg-warn-wash/40 p-4">
          <p className="text-sm text-ink">
            <Badge tone="warn">Action needed</Badge>{" "}
            <span className="ml-1">
              {returned.length} application{returned.length > 1 ? "s" : ""} returned for
              revision.
            </span>
          </p>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Recent applications"
          action={
            <Link href="/researcher/applications" className="text-sm font-medium text-gold">
              View all
            </Link>
          }
        />
        <ApplicationsTable
          applications={apps.slice(0, 6)}
          hrefBase="/researcher/applications"
          empty={
            <p className="px-1 py-8 text-center text-sm text-muted">
              No applications yet. Start by submitting one.
            </p>
          }
        />
      </Card>
    </div>
  );
}
