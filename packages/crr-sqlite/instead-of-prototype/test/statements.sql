INSERT INTO "todo" (
  "id",
  "listId",
  "text",
  "completed"
) VALUES (
  1,
  1,
  "first todo",
  0
);

UPDATE "todo" SET "listId" = 2 WHERE "id" = 1;

INSERT INTO "todo" (
  "id",
  "listId",
  "text",
  "completed"
) VALUES (
  1,
  2,
  "first todo redux",
  0
);

DELETE FROM "todo" WHERE "id" = 1;

INSERT INTO "todo" (
  "id",
  "listId",
  "text",
  "completed"
) VALUES (
  1,
  2,
  "resurrect",
  0
);

-- todo_patch should not expose:
-- update_src
-- crr_db_v?
INSERT INTO "todo_patch" (
  "id",
  "listId",
  "listId_v",
  "text",
  "text_v",
  "completed",
  "completed_v",
  "crr_cl",
  "crr_db_v",
  "crr_update_src"
) VALUES (
  1,
  3,
  4,
  "foo",
  0,
  1,
  2,
  7,
  0,
  1
);