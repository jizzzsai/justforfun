import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateSetting } from "@/lib/admin-actions";
import { PageHeader, Card, CardHeader, Input, buttonClass, EmptyState } from "@/components/ui";
import type { AppSetting } from "@/lib/types";

export default async function AdminSettings() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data } = await supabase.from("app_settings").select("*").order("key");
  const settings = (data ?? []) as AppSetting[];

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" subtitle="Organisation-wide configuration values." />

      <Card>
        <CardHeader title="Settings" subtitle="Values are stored as JSON." />
        {settings.length === 0 ? (
          <EmptyState title="No settings" message="Run the reference migration to seed defaults." />
        ) : (
          <ul className="divide-y divide-line-soft">
            {settings.map((setting) => (
              <li key={setting.key} className="px-5 py-4">
                <form action={updateSetting} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <input type="hidden" name="key" value={setting.key} />
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-ink">
                      {setting.label ?? setting.key}
                      <span className="ml-2 text-xs font-normal text-muted">{setting.key}</span>
                    </label>
                    <Input name="value" defaultValue={JSON.stringify(setting.value)} />
                  </div>
                  <button type="submit" className={buttonClass("secondary")}>
                    Save
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
