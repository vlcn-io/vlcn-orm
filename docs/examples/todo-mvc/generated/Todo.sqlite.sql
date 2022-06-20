-- SIGNED-SOURCE: <f81866c7e1305b97408dc87348dc3bff>
CREATE TABLE
  IF NOT EXISTS "todo" (
    "id" bigint NOT NULL,
    "listId" bigint NOT NULL,
    "text" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    "completed" bigint,
    primary key ("id")
  )