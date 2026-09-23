-- Harden the active AU-R3/AU-R4 portal at the database boundary.
-- Browser controls are only convenience; these rules enforce the same scope
-- when a caller sends requests directly to the Supabase REST API.

-- A user may never promote their own profile or change their faculty scope.
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated with check (
  public.is_admin()
  or (
    id = auth.uid()
    and role::text = 'researcher'
    and is_active
  )
);

drop policy if exists profiles_write on public.profiles;
create policy profiles_write on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Limit profile visibility to the role's real operational scope. IRAS and
-- Admin are university-wide; a Dean is faculty-only; Finance can resolve only
-- researchers whose applications have reached Finance.
create or replace function public.current_user_faculty()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select faculty from public.profiles where id = auth.uid() and is_active;
$$;

create or replace function public.finance_can_view_profile(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.applications a
    where a.researcher_id = target_profile_id
      and a.grant_type in ('au_r3', 'au_r4')
      and a.status in ('approved', 'active', 'completed')
  );
$$;

revoke all on function public.current_user_faculty() from public;
grant execute on function public.current_user_faculty() to authenticated;
revoke all on function public.finance_can_view_profile(uuid) from public;
grant execute on function public.finance_can_view_profile(uuid) to authenticated;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (
  role::text in ('researcher', 'dean', 'iras', 'ofm', 'admin')
  and is_active
  and (
    id = auth.uid()
    or public.app_role() in ('iras', 'admin')
    or (
      public.app_role() = 'dean'
      and coalesce(faculty, '') = coalesce(public.current_user_faculty(), '')
    )
    or (
      public.app_role() = 'ofm'
      and public.finance_can_view_profile(profiles.id)
    )
  )
);

-- Timeline, review, and payment reads follow the same researcher/faculty/
-- university/Finance boundaries as the application itself.
drop policy if exists events_read on public.application_events;
create policy events_read on public.application_events for select to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or public.app_role() in ('iras', 'admin')
        or (
          public.app_role() = 'dean'
          and coalesce(a.faculty, '') = coalesce(public.current_user_faculty(), '')
        )
        or (public.app_role() = 'ofm' and a.status in ('approved', 'active', 'completed'))
      )
  )
);

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or public.app_role() in ('iras', 'admin')
        or (
          public.app_role() = 'dean'
          and coalesce(a.faculty, '') = coalesce(public.current_user_faculty(), '')
        )
      )
  )
);

drop policy if exists pay_read on public.payments;
create policy pay_read on public.payments for select to authenticated using (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        a.researcher_id = auth.uid()
        or public.app_role() in ('iras', 'ofm', 'admin')
        or (
          public.app_role() = 'dean'
          and coalesce(a.faculty, '') = coalesce(public.current_user_faculty(), '')
        )
      )
  )
);

-- A stale AU-R4 record from the retired committee workflow would otherwise
-- have no queue in the current product. Move any such R3/R4 record to IRAS.
insert into public.application_events (
  application_id, actor_id, actor_role, action, from_status, to_status, note
)
select id, null, null, 'Legacy workflow normalized', status, 'iras_review',
       'Moved from the retired review stage to IRAS Verification.'
from public.applications
where grant_type in ('au_r3', 'au_r4')
  and status in ('committee_review', 'dean_sign', 'expert_review', 'president_review');

update public.applications
set status = 'iras_review'
where grant_type in ('au_r3', 'au_r4')
  and status in ('committee_review', 'dean_sign', 'expert_review', 'president_review');

-- Prevent a modified browser request from changing another role's fields or
-- skipping a workflow stage. Admin and trusted service-role operations remain
-- available for support and migrations.
create or replace function public.guard_r3_r4_application_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  caller_role text;
  caller_faculty text;
  old_payload jsonb;
  new_payload jsonb;
