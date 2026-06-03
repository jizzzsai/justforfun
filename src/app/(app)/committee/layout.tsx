import { requireRole } from "@/lib/auth";

export default async function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("committee");
  return <>{children}</>;
}
