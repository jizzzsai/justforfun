-- Retire AU-R1 from the production portal without deleting its historical data.
-- The active product now contains only AU-R3 and AU-R4, reviewed by Dean,
-- IRAS and Finance. Former Committee and RASSC accounts are deactivated.

update public.profiles
set is_active = false
where role::text in ('committee', 'rassc');

-- All existing policies call app_role(); inactive and retired accounts now
-- resolve to no role even if an old browser session still exists.
create or replace function public.app_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles
  where id = auth.uid()
    and is_active
    and role::text in ('researcher', 'dean', 'iras', 'ofm', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active);
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role::text in ('dean', 'iras', 'ofm', 'admin')
  );
$$;

drop policy if exists apps_read on public.applications;
create policy apps_read on public.applications for select to authenticated using (
  grant_type in ('au_r3', 'au_r4')
  and (
    researcher_id = auth.uid()
    or public.app_role() = 'admin'
    or (public.app_role() = 'iras')
    or (public.app_role() = 'ofm' and status in ('approved', 'active', 'completed'))
    or (
      public.app_role() = 'dean'
      and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid() and p.is_active), '')
    )
  )
);

drop policy if exists apps_insert on public.applications;
create policy apps_insert on public.applications for insert to authenticated with check (
  grant_type in ('au_r3', 'au_r4')
  and (researcher_id = auth.uid() or public.app_role() = 'admin')
);

drop policy if exists apps_update on public.applications;
create policy apps_update on public.applications for update to authenticated using (
  grant_type in ('au_r3', 'au_r4')
  and (
    (researcher_id = auth.uid() and status in ('draft', 'returned'))
    or public.app_role() in ('iras', 'admin')
    or (
      public.app_role() = 'dean'
      and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid() and p.is_active), '')
    )
    or (public.app_role() = 'ofm' and status in ('approved', 'active', 'completed'))
  )
) with check (
  grant_type in ('au_r3', 'au_r4')
  and (
    researcher_id = auth.uid()
    or public.app_role() in ('iras', 'admin')
    or (
      public.app_role() = 'dean'
      and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid() and p.is_active), '')
    )
    or (public.app_role() = 'ofm' and status in ('approved', 'active', 'completed'))
  )
);

drop policy if exists apps_delete on public.applications;
create policy apps_delete on public.applications for delete to authenticated using (
  grant_type in ('au_r3', 'au_r4')
  and ((researcher_id = auth.uid() and status = 'draft') or public.app_role() = 'admin')
);

drop policy if exists docs_read on public.application_documents;
create policy docs_read on public.application_documents for select to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or public.app_role() in ('iras', 'admin')
        or (public.app_role() = 'ofm' and a.status in ('approved', 'active', 'completed'))
        or (
          public.app_role() = 'dean'
          and coalesce(a.faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid() and p.is_active), '')
        )
      )
  )
);

drop policy if exists docs_write on public.application_documents;
create policy docs_write on public.application_documents for all to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (a.researcher_id = auth.uid() or public.app_role() = 'admin')
  )
) with check (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (a.researcher_id = auth.uid() or public.app_role() = 'admin')
  )
);

create or replace function public.can_access_doc(path text)
returns boolean language plpgsql stable security definer set search_path = public as $fn$
declare appid uuid; caller_role text; caller_faculty text;
begin
  begin appid := split_part(path, '/', 1)::uuid; exception when others then return false; end;
  select role::text, faculty into caller_role, caller_faculty
  from public.profiles where id = auth.uid() and is_active;
  if caller_role is null or caller_role not in ('researcher', 'dean', 'iras', 'ofm', 'admin') then return false; end if;
  return exists (
    select 1 from public.applications a
    where a.id = appid
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or caller_role in ('iras', 'admin')
        or (caller_role = 'ofm' and a.status in ('approved', 'active', 'completed'))
        or (caller_role = 'dean' and coalesce(a.faculty, '') = coalesce(caller_faculty, ''))
      )
  );
end;
$fn$;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (
  role::text in ('researcher', 'dean', 'iras', 'ofm', 'admin')
  and is_active
  and (
    id = auth.uid()
    or public.app_role() in ('dean', 'iras', 'ofm', 'admin')
  )
);

drop policy if exists events_read on public.application_events;
create policy events_read on public.application_events for select to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or public.app_role() in ('dean', 'iras', 'admin')
        or (public.app_role() = 'ofm' and a.status in ('approved', 'active', 'completed'))
      )
  )
);

drop policy if exists events_insert on public.application_events;
create policy events_insert on public.application_events for insert to authenticated with check (
  exists (select 1 from public.applications a where a.id = application_id and a.grant_type in ('au_r3', 'au_r4'))
  and (actor_id = auth.uid() or actor_id is null or public.app_role() = 'admin')
  and public.app_role() in ('researcher', 'dean', 'iras', 'ofm', 'admin')
);

drop policy if exists pay_read on public.payments;
create policy pay_read on public.payments for select to authenticated using (
  exists (
    select 1 from public.applications a where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (a.researcher_id = auth.uid() or public.app_role() in ('ofm', 'admin'))
  )
);

drop policy if exists pay_write on public.payments;
create policy pay_write on public.payments for all to authenticated using (
  public.app_role() in ('ofm', 'admin')
  and exists (select 1 from public.applications a where a.id = application_id and a.grant_type in ('au_r3', 'au_r4'))
) with check (
  public.app_role() in ('ofm', 'admin')
  and exists (select 1 from public.applications a where a.id = application_id and a.grant_type in ('au_r3', 'au_r4'))
);

-- Milestone reports belonged to the retired staged-payment workflow.
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select to authenticated using (false);
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to authenticated with check (false);
drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update to authenticated using (false) with check (false);

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select to authenticated using (
  exists (
    select 1 from public.applications a where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (a.researcher_id = auth.uid() or public.app_role() in ('dean', 'iras', 'admin'))
  )
);
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to authenticated with check (public.app_role() = 'admin');
