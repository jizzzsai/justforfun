import { UserPlus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function IrasAssign() {
  await requireRole("iras");
  const apps = await listApplications({ statuses: ["iras_review"] });

  return (
    <div className="space-y-6">
      <PageHeader title="Assign Experts" subtitle="Allocate expert reviewers to screened proposals." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/iras/assign"
          showPI
          actionLabel="Assign"
          empty={<EmptyState icon={UserPlus} title="Nothing to assign" message="No proposals ready for expert assignment." />}
        />
      </Card>
    </div>
  );
}
