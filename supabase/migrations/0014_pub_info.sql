-- 0014_pub_info.sql
-- AU-R4 Publication Fees & Reward stores the published-article details (journal,
-- indexing, quartile, DOI, publication date, fee paid) that IRAS uses to verify
-- eligibility and compute the reward. Additive + nullable; AU-R1/AU-R3 rows leave
-- it null.
alter table public.applications add column if not exists pub_info jsonb;
