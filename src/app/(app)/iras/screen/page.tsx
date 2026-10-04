import { ClipboardCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function IrasScreen() {
  await requireRole("iras");
  const apps = await listApplications({ statuses: ["iras_review"] });

  return (
    <div className="space-y-6">
      <PageHeader title="Office Screening" subtitle="Verify documentation and send eligible grants to Academic." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/iras/screen"
          showPI
          actionLabel="Screen"
          empty={<EmptyState icon={ClipboardCheck} title="Nothing to screen" message="No proposals awaiting office screening." />}
        />
      </Card>
    </div>
  );
}
