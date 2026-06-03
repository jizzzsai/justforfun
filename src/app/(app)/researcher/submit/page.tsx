import { requireRole } from "@/lib/auth";
import { getJournalTiers } from "@/lib/queries";
import { submitApplication } from "@/lib/workflow-actions";
import { PageHeader, Card, CardHeader, Field, Input, Textarea, Select, buttonClass } from "@/components/ui";
import { thb } from "@/lib/format";

export default async function SubmitApplication() {
  await requireRole("researcher");
  const tiers = await getJournalTiers();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Submit Application"
        subtitle="Provide your proposal details. You can save a draft and submit later."
      />

      <form action={submitApplication}>
        <Card>
          <CardHeader title="Proposal" subtitle="Core details of your research project." />
          <div className="space-y-5 p-5">
            <Field label="Project title" required>
              <Input name="title" required placeholder="e.g. Deep Learning for Thai Medical Text" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Research field" required>
                <Input name="field" required placeholder="e.g. Artificial Intelligence" />
              </Field>
              <Field label="Keywords" hint="Comma-separated">
                <Input name="keywords" placeholder="NLP, healthcare, transformers" />
              </Field>
            </div>

            <Field label="Abstract" required>
              <Textarea
                name="abstract"
                required
                rows={5}
                placeholder="Summarise the objectives, methodology and expected outcomes."
              />
            </Field>
          </div>
        </Card>

        <Card className="mt-5">
          <CardHeader title="Funding & target" subtitle="Budget and intended publication tier." />
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Field label="Target journal tier" required>
              <Select name="journal_tier_id" required defaultValue="">
                <option value="" disabled>
                  Select a tier…
                </option>
                {tiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} — {t.name} (max {thb(t.max_amount)})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Target journal / venue">
              <Input name="target_journal" placeholder="e.g. IEEE Access" />
            </Field>
            <Field label="Requested amount (THB)" required>
              <Input name="requested_amount" type="number" min={0} step={1000} required placeholder="120000" />
            </Field>
            <Field label="Duration (months)" required>
              <Input name="duration_months" type="number" min={1} max={48} defaultValue={12} required />
            </Field>
          </div>
        </Card>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button type="submit" name="intent" value="draft" className={buttonClass("secondary")}>
            Save draft
          </button>
          <button type="submit" name="intent" value="submit" className={buttonClass("primary")}>
            Submit to Dean
          </button>
        </div>
      </form>
    </div>
  );
}
