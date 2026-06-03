import { requireRole } from "@/lib/auth";
import { listAllProfiles } from "@/lib/queries";
import { adminCreateUser, adminUpdateUser } from "@/lib/admin-actions";
import {
  PageHeader, Card, CardHeader, DataTable, Avatar, Badge, Field, Input, Select, buttonClass, type Column,
} from "@/components/ui";
import { ROLES, ROLE_META } from "@/lib/roles";
import type { Profile } from "@/lib/types";

export default async function AdminUsers() {
  await requireRole("admin");
  const profiles = await listAllProfiles();

  const columns: Column<Profile>[] = [
    {
      header: "User",
      cell: (p) => (
        <span className="flex items-center gap-2">
          <Avatar name={p.full_name} className="h-7 w-7 text-[0.6rem]" />
          <span>
            <span className="block font-medium text-ink">{p.full_name}</span>
            <span className="block text-xs text-muted">{p.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Faculty", cell: (p) => <span className="text-muted">{p.faculty ?? "—"}</span> },
    {
      header: "Status",
      cell: (p) => <Badge tone={p.is_active ? "ok" : "neutral"}>{p.is_active ? "active" : "inactive"}</Badge>,
    },
    {
      header: "Manage",
      className: "text-right",
      cell: (p) => (
        <form action={adminUpdateUser} className="flex items-center justify-end gap-2">
          <input type="hidden" name="id" value={p.id} />
          <Select name="role" defaultValue={p.role} className="h-8 w-auto py-1 text-xs">
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_META[r].short}
              </option>
            ))}
          </Select>
          <Select name="is_active" defaultValue={String(p.is_active)} className="h-8 w-auto py-1 text-xs">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
          <button type="submit" className={buttonClass("secondary", "sm")}>
            Save
          </button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="Provision accounts and assign roles." />

      <Card>
        <CardHeader title="Add user" subtitle="Creates an account with a confirmed email." />
        <form action={adminCreateUser} className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Full name" required>
            <Input name="full_name" required placeholder="Dr. Jane Doe" />
          </Field>
          <Field label="Email" required>
            <Input name="email" type="email" required placeholder="jane@au.edu" />
          </Field>
          <Field label="Role" required>
            <Select name="role" required defaultValue="researcher">
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_META[r].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Temporary password" hint="Defaults to AuResearch#2026">
            <Input name="password" placeholder="AuResearch#2026" />
          </Field>
          <Field label="Title">
            <Input name="title" placeholder="Dr. / Assoc. Prof." />
          </Field>
          <Field label="Faculty">
            <Input name="faculty" placeholder="Science & Technology" />
          </Field>
          <Field label="Department">
            <Input name="department" placeholder="Computer Science" />
          </Field>
          <Field label="Expertise (experts)">
            <Input name="expertise" placeholder="Machine Learning, NLP" />
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass("primary")}>
              Create user
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="All users" subtitle={`${profiles.length} accounts`} />
        <DataTable columns={columns} rows={profiles} />
      </Card>
    </div>
  );
}
