-- 0013_grant_type.sql
-- Support multiple grant systems (AU-R1 internal research, AU-R3 paper
-- presentation, AU-R4 publication fees) on the same applications table + workflow.
-- grant_type tags which form an application came from; co_members holds AU-R3's
-- collaborative writers/researchers/students. Both are additive and nullable so
-- existing AU-R1 rows keep working (default 'au_r1').

alter table public.applications add column if not exists grant_type text not null default 'au_r1';
alter table public.applications add column if not exists co_members  jsonb;

create index if not exists idx_applications_grant_type on public.applications(grant_type);
