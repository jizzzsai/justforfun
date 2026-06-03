import { requireRole } from "@/lib/auth";
import { DeanAppDetail } from "@/components/DeanAppDetail";

export default async function DeanScreenDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("dean");
  return <DeanAppDetail id={id} backHref="/dean/screen" backLabel="Back to screening queue" />;
}
