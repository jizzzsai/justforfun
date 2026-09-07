import { History } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function DeanHistory() {
  await requireRole("dean");
  const apps = await listApplications({
    statuses: [
      "committee_review",
      "iras_review",
      "approved",
      "active",
      "completed",
      "rejected",
      "returned",
    ],
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Decision History" subtitle="Proposals that have passed through the Dean's office." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/dean/screen"
          showPI
          actionLabel="View"
          empty={<EmptyState icon={History} title="No history yet" message="Decisions you make will appear here." />}
        />
      </Card>
    </div>
  );
}
