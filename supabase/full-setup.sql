-- ============================================================
-- AU Research Grant Management System — schema
-- Project: kmseaoipvjhgznswbmlt
-- ============================================================

-- ---------- enums ----------
do $$ begin
  create type user_role as enum
    ('researcher','dean','committee','iras','expert','president','ofm','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_status as enum
    ('draft','submitted','committee_review','dean_sign','iras_review',
     'expert_review','president_review','approved','active','completed',
     'rejected','returned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_kind as enum ('committee','expert');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recommendation as enum ('favorable','unfavorable','revise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_kind as enum ('dean_first','dean_sign','iras_office');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_decision as enum ('pass','fail','return');
exception when duplicate_object then null; end $$;

do $$ begin
  create type assignment_status as enum ('pending','accepted','declined','completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_kind as enum ('progress','final');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('submitted','accepted','revise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending','scheduled','paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contract_status as enum ('issued','active','completed','terminated');
exception when duplicate_object then null; end $$;

-- ---------- profiles ----------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  role        user_role not null default 'researcher',
  title       text,
  faculty     text,
  department  text,
  phone       text,
  expertise   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- journal tiers (reference) ----------
create table if not exists journal_tiers (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  indexing    text,
  description text,
  max_amount  numeric(12,2) not null default 0,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- applications ----------
create table if not exists applications (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  researcher_id    uuid not null references profiles(id) on delete cascade,
  title            text not null,
  abstract         text,
  faculty          text,
  department       text,
  field            text,
  keywords         text,
  journal_tier_id  uuid references journal_tiers(id),
  target_journal   text,
  requested_amount numeric(12,2) not null default 0,
  approved_amount  numeric(12,2),
  duration_months  int not null default 12,
  status           app_status not null default 'draft',
  submitted_at     timestamptz,
  decided_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_applications_researcher on applications(researcher_id);
create index if not exists idx_applications_status on applications(status);

-- ---------- documents ----------
create table if not exists application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  name           text not null,
  doc_type       text,
  storage_path   text,
  uploaded_by    uuid references profiles(id),
  created_at     timestamptz not null default now()
);

-- ---------- screenings (dean first / dean sign / iras office) ----------
create table if not exists screenings (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  kind           screening_kind not null,
  screener_id    uuid references profiles(id),
  decision       screening_decision not null,
  notes          text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_screenings_app on screenings(application_id);

-- ---------- reviews (committee + expert) ----------
create table if not exists reviews (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  kind           review_kind not null,
  reviewer_id    uuid references profiles(id),
  recommendation recommendation,
  score          int,
  strengths      text,
  weaknesses     text,
  comments       text,
  submitted_at   timestamptz not null default now()
);
create index if not exists idx_reviews_app on reviews(application_id);

-- ---------- expert assignments ----------
create table if not exists expert_assignments (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  expert_id      uuid not null references profiles(id) on delete cascade,
  assigned_by    uuid references profiles(id),
  status         assignment_status not null default 'pending',
  due_date       date,
  created_at     timestamptz not null default now(),
  unique (application_id, expert_id)
);
create index if not exists idx_assignments_expert on expert_assignments(expert_id, status);

-- ---------- approvals (president) ----------
create table if not exists approvals (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references applications(id) on delete cascade,
  president_id    uuid references profiles(id),
  approved        boolean not null,
  approved_amount numeric(12,2),
  conditions      text,
  created_at      timestamptz not null default now()
);

-- ---------- contracts ----------
create table if not exists contracts (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references applications(id) on delete cascade,
  contract_no    text not null unique,
  amount         numeric(12,2) not null,
  start_date     date,
  end_date       date,
  status         contract_status not null default 'issued',
  issued_by      uuid references profiles(id),
  issued_at      timestamptz not null default now()
);

-- ---------- payments (30 / 40 / 30) ----------
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  contract_id    uuid references contracts(id) on delete cascade,
  instalment     int not null,
  pct            int not null,
  amount         numeric(12,2) not null,
  trigger        text,
  status         payment_status not null default 'pending',
  due_date       date,
  paid_at        timestamptz,
  processed_by   uuid references profiles(id),
  created_at     timestamptz not null default now()
);
create index if not exists idx_payments_app on payments(application_id);
create index if not exists idx_payments_status on payments(status);

-- ---------- reports (progress / final) ----------
create table if not exists reports (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  kind           report_kind not null,
  summary        text,
  storage_path   text,
  status         report_status not null default 'submitted',
  reviewed_by    uuid references profiles(id),
  submitted_at   timestamptz not null default now(),
  reviewed_at    timestamptz
);

-- ---------- application events (timeline) ----------
create table if not exists application_events (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  actor_id       uuid references profiles(id),
  actor_role     user_role,
  action         text not null,
  from_status    app_status,
  to_status      app_status,
  note           text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_events_app on application_events(application_id, created_at);

-- ---------- audit log ----------
create table if not exists audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references profiles(id),
  actor_role user_role,
  action     text not null,
  entity     text,
  entity_id  text,
  detail     jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on audit_log(created_at desc);

-- ---------- settings ----------
create table if not exists app_settings (
  key        text primary key,
  value      jsonb not null,
  label      text,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id)
);

-- ============================================================
-- helper functions
-- ============================================================
create or replace function public.app_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role <> 'researcher');
$$;

create or replace function public.owns_app(app uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.applications a where a.id = app and a.researcher_id = auth.uid());
$$;

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists applications_touch on applications;
create trigger applications_touch before update on applications
  for each row execute function public.touch_updated_at();

-- auto-provision a profile when an auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, title, faculty, department)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'role','')::user_role, 'researcher'),
    new.raw_user_meta_data->>'title',
    new.raw_user_meta_data->>'faculty',
    new.raw_user_meta_data->>'department'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
