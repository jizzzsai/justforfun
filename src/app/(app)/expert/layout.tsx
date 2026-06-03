import { requireRole } from "@/lib/auth";

export default async function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("expert");
  return <>{children}</>;
}
