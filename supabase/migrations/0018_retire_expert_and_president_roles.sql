alter table public.profiles
  drop constraint if exists profiles_active_roles_check;

alter table public.profiles
  add constraint profiles_active_roles_check
  check (role::text not in ('expert', 'president'));

drop policy if exists apps_read on public.applications;

create policy apps_read on public.applications
  for select to authenticated
  using (
    researcher_id = auth.uid()
    or public.app_role() = any (array['iras','ofm','admin']::public.user_role[])
    or (
      public.app_role() = any (array['dean','committee']::public.user_role[])
      and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
    )
  );
