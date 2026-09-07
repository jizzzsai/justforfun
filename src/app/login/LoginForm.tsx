"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { signInAction, type SignInState } from "@/lib/auth-actions";
import { Field, Input, buttonClass } from "@/components/ui";

const DEMO_PASSWORD = "123456789";
const DEMO_ACCOUNTS: { role: string; email: string }[] = [
  { role: "Researcher", email: "vmesresearcher@au.edu" },
  { role: "Dean", email: "vmesdean@au.edu" },
  { role: "Committee", email: "vmescommittee@au.edu" },
  { role: "RASSC", email: "rassc@au.edu" },
  { role: "OFM", email: "finance@au.edu" },
  { role: "Admin", email: "admin@au.edu" },
];

export function LoginForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signInAction,
    { error: null }
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <Field label="University email" required>
          <Input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="you@au.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password" required>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {state.error && (
          <p className="rounded-lg bg-danger-wash px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary", "md") + " w-full"}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {                                }
      <div className="mt-8 rounded-xl border border-line bg-parchment p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          Demo accounts
        </p>
        <p className="mt-1 text-xs text-muted">
          Click a role to fill the form. Password:{" "}
          <code className="rounded bg-card px-1 py-0.5 text-ink">
            {DEMO_PASSWORD}
          </code>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => {
                setEmail(a.email);
                setPassword(DEMO_PASSWORD);
              }}
              className="rounded-lg border border-line bg-card px-3 py-2 text-left text-xs transition-colors hover:border-gold hover:bg-gold-wash"
            >
              <span className="block font-semibold text-ink">{a.role}</span>
              <span className="block truncate text-muted">{a.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
