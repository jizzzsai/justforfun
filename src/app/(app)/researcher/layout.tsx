import { requireRole } from "@/lib/auth";

export default async function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("researcher");
  return <>{children}</>;
}
