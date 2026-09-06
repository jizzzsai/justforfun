



create or replace function public.set_application_code()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  yr text := to_char(now(), 'YYYY');
  prefix text;
  nextn int;
begin
  if new.code is null or new.code = '' then
    prefix := case new.grant_type
                when 'au_r3' then 'AU-R3-'
                when 'au_r4' then 'AU-R4-'
                else 'RG-'
              end;
    select coalesce(max((regexp_replace(code, '^' || prefix || yr || '-', ''))::int), 0) + 1
      into nextn
      from applications
      where code ~ ('^' || prefix || yr || '-[0-9]+$');
    new.code := prefix || yr || '-' || lpad(nextn::text, 3, '0');
  end if;
  return new;
end;
$$;
