




alter table public.profiles     add column if not exists name_title text;  -- Mr./Dr./Asst. Prof. Dr. ...
alter table public.profiles     add column if not exists au_id      text;  -- AU staff/teacher ID

alter table public.applications add column if not exists start_date date;
alter table public.applications add column if not exists end_date   date;




insert into public.app_settings (key, value, label)
values ('budget_caps',
        '{"remuneration":30,"equipment":50,"travel":40,"misc":20}'::jsonb,
        'Budget category caps (% of total grant)')
on conflict (key) do nothing;
