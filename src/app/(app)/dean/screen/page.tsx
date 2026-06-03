import { ClipboardCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function DeanScreenQueue() {
  await requireRole("dean");
  const apps = await listApplications({ statuses: ["submitted"] });

  return (
    <div className="space-y-6">
      <PageHeader
        title="First Screening Queue"
        subtitle="New proposals awaiting the Dean's initial eligibility check."
      />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/dean/screen"
          showPI
          actionLabel="Screen"
          dateField="submitted_at"
          empty={
            <EmptyState icon={ClipboardCheck} title="Queue is empty" message="No new proposals to screen." />
          }
        />
      </Card>
    </div>
  );
}
