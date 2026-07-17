-- 0011_office_room.sql
alter table public.profiles add column if not exists office_room text;
