import { requireRole } from "@/lib/auth";
import { listAssignmentsForExpert } from "@/lib/queries";
import { PageHeader, Card } from "@/components/ui";
import { AssignmentsTable } from "@/components/AssignmentsTable";

export default async function ExpertAssignments() {
  const profile = await requireRole("expert");
  const assignments = await listAssignmentsForExpert(profile.id);

  return (
    <div className="space-y-6">
      <PageHeader title="My Assignments" subtitle="Proposals assigned to you for expert evaluation." />
      <Card>
        <AssignmentsTable assignments={assignments} />
      </Card>
    </div>
  );
}
