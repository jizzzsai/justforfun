import { ListChecks } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function CommitteeQueue() {
  await requireRole("committee");
  const apps = await listApplications({ statuses: ["committee_review"] });

  return (
    <div className="space-y-6">
      <PageHeader title="Review Queue" subtitle="Proposals awaiting the committee's scholarly review." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/committee/review"
          showPI
          actionLabel="Review"
          empty={<EmptyState icon={ListChecks} title="Queue is empty" message="No proposals to review right now." />}
        />
      </Card>
    </div>
  );
}
