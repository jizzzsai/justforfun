-- AU-R4 no longer has a Faculty Committee stage.  Move any in-flight AU-R4
-- item from the retired stage to IRAS and keep an audit event for its timeline.
with moved as (
  update public.applications
  set status = 'iras_review'
  where grant_type = 'au_r4'
    and status = 'committee_review'
  returning id
)
insert into public.application_events (
  application_id, actor_role, action, from_status, to_status, note
)
select
  id,
  'admin',
  'AU-R4 workflow updated — forwarded directly to IRAS',
  'committee_review',
  'iras_review',
  'Faculty Committee is not part of the AU-R4 workflow.'
from moved;

-- Faculty Committee accounts work only with AU-R1 applications and files.
drop policy if exists apps_read on public.applications;
create policy apps_read on public.applications for select to authenticated using (
  researcher_id = auth.uid()
  or public.app_role() in ('ofm','admin')
  or (public.app_role() = 'rassc' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'iras' and grant_type in ('au_r3','au_r4'))
  or (
    public.app_role() = 'dean'
    and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
  )
  or (
    public.app_role() = 'committee'
    and coalesce(grant_type, 'au_r1') = 'au_r1'
    and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
  )
);

drop policy if exists apps_update on public.applications;
create policy apps_update on public.applications for update to authenticated using (
  (researcher_id = auth.uid() and status in ('draft','returned'))
  or public.app_role() in ('dean','ofm','admin')
  or (public.app_role() = 'committee' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'rassc' and coalesce(grant_type, 'au_r1') = 'au_r1')
  or (public.app_role() = 'iras' and grant_type in ('au_r3','au_r4'))
) with check (
  researcher_id = auth.uid()
  or public.app_role() in ('dean','ofm','admin')
  or (public.app_role() = 'committee' and coalesce(grant_type, 'au_r1') = 'au_r1')
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
      or (public.app_role() = 'dean' and coalesce(a.faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), ''))
      or (public.app_role() = 'committee' and coalesce(a.grant_type, 'au_r1') = 'au_r1' and coalesce(a.faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), ''))
    )
  )
);

drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to authenticated with check (
  public.app_role() = 'admin'
  or (public.app_role() = 'expert' and reviewer_id = auth.uid())
  or (
    public.app_role() = 'committee'
    and reviewer_id = auth.uid()
    and exists (
      select 1 from public.applications a
      where a.id = application_id
        and coalesce(a.grant_type, 'au_r1') = 'au_r1'
        and coalesce(a.faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
    )
  )
);
