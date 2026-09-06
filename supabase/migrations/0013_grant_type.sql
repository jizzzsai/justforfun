






alter table public.applications add column if not exists grant_type text not null default 'au_r1';
alter table public.applications add column if not exists co_members  jsonb;

create index if not exists idx_applications_grant_type on public.applications(grant_type);
