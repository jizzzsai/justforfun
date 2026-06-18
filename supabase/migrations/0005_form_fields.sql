-- 0005_form_fields.sql
-- Additive, safe (nullable columns + idempotent setting). Supports the richer
-- submit form: applicant title prefix + AU ID on profiles, project start/end
-- dates on applications (duration auto-derived), and admin-editable budget caps.

alter table public.profiles     add column if not exists name_title text;  -- Mr./Dr./Asst. Prof. Dr. ...
alter table public.profiles     add column if not exists au_id      text;  -- AU staff/teacher ID

alter table public.applications add column if not exists start_date date;
alter table public.applications add column if not exists end_date   date;

-- Budget category caps (% of total). Editable by Admin in Settings so the
-- office can handle the exceptions the policy allows. Order matches the form:
-- [remuneration, equipment, travel, misc].
insert into public.app_settings (key, value, label)
values ('budget_caps',
        '{"remuneration":30,"equipment":50,"travel":40,"misc":20}'::jsonb,
        'Budget category caps (% of total grant)')
on conflict (key) do nothing;
