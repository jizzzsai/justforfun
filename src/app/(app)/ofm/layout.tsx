import { requireRole } from "@/lib/auth";

export default async function OfmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ofm");
  return <>{children}</>;
}
