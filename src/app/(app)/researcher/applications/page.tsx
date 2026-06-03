import Link from "next/link";
import { FilePlus2, FileText } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listApplications } from "@/lib/queries";
import { PageHeader, Card, buttonClass, EmptyState } from "@/components/ui";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function MyApplications() {
  const profile = await requireRole("researcher");
  const apps = await listApplications({ researcherId: profile.id });

  return (
    <div className="space-y-6">
      <PageHeader title="My Applications" subtitle="Every proposal you have created.">
        <Link href="/researcher/submit" className={buttonClass("primary")}>
          <FilePlus2 className="h-4 w-4" />
          New application
        </Link>
      </PageHeader>

      <Card>
        <ApplicationsTable
          applications={apps}
          hrefBase="/researcher/applications"
          empty={
            <EmptyState
              icon={FileText}
              title="No applications yet"
              message="Submit your first grant application to get started."
              action={
                <Link href="/researcher/submit" className={buttonClass("primary", "sm")}>
                  Submit application
                </Link>
              }
            />
          }
        />
      </Card>
    </div>
  );
}
