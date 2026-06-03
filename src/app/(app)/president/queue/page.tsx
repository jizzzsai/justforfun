import { Gavel } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function PresidentQueue() {
  await requireRole("president");
  const apps = await listApplications({ statuses: ["president_review"] });

  return (
    <div className="space-y-6">
      <PageHeader title="Final Approval Queue" subtitle="Expert-reviewed proposals awaiting Presidential decision." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/president/approve"
          showPI
          actionLabel="Decide"
          empty={<EmptyState icon={Gavel} title="Queue is empty" message="No proposals awaiting final approval." />}
        />
      </Card>
    </div>
  );
}
