import { Users, FileText, BadgeCheck, CircleDollarSign } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { listAllProfiles, statusCounts, listContracts } from "@/lib/queries";
import { PageHeader, StatCard, Card, CardHeader, Badge } from "@/components/ui";
import { STATUS, type AppStatus } from "@/lib/workflow";
import { ROLE_META, type Role } from "@/lib/roles";
import { thbCompact } from "@/lib/format";

const STAGE_ORDER: AppStatus[] = [
  "draft", "submitted", "committee_review", "dean_sign", "iras_review",
  "expert_review", "president_review", "active", "completed", "rejected", "returned",
];

export default async function AdminDashboard() {
  await requireRole("admin");
  const [profiles, counts, contracts] = await Promise.all([
    listAllProfiles(),
    statusCounts(),
    listContracts(),
  ]);

  const totalApps = Object.values(counts).reduce((a, b) => a + b, 0);
  const committed = contracts.reduce((sum, c) => sum + c.amount, 0);

  const roleCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.role] = (acc[p.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Administrator" subtitle="System overview, users and configuration." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={profiles.length} icon={Users} tone="gold" />
        <StatCard label="Applications" value={totalApps} icon={FileText} tone="info" />
        <StatCard label="Active grants" value={counts.active ?? 0} icon={BadgeCheck} tone="ok" />
        <StatCard label="Committed funding" value={thbCompact(committed)} icon={CircleDollarSign} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Applications by stage" />
          <ul className="divide-y divide-line-soft">
            {STAGE_ORDER.filter((st) => counts[st]).map((st) => (
              <li key={st} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <Badge tone={STATUS[st].tone}>{STATUS[st].label}</Badge>
                </span>
                <span className="font-medium tabular-nums text-ink">{counts[st]}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Users by role" subtitle={`${profiles.length} total`} />
          <ul className="divide-y divide-line-soft">
            {(Object.keys(ROLE_META) as Role[]).map((r) => (
              <li key={r} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span className="text-ink-soft">{ROLE_META[r].label}</span>
                <span className="font-medium tabular-nums text-ink">{roleCounts[r] ?? 0}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
