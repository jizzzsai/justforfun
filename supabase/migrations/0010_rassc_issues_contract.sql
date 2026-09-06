



drop policy if exists contracts_write on public.contracts;
create policy contracts_write on public.contracts for all to authenticated
using  (app_role() = any (array['iras','president','ofm','admin']::user_role[]))
with check (app_role() = any (array['iras','president','ofm','admin']::user_role[]));
