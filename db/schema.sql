-- Vote tallies for Suriname Spreekt statements.
-- Apply with:
--   wrangler d1 execute suriname_spreekt --remote --file=db/schema.sql
-- Seed values are the original hardcoded counts from src/data/statements.ts,
-- so live numbers continue from where the static data left off.

CREATE TABLE IF NOT EXISTS vote_tallies (
  statement_id TEXT PRIMARY KEY,
  agree    INTEGER NOT NULL DEFAULT 0,
  neutral  INTEGER NOT NULL DEFAULT 0,
  disagree INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO vote_tallies (statement_id, agree, neutral, disagree) VALUES
  ('valuta-stabiliteit',    4821, 612, 1903),
  ('goudinkomsten',         6210, 488,  742),
  ('ov-paramaribo',         3120, 410,  280),
  ('amazone-bescherming',   5102, 220,  612),
  ('diaspora-stem',         2840, 720, 1980),
  ('onderwijs-talen',       3902, 540,  820),
  ('kabinet-jongeren',      2210, 690, 1410),
  ('kleinschalige-landbouw',4502, 380,  510),
  ('kustbescherming',       5910, 410,  320),
  ('gratis-internet',       7102, 240,  380);
