-- Academic is the university's public-facing office name. Keep the existing
-- 'ofm' role key, function signatures, RLS policies, and workflow unchanged.
-- Rename only system-generated wording, never researchers' comments/history.
do $migration$
declare
  function_id regprocedure;
  definition text;
begin
  foreach function_id in array array[
    'public.guard_r3_r4_application_update()'::regprocedure,
    'public.transition_r3_r4_application(uuid,text,text,text)'::regprocedure
  ] loop
    definition := pg_get_functiondef(function_id);
    definition := replace(definition, 'Finance', 'Academic');
    execute definition;
  end loop;
end;
$migration$;

-- Keep personal names unchanged; rename only generic office/test labels.
update public.profiles
set full_name = case when full_name = 'Finance Test' then 'Academic Test' else full_name end,
    faculty = case when faculty in ('Office of Financial Management', 'Finance', 'OFM / Finance', 'OFM') then 'Academic Office' else faculty end,
    department = case when department in ('Finance', 'OFM', 'OFM / Finance', 'Office of Financial Management') then 'Academic' else department end
where role::text = 'ofm';
