import { requireRole } from "@/lib/auth";
import { listApplications, listReports } from "@/lib/queries";
import { ReportPage } from "@/components/ReportPage";

export default async function ProgressReports() {
  const profile = await requireRole("researcher");
  const apps = await listApplications({
    researcherId: profile.id,
    statuses: ["active", "completed"],
  });
  const reports = await listReports({ researcherId: profile.id, kind: "progress" });
  return <ReportPage kind="progress" apps={apps} reports={reports} />;
}
