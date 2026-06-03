import { requireRole } from "@/lib/auth";
import { IrasAppDetail } from "@/components/IrasAppDetail";

export default async function IrasScreenDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("iras");
  return <IrasAppDetail id={id} backHref="/iras/screen" backLabel="Back to office screening" />;
}
