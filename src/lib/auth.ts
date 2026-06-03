import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { homeFor, type Role } from "./roles";
import type { Profile } from "./types";

/** Current signed-in profile, or null. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

/** Require a signed-in profile or redirect to /login. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return profile;
}

/** Require a specific role; otherwise bounce to the user's own home. */
export async function requireRole(role: Role): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== role) redirect(homeFor(profile.role));
  return profile;
}
