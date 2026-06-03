import { requireRole } from "@/lib/auth";
import { IrasAppDetail } from "@/components/IrasAppDetail";

export default async function IrasAssignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("iras");
  return <IrasAppDetail id={id} backHref="/iras/assign" backLabel="Back to assign experts" />;
}
