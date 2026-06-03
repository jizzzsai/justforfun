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
