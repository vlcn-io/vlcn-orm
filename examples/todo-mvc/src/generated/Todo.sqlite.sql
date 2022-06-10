-- SIGNED-SOURCE: <a0d325361b61cd7a85d13fc62b64a260>
CREATE TABLE
  "todo" (
    "id" bigint,
    "listId" bigint,
    "text" text,
    "created" bigint,
    "modified" bigint,
    "completed" bigint,
    primary key ("id")
  )