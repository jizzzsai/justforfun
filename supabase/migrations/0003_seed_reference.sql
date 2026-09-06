



insert into journal_tiers (code, name, indexing, description, max_amount, sort_order) values
  ('Q1',   'Quartile 1',         'Scopus / Web of Science (Q1)',  'Top-quartile international journal',          150000, 1),
  ('Q2',   'Quartile 2',         'Scopus / Web of Science (Q2)',  'Second-quartile international journal',       120000, 2),
  ('Q3',   'Quartile 3',         'Scopus / Web of Science (Q3)',  'Third-quartile international journal',         90000, 3),
  ('Q4',   'Quartile 4',         'Scopus / Web of Science (Q4)',  'Fourth-quartile international journal',        70000, 4),
  ('TCI1', 'TCI Tier 1',         'Thai-Journal Citation Index (Tier 1)', 'National journal, TCI tier 1',         50000, 5),
  ('TCI2', 'TCI Tier 2',         'Thai-Journal Citation Index (Tier 2)', 'National journal, TCI tier 2',         30000, 6),
  ('CONF', 'Indexed Conference', 'Scopus-indexed proceedings',    'Peer-reviewed indexed conference paper',      40000, 7)
on conflict (code) do update set
  name = excluded.name, indexing = excluded.indexing, description = excluded.description,
  max_amount = excluded.max_amount, sort_order = excluded.sort_order;

insert into app_settings (key, value, label) values
  ('org_name',        '"Assumption University"', 'Organisation name'),
  ('fiscal_year',     '"2026"',                  'Active fiscal year'),
  ('currency',        '"THB"',                   'Default currency'),
  ('payment_split',   '[30, 40, 30]',            'Disbursement split (%)'),
  ('submission_open', 'true',                    'Accepting new submissions'),
  ('contact_email',   '"research@au.edu"',       'Research office contact')
on conflict (key) do update set value = excluded.value, label = excluded.label;
