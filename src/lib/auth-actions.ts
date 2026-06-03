"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homeFor, isRole } from "@/lib/roles";

export type SignInState = { error: string | null };

export async function signInAction(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dest = "/";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (data && isRole(data.role)) dest = homeFor(data.role);
  }
  redirect(dest);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
