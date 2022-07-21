CREATE TABLE IF NOT EXSITS "crr_db_version" (
  "id" INTEGER PRIMARY KEY CHECK (id = 0)
  "version" integer DEFAULT 0
);

INSERT INTO "crr_db_vserion" ("version") VALUES (0) ON CONFLICT ("id") IGNORE; 