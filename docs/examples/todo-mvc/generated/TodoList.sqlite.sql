-- SIGNED-SOURCE: <aba395c4f02a46c588bb67fd28bd8949>
CREATE TABLE
  IF NOT EXISTS "todolist" (
    "id" bigint NOT NULL,
    "filter" varchar(255) NOT NULL,
    "editing" bigint,
    primary key ("id")
  )