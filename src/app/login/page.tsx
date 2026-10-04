import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getProfile } from "@/lib/auth";
import { homeFor } from "@/lib/roles";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const profile = await getProfile();
  if (profile) redirect(homeFor(profile.role));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {                 }
      <div className="relative hidden flex-col justify-between bg-gold p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg">Assumption University</p>
            <p className="text-sm text-white/70">Research Grant Management</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="font-display text-4xl leading-tight">
            From proposal to disbursement, in one portal.
          </h1>
          <p className="mt-4 text-white/80">
            Submit applications, complete Dean, Committee and RASSC review,
            and track Academic disbursements from one portal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-white/70">
          {[
            "Researcher",
            "Dean",
            "Committee",
            "IRAS",
            "Academic",
            "Admin",
          ].map((r) => (
            <span
              key={r}
              className="rounded-full border border-white/25 px-3 py-1"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {                }
      <div className="flex items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-base text-ink">AU Research</p>
                <p className="text-xs text-muted">Grant Management</p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-2xl text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-muted">
            Use your university account to continue.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
