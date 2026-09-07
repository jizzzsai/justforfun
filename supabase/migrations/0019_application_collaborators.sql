create table if not exists public.application_collaborators (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  full_name text,
  author_role text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  invited_by uuid references public.profiles(id) on delete set null,
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (application_id, user_id)
);

create index if not exists idx_application_collaborators_user
  on public.application_collaborators(user_id, status, invited_at desc);

alter table public.application_collaborators enable row level security;

create or replace function public.is_app_collaborator(app uuid, include_pending boolean default false)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.application_collaborators c
    where c.application_id = app
      and c.user_id = auth.uid()
      and (c.status = 'accepted' or (include_pending and c.status = 'pending'))
  );
$$;

revoke all on function public.is_app_collaborator(uuid, boolean) from public;
grant execute on function public.is_app_collaborator(uuid, boolean) to authenticated;

drop policy if exists collaborators_read on public.application_collaborators;
create policy collaborators_read on public.application_collaborators
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.owns_app(application_id)
    or public.is_staff()
  );

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
    coalesce(nullif(trim(member->>'name'), ''), p.full_name),
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

drop trigger if exists applications_sync_collaborators on public.applications;
create trigger applications_sync_collaborators
  after insert or update of co_members, status, grant_type, researcher_id
  on public.applications
  for each row execute function public.sync_application_collaborators();

create or replace function public.respond_to_collaboration(p_invitation_id uuid, p_accept boolean)
returns public.application_collaborators
language plpgsql
security definer
set search_path = public
as $fn$
declare
  invitation public.application_collaborators;
begin
  select * into invitation
  from public.application_collaborators
  where id = p_invitation_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Co-author invitation not found.';
  end if;

  if invitation.status <> 'pending' then
    raise exception 'This co-author invitation has already been answered.';
  end if;

  update public.application_collaborators
  set status = case when p_accept then 'accepted' else 'declined' end,
      responded_at = now()
  where id = p_invitation_id
  returning * into invitation;

  insert into public.application_events (
    application_id, actor_id, actor_role, action, note
  ) values (
    invitation.application_id,
    auth.uid(),
    'researcher',
    case when p_accept then 'Co-author invitation accepted' else 'Co-author invitation declined' end,
    coalesce(invitation.full_name, invitation.email) ||
      case when p_accept then ' joined the application as a co-author.' else ' declined the co-author invitation.' end
  );

  return invitation;
end;
$fn$;

revoke all on function public.respond_to_collaboration(uuid, boolean) from public;
grant execute on function public.respond_to_collaboration(uuid, boolean) to authenticated;

drop policy if exists apps_read on public.applications;
create policy apps_read on public.applications
  for select to authenticated
  using (
    researcher_id = auth.uid()
    or public.is_app_collaborator(id, true)
    or public.app_role() = any (array['iras','ofm','admin']::public.user_role[])
    or (
      public.app_role() = any (array['dean','committee']::public.user_role[])
      and coalesce(faculty, '') = coalesce((select p.faculty from public.profiles p where p.id = auth.uid()), '')
    )
  );

drop policy if exists docs_read on public.application_documents;
create policy docs_read on public.application_documents
  for select to authenticated
  using (
    public.is_staff()
    or public.owns_app(application_id)
    or public.is_app_collaborator(application_id, false)
  );

drop policy if exists contracts_read on public.contracts;
create policy contracts_read on public.contracts
  for select to authenticated
  using (
    public.is_staff()
    or public.owns_app(application_id)
    or public.is_app_collaborator(application_id, false)
  );

drop policy if exists pay_read on public.payments;
create policy pay_read on public.payments
  for select to authenticated
  using (
    public.is_staff()
    or public.owns_app(application_id)
    or public.is_app_collaborator(application_id, false)
  );

drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports
  for select to authenticated
  using (
    public.is_staff()
    or public.owns_app(application_id)
    or public.is_app_collaborator(application_id, false)
  );

drop policy if exists events_read on public.application_events;
create policy events_read on public.application_events
  for select to authenticated
  using (
    public.is_staff()
    or public.owns_app(application_id)
    or public.is_app_collaborator(application_id, false)
  );

create or replace function public.can_access_doc(path text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $fn$
declare
  seg text;
  appid uuid;
  gid uuid;
begin
  if public.is_staff() then return true; end if;
  seg := split_part(path, '/', 1);
  if seg = 'publication_grants' then
    begin gid := split_part(path, '/', 2)::uuid; exception when others then return false; end;
    return exists (
      select 1 from public.publication_grants g
      where g.id = gid and g.researcher_id = auth.uid()
    );
  end if;

  begin appid := seg::uuid; exception when others then return false; end;
  return exists (
    select 1 from public.applications a
    where a.id = appid and a.researcher_id = auth.uid()
  ) or public.is_app_collaborator(appid, false);
end;
$fn$;
