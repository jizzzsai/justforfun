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
