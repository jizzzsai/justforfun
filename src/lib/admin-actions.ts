"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/auth";

async function ensureAdmin() {
  const p = await getProfile();
  if (!p || p.role !== "admin") redirect("/login");
  return p;
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function adminCreateUser(formData: FormData) {
  await ensureAdmin();
  const email = s(formData, "email");
  const password = s(formData, "password") || "123456789";
  const admin = createAdminClient();

  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: s(formData, "full_name"),
      role: s(formData, "role"),
      title: s(formData, "title"),
      faculty: s(formData, "faculty"),
      department: s(formData, "department"),
    },
  });

  revalidatePath("/admin/users");
}

export async function adminUpdateUser(formData: FormData) {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({
      role: s(formData, "role"),
      is_active: s(formData, "is_active") === "true",
    })
    .eq("id", s(formData, "id"));
  revalidatePath("/admin/users");
}

export async function upsertJournalTier(formData: FormData) {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase.from("journal_tiers").upsert(
    {
      code: s(formData, "code").toUpperCase(),
      name: s(formData, "name"),
      indexing: s(formData, "indexing"),
      description: s(formData, "description"),
      max_amount: Number(formData.get("max_amount") ?? 0),
      sort_order: Number(formData.get("sort_order") ?? 0),
    },
    { onConflict: "code" }
  );
  revalidatePath("/admin/journals");
}

export async function updateSetting(formData: FormData) {
  await ensureAdmin();
  const supabase = await createClient();
  const key = s(formData, "key");
  const raw = s(formData, "value");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }
  await supabase
    .from("app_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);
  revalidatePath("/admin/settings");
}
