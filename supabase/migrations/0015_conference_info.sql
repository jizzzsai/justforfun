-- 0015_conference_info.sql
-- AU-R3 Paper Presentation Grant stores the conference details (name, organizer,
-- type domestic/international, country/city, dates, presentation type, paper
-- authors' corresponding author, paper abstract) that Dean and RASSC verify.
-- Additive + nullable; AU-R1/AU-R4 rows leave it null.
alter table public.applications add column if not exists conference_info jsonb;
