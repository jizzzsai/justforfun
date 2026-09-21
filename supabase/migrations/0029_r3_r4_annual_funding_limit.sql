-- One researcher may receive at most 100,000 THB across AU-R3 and AU-R4
-- during one academic year. Applications may be created freely as drafts, but
-- submitted/approved allocations are reserved against the annual balance.

alter table public.applications
  add column if not exists academic_year text;

create or replace function public.normalize_academic_year(raw_year text, reference_date date default current_date)
returns text
language plpgsql
stable
set search_path = public
as $fn$
declare
  start_year integer;
  matched_year text;
begin
  matched_year := substring(coalesce(raw_year, '') from '([0-9]{4})');
  if matched_year is not null then
    start_year := matched_year::integer;
  else
    start_year := extract(year from coalesce(reference_date, current_date))::integer;
    -- AU academic-year labels span June through May (for example 2025/2026).
    if extract(month from coalesce(reference_date, current_date)) < 6 then
      start_year := start_year - 1;
    end if;
  end if;
  return start_year::text || '/' || (start_year + 1)::text;
end;
$fn$;

update public.applications
set academic_year = public.normalize_academic_year(
  coalesce(pub_info ->> 'academicYear', conference_info ->> 'academicYear'),
  case
    when coalesce(conference_info ->> 'presentationDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (conference_info ->> 'presentationDate')::date
    when coalesce(pub_info ->> 'pubDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (pub_info ->> 'pubDate')::date
    when coalesce(pub_info ->> 'acceptDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (pub_info ->> 'acceptDate')::date
    else coalesce(submitted_at, created_at)::date
  end
)
where grant_type in ('au_r3', 'au_r4')
  and academic_year is null;

create index if not exists idx_applications_researcher_academic_year
  on public.applications(researcher_id, academic_year)
  where grant_type in ('au_r3', 'au_r4');

create or replace function public.set_and_check_r3_r4_annual_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  annual_limit constant numeric := 100000;
  other_committed numeric := 0;
  new_amount numeric := 0;
  old_amount numeric := 0;
  new_is_committed boolean := false;
  old_is_committed boolean := false;
  must_check boolean := false;
  details_year text;
  reference_date date;
begin
  if new.grant_type not in ('au_r3', 'au_r4') then
    return new;
  end if;

  details_year := coalesce(new.pub_info ->> 'academicYear', new.conference_info ->> 'academicYear');
  reference_date := case
    when coalesce(new.conference_info ->> 'presentationDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (new.conference_info ->> 'presentationDate')::date
    when coalesce(new.pub_info ->> 'pubDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (new.pub_info ->> 'pubDate')::date
    when coalesce(new.pub_info ->> 'acceptDate', '') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      then (new.pub_info ->> 'acceptDate')::date
    else coalesce(new.submitted_at, new.created_at, now())::date
  end;
  new.academic_year := public.normalize_academic_year(coalesce(new.academic_year, details_year), reference_date);

  new_is_committed := new.status::text in ('submitted', 'committee_review', 'iras_review', 'approved', 'active', 'completed');
  new_amount := greatest(0, coalesce(new.approved_amount, new.requested_amount, 0));

  if tg_op = 'INSERT' then
    must_check := new_is_committed;
  else
    old_is_committed := old.status::text in ('submitted', 'committee_review', 'iras_review', 'approved', 'active', 'completed');
    old_amount := greatest(0, coalesce(old.approved_amount, old.requested_amount, 0));
    must_check := new_is_committed and (
      not old_is_committed
      or new.researcher_id is distinct from old.researcher_id
      or new.academic_year is distinct from old.academic_year
      or new_amount > old_amount
    );
  end if;

  if not must_check then
    return new;
  end if;

  -- Serialize submissions for one researcher/year so two tabs cannot reserve
  -- the same remaining balance at the same time.
  perform pg_advisory_xact_lock(hashtextextended(new.researcher_id::text || ':' || new.academic_year, 0));

  select coalesce(sum(greatest(0, coalesce(a.approved_amount, a.requested_amount, 0))), 0)
  into other_committed
  from public.applications a
  where a.researcher_id = new.researcher_id
    and a.grant_type in ('au_r3', 'au_r4')
    and a.academic_year = new.academic_year
    and a.status::text in ('submitted', 'committee_review', 'iras_review', 'approved', 'active', 'completed')
    and (tg_op = 'INSERT' or a.id <> new.id);

  if other_committed + new_amount > annual_limit then
    raise exception using
      errcode = '23514',
      message = format(
        'Academic-year funding limit exceeded. %s already has %s THB committed for %s; only %s THB remains from the 100,000 THB AU-R3/AU-R4 limit.',
        new.researcher_id,
        trim(to_char(other_committed, 'FM999,999,990')),
        new.academic_year,
        trim(to_char(greatest(0, annual_limit - other_committed), 'FM999,999,990'))
      );
  end if;

  return new;
end;
$fn$;

drop trigger if exists applications_r3_r4_annual_limit on public.applications;
create trigger applications_r3_r4_annual_limit
before insert or update of researcher_id, grant_type, status, requested_amount, approved_amount, academic_year, pub_info, conference_info
on public.applications
for each row execute function public.set_and_check_r3_r4_annual_limit();

