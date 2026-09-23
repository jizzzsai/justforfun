# AU Research Grant Management System

AU-RGMS is Assumption University's role-based portal for AU-R3 paper-presentation grants and AU-R4 publication fees and rewards. The production portal is the static React application in `au-rgms/`; Supabase provides authentication, PostgreSQL data, file storage, and row-level security.

## Active roles and workflow

The active roles are Researcher, Dean, IRAS, Finance/OFM, and Administrator.

```text
Researcher submission → Dean Review → IRAS Verification → Finance → Completed
```

- Researchers can create AU-R3 and AU-R4 drafts, submit applications, revise returned applications, view comments and timelines, and use the role-scoped AU AI assistant.
- Deans can access only applications and analytics in their assigned faculty.
- IRAS can verify AU-R3 and AU-R4 applications across all faculties.
- Finance can access only applications forwarded to Finance.
- Administrators manage accounts and university-wide operational analytics.

AU-R1, Faculty Committee, and RASSC are retired from the production portal. Historical database migrations remain in the repository so an existing database can be rebuilt safely; the current policies hide retired data and deactivate retired roles.

## Funding rule

One researcher may have no more than 100,000 THB committed across AU-R3 and AU-R4 in one academic year. Academic years use the `YYYY/YYYY` format. Drafts do not reserve funding; submitted, under-review, approved, Finance, and completed applications do. The database enforces the limit atomically.

## Environment

Copy `.env.example` to `.env.local` and configure the required values. Never commit `.env.local`, the Supabase service-role key, the database password, or the Gemini API key.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<browser-safe-anon-key>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-key>
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
GEMINI_API_KEY=<server-only-key>
```

## Commands

```bash
npm install
npm run lint
npm run build
npm run build:portal
npm run db:push
```

- `npm run build:portal` compiles the portal's JSX source into browser-ready JavaScript. Run it whenever a file in `au-rgms/frontend/*.jsx` changes.
- `npm run db:push` applies the ordered SQL migrations in `supabase/migrations/`.
- `npm run build` verifies the repository's Next.js application and TypeScript code.

## Production portal structure

```text
au-rgms/
  api/                  # authenticated Vercel API functions, including AU AI
  database/             # browser database/authentication client
  frontend/             # JSX source, compiled JavaScript, and CSS
  index.html            # production entry point
  vercel.json           # security headers and deployment configuration
supabase/migrations/    # schema, RLS, workflow, and security migrations
scripts/                # database and static-portal build utilities
```

The portal is deployed with Vercel. Keep `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, and `GEMINI_API_KEY` server-side only.