begin
  if auth.uid() is null or new.grant_type not in ('au_r3', 'au_r4') then
    return new;
  end if;

  select role::text, faculty
    into caller_role, caller_faculty
  from public.profiles
  where id = auth.uid() and is_active;

  if caller_role = 'admin' then
    return new;
  end if;

  if caller_role = 'researcher' then
    if old.researcher_id <> auth.uid()
       or old.status not in ('draft', 'returned')
       or new.status not in ('draft', 'submitted')
       or new.id is distinct from old.id
       or new.code is distinct from old.code
       or new.researcher_id is distinct from old.researcher_id
       or new.grant_type is distinct from old.grant_type
       or new.approved_amount is distinct from old.approved_amount
       or new.decided_at is distinct from old.decided_at
       or new.created_at is distinct from old.created_at then
      raise exception using errcode = '42501', message = 'Researchers may edit only their own draft or returned application.';
    end if;
    return new;
  end if;

  if caller_role = 'dean' then
    if coalesce(old.faculty, '') <> coalesce(caller_faculty, '')
       or old.status <> 'submitted'
       or new.status not in ('iras_review', 'returned', 'rejected') then
      raise exception using errcode = '42501', message = 'Dean access is limited to submitted applications in the assigned faculty.';
    end if;
    old_payload := to_jsonb(old) - array['status', 'decided_at', 'updated_at'];
    new_payload := to_jsonb(new) - array['status', 'decided_at', 'updated_at'];
    if old_payload is distinct from new_payload then
      raise exception using errcode = '42501', message = 'Dean accounts may record only a workflow decision.';
    end if;
    return new;
  end if;

  if caller_role = 'iras' then
    if old.status <> 'iras_review'
       or new.status not in ('iras_review', 'approved', 'returned', 'rejected') then
      raise exception using errcode = '42501', message = 'IRAS access is limited to applications awaiting IRAS Verification.';
    end if;
    old_payload := to_jsonb(old) - array['status', 'approved_amount', 'decided_at', 'updated_at'];
    new_payload := to_jsonb(new) - array['status', 'approved_amount', 'decided_at', 'updated_at'];
    if old_payload is distinct from new_payload then
      raise exception using errcode = '42501', message = 'IRAS may update only the verified amount and workflow decision.';
    end if;
    return new;
  end if;

  if caller_role = 'ofm' then
    if old.status not in ('approved', 'active')
       or new.status not in ('active', 'completed') then
      raise exception using errcode = '42501', message = 'Finance may update only applications already forwarded to Finance.';
    end if;
    old_payload := to_jsonb(old) - array['status', 'updated_at'];
    new_payload := to_jsonb(new) - array['status', 'updated_at'];
    if old_payload is distinct from new_payload then
      raise exception using errcode = '42501', message = 'Finance may record only the payment workflow status.';
    end if;
    return new;
  end if;

  raise exception using errcode = '42501', message = 'This account is not allowed to update applications.';
end;
$fn$;

drop trigger if exists zz_applications_workflow_guard on public.applications;
create trigger zz_applications_workflow_guard
before update on public.applications
for each row execute function public.guard_r3_r4_application_update();

-- Keep each decision and its timeline record in one transaction.
create or replace function public.transition_r3_r4_application(
  p_application_id uuid,
  p_from_status text,
  p_decision text,
  p_note text default null
)
returns public.applications
language plpgsql
security invoker
set search_path = public
as $fn$
declare
  caller_id uuid := auth.uid();
  caller_role text := public.app_role()::text;
  caller_faculty text;
  target_status public.app_status;
  event_action text;
  app public.applications%rowtype;
