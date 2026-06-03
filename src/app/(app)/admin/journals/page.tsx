import { requireRole } from "@/lib/auth";
import { getJournalTiers } from "@/lib/queries";
import { upsertJournalTier } from "@/lib/admin-actions";
import {
  PageHeader, Card, CardHeader, DataTable, Field, Input, buttonClass, type Column,
} from "@/components/ui";
import { thb } from "@/lib/format";
import type { JournalTier } from "@/lib/types";

export default async function AdminJournals() {
  await requireRole("admin");
  const tiers = await getJournalTiers();

  const columns: Column<JournalTier>[] = [
    { header: "Code", cell: (t) => <span className="font-medium text-ink">{t.code}</span> },
    { header: "Name", cell: (t) => t.name },
    { header: "Indexing", cell: (t) => <span className="text-muted">{t.indexing ?? "—"}</span> },
    { header: "Max amount", cell: (t) => thb(t.max_amount), className: "tabular-nums" },
    { header: "Order", cell: (t) => t.sort_order },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Journal Tier Reference" subtitle="Funding caps per publication tier." />

      <Card>
        <CardHeader title="Tiers" />
        <DataTable columns={columns} rows={tiers} />
      </Card>

      <Card>
        <CardHeader title="Add / update tier" subtitle="Entering an existing code updates it." />
        <form action={upsertJournalTier} className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Code" required>
            <Input name="code" required placeholder="Q1" />
          </Field>
          <Field label="Name" required>
            <Input name="name" required placeholder="Quartile 1" />
          </Field>
          <Field label="Indexing">
            <Input name="indexing" placeholder="Scopus / Web of Science (Q1)" />
          </Field>
          <Field label="Max amount (THB)" required>
            <Input name="max_amount" type="number" min={0} step={1000} required placeholder="150000" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Input name="description" placeholder="Top-quartile international journal" />
          </Field>
          <Field label="Sort order">
            <Input name="sort_order" type="number" defaultValue={tiers.length + 1} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={buttonClass("primary")}>
              Save tier
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
