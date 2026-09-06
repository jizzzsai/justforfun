import { Card, CardHeader, Field, Textarea, buttonClass } from "@/components/ui";

type Action = (formData: FormData) => void | Promise<void>;


export function ScreeningPanel({
  action,
  appId,
  title = "Screening decision",
}: {
  action: Action;
  appId: string;
  title?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <form action={action} className="space-y-3 p-5">
        <input type="hidden" name="application_id" value={appId} />
        <Field label="Notes / comments">
          <Textarea name="notes" rows={3} placeholder="Optional notes for the record." />
        </Field>
        <div className="flex flex-wrap gap-2">
          <button name="decision" value="pass" className={buttonClass("primary")}>
            Pass
          </button>
          <button name="decision" value="return" className={buttonClass("secondary")}>
            Return
          </button>
          <button name="decision" value="fail" className={buttonClass("danger")}>
            Reject
          </button>
        </div>
      </form>
    </Card>
  );
}


export function ForwardPanel({
  action,
  appId,
  title = "Sign & forward",
  submitLabel = "Sign & forward to IRAS",
}: {
  action: Action;
  appId: string;
  title?: string;
  submitLabel?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <form action={action} className="space-y-3 p-5">
        <input type="hidden" name="application_id" value={appId} />
        <Field label="Endorsement note">
          <Textarea name="notes" rows={3} placeholder="Add an endorsement note." />
        </Field>
        <button type="submit" className={buttonClass("primary") + " w-full"}>
          {submitLabel}
        </button>
      </form>
    </Card>
  );
}
