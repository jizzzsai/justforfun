"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { signInAction, type SignInState } from "@/lib/auth-actions";
import { Field, Input, buttonClass } from "@/components/ui";

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
    </div>
  );
}