begin
  if caller_id is null or caller_role is null then
    raise exception using errcode = '42501', message = 'Your login session has expired.';
  end if;

  select * into app
  from public.applications
  where id = p_application_id
  for update;

  if not found or app.grant_type not in ('au_r3', 'au_r4') then
    raise exception using errcode = '42501', message = 'This application is not available to the signed-in account.';
  end if;
  if app.status::text <> p_from_status then
    raise exception using errcode = '40001', message = 'This application has already moved. Refresh the queue.';
  end if;
  if p_decision in ('return', 'reject') and nullif(btrim(coalesce(p_note, '')), '') is null then
    raise exception using errcode = '23514', message = 'A reason is required for return or rejection.';
  end if;

  select faculty into caller_faculty from public.profiles where id = caller_id and is_active;

  if caller_role = 'dean' and app.status = 'submitted'
     and coalesce(app.faculty, '') = coalesce(caller_faculty, '') then
    if p_decision = 'advance' then target_status := 'iras_review'; event_action := 'Dean approved — forwarded to IRAS';
    elsif p_decision = 'return' then target_status := 'returned'; event_action := 'Returned to researcher';
    elsif p_decision = 'reject' then target_status := 'rejected'; event_action := 'Application rejected';
    else raise exception using errcode = '22023', message = 'Unsupported Dean decision.';
    end if;
  elsif caller_role = 'iras' and app.status = 'iras_review' then
    if p_decision = 'advance' then target_status := 'approved'; event_action := 'IRAS verified — sent to Finance Office';
    elsif p_decision = 'return' then target_status := 'returned'; event_action := 'Returned to researcher';
    elsif p_decision = 'reject' then target_status := 'rejected'; event_action := 'Application rejected';
    else raise exception using errcode = '22023', message = 'Unsupported IRAS decision.';
    end if;
  elsif caller_role = 'ofm' and app.status in ('approved', 'active') and p_decision in ('advance', 'complete') then
    target_status := 'completed';
    event_action := 'Finance completed payment and closed application';
  elsif caller_role = 'admin' then
    if p_decision = 'return' then target_status := 'returned'; event_action := 'Returned to researcher';
    elsif p_decision = 'reject' then target_status := 'rejected'; event_action := 'Application rejected';
    elsif app.status = 'submitted' and p_decision = 'advance' then target_status := 'iras_review'; event_action := 'Dean approved — forwarded to IRAS';
    elsif app.status = 'iras_review' and p_decision = 'advance' then target_status := 'approved'; event_action := 'IRAS verified — sent to Finance Office';
    elsif app.status in ('approved', 'active') and p_decision in ('advance', 'complete') then target_status := 'completed'; event_action := 'Finance completed payment and closed application';
    else raise exception using errcode = '22023', message = 'Unsupported administrator transition.';
    end if;
  else
    raise exception using errcode = '42501', message = 'This role cannot perform the requested workflow transition.';
  end if;

  update public.applications
  set status = target_status,
      decided_at = case when target_status in ('approved', 'rejected') then now() else decided_at end,
      requested_amount = case when grant_type = 'au_r3' and target_status = 'approved' then 3500 else requested_amount end,
      approved_amount = case
        when target_status = 'approved' and grant_type = 'au_r3' then 3500
        when target_status = 'approved' then coalesce(approved_amount, requested_amount)
        else approved_amount
      end,
      budget_breakdown = case
        when grant_type = 'au_r3' and target_status = 'approved' then '[{"item":"Fixed AU-R3 Grant","amount":3500}]'::jsonb
        else budget_breakdown
      end
  where id = p_application_id
  returning * into app;

  insert into public.application_events (
    application_id, actor_id, actor_role, action, from_status, to_status, note
  ) values (
    app.id, caller_id, caller_role::public.user_role, event_action,
    p_from_status::public.app_status, target_status, nullif(btrim(coalesce(p_note, '')), '')
  );

  return app;
end;
$fn$;

revoke all on function public.transition_r3_r4_application(uuid, text, text, text) from public;
grant execute on function public.transition_r3_r4_application(uuid, text, text, text) to authenticated;

-- Direct event inserts are still used for researcher draft/submission entries.
-- Make their actor identity and application scope non-forgeable.
create or replace function public.guard_r3_r4_event_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  caller_role text;
  app public.applications%rowtype;
  caller_faculty text;
begin
  if auth.uid() is null then return new; end if;
  caller_role := public.app_role()::text;
  if caller_role is null then
    raise exception using errcode = '42501', message = 'An active AU-RGMS role is required.';
  end if;
  if caller_role <> 'admin' and (new.actor_id is distinct from auth.uid() or new.actor_role::text is distinct from caller_role) then
    raise exception using errcode = '42501', message = 'Timeline actor details must match the signed-in account.';
  end if;
  if caller_role = 'admin' then return new; end if;

  select * into app from public.applications where id = new.application_id;
  if not found or app.grant_type not in ('au_r3', 'au_r4') or app.status is distinct from new.to_status then
    raise exception using errcode = '42501', message = 'Timeline entries must match the application current status.';
  end if;
  select faculty into caller_faculty from public.profiles where id = auth.uid() and is_active;

  if caller_role = 'researcher' and app.researcher_id = auth.uid() and new.to_status in ('draft', 'submitted') then return new; end if;
  if caller_role = 'dean' and coalesce(app.faculty, '') = coalesce(caller_faculty, '') and new.from_status = 'submitted' then return new; end if;
  if caller_role = 'iras' and new.from_status = 'iras_review' then return new; end if;
  if caller_role = 'ofm' and new.from_status in ('approved', 'active') then return new; end if;

  raise exception using errcode = '42501', message = 'This account cannot add the requested timeline entry.';
end;
$fn$;

drop trigger if exists application_events_actor_guard on public.application_events;
create trigger application_events_actor_guard
before insert on public.application_events
for each row execute function public.guard_r3_r4_event_insert();

drop policy if exists events_insert on public.application_events;
create policy events_insert on public.application_events for insert to authenticated with check (
  actor_id = auth.uid()
  and actor_role::text = public.app_role()::text
  and exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.grant_type in ('au_r3', 'au_r4')
      and (
        (public.app_role() = 'researcher' and a.researcher_id = auth.uid())
        or (
          public.app_role() = 'dean'
          and coalesce(a.faculty, '') = coalesce(public.current_user_faculty(), '')
        )
        or public.app_role() in ('iras', 'ofm', 'admin')
      )
  )
);
