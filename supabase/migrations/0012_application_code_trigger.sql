







create or replace function public.set_application_code()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  yr text := to_char(now(), 'YYYY');
  nextn int;
begin
  if new.code is null or new.code = '' then
    select coalesce(max((regexp_replace(code, '^RG-' || yr || '-', ''))::int), 0) + 1
      into nextn
      from applications
      where code ~ ('^RG-' || yr || '-[0-9]+$');
    new.code := 'RG-' || yr || '-' || lpad(nextn::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_application_code on public.applications;
create trigger trg_set_application_code
  before insert on public.applications
  for each row execute function public.set_application_code();
