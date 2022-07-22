-- you can use an in-mem sqlite db to create the schema and then introspect the schema to generate the other schemas.
-- rather than trying to parse the schema.

CREATE TABLE
  IF NOT EXISTS "todo_crr" (
    "id" integer NOT NULL,
    "listId" integer NOT NULL,
    "listId_v" integer DEFAULT 0,
    "text" text NOT NULL,
    "text_v" integer DEFAULT 0,
    "completed" boolean NOT NULL,
    "completed_v" integer DEFAULT 0,
    "crr_cl" integer DEFAULT 1,
    "crr_update_src" integer DEFAULT 0,
    primary key ("id")
  );

CREATE VIEW
  IF NOT EXISTS "todo" AS SELECT
    "id",
    "listId",
    "text",
    "completed"
  FROM
    "todo_crr"
  WHERE
    "todo_crr"."crr_cl" % 2 = 1;

CREATE TRIGGER IF NOT EXISTS "insert_todo_trig"
  INSTEAD OF INSERT ON "todo"
BEGIN
  -- is there a better way to grab this version?
  -- sucks to use a single incr value across all writes to all tables.
  -- we could do table rather than global db versions...
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  INSERT INTO "todo_crr" (
    "id",
    "listId",
    "listId_v",
    "text",
    "text_v",
    "completed",
    "completed_v",
    "crr_cl",
  ) VALUES (
    NEW."id",
    NEW."listId",
    0,
    NEW."text",
    0,
    NEW."completed",
    0,
    1
  ) ON CONFLICT ("id") DO UPDATE SET
    "listId" = EXCLUDED."listId",
    "listId_v" = CASE WHEN EXCLUDED."listId" != "listId" THEN "listId_v" + 1 ELSE "listId_v" END,
    "text" = EXCLUDED."text",
    "text_v" = CASE WHEN EXCLUDED."text" != "text" THEN "text_v" + 1 ELSE "text_v" END,
    "completed" = EXCLUDED."completed",
    "completed_v" = CASE WHEN EXCLUDED."completed" != "completed" THEN "completed_v" + 1 ELSE "completed_v" END,
    "crr_cl" = CASE WHEN "crr_cl" % 2 = 0 THEN "crr_cl" + 1 ELSE "crr_cl" END,
    "crr_update_src" = 0;
  
  INSERT INTO "todo_vector_clocks" ("vc_peerId", "vc_version", "vc_todoId")
    VALUES ((SELECT "id" FROM "crr_peer_id"), (SELECT "version" FROM "crr_db_version"), NEW."id")
    ON CONFLICT ("vc_peerId", "vc_todoId") DO UPDATE SET
      "vc_version" = EXCLUDED."vc_version";
END;

CREATE TRIGGER IF NOT EXISTS "update_todo_trig"
  INSTEAD OF UPDATE ON "todo"
BEGIN
  -- nit: noops updates update db version :/
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  UPDATE "todo_crr" SET
    "listId" = NEW."listId",
    "listId_v" = CASE WHEN OLD."listId" != NEW."listId" THEN "listId_v" + 1 ELSE "listId_v" END,
    "text" = NEW."text",
    "text_v" = CASE WHEN OLD."text" != NEW."text" THEN "text_v" + 1 ELSE "text_v" END,
    "completed" = NEW."completed",
    "completed_v" = CASE WHEN OLD."completed" != NEW."completed" THEN "completed_v" + 1 ELSE "completed_v" END,
    "crr_update_src" = 0
  WHERE "id" = NEW."id";

  UPDATE "todo_vector_clocks" SET
    "vc_version" = (SELECT "version" FROM "crr_db_version")
  WHERE "vc_peerId" = (SELECT "id" FROM "crr_peer_id") AND "vc_todoId" = NEW."id";
END;

CREATE TRIGGER IF NOT EXISTS "delete_todo_trig"
  INSTEAD OF DELETE ON "todo"
BEGIN
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  UPDATE "todo_crr" SET "crr_cl" = "crr_cl" + 1, "crr_update_src" = 0 WHERE "id" = OLD."id";

  UPDATE "todo_vector_clocks" SET
    "vc_version" = (SELECT "version" FROM "crr_db_version")
  WHERE "vc_peerId" = (SELECT "id" FROM "crr_peer_id") AND "vc_todoId" = OLD."id";
