"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, GraduationCap } from "lucide-react";
import { NAV, ROLE_META } from "@/lib/roles";
import { signOutAction } from "@/lib/auth-actions";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Profile } from "@/lib/types";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = NAV[profile.role];
  const meta = ROLE_META[profile.role];
  const current = [...nav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => pathname.startsWith(n.href));

  return (
    <div className="flex min-h-screen bg-cream">
      {             }
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-parchment transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {           }
        <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
          <Link href={nav[0].href} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base text-ink">AU Research</span>
              <span className="block text-[0.65rem] uppercase tracking-wider text-muted">
                Grant Management
              </span>
            </span>
          </Link>
          <button
            className="text-muted md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {                }
        <div className="px-5 pt-4 pb-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
            {meta.label}
          </p>
        </div>

        {         }
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {nav.map((item) => {
            const active = current?.href === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold-wash text-gold-deep"
                    : "text-ink-soft hover:bg-line-soft"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {          }
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar name={profile.full_name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {profile.full_name}
              </p>
              <p className="truncate text-xs text-muted">{meta.unit}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-line-soft"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {                    }
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {                 }
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-cream/90 px-4 backdrop-blur md:px-8">
          <button
            className="text-ink-soft md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg text-ink">
            {current?.label ?? meta.label}
          </h2>
          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <span className="text-sm text-muted">Assumption University</span>
            <Avatar name={profile.full_name} className="h-8 w-8" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
