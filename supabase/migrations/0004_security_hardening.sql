









create or replace function public.profiles_guard()
returns trigger language plpgsql security definer set search_path = public as $fn$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.role       is distinct from old.role
     or coalesce(new.faculty,'')  is distinct from coalesce(old.faculty,'')
     or new.is_active is distinct from old.is_active
     or new.email     is distinct from old.email then
    raise exception 'profiles: changing role/faculty/email/is_active is not permitted for non-admin users';
  end if;
  return new;
end;
$fn$;

drop trigger if exists profiles_guard_trg on public.profiles;
create trigger profiles_guard_trg
  before update on public.profiles
  for each row execute function public.profiles_guard();






drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select to authenticated
  using ( id = auth.uid() or public.is_staff() );






drop policy if exists apps_update on public.applications;
create policy apps_update on public.applications
  for update to public
  using (
    ((researcher_id = auth.uid()) and (status = any (array['draft','returned']::app_status[])))
    or (app_role() = any (array['iras','expert','president','ofm','admin']::user_role[]))
    or ((app_role() = any (array['dean','committee']::user_role[]))
        and (faculty = (select p.faculty from public.profiles p where p.id = auth.uid())))
  )
  with check (
    ((researcher_id = auth.uid()) and (status = any (array['draft','submitted']::app_status[])))
    or (app_role() = any (array['iras','expert','president','ofm','admin']::user_role[]))
    or ((app_role() = any (array['dean','committee']::user_role[]))
        and (faculty = (select p.faculty from public.profiles p where p.id = auth.uid())))
  );


drop policy if exists publication_grants_update on public.publication_grants;
create policy publication_grants_update on public.publication_grants
  for update to authenticated
  using (
    ((researcher_id = auth.uid()) and (status = any (array['draft','returned'])))
    or exists (select 1 from public.profiles p where p.id = auth.uid()
               and ( p.role::text = any (array['iras','president','ofm','admin'])
                     or ( p.role::text = any (array['dean','committee'])
                          and coalesce(p.faculty,'') = coalesce(publication_grants.faculty,'') )))
  )
  with check (
    ((researcher_id = auth.uid()) and (status = any (array['draft','submitted'])))
    or exists (select 1 from public.profiles p where p.id = auth.uid()
               and ( p.role::text = any (array['iras','president','ofm','admin'])
                     or ( p.role::text = any (array['dean','committee'])
                          and coalesce(p.faculty,'') = coalesce(publication_grants.faculty,'') )))
  );







create or replace function public.can_access_doc(path text)
returns boolean language plpgsql stable security definer set search_path = public as $fn$
declare seg text; appid uuid; gid uuid;
begin
  if public.is_staff() then return true; end if;
  seg := split_part(path, '/', 1);
  if seg = 'publication_grants' then
    begin gid := split_part(path, '/', 2)::uuid; exception when others then return false; end;
    return exists (select 1 from public.publication_grants g where g.id = gid and g.researcher_id = auth.uid());
  else
    begin appid := seg::uuid; exception when others then return false; end;
    return exists (select 1 from public.applications a where a.id = appid and a.researcher_id = auth.uid());
  end if;
end;
$fn$;

drop policy if exists documents_auth_read    on storage.objects;
drop policy if exists documents_auth_write   on storage.objects;
drop policy if exists documents_auth_update  on storage.objects;
drop policy if exists documents_owner_read   on storage.objects;
drop policy if exists documents_owner_write  on storage.objects;
drop policy if exists documents_owner_update on storage.objects;
drop policy if exists documents_owner_delete on storage.objects;

create policy documents_owner_read on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and public.can_access_doc(name));

create policy documents_owner_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and public.can_access_doc(name));

create policy documents_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and public.can_access_doc(name))
  with check (bucket_id = 'documents' and public.can_access_doc(name));

create policy documents_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and public.can_access_doc(name));
