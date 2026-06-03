import Link from "next/link";
import { ClipboardList, FileCheck2, CalendarClock } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listAssignmentsForExpert } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader } from "@/components/ui";
import { AssignmentsTable } from "@/components/AssignmentsTable";

export default async function ExpertDashboard() {
  const profile = await requireRole("expert");
  const assignments = await listAssignmentsForExpert(profile.id);

  const active = assignments.filter((a) => a.status !== "completed" && a.status !== "declined");
  const completed = assignments.filter((a) => a.status === "completed");
  const weekMs = 7 * 86_400_000;
  const dueSoon = active.filter(
    (a) => a.due_date && new Date(a.due_date).getTime() - Date.now() < weekMs
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Expert Reviewer" subtitle="Evaluate proposals assigned to you by the research office." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active assignments" value={active.length} icon={ClipboardList} tone="info" />
        <StatCard label="Completed reviews" value={completed.length} icon={FileCheck2} tone="ok" />
        <StatCard label="Due this week" value={dueSoon} icon={CalendarClock} tone="warn" />
      </div>

      <Card>
        <CardHeader
          title="Your assignments"
          action={<Link href="/expert/assignments" className="text-sm font-medium text-gold">View all</Link>}
        />
        <AssignmentsTable assignments={active} />
      </Card>
    </div>
  );
}
