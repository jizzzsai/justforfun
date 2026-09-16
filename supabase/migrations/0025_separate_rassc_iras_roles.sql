drop policy if exists apps_read on public.applications;
create policy apps_read on public.applications for select to authenticated using (
  researcher_id = auth.uid()
  or public.app_role() in ('ofm','admin')
  or (public.app_role() = 'rassc' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'iras' and grant_type in ('au_r3','au_r4'))
  or (
    public.app_role() in ('dean','committee')
    and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
  )
);

drop policy if exists apps_update on public.applications;
create policy apps_update on public.applications for update to authenticated using (
  (researcher_id = auth.uid() and status in ('draft','returned'))
  or public.app_role() in ('dean','committee','ofm','admin')
  or (public.app_role() = 'rassc' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'iras' and grant_type in ('au_r3','au_r4'))
) with check (
  researcher_id = auth.uid()
  or public.app_role() in ('dean','committee','ofm','admin')
  or (public.app_role() = 'rassc' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'iras' and grant_type in ('au_r3','au_r4'))
);

drop policy if exists docs_read on public.application_documents;
create policy docs_read on public.application_documents for select to authenticated using (
  public.owns_app(application_id)
  or public.app_role() in ('ofm','admin')
  or exists (
    select 1 from public.applications a where a.id = application_id and (
      (public.app_role() = 'rassc' and coalesce(a.grant_type, 'au_r1') = 'au_r1')
      or (public.app_role() = 'iras' and a.grant_type in ('au_r3','au_r4'))
      or (public.app_role() in ('dean','committee') and coalesce(a.faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), ''))
    )
  )
);

drop policy if exists screen_write on public.screenings;
create policy screen_write on public.screenings for insert to authenticated
with check (public.app_role() in ('dean','rassc','iras','admin'));

drop policy if exists contracts_write on public.contracts;
create policy contracts_write on public.contracts for all to authenticated
using (public.app_role() in ('rassc','ofm','admin'))
with check (public.app_role() in ('rassc','ofm','admin'));

drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update to authenticated
using (public.owns_app(application_id) or public.app_role() in ('rassc','committee','admin'))
with check (public.owns_app(application_id) or public.app_role() in ('rassc','committee','admin'));
