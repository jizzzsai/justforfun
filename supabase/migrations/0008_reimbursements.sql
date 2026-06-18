-- 0008_reimbursements.sql
-- Third grant type: REIMBURSEMENT ("spend first, claim money back after with
-- receipts"). Flow: researcher submit -> Dean review -> RASSC review -> OFM pay.
create table if not exists public.reimbursements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  researcher_id uuid not null references public.profiles(id) on delete cascade,
  faculty text,
  department text,
  title text not null,
  description text,
  category text,
  requested_amount numeric(12,2) not null default 0,
  approved_amount numeric(12,2),
  status text not null default 'draft',  -- draft|submitted|rassc_review|payment_pending|paid|returned|rejected
  evidence_name text,
  evidence_path text,
  dean_note text,
  review_note text,
  payment_note text,
  submitted_at timestamptz,
  dean_at timestamptz,
  decided_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reimbursements enable row level security;

drop policy if exists reimb_select on public.reimbursements;
create policy reimb_select on public.reimbursements for select to authenticated
using (
  researcher_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid()
       and ( p.role::text = any (array['iras','president','ofm','admin'])
             or ( p.role::text = any (array['dean','committee'])
                  and coalesce(p.faculty,'') = coalesce(reimbursements.faculty,'') )))
);

drop policy if exists reimb_insert on public.reimbursements;
create policy reimb_insert on public.reimbursements for insert to authenticated
with check (researcher_id = auth.uid());

drop policy if exists reimb_update on public.reimbursements;
create policy reimb_update on public.reimbursements for update to authenticated
using (
  (researcher_id = auth.uid() and status = any (array['draft','returned']))
  or exists (select 1 from public.profiles p where p.id = auth.uid()
       and ( p.role::text = any (array['iras','president','ofm','admin'])
             or ( p.role::text = any (array['dean','committee'])
                  and coalesce(p.faculty,'') = coalesce(reimbursements.faculty,'') )))
)
with check (
  (researcher_id = auth.uid() and status = any (array['draft','submitted']))
  or exists (select 1 from public.profiles p where p.id = auth.uid()
       and ( p.role::text = any (array['iras','president','ofm','admin'])
             or ( p.role::text = any (array['dean','committee'])
                  and coalesce(p.faculty,'') = coalesce(reimbursements.faculty,'') )))
);

-- Extend storage access to reimbursement receipts ('reimbursements/<id>/...').
create or replace function public.can_access_doc(path text)
returns boolean language plpgsql stable security definer set search_path = public as $fn$
declare seg text; appid uuid; gid uuid;
begin
  if public.is_staff() then return true; end if;
  seg := split_part(path, '/', 1);
  if seg = 'publication_grants' then
    begin gid := split_part(path, '/', 2)::uuid; exception when others then return false; end;
    return exists (select 1 from public.publication_grants g where g.id = gid and g.researcher_id = auth.uid());
  elsif seg = 'reimbursements' then
    begin gid := split_part(path, '/', 2)::uuid; exception when others then return false; end;
    return exists (select 1 from public.reimbursements r where r.id = gid and r.researcher_id = auth.uid());
  else
    begin appid := seg::uuid; exception when others then return false; end;
    return exists (select 1 from public.applications a where a.id = appid and a.researcher_id = auth.uid());
  end if;
end;
$fn$;
