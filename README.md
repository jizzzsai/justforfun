# AU Research Grant Management System

A full-stack portal for **Assumption University**'s research grant lifecycle —
from proposal submission through multi-stage review, Presidential approval,
contract issuance and 30 / 40 / 30 disbursement.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Supabase** (Postgres + Auth + RLS). The design recreates the original AU
prototype: a warm cream canvas, brown/gold accent, Newsreader + Inter type.

## Roles & workflow

```
Researcher → Dean (first screening) → Faculty Committee → Dean (sign & forward)
→ IRAS (office screening + assign experts) → Expert Reviewers
→ President (approve + issue contract) → OFM (30/40/30 disbursement)
```

Plus an **Administrator** for users, journal tiers, audit log and settings.
There are 8 roles and ~40 screens; access is role-gated by the proxy + per-role
layouts, enforced again at the database with Row Level Security.

## Getting started

### 1. Environment

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...      # browser-safe (Settings → API)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...               # server only — never commit
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres
SUPABASE_PROJECT_REF=<ref>
```

`.env.local` is gitignored. **Never commit the service-role key.**

### 2. Install & provision the database

```bash
npm install
npm run db:push     # applies supabase/migrations/*.sql (schema + RLS + reference data)
npm run db:seed     # creates demo users + sample applications across every stage
```

> `db:push` needs `SUPABASE_DB_URL` with the real password. Alternatively paste
> the files in `supabase/migrations/` into the Supabase SQL editor in order.
> `db:seed` only needs the URL + service-role key.

### 3. Run

```bash
npm run dev         # http://localhost:3000
```

## Demo accounts

All demo accounts use the password **`AuResearch#2026`**:

| Role        | Email                |
|-------------|----------------------|
| Researcher  | `somchai.r@au.edu`   |
| Dean        | `dean.sci@au.edu`    |
| Committee   | `comm.chair@au.edu`  |
| IRAS        | `iras.office@au.edu` |
| Expert      | `expert.ml@au.edu`   |
| President   | `president@au.edu`   |
| OFM         | `finance@au.edu`     |
| Admin       | `admin@au.edu`       |

The login screen has one-click quick-fill buttons for each role.

## Scripts

| Command          | Description                                            |
|------------------|--------------------------------------------------------|
| `npm run dev`    | Start the dev server                                   |
| `npm run build`  | Production build                                       |
| `npm run db:push`| Apply SQL migrations over a direct Postgres connection |
| `npm run db:seed`| Seed demo users + sample data (service role)           |

## Project structure

```
src/
  app/
    login/                 # AU-branded sign-in
    (app)/                 # authenticated shell (sidebar + topbar)
      researcher/ dean/ committee/ iras/ expert/ president/ ofm/ admin/
  components/              # UI kit + shared detail/table components
  lib/
    supabase/              # browser / server / admin clients + session refresh
    queries.ts             # data access
    workflow-actions.ts    # state-transition server actions
    admin-actions.ts       # admin server actions
    roles.ts  workflow.ts  types.ts  format.ts  auth.ts
  proxy.ts                 # route protection + auth cookie refresh
supabase/migrations/       # schema, RLS, reference data
scripts/                   # apply-sql.mjs, seed.mjs
reference/                 # original AU prototype HTML (design reference)
```

## Deploy

Deploys cleanly to **Vercel**. Set the same environment variables in the project
settings (the `NEXT_PUBLIC_*` ones are exposed to the browser; keep
`SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_DB_URL` server-side only).