-- ============================================================
-- Row Level Security. Service role bypasses all of this (used by
-- the seed script + trusted server actions).
-- ============================================================

alter table profiles             enable row level security;
alter table journal_tiers        enable row level security;
alter table applications         enable row level security;
alter table application_documents enable row level security;
alter table screenings           enable row level security;
alter table reviews              enable row level security;
alter table expert_assignments   enable row level security;
alter table approvals            enable row level security;
alter table contracts            enable row level security;
alter table payments             enable row level security;
alter table reports              enable row level security;
alter table application_events   enable row level security;
alter table audit_log            enable row level security;
alter table app_settings         enable row level security;

-- ---------- profiles ----------
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select to authenticated using (true);

drop policy if exists profiles_write on profiles;
create policy profiles_write on profiles for update to authenticated
  using (id = auth.uid() or is_admin()) with check (id = auth.uid() or is_admin());

drop policy if exists profiles_insert on profiles;
create policy profiles_insert on profiles for insert to authenticated
  with check (id = auth.uid() or is_admin());

-- ---------- journal_tiers ----------
drop policy if exists tiers_read on journal_tiers;
create policy tiers_read on journal_tiers for select to authenticated using (true);

drop policy if exists tiers_admin on journal_tiers;
create policy tiers_admin on journal_tiers for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---------- applications ----------
drop policy if exists apps_read on applications;
create policy apps_read on applications for select to authenticated
  using (researcher_id = auth.uid() or is_staff());

drop policy if exists apps_insert on applications;
create policy apps_insert on applications for insert to authenticated
  with check (researcher_id = auth.uid() or is_admin());

drop policy if exists apps_update on applications;
create policy apps_update on applications for update to authenticated
  using (
    (researcher_id = auth.uid() and status in ('draft','returned'))
    or app_role() in ('dean','committee','iras','expert','president','ofm','admin')
  )
  with check (
    (researcher_id = auth.uid())
    or app_role() in ('dean','committee','iras','expert','president','ofm','admin')
  );

drop policy if exists apps_delete on applications;
create policy apps_delete on applications for delete to authenticated
  using ((researcher_id = auth.uid() and status = 'draft') or is_admin());

-- ---------- application_documents ----------
drop policy if exists docs_read on application_documents;
create policy docs_read on application_documents for select to authenticated
  using (is_staff() or owns_app(application_id));

drop policy if exists docs_write on application_documents;
create policy docs_write on application_documents for all to authenticated
  using (owns_app(application_id) or is_staff())
  with check (owns_app(application_id) or is_staff());

-- ---------- screenings ----------
drop policy if exists screen_read on screenings;
create policy screen_read on screenings for select to authenticated using (is_staff());

drop policy if exists screen_write on screenings;
create policy screen_write on screenings for insert to authenticated
  with check (app_role() in ('dean','iras','admin'));

-- ---------- reviews ----------
drop policy if exists reviews_read on reviews;
create policy reviews_read on reviews for select to authenticated using (is_staff());

drop policy if exists reviews_insert on reviews;
create policy reviews_insert on reviews for insert to authenticated
  with check (app_role() in ('committee','expert','admin') and (reviewer_id = auth.uid() or is_admin()));

drop policy if exists reviews_update on reviews;
create policy reviews_update on reviews for update to authenticated
  using (reviewer_id = auth.uid() or is_admin())
  with check (reviewer_id = auth.uid() or is_admin());

-- ---------- expert_assignments ----------
drop policy if exists assign_read on expert_assignments;
create policy assign_read on expert_assignments for select to authenticated
  using (is_staff() or expert_id = auth.uid());

