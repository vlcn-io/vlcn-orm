-- SIGNED-SOURCE: <9ce79b1a8eb50df0025f9be3de0199d6>
CREATE TABLE
  IF NOT EXISTS "user" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    primary key ("id")
  )