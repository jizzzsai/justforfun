import { requireRole } from "@/lib/auth";

export default async function IrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("iras");
  return <>{children}</>;
}
