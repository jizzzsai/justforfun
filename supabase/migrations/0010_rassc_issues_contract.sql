-- 0010_rassc_issues_contract.sql
-- AU-R1 flow removes the Vice President; RASSC now gives the final approval,
-- which auto-issues the grant contract. Allow role 'iras' (RASSC) to write
-- contracts (previously president/ofm/admin only).
drop policy if exists contracts_write on public.contracts;
create policy contracts_write on public.contracts for all to authenticated
using  (app_role() = any (array['iras','president','ofm','admin']::user_role[]))
with check (app_role() = any (array['iras','president','ofm','admin']::user_role[]));
