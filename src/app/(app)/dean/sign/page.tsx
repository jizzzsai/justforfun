import { PenLine } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function DeanSignQueue() {
  await requireRole("dean");
  const apps = await listApplications({ statuses: ["dean_sign"] });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sign & Forward Queue"
        subtitle="Committee-recommended proposals awaiting your signature for IRAS."
      />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/dean/sign"
          showPI
          actionLabel="Sign"
          empty={
            <EmptyState icon={PenLine} title="Nothing to sign" message="No committee-recommended proposals pending." />
          }
        />
      </Card>
    </div>
  );
}
