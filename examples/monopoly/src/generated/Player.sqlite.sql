-- SIGNED-SOURCE: <cf10fb88f80e15eccbfd9f0f54e288e6>
CREATE TABLE
  IF NOT EXISTS "player" (
    "id" bigint NOT NULL,
    "piece" text NOT NULL,
    "ownerId" bigint NOT NULL,
    "gameId" bigint NOT NULL,
    primary key ("id")
  )