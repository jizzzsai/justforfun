-- One AU-R1 application has exactly one database row for each Finance phase.
-- Preserve a paid row when cleaning up historical duplicates, then keep the
-- newest remaining row for groups that have never been paid.
with ranked_payments as (
  select
    id,
    row_number() over (
      partition by application_id, instalment
      order by
        case status::text
          when 'paid' then 0
          when 'scheduled' then 1
          else 2
        end,
        paid_at desc nulls last,
        created_at desc,
        id
    ) as duplicate_rank
  from public.payments
)
delete from public.payments p
using ranked_payments r
where p.id = r.id
  and r.duplicate_rank > 1;

create unique index if not exists payments_application_instalment_unique
  on public.payments (application_id, instalment);
