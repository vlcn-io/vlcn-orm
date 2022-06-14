-- SIGNED-SOURCE: <dd920d5f861b4627b1994a70c6444cd9>
CREATE TABLE
  "player" (
    "id" bigint NOT NULL,
    "piece" text NOT NULL,
    "ownerId" bigint NOT NULL,
    "gameId" bigint NOT NULL,
    primary key ("id")
  )