END;

CREATE VIEW
  IF NOT EXISTS "todo_patch" AS SELECT 
    "todo_patch".*,
    json_group_object("vc_peerId", "vc_version") as vector_clock
  FROM "todo_crr"
  JOIN "todo_vector_clocks" ON
    "todo_vector_clocks"."vc_peerId" = (SELECT "id" FROM "crr_peer_id") AND
    "todo_vector_clocks"."vc_todoId" = "todo_crr"."id";

-- we only need insert triggers for the patch since we'll do all patches as upserts.
-- deletes cannot happen as we must keep the causal length record.

CREATE TRIGGER IF NOT EXISTS "insert_todo_patch"
  INSTEAD OF INSERT ON "todo_patch"
BEGIN
-- note: if any column is nullable, null is incomparable so we need to check for null explicitly and take the non-null one.

  INSERT INTO "todo_crr" (
    "id",
    "listId",
    "listId_v",
    "text",
    "text_v",
    "completed",
    "completed_v",
    "crr_cl",
    "crr_update_src"
  ) VALUES (
    NEW."id",
    NEW."listId",
    NEW."listId_v",
    NEW."text",
    NEW."text_v",
    NEW."completed",
    NEW."completed_v",
    NEW."crr_cl",
    1
  ) ON CONFLICT ("id") DO UPDATE SET
    "listId" = CASE
      WHEN EXCLUDED."listId_v" > "listId_v" THEN EXCLUDED."listId"
      WHEN EXCLUDED."listId_v" = "listId_v" THEN
        CASE
          WHEN EXCLUDED."listId" > "listId" THEN EXCLUDED."listId"
          ELSE "listId"
        END
      ELSE "listId"
    END,
    "listId_v" = CASE
      WHEN EXCLUDED."listId_v" > "listId_v" THEN EXCLUDED."listId_v"
      ELSE "listId_v"
    END,
    "text" = CASE
      WHEN EXCLUDED."text_v" > "text_v" THEN EXCLUDED."text"
      WHEN EXCLUDED."text_v" = "text_v" THEN
        CASE
          WHEN EXCLUDED."text" > "text" THEN EXCLUDED."text"
          ELSE "text"
        END
      ELSE "text"
    END,
    "text_v" = CASE
      WHEN EXCLUDED."text_v" > "text_v" THEN EXCLUDED."text_v"
      ELSE "text_v"
    END,
    "completed" = CASE
      WHEN EXCLUDED."completed_v" > "completed_v" THEN EXCLUDED."completed"
      WHEN EXCLUDED."completed_v" = "completed_v" THEN
        CASE
          WHEN EXCLUDED."completed" > "completed" THEN EXCLUDED."completed"
          ELSE "completed"
        END
      ELSE "completed"
    END,
    "completed_v" = CASE
      WHEN EXCLUDED."completed_v" > "completed_v" THEN EXCLUDED."completed_v"
      ELSE "completed_v"
    END,
    "crr_cl" = CASE
      WHEN EXCLUDED."crr_cl" > "crr_cl" THEN EXCLUDED."crr_cl"
      ELSE "crr_cl"
    END,
    "crr_update_src" = 1;

  INSERT INTO "todo_vector_clocks" (
    "vc_peerId",
    "vc_version",
    "vc_todoId"
  ) SELECT "key" as "vc_peerId", "value" as "vc_version", NEW."id" FROM json_each(NEW.vector_clock)
  ON CONFLICT ("vc_peerId", "vc_todoId") DO UPDATE SET
    "vc_version" = CASE WHEN EXCLUDED."vc_version" > "vc_version" THEN EXCLUDED."vc_version" ELSE "vc_version" END;
END;

CREATE TABLE 
  IF NOT EXISTS "todo_vector_clocks" (
    "vc_todoId" integer NOT NULL,
    "vc_peerId" integer NOT NULL,
    "vc_version" integer NOT NULL,
    PRIMARY KEY ("vc_peerId", "vc_todoId")
  );

-- todo: need an index on peerId too so we can find all todos for a given peer
-- of a given version
-- every time a todo is deleted/inserted/updated we should
-- 1. bump the global db version
-- 2. set that to its vector clock entry for this peer