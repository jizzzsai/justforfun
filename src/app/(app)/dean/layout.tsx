import { requireRole } from "@/lib/auth";

export default async function DeanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("dean");
  return <>{children}</>;
}
