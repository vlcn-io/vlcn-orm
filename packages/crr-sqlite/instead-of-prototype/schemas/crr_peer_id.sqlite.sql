CREATE TABLE IF NOT EXISTS "crr_peer_id" (
  "invariant" INTEGER PRIMARY KEY CHECK (invariant = 0),
  "id" integer NOT NULL
);

-- todo: make this a guid at some point in time.
INSERT OR IGNORE INTO "crr_peer_id" VALUES (0, random());