import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { homeFor } from "@/lib/roles";

export default async function Home() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  redirect(homeFor(profile.role));
}
