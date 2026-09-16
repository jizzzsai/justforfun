-- AU-R3 and AU-R4 authors are descriptive application data only.
-- They must not create account invitations or grant application access.
create or replace function public.sync_application_collaborators()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if new.grant_type in ('au_r3', 'au_r4') then
    delete from public.application_collaborators
    where application_id = new.id;
  end if;

  return new;
end;
$fn$;

delete from public.application_collaborators c
using public.applications a
where a.id = c.application_id
  and a.grant_type in ('au_r3', 'au_r4');
