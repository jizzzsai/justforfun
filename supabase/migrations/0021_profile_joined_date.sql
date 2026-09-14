alter table public.profiles
  add column if not exists joined_date date;

with saved_dates as (
  select
    researcher_id,
    created_at,
    coalesce(
      nullif(conference_info #>> '{researcherSnapshot,joinedDate}', ''),
      nullif(conference_info ->> 'researcherJoinedDate', ''),
      nullif(pub_info #>> '{researcherSnapshot,joinedDate}', ''),
      nullif(pub_info ->> 'researcherJoinedDate', '')
    ) as joined_date_text
  from public.applications
), latest_saved_date as (
  select distinct on (researcher_id)
    researcher_id,
    joined_date_text::date as joined_date
  from saved_dates
  where joined_date_text ~ '^\d{4}-\d{2}-\d{2}$'
  order by researcher_id, created_at desc
)
update public.profiles p
set joined_date = d.joined_date
from latest_saved_date d
where p.id = d.researcher_id
  and p.joined_date is null;

create or replace function public.profiles_guard()
returns trigger language plpgsql security definer set search_path = public as $fn$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or coalesce(new.faculty,'') is distinct from coalesce(old.faculty,'')
     or coalesce(new.department,'') is distinct from coalesce(old.department,'')
     or coalesce(new.full_name,'') is distinct from coalesce(old.full_name,'')
     or coalesce(new.au_id,'') is distinct from coalesce(old.au_id,'')
     or new.joined_date is distinct from old.joined_date
     or new.is_active is distinct from old.is_active
     or new.email is distinct from old.email then
    raise exception 'profiles: changing identity, role, faculty, email, joined date, or status is not permitted for non-admin users';
  end if;
  return new;
end;
$fn$;
