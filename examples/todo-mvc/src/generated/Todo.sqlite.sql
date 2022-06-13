-- SIGNED-SOURCE: <88f79dbf54c98f138062b0dddd9f7e0b>
CREATE TABLE
  "todo" (
    "id" bigint NOT NULL,
    "listId" bigint NOT NULL,
    "text" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    "completed" bigint,
    primary key ("id")
  )