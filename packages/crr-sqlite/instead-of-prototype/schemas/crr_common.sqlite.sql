CREATE TABLE IF NOT EXISTS "crr_db_version" (
  "id" INTEGER PRIMARY KEY CHECK (id = 0),
  "version" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "crr_peer_id" (
  "invariant" INTEGER PRIMARY KEY CHECK (invariant = 0),
  "id" integer NOT NULL
);

INSERT OR IGNORE INTO "crr_db_version" VALUES (0, 0);
-- todo: make this a guid at some point in time.
INSERT OR IGNORE INTO "crr_peer_id" VALUES (0, random());