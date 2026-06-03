import { Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function IrasReceived() {
  await requireRole("iras");
  const apps = await listApplications({ statuses: ["iras_review"] });

  return (
    <div className="space-y-6">
      <PageHeader title="Received from Dean" subtitle="Proposals signed and forwarded by the Dean's office." />
      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/iras/screen"
          showPI
          actionLabel="Process"
          empty={<EmptyState icon={Inbox} title="Inbox empty" message="No forwarded proposals at the moment." />}
        />
      </Card>
    </div>
  );
}
