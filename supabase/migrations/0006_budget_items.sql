-- 0006_budget_items.sql
-- Additive: itemized budget breakdown (free-form purpose + amount lines),
-- kept separate from budget_breakdown (the 4 capped categories).
alter table public.applications add column if not exists budget_items jsonb;
