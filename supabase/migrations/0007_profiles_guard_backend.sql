




create or replace function public.profiles_guard()
returns trigger language plpgsql security definer set search_path = public as $fn$
begin
  if auth.uid() is null or public.is_admin() then
    return new;  -- trusted backend (service role) or an admin
  end if;
  if new.role is distinct from old.role
     or coalesce(new.faculty,'') is distinct from coalesce(old.faculty,'')
     or new.is_active is distinct from old.is_active
     or new.email is distinct from old.email then
    raise exception 'profiles: changing role/faculty/email/is_active is not permitted for non-admin users';
  end if;
  return new;
end;
$fn$;