drop policy if exists assign_insert on expert_assignments;
create policy assign_insert on expert_assignments for insert to authenticated
  with check (app_role() in ('iras','admin'));

drop policy if exists assign_update on expert_assignments;
create policy assign_update on expert_assignments for update to authenticated
  using (expert_id = auth.uid() or app_role() in ('iras','admin'))
  with check (expert_id = auth.uid() or app_role() in ('iras','admin'));

-- ---------- approvals ----------
drop policy if exists appr_read on approvals;
create policy appr_read on approvals for select to authenticated using (is_staff());

drop policy if exists appr_insert on approvals;
create policy appr_insert on approvals for insert to authenticated
  with check (app_role() in ('president','admin'));

-- ---------- contracts ----------
drop policy if exists contracts_read on contracts;
create policy contracts_read on contracts for select to authenticated
  using (is_staff() or owns_app(application_id));

drop policy if exists contracts_write on contracts;
create policy contracts_write on contracts for all to authenticated
  using (app_role() in ('president','ofm','admin'))
  with check (app_role() in ('president','ofm','admin'));

-- ---------- payments ----------
drop policy if exists pay_read on payments;
create policy pay_read on payments for select to authenticated
  using (is_staff() or owns_app(application_id));

drop policy if exists pay_write on payments;
create policy pay_write on payments for all to authenticated
  using (app_role() in ('ofm','admin'))
  with check (app_role() in ('ofm','admin'));

-- ---------- reports ----------
drop policy if exists reports_read on reports;
create policy reports_read on reports for select to authenticated
  using (is_staff() or owns_app(application_id));

drop policy if exists reports_insert on reports;
create policy reports_insert on reports for insert to authenticated
  with check (owns_app(application_id) or is_admin());

drop policy if exists reports_update on reports;
create policy reports_update on reports for update to authenticated
  using (owns_app(application_id) or app_role() in ('iras','committee','president','admin'))
  with check (owns_app(application_id) or app_role() in ('iras','committee','president','admin'));

-- ---------- application_events ----------
drop policy if exists events_read on application_events;
create policy events_read on application_events for select to authenticated
  using (is_staff() or owns_app(application_id));

drop policy if exists events_insert on application_events;
create policy events_insert on application_events for insert to authenticated
  with check (actor_id = auth.uid() or actor_id is null or is_staff());

-- ---------- audit_log ----------
drop policy if exists audit_read on audit_log;
create policy audit_read on audit_log for select to authenticated using (is_admin());

drop policy if exists audit_insert on audit_log;
create policy audit_insert on audit_log for insert to authenticated
  with check (auth.uid() is not null);

-- ---------- app_settings ----------
drop policy if exists settings_read on app_settings;
create policy settings_read on app_settings for select to authenticated
  using (auth.uid() is not null);

drop policy if exists settings_write on app_settings;
create policy settings_write on app_settings for all to authenticated
  using (is_admin()) with check (is_admin());
-- ============================================================
-- Reference data: journal tiers + system settings (idempotent)
-- ============================================================

insert into journal_tiers (code, name, indexing, description, max_amount, sort_order) values
  ('Q1',   'Quartile 1',         'Scopus / Web of Science (Q1)',  'Top-quartile international journal',          150000, 1),
  ('Q2',   'Quartile 2',         'Scopus / Web of Science (Q2)',  'Second-quartile international journal',       120000, 2),
  ('Q3',   'Quartile 3',         'Scopus / Web of Science (Q3)',  'Third-quartile international journal',         90000, 3),
  ('Q4',   'Quartile 4',         'Scopus / Web of Science (Q4)',  'Fourth-quartile international journal',        70000, 4),
  ('TCI1', 'TCI Tier 1',         'Thai-Journal Citation Index (Tier 1)', 'National journal, TCI tier 1',         50000, 5),
  ('TCI2', 'TCI Tier 2',         'Thai-Journal Citation Index (Tier 2)', 'National journal, TCI tier 2',         30000, 6),
  ('CONF', 'Indexed Conference', 'Scopus-indexed proceedings',    'Peer-reviewed indexed conference paper',      40000, 7)
on conflict (code) do update set
  name = excluded.name, indexing = excluded.indexing, description = excluded.description,
  max_amount = excluded.max_amount, sort_order = excluded.sort_order;

insert into app_settings (key, value, label) values
  ('org_name',        '"Assumption University"', 'Organisation name'),
  ('fiscal_year',     '"2026"',                  'Active fiscal year'),
  ('currency',        '"THB"',                   'Default currency'),
  ('payment_split',   '[30, 40, 30]',            'Disbursement split (%)'),
  ('submission_open', 'true',                    'Accepting new submissions'),
  ('contact_email',   '"research@au.edu"',       'Research office contact')
on conflict (key) do update set value = excluded.value, label = excluded.label;
