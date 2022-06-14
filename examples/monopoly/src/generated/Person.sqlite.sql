-- SIGNED-SOURCE: <0ba0200ab00198aadbeb9e21776f3a9a>
CREATE TABLE
  IF NOT EXISTS "person" (
    "id" bigint NOT NULL,
    "token" text NOT NULL,
    primary key ("id")
  )