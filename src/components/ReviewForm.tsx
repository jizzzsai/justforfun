import { Card, CardHeader, Field, Input, Textarea, buttonClass } from "@/components/ui";

type Action = (formData: FormData) => void | Promise<void>;


export function ReviewForm({
  action,
  appId,
  title = "Submit your review",
}: {
  action: Action;
  appId: string;
  title?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <form action={action} className="space-y-4 p-5">
        <input type="hidden" name="application_id" value={appId} />
        <Field label="Overall score (0–100)">
          <Input name="score" type="number" min={0} max={100} placeholder="e.g. 82" />
        </Field>
        <Field label="Strengths">
          <Textarea name="strengths" rows={2} placeholder="Key strengths of the proposal." />
        </Field>
        <Field label="Weaknesses">
          <Textarea name="weaknesses" rows={2} placeholder="Concerns or weaknesses." />
        </Field>
        <Field label="Comments">
          <Textarea name="comments" rows={3} placeholder="Additional comments for the record." />
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium text-ink-soft">Recommendation</p>
          <div className="flex flex-wrap gap-2">
            <button name="recommendation" value="favorable" className={buttonClass("primary")}>
              Favorable
            </button>
            <button name="recommendation" value="revise" className={buttonClass("secondary")}>
              Revise
            </button>
            <button name="recommendation" value="unfavorable" className={buttonClass("danger")}>
              Unfavorable
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
}
