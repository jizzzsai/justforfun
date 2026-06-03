import { requireRole } from "@/lib/auth";

export default async function PresidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("president");
  return <>{children}</>;
}
