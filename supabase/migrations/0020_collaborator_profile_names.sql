create or replace function public.sync_application_collaborators()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if new.grant_type not in ('au_r3', 'au_r4') then
    delete from public.application_collaborators where application_id = new.id;
    return new;
  end if;

  if new.status = 'draft' then
    return new;
  end if;

  delete from public.application_collaborators c
  where c.application_id = new.id
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(new.co_members, '[]'::jsonb)) member
      join public.profiles p
        on lower(p.email) = lower(trim(member->>'email'))
      where p.id = c.user_id
        and p.id <> new.researcher_id
        and p.role = 'researcher'
        and p.is_active
    );

  insert into public.application_collaborators (
    application_id, user_id, email, full_name, author_role, invited_by
  )
  select
    new.id,
    p.id,
    lower(p.email),
    coalesce(nullif(trim(p.full_name), ''), nullif(trim(member->>'name'), ''), p.email),
    coalesce(nullif(trim(member->>'type'), ''), nullif(trim(member->>'kind'), ''), 'Co-author'),
    new.researcher_id
  from jsonb_array_elements(coalesce(new.co_members, '[]'::jsonb)) member
  join public.profiles p
    on lower(p.email) = lower(trim(member->>'email'))
  where p.id <> new.researcher_id
    and p.role = 'researcher'
    and p.is_active
  on conflict (application_id, user_id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        author_role = excluded.author_role,
        invited_by = excluded.invited_by;

  return new;
end;
$fn$;

update public.application_collaborators c
set email = lower(p.email),
    full_name = coalesce(nullif(trim(p.full_name), ''), p.email)
from public.profiles p
where p.id = c.user_id;
