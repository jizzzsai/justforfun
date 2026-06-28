-- 0009_budget_split.sql
-- Per-researcher default budget split (% per category) used to pre-fill the
-- submit form's auto-divide. The admin caps (budget_caps) still bound it.
alter table public.profiles add column if not exists budget_split jsonb;
